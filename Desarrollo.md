### Flujo de Trabajo y Desarrollo en Google Antigravity IDE

Llevar a cabo este proyecto dentro de un entorno nativo en la nube como Google Antigravity IDE optimiza significativamente la velocidad de desarrollo, especialmente al integrar herramientas de inteligencia artificial para la configuración del software.

A continuación, te detallo el plan de acción exacto para ejecutar la arquitectura de Next.js y Google Sheets desde tu espacio de trabajo.

### Fase 1: Configuración del Espacio de Trabajo y Andamiaje

1. **Inicialización del Entorno:** Abre un nuevo workspace en Google Antigravity IDE y vincula un repositorio de GitHub vacío destinado al dashboard.
2. **Scaffolding del Proyecto:** Abre la terminal integrada del IDE. Para acelerar la configuración del software y las dependencias, puedes utilizar Claude Code CLI directamente en la terminal para levantar la estructura base y configurar los frameworks requeridos de forma automatizada.
   Alternativamente, ejecuta los comandos estándar:

```bash
npx create-next-app@latest tanda-dashboard --tailwind --eslint --app
cd tanda-dashboard
npm install googleapis lucide-react

```

3. **Estructura de Carpetas:** Dentro del árbol del proyecto en el IDE, crea la carpeta `lib/` en la raíz para la lógica de conexión a la API y asegúrate de tener tu archivo `.env.local` listo para las credenciales.

### Fase 2: Gestión de Credenciales y Variables de Entorno

1. **Generación de Llaves (Fuera del IDE):**

- Ve a Google Cloud Console.
- Crea un proyecto, habilita la "Google Sheets API".
- Genera una Cuenta de Servicio y descarga el archivo JSON de credenciales.
- Ve al archivo de la tanda (`San-2026-01.xlsx`) y compártelo con permisos de "Lector" al correo de la Cuenta de Servicio.

2. **Configuración en Antigravity:**
   Abre el archivo `.env.local` en tu editor y define las variables extraídas del JSON.

```env
GOOGLE_CLIENT_EMAIL="tu-cuenta-de-servicio@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_AQUI\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID="el-id-alfanumerico-de-tu-url-de-google-sheets"
ADMIN_USER="admin"
ADMIN_PASSWORD="tu_password_seguro"

```

### Fase 3: Codificación de la Integración (Backend)

En el editor de Antigravity, crea el archivo `lib/googleSheets.js`. Este módulo se encargará de la autenticación de servidor a servidor.

```javascript
import { google } from "googleapis";

export async function getSheetData(range) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    // Asegura que los saltos de línea se procesen correctamente
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  );

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: range,
  });

  return response.data.values;
}
```

### Fase 4: Desarrollo de Componentes y UI

1. **Middleware de Seguridad:** En la raíz del proyecto (al mismo nivel que `app/`), crea `middleware.js` y pega el código de _Basic Authentication_ del informe anterior para proteger la ruta inmediatamente.
2. **Construcción de Vistas (App Router):**
   En `app/page.jsx`, importa tu función de lectura. Puedes solicitar rangos específicos según las pestañas de tu archivo (ej. `Dashboard!A2:P`, `KPIs_Globales!A2:M`).

```javascript
import { getSheetData } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getSheetData("Dashboard!A2:P");
  // Aquí procesas el array 'data' y lo mapeas en tu diseño Mobile-First
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Tu UI Minimalista va aquí */}
    </main>
  );
}
```

3. **Previsualización Continua:** Utiliza el panel de _Live Preview_ o el puerto expuesto en Antigravity IDE ejecutando `npm run dev` en la terminal para validar los estilos de Tailwind y los iconos de Lucide en tiempo real, ajustando las dimensiones a una vista móvil.

### Fase 5: Despliegue en Vercel

1. Realiza el _commit_ y _push_ de tus cambios desde la interfaz de control de versiones de Antigravity hacia tu repositorio de GitHub.
2. Inicia sesión en el panel de Vercel e importa ese repositorio.
3. **Paso Crítico:** Antes de hacer clic en "Deploy", copia todas las variables de tu archivo `.env.local` y pégalas en la sección "Environment Variables" de Vercel.
4. Despliega la aplicación.
