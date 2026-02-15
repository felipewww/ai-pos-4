import {TranscribeAudioCommand} from "@/core/domain/commands/transcribe-audio.command";
import {StorageService} from "@/infra/aws/storage/storage.service";
import {TranscribeService} from "@/infra/aws/transcribe/transcribe.service";
import castMimeMediaFormat from "@/core/utils/cast-mime-media-format";
import {
    transcribedRepository,
    TranscribedRepository
} from "@/application/data/mongo/repositories/transcribed.repository";
import * as fs from 'fs/promises';
import {FilesUtils, storageService, transcribeService} from "@/infra/config";
import {ETranscriptionStatus} from "@/application/data/mongo/models/transcribed.model";

class TranscribeAudioHandler {
    constructor(
        private readonly storageService: StorageService,
        private readonly transcribeService: TranscribeService,
        private readonly transcribedRepository: TranscribedRepository,
    ) {}

    async run(command: TranscribeAudioCommand) {
        try {
            const fileBuffer = await fs.readFile(command.file.path);
            const mediaFormat = castMimeMediaFormat(command.file.mimetype);

            const uploadFileResult = await this.storageService.upload({
                folder: 'transcribe-input/',
                filename: command.file.originalname,
                contentType: mediaFormat,
                body: fileBuffer,
            });

            const {transcribedFilePath, jobId} = await this.transcribeService.execute({
                filename: command.file.originalname,
                mediaFileUri: uploadFileResult.httpsUrl,
                mediaFormat,
            })

            await this.transcribedRepository.save({
                id: jobId,
                path: transcribedFilePath,
                filename: command.file.originalname,
                status: ETranscriptionStatus.PROCESSING,
                comprehendJobId: null,
                predictions: null,
                content: null
            })

            return {
                id: jobId,
                // filename: command.file.originalname
            };
        } catch (e) {
            throw e;
        } finally {
            FilesUtils.deleteFile(`data/uploads/${command.file.originalname}`)
        }
    }
}

export const transcribeAudioHandler = new TranscribeAudioHandler(
    storageService,
    transcribeService,
    transcribedRepository,
)
