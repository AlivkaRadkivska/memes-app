'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/helpers/css-utils';
import { formatCount } from '@/helpers/publication-utils';
import { Comment } from '@/server/types/comment';
import { AnimatePresence, motion } from 'framer-motion';
import { Triangle } from 'lucide-react';
import { useState } from 'react';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface CommentSectionProps {
  publicationId: string;
  initialComments: Comment[];
  commentCount: number;
}

export function CommentSection({
  publicationId,
  initialComments,
  commentCount,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddComment = (newComment: Comment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="py-2 w-full">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between z-10">
          <Button variant="ghost" className="[&_svg]:size-4">
            <Triangle
              className={cn(
                'transition-all duration-500 ease-in-out',
                isOpen ? 'rotate-0' : 'rotate-[60deg]'
              )}
            />
          </Button>
          <p className="flex items-center gap-1 px-2 italic">
            Внизу коментарі ({formatCount(commentCount)})
          </p>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 w-full">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-3 overflow-hidden py-2"
            >
              <CommentForm
                publicationId={publicationId}
                onCommentAdd={handleAddComment}
              />

              <div className="w-full max-h-[70vh] overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Ще ніхто не коментував, ви можете бути першими
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      withDivider={index != comments.length - 1}
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
