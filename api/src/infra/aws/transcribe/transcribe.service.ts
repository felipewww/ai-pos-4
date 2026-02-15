import {
    TranscribeClient,
    StartTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import {TranscribeObjectCommand} from "@/infra/aws/commands/transcribe-object.command";
import {DeterministicUUID} from "@/core/utils/deterministic-uuid";
import * as path from "node:path";
import * as fs from "node:fs";
import {FilesUtils} from "@/infra/config";
import {analyzeHandler} from "@/application/domain/analyze.handler";

export class TranscribeService {
    async execute(command: TranscribeObjectCommand) {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const transcribe = new TranscribeClient({ region });

        const jobId = DeterministicUUID(command.filename);

        const outputFilename = `${jobId}.json`;
        const OutputKey =  `transcribe-output/${outputFilename}`;

        const transcribedFilePath = `data/upload-success/${outputFilename}`;

        const result = { transcribedFilePath, jobId }

        // if (FilesUtils.exists(transcribedFilePath)) {
        //     console.log(`File ${command.filename} already exists in uploads directory. Should not transcribe again`.yellow.bold);
        //     return result;
        // }

        const cmd = new StartTranscriptionJobCommand({
            TranscriptionJobName: jobId,
            LanguageCode: "pt-BR",
            MediaFormat: command.mediaFormat,
            Media: {
                MediaFileUri: command.mediaFileUri
            },
            OutputBucketName: bucket,
            OutputKey,

            // Opcional: melhora pontuação e formatação
            Settings: {
                ShowSpeakerLabels: false, // true se quiser diarização (atenção a limites)
                // MaxSpeakerLabels: 2,
                ChannelIdentification: false,
            },
        });

        await transcribe.send(cmd)

        return result;
    }
}
