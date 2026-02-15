import {JobStatus} from "@aws-sdk/client-comprehend";


export const ComprehendJobStatus = {
    NOT_FOUND: "NOT_FOUND",
    ...JobStatus
} as const;
