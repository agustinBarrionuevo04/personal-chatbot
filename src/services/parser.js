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