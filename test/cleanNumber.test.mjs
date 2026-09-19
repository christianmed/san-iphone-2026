import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanNumber } from '../lib/dataFetcher.js';

describe('cleanNumber() Unit Tests', () => {
  it('debería retornar el mismo número si ya es numérico', () => {
    assert.equal(cleanNumber(100), 100);
    assert.equal(cleanNumber(0), 0);
    assert.equal(cleanNumber(-50.5), -50.5);
  });

  it('debería manejar null, undefined y cadenas vacías devolviendo 0', () => {
    assert.equal(cleanNumber(null), 0);
    assert.equal(cleanNumber(undefined), 0);
    assert.equal(cleanNumber(''), 0);
    assert.equal(cleanNumber('   '), 0);
  });

  it('debería manejar NaN devolviendo 0', () => {
    assert.equal(cleanNumber(NaN), 0);
    assert.equal(cleanNumber('texto-invalido'), 0);
  });

  it('debería limpiar símbolos de moneda y espacios', () => {
    assert.equal(cleanNumber('$100'), 100);
    assert.equal(cleanNumber(' $ 2500 '), 2500);
  });

  it('debería parsear formato estándar con coma de miles y punto decimal', () => {
    assert.equal(cleanNumber('$1,250.75'), 1250.75);
    assert.equal(cleanNumber('10,000'), 10000);
  });

  it('debería parsear formato con coma decimal', () => {
    assert.equal(cleanNumber('150,50'), 150.50);
    assert.equal(cleanNumber('1.250,75'), 1250.75);
  });
});
