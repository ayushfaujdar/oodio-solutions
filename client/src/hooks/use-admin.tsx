import { create } from "zustand";

interface AdminState {
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
}

export const useAdmin = create<AdminState>((set) => ({
  showAdminModal: false,
  setShowAdminModal: (show: boolean) => set({ showAdminModal: show }),
}));
