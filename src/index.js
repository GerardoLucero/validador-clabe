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
 * @version 1.0.0
 */

// Catálogo de bancos mexicanos con sus códigos
const BANCOS = {
  '002': 'Banamex',
  '006': 'Bancomext',
  '009': 'Banobras',
  '012': 'BBVA México',
  '014': 'Santander',
  '019': 'Banjercito',
  '021': 'HSBC',
  '030': 'Bajío',
  '032': 'IXE',
  '036': 'Inbursa',
  '037': 'Interacciones',
  '042': 'Mifel',
  '044': 'Scotiabank',
  '058': 'BanRegio',
  '059': 'Invex',
  '060': 'Bansi',
  '062': 'Afirme',
  '072': 'Banorte',
  '102': 'The Royal Bank',
  '103': 'American Express',
  '106': 'Bank of America',
  '108': 'Bank of Tokyo',
  '110': 'JP Morgan',
  '112': 'Bmonex',
  '113': 'Ve Por Mas',
  '116': 'ING',
  '124': 'Deutsche',
  '126': 'Credit Suisse',
  '127': 'Azteca',
  '128': 'Autofin',
  '130': 'Barclays',
  '131': 'Famsa',
  '132': 'BMW',
  '133': 'GE Money',
  '134': 'Bank of New York',
  '135': 'Liverpool',
  '136': 'Intercam',
  '137': 'Bancoppel',
  '138': 'ABC Capital',
  '139': 'UBS Bank',
  '140': 'Consubanco',
  '141': 'Volkswagen',
  '143': 'CIBanco',
  '145': 'BBase',
  '147': 'Bankaool',
  '148': 'PagaTodo',
  '150': 'Inmobiliario',
  '151': 'Donde',
  '152': 'Bancrea',
  '154': 'Banco Finterra',
  '155': 'ICBC',
  '156': 'Sabadell',
  '157': 'Shinhan',
  '158': 'Mizuho Bank',
  '159': 'Bank of China',
  '160': 'Banco S3',
  '166': 'BanBajio',
  '168': 'MUFG Bank',
  '600': 'GBM',
  '601': 'Monexcb',
  '602': 'Masari',
  '605': 'Value',
  '606': 'Estructuradores',
  '607': 'Tiber',
  '608': 'Vector',
  '610': 'B&B',
  '614': 'Accival',
  '615': 'Merrill Lynch',
  '616': 'Finamex',
  '617': 'Valmex',
  '618': 'Unica',
  '619': 'MAPFRE',
  '620': 'Profuturo',
  '621': 'CB Actinber',
  '622': 'Activo',
  '623': 'Skandia',
  '626': 'Cbdeutsche',
  '627': 'Zurich',
  '628': 'Zurichvi',
  '629': 'SU Casabolsa',
  '630': 'CB Intercam',
  '631': 'CI Bolsa',
  '632': 'Bulltick CB',
  '633': 'Sterling',
  '634': 'Fincomun',
  '636': 'HDI Seguros',
  '637': 'Order',
  '638': 'Akala',
  '640': 'JP Morgan CB',
  '642': 'Reforma',
  '646': 'STP',
  '647': 'Telecomm',
  '648': 'Evercore',
  '649': 'Skandia',
  '651': 'Segmty',
  '652': 'Asea',
  '653': 'Kuspit',
  '655': 'Sofiexpress',
  '656': 'Unagra',
  '659': 'ASP Integra OPC',
  '670': 'Libertad',
  '901': 'CLS',
  '902': 'INDEVAL'
};

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
  if (!clabe) return false;
  
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
  if (!clabe) {
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
  const nombreBanco = BANCOS[codigoBanco] || 'Desconocido';
  
  return {
    clabe: clabeLimpia,
    codigoBanco,
    nombreBanco,
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
    nombreBanco: BANCOS[codigoBanco] || 'Desconocido',
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
  if (!clabe) {
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
  return Object.entries(BANCOS).map(([codigo, nombre]) => ({
    codigo,
    nombre
  }));
}

/**
 * Busca un banco por código
 * @param {string} codigo - Código del banco (3 dígitos)
 * @returns {Object|null} Información del banco
 */
export function buscarBanco(codigo) {
  if (!codigo || codigo.length !== 3) {
    return null;
  }
  
  const nombre = BANCOS[codigo];
  
  if (!nombre) {
    return null;
  }
  
  return {
    codigo,
    nombre
  };
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

export default {
  validarCLABE,
  extraerInfo,
  generarCLABE,
  formatearCLABE,
  calcularDigitoVerificador: (clabeSinDigito) => calcularDigitoVerificador(clabeSinDigito),
  obtenerCatalogoBancos,
  buscarBanco,
  validarCLABEs
};
