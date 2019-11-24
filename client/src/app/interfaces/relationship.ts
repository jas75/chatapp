export interface Relationship {
    _id: string;
    sender: string;
    recipient: string;
    areFriends: boolean;
}

export interface RelationshipResponse {
    status: string;
    relationships: Relationship[]
}