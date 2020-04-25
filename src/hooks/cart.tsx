import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // LOAD ITEMS FROM ASYNC STORAGE
      const storedProducts = await AsyncStorage.getItem(
        '@GoMarketPlace:products',
      );

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // ADD A NEW ITEM TO THE CART

      const items = [...products];

      // Seacrh if the product is already in the cart
      const cartProductIndex = items.findIndex(
        cartItem => cartItem.id === product.id,
      );

      if (cartProductIndex !== -1) {
        const cartProduct = items[cartProductIndex];
        cartProduct.quantity += 1;
        items[cartProductIndex] = cartProduct;
      } else {
        items.push({ ...product, quantity: 1 });
      }

      setProducts(items);

      // await AsyncStorage.multiSet([
      //   ['@GoMarketPlace:products', JSON.stringify(items)],
      // ]);

      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(items),
      );

      // // Seacrh if the product is already in the cart
      // const cartProductIndex = products.findIndex(
      //   cartItem => cartItem.id === product.id,
      // );

      // If the product is already in the cart updates it's quantitty
      // else add the product in the cart
      // if (cartProductIndex >= 0) {
      //   const cartProduct = products[cartProductIndex];
      //   cartProduct.quantity += 1;
      //   products[cartProductIndex] = cartProduct;
      //   await AsyncStorage.multiSet([
      //     ['@GoMarketPlace:products', JSON.stringify([...products])],
      //   ]);
      //   setProducts([...products]);
      // } else {
      //   await AsyncStorage.multiSet([
      //     [
      //       '@GoMarketPlace:products',
      //       JSON.stringify([...products, { ...product, quantity: 1 }]),
      //     ],
      //   ]);
      //   setProducts([...products, { ...product, quantity: 1 }]);
      // }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // INCREMENTS A PRODUCT QUANTITY IN THE CART
      // const cartProductIndex = products.findIndex(
      //   cartItem => cartItem.id === id,
      // );

      // if (cartProductIndex >= 0) {
      //   const cartProduct = products[cartProductIndex];
      //   cartProduct.quantity += 1;
      //   products[cartProductIndex] = cartProduct;
      // }

      // await AsyncStorage.multiSet([
      //   ['@GoMarketPlace:products', JSON.stringify([...products])],
      // ]);
      // setProducts([...products]);

      const items = [...products];

      const productIndex = items.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        const product = items[productIndex];
        product.quantity += 1;

        setProducts(items);
      }

      // await AsyncStorage.multiSet([
      //   ['@GoMarketPlace:products', JSON.stringify(items)],
      // ]);

      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(items),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // // DECREMENTS A PRODUCT QUANTITY IN THE CART
      // const cartProductIndex = products.findIndex(
      //   cartItem => cartItem.id === id,
      // );

      // if (cartProductIndex >= 0) {
      //   const cartProduct = products[cartProductIndex];
      //   cartProduct.quantity -= 1;
      //   products[cartProductIndex] = cartProduct;
      // }

      // await AsyncStorage.multiSet([
      //   ['@GoMarketPlace:products', JSON.stringify([...products])],
      // ]);
      // setProducts([...products]);

      const items = [...products];

      const productIndex = items.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        const product = items[productIndex];
        product.quantity -= 1;

        setProducts(items);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(items),
      );

      // await AsyncStorage.multiSet([
      //   ['@GoMarketPlace:products', JSON.stringify(items)],
      // ]);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
