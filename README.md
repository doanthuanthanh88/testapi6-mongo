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

### Use in yaml
```yaml
- Require:
    root: path_to_this_modules
    modules:
      - testapi6-mongo/dist/index.js
- Mongo:
    title: Mongo localhost
    connection: mongodb://localhost:49277
    config:
      db: user
      auth:
        user: user
        password: ******
      useUnifiedTopology: true
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