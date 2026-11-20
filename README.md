# validador-clabe

Valida, genera y desarma cuentas CLABE (Clave Bancaria Estandarizada) de 18 dígitos, con el catálogo de participantes de SPEI de Banco de México.

[![npm](https://img.shields.io/npm/v/validador-clabe.svg)](https://www.npmjs.com/package/validador-clabe)
[![CI](https://github.com/GerardoLucero/validador-clabe/actions/workflows/ci.yml/badge.svg)](https://github.com/GerardoLucero/validador-clabe/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

- Revisa longitud, caracteres y dígito verificador.
- Identifica el banco con el catálogo oficial de Banxico: 97 instituciones, incluidas fintech como Nu, Mercado Pago o Spin by OXXO.
- Indica si el banco de la CLABE sigue participando en SPEI.
- Genera CLABEs con su dígito verificador para datos de prueba.
- Sin dependencias. Funciona con `import` y `require` en Node 20 o superior, con tipos de TypeScript.

¿Necesitas también buscar bancos por nombre o rechazar de entrada las CLABEs de bancos que ya no existen? Usa [mx-bancos](https://www.npmjs.com/package/mx-bancos), que trae el mismo catálogo.

## Instalación

```bash
npm install validador-clabe
```

## Validar

```js
import { validarCLABE } from 'validador-clabe';
// o: const { validarCLABE } = require('validador-clabe');

validarCLABE('012180001234567899');    // true
validarCLABE('012 180 00123456789 9'); // true, acepta espacios y guiones
validarCLABE('012180001234567891');    // false, digito verificador incorrecto
```

`validarCLABE` solo revisa la forma y el dígito verificador. No consulta si la cuenta existe.

## Extraer información

```js
import { extraerInfo } from 'validador-clabe';

extraerInfo('012180001234567899');
// {
//   clabe: '012180001234567899',
//   codigoBanco: '012',
//   nombreBanco: 'BBVA MEXICO',
//   bancoVigente: true,
//   codigoPlaza: '180',
//   numeroCuenta: '00123456789',
//   digitoVerificador: '9',
//   esValida: true
// }
```

`bancoVigente` es `false` cuando el código de banco ya no aparece entre los participantes de SPEI. Por ejemplo, IXE (`032`) se fusionó con Banorte: `extraerInfo('032180000118359719')` da `esValida: true`, `bancoVigente: false` y `nombreBanco: 'Desconocido'`.

`extraerInfo` lanza un `Error` si la CLABE no tiene 18 dígitos o trae letras.

## Generar CLABEs de prueba

```js
import { generarCLABE, formatearCLABE } from 'validador-clabe';

generarCLABE('012', '180', '00123456789');
// {
//   clabe: '012180001234567899',
//   codigoBanco: '012',
//   nombreBanco: 'BBVA MEXICO',
//   codigoPlaza: '180',
//   numeroCuenta: '00123456789',
//   digitoVerificador: '9',
//   clabeFormateada: '012 180 00123456789 9'
// }

formatearCLABE('012180001234567899'); // '012 180 00123456789 9'
```

## Validar varias

```js
import { validarCLABEs } from 'validador-clabe';

validarCLABEs(['012180001234567899', '012180001234567891', 'abc']);
// [
//   { index: 0, clabe: '012180001234567899', valida: true,  banco: 'BBVA MEXICO', info: { … } },
//   { index: 1, clabe: '012180001234567891', valida: false, banco: 'BBVA MEXICO', info: { … } },
//   { index: 2, clabe: 'abc', valida: false, error: 'La CLABE debe tener 18 dígitos' }
// ]
```

## Bancos

```js
import { buscarBanco, obtenerCatalogoBancos } from 'validador-clabe';

buscarBanco('012');   // por codigo CLABE
buscarBanco('40012'); // por clave SPEI
// { codigo: '012', claveSpei: '40012', nombre: 'BBVA MEXICO', tipo: 'Banca múltiple' }

obtenerCatalogoBancos(); // las 97 instituciones
```

## API

| Función | Devuelve |
|---|---|
| `validarCLABE(clabe)` | `true` si tiene 18 dígitos y el verificador es correcto |
| `extraerInfo(clabe)` | Banco, plaza, cuenta, verificador, `esValida` y `bancoVigente` |
| `generarCLABE(banco, plaza, cuenta)` | CLABE con verificador y sus partes |
| `formatearCLABE(clabe)` | `'BBB PPP CCCCCCCCCCC V'` |
| `validarCLABEs(clabes)` | Un resultado por CLABE |
| `buscarBanco(codigo)` | Banco por código CLABE o clave SPEI, o `null` |
| `obtenerCatalogoBancos()` | Todas las instituciones |
| `infoCatalogo()` | Fuente, URL y fecha del catálogo |

## Estructura de la CLABE

```
012 180 00123456789 9
│   │   │           └─ Dígito verificador
│   │   └───────────── Número de cuenta (11 dígitos)
│   └───────────────── Plaza (3 dígitos)
└───────────────────── Banco (3 dígitos)
```

El dígito verificador se calcula así: cada uno de los primeros 17 dígitos se multiplica por 3, 7, 1, 3, 7, 1…; se suman las unidades de cada producto, y el verificador es `(10 - suma % 10) % 10`.

## Datos

- **Fuente:** lista de instituciones que publica [Banco de México](https://www.banxico.org.mx/cep/) en su servicio de Comprobante Electrónico de Pago (CEP), es decir, los participantes de SPEI.
- **Fecha del catálogo incluido:** 2026-11-19. Hoy son 97 instituciones.
- **Actualización:** `node scripts/actualizar-catalogo.mjs AAAA-MM-DD` regenera `src/catalogo.js`.

## Cambios

Ver [CHANGELOG.md](CHANGELOG.md).

## Apoyo

Proyecto de código abierto mantenido en mi tiempo libre. Si te fue útil y quieres agradecerlo:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero), ver [LICENSE](LICENSE).
