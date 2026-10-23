# Catálogo

Hecho:

- Búsqueda sin acentos ni mayúsculas y tolerante a errores de dedo (`buscar.ts`, en el navegador).
- Importar desde la carpeta de música del DJ (solo lee nombres "Artista - Título.mp3", limpia pistas y etiquetas) o pegando una lista / columnas de Excel (`importar.ts`). Salta repetidas.
- Listas curadas: Lo más pedido, Favoritas del DJ, Norteño y banda, Duetos.
- Gestor para el DJ: buscar, editar, marcar favoritas y duetos, borrar. Catálogo de ejemplo (`demo.ts`).

Pendiente: con Supabase, búsqueda en la base (Postgres `unaccent` + `pg_trgm`) si el catálogo crece a decenas de miles.
