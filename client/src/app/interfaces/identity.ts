export interface User {
    _id: string;
    email: string;
    username: string;
    password: string;
}
export interface Identity {
    token: string;
    user: User;
}
