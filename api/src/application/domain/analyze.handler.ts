import {AnalyzeCommand} from "@/core/domain/commands/analyze.command";
import {FilesUtils} from "@/infra/config";
import {NotFoundError} from "@/core/errors/not-found-error";

class AnalyzeHandler {
    constructor() {
    }

    async run(command: AnalyzeCommand) {
        console.log(command.jobId)
        const transcribeContent = FilesUtils.readFile(`data/upload-success/${command.jobId}.json`);
        console.log(transcribeContent)

        throw new NotFoundError()
    }
}

export const analyzeHandler = new AnalyzeHandler();
