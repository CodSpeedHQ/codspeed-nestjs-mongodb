import { Bench } from 'tinybench';
import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { registerCatControllerBenches } from 'cats/cats.controller.tinybench';

console.log('Running benchmarks... MONGO_URL:', process.env.MONGO_URL);

const bench = withCodSpeed(new Bench());

(async () => {
  registerCatControllerBenches(bench);

  await bench.run();
  console.table(bench.table());
})();
