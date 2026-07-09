import { api } from './api';
import { ApiDataResponse, DashboardData } from '../types';

export const dashboardService = {
  async get() {
    const { data } = await api.get<ApiDataResponse<DashboardData>>('/dashboard');
    return data.data;
  },
};
