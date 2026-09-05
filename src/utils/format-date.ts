export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// "Good morning"/"afternoon"/"evening" from the device's actual current
// time, not a fixed greeting shown at every hour of the day.
export function getTimeOfDayGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Real, live upcoming days (starting today) for the delivery-slot picker —
// e.g. [{ day: 'Today', date: '17 Aug' }, { day: 'Tue', date: '18 Aug' }, ...],
// computed from the device's actual current date rather than a fixed range
// that goes stale.
export function getUpcomingDeliveryDays(
  count: number,
  from: Date = new Date()
): { day: string; date: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    return {
      day: i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })}`,
    };
  });
}
