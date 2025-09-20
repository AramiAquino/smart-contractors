# Guía para Verificar Datos en SQLite

## Resumen de la Base de Datos Actual

**Ubicación:** `/Users/tomiivaz/Documents/fork/smart-contractors/backend/data/database.db`

### Tablas Existentes:
- **users**: Contiene usuarios del sistema
- **works**: (Pendiente de crear) - Contendrá los trabajos/contratos

### Datos Actuales:
- **users**: 2 registros
  - ID: 1, Nombre: "Tomi"
  - ID: 2, Nombre: "Vaz"

## Paso a Paso para Verificar Datos

### 1. Navegar al Directorio del Backend

### 2. Verificar que la Base de Datos Existe
```bash
ls -la data/
```
**Resultado esperado:** Deberías ver el archivo `database.db`

### 3. Listar Todas las Tablas
```bash
sqlite3 data/database.db ".tables"
```
**Resultado esperado:** 
```
users
```

### 4. Ver la Estructura de una Tabla
```bash
sqlite3 data/database.db ".schema users"
```
**Resultado esperado:**
```sql
CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
```

### 5. Consultar Todos los Datos de una Tabla
```bash
sqlite3 data/database.db "SELECT * FROM users;"
```
**Resultado esperado:**
```
1|Tomi
2|Vaz
```
