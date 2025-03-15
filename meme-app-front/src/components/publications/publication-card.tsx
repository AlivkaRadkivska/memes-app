import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Publication } from '@/server/types/publication';
import { Heart, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface PublicationCardProps {
  publication: Publication;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onLike,
  onComment,
}) => {
  const {
    id,
    pictures,
    description,
    keywords,
    author,
    createdAt,
    isLiked,
    likeCount,
    commentCount,
    isBanned,
    banReason,
  } = publication;

  return (
    <Card className="w-full shadow-md overflow-hidden flex min-h-72 h-[60vh]">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {pictures.map((picture) => (
            <CarouselItem
              key={picture}
              className="relative w-full min-h-72 h-[60vh]"
            >
              <Image
                src={picture}
                alt={picture}
                layout="fill"
                objectFit="contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {pictures.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <CardContent className="p-4 w-[40%] h-full">
        {isBanned ? (
          <p className="text-red-500 text-sm font-semibold">
            This post is banned. Reason: {banReason}
          </p>
        ) : (
          <>
            <p className="text-gray-800 font-semibold">@{author.username}</p>
            <p className="text-gray-500 text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">{description}</p>
            <p className="mt-1 text-sm text-gray-500">#{keywords.join(' #')}</p>

            <div className="flex items-center gap-4 mt-auto">
              <Button
                variant="ghost"
                onClick={() => onLike(id)}
                className={cn(
                  'flex items-center gap-1',
                  isLiked && 'text-red-500'
                )}
              >
                <Heart size={18} /> {likeCount}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onComment(id)}
                className="flex items-center gap-1"
              >
                <MessageSquare size={18} /> {commentCount}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
