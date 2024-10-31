import { Entity, Property, Filter, Unique, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './baseModel.js';
import { User } from './user.js';

@Entity()
export class Constituent extends BaseEntity {
   @Property()
   firstName!: string;

   @Property()
   lastName!: string;

   @Property()
   @Unique()
   email!: string;

   @Property()
   street?: string;

   @Property()
   address2?: string;
   
   @Property()
   city?: string;
   
   @Property()
   state?: string;

   @Property()
   postalCode?: string;

   @ManyToOne(() => User)
   belongsTo?: User;
}
