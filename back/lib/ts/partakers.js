"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
exports.default = [
    {
        "_id": new mongodb_1.ObjectID(),
        "ActivityId": "1001",
        "UserId": "cnaciri",
        "UserFullName": "Christophe NACIRI",
        "PartakerFunction": "Créateur"
    },
    {
        "_id": new mongodb_1.ObjectID(),
        "ActivityId": "1001",
        "UserId": "cnaciri2",
        "UserFullName": "Christophe NACIRI",
        "PartakerFunction": "Payeur"
    },
    {
        "_id": new mongodb_1.ObjectID(),
        "ActivityId": "1002",
        "UserId": "cnaciri3",
        "UserFullName": "Christophe NACIRI",
        "PartakerFunction": "Créateur"
    }
];
//# sourceMappingURL=partakers.js.map