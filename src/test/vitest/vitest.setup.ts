import { webServer } from 'src/app';

process.env.SERVER_PORT = '1234';

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => null);
  vi.spyOn(console, 'error').mockImplementation(() => null);
  vi.spyOn(console, 'warn').mockImplementation(() => null);
});

afterAll(() => {
  webServer.close();
});
