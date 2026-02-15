import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import * as fs from "node:fs";
import * as path from "node:path";
import {UploadFileCommand} from "@/infra/aws/commands/upload-file.command";
import {UploadFileResult} from "@/infra/aws/commands/upload-file.result";
import {Readable} from "node:stream";
import {FilesUtils} from "@/infra/config";
import {Defaults} from "@/core/defaults";
// import {FilesUtils} from "@/core/utils/files.utils";

export class StorageService {
    private client: S3Client;

    constructor() {
        this.client = new S3Client();
    }

    public async upload(
        file: UploadFileCommand
    ): Promise<UploadFileResult> {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const key = `${file.folder}${file.filename}`;
        const httpsUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
        const s3Uri = Defaults.S3_URI;

        const result = { key, httpsUrl, s3Uri };

        const localFilePath = path.join(process.cwd(), 'uploads', file.filename);

        if (
            FilesUtils.exists(`data/upload-success/${file.filename}`)
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

        await this.client.send(command);

        FilesUtils.deleteFile(localFilePath);

        return result
    }

    public async download(
        key: string,
        targetPath?: string
    ): Promise<string> {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        // const s3 = new S3Client({ region });

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const response = await this.client.send(command);

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

    public async read(objectKey: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const content = []
            // const bucket = process.env.S3_BUCKET;

            // const s3 = new S3Client();
            // const s3 = new S3Client({ region });

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: objectKey
            });

            try {
                const response = await this.client.send(command);
                const body = response.Body;

                if (body instanceof Readable) {
                    // Process each chunk of data here (e.g., parse a line, count bytes)
                    body.on('data', (chunk) => {
                        // console.log(chunk.toString());
                        // console.log(`Received chunk of size: ${chunk.length}`);
                        content.push(chunk.toString());
                    });

                    body.on('end', () => {
                        // console.log('Stream finished.');
                        resolve(content.join(''));
                    });

                    body.on('error', (err) => {
                        // console.error('Stream error:', err);
                        reject(err);
                    });
                } else {
                    // Handle the case where Body might not be a Readable stream (e.g., in a browser environment)
                    // const str = await (body as any).transformToString(); // Use transformToString for the browser
                    // console.log('Object content:', str);
                    reject('Body is not a Readable stream')
                }

            } catch (err) {
                console.error(err);
                reject(err);
            }
        })
        // const region = process.env.AWS_REGION;
    }
}
