import Image from "next/image";
import Link from "next/link";

const team = [
  { name: "Dr. Marcus Reid", role: "Chief Pharmacologist", bio: "15+ years in pharmaceutical research and quality assurance.", emoji: "👨‍⚕️" },
  { name: "Sarah Chen", role: "Head of Operations", bio: "Ensuring every order is fulfilled safely and discreetly.", emoji: "👩‍💼" },
  { name: "Jake Torres", role: "Quality Control Lead", bio: "Responsible for our rigorous lab testing protocols.", emoji: "🔬" },
  { name: "Aisha Okonkwo", role: "Customer Success Manager", bio: "Making sure every customer has an exceptional experience.", emoji: "🌟" },
];

const values = [
  { icon: "🔬", title: "Lab-Tested Purity", desc: "Every product undergoes third-party testing to guarantee 99%+ purity. We publish certificates of analysis for all products." },
  { icon: "🔐", title: "Privacy First", desc: "We accept only cryptocurrency payments and ship in unmarked, discreet packaging. Your privacy is our priority." },
  { icon: "🌍", title: "Global Reach", desc: "Trusted by athletes and researchers in 50+ countries. Our worldwide logistics network ensures fast, reliable delivery." },
  { icon: "💬", title: "24/7 Support", desc: "Our dedicated support team is available around the clock to answer any questions or concerns you may have." },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo.webp" alt="Pharma Grade" width={80} height={80} className="rounded-2xl shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            About <span className="text-red-600">Pharma Grade</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            We are a team of pharmaceutical professionals dedicated to providing the highest quality, lab-tested supplements and performance compounds to athletes and researchers worldwide.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Our <span className="text-red-600">Mission</span></h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2015, Pharma Grade was born out of frustration with the lack of trustworthy, genuinely pharmaceutical-grade compounds available to serious athletes and researchers.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We partner directly with licensed pharmaceutical manufacturers and independent testing laboratories to ensure every product meets the highest standards of purity and potency.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Our commitment is simple: deliver what we promise, protect your privacy, and provide the support you need on your journey.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "500+", label: "Products" },
                { value: "50+", label: "Countries Served" },
                { value: "99%", label: "Purity Rate" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                  <div className="text-3xl font-black text-red-600 mb-1">{stat.value}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">Our <span className="text-red-600">Values</span></h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-10">What drives everything we do</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val) => (
              <div key={val.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-3xl mb-3">{val.icon}</div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">{val.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">Meet the <span className="text-red-600">Team</span></h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-10">The experts behind Pharma Grade</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <div className="text-5xl mb-3">{member.emoji}</div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-1">{member.name}</h3>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-50 dark:from-red-900/30 to-gray-50 dark:to-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Join thousands of satisfied customers worldwide.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Shop Products</Link>
            <Link href="/support" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
