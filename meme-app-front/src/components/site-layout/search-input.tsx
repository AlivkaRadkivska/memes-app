'use client';
import { ArrowDownRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function SearchInput() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div
        className={`duration-300 absolute -top-4 mt-2 flex items-center p-2 gap-3 w-max max-w-none border-l bg-white text-black dark:bg-black dark:text-white ${
          expanded ? 'right-14 z-40' : 'opacity-0 -z-10 border-none right-0'
        }`}
      >
        <Label className="w-full min-w-72">
          <Input
            type="text"
            placeholder="Напишіть опис мему чи ім'я автора..."
            autoFocus
            className="w-full px-4 py-2 text-lg"
          />
        </Label>
        <Button type="submit" className="px-4 py-1">
          Пошук
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex"
      >
        {!expanded ? (
          <Search className="w-4 h-5 z-50" />
        ) : (
          <ArrowDownRight className="w-4 h-5 z-50" />
        )}
      </Button>
    </div>
  );
}
