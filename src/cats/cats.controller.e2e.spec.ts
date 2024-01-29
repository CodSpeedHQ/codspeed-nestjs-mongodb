import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { Model } from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CatsFactory } from './cats.factory';
import { Cat } from './schemas/cat.schema';

describe('Cats', () => {
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

  beforeEach(async () => {
    await catsModel.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET cats`, async () => {
    await catsFactory.createMany([{ name: 'river' }, { name: 'felix' }]);
    const response = await request(app.getHttpServer()).get('/cats');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('/GET cats/name/:name', async () => {
    await catsFactory.createOne({ name: 'river' });
    const response = await request(app.getHttpServer()).get('/cats/name/river');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'river' })])
    );
  });
});
