"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20241217084749 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20241217084749 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table "task" ("id" serial primary key, "description" text not null, "due_date" date not null, "status" text check ("status" in ('pending', 'completed', 'paused')) not null default 'pending', "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    }
}
exports.Migration20241217084749 = Migration20241217084749;
//# sourceMappingURL=Migration20241217084749.js.map