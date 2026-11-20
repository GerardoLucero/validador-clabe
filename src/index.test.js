/**
 * Tests para Validador de CLABE
 */

import {
  validarCLABE,
  extraerInfo,
  generarCLABE,
  formatearCLABE,
  obtenerCatalogoBancos,
  buscarBanco,
  validarCLABEs,
  infoCatalogo
} from './index.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

describe('Validador de CLABE', () => {
  
  describe('validarCLABE', () => {
    it('debe validar una CLABE correcta de BBVA', () => {
      const clabe = '012180001234567899';
      expect(validarCLABE(clabe)).toBe(true);
    });
    
    it('debe validar una CLABE correcta de Banamex', () => {
      const clabe = '002180001234567896';
      expect(validarCLABE(clabe)).toBe(true);
    });
    
    it('debe invalidar una CLABE con dígito verificador incorrecto', () => {
      const clabe = '012180001234567891'; // Último dígito incorrecto
      expect(validarCLABE(clabe)).toBe(false);
    });
    
    it('debe invalidar una CLABE de menos de 18 dígitos', () => {
      expect(validarCLABE('01218000123456789')).toBe(false);  // 17 dígitos
      expect(validarCLABE('0121800012345678')).toBe(false);   // 16 dígitos
      expect(validarCLABE('123456')).toBe(false);             // 6 dígitos
    });
    
    it('debe invalidar una CLABE de más de 18 dígitos', () => {
      expect(validarCLABE('0121800012345678901')).toBe(false); // 19 dígitos
      expect(validarCLABE('012180001234567890123')).toBe(false); // 21 dígitos
    });
    
    it('debe invalidar una CLABE con letras', () => {
      expect(validarCLABE('01218000123456789A')).toBe(false);
      expect(validarCLABE('ABC18000123456789D')).toBe(false);
      expect(validarCLABE('ABCDEFGHIJ12345678')).toBe(false);
    });
    
    it('debe invalidar una CLABE con caracteres especiales', () => {
      expect(validarCLABE('012180001234567@90')).toBe(false);
      expect(validarCLABE('012-180-00123456789')).toBe(false); // Aunque limpie guiones, no es válida
    });
    
    it('debe invalidar undefined, null o vacío', () => {
      expect(validarCLABE(undefined)).toBe(false);
      expect(validarCLABE(null)).toBe(false);
      expect(validarCLABE('')).toBe(false);
      expect(validarCLABE('   ')).toBe(false);
    });
    
    it('debe aceptar CLABE con espacios y limpiarla', () => {
      const clabeConEspacios = '012 180 00123456789 9';
      const clabeConGuiones = '012-180-00123456789-9';
      
      expect(validarCLABE(clabeConEspacios)).toBe(true);
      expect(validarCLABE(clabeConGuiones)).toBe(true);
    });
  });
  
  describe('extraerInfo', () => {
    it('debe extraer información correcta de una CLABE válida', () => {
      const clabe = '012180001234567899';
      const info = extraerInfo(clabe);
      
      expect(info).toHaveProperty('clabe');
      expect(info).toHaveProperty('codigoBanco');
      expect(info).toHaveProperty('nombreBanco');
      expect(info).toHaveProperty('codigoPlaza');
      expect(info).toHaveProperty('numeroCuenta');
      expect(info).toHaveProperty('digitoVerificador');
      expect(info).toHaveProperty('esValida');
      
      expect(info.clabe).toBe('012180001234567899');
      expect(info.codigoBanco).toBe('012');
      expect(info.nombreBanco).toBe('BBVA MEXICO');
      expect(info.codigoPlaza).toBe('180');
      expect(info.numeroCuenta).toBe('00123456789');
      expect(info.digitoVerificador).toBe('9');
      expect(info.esValida).toBe(true);
    });
    
    it('debe marcar como inválida una CLABE con dígito incorrecto', () => {
      const clabe = '012180001234567891'; // Dígito verificador incorrecto
      const info = extraerInfo(clabe);
      
      expect(info.esValida).toBe(false);
    });
    
    it('debe lanzar error si la CLABE tiene longitud incorrecta', () => {
      expect(() => extraerInfo('123456')).toThrow('La CLABE debe tener 18 dígitos');
      expect(() => extraerInfo('0121800012345678901')).toThrow('La CLABE debe tener 18 dígitos');
    });
    
    it('debe lanzar error si la CLABE contiene letras', () => {
      expect(() => extraerInfo('01218000123456789A')).toThrow('La CLABE solo debe contener números');
    });
    
    it('debe lanzar error si la CLABE es null o undefined', () => {
      expect(() => extraerInfo(null)).toThrow('La CLABE es requerida');
      expect(() => extraerInfo(undefined)).toThrow('La CLABE es requerida');
      expect(() => extraerInfo('')).toThrow('La CLABE es requerida');
    });
    
    it('debe extraer información de CLABEs de diferentes bancos', () => {
      const clabes = {
        '002180001234567896': 'BANAMEX',
        '014180001234567897': 'SANTANDER',
        '021180001234567899': 'HSBC',
        '072180001234567897': 'BANORTE'
      };
      
      Object.entries(clabes).forEach(([clabe, nombreEsperado]) => {
        const info = extraerInfo(clabe);
        expect(info.nombreBanco).toBe(nombreEsperado);
      });
    });
  });
  
  describe('generarCLABE', () => {
    it('debe generar una CLABE válida', () => {
      const clabe = generarCLABE('012', '180', '00123456789');
      
      expect(clabe).toHaveProperty('clabe');
      expect(clabe).toHaveProperty('codigoBanco');
      expect(clabe).toHaveProperty('nombreBanco');
      expect(clabe).toHaveProperty('codigoPlaza');
      expect(clabe).toHaveProperty('numeroCuenta');
      expect(clabe).toHaveProperty('digitoVerificador');
      expect(clabe).toHaveProperty('clabeFormateada');
      
      expect(clabe.clabe).toHaveLength(18);
      expect(validarCLABE(clabe.clabe)).toBe(true);
    });
    
    it('la CLABE generada debe ser válida al validarla', () => {
      const clabe = generarCLABE('002', '100', '12345678901');
      
      expect(validarCLABE(clabe.clabe)).toBe(true);
    });
    
    it('debe calcular el dígito verificador correcto', () => {
      const clabe = generarCLABE('012', '180', '00123456789');
      
      // Verificar que el dígito verificador sea consistente
      const info = extraerInfo(clabe.clabe);
      expect(info.digitoVerificador).toBe(clabe.digitoVerificador);
    });
    
    it('debe lanzar error si el código del banco es inválido', () => {
      expect(() => generarCLABE('12', '180', '00123456789')).toThrow('El código del banco debe tener 3 dígitos');
      expect(() => generarCLABE('1234', '180', '00123456789')).toThrow('El código del banco debe tener 3 dígitos');
      expect(() => generarCLABE('ABC', '180', '00123456789')).toThrow('El código del banco debe tener 3 dígitos');
    });
    
    it('debe lanzar error si el código de plaza es inválido', () => {
      expect(() => generarCLABE('012', '18', '00123456789')).toThrow('El código de plaza debe tener 3 dígitos');
      expect(() => generarCLABE('012', '1800', '00123456789')).toThrow('El código de plaza debe tener 3 dígitos');
      expect(() => generarCLABE('012', 'ABC', '00123456789')).toThrow('El código de plaza debe tener 3 dígitos');
    });
    
    it('debe lanzar error si el número de cuenta es inválido', () => {
      expect(() => generarCLABE('012', '180', '0012345678')).toThrow('El número de cuenta debe tener 11 dígitos');
      expect(() => generarCLABE('012', '180', '001234567890')).toThrow('El número de cuenta debe tener 11 dígitos');
      expect(() => generarCLABE('012', '180', 'ABCDEFGHIJK')).toThrow('El número de cuenta debe tener 11 dígitos');
    });
    
    it('debe incluir el nombre del banco', () => {
      const clabe = generarCLABE('012', '180', '00123456789');
      expect(clabe.nombreBanco).toBe('BBVA MEXICO');
      
      const clabe2 = generarCLABE('002', '180', '00123456789');
      expect(clabe2.nombreBanco).toBe('BANAMEX');
    });
    
    it('debe formatear la CLABE con espacios', () => {
      const clabe = generarCLABE('012', '180', '00123456789');
      expect(clabe.clabeFormateada).toMatch(/^\d{3} \d{3} \d{11} \d$/);
    });
  });
  
  describe('formatearCLABE', () => {
    it('debe formatear una CLABE con espacios', () => {
      const clabe = '012180001234567897';
      const formateada = formatearCLABE(clabe);
      
      expect(formateada).toBe('012 180 00123456789 7');
    });
    
    it('debe formatear una CLABE que ya tiene espacios', () => {
      const clabe = '012 180 00123456789 7';
      const formateada = formatearCLABE(clabe);
      
      expect(formateada).toBe('012 180 00123456789 7');
    });
    
    it('debe formatear una CLABE con guiones', () => {
      const clabe = '012-180-00123456789-7';
      const formateada = formatearCLABE(clabe);
      
      expect(formateada).toBe('012 180 00123456789 7');
    });
    
    it('debe lanzar error si la CLABE no tiene 18 dígitos', () => {
      expect(() => formatearCLABE('123456')).toThrow('La CLABE debe tener 18 dígitos');
      expect(() => formatearCLABE('0121800012345678901')).toThrow('La CLABE debe tener 18 dígitos');
    });
    
    it('debe lanzar error si la CLABE es null o undefined', () => {
      expect(() => formatearCLABE(null)).toThrow('La CLABE es requerida');
      expect(() => formatearCLABE(undefined)).toThrow('La CLABE es requerida');
    });
  });
  
  describe('obtenerCatalogoBancos', () => {
    it('debe retornar un array de bancos', () => {
      const bancos = obtenerCatalogoBancos();
      
      expect(Array.isArray(bancos)).toBe(true);
      expect(bancos.length).toBeGreaterThan(0);
      
      bancos.forEach(banco => {
        expect(banco).toHaveProperty('codigo');
        expect(banco).toHaveProperty('nombre');
        expect(banco.codigo).toHaveLength(3);
        expect(banco.nombre.length).toBeGreaterThan(0);
      });
    });
    
    it('debe incluir los bancos principales', () => {
      const bancos = obtenerCatalogoBancos();
      const nombres = bancos.map(b => b.nombre);
      
      expect(nombres).toContain('BBVA MEXICO');
      expect(nombres).toContain('BANAMEX');
      expect(nombres).toContain('SANTANDER');
      expect(nombres).toContain('HSBC');
      expect(nombres).toContain('BANORTE');
    });
    
    it('debe incluir al menos 50 bancos', () => {
      const bancos = obtenerCatalogoBancos();
      expect(bancos.length).toBeGreaterThanOrEqual(50);
    });
  });
  
  describe('buscarBanco', () => {
    it('debe encontrar un banco por código', () => {
      const banco = buscarBanco('012');
      
      expect(banco).not.toBeNull();
      expect(banco.codigo).toBe('012');
      expect(banco.nombre).toBe('BBVA MEXICO');
    });
    
    it('debe encontrar Banamex', () => {
      const banco = buscarBanco('002');
      expect(banco.nombre).toBe('BANAMEX');
    });
    
    it('debe retornar null para código inexistente', () => {
      const banco = buscarBanco('999');
      expect(banco).toBeNull();
    });
    
    it('debe retornar null para código inválido', () => {
      expect(buscarBanco('1')).toBeNull();
      expect(buscarBanco('12')).toBeNull();
      expect(buscarBanco('1234')).toBeNull();
      expect(buscarBanco(12)).toBeNull();
      expect(buscarBanco(null)).toBeNull();
      expect(buscarBanco(undefined)).toBeNull();
    });
  });
  
  describe('validarCLABEs', () => {
    it('debe validar múltiples CLABEs', () => {
      const clabes = [
        '012180001234567899',
        '002180001234567896',
        '014180001234567897'
      ];
      
      const resultados = validarCLABEs(clabes);
      
      expect(Array.isArray(resultados)).toBe(true);
      expect(resultados).toHaveLength(3);
      
      resultados.forEach((resultado, index) => {
        expect(resultado).toHaveProperty('index');
        expect(resultado.index).toBe(index);
        expect(resultado).toHaveProperty('valida');
        expect(resultado).toHaveProperty('clabe');
      });
    });
    
    it('debe marcar válidas e inválidas correctamente', () => {
      const clabes = [
        '012180001234567899', // Válida
        '012180001234567891', // Inválida (dígito verificador incorrecto)
        '002180001234567896'  // Válida
      ];
      
      const resultados = validarCLABEs(clabes);
      
      expect(resultados[0].valida).toBe(true);
      expect(resultados[1].valida).toBe(false);
      expect(resultados[2].valida).toBe(true);
    });
    
    it('debe manejar errores en CLABEs individuales', () => {
      const clabes = [
        '012180001234567899', // Válida
        '123456',             // Muy corta
        '002180001234567896'  // Válida
      ];
      
      const resultados = validarCLABEs(clabes);
      
      expect(resultados[0].valida).toBe(true);
      expect(resultados[0]).not.toHaveProperty('error');
      
      expect(resultados[1].valida).toBe(false);
      expect(resultados[1]).toHaveProperty('error');
      
      expect(resultados[2].valida).toBe(true);
      expect(resultados[2]).not.toHaveProperty('error');
    });
    
    it('debe incluir información del banco', () => {
      const clabes = ['012180001234567899'];
      const resultados = validarCLABEs(clabes);
      
      expect(resultados[0].banco).toBe('BBVA MEXICO');
      expect(resultados[0].info.nombreBanco).toBe('BBVA MEXICO');
    });
    
    it('debe lanzar error si no es un array', () => {
      expect(() => validarCLABEs('012180001234567897')).toThrow('Se requiere un array de CLABEs');
      expect(() => validarCLABEs(null)).toThrow('Se requiere un array de CLABEs');
    });
  });
  
  describe('Casos reales de CLABEs', () => {
    it('debe validar CLABEs de diferentes bancos', () => {
      // Estas son CLABEs con estructura válida (dígito verificador correcto)
      const clabesValidas = [
        '012180001234567899',  // BBVA
        '002180001234567896',  // Banamex
        '014180001234567897',  // Santander
        '072180001234567897'   // Banorte
      ];
      
      clabesValidas.forEach(clabe => {
        expect(validarCLABE(clabe)).toBe(true);
      });
    });
    
    it('debe invalidar CLABEs con dígito verificador incorrecto', () => {
      const clabesInvalidas = [
        '012180001234567890',  // Dígito incorrecto
        '002180001234567899',  // Dígito incorrecto
        '014180001234567890'   // Dígito incorrecto
      ];
      
      clabesInvalidas.forEach(clabe => {
        expect(validarCLABE(clabe)).toBe(false);
      });
    });
  });
  
  describe('Integración completa', () => {
    it('debe generar, validar y extraer información correctamente', () => {
      // Generar CLABE
      const generada = generarCLABE('012', '180', '00123456789');
      
      // Validar que sea válida
      expect(validarCLABE(generada.clabe)).toBe(true);
      
      // Extraer información
      const info = extraerInfo(generada.clabe);
      
      // Verificar que la información coincida
      expect(info.codigoBanco).toBe('012');
      expect(info.codigoPlaza).toBe('180');
      expect(info.numeroCuenta).toBe('00123456789');
      expect(info.esValida).toBe(true);
      expect(info.nombreBanco).toBe('BBVA MEXICO');
      
      // Formatear
      const formateada = formatearCLABE(generada.clabe);
      expect(formateada).toBe(generada.clabeFormateada);
    });
    
    it('debe ser consistente en múltiples generaciones', () => {
      const clabe1 = generarCLABE('012', '180', '00123456789');
      const clabe2 = generarCLABE('012', '180', '00123456789');
      
      expect(clabe1.clabe).toBe(clabe2.clabe);
      expect(clabe1.digitoVerificador).toBe(clabe2.digitoVerificador);
    });
    
    it('debe generar diferentes dígitos para diferentes cuentas', () => {
      const clabe1 = generarCLABE('012', '180', '00123456789');
      const clabe2 = generarCLABE('012', '180', '00987654321');
      
      expect(clabe1.clabe).not.toBe(clabe2.clabe);
      // El dígito verificador probablemente será diferente
    });
  });
  
  describe('Algoritmo de dígito verificador', () => {
    it('debe calcular correctamente el dígito verificador', () => {
      const casos = [
        { clabeSinDigito: '01218000123456789', digitoEsperado: '9' },
        { clabeSinDigito: '00218000123456789', digitoEsperado: '6' },
        { clabeSinDigito: '01418000123456789', digitoEsperado: '7' }
      ];
      
      casos.forEach(caso => {
        const clabe = generarCLABE(
          caso.clabeSinDigito.substring(0, 3),
          caso.clabeSinDigito.substring(3, 6),
          caso.clabeSinDigito.substring(6, 17)
        );
        expect(clabe.digitoVerificador).toBe(caso.digitoEsperado);
      });
    });
  });

  describe('Catalogo de Banxico', () => {
    it('trae codigo, clave SPEI y tipo de cada participante de SPEI', () => {
      const bancos = obtenerCatalogoBancos();
      expect(new Set(bancos.map((b) => b.codigo)).size).toBe(bancos.length);
      for (const b of bancos) {
        expect(b.claveSpei.endsWith(b.codigo)).toBe(true);
        expect(['Banca múltiple', 'Banca de desarrollo', 'Participante no bancario', 'Banco central']).toContain(b.tipo);
      }
    });

    it('incluye instituciones nuevas', () => {
      expect(buscarBanco('638').nombre).toBe('NUBANK');
      expect(buscarBanco('728').nombre).toBe('SPIN BY OXXO');
    });

    it('busca por clave SPEI de 5 digitos', () => {
      expect(buscarBanco('40012').codigo).toBe('012');
      expect(buscarBanco('99999')).toBeNull();
    });

    it('devuelve copias', () => {
      buscarBanco('012').nombre = 'X';
      obtenerCatalogoBancos()[0].nombre = 'X';
      expect(buscarBanco('012').nombre).toBe('BBVA MEXICO');
    });

    it('marca si el banco de la CLABE sigue en SPEI', () => {
      // IXE (032) ya no participa en SPEI; el digito verificador sigue siendo correcto.
      const ixe = extraerInfo('032180000118359719');
      expect(ixe.esValida).toBe(true);
      expect(ixe.bancoVigente).toBe(false);
      expect(ixe.nombreBanco).toBe('Desconocido');
      expect(extraerInfo('012180001234567899').bancoVigente).toBe(true);
    });

    it('expone fuente y fecha', () => {
      expect(infoCatalogo().url).toContain('banxico.org.mx');
      expect(infoCatalogo().fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('rechaza entradas que no son texto', () => {
      expect(validarCLABE(12345)).toBe(false);
      expect(() => extraerInfo(12345)).toThrow('requerida');
      expect(() => formatearCLABE(12345)).toThrow('requerida');
    });

    it('el README usa la fecha y el total reales', () => {
      const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
      expect(readme).toContain(infoCatalogo().fecha);
      expect(readme).toContain(`${obtenerCatalogoBancos().length} instituciones`);
    });
  });
});
