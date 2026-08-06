# Plan de implementación — Prosa Web en `davhera.com/prosa`

> Derivado de `Prosa Web — Spec completo v1.0`. Este documento no reemplaza el spec: lo aterriza
> contra la infraestructura que **existe hoy** (verificada el 2026-08-05) y resuelve las
> contradicciones entre lo que el spec asume y lo que hay en las máquinas.
> Ante ambigüedad se mantienen las tres reglas del spec: (1) nunca perder contenido del usuario,
> (2) la app funciona entera sin servidor, (3) simplicidad sobre features.

---

## 0. Estado verificado de la infraestructura

Lo que encontré, no lo que el spec asume:

| Cosa | Realidad verificada |
|---|---|
| `davhera.com` | **Vercel** (A → `216.198.79.1`, `www` → `…vercel-dns-017.com`). Next **16.2.1**, App Router, React 19.2.4, Tailwind 4, framer-motion 12.38, `vaul` 1.1.2 ya instalado. Repo `voydesvelado/davhera`, working copy en `~/davhera-work`. |
| Layout raíz | `app/layout.tsx` inyecta `<Analytics/>` de `@vercel/analytics` en **todas** las rutas renderizadas por Next. |
| Esta máquina | **Es el VPS** (`ubuntu-4gb-fsn1-1`, Hetzner). NO sirve davhera.com. |
| Prosa Cloud | `/opt/prosa-cloud` (working copy en `~/prosa-cloud`), `prosa-cloud.service` en `127.0.0.1:8700`, litestream activo, SQLite en `/var/lib/prosa/prosa.db`. |
| Puertos ocupados | 8700 prosa-cloud · **8701 akai-sampler** · 8702 `~/presentation/server.js` · 8000 python suelto. **8703 libre.** |
| Caddy | v2.11.4, dos hosts sslip.io. **Sin módulo `rate_limit`** (build estándar). |
| UFW | 22/80/443/51820 — no hace falta abrir nada nuevo. |
| Specs base | `PROSA_SPEC.md` y `PROSA_SYNC_CLIENT_SPEC.md` **no existen en esta máquina**. |

### 0.1 Deltas entre el spec y la realidad (decisiones tomadas)

1. **La web no la sirve Caddy.** El spec dice "estático detrás del Caddy existente en `prosa.{dominio}`".
   Decisión tomada: `davhera.com/prosa` = SPA de Vite dentro del `public/` de Next, en Vercel.
   Consecuencias en cascada, todas resueltas en §1: base path, scope del service worker, manifest,
   y **la CSP la sirve `next.config.ts`, no Caddy**.
2. **La API queda cross-origin.** Web en `davhera.com`, API en `api.prosa.davhera.com`. CORS deja de
   ser un detalle y pasa a ser requisito de arranque (§5.6).
3. **Vercel Analytics.** El spec promete "cero scripts de terceros" y la DoD dice "ni en analytics
   (no hay analytics)". Servir Prosa desde `public/` lo satisface **por construcción**: los archivos
   de `public/` no pasan por `app/layout.tsx`. Queda como verificación explícita en M7, no como tarea.
4. **Puerto 8701 ocupado.** El spec propone 8701 para la instancia pública → se usa **8703**.
5. **Caddy no puede hacer rate limiting.** `rate_limit` es plugin de terceros; meterlo exige
   recompilar Caddy con xcaddy en un servidor que hoy sirve la biblioteca personal. Riesgo no
   justificado. Decisión: **limiter en proceso dentro de FastAPI** (§5.5).
6. **El servidor NO es multi-tenant como afirma el spec.** `app/sync.py` sí está parametrizado por
   `user_id`, pero `app/main.py` hardcodea `USER_ID` de env y compara un único `TOKEN` global en el
   middleware. Hay refactor real de auth (§5.2), no "funciona sin cambios".
