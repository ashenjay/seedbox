<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6">Profile</h1>
      
      <div class="space-y-4">
        <div>
          <p class="text-gray-600">Email</p>
          <p class="font-medium">{{ user?.email }}</p>
        </div>
        
        <div>
          <p class="text-gray-600">Storage Used</p>
          <div class="w-full bg-gray-200 rounded h-2 mt-2">
            <div 
              class="bg-blue-500 rounded h-2" 
              :style="{ width: `${storagePercentage}%` }"
            ></div>
          </div>
          <p class="text-sm mt-1">
            {{ formatBytes(user?.storageUsed) }} / {{ formatBytes(user?.storageLimit) }}
          </p>
        </div>

        <div>
          <p class="text-gray-600">Plan</p>
          <p class="font-medium capitalize">{{ user?.plan }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    const user = computed(() => store.state.user)
    
    const storagePercentage = computed(() => {
      if (!user.value) return 0
      return (user.value.storageUsed / user.value.storageLimit) * 100
    })

    const formatBytes = (bytes) => {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    return {
      user,
      storagePercentage,
      formatBytes
    }
  }
}
</script>