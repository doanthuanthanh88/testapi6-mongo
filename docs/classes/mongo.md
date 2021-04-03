[testapi6-mongo](../README.md) / [Exports](../modules.md) / Mongo

# Class: Mongo

Execute mongo query

## Hierarchy

* *Tag*

  ↳ **Mongo**

## Table of contents

### Constructors

- [constructor](mongo.md#constructor)

### Properties

- [config](mongo.md#config)
- [connection](mongo.md#connection)
- [queries](mongo.md#queries)
- [var](mongo.md#var)

## Constructors

### constructor

\+ **new Mongo**(`attrs`: [*Mongo*](mongo.md)): [*Mongo*](mongo.md)

#### Parameters:

Name | Type |
:------ | :------ |
`attrs` | [*Mongo*](mongo.md) |

**Returns:** [*Mongo*](mongo.md)

Overrides: void

## Properties

### config

• **config**: *Partial*<{ `db`: *string*  }\>

Mongo configuration

Ref: https://www.npmjs.com/package/ioMongo

___

### connection

• **connection**: *string*

Mongo connection string

Example: mongodb://localhost:49277

___

### queries

• **queries**: (*string* \| [*MongoQuery*](mongoquery.md))[]

Queries

___

### var

• **var**: *string* \| { [key: string]: *any*;  }

Set data after request done

```yaml
string: set response data to this var
object: set customize response to each properties in this var
```