7. **Riesgo de escritura cruzada entre cuentas.** `documents.id`, `highlights.id` y
   `reading_positions.document_id` son PRIMARY KEY **sin `user_id`**, y los ids los genera el cliente.
   Con 100 cuentas en una DB compartida, un cliente puede mandar un `id` ajeno y el
   `ON CONFLICT(id) DO UPDATE` le pisa título y `content_hash` a otra cuenta. Se resuelve con guardia
   de propiedad en código (§5.3) — no con migración destructiva sobre la DB personal.
8. **La clave se contradice consigo misma.** El spec dice `prosa-XXXX-XXXX-XXXX-XXXX` (16 chars = 80
   bits) y en la misma frase "20 chars base32, ~100 bits". Decisión: **20 chars en 4 grupos de 5** →
   `prosa-XXXXX-XXXXX-XXXXX-XXXXX`, 100 bits reales, la afirmación del spec se vuelve cierta.
9. **`migrations/001_init.sql` siembra `INSERT OR IGNORE INTO users VALUES ('david')`.** Correr las
   migraciones sobre `public.db` crearía ahí un usuario `david` fantasma. Se guarda (§5.1).
10. **React 18 → React 19.** El spec pide React 18; el monorepo ya trae 19.2.4. Con workspaces, dos
    Reacts conviven pero invitan a bugs sutiles de hoisting. Nada en el spec depende de 18.
    Decisión: **React 19** en `prosa-web`. framer-motion 12 lo soporta.

### 0.2 Deltas descubiertos al cruzar la Referencia Core con el servidor desplegado

11. **El wire format es `snake_case`, no `camelCase`.** La Referencia Core dice "conservar camelCase
    idéntico para que el wire format coincida byte a byte con las apps nativas". El servidor que las
    apps nativas ya usan en producción lee **exclusivamente snake_case**: `content_hash`, `word_count`,
    `cover_seed`, `block_index`, `anchor_snippet`, `offset_in_block`, `start_offset`, `snapshot_text`,
    `is_orphaned`, `group_id`, `document_id` (verificado en `app/sync.py` y en `tests/test_sync.py`).
    Si el puerto manda camelCase, cada `p.get()` devuelve el default y **el sync escribe documentos
    vacíos con progress 0** — silenciosamente. Decisión: **camelCase en el modelo TS/Dexie,
    snake_case en el `payload` del ChangeLog**, con una única frontera de serialización
    (`core/sync/wire.ts`) y un test que valida un payload real contra las claves de `sync.py`.
12. **`lastOpenedAt` no existe en el servidor.** No está en `migrations/001_init.sql` ni en `sync.py`.
    Es campo **local puro**: la regla del reconciler ("el más reciente") aplica en el cliente y no
    viaja. Además `PROSA_WEB_SPEC §2` lo omite del schema Dexie — hay que agregarlo, porque el
    DuplicateReconciler lo necesita.
13. **Offsets de caracteres: Swift ≠ JavaScript.** El spec dice "offsets de CARACTERES (no bytes)".
    En Swift un `Character` es un grapheme cluster; en JS los índices de string son unidades UTF-16.
    Para un emoji o una vocal descompuesta los números difieren y un highlight sincronizado se
    desplaza. Decisión: normalizar el `plainText` a **NFC**, contar en **code points**
    (`Array.from`), y —regla que ya está en el algoritmo— tratar `snapshotText` como la verdad y los
    offsets como pista: al cargar, si `plainText[start..end] !== snapshotText`, reajustar por
    substring. Con eso el peor caso es un reajuste, nunca un highlight corrido.
14. **`isApplyingRemote` tiene una excepción.** El invariante dice que aplicar cambios remotos no
    escribe ChangeLog (si no, eco infinito). Pero el DuplicateReconciler corre *después* del pull y
    **sí debe registrar** sus upserts de fusión y su tombstone. El flag se apaga antes de reconciliar.
    Es sutil y es exactamente el tipo de bug que produce duplicados que reaparecen.

---

## 1. Arquitectura de deploy

### 1.1 Forma final

