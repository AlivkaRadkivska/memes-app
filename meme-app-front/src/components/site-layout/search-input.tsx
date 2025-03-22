'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowDownRight, Search } from 'lucide-react';
import { useTheme } from 'next-themes';

export function SearchInput() {
  const [expanded, setExpanded] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeClass = useMemo(() => {
    if (!mounted) return 'bg-black text-white';
    return (theme ?? resolvedTheme) === 'dark'
      ? 'bg-black text-white'
      : 'bg-white text-black';
  }, [theme, resolvedTheme, mounted]);

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div
        className={`duration-300 absolute -top-4 mt-2 flex items-center p-2 gap-3 w-max max-w-none border-l ${themeClass} ${
          expanded ? 'right-14 z-40' : 'opacity-0 -z-10 border-none right-0'
        }`}
      >
        <Label className="w-full min-w-72">
          <Input
            type="text"
            placeholder="Provide meme description or author..."
            autoFocus
            className="w-full px-4 py-2 text-lg"
          />
        </Label>
        <Button type="submit" className="px-4 py-1">
          Search
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
