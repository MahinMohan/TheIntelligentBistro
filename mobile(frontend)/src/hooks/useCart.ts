import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';

export function useCart(menu: MenuItem[] = []) {
  const store = useCartStore();

  const getSubtotal = () =>
    store.items.reduce((sum, cartItem) => {
      const menuItem = menu.find((m) => m.id === cartItem.itemId);
      return sum + (menuItem?.price ?? 0) * cartItem.quantity;
    }, 0);

  const getTax = () => getSubtotal() * 0.08;

  const getTotal = () => getSubtotal() + getTax();

  return {
    ...store,
    getSubtotal,
    getTax,
    getTotal,
  };
}
