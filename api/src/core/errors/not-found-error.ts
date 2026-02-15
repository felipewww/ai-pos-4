import {AppError} from "@/core/errors/app-error";

export class NotFoundError extends Error implements AppError {
    public statusCode = 404;
}
