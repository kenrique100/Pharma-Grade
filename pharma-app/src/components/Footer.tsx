import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-1 mb-4">
              <span className="text-red-600 font-black text-xl">PHARMA</span>
              <span className="text-white font-black text-xl">GRADE</span>
            </div>
            <p className="text-gray-400 text-sm">Premium quality pharmaceutical grade supplements. Lab tested, genuine products.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {["Orals", "Injectables", "Peptides", "PCT", "Fat Loss", "Sexual Health"].map((cat) => (
                <li key={cat}>
                  <Link href={`/categories/${cat.toLowerCase().replace(" ", "-")}`} className="text-gray-400 hover:text-white text-sm transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white text-sm transition-colors">Register</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white text-sm transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-white text-sm transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">24/7 Live Chat</span></li>
              <li><span className="text-gray-400 text-sm">support@pharmagrade.com</span></li>
              <li><span className="text-gray-400 text-sm">Worldwide Shipping</span></li>
              <li><span className="text-gray-400 text-sm">Secure Payments</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Pharma Grade. All rights reserved. For research purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
