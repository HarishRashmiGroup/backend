import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User{
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property()
    email: string;

    @Property({default: null})
    otp: number | null;
    constructor({name, email}:{name: string, email: string}){
        this.name = name;
        this.email = email;
    }
}