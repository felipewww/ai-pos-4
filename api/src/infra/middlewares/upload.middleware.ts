import * as multer from "multer";

export const uploadMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'data/uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['audio/mpeg', 'audio/wave', 'audio/wav', 'audio/mp3', 'audio/mp4', 'audio/x-m4a'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid audio format ${file.mimetype}`));
        }
    }
});
