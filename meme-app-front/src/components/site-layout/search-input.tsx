import { Eraser, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (expanded)
      router.push(`/?search=${encodeURIComponent(debouncedQuery.trim())}`);
  }, [debouncedQuery, expanded, router]);

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div
        className={`duration-300 absolute -top-4 mt-2 flex items-center p-2 gap-3 w-96 max-w-none border-l bg-background ${
          expanded ? 'right-10 z-40' : 'opacity-0 -z-10 border-none right-0'
        }`}
      >
        <Label className="w-full min-w-72">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Опис мему чи ім'я автора"
            autoFocus
            className="w-full px-4 py-2 text-lg"
          />
        </Label>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setExpanded((prev) => !prev);
          if (!expanded) inputRef.current?.focus();
          else {
            setQuery('');
            router.push('/');
          }
        }}
        className="flex"
      >
        {!expanded ? (
          <Search className="w-4 h-5 z-50" />
        ) : (
          <Eraser className="w-4 h-5 z-50" />
        )}
      </Button>
    </div>
  );
}
