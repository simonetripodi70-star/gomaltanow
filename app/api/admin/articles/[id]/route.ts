import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

type UpdateArticlePayload = {
  status?: unknown;
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

const ARTICLE_FIELDS =
  "id,title,slug,summary,introduction,sections,faq,sources,category,language,audience,section_slug,status,last_checked,created_at,updated_at,published_at";

const ALLOWED_AUDIENCES = new Set([
  "tourist",
  "eu-citizen",
  "non-eu-citizen",
  "resident",
  "business",
  "general",
]);

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!supabaseSecretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured.",
    );
  }

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
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

function requiredString(
  value: unknown,
  fieldName: string,
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      fieldName + " is required.",
    );
  }

  return value.trim();
}

function optionalString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error(
      "A valid slug is required.",
    );
  }

  return slug;
}

function normalizeDate(value: unknown) {
  const rawValue = optionalString(value);

  if (!rawValue) {
    return new Date().toISOString();
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "last_checked must be a valid date.",
    );
  }

  return date.toISOString();
}

function validateSections(
  value: unknown,
): ArticleSection[] {
  if (
    !Array.isArray(value) ||
    value.length === 0
  ) {
    throw new Error(
      "At least one article section is required.",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        "Section " +
          (index + 1) +
          " is invalid.",
      );
    }

    return {
      heading: requiredString(
        item.heading,
        "Section " +
          (index + 1) +
          " heading",
      ),
      content: requiredString(
        item.content,
        "Section " +
          (index + 1) +
          " content",
      ),
    };
  });
}

function validateFaq(
  value: unknown,
): ArticleFaq[] {
  if (!Array.isArray(value)) {
    throw new Error(
      "The FAQ structure is invalid.",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        "FAQ item " +
          (index + 1) +
          " is invalid.",
      );
    }

    return {
      question: requiredString(
        item.question,
        "FAQ item " +
          (index + 1) +
          " question",
      ),
      answer: requiredString(
        item.answer,
        "FAQ item " +
          (index + 1) +
          " answer",
      ),
    };
  });
}

function validateSources(
  value: unknown,
): ArticleSource[] {
  if (
    !Array.isArray(value) ||
    value.length === 0
  ) {
    throw new Error(
      "At least one source is required.",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        "Source " +
          (index + 1) +
          " is invalid.",
      );
    }

    const name = optionalString(item.name);
    const url = optionalString(item.url);

    if (!name && !url) {
      throw new Error(
        "Source " +
          (index + 1) +
          " must contain a name or URL.",
      );
    }

    if (url) {
      try {
        const parsedUrl = new URL(url);

        if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
        ) {
          throw new Error();
        }
      } catch {
        throw new Error(
          "Source " +
            (index + 1) +
            " URL is invalid.",
        );
      }
    }

    return {
      name: name || url,
      url,
    };
  });
}

function validateAudience(value: unknown) {
  const audience =
    optionalString(value) || "general";

  if (!ALLOWED_AUDIENCES.has(audience)) {
    throw new Error(
      "The selected audience is invalid.",
    );
  }

  return audience;
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!isValidUuid(id)) {
      return Response.json(
        {
          error: "Invalid article ID.",
        },
        {
          status: 400,
        },
      );
    }

    let body: UpdateArticlePayload;

    try {
      body =
        (await request.json()) as UpdateArticlePayload;
    } catch {
      return Response.json(
        {
          error:
            "The request body must be valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase = getSupabaseAdmin();

    const {
      data: existingArticle,
      error: existingArticleError,
    } = await supabase
      .from("articles")
      .select(ARTICLE_FIELDS)
      .eq("id", id)
      .maybeSingle();

    if (existingArticleError) {
      console.error(
        "Could not load the article before update",
        existingArticleError,
      );

      return Response.json(
        {
          error:
            "The article could not be checked.",
          details:
            existingArticleError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!existingArticle) {
      return Response.json(
        {
          error: "Article not found.",
        },
        {
          status: 404,
        },
      );
    }

    const now = new Date().toISOString();

    if (body.status === "published") {
      if (
        existingArticle.status ===
        "published"
      ) {
        return Response.json({
          article: existingArticle,
          message:
            "The article is already published.",
        });
      }

      if (
        existingArticle.status !== "draft"
      ) {
        return Response.json(
          {
            error:
              "Only draft articles can be published.",
          },
          {
            status: 409,
          },
        );
      }

      const {
        data: publishedArticle,
        error: publishError,
      } = await supabase
        .from("articles")
        .update({
          status: "published",
          published_at:
            existingArticle.published_at ??
            now,
          updated_at: now,
        })
        .eq("id", id)
        .eq("status", "draft")
        .select(ARTICLE_FIELDS)
        .single();

      if (publishError) {
        console.error(
          "Could not publish the article",
          publishError,
        );

        return Response.json(
          {
            error:
              "The article could not be published.",
            details: publishError.message,
          },
          {
            status: 500,
          },
        );
      }

      return Response.json({
        article: publishedArticle,
        message:
          "The article has been published.",
      });
    }

    if (
      body.status !== undefined &&
      body.status !== "draft"
    ) {
      return Response.json(
        {
          error:
            "status must be either draft or published.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      existingArticle.status !== "draft"
    ) {
      return Response.json(
        {
          error:
            "Published articles cannot be edited from the draft editor.",
        },
        {
          status: 409,
        },
      );
    }

    const title = requiredString(
      body.title,
      "title",
    );

    const slug = normalizeSlug(
      requiredString(
        body.slug,
        "slug",
      ),
    );

    const summary = requiredString(
      body.summary,
      "summary",
    );

    const introduction = requiredString(
      body.introduction,
      "introduction",
    );

    const sections = validateSections(
      body.sections,
    );

    const faq = validateFaq(body.faq);

    const sources = validateSources(
      body.sources,
    );

    const category = requiredString(
      body.category,
      "category",
    );

    const language = requiredString(
      body.language,
      "language",
    );

    const audience = validateAudience(
      body.audience,
    );

    const sectionSlug = normalizeSlug(
      requiredString(
        body.section_slug,
        "section_slug",
      ),
    );

    const lastChecked = normalizeDate(
      body.last_checked,
    );

    const {
      data: articleUsingSlug,
      error: slugCheckError,
    } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (slugCheckError) {
      console.error(
        "Could not check the updated slug",
        slugCheckError,
      );

      return Response.json(
        {
          error:
            "The slug could not be checked.",
          details: slugCheckError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (articleUsingSlug) {
      return Response.json(
        {
          error:
            "Another article already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    const {
      data: updatedArticle,
      error: updateError,
    } = await supabase
      .from("articles")
      .update({
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
        last_checked: lastChecked,
        updated_at: now,
      })
      .eq("id", id)
      .eq("status", "draft")
      .select(ARTICLE_FIELDS)
      .single();

    if (updateError) {
      console.error(
        "Could not update the draft",
        updateError,
      );

      return Response.json(
        {
          error:
            "The draft could not be updated.",
          details: updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      article: updatedArticle,
      message:
        "The draft changes have been saved.",
    });
  } catch (error) {
    console.error(
      "Article update request failed",
      error,
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The article could not be updated.",
      },
      {
        status: 400,
      },
    );
  }
}