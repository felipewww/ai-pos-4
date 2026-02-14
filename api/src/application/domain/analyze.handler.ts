import {AnalyzeCommand} from "@/core/domain/commands/analyze.command";
import {DeterministicUUID} from "@/core/utils/deterministic-uuid";
import {FilesUtils} from "@/infra/config";

class AnalyzeHandler {
    constructor() {
    }

    async run(command: AnalyzeCommand) {
        console.log(command.jobId)
        const transcribeContent = FilesUtils.readFile(`transcribe-output/${command.jobId}.json`);
    }
}

export const analyzeHandler = new AnalyzeHandler();
