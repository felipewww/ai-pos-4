import {TranscribeAudioCommand} from "@/core/domain/commands/transcribe-audio.command";
import {StorageService} from "@/infra/aws/storage.service";
import {TranscribeService} from "@/infra/aws/transcribe.service";
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
            filename: command.file.originalname,
            contentType: mediaFormat,
            body: fileBuffer,
        });

        this.transcribeService.execute({
            filename: command.file.originalname,
            mediaFileUri: uploadFileResult.httpsUrl, // normalmente https S3
            mediaFormat,
        })
    }
}

export const transcribeAudioHandler = new TranscribeAudioHandler(
    new StorageService(),
    new TranscribeService(),
)
