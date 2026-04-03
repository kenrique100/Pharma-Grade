'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product3D {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  badge?: string;
}

interface ProductCarousel3DProps {
  products: Product3D[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * 3D Product Carousel Component
 * 
 * Features:
 * - Rotating 3D effect with CSS transforms
 * - Auto-play with manual navigation
 * - Responsive design for mobile and desktop
 * - Smooth animations and transitions
 * - Product details and pricing
 */
export default function ProductCarousel3D({
  products,
  autoPlay = true,
  autoPlayInterval = 5000,
}: ProductCarousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
      setRotation(prev => prev + 360 / products.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, products.length, isPaused]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    setRotation(prev => prev - 360 / products.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % products.length);
    setRotation(prev => prev + 360 / products.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    const diff = index - currentIndex;
    setCurrentIndex(index);
    setRotation(prev => prev + (diff * 360 / products.length));
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Main carousel container */}
      <div className="relative min-h-screen md:min-h-[600px] flex items-center justify-center py-12 md:py-0">
        {/* 3D Carousel Container */}
        <div
          className="relative w-full h-[400px] md:h-[500px] perspective"
          style={{
            perspective: '1000px',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Rotating carousel */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg)`,
            }}
          >
            {products.map((product, index) => {
              const angle = (index / products.length) * 360;
              const isActive = index === currentIndex;

              return (
                <div
                  key={product.id}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(300px)`,
                  }}
                >
                  <div
                    className={`relative w-full max-w-xs md:max-w-md h-full transition-all duration-500 ${
                      isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                    }`}
                  >
                    {/* Product card */}
                    <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                      {/* Product image container */}
                      <div className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {product.badge}
                          </div>
                        )}

                        {/* Product image with 3D effect */}
                        <div
                          className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
                          style={{
                            transform: isActive
                              ? 'scale(1) rotateZ(0deg)'
                              : 'scale(0.8) rotateZ(-5deg)',
                          }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-6 md:p-8"
                            priority={isActive}
                          />
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-red-600 dark:text-red-500">
                            {product.price}
                          </span>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Slide counter */}
          <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 text-white font-semibold text-sm md:text-base">
            <span className="text-red-600">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/50"> / </span>
            <span>{String(products.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Content overlay for mobile */}
        <div className="absolute bottom-0 left-0 right-0 md:hidden bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{currentProduct.name}</h2>
          <p className="text-sm text-gray-300 mb-4">{currentProduct.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">{currentProduct.price}</span>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 md:gap-3 py-6 md:py-8 bg-gray-900/50 backdrop-blur-sm">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-3 md:w-10 md:h-3 bg-red-600'
                : 'w-2 h-2 md:w-3 md:h-3 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && !isPaused && (
        <div className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-600/50">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-xs text-red-600 font-medium">Auto-playing</span>
          </div>
        </div>
      )}
    </div>
  );
}
