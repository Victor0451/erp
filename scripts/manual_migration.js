const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting manual migration...');

    try {
        // Fix cari.clientes.telefono
        console.log('Altering cari.clientes.telefono...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "cari"."clientes" ALTER COLUMN "telefono" TYPE VARCHAR(50) USING "telefono"::VARCHAR`);

        // Fix cari.clientes.dni
        console.log('Altering cari.clientes.dni...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "cari"."clientes" ALTER COLUMN "dni" TYPE VARCHAR(20) USING "dni"::VARCHAR`);

        // Fix cari.proveedores.telefono
        console.log('Altering cari.proveedores.telefono...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "cari"."proveedores" ALTER COLUMN "telefono" TYPE VARCHAR(50) USING "telefono"::VARCHAR`);

        // Fix public.Tenant.telefono
        // Note: Table name might be case sensitive if created with quotes. Trying "Tenant".
        console.log('Altering public.Tenant.telefono...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."Tenant" ALTER COLUMN "telefono" TYPE VARCHAR(50) USING "telefono"::VARCHAR`);

        console.log('Manual migration completed successfully.');
    } catch (e) {
        console.error('Error during manual migration:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
