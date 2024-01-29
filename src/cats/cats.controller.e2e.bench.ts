import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { Model } from 'mongoose';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  bench,
  describe,
  expect,
} from 'vitest';
import { CatsFactory } from './cats.factory';
import { Cat } from './schemas/cat.schema';

faker.seed(1);

describe('Cats (bench)', () => {
  let app: INestApplication;
  let catsModel: Model<Cat>;
  let catsFactory: CatsFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    catsModel = moduleRef.get(getModelToken(Cat.name));
    catsFactory = new CatsFactory(catsModel);
    await app.init();
  });

  const cats: Cat[] = Array.from({ length: 100 }, () => ({
    name: ['river', 'felix', 'toto', 'marcel'][faker.number.int(3)],
    age: faker.number.int(20),
    breed: ['chausie', 'toyger', 'abyssinian', 'birman'][faker.number.int(3)],
  }));

  beforeEach(async () => {
    await catsModel.deleteMany();
    await catsFactory.createMany(cats);
  });

  afterAll(async () => {
    await app.close();
  });

  bench('GET /cats', async () => {
    const response = await request(app.getHttpServer()).get('/cats');
    expect(response.body).toHaveLength(100);
  });
  bench('GET /cats/name/:name', async () => {
    const response = await request(app.getHttpServer()).get('/cats/name/river');
    expect(response.body).toHaveLength(29);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        __v: 0,
        _id: expect.any(String),
        age: expect.any(Number),
        breed: expect.any(String),
        name: 'river',
      })
    );
  });
  bench('GET /cats/breed/:breed', async () => {
    const response = await request(app.getHttpServer()).get(
      '/cats/breed/chausie'
    );
    expect(response.body).toHaveLength(27);
  });
  bench('GET /cats/age/greater/:age', async () => {
    const response = await request(app.getHttpServer()).get(
      '/cats/age/greater/10'
    );
    expect(response.body).toHaveLength(53);
  });
});
