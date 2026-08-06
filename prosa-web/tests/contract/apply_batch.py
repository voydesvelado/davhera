"""Arnés de contrato: corre el sync.py REAL de prosa-cloud contra una DB temporal.

No es un mock. Lee un batch por stdin, lo aplica con `process_batch` de verdad y
devuelve por stdout el resultado y las filas que quedaron guardadas. Así el test de
TypeScript comprueba que sus payloads producen los datos correctos en el servidor,
en vez de comprobar que coinciden con lo que el propio test cree que el servidor lee.

Uso:  PROSA_CLOUD=/ruta/a/prosa-cloud python3 apply_batch.py < batch.json
"""

import hashlib
import json
import os
import sys
import tempfile

CLOUD = os.environ.get("PROSA_CLOUD", "/home/david/prosa-cloud")
sys.path.insert(0, CLOUD)

workdir = tempfile.mkdtemp(prefix="prosa-contract-")
# app.db lee estas variables al importarse: hay que fijarlas antes del import.
os.environ["PROSA_DB_PATH"] = os.path.join(workdir, "test.db")
os.environ["PROSA_DOCS_DIR"] = os.path.join(workdir, "documents")

from app.db import connect, doc_path  # noqa: E402
from app.migrate import migrate  # noqa: E402
from app.sync import process_batch  # noqa: E402

payload = json.load(sys.stdin)
user_id = payload.get("user_id", "david")

migrate()

# Un upsert de documento se rechaza si su .md no está subido con el hash correcto,
# así que el contenido se escribe primero, igual que hace el cliente real.
for doc_id, markdown in payload.get("contents", {}).items():
    path = doc_path(user_id, doc_id)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as fh:
        fh.write(markdown.encode("utf-8"))

conn = connect()
result = process_batch(conn, user_id, payload.get("device_id", "web-contract"), None,
                       payload["changes"])


def rows(table, where=""):
    return [dict(r) for r in conn.execute(f"SELECT * FROM {table} {where}").fetchall()]


json.dump(
    {
        "result": result,
        "documents": rows("documents"),
        "positions": rows("reading_positions"),
        "highlights": rows("highlights"),
        "tags": rows("tags"),
        "document_tags": rows("document_tags"),
        "content_sha256": {
            doc_id: hashlib.sha256(md.encode("utf-8")).hexdigest()
            for doc_id, md in payload.get("contents", {}).items()
        },
    },
    sys.stdout,
    ensure_ascii=False,
)
conn.close()
