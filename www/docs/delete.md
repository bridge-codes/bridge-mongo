# Delete Functions

The `filter` object is the same as in Mongoose, so you can write complex filters and benefit from type safety throughout the process.


## Model.findOneAndDelete()

Model.findOneAndDelete() is used to delete the first document that match a specified filter.

```ts
Model.findOneAndDelete(filter)
// or
Model.findOneAndDelete(filter, options)
```

### Options

```ts
{
    projection?: Proj; // ex: { name: 1 }
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
import { isError } from 'bridge-mongo';

async () => {
    const user = await DB.user.findOneAndDelete({ job: 'designer' });
    //     ^? 
}
```

## Model.findByIdAndDelete()

Model.findByIdAndDelete() is used to delete the first document that match the objectId given.

```ts
Model.findByIdAndDelete(ObjectId)
// or
Model.findByIdAndDelete(ObjectId, options)
```

### Options

```ts
{
    projection?: Proj; // ex: { name: 1 }
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
import { isError } from 'bridge-mongo';

async () => {
    const post = await DB.post.findOne({}, { userId: 1 });
    if (isError(post) || !post.userId) return

    const user = await DB.user.findByIdAndDelete(post.userId, { projection: { age: 1 } });

    if (isError(user)) console.log(user);
    //                              ^?
    else console.log(user);
    //                ^?
}
```



