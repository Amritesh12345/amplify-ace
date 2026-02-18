import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { parseCSV } from '@/hooks/useInfluencers';
import { Influencer } from '@/types/influencer';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (influencers: Omit<Influencer, 'id'>[]) => void;
}

export default function ImportCSVDialog({ open, onClose, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast({ title: 'Error', description: 'No valid rows found in CSV', variant: 'destructive' });
        return;
      }
      onImport(parsed);
      toast({ title: 'Success', description: `Imported ${parsed.length} influencers` });
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: Name, Platform, Niche, Followers, Avg Views, Engagement Rate, Country, Language, Email, Status, Notes
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 w-full text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Drop a CSV file here or click to browse</p>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              Choose File
            </Button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
