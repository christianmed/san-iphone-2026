/**
 * Valida que el PIN recibido sea exactamente una cadena de 8 dígitos numéricos.
 */
export function isValidPinFormat(pin) {
  if (!pin || typeof pin !== 'string') return false;
  const trimmed = pin.trim();
  return /^\d{8}$/.test(trimmed);
}

/**
 * Autentica un PIN contra el PIN de Admin y la lista de participantes.
 * Devuelve el rol ('ADMIN' o 'PARTICIPANT') y el objeto de usuario si es válido,
 * o null si no coincide.
 */
export function authenticatePin(pin, { adminPin = '12345678', participants = [] } = {}) {
  if (!isValidPinFormat(pin)) {
    return { success: false, error: 'El PIN debe contener exactamente 8 números.' };
  }

  const cleanPin = pin.trim();

  // 1. Comprobar si es el PIN de Carla (Administrador)
  if (cleanPin === String(adminPin).trim()) {
    return {
      success: true,
      role: 'ADMIN',
      user: {
        id: 'ADMIN',
        nombre: 'Carla',
        role: 'ADMIN',
      },
    };
  }

  // 2. Comprobar si coincide con el PIN de algún participante
  const matchedParticipant = participants.find((p) => {
    const pPin = String(p.pin || '').trim();
    return pPin === cleanPin;
  });

  if (matchedParticipant) {
    return {
      success: true,
      role: 'PARTICIPANT',
      user: {
        id: matchedParticipant.id,
        nombre: matchedParticipant.nombre,
        role: 'PARTICIPANT',
      },
    };
  }

  return {
    success: false,
    error: 'PIN incorrecto. Verifica los 8 dígitos e intenta de nuevo.',
  };
}
