import { Mongo } from "@/infra/db/mongo/mongo";
import { TranscribedEntity, ITranscribedModel } from "@/application/data/mongo/models/transcribed.model";

export class TranscribedRepository extends Mongo {
    async save(model: Partial<ITranscribedModel>): Promise<ITranscribedModel> {
        const { id, ...rest } = model;

        const update = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== undefined)
        );

        if (id) {
            await TranscribedEntity.updateOne({ id }, { $set: update }, { upsert: true });
            return this.findById(id);
        }

        const transcribed = new TranscribedEntity(model);
        return transcribed.save();
    }

    async findById(id: string): Promise<ITranscribedModel> {
        return TranscribedEntity.findOne({ id });
    }

    async deleteById(id: string): Promise<void> {
        await TranscribedEntity.deleteOne({ id });
    }
}

export const transcribedRepository = new TranscribedRepository();
