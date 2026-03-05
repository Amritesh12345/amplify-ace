import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Megaphone, User, Building2, Eye, Sparkles } from 'lucide-react';

const ROLE_KEY = 'amplify-ace-role';

export type UserRole = 'brand' | 'creator' | 'agency' | 'guest';

const roles: { value: UserRole; label: string; description: string; icon: typeof Megaphone }[] = [
  { value: 'brand', label: 'Brand / Marketer', description: 'Discover creators and plan influencer campaigns', icon: Megaphone },
  { value: 'creator', label: 'Creator', description: 'Join the platform and get discovered by brands', icon: User },
  { value: 'agency', label: 'Agency', description: 'Manage multiple creators and brand campaigns', icon: Building2 },
  { value: 'guest', label: 'Guest', description: 'Explore the platform without signing up', icon: Eye },
];

export function getSavedRole(): UserRole | null {
  return localStorage.getItem(ROLE_KEY) as UserRole | null;
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
}

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getSavedRole()) setOpen(true);
  }, []);

  const handleContinue = () => {
    const role = selected || 'guest';
    localStorage.setItem(ROLE_KEY, role);
    setOpen(false);

    if (role === 'creator') navigate('/signup?type=creator');
    else if (role === 'agency') navigate('/signup?type=agency');
    // brand & guest stay on discovery
  };

  const handleSkip = () => {
    localStorage.setItem(ROLE_KEY, 'guest');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg p-0 gap-0 [&>button]:hidden" onPointerDownOutside={e => e.preventDefault()}>
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Amplify Ace</h2>
            <p className="text-sm text-muted-foreground">
              Discover creators. Plan campaigns. Grow your brand.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">What brings you to Amplify Ace?</p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelected(r.value)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 ${
                    selected === r.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card'
                  }`}
                >
                  <r.icon className={`h-5 w-5 ${selected === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{r.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleContinue} disabled={!selected} className="w-full">
              Continue
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
              Skip for now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
