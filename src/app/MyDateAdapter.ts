import {NgxMatNativeDateAdapter} from '@angular-material-components/datetime-picker'
import { Injectable } from '@angular/core';

@Injectable()
export class MyDateAdapter extends NgxMatNativeDateAdapter{
    override format(date: Date, displayFormat: Object): string {
        date.setSeconds(0);
        const year = date.getFullYear();
        const month = date.getMonth() + 1<10 ? "0"+(date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    override parse(value: any): Date | null {
        const date = new Date(value);
        return date!=null ? date : null;
    }
}