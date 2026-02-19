import {MediaFormat} from "@aws-sdk/client-transcribe";

export default function castMimeMediaFormat(mime: string) {
    const allowedFormats: MediaFormat[] = ['mp3', 'wav', 'flac', 'mp4', 'm4a', 'webm'];

    if (allowedFormats.includes(mime as MediaFormat)) {
        return mime as MediaFormat;
    }

    const map: { [key: string]: MediaFormat } = {
        'audio/wave': 'wav',
        'audio/wav': 'wav',
    }

    const format = map[mime];

    if (!format) {
        throw new Error(`Invalid media format ${mime}`);
    }

    return format;
}
