export interface User {
    _id: string;
    email: string;
    username: string;
    password: string;
    friends?: string[];
    relationshipExists?: boolean;
}
export interface Identity {
    token: string;
    user: User;
}

export interface UsersResponse {
    status: string;
    users?: User[];
    user?: User;
}