```
davhera.com/prosa            → public/prosa/index.html   (SPA, sin layout de Next, sin Analytics)
davhera.com/prosa/lib/…      → mismo index.html (rewrite afterFiles) → router del SPA
davhera.com/prosa/assets/*   → archivos reales de public/ (sirve Vercel, cache inmutable)
davhera.com/*                → sitio Next actual, intacto
api.prosa.davhera.com        → Caddy (VPS) → 127.0.0.1:8703 → prosa-public.service
46.225.147.90.sslip.io       → sin tocar (biblioteca personal, :8700)
```

### 1.2 Un solo repo, un solo deploy

`prosa-web/` vive **dentro** de `davhera-work/` como npm workspace. Vite escribe directo a
`public/prosa/`, que va al `.gitignore`. Un `git push` despliega ambas cosas y no se commitean
artefactos de build.

```jsonc
// davhera-work/package.json
"workspaces": ["prosa-web"],
"scripts": {
  "build": "npm run build -w prosa-web && next build",
  "dev:prosa": "npm run dev -w prosa-web"       // Vite en :5173, aislado
}
```

```ts
// prosa-web/vite.config.ts
export default defineConfig({
  base: '/prosa/',
  build: {
    outDir: '../public/prosa',
    emptyOutDir: true,
    modulePreload: { polyfill: false },   // sin el <script> inline → CSP sin 'unsafe-inline'
  },
})
```

*Alternativa si el build de Vercel se complica*: buildear local y commitear `public/prosa/`.
Funciona, pero mete artefactos al repo — solo como plan B.

### 1.3 `next.config.ts` (adiciones)

```ts
async rewrites() {
  return {
    afterFiles: [                                  // 'afterFiles' es clave: los assets reales de
      { source: '/prosa', destination: '/prosa/index.html' },   // public/ se sirven primero, y solo
      { source: '/prosa/:path*', destination: '/prosa/index.html' }, // las rutas del SPA caen aquí
    ],
  }
},
async headers() {
  return [
    { source: '/prosa/:path*', headers: [
      { key: 'Content-Security-Policy', value:
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; font-src 'self'; " +
        "connect-src 'self' https://api.prosa.davhera.com; " +
        "worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'" },
      { key: 'Service-Worker-Allowed', value: '/prosa/' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ]},
    { source: '/prosa/index.html', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
    { source: '/prosa/sw.js',      headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
  ]
},
```

`style-src 'unsafe-inline'` es necesario porque el sistema de temas cambia CSS variables en vivo
(§5 del spec). Es la única concesión y no compromete nada: no hay HTML de terceros en la página.

### 1.4 PWA en subpath

- SW en `/prosa/sw.js` → scope `/prosa/` por defecto. **No puede tocar el resto de davhera.com.**
- `navigateFallback: '/prosa/index.html'` + `navigateFallbackAllowlist: [/^\/prosa\//]`.
- `manifest.webmanifest`: `"id": "/prosa/"`, `"start_url": "/prosa/"`, `"scope": "/prosa/"`.
  El `manifest: "/site.webmanifest"` del layout raíz de Next no aplica: nuestro `index.html` es propio.
- IndexedDB es **por origen**: la biblioteca vive en el origen `davhera.com` compartido con el resto
  del sitio. No hay conflicto de datos, pero "borrar datos del sitio" borra todo davhera.com. El
  banner honesto de §2.3 cubre exactamente esto.

### 1.5 Spike de arquitectura — RESUELTO (2026-08-06)

Verificado contra `next build && next start` reales (Next 16.2.1), no en teoría:

| Prueba | Resultado |
|---|---|
| `/prosa` | 200 `text/html` — sirve el SPA |
| `/prosa/ruta/inventada` | 200, mismo `index.html` con `id="root"` → el rewrite `afterFiles` funciona |
| `/prosa/assets/index-*.js` | 200 `application/javascript` → el rewrite **no** se come los assets |
| CSP, `Service-Worker-Allowed`, `nosniff`, `Referrer-Policy` | aplicados en `/prosa/*` |
| `/`, `/proyectos/saira`, ruta inexistente | 200 · 307 (redirect de locale, esperado) · 404 → **el sitio quedó intacto** |

**No hace falta el fallback del Route Handler.** La arquitectura de §1 es viable.

**Un pendiente, no bloqueante**: el handler de estáticos de Next pisa `Cache-Control` en archivos de
`public/` (todo sale `public, max-age=0`), así que la regla de `immutable` para
`/prosa/assets/*` no tiene efecto bajo `next start`. El comportamiento sigue siendo **correcto**
(ETag + revalidación en cada request), solo subóptimo. Falta confirmar en el preview si el edge de
Vercel sí respeta `headers()` para estáticos; si tampoco, la salida documentada es un bloque
`headers` en `vercel.json`, que sí actúa a nivel plataforma. Se cierra en M7 con los presupuestos.

---

## 2. Estructura del proyecto

```
davhera-work/
  prosa-web/
    src/
      core/                    # SIN React. Testeable en aislamiento. Regla dura.
        markdown/  parse.ts blocks.ts hash.ts       # remark → Block[]
        anchor/    engine.ts restore.ts            # PROSA_SPEC §4, portado literal
        db/        schema.ts store.ts changelog.ts # Dexie
        sync/      engine.ts client.ts reconciler.ts
        export/    zip.ts                          # JSZip, lazy
      features/  library/ reader/ import/ highlights/ account/ settings/
      design/    tokens.css springs.ts  Pill.tsx Chip.tsx Sheet.tsx GlassBar.tsx
      i18n/      en.ts es.ts
    public/      manifest.webmanifest icons/ sample/carta-a-meneceo.{en,es}.md
    tests/       unit/ (vitest)  e2e/ (playwright)
  public/prosa/  # ← output del build, gitignored
```

Dependencias: `react@19 react-dom@19 dexie dexie-react-hooks zustand framer-motion unified
remark-parse remark-gfm turndown jszip vaul tailwindcss@4`. Lazy: parser, JSZip, turndown.

---

## 3. Fases

Cada milestone termina en algo verificable. **M1–M4 = v1 shipeable sin tocar el servidor.**

### M0 — Desbloqueo (medio día)
- Recibir `PROSA_SPEC.md` y `PROSA_SYNC_CLIENT_SPEC.md` (§8 abajo: sin esto, M1 y M6 arrancan a ciegas).
- Spike del rewrite (§1.5) en un preview de Vercel.
- Scaffold del workspace, `base: '/prosa/'`, "hola mundo" desplegado en `davhera.com/prosa`.
- Confirmar acceso al DNS de davhera.com para crear el A de `api.prosa`.

**Acepta cuando**: `davhera.com/prosa` y `davhera.com/prosa/ruta/inventada` sirven el SPA, y
`davhera.com` sigue idéntico.

### M1 — `core/` sin React (3–4 días)
- `markdown/`: remark-parse + remark-gfm → `Block[]` = `{index, kind, level?, plainText, hash}`.
  `plainText` normalizado = trim + colapsar whitespace interno a un espacio, **en NFC**.
  `hash` = SHA-256 de los **primeros 200 chars** del plainText (no del bloque entero).
  `plainTextIndex` del documento para búsqueda full-text.
- `anchor/`: AnchorEngine portado literal — exacto → búsqueda global por hash (único match) →
  fuzzy trigram Jaccard ≥ 0.6 en ventana ±10 → clamp. Toast solo en fuzzy y clamp; silencio en el
  match por hash. Re-anclaje de highlights por `snapshotText` con la escalera de 4 pasos y
  `isOrphaned` como último recurso — **jamás borrar**.
  *Decisión de implementación que el spec no fija*: en empate de score fuzzy gana el `blockIndex`
  menor. Sin ella el test 11 (determinismo) no es reproducible.
- `db/`: schema Dexie + `lastOpenedAt` (§0.2.12) + `DocumentStore` como único camino de mutación,
  con el flag `isApplyingRemote` y su excepción (§0.2.14).
- `sync/wire.ts`: frontera camelCase ↔ snake_case (§0.2.11).
- Tests Vitest: **los 11 casos obligatorios del AnchorEngine, portados tal cual**, sobre el fixture
  de ~60 bloques y sus variantes. Test 2 exige poder espiar que el fuzzy no se invocó → el motor se
  diseña instrumentable desde el principio.

