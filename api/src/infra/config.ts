import 'source-map-support/register';
import 'colors';
import 'module-alias/register';
import 'dotenv/config'
import {StorageService} from "@/infra/aws/storage/storage.service";
import {fUtils} from "@/core/utils/files.utils";

export const storageService = new StorageService();

export const FilesUtils = new fUtils(
    storageService
);
