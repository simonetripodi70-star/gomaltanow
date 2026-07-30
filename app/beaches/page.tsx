import Image from "next/image";

const beaches = [
  {
    name: "Golden Bay",
    image: "/images/hero.jpg",
    description: "One of Malta's most famous sandy beaches."
  },
  {
    name: "Mellieħa Bay",
    image: "/images/hero.jpg",
    description: "Perfect for families and crystal-clear water."
  },
  {
    name: "Blue Lagoon",
    image: "/images/hero.jpg",
    description: "Turquoise water that looks like the Caribbean."
  },
  {
    name: "Għajn Tuffieħa",
    image: "/images/hero.jpg",
    description: "A hidden paradise surrounded by cliffs."
  }
];

export default function BeachesPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-blue-700 text-white py-16 text-center">

        <h1 className="text-5xl font-bold mb-4">
          Malta Beaches
        </h1>

        <p className="text-xl">
          Discover the most beautiful beaches in Malta.
        </p>

      </section>

      <section className="max-w-7xl mx-auto py-16 px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {beaches.map((beach) => (

            <div
              key={beach.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="relative h-56">

                <Image
                  src={beach.image}
                  alt={beach.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h2 className="text-2xl font-bold mb-3">
                  {beach.name}
                </h2>

                <p className="text-gray-600 mb-5">
                  {beach.description}
                </p>

                <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}