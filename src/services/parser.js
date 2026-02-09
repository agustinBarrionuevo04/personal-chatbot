const {NLPManager} = require('@nlpjs/nlp');

const manager = new NLPManager({ languages: ['es'] });

async function trainNLP() {
  manager.addDocument('es', 'Hola', 'greeting.hello');
  manager.addDocument('es', 'gaste %number% en %concepto%','gasto.register');
  manager.addDocument('es', 'anota %number% en %concepto%', 'gasto.register');
  manager.addDocument('es', '%concepto% %number%', 'gasto.register');

  manager.addDocument('es', '¿Cuánto gasté en %concepto%?', 'gasto.query');
  manager.addDocument('es', '¿Cuánto gasté en total?', 'gasto.queryTotal');
  manager.addDocument('es', '¿Cuánto gasté en %concepto% el mes pasado?', 'gasto.queryLastMonth');

    await manager.train();
    manager.save();

}

async function parseMessage(msg) {
  const response = await manager.process('es', msg);

  if (response.intent === 'None') {
    print('No se pudo entender el mensaje. Intenta: Gaste 100 en comida');
    return null;
  }

  const amoutEntity = response.entities.find(e => e.entity === 'number');

  return {
    intent: response.intent,
    amount: amountEntity ? amountEntity.resolution.value : null,
    msg: response.utterance,
    score: response.score
  }
}

module.exports = {
  trainNLP,
  parseMessage
};