import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type MonitoringSource = {
  id: string;
  name: string;
  url: string;
  category: string;
  audience: string;
  section_slug: string;
  last_content_hash: string | null;
  last_content_summary: string | null;
};

type SnapshotRow = {
  id: string;
  content_summary: string;
};

type AiAssessment = {
  shouldCreateArticle: boolean;
  changeType:
    | "new-page"
    | "content-update"
    | "rule-change"
    | "price-change"
    | "deadline-change"
    | "service-update"
    | "announcement"
    | "other";
  importance: "low" | "medium" | "high" | "critical";
  updateTitle: string;
  updateSummary: string;
  article: {
    title: string;
    slug: string;
    summary: string;
    introduction: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
    sources: Array<{
      name: string;
      url: string;
    }>;
  };
};

const assessmentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shouldCreateArticle: {
      type: "boolean",
    },
    changeType: {
      type: "string",
      enum: [
        "new-page",
        "content-update",
        "rule-change",
        "price-change",
        "deadline-change",
        "service-update",
        "announcement",
        "other",
      ],
    },
    importance: {
      type: "string",
      enum: ["low", "medium", "high", "critical"],
    },
    updateTitle: {
      type: "string",
    },
    updateSummary: {
      type: "string",
    },
    article: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: {
          type: "string",
        },
        slug: {
          type: "string",
        },
        summary: {
          type: "string",
        },
        introduction: {
          type: "string",
        },
        sections: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              heading: {
                type: "string",
              },
              content: {
                type: "string",
              },
            },
            required: ["heading", "content"],
          },
        },
        faq: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: {
                type: "string",
              },
              answer: {
                type: "string",
              },
            },
            required: ["question", "answer"],
          },
        },
        sources: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: {
                type: "string",
              },
              url: {
                type: "string",
              },
            },
            required: ["name", "url"],
          },
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
      ],
    },
  },
  required: [
    "shouldCreateArticle",
    "changeType",
    "importance",
    "updateTitle",
    "updateSummary",
    "article",
  ],
} as const;

function normalizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function createContentHash(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function createSummary(content: string) {
  const maximumLength = 12000;

  if (content.length <= maximumLength) {
    return content;
  }

  const firstPart = content.slice(0, 8000);
  const finalPart = content.slice(-4000);

  return `${firstPart}\n\n[CONTENT OMITTED]\n\n${finalPart}`;
}

function extractPageTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  if (!match) {
    return null;
  }

  return normalizeHtml(match[1]).slice(0, 300) || null;
}

function isAuthorized(request: NextRequest) {
  const expectedSecret = process.env.MONITORING_CRON_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const providedSecret = authorization.slice(7);

  return providedSecret === expectedSecret;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function cleanText(value: unknown, maximumLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maximumLength)
    : "";
}

function validArticle(assessment: AiAssessment) {
  const article = assessment.article;

  return (
    assessment.shouldCreateArticle &&
    cleanText(article.title, 200).length > 0 &&
    cleanText(article.summary, 1000).length > 0 &&
    cleanText(article.introduction, 5000).length > 0 &&
    Array.isArray(article.sections) &&
    article.sections.length >= 2 &&
    Array.isArray(article.faq) &&
    article.faq.length >= 2 &&
    Array.isArray(article.sources) &&
    article.sources.length >= 1
  );
}

function getAllowedDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function assessChangeWithAi(params: {
  openai: OpenAI;
  source: MonitoringSource;
  previousContent: string;
  currentContent: string;
  today: string;
}) {
  const {
    openai,
    source,
    previousContent,
    currentContent,
    today,
  } = params;

  const allowedDomain = getAllowedDomain(source.url);

  const response = await openai.responses.create({
    model: "gpt-5.6-terra",

    reasoning: {
      effort: "low",
    },

    tools: allowedDomain
      ? [
          {
            type: "web_search",
            filters: {
              allowed_domains: [allowedDomain],
            },
            search_context_size: "medium",
          },
        ]
      : undefined,

    instructions: [
      "You are the monitoring and editorial system for GoMaltaNow.",
      "GoMaltaNow is a practical website about travelling to Malta and moving to Malta.",
      "Compare the previous content with the current content from an official source.",
      "Decide whether the change is meaningful enough to justify a new article.",
      "Ignore cookie banners, menus, timestamps, rotating banners, formatting changes, accessibility text, technical markup and other irrelevant page changes.",
      "An article should be created only for a meaningful new rule, changed procedure, changed requirement, changed deadline, changed fee, changed public service, important announcement or other material information useful to visitors or residents.",
      "Never invent facts, rules, dates, prices, requirements, quotations or URLs.",
      "Use only information supported by the official source.",
      "Use web search only within the approved official domain when additional verification is needed.",
      "The article must be written in clear international English.",
      "The article must explain what changed, who is affected and what practical action the reader should take.",
      "Legal, residency, employment, health and financial information must remain cautious and suitable for human review.",
      "Do not claim that a law has changed unless the supplied official material clearly supports that conclusion.",
      "When the change is not meaningful, set shouldCreateArticle to false and return empty article fields and empty article arrays.",
      "When the change is meaningful, create at least two useful sections and at least two FAQ entries.",
      `The current verification date is ${today}.`,
      "Return only the requested structured output.",
    ].join(" "),

    input: [
      `Official source name: ${source.name}`,
      `Official source URL: ${source.url}`,
      `Assigned category: ${source.category}`,
      `Assigned audience: ${source.audience}`,
      `Assigned website section: ${source.section_slug}`,
      "",
      "PREVIOUS CONTENT:",
      previousContent,
      "",
      "CURRENT CONTENT:",
      currentContent,
    ].join("\n"),

    text: {
      verbosity: "medium",
      format: {
        type: "json_schema",
        name: "gomaltanow_detected_update_assessment",
        strict: true,
        schema: assessmentSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("The AI returned an empty assessment.");
  }

  return JSON.parse(response.output_text) as AiAssessment;
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return Response.json(
      {
        error: "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 503 },
    );
  }

  if (!process.env.SUPABASE_SECRET_KEY) {
    return Response.json(
      {
        error: "SUPABASE_SECRET_KEY is not configured.",
      },
      { status: 503 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error: "OPENAI_API_KEY is not configured.",
      },
      { status: 503 },
    );
  }

  if (!process.env.MONITORING_CRON_SECRET) {
    return Response.json(
      {
        error: "MONITORING_CRON_SECRET is not configured.",
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return Response.json(
      {
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { data: sources, error: sourcesError } = await supabase
    .from("monitoring_sources")
    .select(
      [
        "id",
        "name",
        "url",
        "category",
        "audience",
        "section_slug",
        "last_content_hash",
        "last_content_summary",
      ].join(","),
    )
    .eq("is_active", true)
    .returns<MonitoringSource[]>();

  if (sourcesError) {
    console.error("Could not load monitoring sources", sourcesError);

    return Response.json(
      {
        error: "Could not load monitoring sources.",
        details: sourcesError.message,
      },
      { status: 500 },
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const results: Array<{
    source: string;
    url: string;
    status:
      | "first-snapshot"
      | "unchanged"
      | "ignored-change"
      | "draft-created"
      | "changed-without-draft"
      | "failed";
    articleTitle?: string;
    articleId?: string;
    message?: string;
  }> = [];

  for (const source of sources ?? []) {
    try {
      const pageResponse = await fetch(source.url, {
        headers: {
          "User-Agent":
            "GoMaltaNow Monitoring Bot/1.0 (+https://gomaltanow.com)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-GB,en;q=0.9",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      });

      if (!pageResponse.ok) {
        throw new Error(
          `The website returned HTTP ${pageResponse.status}.`,
        );
      }

      const html = await pageResponse.text();
      const normalizedContent = normalizeHtml(html);

      if (normalizedContent.length < 100) {
        throw new Error(
          "The page did not contain enough readable content.",
        );
      }

      const contentHash = createContentHash(normalizedContent);
      const contentSummary = createSummary(normalizedContent);
      const pageTitle = extractPageTitle(html);

      const hasPreviousSnapshot = Boolean(source.last_content_hash);
      const hasChanged =
        hasPreviousSnapshot &&
        source.last_content_hash !== contentHash;

      const { data: snapshot, error: snapshotError } = await supabase
        .from("source_snapshots")
        .insert({
          source_id: source.id,
          content_hash: contentHash,
          content_summary: contentSummary,
          page_title: pageTitle,
          checked_url: source.url,
        })
        .select("id")
        .single();

      if (snapshotError) {
        throw new Error(
          `Could not save the snapshot: ${snapshotError.message}`,
        );
      }

      if (!hasPreviousSnapshot) {
        const now = new Date().toISOString();

        const { error: sourceUpdateError } = await supabase
          .from("monitoring_sources")
          .update({
            last_checked_at: now,
            last_content_hash: contentHash,
            last_content_summary: contentSummary,
            updated_at: now,
          })
          .eq("id", source.id);

        if (sourceUpdateError) {
          throw new Error(
            `Could not update the monitoring source: ${sourceUpdateError.message}`,
          );
        }

        results.push({
          source: source.name,
          url: source.url,
          status: "first-snapshot",
        });

        continue;
      }

      if (!hasChanged) {
        const now = new Date().toISOString();

        const { error: sourceUpdateError } = await supabase
          .from("monitoring_sources")
          .update({
            last_checked_at: now,
            updated_at: now,
          })
          .eq("id", source.id);

        if (sourceUpdateError) {
          throw new Error(
            `Could not update the monitoring source: ${sourceUpdateError.message}`,
          );
        }

        results.push({
          source: source.name,
          url: source.url,
          status: "unchanged",
        });

        continue;
      }

      const { data: previousSnapshot, error: previousSnapshotError } =
        await supabase
          .from("source_snapshots")
          .select("id, content_summary")
          .eq("source_id", source.id)
          .neq("id", snapshot.id)
          .order("checked_at", { ascending: false })
          .limit(1)
          .maybeSingle<SnapshotRow>();

      if (previousSnapshotError) {
        throw new Error(
          `Could not load the previous snapshot: ${previousSnapshotError.message}`,
        );
      }

      const previousContent =
        previousSnapshot?.content_summary ||
        source.last_content_summary ||
        "";

      const assessment = await assessChangeWithAi({
        openai,
        source,
        previousContent,
        currentContent: contentSummary,
        today,
      });

      const detectedUpdateTitle =
        cleanText(assessment.updateTitle, 300) ||
        `Update detected on ${source.name}`;

      const detectedUpdateSummary =
        cleanText(assessment.updateSummary, 5000) ||
        "The monitored official source has changed and requires review.";

      const shouldCreateArticle = validArticle(assessment);

      const { data: detectedUpdate, error: detectedUpdateError } =
        await supabase
          .from("detected_updates")
          .insert({
            source_id: source.id,
            previous_snapshot_id: previousSnapshot?.id ?? null,
            current_snapshot_id: snapshot.id,
            title: detectedUpdateTitle,
            summary: detectedUpdateSummary,
            change_type: assessment.changeType,
            importance: assessment.importance,
            category: source.category,
            audience: source.audience,
            section_slug: source.section_slug,
            status: shouldCreateArticle
              ? "detected"
              : "ignored",
            reviewed_at: shouldCreateArticle
              ? null
              : new Date().toISOString(),
          })
          .select("id")
          .single();

      if (detectedUpdateError) {
        throw new Error(
          `Could not save the detected update: ${detectedUpdateError.message}`,
        );
      }

      let articleId: string | undefined;
      let articleTitle: string | undefined;

      if (shouldCreateArticle) {
        const article = assessment.article;

        const baseSlug =
          normalizeSlug(article.slug) ||
          normalizeSlug(article.title) ||
          `malta-update-${today}`;

        let finalSlug = `${baseSlug}-${today}`;

        const articlePayload = {
          title: cleanText(article.title, 300),
          slug: finalSlug,
          summary: cleanText(article.summary, 2000),
          introduction: cleanText(article.introduction, 12000),

          sections: article.sections.map((section) => ({
            heading: cleanText(section.heading, 300),
            content: cleanText(section.content, 20000),
          })),

          faq: article.faq.map((item) => ({
            question: cleanText(item.question, 500),
            answer: cleanText(item.answer, 5000),
          })),

          sources: article.sources.map((item) => ({
            name:
              cleanText(item.name, 300) || source.name,
            url:
              cleanText(item.url, 2000) || source.url,
          })),

          category: source.category,
          language: "English",
          audience: source.audience,
          section_slug: source.section_slug,
          status: "draft",
          last_checked: today,
          detected_update_id: detectedUpdate.id,
        };

        let articleInsert = await supabase
          .from("articles")
          .insert(articlePayload)
          .select("id, title")
          .single();

        if (
          articleInsert.error &&
          articleInsert.error.code === "23505"
        ) {
          finalSlug = `${baseSlug}-${today}-${detectedUpdate.id.slice(0, 8)}`;

          articleInsert = await supabase
            .from("articles")
            .insert({
              ...articlePayload,
              slug: finalSlug,
            })
            .select("id, title")
            .single();
        }

        if (articleInsert.error) {
          throw new Error(
            `Could not save the article draft: ${articleInsert.error.message}`,
          );
        }

        articleId = articleInsert.data.id;
        articleTitle = articleInsert.data.title;

        const { error: updateDetectedUpdateError } = await supabase
          .from("detected_updates")
          .update({
            status: "article-created",
            article_id: articleId,
          })
          .eq("id", detectedUpdate.id);

        if (updateDetectedUpdateError) {
          throw new Error(
            `The article was saved, but its update record could not be linked: ${updateDetectedUpdateError.message}`,
          );
        }
      }

      const now = new Date().toISOString();

      const { error: sourceUpdateError } = await supabase
        .from("monitoring_sources")
        .update({
          last_checked_at: now,
          last_content_hash: contentHash,
          last_content_summary: contentSummary,
          updated_at: now,
        })
        .eq("id", source.id);

      if (sourceUpdateError) {
        throw new Error(
          `Could not update the monitoring source: ${sourceUpdateError.message}`,
        );
      }

      results.push({
        source: source.name,
        url: source.url,
        status: shouldCreateArticle
          ? "draft-created"
          : "ignored-change",
        articleTitle,
        articleId,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown monitoring error.";

      console.error(`Monitoring failed for ${source.name}`, error);

      results.push({
        source: source.name,
        url: source.url,
        status: "failed",
        message,
      });
    }
  }

  const summary = {
    checked: results.length,

    firstSnapshots: results.filter(
      (result) => result.status === "first-snapshot",
    ).length,

    unchanged: results.filter(
      (result) => result.status === "unchanged",
    ).length,

    ignoredChanges: results.filter(
      (result) => result.status === "ignored-change",
    ).length,

    draftsCreated: results.filter(
      (result) => result.status === "draft-created",
    ).length,

    failed: results.filter(
      (result) => result.status === "failed",
    ).length,
  };

  return Response.json({
    success: true,
    summary,
    results,
  });
}