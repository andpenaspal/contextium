import { server } from 'src/app';

afterAll(() => {
  server.close();
});
