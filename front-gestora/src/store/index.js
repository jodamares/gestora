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
