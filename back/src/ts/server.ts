
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ActivitiesController, PartakersController } from "./controller";



@odata.cors
@odata.namespace("cnaciri_demo")
@odata.controller(ActivitiesController, true)
@odata.controller(PartakersController, true)
export class defiServer extends ODataServer {
    @Edm.ActionImport
    async initDb() {
        /*   
            We could init the database content here: 
                const db = await connect();
                await db.dropDatabase();
                await db.collection("Activities").insertMany(activities);
                
            But for now, we prefer to run the mongodb_setup script for this task */
    }
}