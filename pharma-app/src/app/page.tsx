import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { getFeaturedProducts, categories } from "@/lib/products";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      <HeroSection />

      <section className="bg-gray-100 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🔬", title: "Lab Tested", desc: "99% purity guaranteed" },
              { icon: "🌍", title: "Worldwide Shipping", desc: "Discreet packaging" },
              { icon: "₿", title: "Crypto Payment", desc: "BTC, ETH, USDC accepted" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{feature.title}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Shop by <span className="text-red-600">Category</span></h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Browse our full range of pharmaceutical grade products</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Best <span className="text-red-600">Sellers</span></h2>
              <p className="text-gray-500 dark:text-gray-400">Our most popular products</p>
            </div>
            <a href="/products" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">View All →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-red-50 dark:from-red-900/30 to-gray-50 dark:to-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">New to Pharma Grade?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create an account today and get access to exclusive member pricing and order tracking.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Create Account</a>
            <a href="/products" className="bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-900 dark:text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Products</a>
          </div>
        </div>
      </section>
    </div>
  );
}
