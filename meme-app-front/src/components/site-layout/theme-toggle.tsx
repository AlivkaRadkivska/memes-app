'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex w-9 h-9 min-w-9"
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-5" />
      ) : (
        <Sun className="w-4 h-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
