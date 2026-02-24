import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shortlist from "./pages/Shortlist";
import CampaignBuilder from "./pages/CampaignBuilder";
import InfluencerDatabase from "./pages/InfluencerDatabase";
import Submissions from "./pages/Submissions";
import InfluencerSignup from "./pages/InfluencerSignup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/campaign" element={<CampaignBuilder />} />
          <Route path="/influencers" element={<InfluencerDatabase />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/signup" element={<InfluencerSignup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
