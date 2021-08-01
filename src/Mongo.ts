import chalk from 'chalk'
import { merge } from 'lodash'
import { Cursor, Db, MongoClient, ObjectID as OID } from 'mongodb'
import { parse } from 'querystring'
import { Tag } from 'testapi6/dist/components/Tag'

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
  static ignore = [...Tag.ignores, 'db']
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

  init(attrs: Mongo) {
    super.init(attrs)
    if (!this.config) this.config = { useUnifiedTopology: true } as any
    if (!this.queries) this.queries = []
  }

  private getConfigAutoParse(m: any[]) {
    const connection = 'mongodb://' + m[4]
    const config = {} as any
    let mydb: string
    if (m[1]) {
      config.auth = {
        user: m[2],
        password: m[3]
      }
    }
    mydb = m[5]
    return { connection, config, mydb }
  }

  async beforeExec() {
    await super.beforeExec()
    if (this.id && Tag.Cached.has(this.id)) {
      const obj = Tag.Cached.get(this.id) as any
      this._db = obj._db
      this.db = obj.db
      this.title = this.title || obj.title
    } else {
      let { db = undefined, ...config } = this.config
      const [uri = '', q = ''] = this.connection.split('?')
      const m = uri.match(/^mongodb:\/\/(([^:]+):?([^@]+)@)?([^\/]+)\/?(.*)/)
      if (!m) throw new Error('Connection is not valid')

      config = merge({}, parse(q), config)
      if (this.autoParse) {
        const { connection, config, mydb } = this.getConfigAutoParse(m)
        this.connection = connection
        merge(this.config, config)
        db = mydb
      }
      try {
        this._db = new MongoClient(this.connection, config as any)
        await this._db.connect()
      } catch {
        if (this.autoParse === undefined) {
          const { connection, config, mydb } = this.getConfigAutoParse(m)
          this.connection = connection
          merge(this.config, config)
          this._db = new MongoClient(this.connection, config as any)
          db = mydb
          await this._db.connect()
        }
      }
      this.db = this._db.db(db || undefined)
      if (this.id && !Tag.Cached.has(this.id)) {
        Tag.Cached.set(this.id, this)
      }
    }
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
        const $ = OID
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
          if (res.result && typeof res.result === 'object') {
            this.context.log(chalk.yellow('%s'), this.context.Utils.json(res.result))
          } else {
            this.context.log(chalk.yellow('%s'), res.result)
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
    await this._db?.close()
  }
}