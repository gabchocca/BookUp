## Instalación y ejecución del Backend

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabchocca/BookUp.git
cd BookUp
```

---
### 2. Clave secreta ()
Genera (`SECRET_KEY`) para firmar los tokens JWT y usala en .env posteriormente:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Opción A: Con Docker (Recomendado)
Requiere tener instalado **Docker** y **Docker Compose**.

1. En `backend/.env`, asegúrate de que el host de `DATABASE_URL` sea `db`:
   ```env
   DATABASE_URL=postgresql://postgres:tu_password@db:5432/bookUp_db
   ```
2. Desde la raíz del proyecto, levanta los servicios:
   ```bash
   docker compose up --build
   ```
---

### Opción B: Ejecución local (Sin Docker)
Requiere tener instalado **Python 3.12+**, **`uv`** y **PostgreSQL**.

1. Crea una base de datos en PostgreSQL (ej. `bookUp_db`) y ejecuta el script `backend/db/init.sql` para crear las tablas.

2. Crea tu archivo `.env` copiando la plantilla de ejemplo y configuralo:

* **En Windows (PowerShell):**
  ```powershell
  copy .env.example .env
  ```
3. Instala las dependencias y arranca el servidor desde `backend/`:
   instalacion de dependencias uv, angular, node, typscript.
   ```bash
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   winget install Schniz.fnm
   fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
   fnm install --use 26
   npm install -g typescript
   npm install -g @angular/cli
   ```
   ```bash
   uv sync
   uv run uvicorn backend.main:app
   ```

### Verificar funcionamiento
Una vez iniciado, abre en tu navegador:
* **Documentación interactiva (Swagger)**: `http://localhost:8000/docs`
