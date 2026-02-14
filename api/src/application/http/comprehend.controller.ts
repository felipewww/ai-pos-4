import * as express from "express";
import {Express, Request, Response} from "express";
import {transcribeAudioHandler} from "@/application/domain/transcribe-audio.handler";
import {uploadMiddleware} from "@/infra/middlewares/upload.middleware";

export class ComprehendController {
    constructor(
        private readonly app: Express
    ) {
        const router = express.Router();

        router.post('/audio', uploadMiddleware.single('file'), this.postAudio)

        this.app.use('/comprehend', router)
    }

    async postAudio(req: Request, res: Response) {
        await transcribeAudioHandler.run({file: req.file})

        res.send('ok')
    }
}
