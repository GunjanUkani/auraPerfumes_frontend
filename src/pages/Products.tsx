import React, { useState } from 'react';
import { ShoppingBag, Filter, ChevronDown, Heart, Search, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // ✅ Add this
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart, totalItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // ✅ Add this
  
  const perfumes = [
    { id: "1", name: "Oud Noir", family: "Woody", price: 210, img: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop", rating: 5 },
    { id: "2", name: "Rose Water", family: "Floral", price: 185, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop", rating: 4 },
    { id: "3", name: "Sand & Cedar", family: "Woody", price: 195, img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop", rating: 5 },
    { id: "4", name: "Citrus Bloom", family: "Fresh", price: 160, img: "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=800&auto=format&fit=crop", rating: 4 },
    { id: "5", name: "Midnight Jasmine", family: "Floral", price: 225, img: "https://gallagherfragrances.com/cdn/shop/files/IMG_20211108_073607_428_efff03b4-c429-4eb9-8a00-f44a697a8e9c.jpg?v=1763482545", rating: 5 },
    { id: "6", name: "Velvet Moss", family: "Earthwy", price: 145, img: "https://pbs.twimg.com/media/G69H8UMXMAAm9V9.jpg", rating: 4 },
  ];

  const handleQuickAdd = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (product: any) => {
    const isInWish = isInWishlist(product.id);
    
    if (isInWish) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      // Create wishlist item with proper structure
      const wishlistItem = {
        id: product.id,
        name: product.name,
        brand: "Premium Brand", // You can add brand to your product data if needed
        price: product.price,
        imageUrl: product.img,
        inStock: true,
        // Add other required fields if your WishlistItem type needs them
      };
      
      addToWishlist(wishlistItem);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  // Filter products based on active category
  const filteredProducts = perfumes.filter(p => 
    activeCategory === 'All' || p.family === activeCategory
  );

  // Animation variants (keep same as before)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -8,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        type: "tween" as const
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const heartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300
      }
    }
  };

  const categoryVariants = {
    active: {
      color: "#000000",
      fontWeight: 600,
      x: 4,
      transition: {
        type: "spring" as const,
        stiffness: 300
      }
    },
    inactive: {
      color: "#57534e",
      x: 0
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#FDFCFB] pt-24 pb-12 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-64 space-y-8"
        >
          <div>
            <motion.h3 
              whileHover={{ x: 2 }}
              className="text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center"
            >
              <Filter className="w-3 h-3 mr-2" /> Categories
            </motion.h3>
            <ul className="space-y-3 text-sm">
              {['All', 'Woody', 'Floral', 'Fresh', 'Earthwy'].map(cat => (
                <motion.li 
                  key={cat}
                  variants={categoryVariants}
                  initial="inactive"
                  animate={activeCategory === cat ? "active" : "inactive"}
                  whileHover={{ x: 2 }}
                  className={`cursor-pointer transition ${activeCategory === cat ? 'text-black font-semibold' : 'text-stone-600'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            whileHover={{ x: 2 }}
          >
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4">Price Range</h3>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="range" 
              className="w-full accent-stone-800 cursor-pointer" 
              min="100" 
              max="300" 
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-2 uppercase tracking-widest">
              <span>$100</span>
              <span>$300</span>
            </div>
          </motion.div>
        </motion.aside>

        {/* Product Grid */}
        <main className="flex-1">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-8"
          >
            <span className="text-xs text-stone-400 uppercase tracking-widest">
              {filteredProducts.length} Fragrances
            </span>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/wishlist" 
                  className="text-xs uppercase tracking-widest hover:text-black transition flex items-center"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Wishlist
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/cart" 
                  className="text-xs uppercase tracking-widest hover:text-black transition flex items-center"
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Cart ({totalItems})
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
            >
              {filteredProducts.map((product) => {
                const isProductInWishlist = isInWishlist(product.id);
                
                return (
                  <motion.div 
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="group flex flex-col"
                  >
                    {/* Image Container */}
                    <motion.div 
                      variants={imageVariants}
                      className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6"
                    >
                      <motion.img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Hover Actions */}
                      <motion.div 
                        variants={buttonVariants}
                        initial="hidden"
                        whileHover="hover"
                        className="absolute inset-0 bg-black/5 flex items-end p-4"
                      >
                        <motion.button 
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleQuickAdd(product)}
                          className="w-full bg-white text-black py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition duration-300 shadow-xl"
                        >
                          Quick Add
                        </motion.button>
                      </motion.div>
                      
                      <motion.button 
                        variants={heartVariants}
                        initial="hidden"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleWishlistToggle(product)}
                        className={`absolute top-4 right-4 p-2 backdrop-blur-sm rounded-full ${
                          isProductInWishlist 
                            ? 'bg-red-500/90 hover:bg-red-600' 
                            : 'bg-white/80 hover:bg-white'
                        } transition-colors duration-300`}
                      >
                        <Heart className={`w-4 h-4 ${
                          isProductInWishlist 
                            ? 'fill-white text-white' 
                            : 'text-stone-600'
                        }`} />
                      </motion.button>
                    </motion.div>

                    {/* Details */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">{product.family}</p>
                        <motion.h2 
                          whileHover={{ x: 2 }}
                          className="text-lg font-serif mb-2"
                        >
                          {product.name}
                        </motion.h2>
                        <div className="flex items-center space-x-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Star className={`w-3 h-3 ${i < product.rating ? 'fill-stone-800' : 'text-stone-300'}`} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="font-serif italic text-lg"
                      >
                        ${product.price}
                      </motion.span>
                    </div>
                    
                    {/* Add to Cart Button (Visible on mobile) */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAdd(product)}
                      className="md:hidden mt-4 bg-black text-white py-2 text-xs uppercase tracking-widest hover:bg-stone-800 transition"
                    >
                      Add to Cart
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProductsPage;