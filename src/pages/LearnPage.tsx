import { useState } from "react";
import { BookOpen, CheckCircle, XCircle, Award } from "lucide-react";
import { useWealth } from "@/context/WealthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  explanation: string;
  quiz: { question: string; options: string[]; correctIndex: number };
}

const lessons: Lesson[] = [
  {
    id: "stocks", title: "Stocks", emoji: "📈",
    explanation: "A stock is a tiny piece of a company that you can own. When the company does well and makes more money, your piece becomes worth more too! It's like planting a seed and watching it grow into a big tree over time.",
    quiz: { question: "What happens to your stock when a company does well?", options: ["It disappears", "It becomes worth more", "Nothing changes"], correctIndex: 1 },
  },
  {
    id: "inflation", title: "Inflation", emoji: "🎈",
    explanation: "Inflation means prices go up over time, so your money buys less stuff. Imagine a candy bar costs $1 today but $2 next year — that's inflation! That's why saving AND investing is important, so your money grows faster than prices.",
    quiz: { question: "What does inflation do to prices over time?", options: ["Prices go down", "Prices stay the same", "Prices go up"], correctIndex: 2 },
  },
  {
    id: "budgeting", title: "Budgeting", emoji: "📋",
    explanation: "A budget is a plan for how you spend and save your money. You split your money into groups like saving, spending, and sharing. It helps you make sure you never run out and always have enough for the things you really want!",
    quiz: { question: "What is a budget?", options: ["A way to spend all your money fast", "A plan for spending and saving", "A type of piggy bank"], correctIndex: 1 },
  },
];

const LearnPage = () => {
  const { addWealth } = useWealth();
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [certOpen, setCertOpen] = useState(false);
  const [certName, setCertName] = useState("");

  const allDone = lessons.every((l) => completed.has(l.id));

  const openCard = (lesson: Lesson) => {
    setOpenLesson(lesson);
    setQuizMode(false);
    setSelected("");
    setResult(null);
  };

  const submitQuiz = () => {
    if (!openLesson || selected === "") return;
    const correct = parseInt(selected) === openLesson.quiz.correctIndex;
    setResult(correct ? "correct" : "wrong");
    if (correct && !completed.has(openLesson.id)) {
      addWealth(10);
      setCompleted((prev) => new Set(prev).add(openLesson.id));
    }
  };

  return (
    <div className="space-y-5 px-5 pt-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Learn</h2>
          <p className="text-xs text-muted-foreground">Pass a quiz to earn $10! 🎓</p>
        </div>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => openCard(lesson)}
            className="flex w-full items-center gap-4 rounded-2xl bg-card p-5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="text-3xl">{lesson.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{lesson.title}</p>
              <p className="text-xs text-muted-foreground">Tap to learn & quiz</p>
            </div>
            {completed.has(lesson.id) && <CheckCircle className="h-5 w-5 text-primary" />}
          </button>
        ))}
      </div>

      {/* Certificate Button */}
      <button
        onClick={() => setCertOpen(true)}
        disabled={!allDone}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-card py-4 text-sm font-bold transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        <Award className="h-5 w-5 text-gold" />
        <span className={allDone ? "text-gold" : "text-muted-foreground"}>
          {allDone ? "Claim My Tycoon Certificate 🎓" : `Complete all quizzes to unlock (${completed.size}/3)`}
        </span>
      </button>

      {/* Lesson Dialog */}
      <Dialog open={!!openLesson} onOpenChange={(o) => !o && setOpenLesson(null)}>
        {openLesson && (
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <span>{openLesson.emoji}</span> {openLesson.title}
              </DialogTitle>
              <DialogDescription className="sr-only">Learn about {openLesson.title}</DialogDescription>
            </DialogHeader>

            {!quizMode ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-foreground">{openLesson.explanation}</p>
                <Button className="w-full rounded-xl" onClick={() => setQuizMode(true)}>Take Quiz 🧠</Button>
              </div>
            ) : result === null ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">{openLesson.quiz.question}</p>
                <RadioGroup value={selected} onValueChange={setSelected}>
                  {openLesson.quiz.options.map((opt, i) => (
                    <label key={i} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 text-sm text-foreground transition-colors has-[data-state=checked]:border-primary">
                      <RadioGroupItem value={String(i)} />
                      {opt}
                    </label>
                  ))}
                </RadioGroup>
                <Button className="w-full rounded-xl" disabled={selected === ""} onClick={submitQuiz}>Submit Answer</Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                {result === "correct" ? (
                  <>
                    <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                    <p className="text-lg font-bold text-primary">Correct! 🎉</p>
                    <p className="text-sm text-muted-foreground">You earned $10.00!</p>
                  </>
                ) : (
                  <>
                    <XCircle className="mx-auto h-12 w-12 text-destructive" />
                    <p className="text-lg font-bold text-destructive">Not quite! 😅</p>
                    <p className="text-sm text-muted-foreground">Re-read the lesson and try again.</p>
                  </>
                )}
                <Button variant="secondary" className="w-full rounded-xl" onClick={() => {
                  if (result === "wrong") { setQuizMode(false); setSelected(""); setResult(null); } else { setOpenLesson(null); }
                }}>
                  {result === "wrong" ? "Re-read Lesson" : "Done"}
                </Button>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={certOpen} onOpenChange={setCertOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Tycoon Certificate</DialogTitle>
            <DialogDescription>Your Junior Entrepreneur Certificate</DialogDescription>
          </DialogHeader>
          <div className="border-8 border-double border-gold/60 m-4 rounded-xl p-6 text-center space-y-4 bg-card">
            <Award className="mx-auto h-14 w-14 text-gold" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">Certificate of Achievement</p>
            <h3 className="text-2xl font-bold text-foreground">Certified Junior Entrepreneur</h3>
            <p className="text-sm text-muted-foreground">This certifies that</p>
            {certName ? (
              <p className="text-xl font-bold text-primary">{certName}</p>
            ) : (
              <input
                autoFocus
                placeholder="Enter your name"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full bg-transparent text-center text-xl font-bold text-primary outline-none border-b border-border pb-1 placeholder:text-muted-foreground/50"
              />
            )}
            <p className="text-sm text-muted-foreground">has successfully completed all financial literacy courses at KidTycoon Academy</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            {!certName && (
              <p className="text-xs text-muted-foreground animate-pulse">Type your name above ☝️</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnPage;
