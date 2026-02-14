# Unit Tests

Esta carpeta contiene los tests unitarios para todos los módulos del chatbot.

## Estructura

- **parser.test.js** - Tests para el módulo de procesamiento NLP
- **googleSheets.test.js** - Tests para el adaptador de Google Sheets
- **whatsapp.test.js** - Tests para el adaptador de WhatsApp
- **index.test.js** - Tests para el módulo principal

## Ejecución

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (se re-ejecutan automáticamente)
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar un test específico
```bash
npm test parser.test.js
```

## Mocks utilizados

Todos los tests usan mocks para aislar los módulos:

- **@nlpjs/nlp**: Mock del gestor NLP
- **google-spreadsheet**: Mock para operaciones con Google Sheets
- **google-auth-library**: Mock para autenticación JWT
- **whatsapp-web.js**: Mock del cliente de WhatsApp
- **dotenv**: Mock para variables de entorno

## Cobertura esperada

La configuración de Jest espera una cobertura mínima de:
- 70% de ramas
- 70% de funciones
- 70% de líneas
- 70% de sentencias

## Casos de prueba

### Parser Tests
- Entrenamiento del modelo NLP
- Parsing de mensajes de gasto
- Extracción de números (enteros y decimales)
- Extracción de conceptos
- Manejo de casos edge

### GoogleSheets Tests
- Agregación de gastos
- Manejo de autenticación
- Propagación de errores
- Uso correcto de la API de Sheets

### WhatsApp Tests
- Inicialización del cliente
- Registro de eventos
- Configuración de autenticación
- Métodos disponibles

### Index Tests
- Entrenamiento al iniciar
- Manejo de mensajes
- Registro de gastos
- Ignorar mensajes anteriores
- Manejo de errores
