const prisma = require('../lib/prisma');
const { recalculateStreak } = require('../services/streakService');

/**
 * GET /api/logs?date=YYYY-MM-DD
 * Get all habit logs for the current user on a specific date.
 * If no date is provided, defaults to today.
 */
const getLogsByDate = async (req, res, next) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const targetDate = new Date(dateStr + 'T00:00:00.000Z');

    // Get all habits for user with their log for the given date
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id },
      include: {
        habitLogs: {
          where: { loggedDate: targetDate },
        },
        streak: {
          select: { currentStreak: true, longestStreak: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten the response
    const result = habits.map((habit) => ({
      habitId: habit.id,
      title: habit.title,
      icon: habit.icon,
      color: habit.color,
      category: habit.category,
      frequency: habit.frequency,
      completed: habit.habitLogs.length > 0 ? habit.habitLogs[0].completed : false,
      durationS: habit.habitLogs.length > 0 ? habit.habitLogs[0].durationS : null,
      logId: habit.habitLogs.length > 0 ? habit.habitLogs[0].id : null,
      streak: habit.streak,
    }));

    res.json({ date: dateStr, logs: result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/logs
 * Log a habit as completed (or toggle completion).
 * Body: { habitId, date? (YYYY-MM-DD), completed? (boolean), durationS? }
 * Automatically recalculates the streak after logging.
 */
const createLog = async (req, res, next) => {
  try {
    const { habitId, date, completed = true, durationS } = req.body;

    if (!habitId) {
      return res.status(400).json({ error: 'Validation Error', message: 'habitId is required' });
    }

    // Verify the habit belongs to the user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: req.user.id },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });
    }

    const dateStr = date || new Date().toISOString().split('T')[0];
    const loggedDate = new Date(dateStr + 'T00:00:00.000Z');

    // Upsert: create or update the log for this habit + date
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_loggedDate: { habitId, loggedDate },
      },
      update: {
        completed,
        durationS: durationS || null,
      },
      create: {
        habitId,
        userId: req.user.id,
        loggedDate,
        completed,
        durationS: durationS || null,
      },
    });

    // Recalculate streak
    const streak = await recalculateStreak(habitId);

    res.status(200).json({
      message: completed ? 'Habit logged as completed' : 'Habit log updated',
      log,
      streak,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogsByDate, createLog };
