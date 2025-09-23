# 🧪 Tests del Backend - Smart Contractors

## 📁 Estructura de Tests

```
test/
├── unit/                    # Tests unitarios
│   ├── models/             # Tests de modelos
│   │   ├── work.test.js
│   │   └── workStatus.test.js
│   ├── repositories/       # Tests de repositorios
│   │   └── workRepository.test.js
│   └── services/           # Tests de servicios
│       └── workService.test.js
├── integration/            # Tests de integración
│   └── workController.test.js
├── fixtures/               # Datos de prueba
│   └── workFixtures.js
├── setup/                  # Configuración de tests
│   ├── testDb.js
│   └── testHelpers.js
└── README.md
```

## 🚀 Comandos de Testing

### Instalar dependencias de testing
```bash
npm install
```

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar solo tests unitarios
```bash
npm run test:unit
```

### Ejecutar solo tests de integración
```bash
npm run test:integration
```

## 📊 Cobertura de Tests

Los tests cubren:

### ✅ **Modelos (Unit Tests)**
- `Work` - Constructor, fromDB, getStatusName, toJSON
- `WorkStatus` - Constructor, getStatusName, getStatusId, fromDB

### ✅ **Repositorios (Unit Tests)**
- `workRepository` - CRUD operations, queries específicas

### ✅ **Servicios (Unit Tests)**
- `workService` - Lógica de negocio, validaciones

### ✅ **Controladores (Integration Tests)**
- `workController` - Endpoints REST, validaciones de entrada

## 🔧 Configuración

### Jest Configuration
- **Test Environment**: Node.js
- **Test Match**: `**/test/**/*.test.js`
- **Coverage**: Excluye `src/index.js`
- **Reports**: Text, LCOV, HTML

### Base de Datos de Prueba
- Usa SQLite en memoria (`:memory:`)
- Se crea automáticamente para cada test
- Incluye datos de prueba predefinidos

## 📝 Escribir Nuevos Tests

### 1. Test Unitario de Modelo
```javascript
describe('MiModelo', () => {
  test('should do something', () => {
    // Test implementation
  });
});
```

### 2. Test de Repositorio
```javascript
describe('MiRepository', () => {
  beforeAll(async () => {
    testDb = await createTestDb();
    repository.db = testDb;
  });
  
  test('should create record', (done) => {
    repository.create(data, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBeDefined();
      done();
    });
  });
});
```

### 3. Test de Integración
```javascript
describe('MiController', () => {
  test('should handle POST request', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send(data)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## 🎯 Mejores Prácticas

1. **Nombres descriptivos**: `should create work with valid data`
2. **Un test por comportamiento**: Un test por cada funcionalidad
3. **Setup/Teardown**: Usar `beforeAll`, `afterAll`, `beforeEach`, `afterEach`
4. **Datos de prueba**: Usar fixtures para datos consistentes
5. **Assertions claras**: Usar expectaciones específicas
6. **Mocks cuando sea necesario**: Para dependencias externas

## 🐛 Debugging Tests

### Ejecutar test específico
```bash
npm test -- --testNamePattern="should create work"
```

### Ejecutar test de archivo específico
```bash
npm test -- test/unit/models/work.test.js
```

### Modo verbose
```bash
npm test -- --verbose
```
