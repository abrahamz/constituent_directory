import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import bcrypt from 'bcrypt';

import { User } from '../models/index.js';

export class UserSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      email: 'foo@bar.com',
      firstName: 'Test',
      lastName: 'User',
      password: await bcrypt.hash('testing', 10),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

}
