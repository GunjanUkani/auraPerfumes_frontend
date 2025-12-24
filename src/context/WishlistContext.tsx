import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number; // ✅ Added this property
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        return state; // already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }
    case 'REMOVE_FROM_WISHLIST': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems
      };
    }
    case 'CLEAR_WISHLIST':
      return { items: [] };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const value = useMemo(() => {
    const addToWishlist = (item: WishlistItem) => {
      const exists = state.items.some(wishlistItem => wishlistItem.id === item.id);
      if (!exists) {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
        toast.success(`${item.name} added to wishlist!`);
      }
    };

    const removeFromWishlist = (id: string) => {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
      toast.success('Removed from wishlist');
    };

    const clearWishlist = () => {
      dispatch({ type: 'CLEAR_WISHLIST' });
      toast.success('Wishlist cleared');
    };

    const isInWishlist = (id: string) => {
      return state.items.some(item => item.id === id);
    };

    return {
      wishlist: state.items,
      wishlistCount: state.items.length, // ✅ Directly calculate count
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist
    };
  }, [state.items]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};