import {TranscribeEventInput} from "@/application/http/inputs/transcribe-event-input";
import {
    transcribedRepository,
    TranscribedRepository
} from "@/application/data/mongo/repositories/transcribed.repository";
import {ETranscriptionStatus} from "@/application/data/mongo/models/transcribed.model";

export class OnTranscribed {
    constructor(
        private readonly transcribedRepository: TranscribedRepository,
    ) {
    }

    async run(input: TranscribeEventInput) {
        console.log('input on event subscriber...'.red.bold)
        console.log(input)

        if (input.TranscriptionJobStatus === 'COMPLETED') {
            await this.transcribedRepository.save({
                id: input.TranscriptionJobName,
                status: ETranscriptionStatus.COMPLETED,
            })
        }
    }
}

export const onTranscribed = new OnTranscribed(
    transcribedRepository
);
