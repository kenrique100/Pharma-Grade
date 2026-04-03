'use client';

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface ProductFilterProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

/**
 * Product Filter Component
 * 
 * Features:
 * - Search by product name or description
 * - Filter by category
 * - Price range filtering
 * - Clear filters button
 */
export default function ProductFilter({
  categories,
  onFilterChange,
  isLoading = false,
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
  });

  const handleSearchChange = useCallback((value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = useCallback((value: string) => {
    const newFilters = { ...filters, category: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handlePriceChange = useCallback((type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 100,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Min Price: ${filters.minPrice.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Max Price: ${filters.maxPrice.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
