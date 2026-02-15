import {Predictions} from "@/application/data/mongo/models/transcribed.model";
import axios from "axios";

export class RiskEngineService {
    async predictRisk(payload: Predictions) {
        return axios.post(`${process.env.RISK_ENGINE_URL}/risk`, payload)
    }
}

export const riskEngineService = new RiskEngineService();
