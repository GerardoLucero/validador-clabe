/**
 * Validador y Generador de CLABE Interbancaria
 * CLABE: Clave Bancaria Estandarizada (18 dígitos)
 * 
 * Formato: BBB PPP CCCCCCCCCCC V
 * - BBB: Código del banco (3 dígitos)
 * - PPP: Código de plaza (3 dígitos)
 * - CCCCCCCCCCC: Número de cuenta (11 dígitos)
 * - V: Dígito verificador (1 dígito)
 * 
 * @author Gerardo Lucero
 */

import catalogo from './catalogo.js';

// Participantes de SPEI segun Banco de Mexico, por codigo CLABE de 3 digitos.
const BANCOS = Object.fromEntries(catalogo.bancos.map((b) => [b.codigo, b]));


/**
 * Calcula el dígito verificador de una CLABE
 * @param {string} clabeSinDigito - CLABE de 17 dígitos sin el verificador
 * @returns {string} Dígito verificador calculado
 */
function calcularDigitoVerificador(clabeSinDigito) {
  if (!clabeSinDigito || clabeSinDigito.length !== 17) {
    throw new Error('La CLABE sin dígito verificador debe tener 17 dígitos');
  }
  
  const pesos = [3, 7, 1];
  let suma = 0;
  
  for (let i = 0; i < 17; i++) {
    const digito = parseInt(clabeSinDigito[i], 10);
    const peso = pesos[i % 3];
    const producto = (digito * peso) % 10;
    suma += producto;
  }
  
  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador.toString();
}

/**
 * Valida una CLABE interbancaria
 * @param {string} clabe - CLABE a validar
 * @returns {boolean} True si es válida
 */
export function validarCLABE(clabe) {
  if (typeof clabe !== 'string') return false;
  
  // Limpiar espacios y guiones
  const clabeLimpia = clabe.replace(/[\s-]/g, '');
  
  // Verificar que tenga 18 dígitos
  if (clabeLimpia.length !== 18) return false;
  
  // Verificar que solo contenga números
  if (!/^\d{18}$/.test(clabeLimpia)) return false;
  
  // Extraer componentes
  const clabeSinDigito = clabeLimpia.substring(0, 17);
  const digitoVerificadorOriginal = clabeLimpia.substring(17);
  
  // Calcular dígito verificador esperado
  const digitoVerificadorCalculado = calcularDigitoVerificador(clabeSinDigito);
  
  // Verificar que coincida
  return digitoVerificadorOriginal === digitoVerificadorCalculado;
}

/**
 * Extrae información de una CLABE
 * @param {string} clabe - CLABE a analizar
 * @returns {Object} Información extraída
 */
export function extraerInfo(clabe) {
  if (typeof clabe !== 'string' || !clabe) {
    throw new Error('La CLABE es requerida');
  }
  
  const clabeLimpia = clabe.replace(/[\s-]/g, '');
  
  if (clabeLimpia.length !== 18) {
    throw new Error('La CLABE debe tener 18 dígitos');
  }
  
  if (!/^\d{18}$/.test(clabeLimpia)) {
    throw new Error('La CLABE solo debe contener números');
  }
  
  const codigoBanco = clabeLimpia.substring(0, 3);
  const codigoPlaza = clabeLimpia.substring(3, 6);
  const numeroCuenta = clabeLimpia.substring(6, 17);
  const digitoVerificador = clabeLimpia.substring(17);
  
  const esValida = validarCLABE(clabeLimpia);
  const nombreBanco = BANCOS[codigoBanco]?.nombre ?? 'Desconocido';
  
  return {
    clabe: clabeLimpia,
    codigoBanco,
    nombreBanco,
    bancoVigente: codigoBanco in BANCOS,
    codigoPlaza,
    numeroCuenta,
    digitoVerificador,
    esValida
  };
}

/**
 * Genera una CLABE válida
 * @param {string} codigoBanco - Código del banco (3 dígitos)
 * @param {string} codigoPlaza - Código de plaza (3 dígitos)
 * @param {string} numeroCuenta - Número de cuenta (11 dígitos)
 * @returns {Object} CLABE generada e información
 */
