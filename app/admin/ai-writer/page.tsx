"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
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

type DraftContext = {
  category: string;
  language: string;
};

const inputStyle =
  "mt-2 w-full rounded-2xl border border-[#D8CEC4] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#B83F29] focus:ring-4 focus:ring-[#B83F29]/10";

const buttonSecondary =
  "rounded-2xl border border-[#CFC3B7] bg-white px-5 py-3 font-semibold transition hover:border-[#B83F29] hover:text-[#B83F29] disabled:cursor-not-allowed disabled:opacity-60";

const buttonPrimary =
  "rounded-2xl bg-[#B83F29] px-5 py-3 font-bold text-white transition hover:bg-[#9F3422] disabled:cursor-not-allowed disabled:opacity-60";

function getError(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const value = data as {
      error?: unknown;
      details?: unknown;
    };

    if (
      typeof value.details === "string" &&
      value.details
    ) {
      return value.details;
    }

    if (
      typeof value.error === "string" &&
      value.error
    ) {
      return value.error;
    }
  }

  return fallback;
}

export default function AiWriterPage() {
  const [generatedDraft, setGeneratedDraft] =
    useState<GeneratedDraft | null>(null);

  const [generatedContext, setGeneratedContext] =
    useState<DraftContext | null>(null);

  const [savedArticles, setSavedArticles] = useState<
    SavedArticle[]
  >([]);

  const [selectedArticle, setSelectedArticle] =
    useState<SavedArticle | null>(null);

  const [editingArticle, setEditingArticle] =
    useState<SavedArticle | null>(null);

  const [generating, setGenerating] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingChanges, setSavingChanges] =
    useState(false);

  const [loadingDrafts, setLoadingDrafts] =
    useState(true);

  const [publishingId, setPublishingId] = useState<
    string | null
  >(null);

  const [savedGeneratedSlug, setSavedGeneratedSlug] =
    useState<string | null>(null);

  const [generationError, setGenerationError] =
    useState("");

  const [saveError, setSaveError] = useState("");
  const [draftsError, setDraftsError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const loadDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    setDraftsError("");

    try {
      const response = await fetch(
        "/api/admin/articles?status=draft",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getError(
            data,
            "The drafts could not be loaded.",
          ),
        );
      }

      setSavedArticles(
        Array.isArray(data.articles)
          ? data.articles
          : [],
      );
    } catch (error) {
      setDraftsError(
        error instanceof Error
          ? error.message
          : "The drafts could not be loaded.",
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

    const form = new FormData(event.currentTarget);

    const category = String(
      form.get("category") || "",
    ).trim();

    const language = String(
      form.get("language") || "English",
    ).trim();

    try {
      const response = await fetch(
        "/api/admin/ai-writer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: String(
              form.get("topic") || "",
            ).trim(),
            category,
            sources: String(
              form.get("sources") || "",
            ).trim(),
            instructions: String(
              form.get("instructions") || "",
            ).trim(),
            language,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getError(
            data,
            "The draft could not be generated.",
          ),
        );
      }

      if (!data.draft) {
        throw new Error(
          "The writer returned no draft.",
        );
      }

      setGeneratedDraft(data.draft);

      setGeneratedContext({
        category,
        language,
      });

      setSavedGeneratedSlug(null);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Unexpected generation error.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function saveGeneratedDraft() {
    if (!generatedDraft || !generatedContext) {
      setSaveError(
        "Generate an article before trying to save it.",
      );
      return;
    }

    if (
      savedGeneratedSlug === generatedDraft.slug
    ) {
      setSaveError(
        "This draft has already been saved.",
      );
      return;
    }

    setSavingDraft(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/admin/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: generatedDraft.title,
            slug: generatedDraft.slug,
            summary: generatedDraft.summary,
            introduction:
              generatedDraft.introduction,
            sections: generatedDraft.sections,
            faq: generatedDraft.faq,
            sources: generatedDraft.sources,
            category: generatedContext.category,
            language: generatedContext.language,
            audience: "general",
            last_checked:
              generatedDraft.lastChecked,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getError(
            data,
            "The draft could not be saved.",
          ),
        );
      }

      setSavedGeneratedSlug(
        generatedDraft.slug,
      );

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
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "The draft could not be saved.",
      );
    } finally {
      setSavingDraft(false);
    }
  }

  async function saveEditedDraft(
    article: SavedArticle,
  ) {
    setSavingChanges(true);
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
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            introduction: article.introduction,
            sections: article.sections,
            faq: article.faq,
            sources: article.sources,
            category: article.category,
            language: article.language,
            audience: article.audience,
            section_slug: article.section_slug,
            last_checked:
              article.last_checked,
            status: "draft",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getError(
            data,
            "The changes could not be saved.",
          ),
        );
      }

      setEditingArticle(null);
      setSelectedArticle(data.article);

      setSuccessMessage(
        `Changes to "${data.article.title}" have been saved.`,
      );

      await loadDrafts();
    } catch (error) {
      setDraftsError(
        error instanceof Error
          ? error.message
          : "The changes could not be saved.",
      );
    } finally {
      setSavingChanges(false);
    }
  }

  async function publishArticle(
    article: SavedArticle,
  ) {
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
          getError(
            data,
            "The article could not be published.",
          ),
        );
      }

      setSuccessMessage(
        `"${article.title}" has been published.`,
      );

      setSelectedArticle(null);
      setEditingArticle(null);

      await loadDrafts();
    } catch (error) {
      setDraftsError(
        error instanceof Error
          ? error.message
          : "The article could not be published.",
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
            <span className="text-[#C94F32]">
              Now
            </span>
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

          <p className="mt-5 text-lg text-[#625D57]">
            Generate structured content, edit saved
            drafts and publish approved articles.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form
            onSubmit={generate}
            className="h-fit rounded-3xl border border-black/5 bg-[#FFFDF9] p-6 shadow-xl md:p-8"
          >
            <div className="grid gap-6">
              <Field label="Topic">
                <input
                  className={inputStyle}
                  name="topic"
                  required
                  placeholder="Public transport in Malta"
                />
              </Field>

              <Field label="Category">
                <input
                  className={inputStyle}
                  name="category"
                  required
                  placeholder="transport"
                />
              </Field>

              <Field label="Sources">
                <textarea
                  className={`${inputStyle} min-h-36 resize-y`}
                  name="sources"
                  required
                  placeholder="Paste approved URLs or notes, one per line."
                />
              </Field>

              <Field label="Instructions">
                <textarea
                  className={`${inputStyle} min-h-28 resize-y`}
                  name="instructions"
                />
              </Field>

              <Field label="Language">
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
              </Field>

              <button
                disabled={generating}
                className={buttonPrimary}
              >
                {generating
                  ? "Generating draft…"
                  : "Generate draft"}
              </button>
            </div>

            {generationError && (
              <Alert text={generationError} />
            )}
          </form>

          <section className="min-h-[520px] rounded-3xl bg-[#111315] p-6 text-white shadow-2xl md:p-9">
            {!generatedDraft ? (
              <EmptyPreview />
            ) : (
              <GeneratedPreview
                draft={generatedDraft}
                saving={savingDraft}
                saved={
                  savedGeneratedSlug ===
                  generatedDraft.slug
                }
                error={saveError}
                onSave={() =>
                  void saveGeneratedDraft()
                }
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

              <h2 className="font-serif text-4xl md:text-5xl">
                Saved drafts
              </h2>

              <p className="mt-3 text-[#625D57]">
                Review and edit every draft before
                publishing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDrafts()}
              disabled={loadingDrafts}
              className={buttonSecondary}
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
            <Alert text={draftsError} />
          )}

          {loadingDrafts ? (
            <QueueMessage text="Loading drafts…" />
          ) : savedArticles.length === 0 ? (
            <QueueMessage text="No drafts waiting" />
          ) : (
            <div className="grid gap-5">
              {savedArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl border border-black/5 bg-[#FFFDF9] p-6 shadow-sm md:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge
                          value={article.status}
                        />

                        <Badge
                          value={article.category}
                        />

                        <Badge
                          value={article.audience}
                        />

                        <Badge
                          value={
                            article.section_slug
                          }
                        />
                      </div>

                      <h3 className="font-serif text-3xl">
                        {article.title}
                      </h3>

                      <p className="mt-2 break-all text-sm text-[#8A817A]">
                        /{article.slug}
                      </p>

                      <p className="mt-4 max-w-4xl leading-7 text-[#625D57]">
                        {article.summary}
                      </p>

                      <p className="mt-5 text-sm text-[#766F69]">
                        Updated:{" "}
                        {formatDate(
                          article.updated_at,
                        )}{" "}
                        · Language:{" "}
                        {article.language}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedArticle(
                            article,
                          )
                        }
                        className={buttonSecondary}
                      >
                        Review
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArticle(null);

                          setEditingArticle(
                            structuredClone(
                              article,
                            ),
                          );
                        }}
                        className={buttonSecondary}
                      >
                        Edit draft
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void publishArticle(
                            article,
                          )
                        }
                        disabled={
                          publishingId ===
                          article.id
                        }
                        className={buttonPrimary}
                      >
                        {publishingId ===
                        article.id
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
        <ReviewModal
          article={selectedArticle}
          publishing={
            publishingId === selectedArticle.id
          }
          onClose={() =>
            setSelectedArticle(null)
          }
          onEdit={() => {
            setEditingArticle(
              structuredClone(selectedArticle),
            );

            setSelectedArticle(null);
          }}
          onPublish={() =>
            void publishArticle(
              selectedArticle,
            )
          }
        />
      )}

      {editingArticle && (
        <EditModal
          article={editingArticle}
          saving={savingChanges}
          error={draftsError}
          onChange={setEditingArticle}
          onCancel={() =>
            setEditingArticle(null)
          }
          onSave={() =>
            void saveEditedDraft(
              editingArticle,
            )
          }
        />
      )}
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="font-semibold">
      {label}
      {children}
    </label>
  );
}

