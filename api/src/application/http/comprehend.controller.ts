import * as express from "express";
import {Express, Request, Response} from "express";
import {transcribeAudioHandler} from "@/application/domain/handlers/transcribe-audio.handler";
import {uploadMiddleware} from "@/infra/middlewares/upload.middleware";
import {MediaFormat} from "@aws-sdk/client-transcribe";
import {searchComprehendHandler} from "@/application/domain/handlers/search-comprehend.handler";
import {analyzeHandler} from "@/application/domain/handlers/analyze.handler";

export class ComprehendController {
    constructor(
        private readonly app: Express
    ) {
        const router = express.Router();

        router.post('/', uploadMiddleware.single('file'), this.postAudio)
        router.get('/:jobId', uploadMiddleware.single('file'), this.getComprehend)
        router.post('/:jobId/analyze', uploadMiddleware.single('file'), this.forceComprehend)

        this.app.use('/comprehend', router)
    }

    async postAudio(req: Request, res: Response) {
        const { mimetype, ...rest } = req.file;
        const result = await transcribeAudioHandler.run({
            file: req.file
        })

        res.json(result)
    }

    async getComprehend(req: Request, res: Response) {
        const result = await searchComprehendHandler.run({
            filename: req.params.filename as string
        })

        res.json(result)
    }

    async forceComprehend(req: Request, res: Response) {
        const result = await analyzeHandler.run({
            jobId: req.params.jobId as string
        })

        res.json(result)
    }
}
