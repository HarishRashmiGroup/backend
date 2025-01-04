import { Migration } from '@mikro-orm/migrations';

export class Migration20250104095658 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "comment" drop constraint "comment_task_id_foreign";`);

    this.addSql(`alter table "comment" alter column "task_id" type int using ("task_id"::int);`);
    this.addSql(`alter table "comment" alter column "task_id" drop not null;`);
    this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "comment" drop constraint "comment_task_id_foreign";`);

    this.addSql(`alter table "comment" alter column "task_id" type int using ("task_id"::int);`);
    this.addSql(`alter table "comment" alter column "task_id" set not null;`);
    this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
  }

}
