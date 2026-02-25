import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center">
      <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
        {category.image ? (
          <Image src={category.image} alt={category.name} fill sizes="64px" className="object-contain" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">{category.icon}</div>
        )}
      </div>
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{category.name}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{category.description}</p>
    </Link>
  );
}
