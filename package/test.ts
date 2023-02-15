import { createDB, Schema, mongoose } from './source';
import { FlatPath, ExtractFromPath } from './source/utils';

const userSchema = new Schema({
  name: { type: String, required: true },
  isActive: Boolean,
  testId: mongoose.Types.ObjectId,
  age: Number,
  foo: {
    age: Number,
    nom: { type: String, required: true },
  },
});

const testSchema = new Schema(
  {
    sf: { type: Number, required: true },
    ahoui: [String],
    oooh: {
      type: [String],
      required: true,
    },
    df: { type: Date, default: new Date(), unique: true },
    lolilo: String,
    buffer: Buffer,
    age: Boolean,
    // oh: Object,
    normal: {
      vla: String,
    },
    test: {
      type: {
        ahoui: { type: Number },
        ahnon: String,
      },
      //   required: true,
    },
  },
  { timestamps: true },
);

const DB = createDB({
  User: userSchema,
  Test: testSchema,
});

async () => {
  const rese = DB.user.modelInterface;
  const dbi = DB.test.DBI;

  const u = await DB.user.find({ 'foo.age': 68 });

  const ress = await DB.test.aggregate().project({ age: 1 }).project({ age: 1 }).exec();

  DB.test.findOneAndUpdate({}, {});

  const ajsd = await DB.test
    .aggregate()
    .match({
      lolilo: { $in: ['dfd'] },
      $expr: { $gte: ['$_id', '$$df'] },
      sf: { $mod: [7, 79] },
      oooh: 'edfdf',
      df: new Date(),
    })
    .project({ test: { ahnon: 1 } })
    .paginate(0, 1);

  const dsf = await DB.test.findOne({}, { age: 1, buffer: 1 });

  const ex1 = DB.user
    .aggregate()
    .project({ age: 1 })
    // .lookup({ from: 'users', as: 'usr', localField: '_id', foreignField: 'testId' })
    // .lookup({ from: 'users', as: 'usr', let: { userId: '$_id' } }, (user) =>
    //   user.project({ age: 1 }),
    // )
    // .unwind({ path: '$usr', preserveNullAndEmptyArrays: true, includeArrayIndex: 'index' })
    // // .project({ usr: { age: 1 } })
    .exec();

  const res2 = await DB.user
    .aggregate()
    .project({ age: 1 })

    .lookup({ from: 'tests', let: { userId: '$age' } }, (test) => test.project({ lolilo: 1 }))
    .exec();

  const ess = DB.user.mongooseModel.create({ name: 'YO' }).then(async (res) => {
    res.name = 'NON';

    await res.save();
  });
};
