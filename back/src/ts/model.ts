import { ObjectID } from "mongodb";
import { Edm, odata } from "odata-v4-server";
import connect from "./connect";

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Activities"
})
export class Activity{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Activity identifier"
    },
    {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
    _id:ObjectID

    @Edm.String
    Id:string

    @Edm.String
    Description:string

    @Edm.String
    Type:string

    @Edm.String
    Statut:string    

    @Edm.String
    Note:string    

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Activity name"
    },
    {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    Motif:string

}

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Partakers"
})
export class Partaker {
    @Edm.Key
    @Edm.Computed
    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Partaker identifier"
    },
    {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })    
    _id:ObjectID

    @Edm.String
    ActivityId:ObjectID

    @Edm.String
    UserId:string
    
    @Edm.String
    UserFullName:string

    @Edm.String
    PartakerFunction:string
}