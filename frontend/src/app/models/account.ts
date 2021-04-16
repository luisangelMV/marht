import { Role } from "./roles";

export class Account {
    constructor(id = "", name = "", lastName = "", email = "", company = "", state = "", phone = 0, password = "", passwordConfirm = "") {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.company = company;
        this.state = state;
        this.phone = phone;
        this.password = password;
        this.passwordConfirm = passwordConfirm;

    }
    id: string;
    name: string;
    lastName: string;
    email: string;
    company: string;
    state: string;
    phone: number;
    password: string;
    passwordConfirm: string;
    role: Role;
    jwtToken?: string;
}