"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

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

type GeneratedDraft = {
  title: string;
  slug: string;
  summary: string;
  introduction: string;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  sources: ArticleSource[];
  lastChecked: string;
  status: "draft";
};

type GeneratedDraftContext = {
  category: string;
  language: string;
};

type SavedArticle = {
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
  status: "draft" | "published";
  last_checked: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

const inputStyle =
  "mt-2 w-full rounded-2xl border border-[#D9CEC2] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#9B928B] focus:border-[#B83F29] focus:ring-4 focus:ring-[#B83F29]/10";

export default function AiWriterPage() {
  const [generatedDraft, setGeneratedDraft] =
    useState<GeneratedDraft | null>(null);

  const [generatedDraftContext, setGeneratedDraftContext] =
    useState<GeneratedDraftContext | null>(null);

  const [savedArticles, setSavedArticles] = useState<
    SavedArticle[]
  >([]);

  const [selectedArticle, setSelectedArticle] =
    useState<SavedArticle | null>(null);

  const [generationError, setGenerationError] = useState("");
  const [draftsError, setDraftsError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [generating, setGenerating] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingDrafts, setLoadingDrafts] = useState(true);

  const [publishingId, setPublishingId] = useState<
    string | null
  >(null);

  const [savedGeneratedSlug, setSavedGeneratedSlug] =
    useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    setDraftsError("");

    try {
      const response = await fetch(
        "/api/admin/articles?status=draft",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The drafts could not be loaded.",
        );
      }

      setSavedArticles(
        Array.isArray(data.articles) ? data.articles : [],
      );
    } catch (caught) {
      setDraftsError(
        caught instanceof Error
          ? caught.message
          : "Unexpected error while loading drafts.",
      );
    } finally {
      setLoadingDrafts(false);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  async function generate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setGenerating(true);
    setGenerationError("");
    setSaveError("");
    setSuccessMessage("");
    setGeneratedDraft(null);
    setGeneratedDraftContext(null);
    setSavedGeneratedSlug(null);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = Object.fromEntries(formData.entries());

      const category =
        typeof payload.category === "string"
          ? payload.category.trim()
          : "";

      const language =
        typeof payload.language === "string"
          ? payload.language.trim()
          : "English";

      const response = await fetch("/api/ai-writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The draft could not be generated.",
        );
      }

      setGeneratedDraft(data.draft);

      setGeneratedDraftContext({
        category,
        language,
      });
    } catch (caught) {
      setGenerationError(
        caught instanceof Error
          ? caught.message
          : "Unexpected error.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function saveGeneratedDraft() {
    if (!generatedDraft || !generatedDraftContext) {
      setSaveError(
        "Generate an article before trying to save it.",
      );
      return;
    }

    if (savedGeneratedSlug === generatedDraft.slug) {
      setSaveError("This draft has already been saved.");
      return;
    }

    setSavingDraft(true);
    setSaveError("");
    setDraftsError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: generatedDraft.title,
          slug: generatedDraft.slug,
          summary: generatedDraft.summary,
          introduction: generatedDraft.introduction,
          sections: generatedDraft.sections,
          faq: generatedDraft.faq,
          sources: generatedDraft.sources,
          category: generatedDraftContext.category,
          language: generatedDraftContext.language,
          audience: "all",
          last_checked: generatedDraft.lastChecked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "The draft could not be saved.",
        );
      }

      setSavedGeneratedSlug(generatedDraft.slug);

      setSuccessMessage(
        `"${generatedDraft.title}" has been saved as a draft.`,
      );

      await loadDrafts();

      document
        .getElementById("saved-drafts")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : "Unexpected error while saving the draft.",
      );
    } finally {
      setSavingDraft(false);
    }
  }

  async function publishArticle(article: SavedArticle) {
    const confirmed = window.confirm(
      `Publish "${article.title}"?\n\nThe article will become visible on the public website.`,
    );

    if (!confirmed) {
      return;
    }

    setPublishingId(article.id);
    setDraftsError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/admin/articles/${article.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "published",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "The article could not be published.",
        );
      }

      setSuccessMessage(
        `"${article.title}" has been published.`,
      );

      if (selectedArticle?.id === article.id) {
        setSelectedArticle(null);
      }

      await loadDrafts();
    } catch (caught) {
      setDraftsError(
        caught instanceof Error
          ? caught.message
          : "Unexpected error while publishing the article.",
      );
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F1EA] text-[#171717]">
      <header className="border-b border-white/10 bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="font-serif text-3xl font-semibold"
          >
            GoMalta
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
            Private workspace
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Content studio
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            AI Writer
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
            Generate structured content, save drafts, review
            articles and publish approved content.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form
            onSubmit={generate}
            className="h-fit rounded-3xl border border-black/5 bg-[#FFFDF9] p-6 shadow-xl md:p-8"
          >
            <div className="grid gap-6">
              <label className="font-semibold">
                Topic
                <input
                  className={inputStyle}
                  name="topic"
                  required
                  placeholder="Public transport in Malta"
                />
              </label>

              <label className="font-semibold">
                Category
                <input
                  className={inputStyle}
                  name="category"
                  required
                  placeholder="Transport"
                />
              </label>

              <label className="font-semibold">
                Sources
                <textarea
                  className={`${inputStyle} min-h-36 resize-y`}
                  name="sources"
                  required
                  placeholder={
                    "Paste approved URLs, notes or source excerpts here.\nOne source per line works well."
                  }
                />

                <small className="mt-2 block font-normal leading-relaxed text-[#766F69]">
                  URLs are searched only within their approved
                  domains. The writer must not invent missing
                  facts.
                </small>
              </label>

              <label className="font-semibold">
                Instructions
                <textarea
                  className={`${inputStyle} min-h-28 resize-y`}
                  name="instructions"
                  placeholder="Write a practical guide for people moving to Malta. Keep the tone clear and friendly."
                />
              </label>

              <label className="font-semibold">
                Language
                <select
                  className={inputStyle}
                  name="language"
                  defaultValue="English"
                >
                  <option>English</option>
                  <option>Italiano</option>
                  <option>Français</option>
                  <option>Deutsch</option>
                  <option>Español</option>
                </select>
              </label>

              <button
                disabled={generating}
                className="rounded-2xl bg-[#B83F29] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#9F3422] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating
                  ? "Generating draft…"
                  : "Generate draft"}
              </button>
            </div>

            {generationError && (
              <p
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                {generationError}
              </p>
            )}
          </form>

          <section
            aria-live="polite"
            className="min-h-[520px] rounded-3xl bg-[#111315] p-6 text-white shadow-2xl md:p-9"
          >
            {!generatedDraft ? (
              <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C94F32] text-2xl">
                  ✦
                </div>

                <h2 className="font-serif text-3xl">
                  Your generated draft will appear here
                </h2>

                <p className="mt-3 max-w-md text-white/55">
                  Title, summary, sections, FAQs and source list
                  will be returned in a consistent structure.
                </p>
              </div>
            ) : (
              <GeneratedDraftPreview
                draft={generatedDraft}
                saving={savingDraft}
                saved={
                  savedGeneratedSlug === generatedDraft.slug
                }
                saveError={saveError}
                onSave={() => void saveGeneratedDraft()}
              />
            )}
          </section>
        </div>

        <section
          id="saved-drafts"
          className="mt-16 scroll-mt-8"
        >
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-[#B83F29]">
                Editorial queue
              </p>

              <h2 className="font-serif text-4xl font-medium md:text-5xl">
                Saved drafts
              </h2>

              <p className="mt-3 text-[#625D57]">
                Review generated or automatically created drafts
                before publishing them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDrafts()}
              disabled={loadingDrafts}
              className="rounded-2xl border border-[#CFC3B7] bg-white px-5 py-3 font-semibold transition hover:border-[#B83F29] hover:text-[#B83F29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingDrafts
                ? "Refreshing…"
                : "Refresh drafts"}
            </button>
          </div>

          {successMessage && (
            <p
              role="status"
              className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800"
            >
              {successMessage}
            </p>
          )}

          {draftsError && (
            <p
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
            >
              {draftsError}
            </p>
          )}

          {loadingDrafts ? (
            <div className="rounded-3xl border border-black/5 bg-white p-10 text-center text-[#625D57] shadow-sm">
              Loading drafts…
            </div>
          ) : savedArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#CFC3B7] bg-[#FFFDF9] p-10 text-center">
              <h3 className="font-serif text-3xl">
                No drafts waiting
              </h3>

              <p className="mt-3 text-[#625D57]">
                Generate an article and press Save draft. Drafts
                created by the monitoring system will also appear
                here automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {savedArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl border border-black/5 bg-[#FFFDF9] p-6 shadow-sm transition hover:shadow-lg md:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <MetadataBadge
                          value={article.status}
                        />

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

                      <h3 className="font-serif text-3xl leading-tight">
                        {article.title}
                      </h3>

                      <p className="mt-2 break-all text-sm text-[#8A817A]">
                        /{article.slug}
                      </p>

                      <p className="mt-4 max-w-4xl leading-7 text-[#625D57]">
                        {article.summary}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#766F69]">
                        <span>
                          Created:{" "}
                          {formatDate(article.created_at)}
                        </span>

                        <span>
                          Last checked:{" "}
                          {article.last_checked
                            ? formatDate(
                                article.last_checked,
                              )
                            : "Not available"}
                        </span>

                        <span>
                          Language: {article.language}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedArticle(article)
                        }
                        className="rounded-2xl border border-[#CFC3B7] bg-white px-5 py-3 font-semibold transition hover:border-[#B83F29] hover:text-[#B83F29]"
                      >
                        Review
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void publishArticle(article)
                        }
                        disabled={
                          publishingId === article.id
                        }
                        className="rounded-2xl bg-[#B83F29] px-5 py-3 font-bold text-white transition hover:bg-[#9F3422] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {publishingId === article.id
                          ? "Publishing…"
                          : "Publish"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      {selectedArticle && (
        <ArticleReviewModal
          article={selectedArticle}
          publishing={
            publishingId === selectedArticle.id
          }
          onClose={() => setSelectedArticle(null)}
          onPublish={() =>
            void publishArticle(selectedArticle)
          }
        />
      )}
    </main>
  );
}

