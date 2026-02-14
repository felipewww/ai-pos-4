import * as express from "express";
import {Express, Request, Response} from "express";
import * as multer from "multer";

export class ComprehendController {
    private upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, cb) => {
            const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/mp4', 'audio/x-m4a'];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid audio format'));
            }
        }
    });

    constructor(
        private readonly app: Express
    ) {
        const router = express.Router();

        router.post('/audio', this.upload.single('audio'), this.postAudio)

        this.app.use('/comprehend', router)
    }

    async postAudio(req: Request, res: Response) {
        res.send('ok')
        // this.app.post("/audio", async (req: Request, res: Response) => {
        //
        // })
    }
}
