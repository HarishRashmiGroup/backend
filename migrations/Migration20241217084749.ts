import { Migration } from '@mikro-orm/migrations';

export class Migration20241217084749 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "task" ("id" serial primary key, "description" text not null, "due_date" date not null, "status" text check ("status" in ('pending', 'completed', 'paused')) not null default 'pending', "created_at" timestamptz not null, "updated_at" timestamptz null);`);
  }

}
