import client from './client';

export const cropsAPI = {
  getAll: (params) =>
    client.get('/crops', { params }).then(r => r.data),

  getById: (id) =>
    client.get(`/crops/${id}`).then(r => r.data),

  getCategories: () =>
    client.get('/crops/categories').then(r => r.data),

  getVarieties: () =>
    client.get('/crops/varieties').then(r => r.data),

  getFarmers: () =>
    client.get('/crops/farmers').then(r => r.data),

  create: (data) =>
    client.post('/crops', data).then(r => r.data),

  update: (id, data) =>
    client.put(`/crops/${id}`, data).then(r => r.data),

  remove: (id) =>
    client.delete(`/crops/${id}`).then(r => r.data),
};
