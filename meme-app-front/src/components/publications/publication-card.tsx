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
import { linkToBlob } from '@/helpers/file-utils';
import { formatCount, formatDate } from '@/helpers/publication-utils';
import useDeletePublication from '@/server/hooks/publications/use-delete';
import useLike from '@/server/hooks/publications/use-like';
import useTogglePublicationStatus from '@/server/hooks/publications/use-toggle-status';
import useFollow from '@/server/hooks/users/use-follow';
import { Publication } from '@/server/types/publication';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  EllipsisVertical,
  Heart,
  HeartHandshake,
  LoaderCircle,
  PawPrint,
  Triangle,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { CommentSection } from '../comments/comment-section';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
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
    commentCount,
    isLiked,
    isFollowing,
    createdAt,
    status,
  },
}) => {
  const [isDescCollapsed, setIsDescCollapsed] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { deletePublication, isPending: isPendingDelete } =
    useDeletePublication();
  const { like, isPending: isPendingLike } = useLike();
  const { follow, isPending: isPendingFollow } = useFollow();
  const { togglePublicationStatus, isPending: isPendingStatus } =
    useTogglePublicationStatus();

  const linkRef = useRef<HTMLAnchorElement>(null);
  const isMine = user?.id === author.id;

  const handleLikeDebounced = useDebouncedCallback(
    () => like({ publicationId: id, isLiked }),
    300
  );

  const handleFollow = () => {
    follow({ publicationId: author.id, isFollowed: isFollowing });
  };

  const handleExport = async () => {
    try {
      pictures.forEach(async (picture, index) => {
        const blobUrl = await linkToBlob(picture);

        if (linkRef.current) {
          linkRef.current.href = blobUrl;
          linkRef.current.download = `${description.slice(0, 10)}_${index}.png`;
          linkRef.current.click();

          setTimeout(() => URL.revokeObjectURL(blobUrl), 600);
        }
      });
    } catch (err) {
      toast('Щось пішло не так...');
      console.error('Failed to fetch and download image:', err);
    }
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deletePublication(id);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Card
        className="flex flex-col justify-center items-center w-full min-h-72 h-[60vh] border-muted-foreground border-x-0 border-b-muted p-0"
        onDoubleClick={handleLikeDebounced}
      >
        <CardHeader className="w-full flex flex-row justify-between items-start p-0 py-2 z-10">
          <div className="flex gap-2 items-start py-1 px-3 rounded-br-md">
            <Avatar className="w-16 h-16">
              <AvatarImage src={author.avatar} alt={author.username} />
              <AvatarFallback>Ніц</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 -mt-2">
              <div className="flex gap-2 items-center">
                <p className="font-semibold text-xl">{author.username}</p>
                {isFollowing && (
                  <Button
                    variant="default"
                    className="[&_svg]:size-4 w-1 h-6"
                    disabled
                  >
                    <PawPrint />
                  </Button>
                )}
              </div>
              <p className="text-sm -mt-1">{author.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm -mt-1">{formatDate(createdAt)}</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-6">
                  <EllipsisVertical size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-min text-nowrap p-1 flex flex-col items-start"
                align="end"
              >
                <Button
                  variant="link"
                  onClick={handleFollow}
                  disabled={!isAuthenticated || isPendingFollow || isMine}
                >
                  {isFollowing ? 'Відписатися' : 'Підписатися'}
                </Button>
                <Separator />
                <Button variant="link" onClick={handleExport}>
                  Скачати меми собі
                </Button>
                <a ref={linkRef} className="hidden" />
                {isMine && (
                  <>
                    <Separator />
                    <Button
                      variant="link"
                      disabled={isPendingStatus}
                      onClick={() =>
                        togglePublicationStatus({ publicationId: id, status })
                      }
                    >
                      {status === 'active' ? 'Сховати' : 'Опублікувати'}
                    </Button>
                    <Button
                      variant="link"
                      disabled={isPendingDelete}
                      onClick={() => setConfirmDelete(true)}
                    >
                      Видалити
                    </Button>
                  </>
                )}
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
              'absolute left-0 bottom-0 flex bg-background bg-opacity-70 w-[90%] z-10 gap-2 transition-all ease-in-out duration-500 cursor-pointer ',
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
            <div
              className={cn(
                'flex flex-col gap-5 w-full',
                !isDescCollapsed ? 'overflow-y-auto' : 'overflow-hidden'
              )}
            >
              <p className="mt-2 text-wrap">{description}</p>
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
                isLiked && 'text-red-500'
              )}
              disabled={!isAuthenticated || isPendingLike}
            >
              {isLiked ? <HeartHandshake size={24} /> : <Heart size={24} />}
              {formatCount(likeCount)}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentSection publicationId={id} commentCount={commentCount} />

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

      <AlertDialog open={confirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Точно видалити?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ні</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Так
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function ImageWithSkeleton({
  src,
  onClick,
}: {
  src: string;
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onClick={onClick}
    >
      {isLoading && (
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
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}
