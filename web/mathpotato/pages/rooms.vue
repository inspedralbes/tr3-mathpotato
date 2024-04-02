<template>
    <div class="container-principal">
        <!-- Public Rooms -->
        <div class="rooms-container">
            <div class="container-public-room">
                <div class="header-public-room">
                    <div class="container-svg">
                        <div class="flex justify-content-start">
                            <Button @click="btnRefresh" icon="pi pi-refresh" class="btn-refresh" label="Reload" severity="warning" />
                        </div>
                    </div>
                    <div class="container-select">
                        <div class="card flex justify-content-center select-modes">
                            <FloatLabel class="w-full md:w-20rem">
                                <MultiSelect id="ms-cities" v-model="selectedModes" :options="modes" optionLabel="name" :maxSelectedLabels="3" class="w-full" />
                                <label for="ms-cities">Modes</label>
                            </FloatLabel>
                        </div>

                    </div>
                </div>
                <div class="content-public-room">
                    <div class="card">
                        <div class="flex flex-column md:flex-row gap-5">
                            <div class="flex-auto">
                            <ScrollPanel 
                                style="width: 100%; height: 300px" 
                                :pt="{ 
                                wrapper: { 
                                    style: { 'border-right': '10px solid var(--surface-ground)' }
                                },  
                                bary: 'hover:bg-primary-400 opacity-100' 
                                }" 
                                class="custom-scroll-panel"
                            >
                            <div class="card flex justify-content-center" id="div-lobbies">
                                <Listbox v-model="selectedLobby" @click="showJoinLobby = true" :options="lobbies" filter optionLabel="nameLobby" class="w-full md:w-14rem" id="info_lobby" />           
                            </div>

                            </ScrollPanel>  
                            </div>
                        <div class="card">
                            <Paginator :rows="5" :total-records="lobbies.length" ></Paginator>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Private Room Code -->
        <div class="container-join-room">
            <div class="card flex justify-content-center">
                <div class="flex flex-column align-items-center code">
                    <div class="font-bold text-xl mb-2 text-join-room">Pon el codigo para unirte!</div>
                    <InputOtp v-model="value" :length="6" style="gap: 0; justify-content: center; padding: 20px;" >
                        <template #default="{ attrs, events, index }">
                            <input type="text" v-bind="attrs" v-on="events" class="custom-otp-input" />
                            <div style="padding: 5px;" v-if="index === 3" class="px-3">
                                <i class="pi pi-minus" />
                            </div>
                        </template>
                    </InputOtp>
                    <div class="flex justify-content-between mt-5 align-self-stretch">
                        <Button label="Submit Code" @click="console.log(value)"></Button>
                    </div>
                </div>
            </div>
            <!-- Create Private Room -->
            <Divider type="solid" />
            <div class="button-container-createRoom">
                <div class="card flex justify-content-center">
                    <div class="font-bold text-xl mb-2 text-create-room">Crea tu propia sala!</div>
                    <Button label="Create!" @click="visible = true" />
                    <div di="modal-config-game"> 
                    </div>
                </div>
            </div>
            
            
        </div>
        
        
        <div class="card flex justify-content-center">
            <Dialog v-model:visible="visible" modal header="Config Game" :style="{ width: '25rem' }">
                <span class="p-text-secondary block mb-5">Update your information.</span>
                <Divider type="solid" />
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="username" class="font-semibold w-6rem">Name Room</label>
                    <InputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <Divider type="solid" />
                <div class="flex align-items-center radiobutton-div">
                    <RadioButton v-model="ingredient" inputId="ingredient1" name="pizza" value="Cheese" />
                    <label for="ingredient1" class="text-radiobutton">Public</label>
                    <RadioButton v-model="ingredient" inputId="ingredient2" name="pizza" value="Mushroom" />
                    <label for="ingredient2" class="text-radiobutton">Private</label>
                </div>
                <Divider type="solid" />
            <div class="flex justify-content-end gap-2 button-modal">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="visible = false"></Button>
                
                </div>
            </Dialog>
        </div>
        
       

        

                <!-- Resto del código -->
            
    </div>
    <div class="container-join-room-public">
        <div v-show="showJoinLobby && selectedLobby" class="card flex justify-content-center btn-join-lobby-public">
            <div class="container-join-public-room">
                <div class="flex justify-content-center">
                    <span v-if="selectedLobby && selectedLobby.nameLobby">{{ selectedLobby.nameLobby }}</span>
                    <Button label="Join" @click="joinPublicRoom" class="" />
                    <Button label="X" class="" @click="showJoinLobby = false" />
                </div>

            </div>
        </div>
    </div>
    
    
    
</template>

