import { Entity, Property, Filter, Unique, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './baseModel.js';
import { User } from './user.js';
import { IsEmail, Length, Min } from 'class-validator';

@Entity()
@Filter({ name: 'electedOfficial', cond: args => ({ belongsTo: { id: args.belongsToId } }) })
export class Constituent extends BaseEntity {
   @Length(1)
   @Property()
   firstName!: string;

   @Length(1)
   @Property()
   lastName!: string;

   @IsEmail()
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
   belongsTo!: User;
}
