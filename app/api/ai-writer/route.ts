import OpenAI from "openai";

export const runtime = "nodejs";

const articleSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    summary: { type: "string" },
    introduction: { type: "string" },
    sections: {
      type: "array",
      minItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
        },
        required: ["heading", "content"],
      },
    },
    faq: {
      type: "array",
      minItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
      },
    },
    sources: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          url: { type: "string" },
        },
        required: ["name", "url"],
      },
    },
    lastChecked: {
      type: "string",
      description: "Date in YYYY-MM-DD format",
    },
    status: {
      type: "string",
      enum: ["draft"],
    },
  },
  required: [
    "title",
    "slug",
    "summary",
    "introduction",
    "sections",
    "faq",
    "sources",
    "lastChecked",
    "status",
  ],
} as const;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function sourceDomains(sources: string) {
  const domains = new Set<string>();

  for (const match of sources.matchAll(/https?:\/\/[^\s,]+/g)) {
    try {
      domains.add(new URL(match[0]).hostname);
    } catch {
      // Free-form source notes do not need to be URLs.
    }
  }

  return Array.from(domains).slice(0, 20);
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local and restart the development server.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();

    const topic = clean(body.topic, 200);
    const category = clean(body.category, 100);
    const sources = clean(body.sources, 12000);
    const instructions = clean(body.instructions, 3000);
    const language = clean(body.language, 50) || "English";

    const allowedDomains = sourceDomains(sources);
    const today = new Date().toISOString().slice(0, 10);

    if (!topic || !category || !sources) {
      return Response.json(
        {
          error: "Topic, category and sources are required.",
        },
        { status: 400 },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-5.6-terra",

      reasoning: {
        effort: "low",
      },

      tools: allowedDomains.length
        ? [
            {
              type: "web_search",
              filters: {
                allowed_domains: allowedDomains,
              },
              search_context_size: "medium",
            },
          ]
        : undefined,

      instructions: [
        "You are the editorial assistant for GoMaltaNow, a practical Malta travel and relocation guide.",
        "Write a clear, useful draft in the requested language and return only the requested structured output.",
        "Use only facts supported by the supplied sources or source excerpts.",
        "Never invent rules, prices, dates, services, quotations or URLs.",
        "When a detail is not supported, omit it or say that it requires verification.",
        "Keep legal, residency, health and financial information cautious and suitable for human review.",
        `Create a lowercase kebab-case slug. Set status to draft and lastChecked to ${today}.`,
        allowedDomains.length
          ? "Use web search when needed, but search only the approved source domains configured for this request."
          : "The supplied source excerpts are the complete source material for this request.",
      ].join(" "),

      input: [
        `Topic: ${topic}`,
        `Category: ${category}`,
        `Language: ${language}`,
        `Editorial instructions: ${
          instructions ||
          "Use a clear, friendly and practical GoMaltaNow tone."
        }`,
        "",
        "Approved sources and source material:",
        sources,
      ].join("\n"),

      text: {
        verbosity: "medium",
        format: {
          type: "json_schema",
          name: "gomaltanow_article_draft",
          strict: true,
          schema: articleSchema,
        },
      },
    });

    if (!response.output_text) {
      throw new Error("The model returned an empty response.");
    }

    return Response.json({
      draft: JSON.parse(response.output_text),
    });
  } catch (error) {
    console.error("AI Writer generation failed", error);

    const message =
      error instanceof OpenAI.APIError
        ? error.message
        : "The draft could not be generated. Please try again.";

    return Response.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}