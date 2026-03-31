import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'

function makeStore() {
  return createStore({
    state: { authToken: null, authUser: null },
    getters: {
      isAuthenticated: (state) => Boolean(state.authToken),
    },
    mutations: {
      HYDRATE_AUTH(state) {
        const token = localStorage.getItem('auth_token')
        if (token) state.authToken = token
      },
      SET_AUTH(state, { token, user }) {
        state.authToken = token
        state.authUser = user
        localStorage.setItem('auth_token', token)
      },
      LOGOUT(state) {
        state.authToken = null
        state.authUser = null
        localStorage.removeItem('auth_token')
      },
    },
    actions: {
      logout({ commit }) {
        commit('LOGOUT')
      },
    },
  })
}

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  })
})

describe('store (auth module shape)', () => {
  it('isAuthenticated is false without token', () => {
    const store = makeStore()
    expect(store.getters.isAuthenticated).toBe(false)
  })

  it('SET_AUTH sets token and user', () => {
    const store = makeStore()
    store.commit('SET_AUTH', { token: 't1', user: { email: 'a@b.co' } })
    expect(store.getters.isAuthenticated).toBe(true)
    expect(store.state.authUser).toEqual({ email: 'a@b.co' })
  })

  it('logout clears session', () => {
    const store = makeStore()
    store.commit('SET_AUTH', { token: 't1', user: {} })
    store.dispatch('logout')
    expect(store.getters.isAuthenticated).toBe(false)
  })
})