function Alert({ text }: { text: string }) {
  return (
    <p
      role="alert"
      className="my-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      {text}
    </p>
  );
}

function QueueMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[#CFC3B7] bg-[#FFFDF9] p-10 text-center text-[#625D57]">
      {text}
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#EEE5DC] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#6B625B]">
      {value.replaceAll("-", " ")}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function EmptyPreview() {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-8 text-center">
      <div className="mb-5 text-4xl text-[#C94F32]">
        ✦
      </div>

      <h2 className="font-serif text-3xl">
        Your generated draft will appear here
      </h2>
    </div>
  );
}

function GeneratedPreview({
  draft,
  saving,
  saved,
  error,
  onSave,
}: {
  draft: GeneratedDraft;
  saving: boolean;
  saved: boolean;
  error: string;
  onSave: () => void;
}) {
  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-white/50">
        Generated draft
      </p>

      <h2 className="mt-3 font-serif text-4xl">
        {draft.title}
      </h2>

      <p className="mt-2 text-white/45">
        /{draft.slug}
      </p>

      <p className="mt-6 text-lg text-white/75">
        {draft.summary}
      </p>

      <p className="mt-6 whitespace-pre-wrap leading-7 text-white/70">
        {draft.introduction}
      </p>

      <div className="mt-8 grid gap-6">
        {draft.sections.map(
          (section, index) => (
            <section key={index}>
              <h3 className="font-serif text-2xl">
                {section.heading}
              </h3>

              <p className="mt-2 whitespace-pre-wrap leading-7 text-white/70">
                {section.content}
              </p>
            </section>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={saving || saved}
        onClick={onSave}
        className="mt-10 w-full rounded-2xl bg-[#C94F32] px-6 py-4 font-bold disabled:opacity-60"
      >
        {saving
          ? "Saving…"
          : saved
            ? "Draft saved"
            : "Save draft"}
      </button>

      {error && <Alert text={error} />}
    </div>
  );
}

function ModalShell({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="mx-auto max-w-5xl rounded-3xl bg-[#FFFDF9] p-6 shadow-2xl md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="font-serif text-4xl">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className={buttonSecondary}
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ReviewModal({
  article,
  publishing,
  onClose,
  onEdit,
  onPublish,
}: {
  article: SavedArticle;
  publishing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onPublish: () => void;
}) {
  return (
    <ModalShell
      title="Review draft"
      onClose={onClose}
    >
      <div className="flex flex-wrap gap-2">
        <Badge value={article.category} />
        <Badge value={article.audience} />
        <Badge value={article.section_slug} />
      </div>

      <h3 className="mt-6 font-serif text-4xl">
        {article.title}
      </h3>

      <p className="mt-2 text-[#8A817A]">
        /{article.slug}
      </p>

      <h4 className="mt-8 font-bold">
        Summary
      </h4>

      <p className="mt-2 leading-7">
        {article.summary}
      </p>

      <h4 className="mt-8 font-bold">
        Introduction
      </h4>

      <p className="mt-2 whitespace-pre-wrap leading-7">
        {article.introduction}
      </p>

      {article.sections.map(
        (section, index) => (
          <section
            key={index}
            className="mt-8"
          >
            <h4 className="font-serif text-2xl">
              {section.heading}
            </h4>

            <p className="mt-2 whitespace-pre-wrap leading-7">
              {section.content}
            </p>
          </section>
        ),
      )}

      <h4 className="mt-10 font-serif text-2xl">
        FAQ
      </h4>

      {article.faq.map((item, index) => (
        <div key={index} className="mt-4">
          <p className="font-bold">
            {item.question}
          </p>

          <p className="mt-1">
            {item.answer}
          </p>
        </div>
      ))}

      <h4 className="mt-10 font-serif text-2xl">
        Sources
      </h4>

      <ul className="mt-3 list-disc pl-6">
        {article.sources.map(
          (source, index) => (
            <li key={index}>
              {source.url ? (
                <a
                  className="text-[#B83F29] underline"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.name ||
                    source.url}
                </a>
              ) : (
                source.name
              )}
            </li>
          ),
        )}
      </ul>

      <div className="mt-10 flex flex-wrap justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={onEdit}
          className={buttonSecondary}
        >
          Edit draft
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className={buttonPrimary}
        >
          {publishing
            ? "Publishing…"
            : "Publish"}
        </button>
      </div>
    </ModalShell>
  );
}

function EditModal({
  article,
  saving,
  error,
  onChange,
  onCancel,
  onSave,
}: {
  article: SavedArticle;
  saving: boolean;
  error: string;
  onChange: (article: SavedArticle) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  function setField<
    Key extends keyof SavedArticle,
  >(
    key: Key,
    value: SavedArticle[Key],
  ) {
    onChange({
      ...article,
      [key]: value,
    });
  }

  function updateSection(
    index: number,
    key: keyof ArticleSection,
    value: string,
  ) {
    setField(
      "sections",
      article.sections.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  }

  function updateFaq(
    index: number,
    key: keyof ArticleFaq,
    value: string,
  ) {
    setField(
      "faq",
      article.faq.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  }

  function updateSource(
    index: number,
    key: keyof ArticleSource,
    value: string,
  ) {
    setField(
      "sources",
      article.sources.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
      ),
    );
  }

  return (
    <ModalShell
      title="Edit draft"
      onClose={onCancel}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="grid gap-6"
      >
        <Field label="Title">
          <input
            required
            className={inputStyle}
            value={article.title}
            onChange={(event) =>
              setField(
                "title",
                event.target.value,
              )
            }
          />
        </Field>

        <Field label="Slug">
          <input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className={inputStyle}
            value={article.slug}
            onChange={(event) =>
              setField(
                "slug",
                event.target.value,
              )
            }
          />
        </Field>

        <Field label="Summary">
          <textarea
            required
            className={`${inputStyle} min-h-28`}
            value={article.summary}
            onChange={(event) =>
              setField(
                "summary",
                event.target.value,
              )
            }
          />
        </Field>

        <Field label="Introduction">
          <textarea
            required
            className={`${inputStyle} min-h-36`}
            value={article.introduction}
            onChange={(event) =>
              setField(
                "introduction",
                event.target.value,
              )
            }
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Category">
            <input
              required
              className={inputStyle}
              value={article.category}
              onChange={(event) =>
                setField(
                  "category",
                  event.target.value,
                )
              }
            />
          </Field>

          <Field label="Section slug">
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={inputStyle}
              value={article.section_slug}
              onChange={(event) =>
                setField(
                  "section_slug",
                  event.target.value,
                )
              }
            />
          </Field>

          <Field label="Language">
            <input
              required
              className={inputStyle}
              value={article.language}
              onChange={(event) =>
                setField(
                  "language",
                  event.target.value,
                )
              }
            />
          </Field>

          <Field label="Audience">
            <select
              className={inputStyle}
              value={article.audience}
              onChange={(event) =>
                setField(
                  "audience",
                  event.target.value,
                )
              }
            >
              <option value="general">
                General
              </option>
              <option value="tourist">
                Tourist
              </option>
              <option value="eu-citizen">
                EU citizen
              </option>
              <option value="non-eu-citizen">
                Non-EU citizen
              </option>
              <option value="resident">
                Resident
              </option>
              <option value="business">
                Business
              </option>
            </select>
          </Field>
        </div>

        <EditorGroup
          title="Sections"
          onAdd={() =>
            setField("sections", [
              ...article.sections,
              {
                heading: "",
                content: "",
              },
            ])
          }
        >
          {article.sections.map(
            (section, index) => (
              <EditorCard
                key={index}
                disableRemove={
                  article.sections.length === 1
                }
                onRemove={() =>
                  setField(
                    "sections",
                    article.sections.filter(
                      (_, itemIndex) =>
                        itemIndex !== index,
                    ),
                  )
                }
              >
                <Field
                  label={`Section ${index + 1} heading`}
                >
                  <input
                    required
                    className={inputStyle}
                    value={section.heading}
                    onChange={(event) =>
                      updateSection(
                        index,
                        "heading",
                        event.target.value,
                      )
                    }
                  />
                </Field>

                <Field label="Content">
                  <textarea
                    required
                    className={`${inputStyle} min-h-40`}
                    value={section.content}
                    onChange={(event) =>
                      updateSection(
                        index,
                        "content",
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </EditorCard>
            ),
          )}
        </EditorGroup>

        <EditorGroup
          title="FAQ"
          onAdd={() =>
            setField("faq", [
              ...article.faq,
              {
                question: "",
                answer: "",
              },
            ])
          }
        >
          {article.faq.map(
            (item, index) => (
              <EditorCard
                key={index}
                onRemove={() =>
                  setField(
                    "faq",
                    article.faq.filter(
                      (_, itemIndex) =>
                        itemIndex !== index,
                    ),
                  )
                }
              >
                <Field
                  label={`Question ${index + 1}`}
                >
                  <input
                    required
                    className={inputStyle}
                    value={item.question}
                    onChange={(event) =>
                      updateFaq(
                        index,
                        "question",
                        event.target.value,
                      )
                    }
                  />
                </Field>

                <Field label="Answer">
                  <textarea
                    required
                    className={`${inputStyle} min-h-28`}
                    value={item.answer}
                    onChange={(event) =>
                      updateFaq(
                        index,
                        "answer",
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </EditorCard>
            ),
          )}
        </EditorGroup>

        <EditorGroup
          title="Sources"
          onAdd={() =>
            setField("sources", [
              ...article.sources,
              {
                name: "",
                url: "",
              },
            ])
          }
        >
          {article.sources.map(
            (source, index) => (
              <EditorCard
                key={index}
                disableRemove={
                  article.sources.length === 1
                }
                onRemove={() =>
                  setField(
                    "sources",
                    article.sources.filter(
                      (_, itemIndex) =>
                        itemIndex !== index,
                    ),
                  )
                }
              >
                <Field
                  label={`Source ${index + 1} name`}
                >
                  <input
                    className={inputStyle}
                    value={source.name}
                    onChange={(event) =>
                      updateSource(
                        index,
                        "name",
                        event.target.value,
                      )
                    }
                  />
                </Field>

                <Field label="URL">
                  <input
                    type="url"
                    className={inputStyle}
                    value={source.url}
                    onChange={(event) =>
                      updateSource(
                        index,
                        "url",
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </EditorCard>
            ),
          )}
        </EditorGroup>

        {error && <Alert text={error} />}

        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-[#FFFDF9] py-5">
          <button
            type="button"
            onClick={onCancel}
            className={buttonSecondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={buttonPrimary}
          >
            {saving
              ? "Saving changes…"
              : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function EditorGroup({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-black/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-2xl">
          {title}
        </h3>

        <button
          type="button"
          onClick={onAdd}
          className={buttonSecondary}
        >
          Add
        </button>
      </div>

      <div className="grid gap-4">
        {children}
      </div>
    </section>
  );
}

function EditorCard({
  children,
  onRemove,
  disableRemove = false,
}: {
  children: ReactNode;
  onRemove: () => void;
  disableRemove?: boolean;
}) {
  return (
    <div className="grid gap-4 rounded-2xl bg-[#F3ECE5] p-4">
      {children}

      <button
        type="button"
        disabled={disableRemove}
        onClick={onRemove}
        className="justify-self-end text-sm font-semibold text-red-700 disabled:opacity-30"
      >
        Remove
      </button>
    </div>
  );
}