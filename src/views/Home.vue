<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6">My Torrents</h1>
      
      <!-- Add Torrent Form -->
      <form @submit.prevent="addTorrent" class="mb-8">
        <div class="flex gap-4">
          <input 
            v-model="magnetLink"
            type="text"
            placeholder="Enter magnet link"
            class="flex-1 p-2 border rounded"
            required
          />
          <button 
            type="submit"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Torrent
          </button>
        </div>
      </form>

      <!-- Torrents List -->
      <div class="space-y-4">
        <div v-for="torrent in torrents" :key="torrent._id" class="border rounded p-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold">{{ torrent.name || 'Loading...' }}</h3>
              <p class="text-sm text-gray-600">Status: {{ torrent.status }}</p>
              <div v-if="torrent.progress" class="w-full bg-gray-200 rounded h-2 mt-2">
                <div 
                  class="bg-blue-500 rounded h-2" 
                  :style="{ width: `${Math.round(torrent.progress * 100)}%` }"
                ></div>
              </div>
            </div>
            <button 
              @click="removeTorrent(torrent._id)"
              class="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const magnetLink = ref('')
    
    const fetchTorrents = () => {
      store.dispatch('fetchTorrents')
    }

    const addTorrent = async () => {
      try {
        await fetch('/api/torrents/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.token}`
          },
          body: JSON.stringify({ magnetLink: magnetLink.value })
        })
        magnetLink.value = ''
        fetchTorrents()
      } catch (error) {
        console.error('Error adding torrent:', error)
      }
    }

    const removeTorrent = async (id) => {
      try {
        await fetch(`/api/torrents/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${store.state.token}`
          }
        })
        fetchTorrents()
      } catch (error) {
        console.error('Error removing torrent:', error)
      }
    }

    onMounted(fetchTorrents)

    return {
      magnetLink,
      torrents: store.state.torrents,
      addTorrent,
      removeTorrent
    }
  }
}
</script>