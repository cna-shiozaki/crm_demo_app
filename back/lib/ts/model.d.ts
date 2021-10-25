import { ObjectID } from "mongodb";
export declare class Activity {
    _id: ObjectID;
    Id: string;
    Description: string;
    Type: string;
    Statut: string;
    Note: string;
    Motif: string;
}
export declare class Partaker {
    _id: ObjectID;
    ActivityId: ObjectID;
    UserId: string;
    UserFullName: string;
    PartakerFunction: string;
}
