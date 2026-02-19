import {TranscribeEventInput} from "@/application/http/inputs/transcribe-event-input";
import {
    transcribedRepository,
    TranscribedRepository
} from "@/application/data/mongo/repositories/transcribed.repository";
import {ETranscriptionStatus} from "@/application/data/mongo/models/transcribed.model";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {storageService} from "@/infra/config";
import {comprehendService, ComprehendService} from "@/infra/aws/comprehend/comprehend.service";
import {Defaults} from "@/core/defaults";
import {onComprehend} from "@/application/domain/events/on-comprehend";

type Trancripted = {
    results: {
        transcripts: {
            transcript: string
        }[]
    }
}

export class OnTranscribed {
    constructor(
        private readonly transcribedRepository: TranscribedRepository,
        private readonly storageService: StorageService,
        private readonly comprehendService: ComprehendService,
    ) {
    }

    async run(input: TranscribeEventInput) {
        console.log('input on event subscriber...'.red.bold)
        console.log(input)

        if (input.TranscriptionJobStatus === 'COMPLETED') {
            const fileId = input.TranscriptionJobName;
            await this.transcribedRepository.save({
                id: input.TranscriptionJobName,
                status: ETranscriptionStatus.TRANSCRIBED,
            })

            await this.saveToComprehend(fileId)

            const comprehendJobSubmitResult = await this.comprehendService.startClassificationJob({
                jobId: fileId,
                inputS3Uri: `${Defaults.S3_URI}/comprehend-input/${fileId}.txt`,
                outputS3Uri: `${Defaults.S3_URI}/comprehend-output/${fileId}`,
            })

            if (
                comprehendJobSubmitResult.JobStatus === 'FAILED'
                || comprehendJobSubmitResult.JobStatus === 'STOPPED'
                || comprehendJobSubmitResult.JobStatus === 'STOP_REQUESTED'
            ) {
                await this.transcribedRepository.save({
                    id: input.TranscriptionJobName,
                    status: ETranscriptionStatus.COMPREHEND_SUBMIT_FAILED,
                    comprehendJobId: comprehendJobSubmitResult.JobId,
                })
            } else {
                await this.transcribedRepository.save({
                    id: input.TranscriptionJobName,
                    status: ETranscriptionStatus.COMPREHEND_SUBMITTED,
                    comprehendJobId: comprehendJobSubmitResult.JobId,
                })

                this.comprehendService.watchJobStatus(
                    comprehendJobSubmitResult.JobId,
                    fileId,
                    onComprehend.run,
                )
            }
        }
    }

    private async saveToComprehend(jobId: string) {
        const fileContent = await this.storageService.read(
            `transcribe-output/${jobId}.json`
        );

        const data = JSON.parse(fileContent) as Trancripted
        const transcriptText = data.results.transcripts[0].transcript;

        await this.storageService.upload({
            folder: 'comprehend-input/',
            filename: `${jobId}.txt`,
            contentType: "text/plain; charset=utf-8",
            body: transcriptText,
        })
    }
}

export const onTranscribed = new OnTranscribed(
    transcribedRepository,
    storageService,
    comprehendService,
);
