# 🟣 Antigravite — Habit Tracking App

> **Build healthy habits with us.**
> A beautifully designed daily habit tracker that keeps you on track, streak-motivated, and progress-aware.

---

## 📱 Overview

**Antigravite** is a mobile-first habit tracking application that helps users build and maintain healthy daily routines. With an engaging UI, personalized dashboards, and rich analytics, Antigravite turns habit-building into a rewarding experience.

---

## ✨ Key Features

### 1. 🧩 Create Habits
- Add custom habits with a name, icon, and color theme
- Set daily, weekly, or custom frequency goals
- Categorize habits (Health, Finance, Learning, Mindfulness, etc.)
- Add habit-specific sub-tasks (e.g., *"Read 20 pages"*, *"Record all expenses"*)
- Attach reminders and notifications per habit

### 2. ✅ Daily Tracking
- Personalized greeting dashboard (e.g., *"Good morning, Diana"*)
- Horizontal date strip for quick day-switching (Mon–Sun)
- Color-coded habit cards: completed (filled) vs pending (outlined)
- One-tap habit completion
- Habit detail view with contextual tips (e.g., meditation screen with timer)
- Activity timer with live countdown (e.g., *34 min 46 s*)

### 3. 🔥 Streak Tracking
- Visual streak counter per habit
- Weekly and monthly streak summaries
- Streak protection / freeze tokens
- Motivational milestone badges (7-day, 30-day, 100-day streaks)
- Streak loss warnings and recovery prompts

### 4. 📊 Progress Charts
- Weekly and monthly habit completion bar charts
- Line graph showing habit consistency over time
- Category-level analytics (e.g., Health score, Financial habits)
- Heatmap calendar (GitHub-style) for long-term view
- Overall completion percentage per week

---

## 🖥️ UI Screens

| Screen | Description |
|---|---|
| **Onboarding / Welcome** | Purple background, mascot character, *"Build healthy habits with us"* CTA with *Get Started* button |
| **Home Dashboard** | Morning greeting, date strip, 2×3 grid of habit cards with icons and sub-tasks |
| **Habit Detail / Timer** | Green full-screen view with timer, mascot, and contextual wellness tips |
| **Progress / Analytics** | Charts and streak info per habit |
| **Profile** | User avatar, account settings, streak stats |

---

## 🎨 Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| `primary-purple` | `#5B4EFF` | Onboarding background, primary CTA |
| `accent-green` | `#7ED957` | Active session screen, completed state |
| `habit-yellow` | `#F5C842` | Reading habit card |
| `habit-pink` | `#F56FAD` | Financial literacy card |
| `habit-white` | `#FFFFFF` | Card backgrounds, button labels |
| `text-dark` | `#1A1A1A` | Primary text |
| `text-muted` | `#888888` | Inactive habit labels |

### Typography
- **Headings:** Bold, rounded sans-serif
- **Body:** Regular weight, high readability
- **Timer Display:** Extra-large, mixed weight (`34 min **46 s**`)

### Components
- Rounded habit cards (large radius)
- Floating `+` action button (center nav bar)
- Date pill selector (active = dark filled, inactive = outlined)
- Mascot character — orange cartoon character used across onboarding and session screens

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | **React** (Web) / React Native (Mobile) |
| Charts | **Chart.js** |
| Styling | Tailwind CSS / CSS Modules |
| State | Redux Toolkit or Zustand |
| Animations | Framer Motion |

### Backend
| Layer | Technology |
|---|---|
| API | **REST API** (Node.js + Express) or GraphQL |
| Auth | JWT + OAuth2 (Google, Apple Sign-In) |
| Notifications | Firebase Cloud Messaging (FCM) |

### Database
| Layer | Technology |
|---|---|
| Primary DB | **PostgreSQL** |
| Caching | Redis |
| ORM | Prisma or Sequelize |

### Infrastructure
| Layer | Technology |
|---|---|
| Hosting | Vercel (Frontend) / Railway or Render (Backend) |
| Storage | AWS S3 (avatars, assets) |
| CI/CD | GitHub Actions |

---

## 🗄️ Database Schema (Simplified)

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Habits
CREATE TABLE habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  color       VARCHAR(7),       -- hex color code
  icon        VARCHAR(50),
  frequency   VARCHAR(20),      -- 'daily', 'weekly', 'custom'
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Habit Logs (daily completions)
CREATE TABLE habit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id    UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  duration_s  INTEGER,          -- seconds spent (for timed habits)
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, logged_date)
);

-- Streaks
CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID REFERENCES habits(id) ON DELETE CASCADE,
  current_streak  INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  last_completed  DATE,
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Invalidate token |

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | Get all habits for current user |
| POST | `/api/habits` | Create a new habit |
| PATCH | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |

### Tracking
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/logs?date=YYYY-MM-DD` | Get habit logs for a date |
| POST | `/api/logs` | Log a habit as complete |
| GET | `/api/streaks/:habitId` | Get streak data for a habit |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/weekly` | Weekly completion summary |
| GET | `/api/analytics/monthly` | Monthly progress overview |
| GET | `/api/analytics/heatmap` | Yearly heatmap data |

---

## 📂 Folder Structure

```
antigravite/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HabitCard/
│   │   │   ├── DateStrip/
│   │   │   ├── TimerScreen/
│   │   │   ├── StreakBadge/
│   │   │   └── Charts/
│   │   ├── pages/
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HabitDetail.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── habits.js
│   │   │   ├── logs.js
│   │   │   └── analytics.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── server.js
│   └── package.json
│
├── database/
│   └── migrations/
│
└── README.md
```

---

## 📋 Roadmap

- [x] Onboarding flow + authentication
- [x] Habit creation and dashboard
- [x] Daily check-in and completion tracking
- [x] Streak calculation engine
- [ ] Progress charts (Chart.js integration)
- [ ] Push notifications (FCM)
- [ ] Social sharing / friend streaks
- [ ] Dark mode
- [ ] Apple Watch / Wear OS widget
- [ ] AI-powered habit recommendations

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2025 Antigravite Team