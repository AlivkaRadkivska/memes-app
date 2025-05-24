import { Skeleton } from '@/components/ui/skeleton';
import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <Skeleton className="absolute top-0 right-0 inset-0 w-full h-full bg-background flex items-center justify-center z-10 animate-none">
        <LoaderCircle className="w-36 h-36 animate-spin duration-1000" />
      </Skeleton>
    </div>
  );
}
