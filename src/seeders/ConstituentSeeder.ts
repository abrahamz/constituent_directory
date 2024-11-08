import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { ConstituentFactory } from '../factories/constituentFactory.js';
import { SeederContext } from './types/context.js';

export class ConstituentSeeder extends Seeder {

  async run(em: EntityManager, context: SeederContext): Promise<void> {
    const contituents = new ConstituentFactory(em).each(constituent => {
      constituent.belongsTo = context.users[Math.floor(Math.random() * 5)];
    }).make(500);
  }

}
