import 'source-map-support/register';
import 'colors';
import 'module-alias/register';
import 'dotenv/config'
import {StorageService} from "@/infra/aws/storage/storage.service";
import {fUtils} from "@/core/utils/files.utils";
import {TranscribeService} from "@/infra/aws/transcribe/transcribe.service";

export const storageService = new StorageService();

export const transcribeService = new TranscribeService();

export const FilesUtils = new fUtils(
    storageService
);

setTimeout(() => {
    // storageService.findFile(
    //     'output.tar.gz',
    //     'comprehend-output/F40A-18BC-41C2-7A53'
    // )
    //     .then(console.log)
    //     .catch(console.error)
}, 2000)
