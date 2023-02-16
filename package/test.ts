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
  const user = await DB.user.create({ name: 'Nab' });
  //     ^?
  const post = await DB.post.findOne({ userId: user._id });
  //      ^?
  const users = await DB.user.find({ age: { $gt: 21 } }, { name: 1 });
  //      ^?
  // Fetching all users that have created post with their post
  const creators = await DB.user
    .aggregate()
    .project({ name: 1 })
    .lookup({ from: 'posts', localField: '_id', foreignField: 'userId' })
    .match({ 'posts.0': { $exists: true } })
    .exec();

  console.log(creators);

  // Fetching posts
  const posts = await DB.post
    .aggregate()
    .project({ text: 1, createdAt: 1 })
    // .match({ createdAt: { $gt: new Date() } })
    .lookup({ from: 'posts', let: { userId: '$_id' } }, (post, { userId }) =>
      post.match({ $expr: { $eq: ['$userId', userId] } }).project({ text: 1 }),
    )
    .match({ 'posts.0': { $exists: true } })
    .exec();

  console.log(posts);

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
