export const AllRoles = ['admin', 'customer', 'pedidos', 'caja'] as const;
export const AdminPermission = ['admin'] as const;

export type Role = (typeof AllRoles)[number];
