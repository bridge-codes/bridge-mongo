# Create Functions

## Model.create()

This function works in the same way as the create() function in Mongoose. When calling Model.create(), you provide an object that represents the data you want to create in the database. This object should follow the schema of the model you are creating the document for.

By default, the documents created using Model.create() will be returned as plain JavaScript objects by calling the toJSON() method. This is because bridge-mongo uses the lean() function under the hood, which optimizes database queries by returning plain JavaScript objects instead of Mongoose documents.

```ts
Model.create({...modelData})
// or
Model.create({...modelData}, options)
```

**Unique fields**

MongoDB can return an error if a document with unique fields already exists in the database. Bridge-mongo automatically handles this error and returns a typed response for your query, but only if your schema has unique fields defined.



### Options

```ts
{
    session?: ClientSession; // from await conn.startSession()
}
``` 

### Example


<details>
  <summary>Schemas Definition</summary>

```ts
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer']  },
  settings: {
    isActive: Boolean,
  },
});

// Defining a Post Schema
const postSchema = new Schema(
  {
    text: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, req: true },
    likes: Number,
  },
  { timestamps: true },
);

// The keys correspond to the model Name
const DB = createDB({
  User: userSchema,
  Post: postSchema,
});
``` 

</details> 


```ts twoslash
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer']  },
  settings: {
    isActive: Boolean,
  },
});

// Defining a Post Schema
const postSchema = new Schema(
  {
    text: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, req: true },
    likes: Number,
  },
  { timestamps: true },
);

// The keys correspond to the model Name
const DB = createDB({
  User: userSchema,
  Post: postSchema,
});
// ---cut---
async () => {
    const user = await DB.user.create({ name: 'Nab' })
    //     ^? 
    const post = await DB.post.create({ text: 'Salut', userId: user._id })
    //     ^?
}
```

:::tip

To easily handle errors, use the [isError](errors) function from bridge-mongo.

:::



<!-- | Key          | Value                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `session`    | `ClientSession` from `await conn.startSession()`                                                               | -->