import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { Model } from 'mongoose';
import request from 'supertest';
import { Bench } from 'tinybench';
import { CatsFactory } from './cats.factory';
import { Cat } from './schemas/cat.schema';

faker.seed(1);

export function registerCatControllerBenches(bench: Bench) {
  let app: INestApplication;
  let catsModel: Model<Cat>;
  let catsFactory: CatsFactory;

  const cats: Cat[] = Array.from({ length: 100 }, () => ({
    name: ['river', 'felix', 'toto', 'marcel'][faker.number.int(3)],
    age: faker.number.int(20),
    breed: ['chausie', 'toyger', 'abyssinian', 'birman'][faker.number.int(3)],
  }));

  async function beforeAll() {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    catsModel = moduleRef.get(getModelToken(Cat.name));
    catsFactory = new CatsFactory(catsModel);
    await app.init();
    await catsFactory.createMany(cats);
  }
  async function afterAll() {
    await catsModel.deleteMany();
    await app.close();
  }

  bench.add(
    'GET /cats/name/:name',
    async () => {
      await request(app.getHttpServer()).get('/cats/name/river');
    },
    { beforeAll, afterAll }
  );

  bench.add(
    'GET /cats',
    async () => {
      await request(app.getHttpServer()).get('/cats');
    },
    { beforeAll, afterAll }
  );

  bench.add(
    'GET /cats/breed/:breed',
    async () => {
      await request(app.getHttpServer()).get('/cats/breed/chausie');
    },
    { beforeAll, afterAll }
  );

  bench.add(
    'GET /cats/age/greater/:age',
    async () => {
      await request(app.getHttpServer()).get('/cats/age/greater/10');
    },
    { beforeAll, afterAll }
  );
}
