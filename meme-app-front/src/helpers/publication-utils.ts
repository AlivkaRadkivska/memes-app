export const formatCount = (count: number) =>
  count >= 1_000_000_000
    ? Math.round(count / 1_000_000_000) + 'B'
    : count >= 1_000_000
    ? Math.round(count / 1_000_000) + 'M'
    : count >= 1_000
    ? Math.round(count / 1_000) + 'K'
    : count;
