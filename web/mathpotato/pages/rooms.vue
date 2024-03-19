<template>
    <div class="container-principal">
        <!-- Public Rooms -->
        <div class="container-public-room">
            <div class="header-public-room">
                <h2 class="title-lobbies-pub">Lobbies Publiques</h2>
                <button @click="refresh" class="btn-refesh"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg></button>
                <div>
                    <select v-model="selectedMode">
                    <option v-for="(lobby_mode, index) in lobbies" :key="index" :value="mode">
                        {{ lobby_mode.mode }}
                    </option>
                    </select>
                </div>
            
                
            </div>
            <div class="content-public-room">
                <div class="list-salas">
                    <ul>
                        <button class="btn-list-salas" v-for="(lobby, index) in lobbies" :key="index" @click="joinPublicRoom(lobby)">
                            {{ lobby.nameLobby }} | {{ lobby.mode }} 
                        </button>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Private Room Code -->
        <div class="container-private-room">
            <div class="input-container">
                <input type="text" v-model="privateRoomCode" placeholder="Enter room code" />
            </div>

            <!-- Create Private Room -->
            <div class="button-container-createRoom">
                <button @click="createPrivateRoom" class="btn-createRoom">Create</button>
            </div>
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
        },
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
    /* background-color: #202020; */
    /* color: #FFF; */
    
}
.container-principal {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.container-public-room {
    display: grid;
    grid-template-rows: 1fr 1fr;

}
.container-private-room {
    display: grid;
    grid-template-rows: 1fr 1fr;
}

.header-public-room {
    display: flex;
    align-items: center;
    height: 20vh;
    width: 30vw;
}

.list-salas{
    
}

/* .content-public-room{
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 70vh;
    width: 50vw;
} */
/* 
.public-rooms {
    flex: 1;
    border-right: 2px solid #4CAF50;
    padding-right: 20px;
}

.btn-refesh{
}

h2 {
    font-size: 24px;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

.input-container{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    width: 50%;
}

.button-container-createRoom{
    display: flex; 
    height: 35%;
    width: 200px;

}
.btn-list-salas {
    display: block;
    width: 400px;
    padding: 10px 0;
    font-size: 18px;
    text-align: left;
    border: none;
    border-bottom: 1px solid #4CAF50;
    cursor: pointer;
    transition: background-color 0.3s;
}
 .container-private-room input[type="text"] {
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

.container-private-room input[type="text"]::placeholder {
    color: #999;
}

.container-private-room .btn-list-salas {
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

.container-private-room .btn-list-salas:hover {
    background-color: #45a049;
}



.title-lobbies-pub{
    padding-right: 20px;
} */
</style>