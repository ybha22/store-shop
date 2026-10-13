import { create } from 'zustand'
import { KEYS, load, save, remove } from '../utils/storage'
import * as memberService from '../service/memberService'

const useAuthStore = create((set) => ({
  user: load(KEYS.SESSION, null),

  login: (userId, password) => {
    const user = memberService.login(userId, password)
    save(KEYS.SESSION, user)
    set({ user })
  },

  logout: () => {
    remove(KEYS.SESSION)
    set({ user: null })
  },

  refresh: (user) => {
    save(KEYS.SESSION, user)
    set({ user })
  },
}))

export default useAuthStore
