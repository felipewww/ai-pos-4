// export type MediaFormat = "mp3" | "wav" | "flac" | "mp4" | "m4a" | "webm";

import {MediaFormat} from "@aws-sdk/client-transcribe";

export type TranscribeObjectCommand = {
    filename: string;
    mediaFileUri: string; // normalmente https S3
    mediaFormat: MediaFormat;
}
