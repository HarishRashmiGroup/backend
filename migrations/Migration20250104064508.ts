import { Migration } from '@mikro-orm/migrations';

export class Migration20250104064508 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "comment" ("id" serial primary key, "description" text not null, "created_by_id" int not null, "task_id" int not null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "comment" add constraint "comment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
  }

}
