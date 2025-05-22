import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/helpers/css-utils';
import { formatCount } from '@/helpers/publication-utils';
import useLike from '@/server/hooks/publications/use-like';
import { Publication } from '@/server/types/publication';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  EllipsisVertical,
  Heart,
  HeartHandshake,
  LoaderCircle,
  Triangle,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { CommentSection } from '../comments/comment-section';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';

interface PublicationCardProps {
  publication: Publication;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication: {
    id,
    pictures,
    description,
    keywords,
    author,
    likeCount,
    isLiked,
  },
}) => {
  const [isDescCollapsed, setIsDescCollapsed] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [justLiked, setJustLiked] = useState(isLiked);

  const { like } = useLike();
  const { isAuthenticated } = useAuth();

  const handleLikeDebounced = useDebouncedCallback(() => {
    setJustLiked((prev) => !prev);
    like({ publicationId: id, isLiked: justLiked });
  }, 500);

  useEffect(() => {
    if (!isAuthenticated) setJustLiked(false);
  }, [isAuthenticated]);

  return (
    <>
      <Card className="flex flex-col justify-center items-center w-full min-h-72 h-[60vh] border-muted-foreground border-x-0 border-b-muted p-0">
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
              <p className="font-semibold text-lg">
                {author.fullName || author.username}
              </p>
              <p className="text-sm -mt-1">@{author.username}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-6">
                  <EllipsisVertical size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-min text-nowrap p-1" align="end">
                <Button variant="link">Підписатися</Button>
                <Separator />
                <Button variant="link">Скачати меми собі</Button>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="w-full min-h-72 h-[calc(60vh-120px)] px-0 -mt-8">
          <Carousel className="w-full h-full">
            <CarouselContent className="w-full h-full">
              {pictures.map((picture) => (
                <CarouselItem
                  key={picture}
                  className="relative w-full min-h-72 h-[calc(60vh-120px)]"
                >
                  <ImageWithSkeleton
                    src={picture}
                    onClick={() =>
                      setSelectedImage((prev) =>
                        picture === prev ? null : picture
                      )
                    }
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

        <CardFooter className="w-full justify-end h-12 p-1 align-top relative">
          <div
            className={cn(
              'absolute left-0 bottom-0 flex bg-background bg-opacity-70 w-[80%] z-10 gap-2 transition-all ease-in-out duration-500 cursor-pointer ',
              isDescCollapsed ? 'max-h-10' : 'max-h-[500%]'
            )}
            style={{
              transition:
                'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
            }}
            onClick={() => setIsDescCollapsed((prev) => !prev)}
          >
            <Button variant="ghost" className="[&_svg]:size-4">
              <Triangle
                className={cn(
                  'transition-all duration-500 ease-in-out',
                  isDescCollapsed ? 'rotate-0' : 'rotate-[60deg]'
                )}
              />
            </Button>
            <div className="flex flex-col gap-5">
              <p className="mt-2">{description}</p>
              <p className="mt-1 text-sm text-gray-500">
                #{keywords.join(' #')}
              </p>
            </div>
            <div
              className={cn(
                'absolute bottom-0 w-[150%] bg-gradient-to-b from-transparent to-background transition-all easy-in-out duration-500 to-50% -z-10',
                isDescCollapsed ? 'h-full ' : 'h-[150%]'
              )}
            />
          </div>

          <div className="flex items-center mt-auto z-10">
            <Button
              variant="ghost"
              onClick={handleLikeDebounced}
              className={cn(
                'flex items-center [&_svg]:size-6',
                justLiked && 'text-red-500'
              )}
              disabled={!isAuthenticated}
            >
              {justLiked ? <HeartHandshake size={24} /> : <Heart size={24} />}
              {formatCount(justLiked ? likeCount + 1 : likeCount)}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentSection publicationId={id} />

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogOverlay />
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>Full Image Preview</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Full Image"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded cursor-pointer"
              onClick={() => setSelectedImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

function ImageWithSkeleton({
  src,
  onClick,
}: {
  src: string;
  onClick: () => void;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onClick={onClick}
    >
      {loading && (
        <Skeleton className="absolute top-0 right-0 inset-0 w-full h-full bg-background flex items-center justify-center z-10 animate-none">
          <LoaderCircle className="w-36 h-36 animate-spin duration-1000" />
        </Skeleton>
      )}

      <Image
        src={src}
        alt="Carousel Image"
        layout="fill"
        objectFit="contain"
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}
