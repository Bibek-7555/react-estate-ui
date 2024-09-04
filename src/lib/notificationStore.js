import { create } from 'zustand'
import apiRequest from './apiRequest'

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest.get("/user/my/notification")
    set({number: res.data})
  },
  decrease: () => {
    console.log("From notification decreasing")
    set((prev) => ({number: prev.number - 1}))
  },
  reset: () => {set({number: 0})}
 }))