<script>
import { useAppStore } from "../stores/guestStore.js";
import { socket } from "../socket";
import { ref } from "vue";
const visible = ref(false);
export default {
    data() {
        return {
            privateRoomCode: "",
            selectedModes: null,
            selectedLobby: {},
            showModalConfig: false,
            btnRefresh: false,
            ingredient: '',
            showJoinLobby: false,
            visible: false,
            modes: [
                { name: 'puteo'},
                { name: 'default'}
            ]
        };
    },
    computed: {
        users(){
            let store = useAppStore();
            return store.getGuestInfo();
        },
        lobbies() {
            let store = useAppStore();
            return store.getLobbiesName();
        },
        updateLobbies(){
            let store = useAppStore();
            return store.updateLobbies();  
        }
        
    },
    methods: {
        createPrivateRoom() {
            // Logic to create a private room
        },
        ModalConfig(){
            this.showModalConfig = true;
        },
        joinPublicRoom() {
            if(this.selectedLobby){
                socket.emit('join', { username: this.users.username, image: this.users.image, email: this.users.email, idLobby: this.selectedLobby.idLobby})
                // this.$router.push({ path: '/play'});
            }
            // Logic to join a public room
            // socket.emit('join', { username: this.users.username, image: this.users.image, email: this.users.email})
            // this.$router.push({ path: '/play'});
        },
        refresh() {
            // Logic to refresh the public rooms

        },
        
    },
};
</script>

<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #F2F2F2;
    /* Color de fondo general */
    
}

/* */

.custom-otp-input {
    width: 48px;
    height: 48px;
    font-size: 24px;
    appearance: none;
    text-align: center;
    transition: all 0.2s;
    border-radius: 0;
    border: 1px solid var(--surface-400);
    background: transparent;
    outline-offset: -2px;
    outline-color: transparent;
    border-right: 0 none;
    transition: outline-color 0.3s;
    color: var(--text-color);
}

.btn-join-lobby-public{
    /* margin-top: 700px; */

}

.container-join-room-public{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 13vh;
}

.btn-refresh{
    top: 25%;
    font-size: 0.9em; 
    padding: 0.5em 0.5em;
}

.radiobutton-div{
    display: flex;
    justify-content: center;
    align-items: center;
}

.text-radiobutton{
    padding-left: 10px;
    padding-right: 10px;
}

.code{
    text-align: center;
}
.custom-otp-input:focus {
    outline: 2px solid var(--primary-color);
}

.text-create-room{
    padding-bottom: 20px;
    font-size: 20px;
}

.text-join-room{
    font-size: 20px;
}

.btn-create{
    padding: 10px 30px;

}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border-right-width: 1px;
    border-right-style: solid;
    border-color: var(--surface-400);
}

.container-header{
    padding: 20px;
    /* flex-direction: column; */

}

.container-principal {
    margin: auto;
    display: flex;
    justify-content: center; 
    align-items: center; 
    height: 87vh;
    padding-right: 20px;
    padding-left: 20px;
    background-image: url('../assets/Banner.png');
    background-repeat: no-repeat;
    background-position: top;
    
}

.rooms-container{
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin-top: 80px;
    max-height: 80vh;

}

.container-public-room,
.container-join-room {
    width: 95%;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 10px;
    /* height: 60vh; */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

 .container-select {
    display: flex;
    align-items: center;
    width: 22%;
} 

.input-container {
    display: flex;
    padding-top: 40px;
    align-items: center;
    margin-bottom: 20px;
    justify-content: center;
    width: 100%;
}

.btn-refesh {
    cursor: pointer;
    margin-left: 20px;
}

.container-public-room {
    border-right: 10px solid #6C5CE7;
    /* Color representativo de MathPotato */
}

.container-join-room{
    border-left: 10px solid #6C5CE7;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
}


.despegable-modes {
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

.container-svg{
    /* background-color: #333; */
    position: relative;
    width: 55%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-right: 20px;
    
}

.icon {
    transition: transform 0.3s ease-in-out;
}

.icon:hover {
    transform: rotate(180deg);
}

.header-public-room {
    display: flex;
    width: 100%;
    /* Align items to the right */
    padding: 20px;
    justify-content: right;
    align-items: end;
}

.button-container-createRoom {
    text-align: center;
    padding: 20px;

}

.title-lobbies-pub {
    font-size: 24px;
    margin-right: 10px;
    margin-right: 10px;
    color: #6C5CE7;
    /* Color representativo de MathPotato */
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

.input{
    text-align: center;
}

.container-join-room input[type="text"]::placeholder {
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
    background-color: #5A4DB3;
    /* Color representativo de MathPotato (oscurecido) */
}
</style>