import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface CartItem {
  productId: bigint;
  productName: string;
  priceInCents: bigint;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce(
    (sum, i) => sum + Number(i.priceInCents) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
