import { useState } from "react";
import { useWealth } from "@/context/WealthContext";
import { Citrus, CupSoda, CloudSun, CloudRain, Sun, Zap, DollarSign, ShoppingCart, Play } from "lucide-react";

type Weather = "Sunny" | "Raining" | "Heatwave";

interface SimResult {
  weather: Weather;
  cupsSold: number;
  revenue: number;
  cost: number;
  profit: number;
}

const LEMON_COST = 1;
const SUGAR_COST = 0.5;

const weatherConfig: Record<Weather, { icon: typeof Sun; label: string; color: string }> = {
  Sunny: { icon: CloudSun, label: "☀️ Sunny", color: "text-gold" },
  Raining: { icon: CloudRain, label: "🌧️ Raining", color: "text-blue-400" },
  Heatwave: { icon: Sun, label: "🔥 Heatwave", color: "text-orange-400" },
};

const PlayPage = () => {
  const { wealth, addWealth } = useWealth();
  const [lemons, setLemons] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [price, setPrice] = useState("1.00");
  const [result, setResult] = useState<SimResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const supplyCost = lemons * LEMON_COST + sugar * SUGAR_COST;
  const maxCups = Math.min(lemons, sugar);

  const buyItem = (item: "lemon" | "sugar") => {
    const cost = item === "lemon" ? LEMON_COST : SUGAR_COST;
    if (wealth < cost) return;
    addWealth(-cost);
    if (item === "lemon") setLemons((p) => p + 1);
    else setSugar((p) => p + 1);
  };

  const simulate = () => {
    if (maxCups === 0 || animating) return;
    setAnimating(true);
    setResult(null);

    const weathers: Weather[] = ["Sunny", "Raining", "Heatwave"];
    const weather = weathers[Math.floor(Math.random() * 3)];
    const priceNum = parseFloat(price) || 0;

    let demandMultiplier = 1;
    if (weather === "Heatwave") demandMultiplier = priceNum <= 2 ? 1.5 : 0.8;
    else if (weather === "Sunny") demandMultiplier = priceNum <= 1.5 ? 1.2 : 0.6;
    else demandMultiplier = 0.2; // Raining

    const cupsSold = Math.min(maxCups, Math.max(0, Math.round(maxCups * demandMultiplier)));
    const revenue = Math.round(cupsSold * priceNum * 100) / 100;
    const usedLemons = cupsSold;
    const usedSugar = cupsSold;
    const cost = usedLemons * LEMON_COST + usedSugar * SUGAR_COST;
    const profit = Math.round((revenue - cost) * 100) / 100;

    setTimeout(() => {
      // consume used supplies
      setLemons((p) => p - usedLemons);
      setSugar((p) => p - usedSugar);
      // only add revenue (cost was already paid when buying)
      addWealth(revenue);
      setResult({ weather, cupsSold, revenue, cost, profit });
      setAnimating(false);
    }, 1200);
  };

  const weatherInfo = result ? weatherConfig[result.weather] : null;

  return (
    <div className="space-y-5 px-5 pt-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <CupSoda className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Lemonade Stand</h2>
          <p className="text-xs text-muted-foreground">Buy supplies, set prices, sell cups!</p>
        </div>
      </div>

      {/* Balance */}
      <div className="rounded-2xl bg-card p-4 text-center card-glow">
        <p className="text-xs text-muted-foreground">Your Balance</p>
        <p className="text-3xl font-bold text-primary">${wealth.toFixed(2)}</p>
      </div>

      {/* Shop */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🛒 Shop</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => buyItem("lemon")}
            disabled={wealth < LEMON_COST}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 transition-transform active:scale-95 disabled:opacity-40"
          >
            <Citrus className="h-8 w-8 text-yellow-400" />
            <span className="text-sm font-semibold">Lemon</span>
            <span className="text-xs text-muted-foreground">$1.00</span>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold">{lemons} owned</span>
          </button>
          <button
            onClick={() => buyItem("sugar")}
            disabled={wealth < SUGAR_COST}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 transition-transform active:scale-95 disabled:opacity-40"
          >
            <ShoppingCart className="h-8 w-8 text-foreground" />
            <span className="text-sm font-semibold">Sugar</span>
            <span className="text-xs text-muted-foreground">$0.50</span>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold">{sugar} owned</span>
          </button>
        </div>
      </div>

      {/* Price Setting */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">💰 Set Price Per Cup</h3>
        <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
          <DollarSign className="h-5 w-5 text-primary" />
          <input
            type="number"
            min="0.25"
            max="10"
            step="0.25"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
          />
          <span className="text-sm text-muted-foreground">per cup</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          You can make up to <span className="font-bold text-foreground">{maxCups}</span> cups
        </p>
      </div>

      {/* Simulate */}
      <button
        onClick={simulate}
        disabled={maxCups === 0 || animating}
        className="w-full rounded-2xl bg-primary py-4 text-center text-lg font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {animating ? (
          <span className="inline-flex items-center gap-2">
            <Zap className="h-5 w-5 animate-spin" /> Simulating...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Play className="h-5 w-5" /> Simulate Day
          </span>
        )}
      </button>

      {/* Result */}
      {result && weatherInfo && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <p className={`text-2xl font-bold ${weatherInfo.color}`}>{weatherInfo.label}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Cups Sold</p>
              <p className="text-lg font-bold">{result.cupsSold}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold text-primary">${result.revenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className={`text-lg font-bold ${result.profit >= 0 ? "text-primary" : "text-destructive"}`}>
                {result.profit >= 0 ? "+" : ""}${result.profit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
};

export default PlayPage;
