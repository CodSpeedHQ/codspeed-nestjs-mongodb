import { setupInstruments } from '@codspeed/vitest-plugin';
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import { afterAll, beforeAll } from 'vitest';
import { checkColimaTestcontainersDarwin } from './check';

let mongodbContainer: StartedMongoDBContainer;

async function setupMongoDB() {
  // if the database is already setup so we can skip this step
  if (globalThis.__MONGO_URI__) return;

  mongodbContainer = await new MongoDBContainer('mongo:7.0.5').start();
  const mongoUrl =
    mongodbContainer.getConnectionString() +
    '/test?replicaSet=rs0&directConnection=true';

  const { remoteAddr } = await setupInstruments({ mongoUrl });

  globalThis.__MONGO_URI__ = remoteAddr;
}

async function setup() {
  if (process.env.TESTCONTAINERS !== 'true') return;

  checkColimaTestcontainersDarwin();

  await setupMongoDB();
}

async function teardown() {
  if (process.env.TESTCONTAINERS !== 'true') return;

  // TODO: add back when stopping the container is supported in `codspeed-runner`
  // await mongodbContainer.stop();
}

beforeAll(async () => {
  await setup();
  // 30s timeout for the setup, to make sure the container is started
}, 60_000);

afterAll(async () => {
  await teardown();
});
