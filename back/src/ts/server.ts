import { ObjectID } from "mongodb";
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ActivitiesController, PartakersController } from "./controller";
import connect from "./connect";
import { Activity } from "./model";
import activities from "./activities";
import partakers from "./partakers";


@odata.cors
@odata.namespace("cnaciri_demo")
@odata.controller(ActivitiesController, true)
@odata.controller(PartakersController, true)
export class defiServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){ 
/*         const db = await connect();
        await db.dropDatabase();
        await db.collection("Activities").insertMany(activities);
        await db.collection("Partakers").insertMany(partakers); */
    }
}