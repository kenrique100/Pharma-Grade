"use client";

import { useParams } from "next/navigation";
import { useAdminStore } from "@/lib/adminStore";
import { useCart } from "@/lib/cart";
import { useReviewStore } from "@/lib/reviewStore";
import { usePurchaseStore } from "@/lib/purchaseStore";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categoryEmoji: Record<string, string> = {
  "Strength": "💪",
  "Short Cycle": "⚡",
  "Sex": "❤️",
  "Post Cycle Therapy": "🛡️",
  "Insulin": "💉",
  "Injectable Steroids": "🔬",
  "HGH": "🧬",
  "Fat Loss": "🔥",
  "Bulking Steroids": "🏋️",
  "Bac Water": "💧",
  "Botox": "✨",
};

const PACK_OPTIONS = [1, 5, 10, 15, 20] as const;

const IMAGE_URL_RE = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i;

function isImageLicence(url: string) {
  return url.startsWith("data:image") || IMAGE_URL_RE.test(url);
}

export default function ProductPage() {
  const params = useParams();
  const { products } = useAdminStore();
  const product = products.find((p) => p.slug === (params.slug as string));
  const addItem = useCart((state) => state.addItem);
  const { data: session } = useSession();

  const { getProductReviews, getUserReviewForProduct, addReview, updateReview, deleteReview } = useReviewStore();
  const hasPurchased = usePurchaseStore((s) => s.hasPurchased);

  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showLicence, setShowLicence] = useState(false);

  // Pack ordering state
  const [selectedPack, setSelectedPack] = useState<number>(1);
  const [packQty, setPackQty] = useState<number>(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
        <Link href="/products" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">← Back to Products</Link>
      </div>
    );
  }

  const userId = session?.user?.id ?? "";
  const userName = session?.user?.name ?? "Anonymous";
  const isLoggedIn = !!session?.user;
  const purchased = isLoggedIn && hasPurchased(userId, product.id);

  const productReviews = getProductReviews(product.id);
  const myReview = isLoggedIn ? getUserReviewForProduct(userId, product.id) : undefined;

  const totalReviews = product.reviews + productReviews.length;
  const avgRating = productReviews.length > 0
    ? (product.rating * product.reviews + productReviews.reduce((s, r) => s + r.rating, 0)) / totalReviews
    : product.rating;

  const packPrice = product.price * selectedPack * packQty;

  const handleAddToCart = () => {
    const totalPacks = selectedPack * packQty;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, totalPacks);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview({ productId: product.id, userId, userName, rating: reviewRating, comment: reviewComment.trim() });
    setReviewComment("");
    setReviewRating(5);
  };

  const startEdit = (r: { id: string; rating: number; comment: string }) => {
    setEditingReviewId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReviewId || !editComment.trim()) return;
    updateReview(editingReviewId, { rating: editRating, comment: editComment.trim() });
    setEditingReviewId(null);
  };

  const emoji = categoryEmoji[product.category] ?? "💊";

  const renderLicence = () => {
    if (!product.licenceUrl) return null;
    if (isImageLicence(product.licenceUrl)) {
      return (
        <div className="mt-4">
          <Image src={product.licenceUrl} alt="Product Licence" width={600} height={400} className="rounded-xl border border-gray-200 dark:border-gray-700 max-w-full object-contain" unoptimized />
        </div>
      );
    }
    return (
      <div className="mt-4">
        <a href={product.licenceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          📄 View / Download Licence
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">← Back to Products</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square max-h-[28rem] border border-gray-200 dark:border-gray-700">
          {!imgError ? (
            product.image.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              {emoji}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.badge && (
            <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${
              product.badge === "Best Seller" ? "bg-red-600" :
              product.badge === "New" ? "bg-green-600" : "bg-orange-600"
            }`}>{product.badge}</span>
          )}
          <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">{product.category}</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-500">{"★".repeat(Math.floor(avgRating))}{"☆".repeat(5 - Math.floor(avgRating))}</div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{avgRating.toFixed(1)} ({totalReviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-4xl font-black text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 text-xl line-through">${product.originalPrice}</span>
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 text-sm font-bold px-2 py-1 rounded">Save ${product.originalPrice - product.price}</span>
              </>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          {/* Pack Selection */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Select Pack Size</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {PACK_OPTIONS.map((n) => (
                <label key={n} className={`flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer text-center transition-colors ${
                  selectedPack === n
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700 text-gray-700 dark:text-gray-300"
                }`}>
                  <input type="radio" name="packSize" value={n} checked={selectedPack === n} onChange={() => setSelectedPack(n)} className="sr-only" />
                  <span className="font-bold text-sm">{n}x</span>
                  {product.unitsPerPack && (
                    <span className="text-xs mt-0.5 leading-tight">{product.unitsPerPack * n} units</span>
                  )}
                  {product.dosePerUnit && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.dosePerUnit}</span>
                  )}
                  <span className="font-semibold text-xs mt-1">${(product.price * n).toFixed(2)}</span>
                </label>
              ))}
            </div>

            {/* Pack Quantity Input */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Number of packs:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPackQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold flex items-center justify-center transition-colors"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={packQty}
                  onChange={(e) => {
                    const v = Math.min(50, Math.max(1, Number(e.target.value) || 1));
                    setPackQty(v);
                  }}
                  className="w-16 text-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-1 text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setPackQty((q) => Math.min(50, q + 1))}
                  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold flex items-center justify-center transition-colors"
                >+</button>
              </div>
              <span className="text-xs text-gray-400">(max 50)</span>
            </div>

            {/* Pricing Summary */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {packQty} × {selectedPack} pack{selectedPack > 1 ? "s" : ""} = <strong>{selectedPack * packQty}</strong> packs @ ${product.price.toFixed(2)}/pack
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white">
                Total: <span className="text-red-600 dark:text-red-400">${packPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`text-sm ${product.inStock ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <button onClick={handleAddToCart} disabled={!product.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              added ? "bg-green-600 text-white" :
              product.inStock ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}>
            {added ? "✓ Added to Cart!" : product.inStock ? `Add ${selectedPack * packQty} Pack${selectedPack * packQty > 1 ? "s" : ""} to Cart — $${packPrice.toFixed(2)}` : "Out of Stock"}
          </button>
          <Link href="/cart" className="block w-full text-center py-4 rounded-xl font-bold text-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mt-3">
            View Cart
          </Link>

          {/* Product Licence Section */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowLicence(!showLicence)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-gray-900 dark:text-white font-semibold text-sm">📋 Product Licence / Certificate</span>
              <span className="text-gray-400 text-xs">{showLicence ? "▲ Hide" : "▼ View"}</span>
            </button>
            {showLicence && (
              product.licenceUrl ? renderLicence() : (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Certificate of authenticity available upon request. Please contact support for details.
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
          Customer Reviews <span className="text-gray-400 font-normal text-lg">({totalReviews})</span>
        </h2>

        {/* Write / Edit Review */}
        {isLoggedIn && purchased && !myReview && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Write a Review</h3>
            <div className="mb-3">
              <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)}
                    className={`text-2xl transition-colors ${star <= reviewRating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                required
                placeholder="Share your experience with this product..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              Submit Review
            </button>
          </form>
        )}

        {isLoggedIn && !purchased && (
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
            💡 Purchase this product to leave a review.
          </div>
        )}

        {!isLoggedIn && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400">
            <Link href="/login" className="text-red-600 dark:text-red-400 font-medium hover:underline">Log in</Link> to write a review.
          </div>
        )}

        {/* User's own review (editable) */}
        {myReview && (
          <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">You</span>
                <span className="text-gray-400 text-xs ml-2">{new Date(myReview.createdAt).toLocaleDateString()}{myReview.updatedAt !== myReview.createdAt && " (edited)"}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(myReview)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                <button onClick={() => deleteReview(myReview.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Delete</button>
              </div>
            </div>

            {editingReviewId === myReview.id ? (
              <form onSubmit={handleSaveEdit}>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setEditRating(star)}
                      className={`text-xl ${star <= editRating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}>★</button>
                  ))}
                </div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Save</button>
                  <button type="button" onClick={() => setEditingReviewId(null)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex text-yellow-500 text-sm mb-1">{"★".repeat(myReview.rating)}{"☆".repeat(5 - myReview.rating)}</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{myReview.comment}</p>
              </>
            )}
          </div>
        )}

        {/* All other reviews */}
        {productReviews.filter((r) => r.userId !== userId).length === 0 && product.reviews === 0 && !myReview && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No reviews yet. Be the first!</p>
        )}

        <div className="space-y-4">
          {productReviews.filter((r) => r.userId !== userId).map((review) => (
            <div key={review.id} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{review.userName}</span>
                  <span className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-yellow-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
            </div>
          ))}

          {/* Static review count note */}
          {product.reviews > 0 && (
            <p className="text-gray-400 dark:text-gray-500 text-xs text-center pt-2">
              + {product.reviews} verified purchase reviews
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

