import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Activity , Partaker} from "./model";
import connect from "./connect";

@odata.type(Activity)
export class ActivitiesController extends ODataController {
    @odata.GET
    async find(@odata.query query: ODataQuery): Promise<Activity[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Activities")
            .find(mongodbQuery.query)
            .project(mongodbQuery.projection)
            .skip(mongodbQuery.skip || 0)
            .limit(mongodbQuery.limit || 0)
            .sort(mongodbQuery.sort)
            .toArray();
        if (mongodbQuery.inlinecount) {
            (<any>result).inlinecount = await db.collection("Activities")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne(@odata.key key: string, @odata.query query: ODataQuery): Promise<Activity> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return db.collection("Activities").findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }


    @odata.POST
    async insert(@odata.body data: any): Promise<Activity> {
        const db = await connect();
        return await db.collection("Activities").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key: string, @odata.body data: any): Promise<Activity> {
        const db = await connect();
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return await db.collection("Activities").updateOne({ _id: keyId }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update(@odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();

        try { if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); } catch (err) { }
        let keyId;
        try {
            keyId = new ObjectID(key);
        }
        catch (err) {
            keyId = key;
        }
        return await db.collection("Activities").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return await db.collection("Activities").deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }
}



@odata.type(Partaker)
export class PartakersController extends ODataController {
    @odata.GET
    async find(@odata.query query: ODataQuery): Promise<Partaker[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection("Partakers")
            .find(mongodbQuery.query)
            .project(mongodbQuery.projection)
            .skip(mongodbQuery.skip || 0)
            .limit(mongodbQuery.limit || 0)
            .sort(mongodbQuery.sort)
            .toArray();
        if (mongodbQuery.inlinecount) {
            (<any>result).inlinecount = await db.collection("Partakers")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne(@odata.key key: string, @odata.query query: ODataQuery): Promise<Partaker> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return db.collection("Partakers").findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }


    @odata.POST
    async insert(@odata.body data: any): Promise<Partaker> {
        const db = await connect();
        return await db.collection("Partakers").insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert(@odata.key key: string, @odata.body data: any): Promise<Partaker> {
        const db = await connect();
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return await db.collection("Partakers").updateOne({ _id: keyId }, data, {
            upsert: true
        }).then((result) => {
            data._id = result.upsertedId
            return data._id ? data : null;
        });
    }

    @odata.PATCH
    async update(@odata.key key: string, @odata.body delta: any): Promise<number> {
        const db = await connect();

        try { if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); } catch (err) { }
        let keyId;
        try {
            keyId = new ObjectID(key);
        }
        catch (err) {
            keyId = key;
        }
        return await db.collection("Partakers").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove(@odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try { keyId = new ObjectID(key); } catch (err) { keyId = key; }
        return await db.collection("Partakers").deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }
}