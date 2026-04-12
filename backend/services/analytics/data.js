export const analyticsData = {
  monthlyRevenue: [12000, 18500, 15200, 22000, 28000, 32000, 27500, 35000, 41000, 38000, 44000, 52000],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  topCrops: [
    { name: 'Basmati Rice', sales: 4200, revenue: 176400 },
    { name: 'Wheat', sales: 3800, revenue: 133000 },
    { name: 'Alphonso Mango', sales: 1200, revenue: 144000 },
    { name: 'Groundnut', sales: 900, revenue: 58500 },
  ],
  weeklyEngagement: [42, 67, 55, 88, 73, 95, 61],
};

export const farmerStats = {
  1: { totalEarnings: 52350, activeOrders: 7, listedCrops: 8, avgRating: 4.8, reviews: 124, conversionRate: 34 },
};

export const transactions = [
  { id: 'TXN-001', userId: 1, description: 'Payment for Basmati Rice (200kg)', amount: 8400, date: '2025-04-01', type: 'credit' },
  { id: 'TXN-002', userId: 1, description: 'Payment for Wheat (150kg)', amount: 5250, date: '2025-03-28', type: 'credit' },
  { id: 'TXN-003', userId: 1, description: 'Platform fee (2%)', amount: -337, date: '2025-03-28', type: 'debit' },
  { id: 'TXN-004', userId: 1, description: 'Payment for Groundnut (100kg)', amount: 6500, date: '2025-03-22', type: 'credit' },
  { id: 'TXN-005', userId: 1, description: 'Platform fee (2%)', amount: -260, date: '2025-03-22', type: 'debit' },
];
