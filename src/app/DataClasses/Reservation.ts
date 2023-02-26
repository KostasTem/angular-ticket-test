import { Ticket } from "./Ticket";

export class Reservation{
    id: number;
    tickets: Ticket[];
    timestamp: Date;
}