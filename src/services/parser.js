const { Nlp } = require('@nlpjs/nlp');
const { containerBootstrap } = require('@nlpjs/core');
const { LangEs } = require('@nlpjs/lang-es');

const container = containerBootstrap();
container.use(LangEs);

const manager = new Nlp({
  container,
  languages: ['es'],
  autoSave: false,
  autoLoad: false,
  forceNER: true
});

async function trainNLP() {
  manager.addDocument('es', 'Hola', 'greeting.hello');
  manager.addDocument('es', '¿Cómo estás?', 'greeting.hello');
  manager.addDocument('es', 'Hola, ¿qué tal?', 'greeting.hello');

  manager.addDocument('es', 'gaste %number% en %concepto%','gasto.register');
  manager.addDocument('es', 'anota %number% en %concepto%', 'gasto.register');
  manager.addDocument('es', '%concepto% %number%', 'gasto.register');

  const gastoRegisterSamples = [
    'gaste 100 en comida',
    'gaste 250 en supermercado',
    'gaste 50 en transporte',
    'anota 75 en farmacia',
    'anota 1200 en alquiler',
    'anota 30 en entretenimiento',
    'gaste 450 en compras',
  ];
  gastoRegisterSamples.forEach(example =>
    manager.addDocument('es', example, 'gasto.register')
  );

  manager.addDocument('es', '¿Cuánto gasté en %concepto%?', 'gasto.query');
  manager.addDocument('es', '¿Cuánto gasté en total?', 'gasto.queryTotal');
  manager.addDocument('es', '¿Cuánto gasté en %concepto% el mes pasado?', 'gasto.queryLastMonth');

    await manager.train();
    //await manager.save();

}

async function parseMessage(msg) {
  const response = await manager.process('es', msg);

  // Validar que el NLP entienda la intención del mensaje
  if (response.intent === 'None') {
    console.log('No se pudo entender el mensaje. Intenta: Gaste 100 en comida');
    return null;
  }

  // Extraer la entidad de cantidad (número) del NLP
  let amountEntity = null;
  if (Array.isArray(response.entities)) {
    amountEntity = response.entities.find((e) => e.entity === 'number');
  }

  // Extraer número directamente del texto como fallback
  const amountFromText = (() => {
    if (!msg) return null;
    const numberMatch = msg.match(/-?\d+(?:[.,]\d+)?/);
    return numberMatch ? parseFloat(numberMatch[0].replace(',', '.')) : null;
  })();

  // Extraer el concepto (palabra después de "en") del mensaje
  const concept = response.utterance.match(/en\s+(\w+)/)?.[1] || "No se identifico el concepto";

  return {
    intent: response.intent,
    amount: amountEntity?.resolution.value ?? amountFromText,
    msg: concept,
    score: response.score
  }
}

module.exports = {
  trainNLP,
  parseMessage
};
