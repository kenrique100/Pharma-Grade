import Link from "next/link";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-red-600 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 text-center">
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-400 transition-colors">{category.name}</h3>
      <p className="text-gray-400 text-sm">{category.description}</p>
    </Link>
  );
}
