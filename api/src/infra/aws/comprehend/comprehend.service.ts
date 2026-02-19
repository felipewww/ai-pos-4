import {
    ComprehendClient,
    StartDocumentClassificationJobCommand,
    DescribeDocumentClassificationJobCommand,
    InputDataConfig,
    JobNotFoundException,
} from "@aws-sdk/client-comprehend";
import { Readable } from "stream";
import * as zlib from "zlib";
import tar from "tar-stream";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {storageService} from "@/infra/config";
import {ComprehendJobDto} from "@/core/domain/types/comprehend/comprehend-job.dto";
import {StartClassificationJobCommand} from "@/infra/aws/comprehend/commands/start-classification-job.command"; // npm i tar-stream

export class ComprehendService {
    private comprehend: ComprehendClient;

    constructor(
        private readonly storageService: StorageService,
    ) {
        this.comprehend = new ComprehendClient();
    }

    watchJobStatus(
        comprehendJobId: string,
        transcribeJobId: string,
        cb: (dto: ComprehendJobDto, transcribeJobId: string) => void,
        tries: number = 0
    ) {
        console.log(`watching comprehend job status try ${tries} - ${comprehendJobId}`)

        this.getJob(comprehendJobId)
            .then(job => {
                // "NOT_FOUND" | "COMPLETED" | "FAILED" | "IN_PROGRESS" | "STOPPED" | "STOP_REQUESTED" | "SUBMITTED"
                if (
                    (
                        job.status === 'IN_PROGRESS'
                        || job.status === 'SUBMITTED'
                    )
                    && tries < 100
                ) {
                    setTimeout(() => {
                        this.watchJobStatus(comprehendJobId, transcribeJobId, cb, tries + 1)
                    }, 10000)
                } else {
                    // aguardar o arquivo ser copiado para o S3
                    setTimeout(() => {
                        cb(job, transcribeJobId)
                    }, 20000)
                }
            })
            .catch(console.error)

    }

    /** Consulta status do job no Comprehend */
    async getJob(jobId: string): Promise<ComprehendJobDto> {
        const result: ComprehendJobDto = {
            jobId,
            status: null,
            message: null,
            outputDataConfig: null,
            inputDataConfig: null,
            // submitTime: props?.SubmitTime,
            // endTime: props?.EndTime,
        }

        try {
            const response = await this.comprehend.send(
                new DescribeDocumentClassificationJobCommand({ JobId: jobId })
            );

            const props = response.DocumentClassificationJobProperties;

            result.status = props.JobStatus
            result.message = props?.Message
            result.outputDataConfig = props?.OutputDataConfig
            result.inputDataConfig = props?.InputDataConfig

            // return result;
        } catch (e) {
            if (e instanceof JobNotFoundException) {
                result.status = "NOT_FOUND"
            } else {
                throw e;
            }
        }

        return result
    }

    async startClassificationJob(args: StartClassificationJobCommand) {
        const inputDataConfig: InputDataConfig = {
            S3Uri: args.inputS3Uri,
            InputFormat: "ONE_DOC_PER_LINE", // cada linha = 1 doc :contentReference[oaicite:4]{index=4}
        };

        const outputDataConfig = {
            S3Uri: args.outputS3Uri, // prefix; Comprehend cria diretório do job e output.tar.gz :contentReference[oaicite:5]{index=5}
        };

        console.log(`sending job ${args.jobId} to comprehend`.green.bold)
        const comprehendResult = await this.comprehend.send(
            new StartDocumentClassificationJobCommand({
                JobName: `${args.jobId}`,
                DocumentClassifierArn: process.env.COMPREHEND_CLASSIFIER_ARN,
                DataAccessRoleArn: process.env.COMPREHEND_ROLE_ARN,
                InputDataConfig: inputDataConfig,
                OutputDataConfig: outputDataConfig,
            })
        );

        return comprehendResult;
    }

    // private async extractFileFromTarGz(gzStream: Readable, wantedName: string): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         const gunzip = zlib.createGunzip();
    //         const extract = tar.extract();
    //
    //         let found = false;
    //         const chunks: Buffer[] = [];
    //
    //         extract.on("entry", (header, stream, next) => {
    //             const name = header.name;
    //             if (name.endsWith(wantedName)) {
    //                 found = true;
    //                 stream.on("data", (d) => chunks.push(Buffer.from(d)));
    //                 stream.on("end", () => next());
    //                 stream.on("error", reject);
    //             } else {
    //                 stream.resume();
    //                 stream.on("end", () => next());
    //             }
    //         });
    //
    //         extract.on("finish", () => {
    //             if (!found) return reject(new Error(`Arquivo ${wantedName} não encontrado dentro do tar.gz`));
    //             resolve(Buffer.concat(chunks).toString("utf-8"));
    //         });
    //
    //         gzStream.pipe(gunzip).pipe(extract).on("error", reject);
    //     });
    // }
}

export const comprehendService = new ComprehendService(
    storageService,
);
