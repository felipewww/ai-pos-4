import {MongoConnection} from "@/infra/db/mongo/mongo-connection";

export abstract class Mongo {
    protected connection: MongoConnection;

    constructor() {
        this.connection = MongoConnection.getInstance();
    }
}
