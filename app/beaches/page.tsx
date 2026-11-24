import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdSlot from "@/components/AdSlot";
import SideRail from "@/components/SideRail";

export const metadata: Metadata = {
  title: "Best Beaches in Malta and Gozo | GoMaltaNow",
  description:
    "The best beaches in Malta and Gozo: where they are, what they are like, the best months to go and whether there is parking.",
  alternates: { canonical: "/beaches" },
};

export const dynamic = "force-dynamic";

type Beach = {
  id: number | string;
  name: string;
  image: string | null;
  location: string | null;
  description: string | null;
  best_months: string | null;
  parking: boolean | null;
};

export default async function BeachesPage() {
  const { data, error } = await supabase
    .from("beaches")
    .select("*")
    .order("name");

  if (error) {
    console.error("Could not load beaches", error);
  }

  const beaches = (data ?? []) as Beach[];

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#171717]">
      <nav className="bg-[#0B0D0F] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold md:text-3xl"
          >
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <Link
            href="/visit-malta"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to Visit Malta
          </Link>
        </div>
      </nav>

      <section className="bg-[#FBF7F2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#B83F29]">
            Beaches
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1] md:text-7xl">
            The best beaches in Malta and Gozo.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#625D57] md:text-xl">
            Sandy bays, rocky coves and clear water. See where each beach
            is, when to go and whether you can park nearby.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          {beaches.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#CFC3B7] bg-[#FFFDF9] p-10 text-center">
              <h2 className="font-serif text-3xl">
                Beaches are loading soon
              </h2>
              <p className="mt-3 text-[#625D57]">
                We couldn&apos;t load the beach list right now. Please try
                again in a few minutes.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {beaches.map((beach) => (
                <article
                  key={beach.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-[#FFFDF9] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {beach.image && (
                    <div className="relative h-56">
                      <Image
                        src={beach.image}
                        alt={`${beach.name}, Malta`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-7">
                    {beach.location && (
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B83F29]">
                        {beach.location}
                      </p>
                    )}

                    <h2 className="mt-3 font-serif text-3xl leading-tight">
                      {beach.name}
                    </h2>

                    {beach.description && (
                      <p className="mt-4 flex-1 leading-7 text-[#625D57]">
                        {beach.description}
                      </p>
                    )}

                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-black/10 pt-5 text-sm">
                      <div>
                        <dt className="font-bold text-[#171717]">
                          Best months
                        </dt>
                        <dd className="mt-1 text-[#625D57]">
                          {beach.best_months || "All year"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[#171717]">Parking</dt>
                        <dd className="mt-1 text-[#625D57]">
                          {beach.parking ? "Yes" : "Limited or none"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-3xl bg-[#173E63] p-8 text-white md:p-10">
            <h2 className="font-serif text-3xl md:text-4xl">
              Planning the rest of your trip?
            </h2>
            <p className="mt-3 max-w-2xl text-white/75">
              Combine the beaches with Valletta, Mdina and the best things to
              do around the islands.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/visit-malta/things-to-do"
                className="rounded-full bg-white px-6 py-3 font-bold text-[#173E63] transition hover:-translate-y-1"
              >
                Things to do →
              </Link>
              <Link
                href="/visit-malta/valletta"
                className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Valletta guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdSlot placement="guide" />

      <SideRail contentWidth={1280} />

      <footer className="bg-[#0B0D0F] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <Link href="/" className="font-serif text-2xl font-semibold">
            <span>GoMalta</span>
            <span className="text-[#C94F32]">Now</span>
          </Link>

          <p className="text-sm text-white/55">
            © 2026 GoMaltaNow. Malta Made Simple.
          </p>
        </div>
      </footer>
    </main>
  );
}
