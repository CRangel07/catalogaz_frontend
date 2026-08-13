import type { TicketItem } from '@/stores/ticket.store';

export type CompucajaMovement = 'salidaInventario' | 'ticketCobro';

export type Ticket = {
  file: File | null;
  mov: CompucajaMovement;
  products: TicketItem[];
  instruction: string;
};
