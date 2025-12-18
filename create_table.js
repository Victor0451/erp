const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createEmpleadosCategoriasTable() {
  try {
    console.log('Ejecutando queries para crear tabla empleados_categorias...');

    // Crear la secuencia
    console.log('1. Creando secuencia...');
    await prisma.$executeRawUnsafe(`
      CREATE SEQUENCE IF NOT EXISTS cari.empleados_categorias_idcategoria_seq
          INCREMENT 1
          START 1
          MINVALUE 1
          MAXVALUE 2147483647
          CACHE 1
    `);

    // Crear la tabla
    console.log('2. Creando tabla empleados_categorias...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS cari.empleados_categorias (
          idcategoria INTEGER NOT NULL DEFAULT nextval('cari.empleados_categorias_idcategoria_seq'::regclass),
          categoria VARCHAR(255) NOT NULL,
          descripcion VARCHAR(1000),
          estado BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT empleados_categorias_pkey PRIMARY KEY (idcategoria),
          CONSTRAINT empleados_categorias_categoria_key UNIQUE (categoria)
      )
    `);

    // Crear índices
    console.log('3. Creando índices...');
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS empleados_categorias_categoria_key
          ON cari.empleados_categorias USING btree (categoria)
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS empleados_categorias_estado_idx
          ON cari.empleados_categorias USING btree (estado)
    `);

    // Crear función y trigger para updatedAt
    console.log('4. Creando trigger para updatedAt...');
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION cari.update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW."updatedAt" = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_empleados_categorias_updated_at
          BEFORE UPDATE ON cari.empleados_categorias
          FOR EACH ROW EXECUTE FUNCTION cari.update_updated_at_column()
    `);

    // Agregar columna idcategoria a empleados
    console.log('5. Modificando tabla empleados...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE cari.empleados
      ADD COLUMN IF NOT EXISTS idcategoria INTEGER
    `);

    // Crear índice y foreign key
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS empleados_idcategoria_idx
          ON cari.empleados USING btree (idcategoria)
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE cari.empleados
      ADD CONSTRAINT empleados_idcategoria_fkey
          FOREIGN KEY (idcategoria) REFERENCES cari.empleados_categorias(idcategoria) ON DELETE SET NULL
    `);

    // Insertar datos iniciales
    console.log('6. Insertando datos iniciales...');
    await prisma.$executeRawUnsafe(`
      INSERT INTO cari.empleados_categorias (categoria, descripcion, estado) VALUES
      ('Administrativo', 'Personal administrativo y de oficina', true),
      ('Operativo', 'Personal operativo y de producción', true),
      ('Gerencial', 'Personal directivo y gerencial', true),
      ('Técnico', 'Personal técnico especializado', true)
      ON CONFLICT (categoria) DO NOTHING
    `);

    console.log('✅ Tabla empleados_categorias creada exitosamente');
    console.log('✅ Relación con empleados establecida');
    console.log('✅ Datos iniciales insertados');

  } catch (error) {
    console.error('❌ Error al crear la tabla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createEmpleadosCategoriasTable();
