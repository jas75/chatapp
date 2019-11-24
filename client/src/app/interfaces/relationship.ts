export interface Relationship {
    _id: string;
    sender: string;
    recipient: string;
    areFriends: boolean;
    messages: Message[];
}

export interface Message {
    _id: string;
    sender: string;
    content: string;
    dateCreation: Date;
}

export interface RelationshipResponse {
    status: string;
    relationships: Relationship[];
}