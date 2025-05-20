'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function SidebarToggle({
  isCollapsed,
  toggleSidebar,
}: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute -left-4 top-6 h-8 w-8 rounded-full border shadow-md"
      onClick={toggleSidebar}
    >
      {isCollapsed ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
