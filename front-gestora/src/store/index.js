import { createStore } from 'vuex'

export default createStore({
  state: {
    authToken: null,
    authUser: null,
  },

  getters: {
    isAuthenticated: (state) => Boolean(state.authToken),
  },

  mutations: {
    HYDRATE_AUTH(state) {
      const token = localStorage.getItem('auth_token')
      if (token) state.authToken = token
      try {
        const user = localStorage.getItem('auth_user')
        if (user) state.authUser = JSON.parse(user)
      } catch {}
    },
    SET_AUTH(state, { token, user }) {
      state.authToken = token
      state.authUser = user
      localStorage.setItem('auth_token', token)
      if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    },
    LOGOUT(state) {
      state.authToken = null
      state.authUser = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
  },

  actions: {
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
})
