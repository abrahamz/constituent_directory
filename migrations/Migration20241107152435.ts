import { Migration } from '@mikro-orm/migrations';

export class Migration20241107152435 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);`);

    this.addSql(`create table "constituent" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "street" varchar(255) null, "address2" varchar(255) null, "city" varchar(255) null, "state" varchar(255) null, "postal_code" varchar(255) null, "belongs_to_id" int null);`);
    this.addSql(`alter table "constituent" add constraint "constituent_email_unique" unique ("email");`);

    this.addSql(`alter table "constituent" add constraint "constituent_belongs_to_id_foreign" foreign key ("belongs_to_id") references "user" ("id") on update cascade on delete set null;`);
  }

}
