import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import * as fs from "node:fs";
import * as path from "node:path";

export type UploadFile = {
    keyPrefix?: string;
    filename: string;
    contentType?: string;
    body: Buffer | Uint8Array | Blob | ReadableStream | any; // depende do seu runtime
}

export class StorageService {
    public async upload(file: UploadFile) {
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET;

        const s3 = new S3Client({
            region
        });

        const key = `${file.keyPrefix ?? "transcribe-input"}/${file.filename}`;
        const httpsUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
        const s3Uri = `s3://${bucket}/${key}`;

        const result = { key, httpsUrl, s3Uri };

        const fileExists = fs.existsSync(path.join(process.cwd(), 'uploads', file.filename));

        if (fileExists) {
            console.log(`File ${file.filename} already exists in uploads folder`.yellow.bold)
            return result
        }

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.body,
            ContentType: file.contentType ?? "application/octet-stream",
        });

        await s3.send(command);

        return result
    }
}
