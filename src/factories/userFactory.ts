import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';

import { User } from '../models/index.js';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: 'temporary',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
