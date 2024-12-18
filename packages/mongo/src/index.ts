import { deepMerge } from '@faasjs/deep_merge'
import type { MountData, Next, Plugin } from '@faasjs/func'
/**
 * FaasJS's mongodb plugin.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/mongo.svg)](https://github.com/faasjs/faasjs/blob/main/packages/mongo/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/mongo.svg)](https://www.npmjs.com/package/@faasjs/mongo)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/mongo
 * ```
 *
 * @packageDocumentation
 */
import {
  type Callback,
  type Collection,
  type CollectionOptions,
  type Db,
  MongoClient,
  type MongoClientOptions,
  ObjectId,
} from 'mongodb'

export { ObjectId }

export interface MongoConfig extends MongoClientOptions {
  url?: string
  database?: string
}

export class Mongo implements Plugin {
  public readonly type = 'mongo'
  public readonly name: string = 'mongo'
  public config: MongoConfig
  public client: MongoClient
  public db: Db
  public collection: <TSchema = any>(
    name: string,
    options?: CollectionOptions,
    callback?: Callback<Collection<TSchema>>
  ) => Collection<TSchema>

  constructor(config?: {
    name?: string
    config?: MongoConfig
  }) {
    if (config) {
      this.name = config.name || this.type
      this.config = config.config || Object.create(null)
    } else {
      this.name = this.type
      this.config = Object.create(null)
    }
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (typeof (this.config as any)[key] === 'undefined')
          (this.config as any)[key] = value
      }

    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        data.config.plugins[this.name || this.type].config,
        this.config
      )

    data.logger.debug('connect: %j', this.config)

    const url = this.config.url
    delete this.config.url

    const database = this.config.database
    delete this.config.database

    this.client = await MongoClient.connect(url, this.config)

    if (database) {
      this.db = this.client.db(database)
      this.collection = this.db.collection.bind(this.db)
    }

    await next()
  }
}
