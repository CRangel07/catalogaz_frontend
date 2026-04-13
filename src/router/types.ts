export const AdminCustomerPermission = ['admin', 'customer'] as const;
export const AdminPermission = ['admin'] as const;

export type Role = (typeof AdminCustomerPermission)[number];
