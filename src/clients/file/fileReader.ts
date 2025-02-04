import * as fs from 'fs';
import * as path from 'path';

import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

export class FileReader {
  public readJsonFile<T extends object>(filePath: string) {
    try {
      const fullFilePath = path.join(process.cwd(), filePath);

      const rawData = fs.readFileSync(fullFilePath, 'utf-8');
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return JSON.parse(rawData) as T;
    } catch (error) {
      const msg = `while trying to read JSON from ${filePath}`;
      assertIsError(error, msg);
      logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
      throw error;
    }
  }
}
