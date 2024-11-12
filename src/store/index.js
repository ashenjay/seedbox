import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: null,
    torrents: []
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    torrents: state => state.torrents
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setUser(state, user) {
      state.user = user
    },
    setTorrents(state, torrents) {
      state.torrents = torrents
    },
    clearAuth(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      commit('setToken', data.token)
    },
    async fetchProfile({ commit, state }) {
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${state.token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      commit('setUser', data)
    },
    async fetchTorrents({ commit, state }) {
      const response = await fetch('/api/torrents/list', {
        headers: { 'Authorization': `Bearer ${state.token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      commit('setTorrents', data)
    },
    logout({ commit }) {
      commit('clearAuth')
    }
  }
})