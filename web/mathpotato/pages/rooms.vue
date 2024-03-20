<template>
    <div class="container-principal">
        <!-- Public Rooms -->
        <div class="container-public-room">
            <div class="header-public-room">
                <svg @click="refresh" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh btn-refesh" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
                <div class="container-select">
                    <select class="despegable-modes" v-model="selectedMode">
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
                <input class="input" type="text" v-model="privateRoomCode" placeholder="Enter room code" />
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
    font-family: 'Arial', sans-serif;
    background-color: #F2F2F2; /* Color de fondo general */
}

.container-principal {
    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.container-public-room,
.container-private-room {
    width: 45%;
    background-color: #FFFFFF;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.container-select{
    display: flex;
    align-items: center;
    margin-left: auto;
}

.input-container{
    display: flex;
    padding-top: 40px;
    align-items: center;
    margin-bottom: 20px;
    justify-content: center;
    width: 100%;
}

.btn-refesh{
    cursor: pointer;
    margin-left: 20px;
}

.container-public-room {
    border-right: 10px solid #6C5CE7; /* Color representativo de MathPotato */
}

.despegable-modes{
    padding: 10px;
    align-items: end;
    font-size: 16px;
    border: 2px solid #6C5CE7;
    border-radius: 5px;
    background-color: #FFFFFF;
    color: #333;
    outline: none;
    cursor: pointer;

}

.header-public-room {
    display: flex; /* Align items to the right */
    padding: 20px;
    justify-content: right;
    align-items: end;
}

.button-container-createRoom{
    text-align: center;
    padding: 20px;

}

.title-lobbies-pub {
    font-size: 24px;
    margin-right: 10px;margin-right: 10px;
    color: #6C5CE7; /* Color representativo de MathPotato */
}

.btn-refresh {
    background: transparent;
    border: none;
    margin-right: 10px;
    cursor: pointer;
}

.btn-refresh svg {
    width: 16px;
    height: 16px;
    fill: #6C5CE7; /* Color representativo de MathPotato */
}

.content-public-room .list-salas ul {
    padding: 0;
    margin: 0;
}

.btn-list-salas {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 18px;
    text-align: left;
    border: none;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-list-salas:last-child {
    border-bottom: none;
}

.container-private-room input[type="text"] {
    width: calc(100% - 120px);
    padding: 10px;
    font-size: 16px;
    margin-right: 10px;
    border: 2px solid #6C5CE7;
    border-radius: 5px;
    background-color: #FFFFFF;
    color: #333;
    outline: none;
}

.container-private-room input[type="text"]::placeholder {
    color: #999;
}

.btn-createRoom {
    padding: 10px 30px;
    font-size: 16px;
    background-color: #6C5CE7;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-createRoom:hover {
    background-color: #5A4DB3; /* Color representativo de MathPotato (oscurecido) */
}
</style>