const User = require('../models/User');

// Mining interval times in milliseconds depending on tokens count
const miningIntervals = {
  1: 2 * 60 * 60 * 1000, // 2 hours
  2: 1 * 60 * 60 * 1000, // 1 hour
  3: 40 * 60 * 1000,     // 40 minutes
  4: 25 * 60 * 1000,     // 25 minutes
  5: 10 * 60 * 1000      // 10 minutes
};

const baseIncome = 0.7; // base income per mining cycle per token

async function autoMine() {
  try {
    // Find all users who have mining started
    const users = await User.find({ isMining: true });

    for (const user of users) {
      const tokenCount = user.tokens.length;

      if (tokenCount === 0) continue; // no tokens, no mining

      const interval = miningIntervals[tokenCount] || miningIntervals[1];

      const now = new Date();

      // Check if enough time passed since last mined
      if (!user.lastMined || now - user.lastMined >= interval) {
        // Calculate income: baseIncome * tokensCount * boostMultiplier
        const incomeToAdd = baseIncome * tokenCount * user.boostMultiplier;

        user.income += incomeToAdd;
        user.lastMined = now;

        await user.save();
        console.log(`Mined $${incomeToAdd.toFixed(2)} for user ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Auto mine job error:', error);
  }
}

// Function to start mining job every minute to check who needs mining
function startMiningJob() {
  setInterval(autoMine, 60 * 1000); // run every minute
}

module.exports = { startMiningJob };
