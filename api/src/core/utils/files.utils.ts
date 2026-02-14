import * as fs from "node:fs";
import * as path from "node:path";
import {StorageService} from "@/infra/aws/storage.service";

export class fUtils {
    retries = 3;
    retryDelay = 2000;

    constructor(
        private readonly storageService: StorageService
    ) {
    }

    deleteFile(sourcePath: string) {
        const targetPath = path.join(process.cwd(), sourcePath);

        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }
    }

    moveFile(sourcePath: string, targetPath: string) {
        const origin = path.join(process.cwd(), sourcePath);
        const destination = path.join(process.cwd(), targetPath);

        if (fs.existsSync(origin)) {
            fs.renameSync(origin, destination);
        }

        this.deleteFile(sourcePath);
    }

    exists(sourcePath: string) {
        return fs.existsSync(path.join(process.cwd(), sourcePath));
    }

    downloadFile(
        objectKey: string,
        tryCount: number = 0
    ) {
        if (tryCount >= this.retries) {
            console.log(`Error downloading file ${objectKey}`.red.bold)
            return;
        }

        setTimeout(() => {
            console.log(`Downloading file ${objectKey} - try ${tryCount}`.yellow.bold)
            this.storageService.download(objectKey, 'upload-success')
                .catch(() => {
                    this.downloadFile(objectKey, tryCount + 1);
                })
        }, this.retryDelay)
    }
}
