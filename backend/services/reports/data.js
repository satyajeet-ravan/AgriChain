export const fraudReports = [
  { id: 'FR-001', type: 'fraud', reported_user_id: 4, reported_user_name: 'Suresh Patil', reporterId: 2, reporter_name: 'FreshMart Pvt Ltd', description: 'Listing photos appear to be from internet, not actual farm produce.', date: '2025-04-08', severity: 'high', status: 'investigating', admin_notes: 'Checking listing image sources.' },
  { id: 'FR-002', type: 'delivery', reported_user_id: 1, reported_user_name: 'Rajesh Kumar', reporterId: 5, reporter_name: 'Green Grocers', description: 'Paid for order ORD-002 but no delivery after 15 days. No response from farmer.', date: '2025-04-05', severity: 'medium', status: 'resolved', admin_notes: 'Refund issued. Farmer warned.' },
  { id: 'FR-003', type: 'quality', reported_user_id: 6, reported_user_name: 'Anita Sharma', reporterId: 2, reporter_name: 'FreshMart Pvt Ltd', description: 'Received inferior quality tomatoes compared to listing photos. Half the batch was rotten.', date: '2025-04-03', severity: 'low', status: 'pending', admin_notes: '' },
];

let nextNum = 4;
export function getNextId() { return `FR-${String(nextNum++).padStart(3, '0')}`; }
