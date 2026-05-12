export function resolveUnitPrice(item: {
  qty: number;
  price1: number;
  price4: number;
  salePrice?: number | null;
  isOffer: boolean;
}): number {
  if (item.isOffer && item.salePrice) {
    return item.salePrice;
  }

  return item.qty >= 4 ? item.price4 : item.price1;
}
