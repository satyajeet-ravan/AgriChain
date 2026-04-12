import client from './client';

export const analyticsAPI = {
  getFarmerAnalytics: () =>
    client.get('/analytics/farmer').then(r => r.data),

  getEarnings: () =>
    client.get('/analytics/earnings').then(r => r.data),

  getAdminAnalytics: () =>
    client.get('/analytics/admin').then(r => r.data),
};
