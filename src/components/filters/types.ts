export type ProductFilterPayload = {
  search: string;
  lineId?: number;
  isOffer?: boolean;
};

export type PaginatedSearch = ProductFilterPayload & {
  page?: number;
  limit?: number;
};
