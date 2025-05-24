'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/helpers/css-utils';
import { UseFormReturn } from 'react-hook-form';
import { BadgeInput } from '../ui/badge-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { PublicationFormData } from '@/helpers/schemas/publication.schema';

interface PublicationDetailsFormProps {
  form: UseFormReturn<PublicationFormData, unknown, PublicationFormData>;
  onSubmit: () => void;
  isDisabled: boolean;
}

export function PublicationDetailsForm({
  form,
  onSubmit,
  isDisabled,
}: PublicationDetailsFormProps) {
  const descriptionLength = form.watch('description').length;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="animate-in fade-in duration-500 flex gap-3 justify-stretch"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2 transition-all w-full h-full">
              <FormLabel className="text-base font-medium">Опис</FormLabel>
              <FormControl>
                <div className="relative min-h-full">
                  <Textarea
                    placeholder="Введіть опис мемів..."
                    className={cn(
                      'resize-none h-full min-h-[120px] transition-all w-full',
                      field.value.length > 0 && 'pr-16'
                    )}
                    disabled={isDisabled}
                    {...field}
                  />
                  {field.value.length > 0 && (
                    <div
                      className={cn(
                        'absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full transition-colors',
                        descriptionLength > 450
                          ? 'text-amber-500'
                          : 'text-muted-foreground',
                        descriptionLength > 490 ? 'text-destructive' : ''
                      )}
                    >
                      {descriptionLength}/500
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col gap-1">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full ">
                <FormLabel className="text-base font-medium ">
                  Статус:
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value="active"
                      className="flex items-center gap-2"
                    >
                      Публічний
                    </SelectItem>
                    <SelectItem
                      value="hidden"
                      className="flex items-center gap-2"
                    >
                      Прихований
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full h-full">
                <FormLabel className="text-base font-medium">
                  Ключові слова
                </FormLabel>
                <FormControl>
                  <BadgeInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Тицьніть enter, пробіл або кому, щоб додати слово"
                    error={!!form.formState.errors.keywords}
                    disabled={isDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
