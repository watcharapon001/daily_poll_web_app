# 🗳️ Daily Poll | Modern Voting Platform

A sleek, real-time voting web application built for daily interaction. Engage with your community through beautiful, interactive polls that refresh instantly.

![Daily Poll Preview](https://github.com/user-attachments/assets/your-screenshot-placeholder)

## ✨ Key Features

- **⚡ Real-time Updates**: Live results that update instantly using Supabase Real-time.
- **🌓 Adaptive Theme**: Seamless Dark and Light mode support with persistent user preference.
- **⏳ Countdown Timer**: Built-in countdown for daily polls to create urgency and engagement.
- **📤 Smart Sharing**: Share individual polls with a single click (Copy to Clipboard).
- **🛡️ Robust Validation**: Clean poll creation with question/option validation and visual error highlighting.
- **🦴 Premium UX**: Custom skeleton loading states for a smooth, flicker-free experience.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) / Tailwind Animate

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/daily-poll-web-app.git
cd daily-poll-web-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

## 🗄️ Supabase Setup

To get the database ready, run the contents of `supabase_schema.sql` in your Supabase SQL Editor. 

**Crucial**: To enable real-time results, run the following command in the SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE poll.poll_votes;
```

## 🛣️ Roadmap
- [ ] Comment system for more interaction.
- [ ] User profiles and vote history tracking.
- [ ] Image support for poll options.
- [ ] Trending polls algorithm.

---
Built with ❤️ by your friendly AI coding assistant.
