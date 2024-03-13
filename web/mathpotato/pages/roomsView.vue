<template>
    <div class="rooms-view">
      <div v-for="(room, index) in gameRooms" :key="index" class="room-card">
        <h3>{{ room.roomName }}</h3>
        <p>Usuarios: {{ room.users.length }}/6</p>
        <ul>
          <li v-for="player in room.users" :key="player.id">{{ player.username }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
import { socket } from '../socket';
import { useAppStore } from '../stores/guestStore.js';
import { defineComponent } from 'vue';

  export default defineComponent({
    computed: {
      gameRooms() {
        const store = useAppStore();
        return store.getGameRooms();
      },
    },
    methods: {
        handleRoomList(gameRooms) {
            const store = useAppStore();
            store.getGameRooms(gameRooms);
            socket.emit('gameRooms', this.gameRooms);
        },
    },
    
  });
  </script>
  
  <style scoped>
  .rooms-view {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .room-card {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  ul {
    padding: 0;
    list-style: none;
  }
  
  li {
    margin-bottom: 8px;
  }
  </style>