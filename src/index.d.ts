export type TipoInstitucion =
  | 'Banca múltiple'
  | 'Banca de desarrollo'
  | 'Participante no bancario'
  | 'Banco central';

export interface Banco {
  /** Codigo de 3 digitos con el que empieza la CLABE ('012'). */
  codigo: string;
  /** Clave de la institucion en SPEI ('40012'). */
  claveSpei: string;
  /** Nombre tal como lo publica Banxico. */
  nombre: string;
  tipo: TipoInstitucion;
}

export interface InfoCLABE {
  clabe: string;
  codigoBanco: string;
  /** 'Desconocido' si el codigo no participa en SPEI. */
  nombreBanco: string;
  /** true si el codigo de banco esta entre los participantes de SPEI. */
  bancoVigente: boolean;
  codigoPlaza: string;
  numeroCuenta: string;
  digitoVerificador: string;
  /** true si el digito verificador es correcto. */
  esValida: boolean;
}

export interface CLABEGenerada {
  clabe: string;
  codigoBanco: string;
  nombreBanco: string;
  codigoPlaza: string;
  numeroCuenta: string;
  digitoVerificador: string;
  /** 'BBB PPP CCCCCCCCCCC V' */
  clabeFormateada: string;
}

export type ResultadoValidacion =
  | { index: number; clabe: string; valida: boolean; banco: string; info: InfoCLABE }
  | { index: number; clabe: unknown; valida: false; error: string };

/** true si tiene 18 digitos (se ignoran espacios y guiones) y el digito verificador es correcto. */
export function validarCLABE(clabe: string): boolean;
/** Lanza Error si no tiene 18 digitos o trae letras. */
export function extraerInfo(clabe: string): InfoCLABE;
/** Lanza Error si banco o plaza no son 3 digitos o la cuenta no son 11. */
export function generarCLABE(codigoBanco: string, codigoPlaza: string, numeroCuenta: string): CLABEGenerada;
/** Lanza Error si no tiene 18 caracteres sin contar espacios y guiones. */
export function formatearCLABE(clabe: string): string;
export function obtenerCatalogoBancos(): Banco[];
/** Por codigo CLABE de 3 digitos ('012') o clave SPEI de 5 ('40012'). */
export function buscarBanco(codigo: string): Banco | null;
/** Lanza Error si no recibe un arreglo. */
export function validarCLABEs(clabes: string[]): ResultadoValidacion[];
export function infoCatalogo(): { fuente: string; url: string; fecha: string };

declare const _default: {
  validarCLABE: typeof validarCLABE;
  extraerInfo: typeof extraerInfo;
  generarCLABE: typeof generarCLABE;
  formatearCLABE: typeof formatearCLABE;
  /** Digito verificador ('0'-'9') de los primeros 17 digitos. */
  calcularDigitoVerificador: (clabeSinDigito: string) => string;
  obtenerCatalogoBancos: typeof obtenerCatalogoBancos;
  buscarBanco: typeof buscarBanco;
  validarCLABEs: typeof validarCLABEs;
  infoCatalogo: typeof infoCatalogo;
};
export default _default;
