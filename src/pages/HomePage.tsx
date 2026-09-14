import { useEffect, useMemo, useState } from "react";
import { Sparkles, Flame } from "lucide-react";
import { useWealth } from "@/context/WealthContext";
import { Progress } from "@/components/ui/progress";

/* ── Quotes ── */
const quotes = [
  "A penny saved is a penny earned. — Benjamin Franklin",
  "The best time to start saving is now!",
  "Smart money moves make future dreams come true.",
  "Don't spend it all—grow it instead! 🌱",
  "Every dollar is a seed for your future.",
];

/* ── Fake Ticker ── */
const basePrices = { LemonCorp: 42.5, SugarInc: 18.75, CupCo: 105.2 };

const generatePrices = () =>
  Object.entries(basePrices).map(([name, base]) => {
    const delta = (Math.random() - 0.5) * 4;
    const price = Math.round((base + delta) * 100) / 100;
    const pct = ((delta / base) * 100).toFixed(2);
    return { name, price, pct: parseFloat(pct) };
  });

const TickerTape = () => {
  const stocks = useMemo(generatePrices, []);

  return (
    <div className="overflow-hidden rounded-xl bg-card">
      <div className="flex animate-marquee whitespace-nowrap py-2.5 text-xs font-medium">
        {[...stocks, ...stocks].map((s, i) => (
          <span key={i} className="mx-4 inline-flex items-center gap-1.5">
            <span className="text-foreground font-semibold">{s.name}</span>
            <span className="text-muted-foreground">${s.price.toFixed(2)}</span>
            <span className={s.pct >= 0 ? "text-primary" : "text-destructive"}>
              {s.pct >= 0 ? "▲" : "▼"} {Math.abs(s.pct)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Wealth Card ── */
const WealthCard = () => {
  const { wealth } = useWealth();
  const whole = Math.floor(Math.abs(wealth));
  const cents = Math.abs(wealth * 100 % 100).toFixed(0).padStart(2, "0");
  const sign = wealth < 0 ? "-" : "";
  return (
    <div className="card-glow rounded-2xl bg-card p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Total Wealth</p>
      <h1 className="mt-2 text-6xl font-bold tracking-tight text-primary wealth-glow animate-pulse-glow">
        {sign}${whole}<span className="text-4xl">.{cents}</span>
      </h1>
    </div>
  );
};

/* ── Level Badge ── */
const LevelBadge = () => (
  <div className="flex items-center justify-center">
    <div className="badge-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-gold-foreground">
      <Sparkles className="h-4 w-4" />
      Level 1: Novice
    </div>
  </div>
);

/* ── Daily Streak ── */
const DailyStreak = () => {
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("kt_last_visit");
    const saved = parseInt(localStorage.getItem("kt_streak") || "0");

    if (lastVisit === today) {
      setStreak(saved || 1);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastVisit === yesterday.toDateString() ? saved + 1 : 1;
      localStorage.setItem("kt_streak", String(newStreak));
      localStorage.setItem("kt_last_visit", today);
      setStreak(newStreak);
    }
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20">
        <Flame className="h-5 w-5 text-destructive" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Daily Streak</p>
        <p className="text-xl font-bold text-foreground">{streak} day{streak !== 1 && "s"} 🔥</p>
      </div>
    </div>
  );
};

/* ── Daily Goal ── */
const DAILY_GOAL = 50;

const DailyGoal = () => {
  const { wealth } = useWealth();
  const earned = Math.max(0, wealth - 20); // earnings above starting amount
  const progress = Math.min(100, (earned / DAILY_GOAL) * 100);

  return (
    <div className="space-y-2 rounded-2xl bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">🎯 Daily Goal</p>
        <p className="text-xs text-muted-foreground">
          ${Math.min(earned, DAILY_GOAL).toFixed(2)} / ${DAILY_GOAL}
        </p>
      </div>
      <Progress value={progress} className="h-3 rounded-full" />
      <p className="text-xs text-center text-muted-foreground">
        {progress >= 100 ? "Goal complete! 🏆" : `Earn $${DAILY_GOAL} today to complete`}
      </p>
    </div>
  );
};

/* ── Quote ── */
const QuoteCard = () => {
  const today = new Date().getDay();
  const quote = quotes[today % quotes.length];
  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        💡 Quote of the Day
      </p>
      <p className="text-sm leading-relaxed text-secondary-foreground italic">"{quote}"</p>
    </div>
  );
};

/* ── Page ── */
const HomePage = () => (
  <div className="space-y-5 px-5 pt-8">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h2 className="text-2xl font-bold">Kid Tycoon 🎮</h2>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-lg">🏆</div>
    </div>

    <TickerTape />
    <WealthCard />
    <LevelBadge />
    <DailyStreak />
    <DailyGoal />
    <QuoteCard />

    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-card p-4">
        <p className="text-xs text-muted-foreground">Saved This Week</p>
        <p className="mt-1 text-xl font-bold text-foreground">$5.00</p>
      </div>
      <div className="rounded-2xl bg-card p-4">
        <p className="text-xs text-muted-foreground">Quests Done</p>
        <p className="mt-1 text-xl font-bold text-foreground">3 / 10</p>
      </div>
    </div>
  </div>
);

export default HomePage;
