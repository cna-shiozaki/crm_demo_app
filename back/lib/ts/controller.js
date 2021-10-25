"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const mongodb_1 = require("mongodb");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const odata_v4_server_1 = require("odata-v4-server");
const model_1 = require("./model");
const connect_1 = require("./connect");
let ActivitiesController = class ActivitiesController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : yield db.collection("Activities")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
            if (mongodbQuery.inlinecount) {
                result.inlinecount = yield db.collection("Activities")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
            }
            return result;
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return db.collection("Activities").findOne({ _id: keyId }, {
                fields: mongodbQuery.projection
            });
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            return yield db.collection("Activities").insertOne(data).then((result) => {
                data._id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Activities").updateOne({ _id: keyId }, data, {
                upsert: true
            }).then((result) => {
                data._id = result.upsertedId;
                return data._id ? data : null;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            try {
                if (delta.CategoryId)
                    delta.CategoryId = new mongodb_1.ObjectID(delta.CategoryId);
            }
            catch (err) { }
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Activities").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Activities").deleteOne({ _id: keyId }).then(result => result.deletedCount);
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], ActivitiesController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.query)
], ActivitiesController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], ActivitiesController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], ActivitiesController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], ActivitiesController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], ActivitiesController.prototype, "remove", null);
ActivitiesController = __decorate([
    odata_v4_server_1.odata.type(model_1.Activity)
], ActivitiesController);
exports.ActivitiesController = ActivitiesController;
let PartakersController = class PartakersController extends odata_v4_server_1.ODataController {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            if (typeof mongodbQuery.query._id == "string")
                mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
            let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : yield db.collection("Partakers")
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
            if (mongodbQuery.inlinecount) {
                result.inlinecount = yield db.collection("Partakers")
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
            }
            return result;
        });
    }
    findOne(key, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            const mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return db.collection("Partakers").findOne({ _id: keyId }, {
                fields: mongodbQuery.projection
            });
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            return yield db.collection("Partakers").insertOne(data).then((result) => {
                data._id = result.insertedId;
                return data;
            });
        });
    }
    upsert(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Partakers").updateOne({ _id: keyId }, data, {
                upsert: true
            }).then((result) => {
                data._id = result.upsertedId;
                return data._id ? data : null;
            });
        });
    }
    update(key, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            try {
                if (delta.CategoryId)
                    delta.CategoryId = new mongodb_1.ObjectID(delta.CategoryId);
            }
            catch (err) { }
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Partakers").updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield connect_1.default();
            let keyId;
            try {
                keyId = new mongodb_1.ObjectID(key);
            }
            catch (err) {
                keyId = key;
            }
            return yield db.collection("Partakers").deleteOne({ _id: keyId }).then(result => result.deletedCount);
        });
    }
};
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.query)
], PartakersController.prototype, "find", null);
__decorate([
    odata_v4_server_1.odata.GET,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.query)
], PartakersController.prototype, "findOne", null);
__decorate([
    odata_v4_server_1.odata.POST,
    __param(0, odata_v4_server_1.odata.body)
], PartakersController.prototype, "insert", null);
__decorate([
    odata_v4_server_1.odata.PUT,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], PartakersController.prototype, "upsert", null);
__decorate([
    odata_v4_server_1.odata.PATCH,
    __param(0, odata_v4_server_1.odata.key), __param(1, odata_v4_server_1.odata.body)
], PartakersController.prototype, "update", null);
__decorate([
    odata_v4_server_1.odata.DELETE,
    __param(0, odata_v4_server_1.odata.key)
], PartakersController.prototype, "remove", null);
PartakersController = __decorate([
    odata_v4_server_1.odata.type(model_1.Partaker)
], PartakersController);
exports.PartakersController = PartakersController;
//# sourceMappingURL=controller.js.map