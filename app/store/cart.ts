import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  stock: number;
}

interface CartState {
  cartItems: CartItem[];
  isSidebarOpen: boolean;
}

interface CartActions {
  addItemToCart: (product: Product, quantity: number) => void;
  updateCartItemQuantity: (productId: string, newQuantity: number) => void;
  removeCartItem: (productId: string) => void;
  clearCart: () => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  toggleSidebar: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      cartItems: [],
      isSidebarOpen: false,

      addItemToCart: (product, quantity) => {
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item: CartItem) => item.productId === product.id
          );

          if (existingItemIndex > -1) {
            const currentItem = state.cartItems[existingItemIndex];
            const newTotalQuantity = currentItem.quantity + quantity;

            if (newTotalQuantity > product.stock) {
              console.warn(
                `No se puede añadir más de ${product.stock} unidades de ${product.name}.`
              );
              return;
            }
            currentItem.quantity = newTotalQuantity;
          } else {
            if (quantity > product.stock) {
              console.warn(
                `La cantidad inicial de ${product.name} excede el stock disponible.`
              );
              return;
            }
            state.cartItems.push({
              productId: product.id,
              productName: product.name,
              quantity,
              price: product.price,
              stock: product.stock,
            });
          }
        });
      },

      updateCartItemQuantity: (productId, newQuantity) => {
        set((state) => {
          const itemToUpdate = state.cartItems.find(
            (item: CartItem) => item.productId === productId
          );

          if (itemToUpdate) {
            if (newQuantity <= 0) {
              state.cartItems = state.cartItems.filter(
                (item: CartItem) => item.productId !== productId
              );
              return;
            }

            if (newQuantity > itemToUpdate.stock) {
              console.warn(
                `No se puede exceder el stock de ${itemToUpdate.productName}.`
              );
              itemToUpdate.quantity = itemToUpdate.stock;
              return;
            }
            itemToUpdate.quantity = newQuantity;
          }
        });
      },

      removeCartItem: (productId) => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (item: CartItem) => item.productId !== productId
          );
        });
      },

      clearCart: () => set({ cartItems: [] }),

      onOpenSidebar: () => set({ isSidebarOpen: true }),
      onCloseSidebar: () => set({ isSidebarOpen: false }),
      toggleSidebar: () =>
        set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen;
        }),
    })),
    {
      name: "shopping-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
