import Image from "next/image";

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section className="relative h-screen">

        <Image
          src="/images/hero.jpg"
          alt="Valletta"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-10 py-6 text-white">

          <h1 className="text-3xl font-bold">
            GoMaltaNow
          </h1>

          <div className="hidden md:flex gap-8 text-lg">

            <a href="#">Home</a>
            <a href="/beaches">Beaches</a>
            <a href="#">Restaurants</a>
            <a href="#">Hotels</a>
            <a href="#">Experiences</a>

          </div>

        </nav>

        {/* Hero Text */}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">

          <h2 className="text-5xl md:text-7xl font-extrabold mb-6">
            Discover Malta Like a Local
          </h2>

          <p className="max-w-3xl text-xl md:text-2xl text-gray-200 mb-10">
            Beaches, restaurants, luxury hotels and unforgettable experiences across Malta.
          </p>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold transition">
            Start Exploring
          </button>

        </div>

      </section>

      {/* Categories */}

      <section className="py-20 bg-white">

        <h2 className="text-4xl font-bold text-center mb-14">
          Explore Malta
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-8">

          <div className="shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition">
            <div className="text-5xl mb-4">🏖️</div>
            <h3 className="text-2xl font-bold mb-2">Beaches</h3>
            <p>Crystal clear water and hidden bays.</p>
          </div>

          <div className="shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition">
            <div className="text-5xl mb-4">🍝</div>
            <h3 className="text-2xl font-bold mb-2">Restaurants</h3>
            <p>Traditional food and modern cuisine.</p>
          </div>

          <div className="shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="text-2xl font-bold mb-2">Hotels</h3>
            <p>Luxury resorts and boutique hotels.</p>
          </div>

          <div className="shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition">
            <div className="text-5xl mb-4">🚤</div>
            <h3 className="text-2xl font-bold mb-2">Experiences</h3>
            <p>Boat tours, diving and unforgettable adventures.</p>
          </div>

        </div>

      </section>

    </main>
  );
}