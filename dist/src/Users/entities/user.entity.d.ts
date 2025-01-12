export declare class User {
    id: number;
    name: string;
    email: string;
    otp: number | null;
    constructor({ name, email }: {
        name: string;
        email: string;
    });
}
