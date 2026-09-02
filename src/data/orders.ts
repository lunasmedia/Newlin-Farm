export const currentOrder = {
  id: 'NF-2841',
  status: 'Out for delivery',
  eta: '11:00',
  driver: 'Maya',
  itemCount: 4,
  minutesAway: 8,
  timeline: [
    { label: 'Order confirmed', time: '09:02', done: true },
    { label: 'Picked and packed', time: '09:31', done: true },
    { label: 'Out for delivery', time: 'Maya left the farm at 10:14', done: false, active: true },
    { label: 'Delivered', time: 'Estimated by 11:00', done: false },
  ],
};

export const pastOrders = [
  { id: 'o1', date: '8 August', items: 4, total: 18.2, status: 'Delivered' },
  { id: 'o2', date: '29 July', items: 5, total: 24.95, status: 'Delivered' },
  { id: 'o3', date: '12 July', items: 6, total: 31.7, status: 'Delivered' },
];
