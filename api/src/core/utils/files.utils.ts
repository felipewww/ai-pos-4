import * as fs from "node:fs";
import * as path from "node:path";
import {StorageService} from "@/infra/aws/storage.service";

export class fUtils {
    retries = 5;
    retryDelay = 5000;

    constructor(
        private readonly storageService: StorageService
    ) {
    }

    readFile(sourcePath: string) {
        return fs.readFileSync(path.join(process.cwd(), sourcePath));
    }

    deleteFile(sourcePath: string) {
        if (this.exists(sourcePath)) {
            const targetPath = path.join(process.cwd(), sourcePath);
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
        cb: () => any = null,
        tryCount: number = 0,
    ) {
        if (tryCount >= this.retries) {
            console.log(`Error downloading file ${objectKey}`.red.bold)
            return;
        }

        setTimeout(() => {
            console.log(`Downloading file ${objectKey} - try ${tryCount}`.yellow.bold)
            this.storageService.download(objectKey, 'data/upload-success')
                .then(() => {
                    console.log('Download finished'.green.bold)
                    if (cb) cb();
                })
                .catch(() => {
                    this.downloadFile(objectKey, cb, tryCount + 1);
                })
        }, this.retryDelay)
    }
}
