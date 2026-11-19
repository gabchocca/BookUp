## Instalación y ejecución del Backend

### 1. Configurar variables de entorno
Copia el archivo de ejemplo dentro de `backend/` y completa tus credenciales:

```bash
cp backend/.env.example backend/.env
```

---

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

1. Crea una base de datos en PostgreSQL (ej. `biblioteca_db`) y ejecuta el script `backend/db/init.sql` para crear las tablas.
2. En `backend/.env`, asegúrate de que el host de `DATABASE_URL` sea `localhost`:
   ```env
   DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/bookUp_db
   ```
3. Instala las dependencias y arranca el servidor desde `backend/`:
   ```bash
   cd backend
   uv sync
   uv run uvicorn src.main:app --reload
   ```

---

### Verificar funcionamiento
Una vez iniciado, abre en tu navegador:
* **Documentación interactiva (Swagger)**: `http://localhost:8000/docs`
