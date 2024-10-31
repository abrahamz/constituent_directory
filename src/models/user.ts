import { Entity, Property, Filter } from '@mikro-orm/core';
import { BaseEntity } from './baseModel.js';

@Entity()
export class User extends BaseEntity {
   @Property()
   firstName!: string;

   @Property()
   lastName!: string;

   @Property()
   email!: string;

   @Property()
   password!: string;
}