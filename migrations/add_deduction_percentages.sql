-- Add percentage columns to haberes table
ALTER TABLE cari.haberes ADD COLUMN IF NOT EXISTS jubilacion_porcentaje DOUBLE PRECISION;
ALTER TABLE cari.haberes ADD COLUMN IF NOT EXISTS ley_19032_porcentaje DOUBLE PRECISION;
ALTER TABLE cari.haberes ADD COLUMN IF NOT EXISTS obra_social_porcentaje DOUBLE PRECISION;
ALTER TABLE cari.haberes ADD COLUMN IF NOT EXISTS renatea_porcentaje DOUBLE PRECISION;
ALTER TABLE cari.haberes ADD COLUMN IF NOT EXISTS cta_solidaria_porcentaje DOUBLE PRECISION;