**Acepta cuando**: los 11 tests pasan sin adaptar sus expectativas, y un payload generado por el
ChangeLog se aplica correcto contra `app/sync.py` corriendo en local (test de contrato, no mock).

### M2 — Shell, biblioteca, import (4–5 días)
- Layout responsive: <768 pantallas + sheets (vaul); ≥768 sidebar + grid.
- Biblioteca: Continuar leyendo, portadas determinísticas por `coverSeed` (mismos 5 grises),
  chips de tags, búsqueda título + full-text agrupada, context menu completo.
- Import: sheet de pegado con `paste` nativo (**sin** Clipboard API, §10 del spec), drag & drop de
  ventana entera, multi-archivo, dedup por `contentHash` + contención ≥90%, resumen honesto.
- `navigator.storage.persist()` al primer import + banner honesto (una vez, descartable).

**Acepta cuando**: pego un ensayo y aparece en la biblioteca sin aterrizar en el lector; recargo y sigue ahí.

### M3 — Lector, anclas, highlights (5–6 días)
- Chrome invisible, cápsula glass, **inset superior de 64px** (la lección aprendida, no negociable),
  hilo 2pt + scrubber con ticker de headings, TOC sheet/panel, tiempo restante 220 wpm.
- Guardado de ancla: debounce 500ms + `visibilitychange` + `pagehide`. Re-anclaje tras `resize`
  (debounced) y tras cambio de tipografía.
- Highlights: mini-barra sobre la selección, animación ámbar ~250ms, merge de solapados, `groupId`
  entre bloques, punto ámbar 4pt con nota, popover, doble-tap/doble-click de párrafo
  (`touch-action: manipulation`), re-anclaje por `snapshotText` con huérfanos.
- `navigator.vibrate(10)` donde exista, silencio donde no.

**Acepta cuando**: cierro la pestaña a media lectura, cambio el tamaño de fuente al volver, y sigo
exactamente donde estaba.

### M4 — v1 completo y shipeable (3–4 días)
- `tokens.css` + `springs.ts` (2 springs, 3 inks, 4 tamaños, 2 radios, 1 acento — auditables leyendo
  dos archivos). `prefers-reduced-motion` → solo fades en todo lo animado.
- Temas (claro/oscuro/sepia/OLED) por `data-theme`, crossfade 200ms.
- Export/import zip (JSZip lazy) — **feature de primera clase**, es la migración entre browsers.
- PWA instalable + offline total. i18n en/es por `navigator.language` con override.
- Ensayo de muestra precargado y borrable.

**→ Aquí se puede anunciar. Todo lo que sigue es el respaldo.**

### M5 — Servidor público (2–3 días) — detalle en §5
Instancia separada, tabla `accounts`, auth por clave, cuotas, límites, backups, DNS + Caddy.
**Se puede hacer en paralelo a M2–M4**: no comparte código con el frontend.

### M6 — El @ y el sync (4–5 días)
- Flujo de creación (§7 del spec) con la fricción deliberada de la pantalla de clave.
- `SyncEngine`: push→pull→apply, batches 200, idempotencia por `change_id`, backoff 30s→15m,
  `Web Locks` para que solo una pestaña sincronice, flush con `fetch keepalive` en `visibilitychange`.
- `DuplicateReconciler` portado: canónico = `importedAt` más antiguo, empate → menor UUID
  lexicográfico; unión de highlights con merge de solapados y **notas concatenadas con `\n—\n`**;
  posición de mayor `progress`; status más avanzado; upserts de fusión encolados **antes** del
  tombstone. Sus 6 tests, incluidos determinismo bilateral y triple duplicado.
- Backfill del primer sync con `clientTimestamp` = `updatedAt` real de la entidad, nunca `now()`.

**Acepta cuando**: creo `@x` en Chrome, entro con @ + clave en Firefox, subrayo ahí, aparece en Chrome;
y una biblioteca con duplicados entre local y remoto termina en una copia con highlights unidos.

