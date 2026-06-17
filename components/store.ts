import { create } from 'zustand'
interface HideSignUpState {
  Hide: boolean;
  setHide: (value: boolean) => void;
}
const HideSignUp = create<HideSignUpState>((set) => ({
  Hide: true,
  setHide: (value) => set({ Hide: value })
}))

export {HideSignUp}