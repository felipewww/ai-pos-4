export class OnComprehend {
    async run(input: any) {
        console.log('on comprehend received'.green.bold)
    }
}

export const onComprehend = new OnComprehend();
