const { Client } = require("pg");
const fs = require("fs");

const SQL = fs.readFileSync("supabase-migration-ai-agent.sql", "utf8");

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZ21neXB3emltaGhhcGF6YWNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTUzMzcwNiwiZXhwIjoyMDk3MTA5NzA2fQ.crOcjWq8-nfKhDS1CYGgSkMJ19Wdz43RGjcAppTs03o";

const configs = [
  // Pooler (session mode)
  {
    name: "pooler-session",
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    user: "postgres.kqgmygpwzimhhapazacd",
    password: SERVICE_KEY,
  },
  // Direct connection
  {
    name: "direct",
    host: "db.kqgmygpwzimhhapazacd.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: SERVICE_KEY,
  },
  // Pooler (transaction mode)
  {
    name: "pooler-txn",
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres.kqgmygpwzimhhapazacd",
    password: SERVICE_KEY,
  },
];

async function tryAll() {
  for (const cfg of configs) {
    console.log(`Trying ${cfg.name}...`);
    const client = new Client({ ...cfg, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    try {
      await client.connect();
      console.log(`✅ Connected via ${cfg.name}!`);
      await client.query(SQL);
      console.log("✅ Migration executed successfully!");
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ ${cfg.name}: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }
  console.log("\n❌ All connection attempts failed.");
  process.exit(1);
}

tryAll();
