import { Reservation } from "./Reservation";

export class Ticket{
    id: number;
    seat: string;
    reservation: Reservation;
    checkedIn: boolean;
}