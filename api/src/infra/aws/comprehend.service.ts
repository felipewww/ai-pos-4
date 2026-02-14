import {
    ComprehendClient,
    StartDocumentClassificationJobCommand,
    DescribeDocumentClassificationJobCommand,
    DocumentClassifierOutputDataConfig,
    InputDataConfig,
} from "@aws-sdk/client-comprehend";
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import * as zlib from "zlib";

// Minimal TAR extractor for a single file inside output.tar.gz (predictions.jsonl)
import tar from "tar-stream"; // npm i tar-stream
// NOTE: You also need: npm i @aws-sdk/client-s3 @aws-sdk/client-comprehend

type SubmitResult = {
    jobId: string;
    inputKey: string;
    outputPrefix: string;
};

type JobStatus =
    | "SUBMITTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "FAILED"
    | "STOP_REQUESTED"
    | "STOPPED";

export class ComprehendService {
    private s3: S3Client;
    private comprehend: ComprehendClient;

    constructor(
        private readonly cfg: {
            region: string;
            bucket: string; // bucket where transcribe-output + comprehend input/output live
            classifierArn: string; // your trained custom classifier ARN
            dataAccessRoleArn: string; // IAM role ARN for Comprehend jobs
            transcribeOutputPrefix?: string; // default: "transcribe-output/"
            comprehendInputPrefix?: string; // default: "comprehend-input/requests/"
            comprehendOutputPrefix?: string; // default: "comprehend-output/jobs/"
        }
    ) {
        this.s3 = new S3Client({ region: cfg.region });
        this.comprehend = new ComprehendClient({ region: cfg.region });
    }

    /**
     * Recebe a key do JSON do Transcribe no S3, extrai o transcript,
     * cria um input "ONE_DOC_PER_LINE" com 1 linha, e dispara o batch job do Comprehend.
     */
    async submitFromTranscribeJson(transcribeJsonKey: string): Promise<SubmitResult> {
        const jobId = randomUUID();

        const transcriptText = await this.extractTranscriptFromTranscribeJson(
            this.cfg.bucket,
            transcribeJsonKey
        );

        // ONE_DOC_PER_LINE: cada linha é um doc. Então 1 doc = 1 linha.
        const inputKey =
            (this.cfg.comprehendInputPrefix ?? "comprehend-input/requests/") + `${jobId}.txt`;

        await this.putTextFile(this.cfg.bucket, inputKey, transcriptText.replace(/\s+/g, " ").trim() + "\n");

        const outputPrefix =
            (this.cfg.comprehendOutputPrefix ?? "comprehend-output/jobs/") + `${jobId}/`;

        await this.startClassificationJob({
            jobId,
            inputS3Uri: `s3://${this.cfg.bucket}/${inputKey}`,
            outputS3Uri: `s3://${this.cfg.bucket}/${outputPrefix}`,
        });

        return { jobId, inputKey, outputPrefix };
    }

    /** Consulta status do job no Comprehend */
    async getJob(jobId: string) {
        const resp = await this.comprehend.send(
            new DescribeDocumentClassificationJobCommand({ JobId: jobId })
        );
        const props = resp.DocumentClassificationJobProperties;
        return {
            jobId,
            status: (props?.JobStatus as JobStatus) ?? "SUBMITTED",
            message: props?.Message,
            submitTime: props?.SubmitTime,
            endTime: props?.EndTime,
            outputDataConfig: props?.OutputDataConfig,
            inputDataConfig: props?.InputDataConfig,
        };
    }

    /**
     * Busca o resultado final do job:
     * - encontra o output.tar.gz no prefix de output
     * - extrai predictions.jsonl
     *
     * O Comprehend gera output.tar.gz para jobs assíncronos. :contentReference[oaicite:3]{index=3}
     */
    async getPredictionsJsonl(jobId: string, outputPrefix: string): Promise<string> {
        const tarGzKey = await this.findOutputTarGzKey(this.cfg.bucket, outputPrefix);
        if (!tarGzKey) {
            throw new Error(
                `Não encontrei output.tar.gz em s3://${this.cfg.bucket}/${outputPrefix} (jobId=${jobId}).`
            );
        }

        const gzStream = await this.getObjectStream(this.cfg.bucket, tarGzKey);
        const jsonl = await this.extractFileFromTarGz(gzStream, "predictions.jsonl");
        return jsonl;
    }

    // -----------------------
    // Internal helpers
    // -----------------------

    private async startClassificationJob(args: {
        jobId: string;
        inputS3Uri: string;
        outputS3Uri: string;
    }) {
        const inputDataConfig: InputDataConfig = {
            S3Uri: args.inputS3Uri,
            InputFormat: "ONE_DOC_PER_LINE", // cada linha = 1 doc :contentReference[oaicite:4]{index=4}
        };

        const outputDataConfig: DocumentClassifierOutputDataConfig = {
            S3Uri: args.outputS3Uri, // prefix; Comprehend cria diretório do job e output.tar.gz :contentReference[oaicite:5]{index=5}
        };

        await this.comprehend.send(
            new StartDocumentClassificationJobCommand({
                JobName: `job-${args.jobId}`,
                DocumentClassifierArn: this.cfg.classifierArn,
                DataAccessRoleArn: this.cfg.dataAccessRoleArn,
                InputDataConfig: inputDataConfig,
                // @ts-ignore
                OutputDataConfig: outputDataConfig,

            })
        );
    }

    private async extractTranscriptFromTranscribeJson(bucket: string, key: string): Promise<string> {
        const stream = await this.getObjectStream(bucket, key);
        const jsonText = await this.streamToString(stream);
        const obj = JSON.parse(jsonText);

        // No output JSON do Transcribe, o transcript aparece no topo em results.transcripts[]. :contentReference[oaicite:6]{index=6}
        const transcript =
            obj?.results?.transcripts?.[0]?.transcript ??
            obj?.results?.transcripts?.[0]?.transcriptText;

        if (!transcript || typeof transcript !== "string") {
            throw new Error(
                `Não encontrei results.transcripts[0].transcript no JSON do Transcribe (s3://${bucket}/${key}).`
            );
        }
        return transcript;
    }

    private async putTextFile(bucket: string, key: string, body: string) {
        await this.s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: "text/plain; charset=utf-8",
            })
        );
    }

    private async findOutputTarGzKey(bucket: string, prefix: string): Promise<string | null> {
        let ContinuationToken: string | undefined = undefined;
        do {
            const resp = await this.s3.send(
                new ListObjectsV2Command({
                    Bucket: bucket,
                    Prefix: prefix,
                    ContinuationToken,
                })
            );
            const match = (resp.Contents ?? []).find((o) => o.Key?.endsWith("output.tar.gz"));
            if (match?.Key) return match.Key;
            ContinuationToken = resp.NextContinuationToken;
        } while (ContinuationToken);

        return null;
    }

    private async getObjectStream(bucket: string, key: string): Promise<Readable> {
        const resp = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        const body = resp.Body;
        if (!body || !(body instanceof Readable)) {
            // In some runtimes, Body can be a WebStream; adjust if needed.
            throw new Error("S3 GetObject Body não é um Readable stream neste runtime.");
        }
        return body;
    }

    private async streamToString(stream: Readable): Promise<string> {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString("utf-8");
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
