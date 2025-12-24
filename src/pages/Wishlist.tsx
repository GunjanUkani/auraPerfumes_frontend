import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // NEW
import toast from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist(); // NEW - use context data

  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      quantity: 1,
      category: 'Unisex' as const,
      description: '',
      fragranceNotes: { top: [], middle: [], base: [] },
      size: '100ml',
      rating: 4.5,
      reviewsCount: 100,
      images: [item.imageUrl],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      stockQuantity: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [],
      occasion: [],
      season: [],
      longevity: 8,
      sillage: 5,
      gender: 'unisex',
      concentration: 'EDP',
      subCategory: [],
      longDescription: '',
    });
    toast.success('Added to cart!');
  };

  const handleRemove = (id: string) => {
    removeFromWishlist(id); // NEW - use context function
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Home', link: '/' },
          { label: 'My Account', link: '/profile' },
          { label: 'Wishlist', link: '#' },
        ]}
      />

      <div className="container-padding py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlist.length} items saved</p> {/* UPDATED */}
          </div>
          <button className="btn-primary">
            <ShoppingBag size={20} className="mr-2" />
            Shop All
          </button>
        </div>

        {wishlist.length === 0 ? ( // UPDATED
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite perfumes here for later</p>
            <button className="btn-primary">
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => ( // UPDATED - use wishlist from context
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                  >
                    <Trash2 size={20} className="text-gray-700" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`px-4 py-2 rounded-lg transition ${
                        item.inStock
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;