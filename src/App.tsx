import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WealthProvider } from "@/context/WealthContext";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import LearnPage from "./pages/LearnPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WealthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </WealthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
