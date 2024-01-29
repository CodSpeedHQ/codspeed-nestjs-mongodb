import { Factory } from 'testUtils/factory';
import { Cat } from './schemas/cat.schema';

export class CatsFactory extends Factory<Cat> {
  protected createBase = (cat?: Partial<Cat>): Cat => ({
    name: cat.name ?? 'Felix',
    age: cat.age ?? 1,
    breed: cat.breed ?? 'Maine Coon',
  });
}
