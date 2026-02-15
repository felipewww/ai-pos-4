export type UploadFileCommand = {
    folder: string;
    filename: string;
    contentType?: string;
    body: Buffer | Uint8Array | Blob | ReadableStream | any; // depende do seu runtime
}
