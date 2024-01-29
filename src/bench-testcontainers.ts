import { setupInstruments, withCodSpeed } from '@codspeed/tinybench-plugin';
import { MongoDBContainer } from '@testcontainers/mongodb';
import { registerCatControllerBenches } from 'cats/cats.controller.tinybench';
import { checkColimaTestcontainersDarwin } from 'testUtils/check';
import { Bench } from 'tinybench';

async function setupDatabase() {
  checkColimaTestcontainersDarwin();

  const mongodbContainer = await new MongoDBContainer('mongo:7.0.5').start();
  const mongoUrl =
    mongodbContainer.getConnectionString() +
    '/test?replicaSet=rs0&directConnection=true';

  const { remoteAddr } = await setupInstruments({ mongoUrl });
  process.env.MONGO_URL = remoteAddr;
}

const bench = withCodSpeed(new Bench());

(async () => {
  await setupDatabase();

  registerCatControllerBenches(bench);

  await bench.run();
  console.table(bench.table());
})();
