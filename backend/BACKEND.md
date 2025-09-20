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

### Opción Recomendada: Docker Compose

Con la configuración actual, **un solo comando** levanta todo el backend:

~~~bash
docker-compose up
~~~

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

**Comandos útiles:**
- `docker-compose up --build` - Reconstruir imagen si hay cambios
- `docker-compose up -d` - Ejecutar en background
- `docker-compose logs -f` - Ver logs en tiempo real
- `docker-compose down` - Parar el servicio
