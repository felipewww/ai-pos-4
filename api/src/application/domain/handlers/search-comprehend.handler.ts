import {SearchComprehendQuery} from "@/core/domain/queries/search-comprehend.query";
import {TranscribedRepository} from "@/application/data/mongo/repositories/transcribed.repository";

class SearchComprehendHandler {
    constructor(
        private readonly transcribedRepository: TranscribedRepository,
    ) {
    }

    async run(command: SearchComprehendQuery) {
        return this.transcribedRepository.all();
    }
}

export const searchComprehendHandler = new SearchComprehendHandler(
    new TranscribedRepository(),
);
