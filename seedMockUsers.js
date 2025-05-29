// seedMockUsers.js
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const mockUsers = [
  {
    username: 'RocketMiner',
    email: 'rocket@mock.com',
    password: 'hashedpass1', // use a hashed password
    totalIncome: 180.50,
  },
  {
    username: 'SatoshiVibes',
    email: 'satoshi@mock.com',
    password: 'hashedpass2',
    totalIncome: 159.20,
  },
  {
    username: 'ChainBoost',
    email: 'chain@mock.com',
    password: 'hashedpass3',
    totalIncome: 142.75,
  },
];

async function seedUsers() {
  try {
    for (const user of mockUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`Inserted mock user: ${user.username}`);
      }
    }
    console.log('Done.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
