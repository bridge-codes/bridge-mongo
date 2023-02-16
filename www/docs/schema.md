# Schema

In `bridge-mongo`, as in Mongoose, everything starts with a Schema. A schema defines the shape of the documents in a MongoDB collection, and serves as a blueprint for your data.

In addition to being compatible with Mongoose syntax, bridge-mongo provides advanced type inference for all of your schema properties. This means that you can define your schema with all of the same options as you would in Mongoose - including required fields, default values, timestamps config, and enums - and bridge-mongo will automatically infer the types of these properties for you.



## Defining your schema

```ts title='schema.ts'
import { Schema, ObjectId } from 'bridge-mongo';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  companyId: ObjectId,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] },
  settings: {
    isActive: Boolean,
    languages: [{type: String, enum: ['english', 'french']}]
  },
});
```

The permitted SchemaTypes are:
- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Decimal128
- Map (coming soon)

## Options

```ts
new Schema({..});
// or
new Schema({..}, options);
```

**Example**

```ts title='schema.ts'
import { Schema, ObjectId } from 'bridge-mongo';

const userSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true },
);
```


:::info
You can use any options available in Mongoose when defining your schema. However, please note that the only option that applies changes to the types inferred by bridge-mongo is the `timestamps` option.

If you would like to make use of any other Mongoose options and ensure proper integration with bridge-mongo, please feel free to reach out to us on our [Discord server](https://discord.com/invite/yxjrwm7Bfr).
:::