export function generarCLABE(codigoBanco, codigoPlaza, numeroCuenta) {
  // Validar parámetros
  if (!codigoBanco || codigoBanco.length !== 3 || !/^\d{3}$/.test(codigoBanco)) {
    throw new Error('El código del banco debe tener 3 dígitos');
  }
  
  if (!codigoPlaza || codigoPlaza.length !== 3 || !/^\d{3}$/.test(codigoPlaza)) {
    throw new Error('El código de plaza debe tener 3 dígitos');
  }
  
  if (!numeroCuenta || numeroCuenta.length !== 11 || !/^\d{11}$/.test(numeroCuenta)) {
    throw new Error('El número de cuenta debe tener 11 dígitos');
  }
  
  const clabeSinDigito = `${codigoBanco}${codigoPlaza}${numeroCuenta}`;
  const digitoVerificador = calcularDigitoVerificador(clabeSinDigito);
  const clabeCompleta = `${clabeSinDigito}${digitoVerificador}`;
  
  return {
    clabe: clabeCompleta,
    codigoBanco,
    nombreBanco: BANCOS[codigoBanco]?.nombre ?? 'Desconocido',
    codigoPlaza,
    numeroCuenta,
    digitoVerificador,
    clabeFormateada: `${codigoBanco} ${codigoPlaza} ${numeroCuenta} ${digitoVerificador}`
  };
}

/**
 * Formatea una CLABE con espacios para mejor lectura
 * @param {string} clabe - CLABE a formatear
 * @returns {string} CLABE formateada
 */
export function formatearCLABE(clabe) {
  if (typeof clabe !== 'string' || !clabe) {
    throw new Error('La CLABE es requerida');
  }
  
  const clabeLimpia = clabe.replace(/[\s-]/g, '');
  
  if (clabeLimpia.length !== 18) {
    throw new Error('La CLABE debe tener 18 dígitos');
  }
  
  const codigoBanco = clabeLimpia.substring(0, 3);
  const codigoPlaza = clabeLimpia.substring(3, 6);
  const numeroCuenta = clabeLimpia.substring(6, 17);
  const digitoVerificador = clabeLimpia.substring(17);
  
  return `${codigoBanco} ${codigoPlaza} ${numeroCuenta} ${digitoVerificador}`;
}

/**
 * Obtiene el catálogo completo de bancos
 * @returns {Object} Catálogo de bancos
 */
export function obtenerCatalogoBancos() {
  return catalogo.bancos.map((b) => ({ ...b }));
}

/**
 * Busca un banco por código
 * @param {string} codigo - Código CLABE de 3 dígitos ('012') o clave SPEI de 5 ('40012')
 * @returns {Object|null} codigo, claveSpei, nombre y tipo
 */
export function buscarBanco(codigo) {
  if (typeof codigo !== 'string' || !/^\d{3}(\d{2})?$/.test(codigo)) {
    return null;
  }
  if (codigo.length === 5) {
    const banco = catalogo.bancos.find((b) => b.claveSpei === codigo);
    return banco ? { ...banco } : null;
  }
  
  const banco = BANCOS[codigo];
  return banco ? { ...banco } : null;
}

/**
 * Valida múltiples CLABEs
 * @param {Array<string>} clabes - Array de CLABEs a validar
 * @returns {Array<Object>} Resultados de validación
 */
export function validarCLABEs(clabes) {
  if (!Array.isArray(clabes)) {
    throw new Error('Se requiere un array de CLABEs');
  }
  
  return clabes.map((clabe, index) => {
    try {
      const info = extraerInfo(clabe);
      return {
        index,
        clabe: info.clabe,
        valida: info.esValida,
        banco: info.nombreBanco,
        info
      };
    } catch (error) {
      return {
        index,
        clabe,
        valida: false,
        error: error.message
      };
    }
  });
}

/**
 * Fuente, URL y fecha del catálogo de bancos incluido
 * @returns {{fuente: string, url: string, fecha: string}}
 */
export function infoCatalogo() {
  return { fuente: catalogo.fuente, url: catalogo.url, fecha: catalogo.fecha };
}

export default {
  validarCLABE,
  extraerInfo,
  generarCLABE,
  formatearCLABE,
  calcularDigitoVerificador: (clabeSinDigito) => calcularDigitoVerificador(clabeSinDigito),
  obtenerCatalogoBancos,
  buscarBanco,
  validarCLABEs,
  infoCatalogo
};
