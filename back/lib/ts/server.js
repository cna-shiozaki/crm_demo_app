"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const odata_v4_server_1 = require("odata-v4-server");
const controller_1 = require("./controller");
let defiServer = class defiServer extends odata_v4_server_1.ODataServer {
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            /*         const db = await connect();
                    await db.dropDatabase();
                    await db.collection("Activities").insertMany(activities);
                    await db.collection("Partakers").insertMany(partakers); */
        });
    }
};
__decorate([
    odata_v4_server_1.Edm.ActionImport
], defiServer.prototype, "initDb", null);
defiServer = __decorate([
    odata_v4_server_1.odata.cors,
    odata_v4_server_1.odata.namespace("cnaciri_demo"),
    odata_v4_server_1.odata.controller(controller_1.ActivitiesController, true),
    odata_v4_server_1.odata.controller(controller_1.PartakersController, true)
], defiServer);
exports.defiServer = defiServer;
//# sourceMappingURL=server.js.map