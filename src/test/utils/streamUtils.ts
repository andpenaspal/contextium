import type { StreamResponse } from 'src/clients/integrations/huggingface.integration';

export const getHuggingFaceStreamChunk = (data: StreamResponse) =>
  `data: ${JSON.stringify(data)}`;

export const getHuggingFaceStream = (data: StreamResponse[]) =>
  data.map((dataUnit) => getHuggingFaceStreamChunk(dataUnit) + '\n\n').join('');
