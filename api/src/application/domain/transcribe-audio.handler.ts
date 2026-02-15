import {TranscribeAudioCommand} from "@/core/domain/commands/transcribe-audio.command";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {TranscribeService} from "@/infra/aws/transcribe/transcribe.service";
import castMimeMediaFormat from "@/core/utils/cast-mime-media-format";

class TranscribeAudioHandler {
    constructor(
        private readonly storageService: StorageService,
        private readonly transcribeService: TranscribeService,
    ) {}

    async run(command: TranscribeAudioCommand) {
        const fs = await import('fs/promises');
        const fileBuffer = await fs.readFile(command.file.path);
        const mediaFormat = castMimeMediaFormat(command.file.mimetype);

        const uploadFileResult = await this.storageService.upload({
            folder: 'transcribe-input/',
            filename: command.file.originalname,
            contentType: mediaFormat,
            body: fileBuffer,
        });

        const {transcribedFilePath, jobId} = this.transcribeService.execute({
            filename: command.file.originalname,
            mediaFileUri: uploadFileResult.httpsUrl,
            mediaFormat,
        })

        console.log('transcribedFilePath???'.red.bold)
        console.log(transcribedFilePath)

        return {
            id: jobId,
            // filename: command.file.originalname
        };
    }
}

export const transcribeAudioHandler = new TranscribeAudioHandler(
    new StorageService(),
    new TranscribeService(),
)
