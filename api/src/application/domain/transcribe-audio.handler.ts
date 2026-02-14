import {TranscribeAudioCommand} from "@/core/domain/commands/transcribe-audio.command";
import {StorageService} from "@/infra/aws/storage.service";

class TranscribeAudioHandler {
    constructor(
        private readonly storageService: StorageService
    ) {}

    async run(command: TranscribeAudioCommand) {
        const fs = await import('fs/promises');
        const fileBuffer = await fs.readFile(command.file.path);

        await this.storageService.upload({
            filename: command.file.originalname,
            contentType: command.file.mimetype,
            body: fileBuffer,
        });
    }
}

export const transcribeAudioHandler = new TranscribeAudioHandler(
    new StorageService()
)
