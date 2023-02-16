# Schema

In `bridge-mongo`, as in Mongoose, everything starts with a Schema. A schema defines the shape of the documents in a MongoDB collection, and serves as a blueprint for your data.

In addition to being compatible with Mongoose syntax, bridge-mongo provides advanced type inference for all of your schema properties. This means that you can define your schema with all of the same options as you would in Mongoose - including required fields, default values, timestamps config, and enums - and bridge-mongo will automatically infer the types of these properties for you.



## Defining your schema

```ts twoslash title='schema.ts'
// import { Schema, mongoose } from 'bridge
```

## Options