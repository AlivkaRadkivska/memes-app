import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatCount = (count: number) =>
  count >= 1_000_000_000
    ? Math.round(count / 1_000_000_000) + 'B'
    : count >= 1_000_000
    ? Math.round(count / 1_000_000) + 'M'
    : count >= 1_000
    ? Math.round(count / 1_000) + 'K'
    : count;

export const formatDate = (createdAt: Date) =>
  formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: uk,
  });
