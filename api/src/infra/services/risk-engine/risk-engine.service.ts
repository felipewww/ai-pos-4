import {Predictions, Risk} from "@/application/data/mongo/models/transcribed.model";
import axios from "axios";

export class RiskEngineService {
    async predictRisk(payload: Predictions) {
        return axios.post<Risk>(`${process.env.RISK_ENGINE_URL}/risk`, payload)
    }
}

export const riskEngineService = new RiskEngineService();
