import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';

import { Constituent } from '../models/index.js';

export class ConstituentFactory extends Factory<Constituent> {
  model = Constituent;

  definition(): Partial<Constituent> {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      street: faker.location.street(),
      address2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
