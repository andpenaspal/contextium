import { FileReader } from 'src/clients/file/fileReader';
import type { GenAiIntegration } from 'src/clients/integrations/genAiIntegration.base';
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

import { DocumentService } from 'src/services/document/document.service';

type ExtractedChapter = {
  title: string;
  sections: string[];
};

type ExtractedDoc = {
  title: string;
  chapters: ExtractedChapter[];
};

export class DocumentController {
  private documentService: DocumentService;
  private genAiIntegration: GenAiIntegration;

  constructor(
    documentService: DocumentService,
    genAiIntegration: GenAiIntegration
  ) {
    this.documentService = documentService;
    this.genAiIntegration = genAiIntegration;
  }

  public async createEmbeddedDocument(documentName: string) {
    logger.info(
      `Request to Create Embedded Document for Document with Title: ${documentName}`
    );

    const pathToDoc = `data/extracted/${documentName}/json.json`;

    try {
      logger.info(`Extracting Document data from ${pathToDoc}`);

      const jsonDocument = new FileReader().readJsonFile<ExtractedDoc>(
        pathToDoc
      );

      const { title: documentTitle, chapters } = jsonDocument;
      const filteredChapters = chapters.filter(
        (chapter) => chapter.title.length > 0
      );

      const createEmbeddingsForDocument = async (
        documentChapters: ExtractedChapter[]
      ) => {
        const chapterEmbeddingsPromises = documentChapters.map(
          async (chapter) => {
            try {
              logger.info(`Creating embeddings for Chapter: ${chapter.title}`);

              return await this.genAiIntegration.generateEmbeddings(
                chapter.sections
              );
            } catch (error) {
              const msg = `while trying to create embeddings for Chapter ${chapter.title}`;
              assertIsError(error, msg);
              logger.error(`Something went wrong ${msg}`);
              throw error;
            }
          }
        );

        return await Promise.all(chapterEmbeddingsPromises);
      };

      logger.info('Generating Embeddings');

      const chaptersEmbeddings =
        await createEmbeddingsForDocument(filteredChapters);

      logger.info('Mapping Embeddings to Chapters');

      const chaptersWithEmbeddings = chaptersEmbeddings.map(
        (chapterEmbeddings, i) => {
          const chapter = filteredChapters[i];
          return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            title: chapter?.title!,
            embeddedSection: chapterEmbeddings.map(
              (embedding, embeddingIndex) => {
                return {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                  sectionContent: chapter?.sections[embeddingIndex]!,
                  embeddings: embedding,
                };
              }
            ),
          };
        }
      );

      const data = { title: documentTitle, chapters: chaptersWithEmbeddings };

      logger.info('Storing Embedded Document');

      const createdDocumentId =
        await this.documentService.createFullDocument(data);

      logger.info('Embedded Document Created Successfully');

      return { documentId: createdDocumentId };
    } catch (error) {
      const msg = `while Creating and Embedded Document with title ${documentName}`;
      assertIsError(error);
      logger.error('Something went wrong ' + msg + `. Error: ${error.message}`);
      throw error;
    }
  }
}
