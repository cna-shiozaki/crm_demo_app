import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    const uri = process.env.NODE_ENV === "production" ?
        "mongodb://mongo/northwind" :
        "mongodb://localhost:27017/cnaciri_demo";
    return await MongoClient.connect(uri);
};