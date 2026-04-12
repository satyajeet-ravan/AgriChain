import { Router } from 'express';
import { analyticsData, farmerStats, transactions } from './data.js';
import { verifyToken } from '../../middleware/auth.js';

const router = Router();

// GET /api/analytics/farmer
router.get('/farmer', verifyToken, (req, res) => {
  const stats = farmerStats[req.user.id] || { totalEarnings: 0, activeOrders: 0, listedCrops: 0, avgRating: 0, reviews: 0, conversionRate: 0 };
  res.json({
    stats,
    monthlyRevenue: analyticsData.monthlyRevenue,
    months: analyticsData.months,
    topCrops: analyticsData.topCrops,
    weeklyEngagement: analyticsData.weeklyEngagement,
  });
});

// GET /api/analytics/earnings
router.get('/earnings', verifyToken, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId === req.user.id);
  const totalEarnings = userTransactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
  const totalFees = Math.abs(userTransactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0));

  res.json({
    transactions: userTransactions,
    totalEarnings,
    totalFees,
    netEarnings: totalEarnings - totalFees,
    monthlyRevenue: analyticsData.monthlyRevenue,
    months: analyticsData.months,
  });
});

// GET /api/analytics/admin
router.get('/admin', verifyToken, (req, res) => {
  res.json({
    monthlyRevenue: analyticsData.monthlyRevenue,
    months: analyticsData.months,
    topCrops: analyticsData.topCrops,
  });
});

export default router;
