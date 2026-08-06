import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  introduction: string;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  sources: ArticleSource[];
  category: string;
  language: string;
  audience: string;
  section_slug: string;
  status: "published";
  last_checked: string | null;
  published_at: string | null;
};

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getSupabasePublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Public Supabase configuration is missing.",
    );
  }

  return createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

async function getArticle(slug: string) {
  const supabase = getSupabasePublicClient();

  const { data, error } = await supabase
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
        "published_at",
      ].join(","),
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<Article>();

  if (error) {
    console.error(
      "Could not load public article",
      error,
    );

    throw new Error(
      "The article could not be loaded.",
    );
  }

  return data;
}

function cleanHeading(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

function convertMarkdownLinksToHtml(
  value: string,
) {
  return value.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
}

function sanitizeRichText(value: string) {
  let cleaned = convertMarkdownLinksToHtml(
    value || "",
  );

  cleaned = cleaned.replace(
    /<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi,
    "",
  );

  cleaned = cleaned.replace(
    /<(script|style|iframe|object|embed)[^>]*\/?>/gi,
    "",
  );

  cleaned = cleaned.replace(
    /\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi,
    "",
  );

  cleaned = cleaned.replace(
    /\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi,
    "",
  );

  cleaned = cleaned.replace(
    /<(?!\/?(?:p|br|strong|em|ul|ol|li|h2|h3|h4|a)(?:\s|>|\/))[^>]+>/gi,
    "",
  );

  cleaned = cleaned.replace(
    /<a\s+([^>]*?)href\s*=\s*["'](?!https?:\/\/)[^"']*["']([^>]*)>/gi,
    "<a>",
  );

  cleaned = cleaned.replace(
    /<a\s+([^>]*?)href\s*=\s*["'](https?:\/\/[^"']+)["']([^>]*)>/gi,
    '<a href="$2" target="_blank" rel="noopener noreferrer">',
  );

  return cleaned;
}

export async function generateMetadata({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article not found | GoMaltaNow",
    };
  }

  return {
    title: `${article.title} | GoMaltaNow`,
    description: article.summary,
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const sections = Array.isArray(
    article.sections,
  )
    ? article.sections
    : [];

  const faq = Array.isArray(article.faq)
    ? article.faq
    : [];

  const sources = Array.isArray(
    article.sources,
  )
    ? article.sources
    : [];

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-20">
        <div className="flex flex-wrap gap-2">
          <MetadataBadge
            value={article.category}
          />

          <MetadataBadge
            value={article.audience}
          />

          <MetadataBadge
            value={article.section_slug}
          />
        </div>

        <h1 className="mt-7 font-serif text-5xl font-medium leading-tight tracking-tight md:text-7xl">
          {article.title}
        </h1>

        <p className="mt-7 text-xl leading-relaxed text-[#625D57] md:text-2xl">
          {article.summary}
        </p>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-b border-black/10 pb-8 text-sm text-[#766F69]">
          {article.published_at && (
            <span>
              Published:{" "}
              {formatDate(
                article.published_at,
              )}
            </span>
          )}

          {article.last_checked && (
            <span>
              Information checked:{" "}
              {formatDate(
                article.last_checked,
              )}
            </span>
          )}

          <span>
            Language: {article.language}
          </span>
        </div>

        <RichText
          content={article.introduction}
          className="mt-10"
        />

        <div className="mt-12 space-y-10">
          {sections.map(
            (section, index) => (
              <section
                key={`${section.heading}-${index}`}
                className="border-t border-black/10 pt-8"
              >
                <h2 className="font-serif text-3xl font-medium md:text-4xl">
                  {cleanHeading(
                    section.heading,
                  )}
                </h2>

                <RichText
                  content={section.content}
                  className="mt-5"
                />
              </section>
            ),
          )}
        </div>

        {faq.length > 0 && (
          <section className="mt-14 border-t border-black/10 pt-9">
            <h2 className="font-serif text-4xl font-medium">
              Frequently asked questions
            </h2>

            <div className="mt-7 space-y-5">
              {faq.map((item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="rounded-3xl bg-[#FFFDF9] p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold">
                    {cleanHeading(
                      item.question,
                    )}
                  </h3>

                  <RichText
                    content={item.answer}
                    className="mt-3"
                    compact
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section className="mt-14 border-t border-black/10 pt-9">
            <h2 className="font-serif text-4xl font-medium">
              Official sources
            </h2>

            <p className="mt-3 leading-7 text-[#766F69]">
              Review the original sources
              before making important travel,
              residency, employment, financial
              or legal decisions.
            </p>

            <ul className="mt-6 space-y-4">
              {sources.map(
                (source, index) => (
                  <li
                    key={`${source.url}-${index}`}
                    className="rounded-2xl border border-black/5 bg-[#FFFDF9] p-5"
                  >
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-semibold text-[#B83F29] underline decoration-[#C94F32]/40 underline-offset-4 hover:text-[#8F2E1E]"
                      >
                        {source.name ||
                          source.url}
                      </a>
                    ) : (
                      <span className="font-semibold">
                        {source.name}
                      </span>
                    )}
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

        <div className="mt-14 border-t border-black/10 pt-8">
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:bg-[#9F3422]"
          >
            Explore GoMaltaNow
          </Link>
        </div>
      </article>
    </main>
  );
}

function RichText({
  content,
  className = "",
  compact = false,
}: {
  content: string;
  className?: string;
  compact?: boolean;
}) {
  const html = sanitizeRichText(content);

  return (
    <div
      className={[
        className,
        "text-[#625D57]",
        compact
          ? "leading-8"
          : "text-lg leading-9",
        "[&_a]:font-medium",
        "[&_a]:text-[#B83F29]",
        "[&_a]:underline",
        "[&_a]:decoration-[#C94F32]/40",
        "[&_a]:underline-offset-4",
        "[&_a:hover]:text-[#8F2E1E]",
        "[&_p]:mt-5",
        "[&_p:first-child]:mt-0",
        "[&_h2]:mt-10",
        "[&_h2]:font-serif",
        "[&_h2]:text-3xl",
        "[&_h2]:font-medium",
        "[&_h2]:text-[#171717]",
        "[&_h3]:mt-8",
        "[&_h3]:font-serif",
        "[&_h3]:text-2xl",
        "[&_h3]:font-medium",
        "[&_h3]:text-[#171717]",
        "[&_h4]:mt-7",
        "[&_h4]:text-xl",
        "[&_h4]:font-bold",
        "[&_h4]:text-[#171717]",
        "[&_ul]:mt-5",
        "[&_ul]:list-disc",
        "[&_ul]:space-y-2",
        "[&_ul]:pl-7",
        "[&_ol]:mt-5",
        "[&_ol]:list-decimal",
        "[&_ol]:space-y-2",
        "[&_ol]:pl-7",
        "[&_li]:pl-1",
        "[&_strong]:font-bold",
        "[&_strong]:text-[#292521]",
      ].join(" ")}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

function MetadataBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-[#E9DED3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#655B53]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}