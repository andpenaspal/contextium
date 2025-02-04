import Database from 'src/clients/db/client.integration';
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

import { Document } from 'src/models/document/document.model';

type CreateDocument = {
  title: string;
  chapters: {
    title: string;
    embeddedSection: {
      sectionContent: string;
      embeddings: number[];
    }[];
  }[];
};

export class DocumentService {
  private Database: Database;
  private documentTableName: string;
  private documentChapterTableName: string;
  private documentSectionTableName: string;

  constructor() {
    this.Database = Database.getInstance();

    this.documentTableName = 'documents';
    this.documentChapterTableName = 'document_chapters';
    this.documentSectionTableName = 'document_sections';
  }

  public async getDocument(id: string): Promise<Document> {
    const getDocumentQuery = `SELECT * FROM ${this.documentTableName} WHERE id = $1`;

    try {
      const documentResult = await this.Database.query<Document>(
        getDocumentQuery,
        [id]
      );

      const { rows, rowCount } = documentResult;

      if (rowCount !== 1) throw new Error();
      const document = rows[0];

      if (!document) throw new Error();

      return document;
    } catch (error) {
      const msg = `while trying to Fetch a Document with ID: ${id}`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error:${error.message}`);
      throw error;
    }
  }

  public async createDocument(title: string): Promise<string> {
    const createDocumentQuery = `INSERT INTO ${this.documentTableName} (title) VALUES ($1) RETURNING id`;
    logger.info(`Creating Document for ${title}`);

    try {
      const createDocumentResult = await this.Database.query<{ id: string }>(
        createDocumentQuery,
        [title]
      );

      const { rowCount, rows } = createDocumentResult;

      if (rowCount !== 1) throw new Error();
      const documentRow = rows[0];

      if (!documentRow) throw new Error();

      logger.info(`Document Created successfully. ID: ${documentRow.id}`);

      return documentRow.id;
    } catch (error) {
      const msg = `while trying to Create a Document`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error:${error.message}`);
      throw error;
    }
  }

  public async createDocumentChapter(
    documentId: string,
    chapterTitle: string
  ): Promise<string> {
    const createChapterQuery = `INSERT INTO ${this.documentChapterTableName} (documentId, title) VALUES ($1, $2) RETURNING id`;

    logger.info(
      `Creating Document Chapter [${chapterTitle}] for Document ${documentId}`
    );

    try {
      const createDocumentChapterResult = await this.Database.query<{
        id: string;
      }>(createChapterQuery, [documentId, chapterTitle]);

      const { rowCount, rows } = createDocumentChapterResult;

      if (rowCount !== 1) throw new Error();
      const documentChapterRow = rows[0];

      if (!documentChapterRow) throw new Error();

      logger.info(
        `Document Chapter Created successfully. ID: ${documentChapterRow.id}`
      );

      return documentChapterRow.id;
    } catch (error) {
      const msg = `while trying to Create a Document Chapter`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error:${error.message}`);
      throw error;
    }
  }

  public async createDocumentSection(
    chapterId: string,
    content: string,
    embeddings: number[]
  ): Promise<string> {
    const createSectionQuery = `INSERT INTO ${this.documentSectionTableName} (chapterId, content, embeddings) VALUES ($1, $2, $3) RETURNING id`;
    logger.info(`Creating Document Section for Chapter Id: ${chapterId}`);
    const formattedEmbeddings = `[${embeddings.map((n) => n.toFixed(6)).join(', ')}]`;

    try {
      const createSectionResult = await this.Database.query<{ id: string }>(
        createSectionQuery,
        [chapterId, content, formattedEmbeddings]
      );

      const { rowCount, rows } = createSectionResult;

      if (rowCount !== 1) throw new Error();
      const documentSectionRow = rows[0];

      if (!documentSectionRow) throw new Error();

      logger.info(
        `Document Section created successfully. ID: ${documentSectionRow.id}`
      );

      return documentSectionRow.id;
    } catch (error) {
      const msg = `while trying to Create a Document Section`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error:${error.message}`);
      throw error;
    }
  }

  private async createDocumentChapterWithSections(
    documentId: string,
    chapterWithSections: CreateDocument['chapters'][number]
  ) {
    const { title, embeddedSection } = chapterWithSections;

    logger.info(
      `Creating Document Chapter with Section for Document with Id ${documentId} and Chapter with title ${title}`
    );

    const documentChapterId = await this.createDocumentChapter(
      documentId,
      title
    );

    const documentSectionPromises = embeddedSection.map(
      ({ sectionContent, embeddings }) =>
        this.createDocumentSection(
          documentChapterId,
          sectionContent,
          embeddings
        )
    );

    await Promise.all(documentSectionPromises);
  }

  public async createFullDocument(createDocument: CreateDocument) {
    logger.info(`Creating a Full Document for ${createDocument.title}`);

    try {
      const documentId = await this.createDocument(createDocument.title);

      const documentChapterWithSectionsPromises = createDocument.chapters.map(
        (chapter) => this.createDocumentChapterWithSections(documentId, chapter)
      );

      await Promise.all(documentChapterWithSectionsPromises);

      return documentId;
    } catch (error) {
      const msg = `while trying to Create a full Document with Title: ${createDocument.title}`;
      assertIsError(error);
      logger.error(`Something went wrong ${msg}. Error:${error.message}`);
      throw error;
    }
  }
}
