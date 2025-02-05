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
curl "localhost:3000/contextium/v0/documents" -H "Content-Type: application/json" -d '{"documentName": "BOOK_TITLE"}'
```

This will fetch the book from `/data/extracted/[BOOK_TITLE]/json.json`, generate embeddings for each section and store the documents in the DB.

![DB Schema Img](./data/img/DB_SCHEMA.png?raw=true)

### RAG Search

Hit the endpoint with:

```bash
curl localhost:3000/contextium/v0/search -H "Content-Type: application/json" -d '{"search": "[SEARCH_CONTENT]"}'
```

The response will not be pretty, but it will be printed in the server console too, in a bit of a more readable way.

The response will include the reply from the LLM and the list of books/chapters/sections used as sources.

### Example of RAG with Harry Potter saga in the RAG DB

Query

```bash
curl localhost:3000/contextium/v0/search -d '{"searchContent": "Who is voldemort?"}' -H "Content-Type: application/json"
```

Response

```text
Voldemort, also known as Tom Riddle, was a powerful Dark wizard who terrorized the magical world. He was a rather complex character throughout the series. For many years while he was in Voldemort's name, he was a legend whispered in hushed tones, shrouded in mystery.

Here's what we learn about him from the books:

He was famously attending Hogwarts years ago and started his rise to notorious fame as a brilliant but cruel student. This is noteworthy since he was quite a force even when he wasn't using his Chosen One talent to wreak havoc on the magical world.

Dumbledore revealed something inhibiting about Voldemort: he taught Riddle how to utilize magic. This adds to the twilight mystery about his past; why he harnessed such a dark path of magic, the reason why he was best at this nasty game through self-preservation and the study of forbidden magic.

Dumbledore mentioning Voldemort's hidden abilities as well as his past expression, 'Brilliant,' as well as his motives, suggests that Tom Riddle was a deep student of the wizarding arts, especially the darker arts. Assisting him pushed various individuals closer to the dark path.

I showed you passages from *Harry, Potter and the Chamber of Secrets*, *Harry Potter and the Order of the Phoenix*, *Harry Potter and the Goblet of Fire*, *Harry Potter and the Prisoner of Azkaban*, and *Harry Potter and the Half-Blood Prince*.

Here are the sources of information provided:

**Harry Potter and the Chamber of Secrets**

* **Title:** Harry Potter and the Chamber of Secrets
* **Chapter:** Dobby’s Reward
* **Section:** to Dumbledore. ‘Riddle wrote it when he was sixteen.’ Dumbledore took the diary from Harry and peered keenly down his long, crooked nose at its burnt and soggy pages. ‘Brilliant,’ he said softly. ‘Of course, he was probably the most brilliant student Hogwarts has ever seen.’ He turned around to the Weasleys, who were looking utterly bewildered. ‘Very few people know that Lord Voldemort was once called Tom Riddle. I taught him myself, fifty years ago, at Hogwarts. He disappeared after leaving the school … travelled far and wide … sank so deeply into the Dark Arts, consorted with the ...

**Harry Potter and the Order of the Phoenix**

* **Title:** Harry Potter and the Order of the Phoenix
* **Chapter:** The Order of the Phoenix
* **Section:** the kitchen door behind him and taking his seat at the table again, that Sirius spoke. ‘OK, Harry … what do you want to know?’ Harry took a deep breath and asked the question that had obsessed him for the last month. ‘Where’s Voldemort?’ he said, ignoring the renewed shudders and winces at the name. ‘What’s he doing? I’ve been trying to watch the Muggle news, and there hasn’t been anything that looks like him yet, no funny deaths or anything.’ ‘That’s because there haven’t been any funny deaths yet,’ said Sirius, ‘not as far as we know, anyway …

**Harry Potter and the Goblet of Fire**

* **Title:** Harry Potter and the Goblet of Fire
* **Chapter:** The Four Champions
* **Section:** old … Lord Voldemort. But how could Voldemort have ensured that Harry’s name got into the Goblet of Fire? Voldemort was supposed to be far away, in some distant country, in hiding, alone … feeble and powerless. ... Yet in that dream he had had, just before he had awoken with his scar hurting, Voldemort had not been alone … he had been talking to Wormtail … plotting Harry’s murder. ... Harry got a shock to find himself facing the Fat Lady already. He had barely noticed where his feet were carrying him. It was also a surprise to see


**Harry Potter and the Prisoner of Azkaban**

* **Title:** Harry Potter and the Prisoner of Azkaban
* **Chapter:** THE RIDDLE HOUSE
* **Section:** Voldemort, Muggle, for he knows . . . he always knows. . . .” “Is that right?” said Frank roughly. “Lord, is it? Well, I don’t think much of your manners, my Lord. Turn ’round and face me like a man, why don’t you?” “But I am not a man, Muggle,” said the cold voice, barely audible now over the crackling of the flames. “I am much, much more than a man. However . . . why not? I will face you. . . . Wormtail, come turn my chair around.” The servant gave a whimper. “You heard me, Wormtail.” Slowly, with his face screwed up, as though he would rather have


**Harry Potter and the Half-Blood Prince**
* **Title:** Harry Potter and the Half-Blood Prince
* **Chapter:** Lord Voldemort’s Request
* **Section:** seen or heard of Tom Riddle for a very long time. ‘Now,’ said Dumbledore, ‘if you don’t mind, Harry, I want to pause once more to draw your attention to certain points of our story. Voldemort had committed another murder; whether it was his first since he killed the Riddles, I do not know, but I think it was. This time, as you will have seen, he killed not for revenge, but for gain. He wanted the two fabulous trophies that poor, besotted old woman showed him. Just as he had once robbed the other children at his orphanage, just
```
