import {AnalyzeCommand} from "@/core/domain/commands/analyze.command";
import {FilesUtils, storageService} from "@/infra/config";
import {NotFoundError} from "@/core/errors/not-found-error";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {
    transcribedRepository,
    TranscribedRepository
} from "@/application/data/mongo/repositories/transcribed.repository";
import {comprehendService, ComprehendService} from "@/infra/aws/comprehend/comprehend.service";
import {JobStatus} from "@aws-sdk/client-comprehend";
import {ComprehendJobStatus} from "@/core/domain/types/comprehend/comprehend-job-status";
import {Defaults} from "@/core/defaults";

// type Trancripted = {
//     results: {
//         transcripts: {
//             transcript: string
//         }[]
//     }
// }

class AnalyzeHandler {
    constructor(
        private readonly storageService: StorageService,
        private readonly comprehendService: ComprehendService,
        private readonly transcribedRepository: TranscribedRepository
    ) {
    }

    async run(command: AnalyzeCommand) {
        // console.log(command.jobId)
        // const transcribeContent = FilesUtils.readFile(`data/upload-success/${command.jobId}.json`);
        // console.log(transcribeContent)

        const entity = await this.transcribedRepository.findById(command.jobId)
        // console.log(entity)
        if (!entity) {

            const comprehendJob = await this.comprehendService.getJob(command.jobId)

            // const s3Uri = `s3://${process.env.S3_BUCKET}`;

            if (comprehendJob.status === ComprehendJobStatus.NOT_FOUND) {

                // await this.saveToComprehend(command);

                await this.comprehendService.startClassificationJob({
                    jobId: command.jobId,
                    inputS3Uri: `${Defaults.S3_URI}/transcribe-output/${command.jobId}.json`,
                    outputS3Uri: `${Defaults.S3_URI}/comprehend-output/jobs/${command.jobId}/`,
                })
            }
            // try {
            //     console.log(comprehendJob)
            // } catch (e) {
            //
            // }


        }



        // throw new NotFoundError()
    }

    // private async saveToComprehend(command: AnalyzeCommand) {
    //     const fileContent = await this.storageService.read(
    //         `transcribe-output/${command.jobId}.json`
    //     );
    //
    //     const data = JSON.parse(fileContent) as Trancripted
    //     const transcriptText = data.results.transcripts[0].transcript;
    //
    //     await this.storageService.upload({
    //         folder: 'comprehend-input/',
    //         filename: `${command.jobId}.txt`,
    //         contentType: "text/plain; charset=utf-8",
    //         body: transcriptText,
    //     })
    // }
}

export const analyzeHandler = new AnalyzeHandler(
    storageService,
    comprehendService,
    transcribedRepository
);
