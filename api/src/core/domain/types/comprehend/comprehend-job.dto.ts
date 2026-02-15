import {ComprehendJobStatus} from "@/core/domain/types/comprehend/comprehend-job-status";
import {InputDataConfig, OutputDataConfig} from "@aws-sdk/client-comprehend";

export type ComprehendJobDto = {
    jobId: string,
    status: keyof typeof ComprehendJobStatus,
    message: string
    outputDataConfig: OutputDataConfig,
    inputDataConfig: InputDataConfig,
};
