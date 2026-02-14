import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

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

        const key = `${file.keyPrefix ?? "transcribe-input"}/${Date.now()}-${file.filename}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.body,
            ContentType: file.contentType ?? "application/octet-stream",
        });

        await s3.send(command);

        // URL "virtual-hosted-style"
        const httpsUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
        const s3Uri = `s3://${bucket}/${key}`;

        return { key, httpsUrl, s3Uri };
    }
}
