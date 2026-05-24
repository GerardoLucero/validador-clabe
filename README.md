# validador-clabe

Librería moderna para validar, generar y extraer información de CLABE (Clave Bancaria Estandarizada) interbancaria mexicana de 18 dígitos.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/validador-clabe?style=social)](https://github.com/GerardoLucero/validador-clabe)
[![npm version](https://badge.fury.io/js/validador-clabe.svg)](https://badge.fury.io/js/validador-clabe)
[![npm downloads](https://img.shields.io/npm/dm/validador-clabe.svg)](https://www.npmjs.com/package/validador-clabe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/validador-clabe/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/GerardoLucero/validador-clabe/actions)

## Features

- **Validación completa** — verifica formato y dígito verificador
- **Extracción de datos** — banco, plaza, cuenta, dígito verificador
- **Generación de CLABE** — crea CLABEs válidas con dígito correcto
- **Catálogo de bancos** — 80+ bancos mexicanos incluidos
- **Formateo** — formatea CLABEs para mejor lectura
- **Validación por lotes** — valida múltiples CLABEs
- **TypeScript ready** — incluye definiciones de tipos
- **Zero dependencies** — totalmente standalone
- **Cobertura > 90%**

## Instalación

```bash
npm install validador-clabe
```

## Uso

```javascript
// ES6 Modules
import { validarCLABE, extraerInfo } from 'validador-clabe';

// CommonJS
const { validarCLABE, extraerInfo } = require('validador-clabe');
```

### Validar CLABE

```javascript
import { validarCLABE } from 'validador-clabe';

const esValida = validarCLABE('012180001234567897');
console.log(esValida); // true

// Acepta espacios y guiones
const conEspacios = validarCLABE('012 180 00123456789 7');
console.log(conEspacios); // true
```

### Extraer información

```javascript
import { extraerInfo } from 'validador-clabe';

const info = extraerInfo('012180001234567897');
console.log(info);
/*
{
  clabe: '012180001234567897',
  codigoBanco: '012',
  nombreBanco: 'BBVA México',
  codigoPlaza: '180',
  numeroCuenta: '00123456789',
  digitoVerificador: '7',
  esValida: true
}
*/
```

### Generar CLABE

```javascript
import { generarCLABE } from 'validador-clabe';

const clabe = generarCLABE('012', '180', '00123456789');
console.log(clabe);
/*
{
  clabe: '012180001234567897',
  codigoBanco: '012',
  nombreBanco: 'BBVA México',
  codigoPlaza: '180',
  numeroCuenta: '00123456789',
  digitoVerificador: '7',
  clabeFormateada: '012 180 00123456789 7'
}
*/
```

### Formatear CLABE

```javascript
import { formatearCLABE } from 'validador-clabe';

const formateada = formatearCLABE('012180001234567897');
console.log(formateada); // '012 180 00123456789 7'
```

### Validar múltiples CLABEs

```javascript
import { validarCLABEs } from 'validador-clabe';

const clabes = ['012180001234567897', '012180001234567891', '002180001234567890'];
const resultados = validarCLABEs(clabes);
// Array con { index, clabe, valida, banco, info } por cada una
```

## API

| Función | Descripción |
|---------|-------------|
| `validarCLABE(clabe): boolean` | Valida si una CLABE es correcta |
| `extraerInfo(clabe): Object` | Extrae información detallada de una CLABE |
| `generarCLABE(banco, plaza, cuenta): Object` | Genera una CLABE válida con dígito verificador |
| `formatearCLABE(clabe): string` | Formatea con espacios (`BBB PPP CCCCCCCCCCC V`) |
| `obtenerCatalogoBancos(): Array` | Obtiene el catálogo completo de bancos |
| `buscarBanco(codigo): Object\|null` | Busca un banco por su código |
| `validarCLABEs(clabes): Array` | Valida múltiples CLABEs en lote |

## Estructura de la CLABE

```
012 180 00123456789 7
│   │   │           │
│   │   │           └─ Dígito verificador (1 dígito)
│   │   └───────────── Número de cuenta (11 dígitos)
│   └───────────────── Código de plaza (3 dígitos)
└───────────────────── Código del banco (3 dígitos)
```

## Bancos principales

| Código | Banco |
|--------|-------|
| 002 | Banamex |
| 012 | BBVA México |
| 014 | Santander |
| 021 | HSBC |
| 030 | Bajío |
| 036 | Inbursa |
| 044 | Scotiabank |
| 072 | Banorte |
| 127 | Azteca |
| 137 | Bancoppel |

## Algoritmo del dígito verificador

Módulo 10 con pesos [3, 7, 1]:

```
Paso 1: Multiplicar cada dígito por su peso (3, 7, 1, 3, 7, 1, ...)
Paso 2: Sumar todos los dígitos de los productos (solo el dígito de las unidades)
Paso 3: (10 - (suma % 10)) % 10
```

## Notas importantes

- La CLABE es el estándar mexicano para transferencias electrónicas (SPEI)
- Esta librería **no** valida si la cuenta existe, solo valida formato y dígito

## Referencias

- [Banco de México — CLABE](https://www.banxico.org.mx/sistemas-de-pago/informacion-general/banco-de-mexico-servicios/clabe-cuenta-bancaria-estandarizada.html)

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)