### M7 — Endurecimiento (2–3 días)
Presupuestos (<150KB JS gzip del shell, <300ms a primer texto, 60fps), Lighthouse ≥90/≥95,
teclado completo, headings semánticos reales, auditoría de tokens, comparación a ojo de la
transición héroe contra la app de Mac, smoke test end-to-end del servidor por curl.

**Total estimado: 4–5 semanas de trabajo enfocado**, con M5 solapable.

---

## 4. Notas de implementación del frontend

- **Regla dura**: `src/core/` no importa React. Si un test necesita un DOM, el diseño está mal.
- **La clave nunca en el estado de React** fuera del flujo de creación/login: vive en su propia tabla
  de IndexedDB y la lee el `SyncEngine`. Nunca en URL, nunca en logs.
- **Virtualización**: primero `content-visibility: auto` (gratis). Solo si un documento de 100K
  palabras no llega al presupuesto, react-virtuoso. Parseo en Web Worker con shimmer.
- **Dos pestañas**: Dexie ya emite cross-tab para la biblioteca; el conflicto de posición lo resuelve
  "más avanzada gana" y se documenta en vez de pelearse.
- **Cuota excedida a media importación**: transacción atómica de Dexie, falla entera, mensaje honesto,
  cero registros a medias.
- **Sin `beforeunload`.** El debounce + `visibilitychange` cubren el 99% y el ancla protege el resto.

---

## 5. Servidor — plan para el VPS (§11 del spec, corregido)

### 5.1 Separación

```
/var/lib/prosa/prosa.db              personal  :8700  (INTACTO — riesgo cero tolerado)
/var/lib/prosa/public.db             pública   :8703
/var/lib/prosa/public-documents/{user_id}/
/etc/prosa/public.env                secretos de la instancia pública (600, root:prosa)
```

`prosa-public.service`: mismo código, mismo venv, distinto `Environment=`:
`PROSA_DB_PATH=/var/lib/prosa/public.db`, `PROSA_DOCS_DIR=/var/lib/prosa/public-documents`,
`PROSA_MODE=public`, `--port 8703`.

Antes de migrar `public.db`: **guardar el seed de `david`** en `001_init.sql` (envolverlo para que
solo corra en modo personal, o moverlo a un script de bootstrap aparte). Si no, la DB pública nace
con un usuario fantasma.

```
# /etc/caddy/Caddyfile — bloque nuevo, los dos existentes sin tocar
api.prosa.davhera.com {
	reverse_proxy 127.0.0.1:8703
}
```
Requiere primero el registro **A `api.prosa.davhera.com` → 46.225.147.90** (el DNS de davhera.com
está en Vercel). Caddy saca el certificado solo en cuanto resuelva.

### 5.2 Auth: de token único a cuentas

`app/main.py` hoy compara un `TOKEN` global y usa `USER_ID` de env. Cambio mínimo y reversible:

- Dependencia `resolve_user(request) -> user_id`:
  - `PROSA_MODE=personal` → comportamiento **byte-idéntico** al de hoy (`compare_digest` con `TOKEN`).
  - `PROSA_MODE=public` → `SELECT user_id FROM accounts WHERE key_hash = sha256(bearer)`. Sin fila → 401 sin detalle.
- Todos los endpoints reciben `user_id` inyectado en vez de la constante importada.
- `/v1/health` sigue sin auth. Los endpoints de cuenta (§5.4) también, con límites.
- **Tests de regresión de la instancia personal primero.** `tests/test_sync.py` (205 líneas) ya existe:
  extenderlo con un caso multi-tenant antes de tocar `main.py`.

Sobre el hash: la clave es un secreto aleatorio de 100 bits, así que SHA-256 con índice único es
correcto (no hace falta bcrypt/argon2 — no hay diccionario que atacar). El lookup es por hash exacto,
así que la "comparación en tiempo constante" del spec deja de ser relevante ahí.

### 5.3 Guardia de propiedad (el bug del §0.1.7)

Antes de cualquier upsert de `document` / `highlight` / `position`:

```sql
SELECT user_id FROM documents WHERE id = ?;
-- existe y != caller  →  no aplicar, devolver en `conflicts` con reason "id_owned_by_another_account"
```

Igual para `highlights.id` y `reading_positions.document_id`. Es una lectura indexada por operación:
barato, no destructivo, y no obliga a reconstruir tablas en la DB personal en producción.
*(El arreglo profundo — PK compuesta `(id, user_id)` — queda anotado como deuda; en SQLite exige
rebuild de tabla y no vale el riesgo hoy.)*

### 5.4 Endpoints nuevos

```sql
-- migrations/002_accounts.sql
CREATE TABLE IF NOT EXISTS accounts (
  handle TEXT PRIMARY KEY,
  key_hash TEXT NOT NULL UNIQUE,
  user_id TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  last_active_at TEXT NOT NULL,
  doc_count INTEGER DEFAULT 0,
  bytes_used INTEGER DEFAULT 0,
  purge_warned_at TEXT,
  deleted_at TEXT                      -- tombstone: libera el handle a los 90 días
);
CREATE INDEX IF NOT EXISTS idx_accounts_key ON accounts(key_hash);
```

- `GET /v1/handles/{handle}/available` → `{available, spots_left}`. Sin auth, limitado.
- `POST /v1/accounts {handle}` → valida formato `[a-z0-9_]{3,20}`; si
  `COUNT(activas) >= 100` → 403 `{"error":"beta_full"}` (activa = ≥1 documento vivo **o** creada hace
  <30 días); genera `prosa-XXXXX-XXXXX-XXXXX-XXXXX` con `secrets`, guarda **solo el hash**, responde
  `{handle, key}`. Única vez en la historia de esa cuenta que la clave existe en claro.
- `DELETE /v1/accounts/me` → borra filas + archivos, deja tombstone 90 días.
- `POST /v1/inbox` **deshabilitado en modo público** (es el canal de Telegram del autor; expuesto
  saltaría las verificaciones de cuota).

### 5.5 Cuotas y límites

- 500 documentos / 50 MB por cuenta; verificación en push de documento y en `PUT …/content` →
  413 `{"error":"quota_exceeded","used":…,"limit":…}`. `bytes_used`/`doc_count` se actualizan en el
  mismo `with conn:` que la escritura.
- **Rate limiting en FastAPI, no en Caddy** (§0.1.5): limiter en proceso con ventana deslizante —
  `POST /v1/accounts` 5/h/IP · `available` 30/min/IP · API general 120/min/clave. Un solo worker
  uvicorn, así que un dict en memoria basta; se persiste solo el contador de creación de cuentas.
- CORS: `allow_origins=["https://davhera.com"]` (decidir si `www` redirige o se agrega),
  `allow_headers=["Authorization","Content-Type","X-Content-Hash","If-None-Match"]`,
  `expose_headers=["ETag"]`, `allow_credentials=False`. **Sin preflight correcto no funciona nada**:
  probarlo en M5, no en M6.
- Purga por inactividad: cron mensual → 11 meses marca `purge_warned_at` (el frontend avisa al
  entrar) → 12 meses export a zip en cold storage → borrado → lugar liberado.

### 5.6 Operación

- `deploy.sh`: extender para respaldar y migrar **ambas** DBs y reiniciar ambos servicios, con health
  check de los dos puertos.
- Litestream: segunda sección `dbs:` para `public.db`, réplica en prefijo separado.
- restic: incluir `public-documents/`; `restore-drill.sh` verifica las dos DBs.
- Telegram: alertas existentes + contador semanal de cuentas activas.
- Smoke test end-to-end por curl (crear cuenta → push → pull → contenido íntegro → 401 sin clave)
  como script en `scripts/`, no como comandos sueltos en el README.

---

## 6. Riesgos ordenados por probabilidad de arruinar el plan

