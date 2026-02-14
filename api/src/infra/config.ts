import 'source-map-support/register';
import 'colors';
import 'module-alias/register';
import 'dotenv/config'
import {StorageService} from "@/infra/aws/storage.service";
import {fUtils} from "@/core/utils/files.utils";

export const FilesUtils = new fUtils(
    new StorageService()
);
