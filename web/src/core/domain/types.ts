export type Risk = {
    riskLevel: 'URGENTE' | 'ROTINA' | 'MONITORAR',
    confidence: number,
    probabilities: {
        MONITORAR: number,
        ROTINA: number,
        URGENTE: number,
    },
    humanReviewRequired: true,
    topSignals: { label: string, score: number }[],
    features: {
        risco_violencia_domestica: number,
        isolamento_social: number,
        dor_de_cabeca_frequente: number,
        aperto_no_peito: number,
        dor_muscular: number,
        alteracao_do_aparelho_respiratorio: number,
        alteracao_do_aparelho_cardiovascular: number,
        alteracao_do_aparelho_digestivo: number,
        alteracao_do_aparelho_reprodutor: number,
        fadiga_persistente: number,
        sintoma_hormonal: number,
    }
}


export type Predictions = {
    Labels: {
        Name: string,
        Score: number
    }[]
}

export enum ETranscriptionStatus {
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    COMPREHEND_SUBMITTED = 'COMPREHEND_SUBMITTED',
    COMPREHEND_SUBMIT_FAILED = 'COMPREHEND_SUBMIT_FAILED',
    COMPREHEND_COMPLETED = 'COMPREHEND_COMPLETED',
    RISK_ANALYSIS_COMPLETED = 'RISK_ANALYSIS_COMPLETED'
}

export interface ITranscribedModel {
    id: string;
    path: string; // path for json transcribed
    filename: string; //real audio file name uploaded
    status: ETranscriptionStatus;
    comprehendJobId?: string;
    predictions: Predictions;
    risk?: Risk;
    // content: string;
}
