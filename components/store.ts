import { create } from 'zustand'
interface HideSignUpState {
  Hide: boolean;
  setHide: (value: boolean) => void;
}
interface SessionUserState {
  uid: number | null;
  uname: string | null;
  setuser: (value: {
    uid?: number;
    uname?: string;
  }) => void;
}
const HideSignUp = create<HideSignUpState>((set) => ({
  Hide: true,
  setHide: (value) => set({ Hide: value })
}))

const sessionuser = create<SessionUserState>((set) => ({
  uid: null,
  uname: null,
  setuser: (value: { uid?: number, uname?: string }) => set({ uid: value.uid ?? null, uname: value.uname ?? null })
}))

export { HideSignUp, sessionuser }