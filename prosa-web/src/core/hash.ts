/**
 * SHA-256 vía Web Crypto. Sin dependencias y disponible en los browsers del spec
 * (evergreen últimos 2 años) y en Node ≥ 18 para los tests.
 *
 * Es asíncrono porque `crypto.subtle` lo es. Por eso el parser también lo es —
 * y no importa: el parseo de documentos grandes va en un Web Worker de todos modos.
 */

const encoder = new TextEncoder();

/** SHA-256 hex de una cadena, codificada como UTF-8. */
export async function sha256(text: string): Promise<string> {
  return sha256Bytes(encoder.encode(text));
}

/** SHA-256 hex de bytes crudos. Es el `contentHash` de un documento: SHA-256 del md en UTF-8. */
export async function sha256Bytes(bytes: Uint8Array): Promise<string> {
  // Copia a un ArrayBuffer propio: la vista puede ser una ventana sobre un buffer
  // mayor (típico al leer archivos), y digest hashearía de más.
  const buffer = bytes.byteLength === bytes.buffer.byteLength ? bytes.buffer : bytes.slice().buffer;
  const digest = await crypto.subtle.digest("SHA-256", buffer as ArrayBuffer);
  return toHex(new Uint8Array(digest));
}

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}
