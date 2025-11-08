import { Link } from "react-router-dom";
export default function HomePageHero() {
  return (
    <section className="bg-pink-100 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto rounded-3xl p-8 sm:p-12 my-8 shadow-lg overflow-hidden">
      {/* Left Text Section */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Be <span className="text-emerald-600">Beautiful</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold mt-2 text-gray-900">
          You need time for <br /> Perfection
        </h2>
        <p className="mt-4 text-gray-700 max-w-lg">
          Professional spa salon for skin care for women and hair care for men.
          We have been in this business for over 8 years. Order the procedure
          now and get a 15% discount.
        </p>
        <Link
          to="/product"
          className="inline-block mt-6 bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-emerald-700 transition"
        >
          Shop Now
        </Link>
      </div>

      {/* Right Image Section */}
      <div className="flex-1 flex justify-center items-center gap-4">
        <img
          src="../../../public/pink-makeup.jpg"
          alt="Lipstick"
          className="rounded-lg object-cover"
        />
        {/* <img
          src="/images/nailpolish.png"
          alt="Nail Polish"
          className="w-16 h-16 rounded-lg object-cover"
        />
        <img
          src="/images/cream.png"
          alt="Cream"
          className="w-16 h-16 rounded-lg object-cover"
        /> */}
      </div>
    </section>
  );
}
