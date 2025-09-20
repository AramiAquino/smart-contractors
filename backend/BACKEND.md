# Backend Node.js + SQLite

Este documento describe la arquitectura y configuración del backend de la aplicación, diseñado para ser modular, portable y escalable.

## Tecnologías Utilizadas

- **Node.js**: Plataforma principal para el backend.
- **Express**: Framework para exponer APIs REST.
- **SQLite**: Base de datos embebida, ligera y portable.
- **Docker**: Contenerización del backend para portabilidad y consistencia de entornos.
- **Docker Compose**: Orquestación de servicios y persistencia de datos a través de volúmenes.

## Arquitectura General

El backend sigue un patrón **modular y por capas**, con las siguientes responsabilidades:

- **Controller**: Recibe las solicitudes del cliente y coordina las respuestas. Maneja rutas y requests HTTP.
- **Service**: Aplica la lógica de negocio, validaciones y reglas de la aplicación.
- **Repository**: Gestiona la interacción con la base de datos, ejecutando consultas y retornando resultados.

Flujo de solicitud:

Cliente / Frontend
│
▼
[Controller] → Maneja rutas y requests HTTP
│
▼
[Service] → Contiene lógica de negocio y validaciones
│
▼
[Repository] → Acceso y manipulación de la base de datos (SQLite)


## Persistencia de Datos

- La base de datos SQLite se guarda en un archivo local dentro del contenedor o mediante un volumen Docker.
- Esto asegura que los datos **persistan aunque el contenedor se reinicie** y permite portabilidad del backend a cualquier entorno.
- La carpeta de datos se puede montar desde la máquina local para respaldos o inspección manual.

## Contenerización y Portabilidad

- El backend se ejecuta dentro de un **contenedor Docker**, lo que asegura:
  - Misma configuración en cualquier sistema operativo.
  - Independencia de dependencias instaladas localmente.
  - Posibilidad de despliegue rápido en servidores, VPS o servicios en la nube.

- Con **Docker Compose**, se simplifica el arranque y la gestión de volúmenes para persistencia, así como la integración con futuros servicios (frontend, microservicios, blockchain listener, etc.).

## Flujo de Solicitudes

1. El **cliente** realiza una petición HTTP (GET/POST/etc.) al backend.
2. El **Controller** recibe la solicitud y la direcciona al **Service**.
3. El **Service** aplica la lógica de negocio y llama al **Repository**.
4. El **Repository** ejecuta las operaciones en **SQLite**.
5. La respuesta viaja de vuelta por Service → Controller → Cliente.

## Estructura de Carpetas Sugerida

backend-sqlite/
├── data/ # Persistencia de la base de datos SQLite
├── src/
│ ├── controllers/ # Manejo de rutas y endpoints
│ ├── services/ # Lógica de negocio
│ ├── repositories/ # Acceso a la base de datos
│ ├── db.js # Configuración de la base de datos
│ └── index.js # Arranque del servidor
├── package.json # Dependencias Node.js
├── Dockerfile # Contenerización del backend
├── docker-compose.yml # Orquestación y persistencia
└── BACKEND.md # Documentación


## Beneficios de esta Arquitectura

- **Modularidad**: Cada capa tiene responsabilidades claras, lo que facilita mantenimiento y escalabilidad.
- **Portabilidad**: Docker asegura que el backend funcione igual en cualquier entorno.
- **Persistencia confiable**: SQLite con volúmenes Docker garantiza que los datos no se pierdan al reiniciar contenedores.
- **Escalabilidad futura**: La estructura permite agregar nuevas entidades, servicios o microservicios sin desordenar el proyecto.


# Levantar el Backend Node.js + SQLite

Esta guía explica cómo iniciar el backend de la aplicación de manera simple y portable, usando Node.js y SQLite, ya sea localmente o con Docker.

---

## Ejecutar Localmente

1. Instalar Node.js (v18 o superior recomendado).

2. Instalar dependencias:

~~~bash
npm install
~~~

3. Arrancar el servidor:

~~~bash
node src/index.js
~~~

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

**Nota:** La base de datos SQLite se guarda en la carpeta `data/`.

---

## Ejecutar con Docker

### Contenedor Individual

1. Construir la imagen:

~~~bash
docker build -t backend-sqlite .
~~~

2. Levantar el contenedor con persistencia de datos:

~~~bash
docker run -p 3000:3000 -v $(pwd)/data:/usr/src/app/data backend-sqlite
~~~

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

### Docker Compose

Levantar el backend usando Compose:

~~~bash
docker-compose up --build
~~~

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

**Ventaja:** Docker Compose simplifica la gestión de volúmenes y permite agregar servicios futuros de forma modular.


# Inspección de Datos SQLite en Contenedor Docker

Esta guía te permite verificar y explorar los datos almacenados en tu base de datos SQLite dentro del contenedor Docker.

## 📋 Verificación Rápida de Datos

### 1. Verificar que el contenedor está ejecutándose

```bash
docker ps
```

Busca el contenedor `backend-sqlite` en la lista de contenedores activos.

### 2. Listar archivos de la base de datos

```bash
docker exec backend-sqlite ls -la /usr/src/app/data/
```

Esto mostrará el archivo `database.db` y su información.

### 3. Ver las tablas disponibles

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db ".tables"
```

### 4. Ver la estructura de una tabla

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db ".schema users"
```

### 5. Consultar todos los datos

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db "SELECT * FROM users;"
```

## �� Exploración Interactiva

### Acceder al contenedor con shell interactivo

```bash
docker exec -it backend-sqlite sh
```

### Navegar a la carpeta de datos

```bash
cd /usr/src/app/data
```

### Abrir SQLite interactivamente

```bash
sqlite3 database.db
```

### Comandos SQLite útiles

```sql
-- Ver todas las tablas
.tables

-- Ver estructura de una tabla
.schema users

-- Consultar datos
SELECT * FROM users;

-- Contar registros
SELECT C



## 🛠️ Comandos de Mantenimiento

### Hacer backup de la base de datos

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db ".backup /usr/src/app/data/backup.db"
```

### Verificar integridad de la base de datos

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db "PRAGMA integrity_check;"
```

### Ver estadísticas de la base de datos

```bash
docker exec backend-sqlite sqlite3 /usr/src/app/data/database.db "PRAGMA table_info(users);"
```

## 📝 Notas Importantes

- Los datos persisten gracias al volumen mapeado en `docker-compose.yml`
- La base de datos se encuentra en `/usr/src/app/data/database.db` dentro del contenedor
- Puedes acceder a los datos tanto desde el contenedor como desde el host (carpeta `./data`)
- Los comandos sin `-it` funcionan mejor en scripts automatizados
- Usa `-it` solo cuando necesites interacción manual con SQLite