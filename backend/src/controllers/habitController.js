const prisma = require('../lib/prisma');

/**
 * GET /api/habits
 * Get all habits for the current user.
 */
const getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id },
      include: {
        streak: {
          select: { currentStreak: true, longestStreak: true, lastCompleted: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ habits });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/habits
 * Create a new habit for the current user.
 * Also initializes a streak record.
 */
const createHabit = async (req, res, next) => {
  try {
    const { title, description, color, icon, frequency, category } = req.body;

    const habit = await prisma.habit.create({
      data: {
        userId: req.user.id,
        title,
        description: description || null,
        color: color || null,
        icon: icon || null,
        frequency: frequency || 'daily',
        category: category || null,
      },
    });

    // Initialize streak record for the new habit
    await prisma.streak.create({
      data: {
        habitId: habit.id,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    const habitWithStreak = await prisma.habit.findUnique({
      where: { id: habit.id },
      include: { streak: true },
    });

    res.status(201).json({ message: 'Habit created successfully', habit: habitWithStreak });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/habits/:id
 * Update an existing habit.
 */
const updateHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, color, icon, frequency, category } = req.body;

    // Verify ownership
    const existing = await prisma.habit.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(frequency !== undefined && { frequency }),
        ...(category !== undefined && { category }),
      },
      include: { streak: true },
    });

    res.json({ message: 'Habit updated successfully', habit });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/habits/:id
 * Delete a habit (cascades to logs and streak).
 */
const deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.habit.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Habit not found' });
    }

    await prisma.habit.delete({ where: { id } });

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit };
