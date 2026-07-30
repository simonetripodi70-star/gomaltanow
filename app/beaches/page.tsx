import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function BeachesPage() {
  const { data: beaches, error } = await supabase
    .from("beaches")
    .select("*")
    .order("name");

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Errore</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-10">
      <h1 className="mb-10 text-5xl font-bold">
        Malta Beaches
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {beaches?.map((beach) => (
          <div
            key={beach.id}
            className="overflow-hidden rounded-2xl bg-white text-black shadow-lg transition hover:shadow-2xl"
          >
            <Image
              src={beach.image}
              alt={beach.name}
              width={600}
              height={400}
              className="h-56 w-full object-cover"
            />

            <div className="p-6 text-black">
              <h2 className="mb-2 text-2xl font-bold">
                {beach.name}
              </h2>

              <p className="mb-2 text-gray-600">
                📍 {beach.location}
              </p>

              <p className="mb-4 text-gray-700">
                {beach.description}
              </p>

              <p className="mb-2">
                ⭐ Best months: {beach.best_months}
              </p>

              <p className="mb-4">
                🚗 Parking: {beach.parking ? "Yes" : "No"}
              </p>

              <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}