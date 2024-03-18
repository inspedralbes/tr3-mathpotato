<template>
    <div class="container">
        <!-- Public Rooms -->
        <div class="public-rooms">
            <h2>Public Rooms</h2>
            <ul>
                <button v-for="(lobby, index) in lobbies" :key="index" @click="joinPublicRoom(lobby)">
                    {{ lobby.nameLobby }} | {{ lobby.mode }} 
                </button>
            </ul>
        </div>

        <!-- Private Room Code -->
        <div class="private-room">
            <h2>Private Room</h2>
            <input type="text" v-model="privateRoomCode" placeholder="Enter room code" />

            <!-- Create Private Room -->
            <button @click="createPrivateRoom">Create</button>
        </div>
    </div>
</template>

<script>
import { useAppStore } from "../stores/guestStore.js";
export default {
    data() {
        return {
            privateRoomCode: "",
        };
    },
    computed: {
        lobbies(){
            let store = useAppStore();
            return store.getLobbiesName();
        }
    },
    methods: {
        createPrivateRoom() {
            // Logic to create a private room
        },
        joinPublicRoom(lobby) {
            // Logic to join a public room
        }
    },
};
</script>

<style>
body {
    margin: 0;
    padding: 0;
    background-color: #202020;
    color: #FFF;
}

.container {
    max-width: 800px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
}

.public-rooms {
    flex: 1;
    border-right: 2px solid #4CAF50;
    padding-right: 20px;
}

.private-room {
    flex: 1;
    padding-left: 20px;
}

h2 {
    font-size: 24px;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

button {
    display: block;
    width: 100%;
    padding: 10px 0;
    font-size: 18px;
    text-align: left;
    background-color: #303030;
    border: none;
    border-bottom: 1px solid #4CAF50;
    color: #FFF;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #454545;
}

.private-room input[type="text"] {
    width: calc(100% - 100px);
    padding: 10px;
    font-size: 16px;
    margin-right: 10px;
    border: 2px solid #4CAF50;
    border-radius: 5px;
    background-color: #303030;
    color: #FFF;
    outline: none;
}

.private-room input[type="text"]::placeholder {
    color: #999;
}

.private-room button {
    width: 100px;
    padding: 10px;
    font-size: 18px;
    background-color: #4CAF50;
    color: #FFF;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.private-room button:hover {
    background-color: #45a049;
}
</style>