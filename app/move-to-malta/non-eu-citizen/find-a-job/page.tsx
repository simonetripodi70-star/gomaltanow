import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type JobArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  audience: string;
  section_slug: string;
  published_at: string | null;
  last_checked: string | null;
};

const jobArticleKeys = [
  "jobs",
  "job",
  "work",
  "employment",
  "career",
  "recruitment",
  "jobsplus",
  "eures",
  "sponsorship",
  "employer",
  "hiring",
];

const jobSteps = [
  {
    number: "01",
    title: "Target suitable employers",
    text: "Focus on employers and roles that are realistically open to third-country nationals and understand whether permit sponsorship may be required.",
  },
  {
    number: "02",
    title: "Prepare a strong CV",
    text: "Keep your CV clear and concise, highlight relevant experience and qualifications, and adapt it to the role you are applying for.",
  },
  {
    number: "03",
    title: "Search through reliable channels",
    text: "Use reputable job portals, recruitment agencies, company career pages and official employment resources when looking for vacancies in Malta.",
  },
  {
    number: "04",
    title: "Clarify permit responsibilities",
    text: "Before accepting a role, make sure you understand who will handle the employment and permit process and what documents you will need to provide.",
  },
  {
    number: "05",
    title: "Review the employment offer",
    text: "Check salary, working hours, probation, duties, location and any other important employment conditions before you commit.",
  },
];

const checklist = [
  "Updated CV in English",
  "Valid passport",
  "Copies of qualifications and certificates",
  "Employment references where available",
  "Clear understanding of your permit situation",
  "Professional email address and Maltese contact number when possible",
  "Copies of job offers and employment correspondence",
  "Information about the employer before accepting a position",
];

const searchChannels = [
  {
    title: "Company career pages",
    text: "Apply directly to employers that are actively hiring for roles matching your experience.",
  },
  {
    title: "Recruitment agencies",
    text: "Recruiters can help connect candidates with employers, particularly in sectors with regular international hiring.",
  },
  {
    title: "Job platforms",
    text: "Use established employment websites and keep alerts active for new vacancies that match your skills.",
  },
];

function getSupabasePublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    console.error(
      "Public Supabase configuration is missing.",
    );

    return null;
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

function normalizeValue(
  value: string | null | undefined,
) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("_", "-")
    .replace(/\s+/g, "-");
}

function isJobArticle(
  article: JobArticle,
) {
  const searchableValues = [
    article.category,
    article.section_slug,
    article.title,
    article.slug,
  ].map(normalizeValue);

  return jobArticleKeys.some((key) => {
    const normalizedKey =
      normalizeValue(key);

    return searchableValues.some(
      (value) =>
        value === normalizedKey ||
        value.includes(normalizedKey),
    );
  });
}

async function getJobArticles(): Promise<
  JobArticle[]
> {
  const supabase =
    getSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      [
        "id",
        "title",
        "slug",
        "summary",
        "category",
        "audience",
        "section_slug",
        "published_at",
        "last_checked",
      ].join(","),
    )
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    })
    .limit(100)
    .returns<JobArticle[]>();

  if (error) {
    console.error(
      "Could not load non-EU job articles",
      error,
    );

    return [];
  }

  return (data ?? [])
    .filter((article) => {
      const audience =
        normalizeValue(article.audience);

      return (
        audience === "non-eu-citizen" ||
        audience === "general" ||
        audience === ""
      );
    })
    .filter(isJobArticle);
}

