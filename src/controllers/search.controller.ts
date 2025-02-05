import type { GenAiIntegration } from 'src/clients/integrations/genAiIntegration.base';
import { getQueryPrompt } from 'src/prompts';
import logger from 'src/utils/logger';

import type { DocumentService } from 'src/services/document/document.service';
import { SearchService } from 'src/services/search.service';

export class SearchController {
  private searchService: SearchService;
  private documentService: DocumentService;
  private genAiIntegration: GenAiIntegration;

  constructor(
    searchService: SearchService,
    documentService: DocumentService,
    genAiIntegration: GenAiIntegration
  ) {
    this.searchService = searchService;
    this.documentService = documentService;
    this.genAiIntegration = genAiIntegration;
  }
  public async searchContent(content: string) {
    const searchEmbeddings = await this.genAiIntegration.generateEmbeddings([
      content,
    ]);

    if (searchEmbeddings.length !== 1 || !searchEmbeddings[0]) {
      const msgCount = searchEmbeddings.length > 1 ? 'Multiple' : 'No';
      throw new Error(
        `${msgCount} Embeddings generated for search content: ${content.slice(0, 50)}...`
      );
    }

    const similarityResults = await this.searchService.searchDocuments(
      searchEmbeddings[0]
    );

    const sectionMetadataPromises = similarityResults.map((similarityResult) =>
      this.documentService.getSectionMetadata(similarityResult.id)
    );

    const sectionsMetadata = await Promise.all(sectionMetadataPromises);

    const searchContentResults = sectionsMetadata.map((sectionMetadata, i) => ({
      ...similarityResults[i],
      ...sectionMetadata,
    }));

    const searchContentLog = searchContentResults
      .map((searchContent) => {
        return JSON.stringify({
          document: searchContent.document.title,
          chapter: searchContent.chapter.title,
          section: searchContent.content,
        });
      })
      .join(', ');

    logger.info(`Search Content Results: ${searchContentLog}`);

    const queryResponse = await this.genAiIntegration.query(
      getQueryPrompt(content, searchContentLog)
    );

    logger.info(`\n\n\n${queryResponse}`);

    return queryResponse;
  }
}
