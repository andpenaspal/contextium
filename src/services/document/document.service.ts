import Database from 'src/clients/db/database';
import { TABLE_NAME } from 'src/clients/db/tables';
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

type SectionMetadata = {
  document: {
    id: string;
    title: string;
  };
  chapter: { id: string; title: string };
  section: { content: string };
};

export class DocumentService {
  private Database: Database;
  private documentTableName: string;
  private documentChapterTableName: string;
  private documentSectionTableName: string;

  constructor() {
    this.Database = Database.getInstance();

    this.documentTableName = TABLE_NAME.documents;
    this.documentChapterTableName = TABLE_NAME.documentChapter;
    this.documentSectionTableName = TABLE_NAME.documentSections;
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

  public async getSectionMetadata(sectionId: string): Promise<SectionMetadata> {
    const getSectionMetadataQuery = `SELECT 
      d.id AS document_id,
      d.title AS document_title, 
      c.id AS chapter_id,
      c.title AS chapter_title,
      s.content AS section_content
      FROM document_sections s
      JOIN document_chapters c ON s.chapterId = c.id
      JOIN documents d ON c.documentId = d.id
      WHERE s.id = $1`;

    logger.info(`Getting Metadata for Section with ID: ${sectionId}`);

    try {
      const getSectionMetadataResult = await this.Database.query<{
        document_id: string;
        document_title: string;
        chapter_id: string;
        chapter_title: string;
        section_content: string;
      }>(getSectionMetadataQuery, [sectionId]);

      const { rowCount, rows } = getSectionMetadataResult;

      if (rowCount !== 1) throw new Error();
      const sectionMetadata = rows[0];

      if (!sectionMetadata) throw new Error();
      const {
        document_id: documentId,
        document_title: documentTitle,
        chapter_id: chapterId,
        chapter_title: chapterTitle,
        section_content: sectionContent,
      } = sectionMetadata;

      logger.info(
        `Section Metadata successfully retrieved. Document ID: ${documentId}, Chapter ID: ${chapterId}`
      );

      return {
        document: { id: documentId, title: documentTitle },
        chapter: { id: chapterId, title: chapterTitle },
        section: { content: sectionContent },
      };
    } catch (error) {
      const msg = `while trying to retrieve metadata for Section with ID: ${sectionId}`;
      assertIsError(error, msg);
      logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
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
