import * as express from "express";
import {Express, Request, Response} from "express";
import {transcribeAudioHandler} from "@/application/domain/transcribe-audio.handler";
import {uploadMiddleware} from "@/infra/middlewares/upload.middleware";
import {MediaFormat} from "@aws-sdk/client-transcribe";

export class ComprehendController {
    constructor(
        private readonly app: Express
    ) {
        const router = express.Router();

        router.post('/audio', uploadMiddleware.single('file'), this.postAudio)

        this.app.use('/comprehend', router)
    }

    async postAudio(req: Request, res: Response) {
        const { mimetype, ...rest } = req.file;
        await transcribeAudioHandler.run({
            file: req.file
            // file: {
            //     ...rest,
            //     mimetype: mimetype as MediaFormat // force cast multer to aws req
            // }
        })

        res.send('ok')
    }
}
