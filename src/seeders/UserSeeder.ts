import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

import { User } from '../models/index.js';
import type { SeederContext } from './types/context.js';

// There is a lot of copy and paste here due to factories unabled to async 
//and I wanted to generate new password hashes for each user created
export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: SeederContext): Promise<void> {
    dotenv.config();

    context.users = [] as User[];
    const user1 = em.create(User, {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await bcrypt.hash(process.env.FIRST_USER_PASSWORD || 'DefaultPassword', 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const firstName2 = faker.person.firstName();
    const lastName2 = faker.person.lastName();
    const user2 = em.create(User, {
      email: faker.internet.email(),
      firstName: firstName2,
      lastName: lastName2,
      password: await bcrypt.hash(`${firstName2}${lastName2}`, 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const firstName3 = faker.person.firstName();
    const lastName3 = faker.person.lastName();
    const user3 = em.create(User, {
      email: faker.internet.email(),
      firstName: firstName3,
      lastName: lastName3,
      password: await bcrypt.hash(`${firstName3}${lastName3}`, 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const firstName4 = faker.person.firstName();
    const lastName4 = faker.person.lastName();
    const user4 = em.create(User, {
      email: faker.internet.email(),
      firstName: firstName4,
      lastName: lastName4,
      password: await bcrypt.hash(`${firstName4}${lastName4}`, 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const firstName5 = faker.person.firstName();
    const lastName5 = faker.person.lastName();
    const user5 = em.create(User, {
      email: faker.internet.email(),
      firstName: firstName5,
      lastName: lastName5,
      password: await bcrypt.hash(`${firstName5}${lastName5}`, 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    context.users.push(user1)
    context.users.push(user2)
    context.users.push(user3)
    context.users.push(user4)
    context.users.push(user5)
  }

}
