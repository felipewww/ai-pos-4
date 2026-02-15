export type EventBridge<T> = {
    // version: '0',
    // id: '6e384aa7-cc66-6c5e-2971-c185828b784b',
    // 'detail-type': 'Transcribe Job State Change',
    source: 'aws.transcribe',
    account: string, //'982417572272',
    time: string,//'2026-02-15T14:41:51Z',
    region: 'us-east-1',
    // resources: [],
    detail: T
}
