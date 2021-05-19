export { Mongo } from './Mongo'

// import { Mongo } from './Mongo'

// async function main() {
//   const m = new Mongo({
//     connection: 'mongodb://root:example@localhost:49277/periodic-survey',
//     // config: {
//     //   db: 'periodic-survey',
//     //   auth: {
//     //     user: 'root',
//     //     password: 'example'
//     //   },
//     //   useUnifiedTopology: true
//     // },
//     queries: [
//       // 'db.listCollections()',
//       { query: 'db.collection("QuestionCollection").find(?, ??)', args: [{}, { _id: 1 }] },
//       // 'db.col("Answer").find()'
//       // 'db.drop()'
//     ]
//   } as Mongo)
//   m.prepare()
//   await m.beforeExec()
//   await m.exec()
// }

// setTimeout(() => main(), 500)
