export class User {
    email: string;
    token: string;
    refreshToken: string = null;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}
