const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create a demo user
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const user = await prisma.user.upsert({
    where: { email: 'demo@antigravite.com' },
    update: {},
    create: {
      name: 'Diana',
      email: 'demo@antigravite.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ User created: ${user.name} (${user.email})`);

  // Create sample habits
  const habitsData = [
    { title: 'Meditate', icon: 'meditation', color: '#7ED957', frequency: 'daily', category: 'Mindfulness' },
    { title: 'Read 20 Pages', icon: 'book', color: '#F5C842', frequency: 'daily', category: 'Learning' },
    { title: 'Track Expenses', icon: 'finance', color: '#F56FAD', frequency: 'daily', category: 'Finance' },
    { title: 'Workout', icon: 'fitness', color: '#5B4EFF', frequency: 'daily', category: 'Health' },
    { title: 'Drink 8 Glasses of Water', icon: 'water', color: '#42C6F5', frequency: 'daily', category: 'Health' },
    { title: 'Journal', icon: 'journal', color: '#FF8C42', frequency: 'daily', category: 'Mindfulness' },
  ];

  for (const habitData of habitsData) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        ...habitData,
      },
    });

    // Initialize streak for each habit
    await prisma.streak.create({
      data: {
        habitId: habit.id,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    console.log(`✅ Habit created: ${habit.title}`);
  }

  console.log('\n🎉 Seeding complete!');
  console.log(`\n📋 Demo credentials:\n   Email: demo@antigravite.com\n   Password: password123\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
