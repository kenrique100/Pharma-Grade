import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/logo.webp" alt="Pharma Grade" width={32} height={32} className="rounded-lg" />
              <span className="text-red-600 font-black text-xl">PHARMA</span>
              <span className="text-gray-900 dark:text-white font-black text-xl">GRADE</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Premium quality pharmaceutical grade supplements. Lab tested, genuine products.</p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {["Injectable Steroids", "Bulking Steroids", "Fat Loss", "Post Cycle Therapy", "HGH", "Botox"].map((cat) => (
                <li key={cat}>
                  <Link href={`/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/testimonials" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Testimonials</Link></li>
              <li><Link href="/support" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Support</Link></li>
              <li><Link href="/account" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link href="/support#chat" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">💬 24/7 Live Chat</Link></li>
              <li><a href="mailto:support@pharmagrade.com" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">support@pharmagrade.com</a></li>
              <li><span className="text-gray-500 dark:text-gray-400 text-sm">Worldwide Shipping</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 text-sm">Crypto Payments Accepted</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Pharma Grade. All rights reserved. For research purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
