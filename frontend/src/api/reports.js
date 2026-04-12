import client from './client';

export const reportsAPI = {
  getAll: () =>
    client.get('/reports').then(r => r.data),

  create: (data) =>
    client.post('/reports', data).then(r => r.data),

  updateStatus: (id, status, admin_notes) =>
    client.put(`/reports/${id}/status`, { status, admin_notes }).then(r => r.data),
};
