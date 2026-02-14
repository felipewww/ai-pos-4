import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import * as fs from "node:fs";
import * as path from "node:path";
import {UploadFileCommand} from "@/infra/aws/commands/upload-file.command";
import {UploadFileResult} from "@/infra/aws/commands/upload-file.result";
import {Readable} from "node:stream";
import {FilesUtils} from "@/infra/config";
// import {FilesUtils} from "@/core/utils/files.utils";

export class StorageService {
    public async upload(
        file: UploadFileCommand
    ): Promise<UploadFileResult> {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const s3 = new S3Client({
            region
        });

        const key = `${file.keyPrefix ?? "transcribe-input"}/${file.filename}`;
        const httpsUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
        const s3Uri = `s3://${bucket}/${key}`;

        const result = { key, httpsUrl, s3Uri };

        const localFilePath = path.join(process.cwd(), 'uploads', file.filename);

        if (
            FilesUtils.exists(`upload-success/${file.filename}`)
        ) {
            console.log(`File ${file.filename} already exists in uploads folder`.yellow.bold)
            FilesUtils.deleteFile(localFilePath);
            return result
        }

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.body,
            ContentType: file.contentType ?? "application/octet-stream",
        });

        await s3.send(command);

        FilesUtils.deleteFile(localFilePath);

        return result
    }

    public async download(
        key: string,
        targetPath?: string
    ): Promise<string> {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const s3 = new S3Client({ region });

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const response = await s3.send(command);

        // Extract filename from key
        const filename = path.basename(key);
        const uploadSuccessDir = path.join(process.cwd(), targetPath);

        // Ensure upload-success directory exists
        if (!fs.existsSync(uploadSuccessDir)) {
            fs.mkdirSync(uploadSuccessDir, { recursive: true });
        }

        const localFilePath = path.join(uploadSuccessDir, filename);

        // Download and save file
        const stream = response.Body as Readable;
        const writeStream = fs.createWriteStream(localFilePath);

        await new Promise((resolve, reject) => {
            stream.pipe(writeStream);
            stream.on('error', reject);
            // writeStream.on('finish', resolve);
            // writeStream.on('error', reject);
        });

        return localFilePath;
    }
}
