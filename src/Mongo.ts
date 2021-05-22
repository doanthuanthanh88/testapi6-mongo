import { Cursor, Db, MongoClient, ObjectID as OID } from 'mongodb'
import chalk from 'chalk'
import { Tag } from 'testapi6/dist/components/Tag'
import { parse } from 'querystring'
import { merge } from 'lodash'

/**
 * Mongo query
 */
export class MongoQuery {
  /** Query title */
  title?: string
  /** Query */
  query: string
  /** Query aggruments */
  args?: any[]
  /** 
   * Set data after execute done
   * 
   * ```yaml
   * string: set result to this var
   * object: set customize result to each properties in this var
   * ```
   */
  var: string | { [key: string]: any }
}

/**
 * Execute mongo query
 */
export class Mongo extends Tag {
  /** 
   * Mongo connection string 
   * 
   * Example: mongodb://localhost:49277
   * */
  connection: string
  autoParse: boolean
  /**
   * Mongo configuration
   * 
   * Ref: https://www.npmjs.com/package/ioMongo
   */
  config: Partial<{
    /** Mongo db */
    db: string
    auth?: {
      user: string
      password: string
    },
    useUnifiedTopology: boolean,
  }>
  /** Queries */
  queries: (MongoQuery | string)[]
  /** 
   * Set data after request done
   * 
   * ```yaml
   * string: set response data to this var
   * object: set customize response to each properties in this var
   * ```
   */
  var: string | { [key: string]: any }

  _db: MongoClient
  db: Db

  constructor(attrs: Mongo) {
    super(attrs)
    if (!this.config) this.config = { useUnifiedTopology: true } as any
    if (!this.queries) this.queries = []
  }

  async beforeExec() {
    await super.beforeExec()
    let { db = undefined, ...config } = this.config
    const [uri = '', q = ''] = this.connection.split('?')
    const m = uri.match(/^mongodb:\/\/(([^:]+):?([^@]+)@)?([^\/]+)\/?(.*)/)
    if (!m) throw new Error('Connection is not valid')

    config = merge({}, parse(q), config)
    if (this.autoParse) {
      this.connection = 'mongodb://' + m[4]
      if (m[1]) {
        config.auth = {
          user: m[2],
          password: m[3]
        }
      }
      db = m[5]
    }
    this._db = new MongoClient(this.connection, config as any)
    await this._db.connect()
    this.db = this._db.db(db || undefined)
  }

  async exec() {
    if (!this.slient && this.title) this.context.group(chalk.green('%s'), this.title)
    try {
      for (const q of this.queries) {
        let query: MongoQuery
        if (typeof q === 'string') {
          query = {
            query: q,
            args: []
          } as MongoQuery
        } else {
          query = q as MongoQuery
          if (!query.args) query.args = []
        }
        if (!this.slient && query.title) this.context.group('MongoQuery: %s', query.title)
        const rd = Math.random().toString()
        const rd1 = Math.random().toString()
        // @ts-ignore
        const arrs = query.args || []
        // @ts-ignore
        const db = this.db
        db['col'] = db.collection
        db['cols'] = db.collections
        db['drop'] = db.dropDatabase
        db['dropCol'] = db.dropCollection
        var i = 0
        const func = query.query
          .split('\\?\\?').join(rd).replace(/(\?\?)/g, () => `{projection: arrs[${rd1}]}`).split(rd).join('\\?')
          .split('\\?').join(rd).replace(/(\?)/g, () => `arrs[${rd1}]`).split(rd).join('\\?')
          .replace(new RegExp(rd1, 'g'), () => `${i++}`)
        const begin = Date.now()
        let t: any
        // @ts-ignore
        const ObjectID = OID
        // @ts-ignore
        const ObjectId = OID
        eval(`t = ${func}`)
        let rs = await t
        if (rs instanceof Cursor) {
          rs = await rs.toArray()
        }
        const res = {
          time: Date.now() - begin,
          result: !rs ? rs : typeof rs === 'object' ? JSON.parse(JSON.stringify(rs)) : rs
        }
        if (!this.slient) {
          this.context.log(`${chalk.green('%s')} ${chalk.gray('- %dms')}`, query.query, res.time)
          if (res.result) {
            this.context.log(chalk.yellow('%s'), this.context.Utils.json(res.result))
          }
        }
        if (query.var) this.setVar(query.var, res.result)
        if (!this.slient && query.title) this.context.groupEnd()
      }
    } finally {
      if (!this.slient && this.title) this.context.groupEnd()
    }
  }

  async dispose() {
    await this._db.close()
  }
}