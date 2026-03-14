const prisma = require('../lib/prisma');

/**
 * Recalculates the streak for a given habit.
 * Walks backwards from today counting consecutive days with completed logs.
 * Updates both currentStreak and longestStreak.
 */
async function recalculateStreak(habitId) {
  // Get all completed logs for this habit, ordered by date descending
  const logs = await prisma.habitLog.findMany({
    where: { habitId, completed: true },
    orderBy: { loggedDate: 'desc' },
    select: { loggedDate: true },
  });

  if (logs.length === 0) {
    await prisma.streak.upsert({
      where: { habitId },
      update: { currentStreak: 0, lastCompleted: null },
      create: { habitId, currentStreak: 0, longestStreak: 0, lastCompleted: null },
    });
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert to date strings for comparison (YYYY-MM-DD)
  const toDateStr = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const today = new Date();
  const todayStr = toDateStr(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateStr(yesterday);

  const logDates = logs.map((l) => toDateStr(l.loggedDate));

  // Check if the most recent log is today or yesterday
  // If neither, streak is broken → currentStreak = 0
  let currentStreak = 0;

  if (logDates[0] === todayStr || logDates[0] === yesterdayStr) {
    currentStreak = 1;

    // Walk backwards counting consecutive days
    for (let i = 1; i < logDates.length; i++) {
      const prevDate = new Date(logDates[i - 1]);
      const currDate = new Date(logDates[i]);
      const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Get existing streak to preserve longestStreak
  const existing = await prisma.streak.findUnique({ where: { habitId } });
  const prevLongest = existing?.longestStreak || 0;
  const longestStreak = Math.max(prevLongest, currentStreak);
  const lastCompleted = new Date(logDates[0]);

  await prisma.streak.upsert({
    where: { habitId },
    update: { currentStreak, longestStreak, lastCompleted },
    create: { habitId, currentStreak, longestStreak, lastCompleted },
  });

  return { currentStreak, longestStreak };
}

module.exports = { recalculateStreak };
