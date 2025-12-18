const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting manual fix 2...');

    try {
        // Add tenantID column to public.User
        console.log('Adding tenantID to public.User...');
        // Check if column exists first to avoid error
        const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'tenantID'
    `;

        if (columns.length === 0) {
            await prisma.$executeRawUnsafe(`ALTER TABLE "public"."User" ADD COLUMN "tenantID" INTEGER`);
            console.log('Column added.');

            // Add FK
            // Note: Adjust constraint name if needed.
            console.log('Adding FK...');
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "public"."User" 
        ADD CONSTRAINT "User_tenantID_fkey" 
        FOREIGN KEY ("tenantID") 
        REFERENCES "public"."Tenant"("tenantID") 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
            console.log('FK added.');
        } else {
            console.log('Column tenantID already exists.');
        }

    } catch (e) {
        console.error('Error during manual fix 2:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
