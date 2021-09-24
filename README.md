# testapi6-mongo
Execute mongo query

# Features
- Execute mongo query

> Read [document details](./docs/modules.md)

# How to use
### Installation
```javascript
// install via npm
npm install -g testapi6-mongo

// install via yarn
yarn global add testapi6-mongo
```

# Configuration
Read [mongodb](https://www.npmjs.com/package/mongodb)

### Use in yaml
```yaml
- testapi6-mongo.Mongo:
    title: Mongo localhost
    connection: mongodb://user:******@127.0.0.1:27017/database_name
    queries: 
      - db.drop()
      - title: Show tables
        query: db.listCollections()
      - title: Get users
        query: db.col('User').find(?, ??)
        args:
          - name: 'thanh' # Replace data to ?
          - username: 1   # Replace data to ??, its auto convert to { projection: ? }
            age: 1
        var: users
```