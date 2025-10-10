/**
 * Valida una CLABE interbancaria
 * @param {string} clabe - CLABE a validar
 * @returns {boolean} True si es válida
 */
export function validarCLABE(clabe: string): boolean;
/**
 * Extrae información de una CLABE
 * @param {string} clabe - CLABE a analizar
 * @returns {Object} Información extraída
 */
export function extraerInfo(clabe: string): any;
/**
 * Genera una CLABE válida
 * @param {string} codigoBanco - Código del banco (3 dígitos)
 * @param {string} codigoPlaza - Código de plaza (3 dígitos)
 * @param {string} numeroCuenta - Número de cuenta (11 dígitos)
 * @returns {Object} CLABE generada e información
 */
export function generarCLABE(codigoBanco: string, codigoPlaza: string, numeroCuenta: string): any;
/**
 * Formatea una CLABE con espacios para mejor lectura
 * @param {string} clabe - CLABE a formatear
 * @returns {string} CLABE formateada
 */
export function formatearCLABE(clabe: string): string;
/**
 * Obtiene el catálogo completo de bancos
 * @returns {Object} Catálogo de bancos
 */
export function obtenerCatalogoBancos(): any;
/**
 * Busca un banco por código
 * @param {string} codigo - Código del banco (3 dígitos)
 * @returns {Object|null} Información del banco
 */
export function buscarBanco(codigo: string): any | null;
/**
 * Valida múltiples CLABEs
 * @param {Array<string>} clabes - Array de CLABEs a validar
 * @returns {Array<Object>} Resultados de validación
 */
export function validarCLABEs(clabes: Array<string>): Array<any>;
declare namespace _default {
    export { validarCLABE };
    export { extraerInfo };
    export { generarCLABE };
    export { formatearCLABE };
    export function calcularDigitoVerificador(clabeSinDigito: any): string;
    export { obtenerCatalogoBancos };
    export { buscarBanco };
    export { validarCLABEs };
}
export default _default;
