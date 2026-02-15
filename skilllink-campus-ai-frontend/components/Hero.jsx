export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Modernize your{" "}
            <span className="text-indigo-600">campus experience</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            The all-in-one collaboration platform for students. 
            Manage tasks, collaborate with peers, and get 24/7 academic
            assistance from our advanced AI.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Get Started
            </button>

            <button className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-200 transition">
              Live Demo
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <img
            src="/campus-hero.jpg"
            alt="Campus collaboration"
            className="rounded-3xl shadow-xl"
          />
        </div>

      </div>
    </section>
  );
}
