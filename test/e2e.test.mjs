import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('Tanda iPhone 18 Pro Max - E2E & Integration Suite', () => {
  const rootDir = path.resolve(process.cwd());

  describe('1. Verificación de Integridad de Componentes y Sin Iconos Faltantes', () => {
    it('todos los componentes que usan Smartphone deben importarlo correctamente', () => {
      const componentsDir = path.join(rootDir, 'components');
      const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

      for (const file of files) {
        const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
        const usesSmartphone = content.includes('<Smartphone');
        if (usesSmartphone) {
          const importsSmartphone = content.includes('Smartphone') && content.includes("from 'lucide-react'");
          assert.ok(
            importsSmartphone,
            `El componente ${file} utiliza <Smartphone /> pero no lo importa de lucide-react`
          );
        }

        // Ningún componente debe contener referencias viejas de Bike
        assert.ok(
          !content.includes('<Bike'),
          `El componente ${file} todavía contiene <Bike /> en vez de <Smartphone />`
        );
      }
    });

    it('app/layout.jsx y app/page.jsx deben incluir suppressHydrationWarning para extensiones', () => {
      const layoutContent = fs.readFileSync(path.join(rootDir, 'app', 'layout.jsx'), 'utf-8');
      const pageContent = fs.readFileSync(path.join(rootDir, 'app', 'page.jsx'), 'utf-8');

      assert.ok(
        layoutContent.includes('suppressHydrationWarning'),
        'app/layout.jsx debe tener suppressHydrationWarning en html/body'
      );
      assert.ok(
        pageContent.includes('suppressHydrationWarning'),
        'app/page.jsx debe tener suppressHydrationWarning en el contenedor inicial'
      );
    });
  });

  describe('2. Integración en Tiempo Real con Google Sheets (Tanda-Iphone)', () => {
    it('debe conectar con la nueva hoja y cargar 20 semanas y 10 participantes de iPhone 18', async () => {
      const { getTandaData } = await import('../lib/dataFetcher.js');
      const data = await getTandaData();

      assert.ok(data, 'Los datos devueltos no deben ser nulos');
      assert.strictEqual(data.kpis.totalSemanas, 20, 'El total de semanas debe ser 20 (5 meses)');
      assert.strictEqual(data.kpis.semanaActual, 1, 'La semana actual inicial debe ser 1');
      assert.strictEqual(data.participants.length, 10, 'Deben existir exactamente 10 participantes');

      const p1 = data.participants[0];
      assert.strictEqual(p1.id, 'U001');
      assert.strictEqual(p1.nombre, 'Angel');
      assert.strictEqual(p1.modeloMoto, 'iPhone 18 Pro Max');
      assert.strictEqual(p1.cuotaSemanal, 75, 'La cuota semanal de Angel debe ser $75');
      assert.strictEqual(p1.pin, '18010001', 'El PIN de Angel debe ser 18010001');
      assert.strictEqual(p1.estatusMoto, 'Pendiente', 'El estatus inicial debe ser Pendiente');
    });
  });

  describe('3. Flujo E2E de Autenticación de Roles', () => {
    it('debe autenticar a Carla como ADMIN con su nuevo PIN 18181818', async () => {
      const { authenticatePin } = await import('../lib/authHelper.js');
      const { getTandaData } = await import('../lib/dataFetcher.js');
      const data = await getTandaData();

      const adminResult = authenticatePin('18181818', { adminPin: '18181818', participants: data.participants });
      assert.ok(adminResult.success, 'El login de Carla debe ser exitoso');
      assert.strictEqual(adminResult.role, 'ADMIN');
      assert.strictEqual(adminResult.user.id, 'ADMIN');
    });

    it('debe autenticar a un participante por su PIN de 8 dígitos', async () => {
      const { authenticatePin } = await import('../lib/authHelper.js');
      const { getTandaData } = await import('../lib/dataFetcher.js');
      const data = await getTandaData();

      const participantResult = authenticatePin('18010001', { adminPin: '18181818', participants: data.participants });
      assert.ok(participantResult.success, 'El login del participante debe ser exitoso');
      assert.strictEqual(participantResult.role, 'PARTICIPANT');
      assert.strictEqual(participantResult.user.nombre, 'Angel');
      assert.strictEqual(participantResult.user.id, 'U001');
    });

    it('debe rechazar un PIN incorrecto con código de error apropiado', async () => {
      const { authenticatePin } = await import('../lib/authHelper.js');
      const { getTandaData } = await import('../lib/dataFetcher.js');
      const data = await getTandaData();

      const failResult = authenticatePin('00000000', { adminPin: '18181818', participants: data.participants });
      assert.strictEqual(failResult.success, false);
      assert.strictEqual(failResult.error, 'PIN incorrecto. Verifica los 8 dígitos e intenta de nuevo.');
    });
  });
});
