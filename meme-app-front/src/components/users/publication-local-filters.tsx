'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicationFilters } from '@/server/types/publication';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface PublicationFiltersProps {
  onFilterChange: (filters: PublicationFilters) => void;
  currentFilters: PublicationFilters;
  me?: boolean;
}

export function PublicationLocalFilters({
  onFilterChange,
  currentFilters,
  me = false,
}: PublicationFiltersProps) {
  const handleFilterChange = (newPart: Partial<PublicationFilters>) => {
    const updated = { ...currentFilters, ...newPart };
    onFilterChange(updated);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    handleFilterChange({ search: value || undefined });
  }, 500);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Знайти тут щось..."
            className="pl-9"
            defaultValue={currentFilters.search || ''}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {me && (
            <Select
              value={currentFilters.status ?? 'undefined'}
              onValueChange={(value) =>
                handleFilterChange({
                  status:
                    value === 'undefined'
                      ? undefined
                      : (value as 'active' | 'hidden'),
                })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undefined">Все</SelectItem>
                <SelectItem value="active">Активне</SelectItem>
                <SelectItem value="hidden">Приховане</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select
            value={
              currentFilters.createdAtDesc === undefined
                ? 'undefined'
                : currentFilters.createdAtDesc.toString()
            }
            onValueChange={(value) =>
              handleFilterChange({
                createdAtDesc:
                  value === 'undefined' ? undefined : value === 'true',
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Дата додавання" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undefined">Будь-який порядок</SelectItem>
              <SelectItem value="true">Найновіше</SelectItem>
              <SelectItem value="false">Найстаріше</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(currentFilters.status || currentFilters.createdAtDesc) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Задані фільтри:</span>

          {currentFilters.status && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Статус: {currentFilters.status}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive cursor-pointer"
                onClick={() => handleFilterChange({ status: undefined })}
              />
            </Badge>
          )}

          {currentFilters.createdAtDesc !== undefined && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Сортувати за:{' '}
              {currentFilters.createdAtDesc ? 'Новіше' : 'Старіше'}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive cursor-pointer"
                onClick={() => handleFilterChange({ createdAtDesc: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
