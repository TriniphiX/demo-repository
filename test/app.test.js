import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';

let baseUrl;
let server;

describe('TriniphiX app', () => {
  before(async () => {
    server = createServer(createApp());
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('returns the company health payload', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
    assert.equal(payload.company, 'TriniphiX');
  });

  it('serves the TriniphiX homepage', async () => {
    const response = await fetch(baseUrl);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /How to roadmap your/);
  });
});
