# Model

To use your schema definition, you need to convert your schema into a model that can be used by bridge-mongo. This can be done easily using the createDB function provided by the framework.

Simply pass an object to createDB where each key represents the name of the model you wish to create and each value represents the schema for that model. Once you have created your models, you can start interacting with your MongoDB database with total type safety and the guidance of TypeScript.

```ts
import { createDB } from 'bridge-mongo';

const DB = createDB({
    [CollectionName]: Schema
})
```

## Example

```ts twoslash title='schema.ts' 
import { Schema, ObjectId } from 'bridge-mongo';

const userSchema = new Schema(
  {
    name: String,
  },
);

const postSchema = new Schema(
  {
    text: String,
    userId: ObjectId
  },
  { timestamps: true },
);

// ---cut---
import { createDB } from 'bridge-mongo';

const DB = createDB({
    User: userSchema,
    Post: postSchema
})

// OR

const { user, post } = createDB({
    User: userSchema,
    Post: postSchema
})

```
 