function MetadataBadge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#EEE5DC] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#6B625B]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function GeneratedDraftPreview({
  draft,
  saving,
  saved,
  saveError,
  onSave,
}: {
  draft: GeneratedDraft;
  saving: boolean;
  saved: boolean;
  saveError: string;
  onSave: () => void;
}) {
  return (
    <article>
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#C94F32] px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {draft.status}
        </span>

        <span className="text-sm text-white/50">
          Last checked: {draft.lastChecked}
        </span>
      </div>

      <h2 className="font-serif text-4xl leading-tight md:text-5xl">
        {draft.title}
      </h2>

      <p className="mt-3 text-sm text-white/40">
        /{draft.slug}
      </p>

      <p className="mt-6 text-xl leading-relaxed text-white/75">
        {draft.summary}
      </p>

      <p className="mt-8 leading-8 text-white/70">
        {draft.introduction}
      </p>

      <ArticleContent
        sections={draft.sections}
        faq={draft.faq}
        sources={draft.sources}
        dark
      />

      <div className="mt-10 border-t border-white/10 pt-7">
        {saveError && (
          <p
            role="alert"
            className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100"
          >
            {saveError}
          </p>
        )}

        {saved && (
          <p
            role="status"
            className="mb-5 rounded-2xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-100"
          >
            This article has been saved and is now available in
            Saved drafts.
          </p>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving || saved}
          className="w-full rounded-2xl bg-[#C94F32] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#B83F29] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving draft…"
            : saved
              ? "Draft saved"
              : "Save draft"}
        </button>
      </div>
    </article>
  );
}

