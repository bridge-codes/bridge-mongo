# Update Functions

The `filter` object is the same as in Mongoose, so you can write complex filters and benefit from type safety throughout the process.

The `updateQuery` is the same as in Mongoose.

By default, all the update functions in Bridge-mongo return **lean results**. This means that the documents are plain JavaScript objects instead of full Mongoose documents, resulting in faster queries and less memory usage.


## Model.findOneAndUpdate()

Model.findOneAndUpdate() is used to update the first document that match a specified filter.

```ts
Model.findOneAndUpdate(filter, updateQuery)
// or
Model.findOneAndUpdate(filter, updateQuery, options)
```

### Options

```ts
{
    projection?: Proj; // ex: { name: 1 }
    session?: ClientSession; // from await conn.startSession()
    returnDocument?: 'before' | 'after';
    new?: boolean;
    sort?: SortQuery<FullModelI>;
    timestamps?: boolean;
    overwrite?: boolean;
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
    const user = await DB.user.findOneAndUpdate({ job: 'designer' }, { age: 21 });
    if (isError(user)) return

    const post = await DB.post.findOneAndUpdate({ userId: user._id }, { likes: 12 }, { projection: { text: 1 } });

    if (isError(post)) console.log(post)
    //                              ^?
    else console.log(post)
    //                ^?
}
```

## Model.findByIdAndUpdate()

Model.findByIdAndUpdate() is used to update the first document that match the objectId given.

```ts
Model.findByIdAndUpdate(ObjectId, updateQuery)
// or
Model.findByIdAndUpdate(ObjectId, updateQuery, options)
```

### Options

```ts
{
    projection?: Proj; // ex: { name: 1 }
    session?: ClientSession; // from await conn.startSession()
    returnDocument?: 'before' | 'after';
    new?: boolean;
    sort?: SortQuery<FullModelI>;
    timestamps?: boolean;
    overwrite?: boolean;
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

    const user = await DB.user.findByIdAndUpdate(post.userId, { age: 12 }, { projection: { age: 1 } });

    if (isError(user)) console.log(user);
    //                              ^?
    else console.log(user);
    //                ^?
}
```



