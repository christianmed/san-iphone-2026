# AGENTS.md — Reglas de Ingeniería y Flujo de Trabajo

Este documento define el marco de operación estricto para agentes de IA que operen en este repositorio mediante **Antigravity CLI** (`agy`), alineado con los estándares del framework `addyosmani/agent-skills`.

## 1. Principios Operativos Fundamentales

1. **No asumir requerimientos ambiguos:** Si una tarea tiene especificaciones incompletas, invoca `/agent-skills:interview-me` o haz preguntas directas antes de escribir código.

2. **Especificación previa a la implementación:** Ninguna funcionalidad nueva se implementa directamente en código sin una especificación aprobada (`/agent-skills:spec-driven-development`).

3. **Desarrollo Incremental:** Los cambios deben realizarse en rebanadas verticales pequeñas y comprobables (`/agent-skills:incremental-implementation`), evitando PRs o commits masivos monolíticos.

4. **Verificación obligatoria:** Todo cambio debe validarse mediante pruebas automatizadas y chequeo de tipos antes de considerarse completado.

## 2. Flujo de Trabajo por Fases (Skill Mapping)

```
[1. Entrevista/Descubrimiento]
       ↓
[2. Especificación (Spec)]
       ↓
[3. Descomposición en Tareas]
       ↓
[4. TDD (Red-Green-Refactor)]
       ↓
[5. Revisión en 5 Ejes]

```

### Fase 1: Especificación y Requisitos

- Invocar: `/agent-skills:spec-driven-development`

- Generar o actualizar un archivo `docs/specs/<feature-name>.md` que contenga:
  - Contexto y objetivos de negocio.

  - Alcance (In-Scope y Out-of-Scope).

  - Casos de prueba de aceptación en formato BDD (_Given / When / Then_).

  - Consideraciones de seguridad y rendimiento.

### Fase 2: Planificación y Tareas

- Invocar: `/agent-skills:planning-and-task-breakdown`

- Descomponer el trabajo en unidades atómicas e independientes:
  - Cada tarea debe tener un criterio de aceptación medible.

  - Ordenar las tareas respetando dependencias técnicas (ej. esquemas de datos antes de lógica de negocio, mocks antes de clientes de integración).

### Fase 3: Implementación guiada por Pruebas (TDD)

- Invocar: `/agent-skills:test-driven-development`

- Seguir la regla estricta de **Red-Green-Refactor**:
  1. **Rojo:** Escribir un test unitario o de integración mínimo que falle.

  2. **Verde:** Escribir el código mínimo necesario para hacer pasar el test.

  3. **Refactor:** Mejorar legibilidad, modularidad y rendimiento manteniendo los tests en verde.

- **Pirámide de pruebas requerida:**
  - $80\%$ Pruebas unitarias (rápidas, aisladas, sin I/O real).

  - $15\%$ Pruebas de integración (contratos de API, base de datos en memoria o fixtures).

  - $5\%$ Pruebas End-to-End (flujos críticos de usuario).

### Fase 4: Auditoría y Revisión de Código

- Invocar: `/agent-skills:code-review-and-quality`

- Evaluar cualquier cambio de código en los siguientes 5 ejes antes de finalizar la tarea:
  1. **Arquitectura:** Acoplamiento bajo, alta cohesión, modularidad y separación de responsabilidades.

  2. **Seguridad:** Validación rigurosa de entradas, saneamiento, prevención de inyecciones (SQL/XSS), manejo seguro de secretos y permisos.

  3. **Rendimiento:** Evitar consultas $N+1$, optimizar complejidad temporal ($O(n)$) y espacial, uso eficiente de memoria y conexiones.

  4. **Calidad de Pruebas:** Cobertura de caminos felices y caminos de error (_edge cases_). Ausencia de aserciones triviales o tests frágiles.

  5. **Mantenibilidad y Estilo:** Nombres descriptivos, código auto-documentado, tipado estricto y cumplimiento de linters.

## 3. Reglas de Modificación de Archivos y Entorno

- **Preservación del contexto:** No reescribir archivos completos innecesariamente; utilizar ediciones de diff precisas.

- **Manejo de dependencias:** No instalar paquetes externos sin justificar previamente por qué la biblioteca estándar o dependencias existentes no resuelven el problema.

- **Entorno aislado:** Cualquier comando de instalación, migración o ejecución de tests debe ser compatible con la ejecución en sandbox (`agy --sandbox`).

- **Commits:** Seguir la convención de [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: <descripción corta>`

  - `fix: <descripción corta>`

  - `test: <descripción corta>`

  - `refactor: <descripción corta>`

  - `docs: <descripción corta>`

## 4. Compuerta de Salida (Definition of Done)

Una tarea sólo se marca como concluida cuando el agente haya verificado:

- \[ \] La especificación técnica está documentada y actualizada.

- \[ \] Todos los tests nuevos y preexistentes se ejecutan y aprueban exitosamente.

- \[ \] No existen advertencias críticas de linter ni errores de tipado.

- \[ \] La revisión en los 5 ejes ha sido superada sin señalamientos pendientes.
