"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const odata_v4_server_1 = require("odata-v4-server");
let Activity = class Activity {
};
__decorate([
    odata_v4_server_1.Edm.Key,
    odata_v4_server_1.Edm.Computed,
    odata_v4_server_1.Edm.String,
    odata_v4_server_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Activity identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Activity.prototype, "_id", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Activity.prototype, "Id", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Activity.prototype, "Description", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Activity.prototype, "Type", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Activity.prototype, "Statut", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Activity.prototype, "Note", void 0);
__decorate([
    odata_v4_server_1.Edm.String,
    odata_v4_server_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Activity name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Activity.prototype, "Motif", void 0);
Activity = __decorate([
    odata_v4_server_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Activities"
    })
], Activity);
exports.Activity = Activity;
let Partaker = class Partaker {
};
__decorate([
    odata_v4_server_1.Edm.Key,
    odata_v4_server_1.Edm.Computed,
    odata_v4_server_1.Edm.String,
    odata_v4_server_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Partaker identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Partaker.prototype, "_id", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Partaker.prototype, "ActivityId", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Partaker.prototype, "UserId", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Partaker.prototype, "UserFullName", void 0);
__decorate([
    odata_v4_server_1.Edm.String
], Partaker.prototype, "PartakerFunction", void 0);
Partaker = __decorate([
    odata_v4_server_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Partakers"
    })
], Partaker);
exports.Partaker = Partaker;
//# sourceMappingURL=model.js.map