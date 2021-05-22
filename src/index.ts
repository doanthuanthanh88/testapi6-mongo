export { Mongo } from './Mongo'

// import { Mongo } from './Mongo'

// async function main() {
//   const m = new Mongo({
//     connection: 'mongodb://gapo-periodic-survey:Zk9O1QzyQ7DNRocXTJSiLbuWa3C4gcZn@10.148.0.14:27017/gapo-periodic-survey',
//     autoParse: false,
//     // config: {
//     //   db: 'gapo-periodic-survey',
//     //   auth: {
//     //     user: 'gapo-periodic-survey',
//     //     password: 'Zk9O1QzyQ7DNRocXTJSiLbuWa3C4gcZn'
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
