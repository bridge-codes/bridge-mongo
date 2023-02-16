# Connection

Connecting to your MongoDB database using bridge-mongo is just as easy as it is with Mongoose. In fact, you can import `mongoose` directly from bridge-mongo and use its connect function to connect to your database.

```ts title='index.ts'
import { mongoose } from 'bridge-mongo';

const launch = async () => {
    await mongoose.connect('Your MongoDB URL here');

    console.log('Connected!')
}

launch();
```
