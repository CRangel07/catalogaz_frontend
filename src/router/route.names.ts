export const RouteNames = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  Auth: {
    ADMIN_LOGIN: 'catalogaz_auth_admin_login',
    CUSTOMER_LOGIN: 'catalogaz_auth_customer_login',
  },

  // ── Catálogo (cliente + admin) ───────────────────────────────────────────────
  Catalog: {
    PRODUCTS: 'catalogaz_catalog_products',
    MY_ORDERS: 'catalogaz_catalog_my_orders',
  },

  // ── Panel admin ──────────────────────────────────────────────────────────────
  Admin: {
    HOME: 'catalogaz_admin_home',
    PRODUCTS: 'catalogaz_admin_products',
    PRODUCTS_NOSTOCK: 'catalogaz_catalog_products_no',
    ORDERS: 'catalogaz_admin_orders',
    CLIENTS: 'catalogaz_admin_clients',
    SETTINGS: 'catalogaz_admin_settings',
  },

  // ── Generales ────────────────────────────────────────────────────────────────
  NOT_FOUND: 'catalogaz_not_found',
  UNAUTHORIZED: 'catalogaz_unauthorized',
} as const;

type NestedValues<T> = T extends string ? T : T extends object ? NestedValues<T[keyof T]> : never;

export type RouteName = NestedValues<typeof RouteNames>;
