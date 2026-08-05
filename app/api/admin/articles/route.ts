import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    if (requestedStatus === "draft" || requestedStatus === "published") {
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