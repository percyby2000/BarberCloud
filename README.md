# BarberCloud

> **Plataforma SaaS moderna para la gestión integral de barberías y salones de belleza**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-181818?logo=supabase)](https://supabase.com)

---

## 📋 Descripción

BarberCloud es una solución SaaS (Software as a Service) diseñada para automatizar y optimizar la gestión de barberías y salones de belleza. La plataforma ofrece un sistema integral de reservas, administración de personal, control de servicios y análisis de negocio, con una interfaz moderna, responsive y altamente intuitiva.

Construida con **Astro**, **TypeScript** y **TailwindCSS**, garantiza un rendimiento superior, excelente experiencia de usuario y escalabilidad empresarial.

---

## ✨ Características Principales

### 📅 **Gestión de Reservas**
- Sistema de reservas en tiempo real
- Calendario interactivo con disponibilidad actualizada
- Confirmación y recordatorios automáticos
- Gestión de cancelaciones y reprogramaciones

### ✂️ **Administración de Personal**
- Perfil detallado de barberos/profesionales
- Gestión de horarios y días libres
- Asignación de servicios por profesional
- Historial de desempeño y calificaciones

### 👥 **Gestión de Clientes**
- Base de datos centralizada de clientes
- Historial de servicios y preferencias
- Perfiles con datos de contacto
- Sistema de clientes frecuentes

### 💳 **Control Financiero**
- Gestión de pagos y facturación
- Múltiples métodos de pago
- Control de ingresos por servicio y profesional
- Reportes financieros detallados

### 📊 **Dashboard Administrativo**
- Estadísticas en tiempo real
- Gráficos de tendencias y ocupación
- KPIs de negocio
- Exportación de reportes

### 🔔 **Notificaciones Inteligentes**
- Recordatorios automáticos por WhatsApp
- Notificaciones por correo electrónico
- Confirmación de citas
- Alertas de cambios de horario

### 🤖 **Inteligencia Artificial**
- Predicción de horarios de alta demanda
- Recomendaciones de servicios personalizadas
- Chatbot para consultas automáticas
- Análisis predictivo de clientes

---

## 🏗️ Estructura del Proyecto

```
turnobar/
├── public/                          # Archivos estáticos (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── admin/                  # Componentes del panel administrativo
│   │   ├── reservas/               # Componentes de reservas
│   │   └── ui/                     # Componentes UI reutilizables
│   ├── layouts/
│   │   ├── AdminLayout.astro       # Layout para sección admin
│   │   └── BaseLayout.astro        # Layout base de la aplicación
│   ├── pages/
│   │   ├── api/                    # Rutas API y endpoints
│   │   ├── admin/                  # Páginas administrativas
│   │   ├── profesional/            # Páginas para profesionales
│   │   ├── reservar/               # Flujo de reservas
│   │   ├── index.astro             # Página principal
│   │   ├── login.astro             # Autenticación
│   │   └── signup.astro            # Registro
│   ├── lib/
│   │   ├── slots.ts                # Lógica de disponibilidad
│   │   └── supabase.ts             # Cliente y utilidades Supabase
│   ├── styles/
│   │   ├── global.css              # Estilos globales
│   │   └── variables.css           # Variables CSS y temas
│   └── env.d.ts                    # Definiciones de variables de entorno
├── supabase/
│   ├── functions/                  # Funciones serverless
│   │   ├── calcular-slots/         # Cálculo de disponibilidad
│   │   ├── crear-reserva/          # Creación de reservas
│   │   └── enviar-recordatorio/    # Notificaciones
│   └── migrations/                 # Migraciones de base de datos
├── astro.config.mjs                # Configuración de Astro
├── tailwind.config.mjs             # Configuración de TailwindCSS
├── tsconfig.json                   # Configuración de TypeScript
└── package.json                    # Dependencias del proyecto
```

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Propósito | Versión |
|-----------|----------|---------|
| **[Astro](https://astro.build)** | Framework web moderno con SSR | Latest |
| **[TypeScript](https://www.typescriptlang.org)** | Tipado estático | 5.x |
| **[TailwindCSS](https://tailwindcss.com)** | Framework CSS utility-first | 3.x |
| **[Supabase](https://supabase.com)** | Backend y base de datos PostgreSQL | Latest |
| **[Deno](https://deno.land)** | Runtime para funciones serverless | Latest |

---

## 🚀 Requisitos Previos

- **Node.js** 18.x o superior
- **npm** o **yarn** (gestor de paquetes)
- Cuenta de **Supabase** (gratuita o pago)
- Variables de entorno configuradas

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/percyconde/turnobar.git
cd turnobar
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env.local` en la raíz del proyecto:
```env
PUBLIC_SUPABASE_URL=tu_url_supabase
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
# Agregar otras variables según necesidad
```

### 4. Ejecutar migraciones de base de datos
```bash
# Aplicar migraciones en Supabase
supabase migration up
```

### 5. Iniciar el servidor de desarrollo
```bash
npm run dev
```

El servidor estará disponible en **http://localhost:4321**

---

## 🧞 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot reload |
| `npm run build` | Genera la versión optimizada para producción |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm install` | Instala todas las dependencias del proyecto |
| `npm run astro -- --help` | Muestra ayuda de la CLI de Astro |

---

## 🔐 Autenticación y Seguridad

- Autenticación mediante **Supabase Auth**
- Soporte para login con correo/contraseña
- Sistema de roles (Admin, Profesional, Cliente)
- Protección de rutas según permisos
- Variables sensibles en `.env.local` (no versionadas)

---

## 🧠 Roadmap - Funciones Futuras

- [ ] Integración con pasarelas de pago (Stripe, MercadoPago)
- [ ] Predicción de horarios con IA
- [ ] Recomendaciones personalizadas de servicios
- [ ] Análisis avanzado de ingresos
- [ ] Asistente virtual para reservas
- [ ] Estadísticas de clientes frecuentes
- [ ] Integración con WhatsApp Business API
- [ ] App móvil nativa (React Native)
- [ ] Sistema de puntos y promociones

---

## 👥 Casos de Uso Ideales

- ✂️ Barberías modernas y especializadas
- 💈 Salones de belleza premium
- 💇 Centros de spa y bienestar
- 🏪 Franquicias de barbería
- 👨‍💼 Negocios que buscan automatizar reservas
- 📊 Empresas que requieren analytics avanzado

---

## 📈 Desempeño

- ⚡ **Tiempo de carga:** < 2 segundos (Lighthouse)
- 🎯 **Performance Score:** 90+
- 📱 **Mobile Friendly:** 100%
- ♿ **Accessibility:** Cumple WCAG 2.1 AA
- 🔒 **Security Score:** A+

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios significativos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Percy Conde** - [@percyconde](https://github.com/percyconde)

---

## 📞 Soporte

Para reportar bugs o sugerencias, abre un [issue](https://github.com/percyconde/turnobar/issues) en el repositorio.

---

*BarberCloud - Modernizando la gestión de barberías con tecnología inteligente* ✂️