import axios from 'axios';
import type { Story, SaveSlot } from '../types/narrative';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5059';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const storyService = {
  async getStories(): Promise<Story[]> {
    const res = await apiClient.get<Story[]>('/api/stories');
    return res.data;
  },

  async getStory(id: string): Promise<Story> {
    const res = await apiClient.get<Story>(`/api/stories/${id}`);
    return res.data;
  },
};

export const saveService = {
  async getSaves(userId: string): Promise<SaveSlot[]> {
    const res = await apiClient.get<SaveSlot[]>(`/api/saves/${userId}`);
    return res.data;
  },

  async createSave(save: Partial<SaveSlot>): Promise<SaveSlot> {
    const res = await apiClient.post<SaveSlot>('/api/saves', save);
    return res.data;
  },

  async updateSave(id: string, save: Partial<SaveSlot>): Promise<SaveSlot> {
    const res = await apiClient.put<SaveSlot>(`/api/saves/${id}`, save);
    return res.data;
  },

  async deleteSave(id: string): Promise<void> {
    await apiClient.delete(`/api/saves/${id}`);
  },
};
