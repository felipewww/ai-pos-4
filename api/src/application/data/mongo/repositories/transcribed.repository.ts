import mongoose, { Document, Model, Schema } from 'mongoose';
import { Mongo } from "@/infra/db/mongo/mongo";
import {TranscribedEntity, ITranscribedModel} from "@/application/data/mongo/models/transcribed.model";

export class TranscribedRepository extends Mongo {
    // constructor() {
    //     super();
    //     // this.connection.connect().catch(err => {
    //     //     console.error('Failed to connect to MongoDB in TranscribedRepository:', err);
    //     // });
    // }

    async save(model: ITranscribedModel): Promise<ITranscribedModel> {
        const transcribed = new TranscribedEntity(model);
        return transcribed.save();
    }

    async findById(id: string): Promise<ITranscribedModel | null> {
        return TranscribedEntity.findOne({ id });
    }
}

export const transcribedRepository = new TranscribedRepository();
