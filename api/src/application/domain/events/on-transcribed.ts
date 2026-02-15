import {TranscribeEventInput} from "@/application/http/inputs/transcribe-event-input";

export class OnTranscribed {
    async run(input: TranscribeEventInput) {
        console.log('input on event subscriber...'.red.bold)
        console.log(input)
    }
}

export const onTranscribed = new OnTranscribed();
