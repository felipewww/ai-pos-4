import {ComprehendJobDto} from "@/core/domain/types/comprehend/comprehend-job.dto";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {storageService} from "@/infra/config";
import {Readable} from "stream";
import * as zlib from "zlib";
import * as tar from "tar-stream";
import {
    transcribedRepository,
    TranscribedRepository
} from "@/application/data/mongo/repositories/transcribed.repository";
import {ETranscriptionStatus, Predictions} from "@/application/data/mongo/models/transcribed.model";
import {riskEngineService, RiskEngineService} from "@/infra/services/risk-engine/risk-engine.service";

export class OnComprehend {
    constructor(
        private readonly storageService: StorageService,
        private readonly transcribedRepository: TranscribedRepository,
        private readonly riskEngineService: RiskEngineService
    ) {
    }

    async run(input: ComprehendJobDto, transcribeJobId: string) {
        console.log('on comprehend received'.green.bold)
        console.log(input)
        if (input.status === 'COMPLETED') {
            const tarGzKey = await this.storageService.findFile("output.tar.gz", `comprehend-output/${transcribeJobId}/`);

            if (!tarGzKey) {
                throw new Error(
                    // `Não encontrei output.tar.gz em s3://${this.cfg.bucket}/${outputPrefix} (jobId=${jobId}).`
                    `Não encontrei output.tar.gz em comprehend-output/${transcribeJobId}`
                );
            }

            const gzStream = await this.storageService.readTgz(tarGzKey);
            const jsonl = await this.extractFileFromTarGz(gzStream, "predictions.jsonl");

            const predictions = JSON.parse(jsonl) as Predictions

            await this.transcribedRepository.save({
                id: transcribeJobId,
                status: ETranscriptionStatus.COMPREHEND_COMPLETED,
                predictions,
            })

            const riskResult = await this.riskEngineService.predictRisk(predictions)

            await this.transcribedRepository.save({
                id: transcribeJobId,
                status: ETranscriptionStatus.RISK_ANALYSIS_COMPLETED,
                risk: riskResult.data,
            })

            console.log('\n--')
            console.log(riskResult.data)
            console.log('\n--')
            console.log(predictions)
        }
    }

    private async extractFileFromTarGz(gzStream: Readable, wantedName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const gunzip = zlib.createGunzip();
            const extract = tar.extract();

            let found = false;
            const chunks: Buffer[] = [];

            extract.on("entry", (header, stream, next) => {
                const name = header.name;
                if (name.endsWith(wantedName)) {
                    found = true;
                    stream.on("data", (d) => chunks.push(Buffer.from(d)));
                    stream.on("end", () => next());
                    stream.on("error", reject);
                } else {
                    stream.resume();
                    stream.on("end", () => next());
                }
            });

            extract.on("finish", () => {
                if (!found) return reject(new Error(`Arquivo ${wantedName} não encontrado dentro do tar.gz`));
                resolve(Buffer.concat(chunks).toString("utf-8"));
            });

            gzStream.pipe(gunzip).pipe(extract).on("error", reject);
        });
    }
}

export const onComprehend = new OnComprehend(
    storageService,
    transcribedRepository,
    riskEngineService,
);

setTimeout(() => {
    onComprehend.run({
        jobId: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
        status: 'COMPLETED',
        message: 'string',
        outputDataConfig: null,
        inputDataConfig: null,
    }, '89B3-12D8-2A6C-A7AE')
        .catch(console.error)
}, 2000)
