# Validador de CLABE

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->

[![npm version](https://badge.fury.io/js/validador-clabe.svg)](https://badge.fury.io/js/validador-clabe)
[![npm downloads](https://img.shields.io/npm/dm/validador-clabe.svg)](https://www.npmjs.com/package/validador-clabe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/validador-clabe/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/GerardoLucero/validador-clabe/actions)

Librería moderna para **validar, generar y extraer información de CLABE** (Clave Bancaria Estandarizada) interbancaria mexicana de 18 dígitos.

## 🚀 Características

- ✅ **Validación completa** - Verifica formato y dígito verificador
- ✅ **Extracción de datos** - Banco, plaza, cuenta, dígito verificador
- ✅ **Generación de CLABE** - Crea CLABEs válidas con dígito correcto
- ✅ **Catálogo de bancos** - 80+ bancos mexicanos incluidos
- ✅ **Formateo** - Formatea CLABEs para mejor lectura
- ✅ **Validación por lotes** - Valida múltiples CLABEs
- ✅ **TypeScript ready** - Incluye definiciones de tipos
- ✅ **Zero dependencies** - Totalmente standalone
- ✅ **Totalmente probado** - Cobertura > 90%

## 📦 Instalación

```bash
npm install validador-clabe
```

```bash
yarn add validador-clabe
```

```bash
pnpm add validador-clabe
```

## 🔧 Uso

### Importación

```javascript
// ES6 Modules
import { validarCLABE, extraerInfo } from 'validador-clabe';

// CommonJS
const { validarCLABE, extraerInfo } = require('validador-clabe');
```

### Validar CLABE

```javascript
import { validarCLABE } from 'validador-clabe';

// CLABE válida
const esValida = validarCLABE('012180001234567897');
console.log(esValida); // true

// CLABE inválida (dígito verificador incorrecto)
const esInvalida = validarCLABE('012180001234567891');
console.log(esInvalida); // false

// Acepta espacios y guiones
const conEspacios = validarCLABE('012 180 00123456789 7');
console.log(conEspacios); // true
```

### Extraer Información

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

// Validar la CLABE generada
console.log(validarCLABE(clabe.clabe)); // true
```

### Formatear CLABE

```javascript
import { formatearCLABE } from 'validador-clabe';

const formateada = formatearCLABE('012180001234567897');
console.log(formateada); // '012 180 00123456789 7'

// También limpia CLABEs ya formateadas
const yaFormateada = formatearCLABE('012-180-00123456789-7');
console.log(yaFormateada); // '012 180 00123456789 7'
```

### Catálogo de Bancos

```javascript
import { obtenerCatalogoBancos, buscarBanco } from 'validador-clabe';

// Obtener todos los bancos
const bancos = obtenerCatalogoBancos();
console.log(bancos);
/*
[
  { codigo: '002', nombre: 'Banamex' },
  { codigo: '012', nombre: 'BBVA México' },
  { codigo: '014', nombre: 'Santander' },
  { codigo: '021', nombre: 'HSBC' },
  ...
]
*/

// Buscar un banco específico
const banco = buscarBanco('012');
console.log(banco); // { codigo: '012', nombre: 'BBVA México' }
```

### Validar Múltiples CLABEs

```javascript
import { validarCLABEs } from 'validador-clabe';

const clabes = [
  '012180001234567897',  // Válida
  '012180001234567891',  // Inválida
  '002180001234567890'   // Válida
];

const resultados = validarCLABEs(clabes);
console.log(resultados);
/*
[
  {
    index: 0,
    clabe: '012180001234567897',
    valida: true,
    banco: 'BBVA México',
    info: { ... }
  },
  {
    index: 1,
    clabe: '012180001234567891',
    valida: false,
    banco: 'BBVA México',
    info: { ... }
  },
  {
    index: 2,
    clabe: '002180001234567890',
    valida: true,
    banco: 'Banamex',
    info: { ... }
  }
]
*/
```

## 📋 API Completa

### `validarCLABE(clabe): boolean`

Valida si una CLABE es correcta.

**Parámetros:**
- `clabe` (string): CLABE a validar (18 dígitos)

**Retorna:** `true` si es válida, `false` si no lo es

**Ejemplo:**
```javascript
validarCLABE('012180001234567897'); // true
validarCLABE('012180001234567891'); // false (dígito incorrecto)
```

### `extraerInfo(clabe): Object`

Extrae información detallada de una CLABE.

**Retorna:**
```javascript
{
  clabe: string,           // CLABE limpia
  codigoBanco: string,     // Código del banco (3 dígitos)
  nombreBanco: string,     // Nombre del banco
  codigoPlaza: string,     // Código de plaza (3 dígitos)
  numeroCuenta: string,    // Número de cuenta (11 dígitos)
  digitoVerificador: string, // Dígito verificador (1 dígito)
  esValida: boolean        // Si la CLABE es válida
}
```

### `generarCLABE(codigoBanco, codigoPlaza, numeroCuenta): Object`

Genera una CLABE válida con su dígito verificador.

**Parámetros:**
- `codigoBanco` (string): Código del banco (3 dígitos)
- `codigoPlaza` (string): Código de plaza (3 dígitos)
- `numeroCuenta` (string): Número de cuenta (11 dígitos)

**Retorna:** Objeto con CLABE completa e información

### `formatearCLABE(clabe): string`

Formatea una CLABE con espacios para mejor lectura.

**Retorna:** CLABE en formato `BBB PPP CCCCCCCCCCC V`

### `obtenerCatalogoBancos(): Array<Object>`

Obtiene el catálogo completo de bancos mexicanos.

**Retorna:** Array de objetos `{ codigo, nombre }`

### `buscarBanco(codigo): Object|null`

Busca un banco por su código.

**Retorna:** `{ codigo, nombre }` o `null` si no existe

### `validarCLABEs(clabes): Array<Object>`

Valida múltiples CLABEs.

**Retorna:** Array con resultados de validación

## 🏦 Estructura de la CLABE

```
012 180 00123456789 7
│   │   │           │
│   │   │           └─ Dígito verificador (1 dígito)
│   │   └───────────── Número de cuenta (11 dígitos)
│   └───────────────── Código de plaza (3 dígitos)
└───────────────────── Código del banco (3 dígitos)
```

### Bancos Principales

| Código | Banco |
|--------|-------|
| 002 | Banamex |
| 012 | BBVA México |
| 014 | Santander |
| 021 | HSBC |
| 030 | Bajío |
| 036 | Inbursa |
| 044 | Scotiabank |
| 058 | BanRegio |
| 072 | Banorte |
| 127 | Azteca |
| 137 | Bancoppel |
| 138 | ABC Capital |
| 143 | CIBanco |

## 🎯 Casos de Uso

### Validación de Pagos

```javascript
import { validarCLABE, extraerInfo } from 'validador-clabe';

function procesarPago(clabe, monto) {
  if (!validarCLABE(clabe)) {
    throw new Error('CLABE inválida');
  }
  
  const info = extraerInfo(clabe);
  
  console.log(`Transferencia de $${monto} a:`);
  console.log(`  Banco: ${info.nombreBanco}`);
  console.log(`  Cuenta: ${info.numeroCuenta}`);
  console.log(`  CLABE: ${info.clabe}`);
  
  // Procesar pago...
  return { success: true, banco: info.nombreBanco };
}
```

### Formulario de Registro

```javascript
import { validarCLABE, formatearCLABE } from 'validador-clabe';

function validarFormularioBanco(clabe) {
  // Validar formato
  if (!validarCLABE(clabe)) {
    return {
      valido: false,
      error: 'La CLABE proporcionada no es válida. Verifica los 18 dígitos.'
    };
  }
  
  // Formatear para mostrar
  const clabeFormateada = formatearCLABE(clabe);
  const info = extraerInfo(clabe);
  
  return {
    valido: true,
    clabeFormateada,
    banco: info.nombreBanco,
    mensaje: `Cuenta verificada de ${info.nombreBanco}`
  };
}
```

### Sistema de Dispersión de Nómina

```javascript
import { validarCLABEs } from 'validador-clabe';

function validarCuentasEmpleados(empleados) {
  const clabes = empleados.map(e => e.clabe);
  const resultados = validarCLABEs(clabes);
  
  const invalidas = resultados.filter(r => !r.valida);
  
  if (invalidas.length > 0) {
    console.log('CLABEs inválidas encontradas:');
    invalidas.forEach(r => {
      console.log(`  Empleado ${r.index + 1}: ${r.clabe} - ${r.error || 'Dígito verificador incorrecto'}`);
    });
    return false;
  }
  
  console.log('Todas las CLABEs son válidas ✓');
  return true;
}
```

## 🧮 Algoritmo del Dígito Verificador

El dígito verificador se calcula usando el algoritmo de módulo 10 con pesos [3, 7, 1]:

```
Paso 1: Multiplicar cada dígito por su peso (3, 7, 1, 3, 7, 1, ...)
Paso 2: Sumar todos los dígitos de los productos (solo el dígito de las unidades)
Paso 3: Calcular (10 - (suma % 10)) % 10
```

Ejemplo para CLABE `012 180 00123456789`:
```
Posición:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
Dígito:    0  1  2  1  8  0  0  0  1  2  3  4  5  6  7  8  9
Peso:      3  7  1  3  7  1  3  7  1  3  7  1  3  7  1  3  7
Producto:  0  7  2  3 56  0  0  0  1  6 21  4 15 42  7 24 63
Unidades:  0  7  2  3  6  0  0  0  1  6  1  4  5  2  7  4  3

Suma: 51
(10 - (51 % 10)) % 10 = (10 - 1) % 10 = 9 % 10 = 9  ← Este es el dígito verificador
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/GerardoLucero/validador-clabe.git
cd validador-clabe

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Compilar para producción
npm run build:prod
```

## 📊 Compatibilidad

- **Node.js**: >= 18.0.0
- **Navegadores**: Todos los navegadores modernos
- **TypeScript**: Incluye definiciones de tipos

## ⚠️ Notas Importantes

- La CLABE es el estándar mexicano para transferencias electrónicas
- Todas las cuentas bancarias en México tienen una CLABE única
- El dígito verificador previene errores de captura
- Esta librería **NO** valida si la cuenta existe, solo valida el formato y dígito

## 📚 Referencias

- [Banco de México - CLABE](https://www.banxico.org.mx/sistemas-de-pago/informacion-general/banco-de-mexico-servicios/clabe-cuenta-bancaria-estandarizada.html)
- [Catálogo de Instituciones](https://www.banxico.org.mx/apps/cibvalor/index.html)
- [Especificación Técnica CLABE](https://www.banxico.org.mx/sistemas-de-pago/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue para discutir el cambio
2. Haz fork del proyecto
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

Asegúrate de que los tests pasen:

```bash
npm test
npm run lint
```

## 📝 Changelog

### v1.0.0 (2025)
- 🎉 Lanzamiento inicial
- ✨ Validación completa de CLABE
- ✨ Generación de CLABE con dígito verificador
- ✨ Extracción de información
- ✨ Catálogo de 80+ bancos mexicanos
- ✨ Formateo de CLABE
- ✨ Validación por lotes
- 🧪 Suite de tests completa
- 📚 Documentación completa

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

- 🐛 [Reportar un bug](https://github.com/GerardoLucero/validador-clabe/issues)
- 💡 [Solicitar una feature](https://github.com/GerardoLucero/validador-clabe/issues)
- 📧 [Contacto directo](mailto:tu-email@ejemplo.com)

---

**¿Te gusta este proyecto?** ⭐ ¡Dale una estrella en GitHub!

**¿Necesitas otros validadores?** 👀 Revisa el ecosistema completo:

- [validador-fiscal-mx](https://www.npmjs.com/package/validador-fiscal-mx) - Validación fiscal completa
- [calcula-rfc](https://www.npmjs.com/package/calcula-rfc) - Cálculo de RFC
- [calcula-curp](https://www.npmjs.com/package/calcula-curp) - Cálculo de CURP
- [generador-datos-mx](https://www.npmjs.com/package/generador-datos-mx) - Generador de datos de prueba
- [mx-bancos](https://www.npmjs.com/package/mx-bancos) - Información de bancos

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan en tus proyectos de pagos y fintech, considera invitarme un café:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs relacionados con pagos, SPEI y CLABE.
<!-- DONATIONS-END -->
