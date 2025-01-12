import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import 'dotenv/config';
declare const config: import("@mikro-orm/core").Options<PostgreSqlDriver, import("@mikro-orm/postgresql").EntityManager<PostgreSqlDriver> & import("@mikro-orm/core").EntityManager<import("@mikro-orm/core").IDatabaseDriver<import("@mikro-orm/core").Connection>>>;
export default config;
