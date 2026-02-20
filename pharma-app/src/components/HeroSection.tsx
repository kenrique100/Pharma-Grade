import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-800 rounded-full opacity-10 blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-block bg-red-600/20 border border-red-600/40 text-red-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
          ⚡ Premium Pharmaceutical Grade Supplements
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          <span className="text-red-600">PHARMA</span> GRADE
          <br />
          <span className="text-gray-300 text-3xl md:text-4xl lg:text-5xl font-bold">Supplements & Steroids</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Lab tested, pharmaceutical quality anabolic steroids, peptides, and supplements. Trusted by athletes worldwide for maximum results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">Shop All Products</Link>
          <Link href="/categories/injectables" className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">View Injectables</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Products" },
            { value: "10K+", label: "Happy Customers" },
            { value: "99%", label: "Purity Guaranteed" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-red-500">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
