import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import { formatDate } from '@/helpers/publication-utils';
import useDeleteComment from '@/server/hooks/comments/use-delete-comment';
import { Comment } from '@/server/types/comment';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import PhotoCard from '../photos/photo-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface CommentItemProps {
  publicationId: string;
  comment: Comment;
  withDivider?: boolean;
}

export function CommentItem({
  publicationId,
  comment: { id, user, createdAt, picture, text },
  withDivider,
}: CommentItemProps) {
  const { user: authenticatedUser } = useAuth();
  const { deleteComment, isPending } = useDeleteComment({ publicationId });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteComment = () => {
    deleteComment(id);
  };

  return (
    <>
      <Card
        className={'border-none overflow-hidden transition-all hover:shadow-md'}
      >
        <CardContent
          className={cn('p-3 w-full', withDivider && 'border-t border-muted')}
        >
          <div className="flex gap-3 w-full">
            <div className="flex flex-col gap-2">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback>Ніц</AvatarFallback>
              </Avatar>

              {user.email === authenticatedUser?.email && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sm hover:underline mt-auto [&_svg]:size-4"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isPending}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="w-full flex items-start justify-between">
                <div className="flex flex-col gap-0">
                  <p>{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    ({user.email})
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(createdAt)}
                </span>
              </div>
              <p className="text-foreground/90 italic mt-3">{text}</p>
              {picture && (
                <div className="mt-2 max-w-64 overflow-hidden rounded-md">
                  <PhotoCard photo={{ preview: picture }} height={36} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={() => setConfirmDelete(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Точно видалити?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ні</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive text-destructive-foreground"
            >
              Так
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
