import client from './client';

export const statsAPI = {
  getPlatformStats: () =>
    client.get('/stats/platform').then(r => r.data),

  getTeam: () =>
    client.get('/stats/team').then(r => r.data),

  getAdminStats: () =>
    client.get('/stats/admin').then(r => r.data),
};
