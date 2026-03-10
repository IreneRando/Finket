CREATE TABLE transacciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creado_at TIMESTAMPTZ DEFAULT NOW(),
  monto DECIMAL(12, 2) NOT NULL,
  descripcion TEXT,
  categoria_id UUID REFERENCES categorias(id),
  fecha DATE NOT NULL, -- Para filtrar por mes y año fácilmente
  es_viaje BOOLEAN DEFAULT FALSE -- Flag para saber si este gasto pertenece a un viaje
);
