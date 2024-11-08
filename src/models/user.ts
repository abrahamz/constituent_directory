import { Entity, Property, Filter } from '@mikro-orm/core';
import { BaseEntity } from './baseModel.js';
import { IsEmail, Length, Min } from 'class-validator';

@Entity()
export class User extends BaseEntity {
   @Length(1)
   @Property()
   firstName!: string;
   
   @Length(1)
   @Property()
   lastName!: string;

   @IsEmail()
   @Property()
   email!: string;

   @Length(10)
   @Property()
   password!: string;
}
