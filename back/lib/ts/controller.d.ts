import { ODataController, ODataQuery } from "odata-v4-server";
import { Activity, Partaker } from "./model";
export declare class ActivitiesController extends ODataController {
    find(query: ODataQuery): Promise<Activity[]>;
    findOne(key: string, query: ODataQuery): Promise<Activity>;
    insert(data: any): Promise<Activity>;
    upsert(key: string, data: any): Promise<Activity>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
}
export declare class PartakersController extends ODataController {
    find(query: ODataQuery): Promise<Partaker[]>;
    findOne(key: string, query: ODataQuery): Promise<Partaker>;
    insert(data: any): Promise<Partaker>;
    upsert(key: string, data: any): Promise<Partaker>;
    update(key: string, delta: any): Promise<number>;
    remove(key: string): Promise<number>;
}
