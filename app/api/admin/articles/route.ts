import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ArticleSection = {
  heading: string;
  content: string;
};

type ArticleFaq = {
  question: string;
  answer: string;
};

type ArticleSource = {
  name: string;
  url: string;
};

type CreateArticlePayload = {
  title?: unknown;
  slug?: unknown;
  summary?: unknown;
  introduction?: unknown;
  sections?: unknown;
  faq?: unknown;
  sources?: unknown;
  category?: unknown;
  language?: unknown;
  audience?: unknown;
  section_slug?: unknown;
  last_checked?: unknown;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  if (!supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not configured.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedStatus = url.searchParams.get("status");

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("articles")
      .select(
        [
          "id",
          "title",
          "slug",
          "summary",
          "introduction",
          "sections",
          "faq",
          "sources",
          "category",
          "language",
          "audience",
          "section_slug",
          "status",
          "last_checked",
          "created_at",
          "updated_at",
          "published_at",
        ].join(","),
      )
      .order("created_at", { ascending: false });

    if (
      requestedStatus === "draft" ||
      requestedStatus === "published"
    ) {
      query = query.eq("status", requestedStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Could not load articles", error);

      return Response.json(
        {
          error: "The articles could not be loaded.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return Response.json({
      articles: data ?? [],
    });
  } catch (error) {
    console.error("Article list request failed", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The articles could not be loaded.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateArticlePayload;

    const title = getRequiredString(body.title, "title");

    const slug = normalizeSlug(
      getRequiredString(body.slug, "slug"),
    );

    const summary = getRequiredString(body.summary, "summary");

    const introduction = getRequiredString(
      body.introduction,
      "introduction",
    );

    const category = getRequiredString(
      body.category,
      "category",
    );

    const language = getRequiredString(
      body.language,
      "language",
    );

    const sections = validateSections(body.sections);
    const faq = validateFaq(body.faq);
    const sources = validateSources(body.sources);

    const audience =
      getOptionalString(body.audience) || "general";

    const sectionSlug =
      getOptionalString(body.section_slug) ||
      determineSectionSlug(category);

    const lastChecked = normalizeDate(
      getOptionalString(body.last_checked),
    );

    const supabase = getSupabaseAdmin();

    const {
      data: existingArticle,
      error: existingArticleError,
    } = await supabase
      .from("articles")
      .select("id,title,slug,status")
      .eq("slug", slug)
      .maybeSingle();

    if (existingArticleError) {
      console.error(
        "Could not check for an existing article",
        existingArticleError,
      );

      return Response.json(
        {
          error:
            "The system could not verify whether this draft already exists.",
          details: existingArticleError.message,
        },
        { status: 500 },
      );
    }

    if (existingArticle) {
      return Response.json(
        {
          error:
            "An article with this slug has already been saved.",
          article: existingArticle,
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        summary,
        introduction,
        sections,
        faq,
        sources,
        category,
        language,
        audience,
        section_slug: sectionSlug,
        status: "draft",
        last_checked: lastChecked,
        updated_at: now,
        published_at: null,
      })
      .select(
        [
          "id",
          "title",
          "slug",
          "summary",
          "introduction",
          "sections",
          "faq",
          "sources",
          "category",
          "language",
          "audience",
          "section_slug",
          "status",
          "last_checked",
          "created_at",
          "updated_at",
          "published_at",
        ].join(","),
      )
      .single();

    if (error) {
      console.error("Could not save article draft", error);

      return Response.json(
        {
          error: "The draft could not be saved.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        message: "The draft has been saved.",
        article: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Article creation request failed", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The draft could not be saved.",
      },
      { status: 400 },
    );
  }
}

function getRequiredString(
  value: unknown,
  fieldName: string,
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function getOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function validateSections(
  value: unknown,
): ArticleSection[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      "At least one article section is required.",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        `Section ${index + 1} is invalid.`,
      );
    }

    return {
      heading: getRequiredString(
        item.heading,
        `Section ${index + 1} heading`,
      ),

      content: getRequiredString(
        item.content,
        `Section ${index + 1} content`,
      ),
    };
  });
}

function validateFaq(value: unknown): ArticleFaq[] {
  if (!Array.isArray(value)) {
    throw new Error("The FAQ structure is invalid.");
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        `FAQ item ${index + 1} is invalid.`,
      );
    }

    return {
      question: getRequiredString(
        item.question,
        `FAQ item ${index + 1} question`,
      ),

      answer: getRequiredString(
        item.answer,
        `FAQ item ${index + 1} answer`,
      ),
    };
  });
}

function validateSources(
  value: unknown,
): ArticleSource[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("At least one source is required.");
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        `Source ${index + 1} is invalid.`,
      );
    }

    const name = getOptionalString(item.name);
    const url = getOptionalString(item.url);

    if (!name && !url) {
      throw new Error(
        `Source ${index + 1} must contain a name or URL.`,
      );
    }

    return {
      name: name || url,
      url,
    };
  });
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeSlug(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new Error("A valid slug is required.");
  }

  return normalized;
}

function determineSectionSlug(category: string) {
  const normalized = category.toLowerCase().trim();

  if (
    normalized.includes("transport") ||
    normalized.includes("mobility") ||
    normalized.includes("bus")
  ) {
    return "transport";
  }

  if (
    normalized.includes("housing") ||
    normalized.includes("home") ||
    normalized.includes("rent")
  ) {
    return "housing";
  }

  if (
    normalized.includes("work") ||
    normalized.includes("job") ||
    normalized.includes("employment")
  ) {
    return "work";
  }

  if (
    normalized.includes("residence") ||
    normalized.includes("residency") ||
    normalized.includes("permit") ||
    normalized.includes("immigration")
  ) {
    return "residence";
  }

  if (
    normalized.includes("bank") ||
    normalized.includes("payment")
  ) {
    return "banking";
  }

  if (
    normalized.includes("health") ||
    normalized.includes("medical")
  ) {
    return "healthcare";
  }

  if (normalized.includes("tax")) {
    return "tax";
  }

  if (
    normalized.includes("education") ||
    normalized.includes("school") ||
    normalized.includes("university")
  ) {
    return "education";
  }

  if (
    normalized.includes("government") ||
    normalized.includes("official update")
  ) {
    return "government-updates";
  }

  if (
    normalized.includes("travel") ||
    normalized.includes("tourism") ||
    normalized.includes("holiday")
  ) {
    return "travel";
  }

  return normalizeSlug(category);
}

function normalizeDate(value: string) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}