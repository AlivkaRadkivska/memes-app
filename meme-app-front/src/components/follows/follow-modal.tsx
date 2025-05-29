'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { FollowerItem } from './follow-item';
import { MiniUser } from '@/server/types/user';

interface FollowersModalProps {
  follows: MiniUser[];
  trigger: React.ReactNode;
  title?: string;
}

export function FollowModal({
  follows,
  trigger,
  title = 'Підписники',
}: FollowersModalProps) {
  if (!follows) return <p>Ніц</p>;

  return (
    <Dialog>
      <DialogOverlay />
      <DialogTrigger className="p-0" asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <div className="dark:bg-white/75 dark:text-black bg-black/75 text-white flex flex-col p-6 rounded-sm min-w-[40vw] min-h-[40vh]">
          <DialogHeader className="pb-2 border-b border-muted-foreground">
            <DialogTitle className="flex items-center gap-2">
              <Users size={18} />
              {title}
              <span className="text-muted font-normal text-sm ml-1">
                ({follows.length})
              </span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-2 -mx-6 px-6">
            {follows.length > 0 ? (
              follows.map((follow) => (
                <FollowerItem key={follow.id} user={follow} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Users size={40} className="mb-2 opacity-20" />
                <p>Ніц</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
