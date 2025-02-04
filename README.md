# Contextium

This toy project is merely a ground for testing different workflows in relation toGenAI. Mainly Chatbot and RAG.

The project uses Supabase for DB/VectorDB and HuggingFace for models. Both Free tier.

## General Instructions

To locally run this project populate the `.env` file and install dependencies:

```
npm install
```

And run the project:

```
npm run dev
```

Check that the project is running as expected with:

```
curl localhost:3000/contextium/v0/config/ping
```

## ChatBot Experience

Connect to the WebSocket with:

```bash
websocat ws://localhost:3000/ws
```

Currently there is no history enabled. Send messages and get responses back.

## RAG

This project explores the idea of doing RAG GenAI with Books.

### Raw Data Processing

An `.epub` book is needed in `/data/books/`.

Run

```bash
bash ./scripts/epubToSections.sh [book_title]
```

To generate a `json.json` file in `/data/extracted/[book_title]/`.

This will generate a `json` with the following structure:

```json
{
  "title": string,
  "chapters": {
    "title": string,
    sections: string[]
  }[]
}
```

Where the `sections` are chunks of text for the chapter.

### Embedding Generation

This step can only be done after the Data Processing.

Run the following code to trigger the API Endpoint:

```bash
curl "localhost:3000/contextium/v0/documents" -H "Content-Type: application/json" -d '{"documentName: "BOOK_TITLE"}'
```

This will fetch the book from `/data/extracted/[BOOK_TITLE]/json.json`, generate embeddings for each section and store the documents in the DB.

![DB Schema Img](https://github.com/andpenaspal/contextium/blob/main/data/img/DB_SCHEMA.png?raw=true)

### RAG Search

Hit the endpoint with:

```bash
curl localhost:3000/contextium/v0/search -H "Content-Type: application/json" -d '{"search": "[SEARCH_CONTENT]"}'
```

The response
