export const getQueryPrompt = (
  content: string,
  searchContentLog: string
) => `I am doing RAG. The user has typed the content in USER_CONTENT between the [], 
and the results of the RAG search are in the RAG_SEARCH between the []. 
Respond to the user taking into consideration all the RAG_SEARCH results. 
At the end of the response, give me the sources of the RAG_SEARCH used in your response.
The sources section should contain sources for all RAG_SEARCH result used in the response.
The sources section should have the following schema for each source. 
Group them by title and chapter, do not repeat title or chapter:
Title: [DOCUMENT_TITLE]
Chapter: [CHAPTER_TITLE]
Sections: [[SECTION_QUOTE], [SECTION_QUOTE]...]

Include as many Title-Chapter-Sections as necessary. Only include sources that apply to the response you are giving.
Do not assign numbers to the Chapters, just the Chapter Title.

Respond like the user will see your response directly. Give a lengthy and deep response.

USER_CONTENT=[${content}], RAG_SEARCH=[${searchContentLog}]`;
