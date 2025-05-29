import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/helpers/css-utils';
import { formatCount } from '@/helpers/publication-utils';
import useGetComments from '@/server/hooks/comments/use-get-comments';
import { AnimatePresence, motion } from 'framer-motion';
import { Triangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface CommentSectionProps {
  publicationId: string;
  commentCount: number;
}

export function CommentSection({
  publicationId,
  commentCount,
}: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetComments({ publicationId }, { enabled: commentCount > 0 });

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
            Внизу коментарі ({formatCount(commentCount || 0)})
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
              <CommentForm publicationId={publicationId} />

              <div className="w-full max-h-[70vh] overflow-y-auto">
                {commentCount === 0 ? (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Ще ніхто не коментував, ви можете бути першими
                  </p>
                ) : (
                  data?.pages.flatMap((page, i) =>
                    page?.items.map((comment, j) => (
                      <CommentItem
                        key={comment.id}
                        publicationId={publicationId}
                        comment={comment}
                        withDivider={!(i === 0 && j === 0)}
                      />
                    ))
                  )
                )}

                {isFetchingNextPage && (
                  <p className="text-center text-sm p-4">Завантаження...</p>
                )}
                {isOpen && <div ref={ref} className="h-0" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