export default async function FindAJobPage() {
  const jobArticles =
    await getJobArticles();

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <Link
            href="/move-to-malta/non-eu-citizen"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to Non-EU guides
          </Link>
        </div>
      </nav>

      <section className="bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-6 py-16 md:px-8 lg:py-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                Employment in Malta
              </p>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
                Find a job in Malta as a non-EU citizen.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
                Learn how to approach your job
                search, prepare your applications
                and understand the employment
                process before accepting a role.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#job-process"
                  className="inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535] hover:shadow-lg"
                >
                  Start your job search ↓
                </a>

                <Link
                  href="/move-to-malta/non-eu-citizen/single-permit"
                  className="inline-flex rounded-full border border-[#315846] px-6 py-3 font-bold text-[#315846] transition hover:bg-[#315846] hover:text-white"
                >
                  Single Permit guide
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[650px]">
            <Image
              src="/images/casa-maltese-blu.jpg"
              alt="Finding employment in Malta"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-[#173E63] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            Important for third-country nationals
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Employment and immigration are often connected.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/75">
            For many non-EU citizens, the job offer
            and the immigration process are closely
            linked. Confirm your legal route before
            making major relocation decisions.
          </p>
        </div>
      </section>

      <section
        id="job-process"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Job search process
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Approach your job search step by step.
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-[#625D57]">
              A focused search is more effective
              than sending the same application
              everywhere.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {jobSteps.map((step) => (
              <article
                key={step.number}
                className="relative overflow-hidden rounded-3xl border border-[#D5DDD7] bg-[#F4F7F5] p-7 md:p-8"
              >
                <span className="font-serif text-5xl text-[#315846]/20">
                  {step.number}
                </span>

                <h3 className="mt-4 font-serif text-3xl font-medium">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F4EE] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
              Where to look
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Use more than one job-search channel.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {searchChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-3xl border border-[#E0D7CC] bg-white p-7"
              >
                <h3 className="font-serif text-3xl">
                  {channel.title}
                </h3>

                <p className="mt-4 leading-7 text-[#625D57]">
                  {channel.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {jobArticles.length > 0 && (
        <section
          id="job-articles"
          className="border-y border-[#C9DCCF] bg-[#E8F0EA] py-20"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
                  Published employment guides
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-medium md:text-5xl">
                  Job and employment articles for
                  non-EU citizens.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#625D57]">
                  New approved articles related to
                  jobs, employment, recruitment and
                  sponsorship are connected here
                  automatically.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#315846]">
                {jobArticles.length}{" "}
                {jobArticles.length === 1
                  ? "article"
                  : "articles"}
              </span>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-[#C9DCCF] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2">
                    <MetadataBadge
                      value={article.category}
                    />

                    <MetadataBadge
                      value={article.audience}
                    />
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight transition group-hover:text-[#315846]">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                    {article.summary}
                  </p>

                  <div className="mt-7 border-t border-black/10 pt-5">
                    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#766F69]">
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
                          Checked:{" "}
                          {formatDate(
                            article.last_checked,
                          )}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex font-bold text-[#315846]">
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#315846] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Job application checklist
            </p>

            <h2 className="mt-3 font-serif text-4xl font-medium md:text-5xl">
              Prepare before you start applying.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Good preparation makes it easier to
              respond quickly when an employer asks
              for documents or additional
              information.
            </p>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#315846]">
                  ✓
                </span>

                <p className="leading-relaxed text-white/90">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#315846]">
            Next step
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Found a job? Understand the permit process.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-[#625D57]">
            Before relocating, make sure you
            understand the immigration route
            connected to your employment.
          </p>

          <Link
            href="/move-to-malta/non-eu-citizen/single-permit"
            className="mt-8 inline-flex rounded-full bg-[#315846] px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#244535]"
          >
            Go to Single Permit →
          </Link>
        </div>
      </section>

      <section className="bg-[#173E63] py-12 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/70">
            Employment and immigration procedures
            can change. GoMaltaNow provides general
            practical information and does not
            replace official guidance or
            professional immigration advice.
          </p>
        </div>
      </section>

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">
              Now
            </span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta Made Simple.
          </p>
        </div>
      </footer>
    </main>
  );
}

function MetadataBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-[#E8F0EA] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#315846]">
      {value.replaceAll("-", " ")}
    </span>
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
  }).format(date);
}