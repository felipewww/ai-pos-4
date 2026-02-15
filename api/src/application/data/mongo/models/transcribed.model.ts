import {Mongo} from "@/infra/db/mongo/mongo";
import mongoose, {Model, Schema} from "mongoose";

export interface ITranscribedModel extends Document {
    id: string;
    content: string;
}

const transcribedSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        content: { type: String, required: true }
    },
    { timestamps: true }
);

export const TranscribedEntity: Model<ITranscribedModel> = mongoose.model<ITranscribedModel>(
    'transcribed',
    transcribedSchema
);
