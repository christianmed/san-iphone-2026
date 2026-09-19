import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidPinFormat, authenticatePin } from '../lib/authHelper.js';

describe('Auth Helper Unit Tests', () => {
  describe('isValidPinFormat()', () => {
    it('debería aceptar exactamente 8 dígitos numéricos', () => {
      assert.equal(isValidPinFormat('12345678'), true);
      assert.equal(isValidPinFormat('00000001'), true);
      assert.equal(isValidPinFormat('98765432'), true);
    });

    it('debería rechazar cadenas con longitud distinta de 8', () => {
      assert.equal(isValidPinFormat('1234'), false);
      assert.equal(isValidPinFormat('1234567'), false);
      assert.equal(isValidPinFormat('123456789'), false);
      assert.equal(isValidPinFormat(''), false);
    });

    it('debería rechazar caracteres no numéricos o tipos inválidos', () => {
      assert.equal(isValidPinFormat('1234abcd'), false);
      assert.equal(isValidPinFormat('1234-567'), false);
      assert.equal(isValidPinFormat(null), false);
      assert.equal(isValidPinFormat(undefined), false);
      assert.equal(isValidPinFormat(12345678), false); // debe ser string
    });
  });

  describe('authenticatePin()', () => {
    const mockParticipants = [
      { id: 'U001', nombre: 'Angel', pin: '00000001' },
      { id: 'U002', nombre: 'Reinaldo', pin: '00000002' },
      { id: 'U003', nombre: 'Luis', pin: '11223344' },
    ];

    it('debería autenticar al Admin correctamente', () => {
      const result = authenticatePin('12345678', {
        adminPin: '12345678',
        participants: mockParticipants,
      });

      assert.equal(result.success, true);
      assert.equal(result.role, 'ADMIN');
      assert.equal(result.user.nombre, 'Carla');
    });

    it('debería autenticar a un participante por su PIN', () => {
      const result = authenticatePin('00000001', {
        adminPin: '12345678',
        participants: mockParticipants,
      });

      assert.equal(result.success, true);
      assert.equal(result.role, 'PARTICIPANT');
      assert.equal(result.user.id, 'U001');
      assert.equal(result.user.nombre, 'Angel');
    });

    it('debería rechazar un PIN no registrado', () => {
      const result = authenticatePin('99999999', {
        adminPin: '12345678',
        participants: mockParticipants,
      });

      assert.equal(result.success, false);
      assert.match(result.error, /PIN incorrecto/);
    });

    it('debería rechazar un PIN con formato inválido', () => {
      const result = authenticatePin('123', {
        adminPin: '12345678',
        participants: mockParticipants,
      });

      assert.equal(result.success, false);
      assert.match(result.error, /8 números/);
    });
  });
});