| Riesgo | Mitigación |
|---|---|
| El rewrite de Next hacia un `.html` de `public/` no se comporta como espero | Spike de M0 en preview real; fallback documentado (Route Handler) |
| El puerto manda `camelCase` en el payload y el servidor lo ignora campo por campo → documentos vacíos, progress 0, **sin ningún error** | Frontera única en `wire.ts` + test de contrato contra `app/sync.py` real en M1 (§0.2.11). Es el fallo más caro del plan porque es silencioso |
| El parser web produce un `plainText` distinto al de Swift → hashes distintos → todas las anclas fallan al cruzar plataformas | Fixtures compartidos; pedir el dump de `Block[]` del parser nativo (§8.2). Hasta tenerlo, la paridad no está verificada y hay que decirlo |
| Tocar `main.py` degrada la instancia **personal** en producción | Tests de regresión primero; `PROSA_MODE=personal` como camino por defecto e intacto |
| CORS/preflight descubierto tarde | Se prueba en M5 con curl, mucho antes de que exista UI de cuenta |
| Presupuesto de 150KB reventado por remark + framer-motion | Code-splitting desde el día uno (parser, JSZip y turndown lazy); medir en cada milestone, no al final |
| Safari borra IndexedDB a los 7 días (ITP) | `persist()` + banner honesto + export zip + el @. Aviso subido de tono si `persisted() === false` |
| El copy de la pantalla de clave no se entiende y alguien pierde su biblioteca | DoD lo exige: probarlo con alguien que no seas tú, antes de abrir la beta |

---

## 7. Definition of Done — mapeo a milestones

| DoD del spec | Milestone |
|---|---|
| Leyendo en <5s desde el primer link | M2 |
| Vuelvo mañana y sigo donde estaba (incluso tras cambiar tipografía) | M3 |
| PWA offline lee y subraya | M4 |
| Zip: exporto, borro todo, importo, intacto | M4 |
| @ en browser A → browser B con highlights bidireccionales | M6 |
| Duplicados → una copia con highlights unidos | M6 |
| Usuario 101 → beta llena digna, app local intacta | M5 + M6 |
| Clave nunca en URL/logs/analytics | M6 (+ verificación M7) |
| Copy de la clave validado con un tercero | M6 |
| 413 honesto con barra de uso | M5 + M6 |
| reduced-motion, teclado, VoiceOver, headings reales | M7 |
| Auditoría de tokens (2 archivos) | M7 |
| Héroe portada→lector igual que en Mac | M7 |
| VPS: DBs separadas, backups, drill, límites, smoke test | M5 |

---

## 8. Input pendiente

**Resuelto** (2026-08-06): la *Referencia Core* cubre §2, §4 + los 11 tests, §8 tokens exactos y §6
DuplicateReconciler + sus 6 tests. **M1 y M6 están desbloqueados**; se puede empezar.

Queda pendiente, ninguno bloqueante para arrancar M0/M1:

1. **Los 5 grises exactos de portada** y el mapeo `coverSeed → índice`. El spec da el rango
   (`#E8E8E8`→`#4A4A4A`) pero no los cinco valores ni la función, y la DoD exige que un documento
   "se vea igual aquí que en Mac/iOS". *(Necesario en M2; mientras tanto, 5 pasos interpolados y una
   constante fácil de reemplazar.)* Los "equivalentes invertidos en dark" también sin definir.
2. **Dump de `Block[]` del parser Swift** para el ensayo fixture, en JSON. Es la única forma de
   verificar de verdad la paridad de `plainText` — sin él, los tests comparan el parser web consigo
   mismo. *(Necesario en M1 para cerrar el criterio de paridad; el resto de M1 avanza sin él.)*
3. **El ensayo de muestra** ("Carta a Meneceo") en en/es, el mismo resource de las apps nativas.
4. **Acceso al DNS de davhera.com** para el A de `api.prosa`. Bloquea M5 (no M1–M4).
5. Confirmar que el deploy de davhera.com es Vercel-desde-git en `main` (no vi `vercel.json`;
   la rama actual es `test/footer-deploy-check`).
6. Origin canónico para CORS: ¿`davhera.com` solo, o también `www.davhera.com`?

## Backlog
Web Share Target · lector web del inbox de Telegram · "quedan N lugares" en la landing ·
PK compuesta `(id, user_id)` en el servidor · bibliotecas de solo-lectura por link (contradice un
non-goal — re-evaluar con usuarios reales)
