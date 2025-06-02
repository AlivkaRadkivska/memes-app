'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/css-utils';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MiniProfilePlaceholder({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4 p-2 md:p-4">
      <Avatar
        className={cn(
          'transition-all duration-300 ease-in-out cursor-pointer',
          isCollapsed ? 'h-10 w-10' : 'h-20 w-20'
        )}
        onClick={() => router.push('/auth')}
      >
        <AvatarImage
          src={'https://github.com/shadcn.png'}
          alt={'guest'}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {'Гість'}
        </AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="font-medium leading-none">{'Гість'}</h3>
          <p className="text-sm text-muted-foreground">{'guest@mail'}</p>
        </div>
      )}
      <Button
        variant="default"
        size={isCollapsed ? 'icon' : 'default'}
        className={cn(
          'w-full',
          isCollapsed ? 'justify-center' : 'justify-start'
        )}
        disabled
      >
        <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
        {!isCollapsed && 'Підкинути мемчиків'}
      </Button>
    </div>
  );
}
