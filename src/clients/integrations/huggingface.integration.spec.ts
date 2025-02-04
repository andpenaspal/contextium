import { HttpBaseClient } from 'src/clients/http/httpBaseClient';
import {
  HuggingFaceIntegration,
  type StreamResponse,
} from 'src/clients/integrations/huggingface.integration';

const requestSpy = vi.spyOn(HttpBaseClient.prototype, 'request');

const dataExampleString =
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"Why"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" do"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" programmers"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" prefer"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" dark"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" mode"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"?"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" "},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"\\n\\n"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"..."},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"Because"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" light"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" attracts"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" bugs"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"!"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" "},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"🪲"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"💡"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" "},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"\\n"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
  '\n' +
  'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":"stop"}],"usage":null}\n' +
  '\n' +
  'data: [DONE]\n' +
  '\n';

const dataExampleStream = new ReadableStream({
  start(controller) {
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(dataExampleString));
    controller.close();
  },
});

const dataExampleStreamIncompleteChunk = new ReadableStream<Uint8Array>({
  start(controller) {
    const encoder = new TextEncoder();

    const testData: StreamResponse = {
      object: '',
      created: 1,
      id: '',
      model: '',
      system_fingerprint: '',
      usage: '',
      choices: [
        {
          index: 1,
          delta: { role: 'user', content: 'content' },
          logprobs: '',
          finish_reason: '',
        },
      ],
    };

    const testString = JSON.stringify(testData);

    const chunk1 = encoder.encode(testString.slice(0, 10));
    const chunk2 = encoder.encode(testString.slice(10));

    controller.enqueue(chunk1);
    controller.enqueue(chunk2);
    controller.close();
  },
});

// const dataExampleWithoutSpace =
//   'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":"Why"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
//   '\n' +
//   'data: {"object":"chat.completion.chunk","id":"","created":1738431890,"model":"google/gemma-2-2b-it","system_fingerprint":"3.0.1-sha-bb9095a","choices":[{"index":0,"delta":{"role":"assistant","content":" do"},"logprobs":null,"finish_reason":null}],"usage":null}\n' +
//   '\n';

/**
 *Other scenarios to test:
  - Multiple "data" with one split in the middle
 */

describe('Huggingface Tests', () => {
  test('Query Stream', async () => {
    const mockResponse = 'Test Response';

    requestSpy.mockResolvedValue(mockResponse);

    const huggingFace = new HuggingFaceIntegration();

    const res = await huggingFace.queryStream('');

    expect(res).toBe(mockResponse);
  });

  // Bug: Cannot be tested
  // https://github.com/capricorn86/happy-dom/issues/1180
  test.todo('Process Stream', async () => {
    const huggingFace = new HuggingFaceIntegration();

    const content = await huggingFace.processStream(
      dataExampleStream,
      () => null
    );

    expect(content).toContain('Why do programmers prefer dark mode?');
  });

  // Bug: Cannot be tested
  // https://github.com/capricorn86/happy-dom/issues/1180
  test.todo('Process Stream with incomplete data', async () => {
    const huggingFace = new HuggingFaceIntegration();

    const content = await huggingFace.processStream(
      dataExampleStreamIncompleteChunk,
      () => null
    );

    expect(content).toBe('content');
  });

  // Bug: Cannot be tested
  // https://github.com/capricorn86/happy-dom/issues/1180
  test.todo('Process Stream calls callback', async () => {
    const cb = vi.fn();
    const mockResponse = new Response(dataExampleStream, {
      headers: { 'Content-Type': 'text/stream' },
    });

    requestSpy.mockResolvedValue(mockResponse);

    const huggingFace = new HuggingFaceIntegration();

    const res = await huggingFace.queryStream('');

    await huggingFace.processStream(res, cb);

    expect(cb).toHaveBeenCalledWith(
      expect.stringContaining('Why do programmers prefer dark mode?')
    );
  });
});
