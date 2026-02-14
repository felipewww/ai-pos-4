import {
    TranscribeClient,
    StartTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import {TranscribeObjectCommand} from "@/infra/aws/commands/transcribe-object.command";
import {DeterministicUUID} from "@/core/utils/deterministic-uuid";
import * as path from "node:path";
import * as fs from "node:fs";
// import {FilesUtils} from "@/core/utils/files.utils";
import {FilesUtils} from "@/infra/config";

export class TranscribeService {
    execute(command: TranscribeObjectCommand) {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const transcribe = new TranscribeClient({ region });

        const jobName = DeterministicUUID(command.filename);

        const outputFilename = `${command.filename}-${jobName}.json`;
        const OutputKey =  `transcribe-output/${outputFilename}`;

        const fileExists = fs.existsSync(path.join(process.cwd(), 'upload-success', outputFilename));

        if (fileExists) {
            console.log(`File ${command.filename} already exists in uploads directory. Should not transcribe again`.yellow.bold);
            console.log(jobName)
            return;
        }

        const cmd = new StartTranscriptionJobCommand({
            TranscriptionJobName: command.filename,
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

        transcribe.send(cmd)
            .then((response) => {
                console.log('transcribed successfully!'.green.bold)
                // console.log(response)

                // Move file from uploads to upload-success
                // const sourcePath = path.join(process.cwd(), 'uploads', command.filename);
                // const destPath = path.join(process.cwd(), 'upload-success', command.filename);

                FilesUtils.moveFile(
                    `uploads/${command.filename}`,
                    `upload-success/${command.filename}`
                )
                // if (fs.existsSync(sourcePath)) {
                //     fs.renameSync(sourcePath, destPath);
                //     console.log(`File moved to upload-success: ${command.filename}`.green);
                // }

            })
            .catch((err) => {
                console.log(`${jobName} error`)
                console.log(err);
            })
            .finally(() => {
                FilesUtils.downloadFile(OutputKey);
                // setTimeout(() => {
                //     this.downloadFile(OutputKey,);
                // }, 2000)
                // this.downloadFile(OutputKey);
                // const storageService = new StorageService();
                // storageService.download(OutputKey, 'upload-success')
                //     .catch(console.error)
            })
    }

    // private downloadFile(OutputKey: string, retries: number = 0) {
    //     const storageService = new StorageService();
    //     storageService.download(OutputKey, 'upload-success')
    //         .catch(console.error)
    // }
}
