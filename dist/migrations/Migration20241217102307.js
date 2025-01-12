"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20241217102307 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20241217102307 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "otp" int null);`);
        this.addSql(`alter table "task" add column "created_by_id" int not null, add column "assigned_to_id" int null;`);
        this.addSql(`alter table "task" add constraint "task_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
        this.addSql(`alter table "task" add constraint "task_assigned_to_id_foreign" foreign key ("assigned_to_id") references "user" ("id") on update cascade on delete set null;`);
    }
}
exports.Migration20241217102307 = Migration20241217102307;
//# sourceMappingURL=Migration20241217102307.js.map