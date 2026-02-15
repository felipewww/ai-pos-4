import {Mongo} from "@/infra/db/mongo/mongo";
import mongoose, {Model, Schema} from "mongoose";

export enum ETranscriptionStatus {
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
}

export interface ITranscribedModel {
    id: string;
    path: string;
    filename: string;
    status: ETranscriptionStatus;
    content: string;
}

const transcribedSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        path: { type: String, required: true },
        filename: { type: String, required: true },
        status: { type: String, required: true },
        content: { type: String, required: false, nullable: true }
    },
    { timestamps: true }
);

export const TranscribedEntity: Model<ITranscribedModel> = mongoose.model<ITranscribedModel>(
    'transcribed',
    transcribedSchema
);
