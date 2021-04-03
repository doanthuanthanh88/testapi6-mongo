testapi6-mongo / [Exports](modules.md)

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
    connection: mongo://localhost:6379
    commands: 
      - title: Get users
        command: 
          - get
          - users
        var: rs
```
