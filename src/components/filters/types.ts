export type BasicSearch = {
  search: string;
};

export type PaginatedSearch = {
  search: string;
  page?: number;
  limit?: number;
};