function ArticleReviewModal({
  article,
  publishing,
  onClose,
  onPublish,
}: {
  article: SavedArticle;
  publishing: boolean;
  onClose: () => void;
  onPublish: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Review ${article.title}`}
    >
      <div className="mx-auto max-w-5xl rounded-3xl bg-[#FFFDF9] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-black/10 bg-[#FFFDF9]/95 px-6 py-5 backdrop-blur md:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B83F29]">
              Draft review
            </p>

            <p className="mt-1 text-sm text-[#766F69]">
              {article.category} · {article.audience} ·{" "}
              {article.section_slug}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#CFC3B7] bg-white px-4 py-2 font-semibold transition hover:border-[#B83F29] hover:text-[#B83F29]"
          >
            Close
          </button>
        </div>

        <article className="p-6 md:p-10">
          <div className="mb-7 flex flex-wrap gap-2">
            <MetadataBadge value={article.status} />
            <MetadataBadge value={article.language} />
          </div>

          <h2 className="font-serif text-4xl leading-tight md:text-6xl">
            {article.title}
          </h2>

          <p className="mt-3 break-all text-sm text-[#8A817A]">
            /{article.slug}
          </p>

          <p className="mt-7 text-xl leading-relaxed text-[#514B46]">
            {article.summary}
          </p>

          <p className="mt-8 whitespace-pre-wrap leading-8 text-[#625D57]">
            {article.introduction}
          </p>

          <ArticleContent
            sections={article.sections}
            faq={article.faq}
            sources={article.sources}
          />

          <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-7 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#CFC3B7] bg-white px-6 py-3 font-semibold transition hover:border-[#B83F29] hover:text-[#B83F29]"
            >
              Keep as draft
            </button>

            <button
              type="button"
              onClick={onPublish}
              disabled={publishing}
              className="rounded-2xl bg-[#B83F29] px-6 py-3 font-bold text-white transition hover:bg-[#9F3422] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {publishing
                ? "Publishing…"
                : "Publish article"}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

function ArticleContent({
  sections,
  faq,
  sources,
  dark = false,
}: {
  sections: ArticleSection[];
  faq: ArticleFaq[];
  sources: ArticleSource[];
  dark?: boolean;
}) {
  const borderClass = dark
    ? "border-white/10"
    : "border-black/10";

  const secondaryTextClass = dark
    ? "text-white/70"
    : "text-[#625D57]";

  const faqBackgroundClass = dark
    ? "bg-white/5"
    : "bg-[#F4EDE5]";

  return (
    <>
      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <section
            key={`${section.heading}-${index}`}
            className={`border-t pt-7 ${borderClass}`}
          >
            <h3 className="font-serif text-3xl">
              {section.heading}
            </h3>

            <p
              className={`mt-4 whitespace-pre-wrap leading-8 ${secondaryTextClass}`}
            >
              {section.content}
            </p>
          </section>
        ))}
      </div>

      <section
        className={`mt-10 border-t pt-7 ${borderClass}`}
      >
        <h3 className="font-serif text-3xl">FAQ</h3>

        <div className="mt-5 space-y-5">
          {faq.map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              className={`rounded-2xl p-5 ${faqBackgroundClass}`}
            >
              <h4 className="font-semibold">
                {item.question}
              </h4>

              <p
                className={`mt-2 leading-7 ${secondaryTextClass}`}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`mt-10 border-t pt-7 ${borderClass}`}
      >
        <h3 className="font-serif text-3xl">Sources</h3>

        <ul
          className={`mt-4 space-y-3 ${secondaryTextClass}`}
        >
          {sources.map((source, index) => (
            <li key={`${source.url}-${index}`}>
              {source.url ? (
                <a
                  className="break-all underline decoration-[#C94F32] underline-offset-4 hover:text-[#B83F29]"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.name || source.url}
                </a>
              ) : (
                source.name
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}