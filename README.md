## Personal-Chatbot

Un chatbot inteligente de WhatsApp que registra gastos automáticamente en Google Sheets utilizando procesamiento de lenguaje natural (NLP).

### Características

- **Integración WhatsApp**: Se comunica a través de WhatsApp Web
- **Procesamiento NLP**: Entiende mensajes en español usando @nlpjs
- **Registro de Gastos**: Guarda automáticamente gastos en Google Sheets
- **Autenticación Google**: Integración segura con Google Sheets API
- **Validación de Datos**: Extrae montos y conceptos de mensajes naturales

### Tecnologías

- **Node.js**: Runtime JavaScript
- **WhatsApp Web.js**: Cliente de WhatsApp
- **@nlpjs**: Procesamiento de lenguaje natural en español
- **Google Sheets API**: Almacenamiento de datos
- **Jest**: Framework de testing

### Estructura del Proyecto

```
src/
├── index.js                 # Punto de entrada principal
├── services/
│   └── parser.js           # Procesamiento NLP de mensajes
├── adapters/
│   ├── whatsapp.js         # Configuración cliente WhatsApp
│   └── googleSheets.js     # Integración con Google Sheets
└── test/
    ├── parser.test.js      # Tests del parser NLP
    ├── googleSheets.test.js # Tests de Google Sheets
    ├── whatsapp.test.js    # Tests del cliente WhatsApp
    ├── index.test.js       # Tests del módulo principal
    └── README.md           # Documentación de tests
```

### Instalación

```bash
npm install
```

### Configuración

1. Crear archivo `.env` con:
```
SPREADSHEET_ID=tu_id_de_google_sheets
```

2. Crear archivo `credentials.json` con las credenciales de Google Cloud

### Ejecución

```bash
node src/index.js
```

### Testing

Los tests cubren todas las funcionalidades del proyecto:

#### Parser Tests (9 tests)
- Validación de mensajes parseables
- Extracción de números (enteros y decimales)
- Extracción de conceptos/categorías
- Manejo de casos edge (mensajes sin conceptos, etc)
- Procesamiento de diferentes formatos numéricos

#### GoogleSheets Tests (9 tests)
- Función `appendExpense()` callable
- Manejo de diferentes montos
- Manejo de diferentes conceptos
- Registro múltiple de gastos
- Manejo de errores async
- Recuperación tras errores

#### WhatsApp Tests (8 tests)
- Existencia de métodos del cliente (`on`, `initialize`, `getChats`)
- Registro de eventos (`ready`, `message`)
- Return type de funciones async
- Callbacks para eventos

#### Index Tests (21 tests)
- Importación correcta de módulos
- Configuración del cliente WhatsApp
- Funciones async retornan Promises
- Registro de listeners de eventos
- Múltiples listeners simultáneos
- Verificación de mocks

#### Ejecución de Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura de código
npm run test:coverage
```

### Cómo Funciona

1. **Entrenamiento NLP**: Al iniciar, el bot entrena un modelo NLP con patrones de gastos
2. **Escucha de Mensajes**: Se conecta a WhatsApp y espera mensajes
3. **Análisis de Mensajes**: Detecta si un mensaje contiene un gasto
   - Formato esperado: "gaste X en concepto" o "anota X en concepto"
4. **Extracción de Datos**: 
   - Extrae el monto (X)
   - Extrae el concepto (categoría de gasto)
5. **Registro en Sheets**: Guarda automáticamente en Google Sheets con:
   - Fecha actual
   - Monto
   - Concepto/categoría

### Patrones Reconocidos

El bot entiende:
- "gaste 100 en comida"
- "anota 250 en supermercado"
- "gaste 50,50 en transporte"
- Y variaciones similares

### Intenciones NLP

- `gasto.register`: Registrar un nuevo gasto
- `gasto.query`: Consultar gasto en categoría
- `gasto.queryTotal`: Consultar total gastado
- `gasto.queryLastMonth`: Consultar gasto del mes anterior
- `greeting.hello`: Saludo

