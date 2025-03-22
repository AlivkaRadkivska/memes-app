import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Publication } from '@/server/types/publication';
import { EllipsisVertical, Heart, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
    isLiked,
    likeCount,
    commentCount,
    isBanned,
    banReason,
  } = publication;

  return (
    <Card className="flex flex-col justify-center items-center w-full min-h-72 h-[60vh] border-x-0 p-0">
      <CardHeader className="w-full flex flex-row justify-between items-start p-0 py-2 z-10">
        <div className="flex gap-2 items-start py-1 px-3 rounded-br-md">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={author.email}
            />
            <AvatarFallback>{author.username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-lg ">{author.username}</p>
            <p className="text-sm -mt-1">@{author.email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" className="w-6">
            <EllipsisVertical />
          </Button>
        </div>
      </CardHeader>

      <CardContent className=" w-full min-h-72 h-[calc(60vh-120px)] px-0 -mt-8">
        <Carousel className="w-full h-full">
          <CarouselContent className="w-full h-full">
            {pictures.map((picture) => (
              <CarouselItem
                key={picture}
                className="relative w-full min-h-72 h-[calc(60vh-120px)]"
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
      </CardContent>

      <CardFooter className="w-full justify-between h-5 p-1">
        {isBanned ? (
          <p className="text-red-500 text-sm font-semibold">
            This post is banned. Reason: {banReason}
          </p>
        ) : (
          <>
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
      </CardFooter>
    </Card>
  );
};
