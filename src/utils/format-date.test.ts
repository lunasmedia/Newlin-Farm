import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate(new Date('2026-08-08T12:34:56Z'))).toBe('2026-08-08');
  });
});
