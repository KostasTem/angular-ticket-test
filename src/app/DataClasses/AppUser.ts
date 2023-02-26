import { Performance } from "./Performance";
export class AppUser{
    email: string;
    password: string;
    roles: string[];
    expiration: Date;
    firstName: string;
    lastName: string;
    image: string;
    age: number;
    provider: string;
    performance:Performance;
    constructor(email:string,roles:string[],expiration:Date){
        this.email = email;
        this.roles = roles;
        this.expiration = expiration;
    }
}