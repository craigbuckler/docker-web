/*
Quiz database logic
*/

'use strict';

const

  maxQuestions = 300,
  maxApiFetch = 50,
  maxApiCalls = 10,

  // MongoDB connect
  mongo = require('mongodb'),

  client = new mongo.MongoClient(
    `mongodb://${ process.env.MONGO_USERNAME }:${ process.env.MONGO_PASSWORD }@${ process.env.MONGO_HOST }:${ process.env.MONGO_PORT }/`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

// database connection objects
let db, quiz;

// connect to MongoDB database
(async () => {

  try {

    await client.connect();
    db = client.db( process.env.MONGO_DB );

    // quiz collection
    quiz = db.collection('quiz');

    // initialize
    if (!await init()) {
      throw 'no questions in database';
    }

  }
  catch (err) {
    console.log('database error', err);
  }

})();


// initialize database
async function init() {

  // question count
  let qCount = await quiz.countDocuments();
  if (qCount >= maxQuestions) return qCount;

  console.log('initializing quiz database...');

  // create indexes
  if (!qCount) {

    await quiz.createIndexes([
      { key: { category: 1 }},
      { key: { question: 1 } },
      { key: { used: 1 } }
    ]);

  }

  // fetch random questions from opentdb.com
  const
    fetch = require('node-fetch'),
    lib = require('./lib'),
    batch = quiz.initializeUnorderedBulkOp(),

    maxReq = Math.min(maxApiFetch, maxQuestions - qCount),
    quizApi = `https://opentdb.com/api.php?type=multiple&amount=${ maxReq }`;

  (await Promise.allSettled(

    // make multiple API calls
    Array( Math.min(maxApiCalls, Math.ceil((maxQuestions - qCount) / maxReq)) )
      .fill(quizApi)
      .map((u, i) => fetch(`${u}#${i}`))

  )
    .then(
      // parse JSON
      response => Promise.allSettled(
        response.map(res => res.value && res.value.json())
      )
    )
    .then(
      // extract questions
      json => json.map(j => j && j.value && j.value.results || [])
    ))
    .flat()
    .forEach(q => {

      // format each question
      let
        correct = lib.cleanString(q.correct_answer),
        newQ = {
          category: lib.cleanString(q.category),
          question: lib.cleanString(q.question),
          answers:  q.incorrect_answers.map(i => lib.cleanString(i)).concat(correct).sort()
        };

      newQ.correct = newQ.answers.indexOf(correct);

      // database insert
      batch
        .find({ question: q.question })
        .upsert()
        .update({ $set: newQ });

    });

  // update database
  const
    dbUpdate = await batch.execute(),
    qAdded = dbUpdate.result.nUpserted;

  qCount += qAdded;

  console.log(`${ qAdded } questions added`);
  console.log(`${ qCount } questions available`);

  return qCount;

}


// get next question
module.exports.getQuestion = async () => {

  const
    nextQ = await quiz.findOneAndUpdate(
      {},
      { $inc: { used: 1 }},
      {
        sort: { used: 1 },
        projection: { _id: 0, category: 1, question: 1, answers: 1, correct: 1 }
      }
    );

  return (nextQ && nextQ.ok && nextQ.value) || null;

};
