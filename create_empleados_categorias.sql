-- Crear la secuencia para autoincremento
CREATE SEQUENCE IF NOT EXISTS cari.empleados_categorias_idcategoria_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Crear la tabla empleados_categorias
CREATE TABLE IF NOT EXISTS cari.empleados_categorias (
    idcategoria INTEGER NOT NULL DEFAULT nextval('cari.empleados_categorias_idcategoria_seq'::regclass),
    categoria VARCHAR(255) NOT NULL,
    descripcion VARCHAR(1000),
    estado BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT empleados_categorias_pkey PRIMARY KEY (idcategoria),
    CONSTRAINT empleados_categorias_categoria_key UNIQUE (categoria)
);

-- Crear índices
CREATE UNIQUE INDEX IF NOT EXISTS empleados_categorias_categoria_key
    ON cari.empleados_categorias USING btree (categoria);

CREATE INDEX IF NOT EXISTS empleados_categorias_estado_idx
    ON cari.empleados_categorias USING btree (estado);

-- Crear trigger para updatedAt
CREATE OR REPLACE FUNCTION cari.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empleados_categorias_updated_at
    BEFORE UPDATE ON cari.empleados_categorias
    FOR EACH ROW EXECUTE FUNCTION cari.update_updated_at_column();

-- Agregar la columna idcategoria si no existe en empleados
ALTER TABLE cari.empleados
ADD COLUMN IF NOT EXISTS idcategoria INTEGER;

-- Crear el índice para la foreign key
CREATE INDEX IF NOT EXISTS empleados_idcategoria_idx
    ON cari.empleados USING btree (idcategoria);

-- Agregar la foreign key constraint
ALTER TABLE cari.empleados
ADD CONSTRAINT empleados_idcategoria_fkey
    FOREIGN KEY (idcategoria) REFERENCES cari.empleados_categorias(idcategoria) ON DELETE SET NULL;

-- Insertar categorías básicas de empleados
INSERT INTO cari.empleados_categorias (categoria, descripcion, estado) VALUES
('Administrativo', 'Personal administrativo y de oficina', true),
('Operativo', 'Personal operativo y de producción', true),
('Gerencial', 'Personal directivo y gerencial', true),
('Técnico', 'Personal técnico especializado', true)
ON CONFLICT (categoria) DO NOTHING;
