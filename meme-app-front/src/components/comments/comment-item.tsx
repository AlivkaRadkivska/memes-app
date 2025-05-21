'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/helpers/css-utils';
import { Comment } from '@/server/types/comment';
import { formatDistanceToNow } from 'date-fns';
import PhotoCard from '../photos/photo-card';

interface CommentItemProps {
  comment: Comment;
  withDivider?: boolean;
}

export function CommentItem({
  comment: { user, createdAt, picture, text },
  withDivider,
}: CommentItemProps) {
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  console.log(withDivider);

  return (
    <Card
      className={'border-none overflow-hidden transition-all hover:shadow-md'}
    >
      <CardContent
        className={cn('p-3 w-full', withDivider && 'border-b border-muted')}
      >
        <div className="flex gap-3 w-full">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt={user.email} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <div className="w-full flex items-start justify-between">
              <div className="flex gap-2 items-baseline">
                <p className="text-lg">{user.username}</p>
                <p className="text-sm text-muted-foreground">({user.email})</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formattedDate}
              </span>
            </div>
            <p className="text-foreground/90 italic space-y-4 -ml-2">{text}</p>
            {picture && (
              <div className="mt-2 max-w-64 max-h-36 overflow-hidden rounded-md">
                <PhotoCard
                  photo={{
                    ai: false,
                    preview: picture,
                    name: '',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
