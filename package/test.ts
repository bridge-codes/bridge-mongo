import { createDB, Schema, mongoose, isError } from './source';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  test: mongoose.Types.ObjectId,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] },
  settings: {
    isActive: Boolean,
    test: {
      type: Boolean,
    },
  },
});

// Defining a Post Schema
const postSchema = new Schema(
  {
    text: { type: String, required: true },
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

async () => {
  const user = await DB.user.create({ name: 'ui', age: 89 });

  if (isError(user)) return;

  const post = await DB.post.findOne({ userId: user._id });

  const res = await DB.post
    .aggregate()
    .lookup({ from: 'users', let: { userId: '$userId' }, as: 'creator' }, (user, { userId }) =>
      user
        .project({ _id: 1 })
        .match({ $expr: { $eq: ['$_id', userId] } })
        .limit(1),
    )
    .unwind('$creator')
    .unset('userId')
    .exec();

  console.log(res);
};
