[testapi6-mongo](../README.md) / [Exports](../modules.md) / MongoQuery

# Class: MongoQuery

Mongo query

## Table of contents

### Constructors

- [constructor](mongoquery.md#constructor)

### Properties

- [args](mongoquery.md#args)
- [query](mongoquery.md#query)
- [title](mongoquery.md#title)
- [var](mongoquery.md#var)

## Constructors

### constructor

\+ **new MongoQuery**(): [*MongoQuery*](mongoquery.md)

**Returns:** [*MongoQuery*](mongoquery.md)

## Properties

### args

• `Optional` **args**: *any*[]

Query aggruments

___

### query

• **query**: *string*

Query

___

### title

• `Optional` **title**: *string*

Query title

___

### var

• **var**: *string* \| { [key: string]: *any*;  }

Set data after execute done

```yaml
string: set result to this var
object: set customize result to each properties in this var
```
