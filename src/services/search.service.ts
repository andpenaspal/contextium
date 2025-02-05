import Database from 'src/clients/db/database';
import { TABLE_NAME } from 'src/clients/db/tables';
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

type SearchResult = {
  id: string;
  chapterId: string;
  content: string;
  similarity: number;
};

export class SearchService {
  private Database: Database;
  private documentSectionTableName: string;

  constructor() {
    this.Database = Database.getInstance();

    this.documentSectionTableName = TABLE_NAME.documentSections;
  }

  public async searchDocuments(
    queryEmbedding: number[],
    matchCount = 5
  ): Promise<SearchResult[]> {
    const searchQuery = `
      SELECT id, chapterId, content, (embeddings <=> $1) AS similarity
      FROM ${this.documentSectionTableName}
      ORDER BY similarity ASC
      LIMIT $2;
    `;

    const formattedEmbeddings = `[${queryEmbedding.map((n) => n.toFixed(6)).join(', ')}]`;

    logger.info(`Searching documents using embeddings`);

    try {
      const searchResult = await this.Database.query<SearchResult>(
        searchQuery,
        [formattedEmbeddings, matchCount]
      );

      const { rowCount, rows } = searchResult;

      if (rowCount === 0) {
        logger.info(`No matching documents found`);
        return [];
      }

      logger.info(`Found ${rowCount} similar documents`);
      return rows;
    } catch (error) {
      const msg = `while trying to search for similar documents`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
      throw error;
    }
  }
}
