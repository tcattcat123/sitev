
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface UiUxModalProps {
  onClose: () => void;
  htmlContent: string;
}

export const UiUxModal = ({ onClose, htmlContent }: UiUxModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[90vh] flex flex-col p-0 gap-0 bg-card/80 backdrop-blur-sm sm:rounded-lg overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>UI/UX: Пример интерфейса</DialogTitle>
          <DialogDescription>
            Интерактивный прототип мобильного приложения.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow w-full h-full overflow-hidden">
          <iframe
            srcDoc={htmlContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="UI/UX Prototype"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
