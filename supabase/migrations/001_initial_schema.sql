-- 1. SALONES
CREATE TABLE salones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  descripcion   TEXT,
  logo_url      TEXT,
  color_primario TEXT DEFAULT '#4ae639ff',
  color_acento  TEXT DEFAULT '#114774ff',
  telefono      TEXT,
  direccion     TEXT,
  ciudad        TEXT,
  pais          TEXT DEFAULT 'AR',
  plan          TEXT DEFAULT 'free',
  activo        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. PROFESIONALES
CREATE TABLE profesionales (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id      UUID REFERENCES salones(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID REFERENCES auth.users(id),
  nombre        TEXT NOT NULL,
  apellido      TEXT NOT NULL,
  bio           TEXT,
  foto_url      TEXT,
  especialidades TEXT[],
  telefono      TEXT,
  email         TEXT,
  activo        BOOLEAN DEFAULT true,
  orden         INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. SERVICIOS
CREATE TABLE servicios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id      UUID REFERENCES salones(id) ON DELETE CASCADE NOT NULL,
  nombre        TEXT NOT NULL,
  descripcion   TEXT,
  duracion_min  INT NOT NULL,
  precio        NUMERIC(10,2),
  moneda        TEXT DEFAULT 'ARS',
  categoria     TEXT,
  imagen_url    TEXT,
  activo        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 4. RELACIÓN PROFESIONAL-SERVICIO
CREATE TABLE profesional_servicios (
  profesional_id UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  servicio_id    UUID REFERENCES servicios(id) ON DELETE CASCADE,
  PRIMARY KEY (profesional_id, servicio_id)
);

-- 5. HORARIOS RECURRENTES
CREATE TABLE horarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id  UUID REFERENCES profesionales(id) ON DELETE CASCADE NOT NULL,
  dia_semana      INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio     TIME NOT NULL,
  hora_fin        TIME NOT NULL,
  activo          BOOLEAN DEFAULT true
);

-- 6. EXCEPCIONES (VACACIONES, BLOQUEOS)
CREATE TABLE excepciones_horario (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id  UUID REFERENCES profesionales(id) ON DELETE CASCADE NOT NULL,
  fecha           DATE NOT NULL,
  tipo            TEXT NOT NULL, -- 'dia_libre' | 'horario_especial'
  hora_inicio     TIME,
  hora_fin        TIME,
  motivo          TEXT
);

-- 7. CITAS (RESERVAS)
CREATE TABLE citas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id        UUID REFERENCES salones(id) ON DELETE CASCADE NOT NULL,
  profesional_id  UUID REFERENCES profesionales(id) NOT NULL,
  servicio_id     UUID REFERENCES servicios(id) NOT NULL,
  cliente_nombre  TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email   TEXT,
  cliente_notas   TEXT,
  fecha_inicio    TIMESTAMPTZ NOT NULL,
  fecha_fin       TIMESTAMPTZ NOT NULL,
  estado          TEXT DEFAULT 'pendiente', -- pendiente | confirmada | cancelada | completada | no_asistio
  cancelacion_motivo TEXT,
  recordatorio_enviado BOOLEAN DEFAULT false,
  recordatorio_24h_enviado BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 8. NOTIFICACIONES PROFESIONAL
CREATE TABLE notificaciones_profesional (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id  UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  cita_id         UUID REFERENCES citas(id) ON DELETE CASCADE,
  tipo            TEXT NOT NULL,
  canal           TEXT NOT NULL,
  leida           BOOLEAN DEFAULT false,
  enviada         BOOLEAN DEFAULT false,
  payload         JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES
ALTER TABLE salones ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesional_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE excepciones_horario ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones_profesional ENABLE ROW LEVEL SECURITY;

-- Public access for booking
CREATE POLICY "Public read active salons" ON salones FOR SELECT USING (activo = true);
CREATE POLICY "Public read active professionals" ON profesionales FOR SELECT USING (activo = true);
CREATE POLICY "Public read active services" ON servicios FOR SELECT USING (activo = true);
CREATE POLICY "Public read schedules" ON horarios FOR SELECT USING (activo = true);
CREATE POLICY "Public read exceptions" ON excepciones_horario FOR SELECT USING (true);
CREATE POLICY "Public create appointments" ON citas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read appointments" ON citas FOR SELECT USING (true); -- Usually restricted by ID/email in real app but for MVP simple

-- Owner/Admin access (based on owner_id in salones)
CREATE POLICY "Owner full access salon" ON salones FOR ALL USING (auth.uid() = owner_id);

-- Professionals access to their own data
CREATE POLICY "Professional read own profile" ON profesionales FOR SELECT USING (user_id = auth.uid());
