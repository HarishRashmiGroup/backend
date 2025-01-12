"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
const reflection_1 = require("@mikro-orm/reflection");
const postgresql_1 = require("@mikro-orm/postgresql");
const migrations_1 = require("@mikro-orm/migrations");
require("dotenv/config");
const logger = new common_1.Logger('MikroORM');
const config = (0, core_1.defineConfig)({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    driver: postgresql_1.PostgreSqlDriver,
    loadStrategy: core_1.LoadStrategy.JOINED,
    clientUrl: process.env.DB_URI,
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    debug: true,
    logger: logger.log.bind(logger),
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    allowGlobalContext: true,
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: './migrations',
        glob: '!(*.d).{js,ts}',
        transactional: true,
        disableForeignKeys: false,
        allOrNothing: true,
        dropTables: false,
        safe: true,
        emit: 'ts',
    },
    driverOptions: {
        connection: { ssl: { rejectUnauthorized: false } },
    },
    extensions: [migrations_1.Migrator],
    findOneOrFailHandler: (entityName) => {
        throw new common_1.NotFoundException(`${entityName} not found`);
    },
});
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map