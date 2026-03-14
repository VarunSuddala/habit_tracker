const prisma = require('../lib/prisma');

/**
 * GET /api/analytics/weekly
 * Returns daily completion counts for the current week (Mon–Sun).
 */
const getWeekly = async (req, res, next) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get total habits count for this user
    const totalHabits = await prisma.habit.count({
      where: { userId: req.user.id },
    });

    // Get completed logs for the week
    const logs = await prisma.habitLog.findMany({
      where: {
        userId: req.user.id,
        completed: true,
        loggedDate: { gte: startOfWeek, lte: endOfWeek },
      },
      select: { loggedDate: true },
    });

    // Group by day
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayCounts = days.map((day, index) => {
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + index);
      const targetStr = targetDate.toISOString().split('T')[0];

      const count = logs.filter((log) => {
        const logStr = new Date(log.loggedDate).toISOString().split('T')[0];
        return logStr === targetStr;
      }).length;

      return { day, date: targetStr, completed: count, total: totalHabits };
    });

    // Overall completion percentage for the week
    const totalCompleted = logs.length;
    const totalPossible = totalHabits * 7;
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    res.json({ week: dayCounts, completionRate, totalCompleted, totalPossible });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/monthly
 * Returns daily completion data for the current month.
 */
const getMonthly = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalHabits = await prisma.habit.count({
      where: { userId: req.user.id },
    });

    const logs = await prisma.habitLog.findMany({
      where: {
        userId: req.user.id,
        completed: true,
        loggedDate: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { loggedDate: true },
    });

    // Build daily data for the entire month
    const daysInMonth = endOfMonth.getDate();
    const dailyData = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth(), d);
      const targetStr = targetDate.toISOString().split('T')[0];

      const count = logs.filter((log) => {
        const logStr = new Date(log.loggedDate).toISOString().split('T')[0];
        return logStr === targetStr;
      }).length;

      const percentage = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;

      dailyData.push({ date: targetStr, day: d, completed: count, total: totalHabits, percentage });
    }

    const totalCompleted = logs.length;
    const totalPossible = totalHabits * daysInMonth;
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    res.json({
      month: today.toLocaleString('default', { month: 'long' }),
      year: today.getFullYear(),
      days: dailyData,
      completionRate,
      totalCompleted,
      totalPossible,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/heatmap
 * Returns day-level completion data for the past 365 days.
 * Used to render a GitHub-style contribution heatmap.
 */
const getHeatmap = async (req, res, next) => {
  try {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const totalHabits = await prisma.habit.count({
      where: { userId: req.user.id },
    });

    const logs = await prisma.habitLog.findMany({
      where: {
        userId: req.user.id,
        completed: true,
        loggedDate: { gte: oneYearAgo, lte: today },
      },
      select: { loggedDate: true },
    });

    // Build a map of date → count
    const dateMap = {};
    logs.forEach((log) => {
      const dateStr = new Date(log.loggedDate).toISOString().split('T')[0];
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    // Build array for every day in the past year
    const heatmapData = [];
    const current = new Date(oneYearAgo);
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      const count = dateMap[dateStr] || 0;
      const level = totalHabits > 0 ? Math.min(4, Math.ceil((count / totalHabits) * 4)) : 0;

      heatmapData.push({ date: dateStr, count, level });
      current.setDate(current.getDate() + 1);
    }

    res.json({ heatmap: heatmapData, totalHabits });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeekly, getMonthly, getHeatmap };
