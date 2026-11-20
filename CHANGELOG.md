# Cambios

## 2.0.0 (2026-11-19)

### Cambios incompatibles
- El catálogo de bancos ahora es la lista oficial de participantes de SPEI de Banco de México (97 instituciones al 2026-11-19). Los nombres vienen tal como los publica Banxico (`BBVA MEXICO`, `BANAMEX`), se quitaron bancos que ya no existen y se agregaron los que faltaban (Nu, Mercado Pago, Spin by OXXO, entre otros).
- `buscarBanco` y `obtenerCatalogoBancos` devuelven `codigo`, `claveSpei`, `nombre` y `tipo`.
- `validarCLABE`, `extraerInfo` y `formatearCLABE` ya no aceptan valores que no sean texto.

### Nuevo
- `extraerInfo` incluye `bancoVigente`.
- `buscarBanco` acepta la clave SPEI de 5 dígitos.
- `infoCatalogo()` con fuente, URL y fecha.
- Tipos de TypeScript escritos a mano.
- `scripts/actualizar-catalogo.mjs` regenera el catálogo desde Banxico.

### Corregido
- Los ejemplos del README mostraban CLABEs con dígito verificador incorrecto.
