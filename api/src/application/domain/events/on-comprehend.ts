import {ComprehendJobDto} from "@/core/domain/types/comprehend/comprehend-job.dto";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {storageService} from "@/infra/config";
import {Readable} from "stream";
import * as zlib from "zlib";
import * as tar from "tar-stream";
import {ComprehendJobStatus} from "@/core/domain/types/comprehend/comprehend-job-status";
import {InputDataConfig, OutputDataConfig} from "@aws-sdk/client-comprehend";

export class OnComprehend {
    constructor(
        private readonly storageService: StorageService,
    ) {
    }

    async run(input: ComprehendJobDto, transcribeJobId: string) {
        console.log('on comprehend received'.green.bold)
        console.log(input)
        if (input.status === 'COMPLETED') {
            // const tarGzKey = await this.findOutputTarGzKey(this.cfg.bucket, outputPrefix);
            const tarGzKey = await this.storageService.findFile("output.tar.gz", `comprehend-output/${transcribeJobId}/`);

            if (!tarGzKey) {
                throw new Error(
                    // `Não encontrei output.tar.gz em s3://${this.cfg.bucket}/${outputPrefix} (jobId=${jobId}).`
                    `Não encontrei output.tar.gz em comprehend-output/${transcribeJobId}`
                );
            }

            const gzStream = await this.storageService.readTgz(tarGzKey);
            // const gzStream = await this.storageService.read(tarGzKey);

            // console.log(gzStream)
            const jsonl = await this.extractFileFromTarGz(gzStream, "predictions.jsonl");

            console.log(jsonl)

            // return jsonl;
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
    storageService
);

setTimeout(() => {

    onComprehend.run({
        jobId: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
        status: 'COMPLETED',
        message: 'string',
        outputDataConfig: null,
        inputDataConfig: null,
    }, 'F40A-18BC-41C2-7A53')
        .catch(console.error)

}, 2000)
