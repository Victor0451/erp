const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Inspecting all PKs...');

    try {
        const pks = await prisma.$queryRaw`
      SELECT n.nspname as schema, t.relname as table_name, c.conname as pk_name
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      WHERE c.contype = 'p' AND n.nspname IN ('public', 'cari')
      ORDER BY schema, table_name
    `;
        console.log('PKs:', pks);

    } catch (e) {
        console.error('Error inspecting PKs:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
