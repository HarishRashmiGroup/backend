"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250104095658 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250104095658 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "comment" drop constraint "comment_task_id_foreign";`);
        this.addSql(`alter table "comment" alter column "task_id" type int using ("task_id"::int);`);
        this.addSql(`alter table "comment" alter column "task_id" drop not null;`);
        this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on delete cascade;`);
    }
    async down() {
        this.addSql(`alter table "comment" drop constraint "comment_task_id_foreign";`);
        this.addSql(`alter table "comment" alter column "task_id" type int using ("task_id"::int);`);
        this.addSql(`alter table "comment" alter column "task_id" set not null;`);
        this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
    }
}
exports.Migration20250104095658 = Migration20250104095658;
//# sourceMappingURL=Migration20250104095658.js.map