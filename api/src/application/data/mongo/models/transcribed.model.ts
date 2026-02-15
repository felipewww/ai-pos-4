import mongoose, {Model, Schema} from "mongoose";

export type Risk = {
    riskLevel: 'URGENTE'|'ROTINA'|'MONITORAR',
    confidence: number,
    probabilities: {
          MONITORAR: number,
          ROTINA: number,
          URGENTE: number,
        },
    humanReviewRequired: true,
    topSignals: {label: string, score: number}[],
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
    path: string;
    filename: string;
    status: ETranscriptionStatus;
    comprehendJobId: string;
    predictions: Predictions;
    risk: Risk;
    content: string;
}

const transcribedSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        path: { type: String, required: true },
        filename: { type: String, required: true },
        status: { type: String, required: true },
        comprehendJobId: { type: String, required: false, nullable: true },
        predictions: { type: Object, required: false, nullable: true },
        risk: { type: Object, required: false, nullable: true },
        content: { type: String, required: false, nullable: true }
    },
    { timestamps: true }
);

export const TranscribedEntity: Model<ITranscribedModel> = mongoose.model<ITranscribedModel>(
    'transcribed',
    transcribedSchema
);
