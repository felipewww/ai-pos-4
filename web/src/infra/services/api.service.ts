import axios from "axios";
import type {ITranscribedModel} from "@/core/domain/types.ts";

export class ApiService {
    async all() {
        return axios.get<ITranscribedModel[]>('http://localhost:3000/comprehend/all')
    }

    async uploadAudio(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        return axios.post('http://localhost:3000/comprehend', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    }
}
