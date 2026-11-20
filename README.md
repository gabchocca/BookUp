## Instalación y ejecución del proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabchocca/BookUp.git
cd BookUp
```

---

### 2. Clave secreta (`SECRET_KEY`)
Genera una clave secreta para firmar los tokens JWT y úsala en tu archivo `.env` posteriormente:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

### Opción A: Con Docker (Recomendado)
Requiere tener instalado **Docker** y **Docker Compose**.

1. En `Backend/.env`, asegúrate de que el host de `DATABASE_URL` sea `db`:
   ```env
   DATABASE_URL=postgresql://postgres:tu_password@db:5432/bookUp_db
   ```
2. Desde la raíz del proyecto, levanta los servicios:
   ```bash
   docker compose up --build
   ```

---

### Opción B: Ejecución local (Sin Docker)
Requiere tener instalado **Python 3.12+** y **PostgreSQL**.

1. **Base de datos:** Crea una base de datos en PostgreSQL llamada `"bookUp_db"` y ejecuta el script `Backend/db/init.sql` para crear las tablas.

2. **Variables de entorno:** Entra a la carpeta `Backend/`, crea tu archivo `.env` copiando la plantilla de ejemplo y configúralo (asegúrate de usar `localhost` en lugar de `db` en tu `DATABASE_URL`):
   ```powershell
   cd Backend
   copy .env.example .env
   ```

3. **Instalación de herramientas (desde la raíz del proyecto):**
   Ejecuta el script automático para instalar `uv`, `fnm`, Node.js, TypeScript y Angular CLI:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup.ps1
   ```

4. **Sincronización y ejecución del Backend:**
   Desde la carpeta `Backend/` (o la raíz según donde esté tu `pyproject.toml`):
   ```bash
   uv sync
   uv run uvicorn backend.main:app --reload
   ```

5. **Sincronización y ejecución del Frontend:**
   Abre otra terminal, entra a la carpeta del frontend y arranca Angular:
   ```bash
   cd "FrontEnd/BookUp"
   npm install
   ng serve
   ```

---

### Verificar funcionamiento
Una vez iniciado, abre en tu navegador:
* **Frontend (Angular):** `http://localhost:4200`
* **Documentación interactiva Backend (Swagger):** `http://localhost:8000/docs`
