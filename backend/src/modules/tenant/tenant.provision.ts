import { Client } from "pg";
import { execSync } from "child_process"
import path from "path";

export const createTenantDatabase = async (dbName: string) => {
  const client = new Client({
    connectionString: process.env.MASTER_DATABASE_URL,
  });
  await client.connect();

  const safeDbName = dbName.replace(/[^a-zA-Z0-9_]/g, "");

  try {
    await client.query(`CREATE DATABASE "${safeDbName}"`)
  } catch (err: any) {
    if (err.code != "42P04") {
      throw err;
    }
  } finally {
    await client.end();
  }
};

export async function dropTenantDatabase(dbName: string) {
  const client = new Client({
    connectionString: process.env.MASTER_DATABASE_URL,
  });
  await client.connect();

  const safeDbName = dbName.replace(/[^a-zA-Z0-9_]/g, "");

  try {
    await client.query(
      `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1
        AND pid <> pg_backend_pid();
      `,
      [safeDbName]
    );
    await client.query(`DROP DATABASE IF EXISTS "${safeDbName}"`);
  } finally {
    await client.end();
  }
};

export function migrateTenantDatabase(databaseUrl: string): void {
  const schemaPath = path.resolve(
    process.cwd(),
    "prisma/tenant/schema.tenant.prisma"
  );

  console.log("Migrating tenant database...");

  execSync(
    `npx prisma migrate deploy --schema="${schemaPath}"`,
    {
      stdio: "inherit",
      env: {
        ...process.env,
        TENANT_DATABASE_URL: databaseUrl,
      },
    }
  );

  console.log("Migration completed!");
};