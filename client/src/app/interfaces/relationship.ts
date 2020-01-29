import { User } from './identity';

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


export interface Room {
    relationship: Relationship;
    contact: User;
}

export interface RelationshipResponse {
    status: string;
    relationships: Relationship[];
}

export interface RoomResponse {
    status: string;
    rooms: Room[];
}
