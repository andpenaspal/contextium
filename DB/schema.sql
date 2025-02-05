-- Install the pgvector extension if it's not already installed
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

-- Create the document_chapters table
CREATE TABLE document_chapters (
    id SERIAL PRIMARY KEY,
    documentId INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    title TEXT NOT NULL
);

-- Create the document_sections table
CREATE TABLE document_sections (
    id SERIAL PRIMARY KEY,
    embeddings vector(768), -- Assuming embeddings are of dimension 768 (for all-mpnet-base-v2)
    chapterId INTEGER NOT NULL REFERENCES document_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);
