import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
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

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
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
        { status: 400 },
      );
    }

    const body = await request.json();

    if (body.status !== "published") {
      return Response.json(
        {
          error: "Only publication is currently supported.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: existingArticle, error: existingArticleError } =
      await supabase
        .from("articles")
        .select("id, title, status, published_at")
        .eq("id", id)
        .maybeSingle();

    if (existingArticleError) {
      console.error(
        "Could not load the article before publication",
        existingArticleError,
      );

      return Response.json(
        {
          error: "The article could not be checked.",
          details: existingArticleError.message,
        },
        { status: 500 },
      );
    }

    if (!existingArticle) {
      return Response.json(
        {
          error: "Article not found.",
        },
        { status: 404 },
      );
    }

    if (existingArticle.status === "published") {
      return Response.json({
        article: existingArticle,
        message: "The article is already published.",
      });
    }

    const { data: publishedArticle, error: publishError } =
      await supabase
        .from("articles")
        .update({
          status: "published",
          published_at: existingArticle.published_at ?? now,
          updated_at: now,
        })
        .eq("id", id)
        .eq("status", "draft")
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

    if (publishError) {
      console.error("Could not publish the article", publishError);

      return Response.json(
        {
          error: "The article could not be published.",
          details: publishError.message,
        },
        { status: 500 },
      );
    }

    return Response.json({
      article: publishedArticle,
      message: "The article has been published.",
    });
  } catch (error) {
    console.error("Article publication request failed", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The article could not be published.",
      },
      { status: 500 },
    );
  }
}