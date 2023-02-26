import { Performance } from "./Performance";
import { Auditorium } from "./Auditorium";

export class Show{
    constructor(id:number,date:Date,performance:Performance,auditorium:Auditorium){
        this.id = id;
        this.dateTime = date;
        this.performance = performance;
        this.auditorium = auditorium;
    }
    id: number;
    dateTime: Date;
    performance: Performance;
    auditorium: Auditorium;
}