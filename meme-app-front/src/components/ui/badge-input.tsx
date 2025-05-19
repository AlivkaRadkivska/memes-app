'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/helpers/css-utils';
import { X } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

interface BadgeInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export const BadgeInput = ({
  value = [],
  onChange,
  placeholder = 'Add keyword...',
  maxTags = 10,
  className,
  error = false,
  disabled = false,
}: BadgeInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedInput = inputValue.trim();

    if ((e.key === 'Enter' || e.key === ' ' || e.key === ',') && trimmedInput) {
      e.preventDefault();

      if (!value.includes(trimmedInput) && value.length < maxTags) {
        onChange([...value, trimmedInput]);
      }

      setInputValue('');
    }

    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0',
        error ? 'border-destructive' : 'border-input',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-sm px-2 py-1 gap-1.5 group transition-all hover:bg-secondary/80"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full"
          >
            <X size={14} className="opacity-70 group-hover:opacity-100" />
            <span className="sr-only">Видалити {tag}</span>
          </button>
        </Badge>
      ))}

      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          value.length < maxTags
            ? placeholder
            : `Стоп, максимальна кількість елементів: ${maxTags}`
        }
        disabled={value.length >= maxTags || disabled}
        className="flex-1 min-w-[120px] border-0 p-0 px-1 py-0.5 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
