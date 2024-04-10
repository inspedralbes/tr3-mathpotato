<template>
    <div class="card">
        <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
            
            <template #start>
                <div class="flex align-items-center gap-3 navbar">
                    <Button label="Ranking" @click="RankingView()" text plain/>
                    <Button label="Logros" @click="LogrosView()" text plain/>
                </div>
            </template>
            <template #end>
                <div class="flex align-items-center gap-3 navbar">
                    <Button v-if="guest.email == 'none'" label="login" @click="login()" severity="contrast" size="small" style="right: 20px; bottom: 3px;" />
                    <Avatar v-else @click="visibleRightprofile = true" class="p-overlay-badge" :image="'./_nuxt/assets/Icon_'+guest.image+'.png'"  size="large" style="cursor: pointer; " />
                </div>
            </template>
        </Toolbar>
    </div>
    <div class="card flex justify-content-center">
        <Dialog v-model:visible="visibleRanking" modal header="Ranking" :style="{ width: '50rem'}">
            <div >
                <div v-if="guest.email == 'none'">
                    <Message :closable="false">Si quieres que se guarden tus estadisticas, ¡logueate!</Message>
                </div>
                <div  class="container-ranking">
                    <span>Rank</span>
                    <span>Username</span>
                    <span>Victories</span>
                    <span>% Victories</span>
                </div>    
                <Divider type="solid" />
                <div  class="flex align-items-center gap-3 mb-3 data-ranking">
                    <div class="ranking">
                        <div v-for="(player, index) in ranking.ranking" :key="player.id" class="player-card"
                            :class="{ 'highlighted': guest.username===player.username ,'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }">
                            <span class="rank">{{ index + 1 }}. </span>
                            <span class="username-rank">{{ player.username }}</span>
                            <span class="victories"> <span class="victories-number">{{ player.num_victorias }}</span></span>
                            <span class="victories-porcentaje"> <span class="victories-number-porcentaje">{{ calculateVictoryPercentage(player) }}</span></span>
                            <!-- {{ rankingSocket(player) }} -->
                        </div>
                    </div>
                </div>
            </div>
            
            
            
                <!-- <div class="flex align-items-center gap-3 mb-3">
                    <DataTable :value="ranking.ranking" @click="console.log(getRanking())" paginator :rows="5" :rowsPerPageOptions="[5, 10]" tableStyle="min-width: 50rem">
                        <Column field="username" header="Username" style="width: 33%;"></Column>
                        <Column field="num_victorias" header="Victorias" style="width: 33%;"></Column>
                        <Column field="'victoriesPercentage'" header="% Victorias" style="width: 33%;"></Column>
                    </DataTable>
                </div> -->
                <Divider type="solid" />
                
            <div class="flex justify-content-end gap-2 button-modal">
                <Button type="button" label="Salir" severity="danger" @click="visibleRanking = false"></Button>
            </div>
        </Dialog>
    </div>
    <div class="card flex justify-content-center">
        <Dialog v-model:visible="visibleLogros" modal header="Logros" :style="{ width: '70rem'}">
            <div>
                <div v-if="guest.email == 'none'">
                    <Message :closable="false">Para obtener recompensas debes logearte!</Message>
                    <div class="card flex justify-content-center">
                        <div class="flex justify-center items-center">
                            
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div>

                    </div> 
                </div>
            </div>
            <div class="flex justify-content-end gap-2 button-modal">
                <Button type="button" label="Salir" severity="danger" @click="visibleLogros = false"></Button>
            </div>
        </Dialog>
    </div>
    <Sidebar v-model:visible="visibleRightprofile" position="right">
            <div class="">
                <div v-if="guest.image" @mouseover="showChangeAvatar" class="user-avatar" :style="{ height: avatarHeight }">
                    <Avatar :image="'./_nuxt/assets/Icon_' + guest.image + '.png'" shape="circle" class="avatar-edit" style="width: 250px; height: 250px; margin-left: auto; margin-right: auto; display: block; border-radius: 50%; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);" />
                    <br>
                    <Fieldset legend="Cambiar Skin" :toggleable="true" :collapsed="true" >
                        <p class="m-0">
                            <div id="image_gallery" >
                                <div>
                                    <input type="radio" name="image" id="1" value="1" v-model="imatgeSeleccionada">
                                    <label for="1"><Avatar :image="'./_nuxt/assets/Icon_1.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="2" value="2" v-model="imatgeSeleccionada">
                                    <label for="2"><Avatar :image="'./_nuxt/assets/Icon_2.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="3" value="3" v-model="imatgeSeleccionada">
                                    <label for="3"><Avatar :image="'./_nuxt/assets/Icon_3.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="4" value="4" v-model="imatgeSeleccionada">
                                    <label for="4"><Avatar :image="'./_nuxt/assets/Icon_4.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="5" value="5" v-model="imatgeSeleccionada">
                                    <label for="5"><Avatar :image="'./_nuxt/assets/Icon_5.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="6" value="6" v-model="imatgeSeleccionada">
                                    <label for="6"><Avatar :image="'./_nuxt/assets/Icon_6.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="7" value="7" v-model="imatgeSeleccionada">
                                    <label for="7"><Avatar :image="'./_nuxt/assets/Icon_7.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="8" value="8" v-model="imatgeSeleccionada">
                                    <label for="8"><Avatar :image="'./_nuxt/assets/Icon_8.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                                <div>
                                    <input type="radio" name="image" id="9" value="9" v-model="imatgeSeleccionada">
                                    <label for="9"><Avatar :image="'./_nuxt/assets/Icon_9.png'" shape="circle" class="avatar-edit" style="width: 65px; height: 65px; margin-left: auto; margin-right: auto; display: block;" /></label>
                                </div>
                            
                            </div>
                            <Button label="save" @click="updateSkin" class="buttonSave" />
                        </p>
                    </Fieldset>
                    <Divider style="padding-top: 40px;" type="solid" />
                    <div class="card" style="padding-bottom: 10px;">
                        <span class="username-edit" >Username: </span>
                    </div>
                <Inplace>
                    <template #display>
                        {{ text || guest.username }}
                    </template>
                    
                    <template #content>
                        <div class="justify-content-center edit-name">
                            
                            <InputText v-model="text" style="width: 70%;" @input="show=true" />
                            <Button v-if="show" label="save" @click="btnEditUsername(); show = false"></Button>
                        </div>
                    </template>
                </Inplace>
                    <div class="card" style="padding-top: 20px; padding-bottom: 10px;">
                        <span class="" >Email: </span>
                    </div>
                    <InputText v-model="guest.email" disabled style="width: 100%;" />
                    <div class="card flex justify-content-center" style="padding-top: 20px; padding-bottom: 10px;">
                        <span >Sugerencias de mejora: </span>
                    </div>
                    <Textarea v-model="value_sugerencias" autoResize rows="5" cols="28" style="width: 100%;"/>
                    <Button v-if="value_sugerencias != ''" label="enviar" @click="enviarSugerencias" />
                    <div class="card flex justify-content-center logros" style="padding-top: 20px;">
                        <div class="lg1">
                            <Tag value="15 partidas ganadas" severity="danger"></Tag>
                        </div>
                        <div class="lg2">
                            <Tag value="20 partidas jugadas" severity="warning"></Tag>
                        </div>
                        <div class="lg3">
                            <Tag value="3 partidas seguidas ganadas" severity="info"></Tag>
                        </div>
                    </div>
                    <div class="card flex justify-content-center">
                        <div class="btn-sign-out">
                            <Button @click="confirm()" label="Sign Out" severity="danger" outlined style=""></Button>
                        </div>
                    </div>
                    <Toast />
                <ConfirmDialog></ConfirmDialog>
                
            </div>
                
        </div>
    </Sidebar>
    <div class="container-principal">
        <div class="rooms-container">
            <div class="container-public-room">
                <div>
                    <Message :closable="false">Puedes unirte a las salas publicas que han creado otros usuarios</Message>
                </div>
                <div class="content-public-room">
                    <div class="card">
                        <div class="flex flex-column md:flex-row gap-5">
                            <div class="flex-auto">
                                <ScrollPanel style="width: 100%; height: 300px" :pt="{
                        wrapper: {
                            style: { 'border-right': '10px solid var(--surface-ground)' }
                        },
                        bary: 'hover:bg-primary-400 opacity-100'
                    }" class="custom-scroll-panel">
                                    <div class="card flex justify-content-center" id="div-lobbies">
                                        <Listbox v-model="selectedLobby"
                                            :options="lobbies" filter optionLabel="nameLobby" class="w-full md:w-14rem"
                                            id="info_lobby" />
                                    </div>

                                </ScrollPanel>
                            </div>
                            <div class="card">
                                <Paginator :rows="5" :total-records="lobbies.length"></Paginator>
                            </div>
                            <!-- <Divider type="solid" /> -->
                            <div class="card btn-jugar-rapido">
                                <Button label="Jugar rapido!" @click="playfast" />
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
                    <div class="font-bold text-xl mb-2 text-join-room">¡Pon el codigo para unirte!</div>
                    <div v-if="visibleError">
                        <span class="text-red-500">¡Sala no encontrada!</span>
                    </div>
                    <InputOtp v-model="value" :length="6" style="gap: 0; justify-content: center; padding: 20px;" :invalid="true">
                        <template #default="{ attrs, events, index }">
                            <input type="text" v-bind="attrs" v-on="events" class="custom-otp-input" />
                            <div style="padding: 5px;" v-if="index === 3" class="px-3">
                                <i class="pi pi-minus" />
                            </div>
                        </template>
                    </InputOtp>
                    <div class="flex justify-content-between mt-5 align-self-stretch">
                        <Button label="Submit Code" @click="joinRoomByCode(value)"></Button>
                    </div>
                </div>
            </div>
            <!-- Create Private Room -->
            <Divider type="solid" />
            <div class="button-container-createRoom">
                <div class="card flex justify-content-center">
                    <div class="font-bold text-xl mb-2 text-create-room">Crea tu propia sala!</div>
                    <Button label="Crear!" @click="visible = true" />
                    <div di="modal-config-game"> 
                    </div>
                </div>
            </div>


        </div>


        <div class="card flex justify-content-center">
            <Dialog v-model:visible="visible" modal header="Configuración de sala" :style="{ width: '25rem' }">
                <Divider type="solid" />
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="nameRoom" class="font-semibold w-6rem ">Nombre de la sala</label>
                    <InputText v-model="nameRoom" id="name" class="flex-auto" autocomplete="off" />
                </div>
                <Divider type="solid" />
                <div class="flex align-items-center radiobutton-div">
                    <RadioButton v-model="option" inputId="option1" name="option" value=false />
                    <label for="option1" class="text-radiobutton">Publica</label>
                    <RadioButton v-model="option" inputId="option2" name="option" value=true />
                    <label for="option2" class="text-radiobutton">Privada</label>
                </div>
                <Divider type="solid" />
                <div class="flex justify-content-end gap-2 button-modal">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Crear" @click="createGame()"></Button>

                </div>
            </Dialog>
        </div>
        <!-- Resto del código -->

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
            visibleError: false,
            privateRoomCode: "",
            value_sugerencias: '',
            selectedModes: null,
            showbtn: false,
            avatarHeight: '350px',
            showEditbtn: false,
            text: null,
            selectedLobby: {},
            showModalConfig: false,
            btnRefresh: false,
            option: '',
            imatgeSeleccionada: '1',
            visibleRightprofile: false,
            selectedModecreate: '',
            showJoinLobby: false,
            visible: false,
            visibleRanking: false,
            visibleLogros: false,
            modes: [
                { name: 'puteo' },
                { name: 'default' }
            ],
            username: '',
            show:true,
        };
    },
    computed: {
        users() {
            let store = useAppStore();
            return store.getGuestInfo();
        },
        lobbies() {
            let store = useAppStore();
            return store.getSalas();
        },
        updateLobbies() {
            let store = useAppStore();
            return store.updateLobbies();
        },
        guest() {
            let store = useAppStore();
            return store.getGuestInfo();
        },
        ranking(){
            let store = useAppStore();
            return store.getRanking();
        },
        updateProfile(){
            let store = useAppStore();
            return store.getUpdateProfile();
        },
    },
    watch: {
        selectedLobby() {
            console.log(this.selectedLobby.id);
            this.joinRoomByCode(this.selectedLobby.id);
        }
    },
    methods: {
        RankingView(){
            this.visibleRanking = true;

        },  
        LogrosView(){
            this.visibleLogros = true;
        },
        calculateVictoryPercentage(player) {
            const percentage = player.num_victorias / (player.num_victorias + player.num_derrotas) * 100;
            return isNaN(percentage) ? 0 : Math.round(percentage);
        },
        confirm() {
            this.$confirm.require({
                message: '¿Seguro que quieres cerrar sesión?',
                header: 'Log Out',
                icon: 'pi pi-info-circle',
                rejectLabel: 'No',
                acceptLabel: 'Si',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.$toast.add({ severity: 'info', summary: 'Confirmado', detail: '¡Sesión cerrada correctamente!', life: 5000 });
                    this.logout();
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Cancelado', detail: '¡Cierre de sesión cancelado!', life: 4000 });
                }
            });
        },
        showChangeAvatar(){
            this.showbtn = true;
        },
        hideChangeAvatar(){
            this.showbtn = false;
        },
        changeSkin(){
            this.avatarHeight = '550px';
            
        },
        createGame() {
            this.visible = false;
            // Logic to create a private room
            socket.emit('createGame', { name: this.nameRoom, mode: this.selectedModecreate, private: this.option, waitUntilFull: '', MaxPlayers: 6 });
            // this.$router.push({ path: '/play'});
            console.log("pepepeppepepep");
        },
        ModalConfig() {
            this.showModalConfig = true;
        },
        joinPublicRoom() {
            if (this.selectedLobby) {
                if (this.guest.email === 'none') {
                    this.username = 'guest_' + Math.floor(Math.random() * 1000000);
                    this.username = this.username.slice(0, 20);
                    socket.emit('join', { idLobby: this.selectedLobby.idLobby, username: this.username, image: 1, email: "none", tutorial: true })
                } else {
                    socket.emit('join', { idLobby: this.selectedLobby.idLobby, username: this.guest.username, image: this.guest.image, email: this.guest.email, tutorial: this.guest.tutorial })
                }

                // Logic to join a public room
                // socket.emit('join', { username: this.users.username, image: this.users.image, email: this.users.email})
                // this.$router.push({ path: '/play'});
            }
        },
        joinRoomByCode(code) {
            // Logic to join a private room
            if (this.guest.email === 'none') {
                this.username = 'guest_' + Math.floor(Math.random() * 1000000);
                this.username = this.username.slice(0, 20);
                console.log("PINGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",code);
                socket.emit('join', { idLobby: code, username: this.username, image: 1, email: "none", tutorial: true })
            } else {
                socket.emit('join', { idLobby: code, username: this.guest.username, image: this.guest.image, email: this.guest.email, tutorial: this.guest.tutorial })
            }
        },
        playfast() {
            if (this.guest.email === 'none') {
                this.username = 'guest_' + Math.floor(Math.random() * 1000000);
                this.username = this.username.slice(0, 20);
                socket.emit('join', { username: this.username, image: 1, email: 'none', tutorial: true }) 
                this.$router.push({ path: '/play'});
            }
        },

        
            // document.getElementById(this.guest.image).checked = true;
        setCheckedOnUserImage() {
            console.log('image:', this.guest.image);
            
            const imageElement = document.getElementById(this.guest.image);
            if (imageElement) {
                
                imageElement.checked = true;
            }
        },
        login() {
            this.$router.push({ path: '/login' });
        },
        async enviarSugerencias(){
            console.log('enviando sugerencias de...', this.value_sugerencias, this.guest.email);
            socket.emit('sugerencias', { sugerencia: this.value_sugerencias, usuario_email: this.guest.email});
            this.$toast.add({ severity: 'success', summary: 'Sugerencias enviadas', detail: 'Gracias por tu aportación', life: 3000 });
            this.value_sugerencias = '';
        },
        async btnEditUsername(){
            this.show = false;
            console.log(this.text);
            console.log('update username...');
            socket.emit('updateProfile', { email: this.guest.email, username: this.text, foto_perfil: this.guest.image });
            this.$toast.add({ severity: 'success', summary: 'Username cambiado', detail: 'Tu username ha sido cambiado con éxito', life: 3000 });
        },
        async updateSkin(){
            console.log('cambiando la skin...');
            socket.emit('updateProfile', { email: this.guest.email, username: this.guest.username, foto_perfil: this.imatgeSeleccionada });
            console.log('skin cambiada!');
            this.$toast.add({ severity: 'success', summary: 'Skin cambiada', detail: 'Tu skin ha sido cambiada con éxito', life: 3000 });
            // this.updateProfile();
        },
        async logout(){
            console.log(this.guest.email);
            socket.emit('logout', { email: this.guest.email, token: this.guest.token });
        },               
    },
    watch: {
        ranking(){
            console.log('ranking:', this.ranking.ranking[0].username);
        }

    },
    mounted() {
        socket.emit('getSalas');
        socket.on('roomDone', (data) => {
            
            this.joinRoomByCode(data.id);
        });
        socket.on('joinError', (data) => {
            this.visibleError = true;
        });
        socket.on('userJoined', (data) => {
            console.log(data);
            this.$router.push({ path: '/play' });
        });
        if(this.guest.email !== 'none'){
            this.setCheckedOnUserImage();
        }
        socket.emit('getRanking');

        // this.getRanking();
        setInterval(this.data, 60000);
    },
    beforeDestroy(){
        clearInterval(this.intervalId);
    }
};
</script>

<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #F2F2F2;
        
}
#changeButton{
    top: 20px;
    display: block;
    margin-right: auto;
    margin-left: auto;
}

#image_gallery{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
}




.data-ranking {
        width: 100%;
        font-family: Arial, sans-serif;
    }

    /* Estilos de cada tarjeta de jugador */
    .player-card {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
        margin-bottom: 5px;
    }

    /* Estilos de fila par */
    .even-row {
        background-color: #f2f2f2;
    }

    /* Estilos de fila impar */
    .odd-row {
        background-color: #e6e6e6;
    }

    .highlighted{
    background-color:#ffa600b8;
}
    /* Estilos del número de rango */
    .rank {
        font-weight: bold;
        margin-right: 10px;
    }

    /* Estilos del nombre de usuario */
    .username {
        flex: 1;
        margin-right: 10px;
    }

    .lock-logros{
        display: block;
        margin-left: left;
        margin-right: right;
    }

    .logros{
        display: block;
        width: 100%;
    }

    .lg1{
        justify-content: center;
        align-items: center;
        padding-bottom: 5px;
    }

    .lg2{
        justify-content: center;
        align-items: center;
        padding-bottom: 5px;
    }

    .lg3{
        justify-content: center;
        align-items: center;
        padding-bottom: 5px;
    }

    /* Estilos del número de victorias */
    .victories {
        margin-right: 10px;
    }

    /* Estilos del porcentaje de victorias */
    .victories-porcentaje {
        margin-right: 10px;
    }

    /* Estilos del número de victorias y porcentaje */
    .victories-number,
    .victories-number-porcentaje {
        font-weight: bold;
    }

    /* Estilos para los primeros tres lugares */
    .player-card:nth-child(-n+1) .rank::before {
        content: ' 🥇';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        border-radius: 30%;
    }

    .player-card:nth-child(n+2) .rank::before {
        content: ' 🥈';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
    }

    .player-card:nth-child(n+3) .rank::before {
        content: ' 🥉';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        border-radius: 30%;
    }

    .player-card:nth-child(n+4) .rank::before {
        content: ' ';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        border-radius: 30%;
    }

    .player-card:nth-child(n+5) .rank::before {
        content: ' ';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        border-radius: 30%;
    }

    .player-card:nth-child(1) .rank::before {
        /* background-color: gold; */
    }

    .player-card:nth-child(2) .rank::before {
        /* background-color: silver;  */
    }

    .player-card:nth-child(3) .rank::before {
        /* background-color: #cd7f32;  */
    }

.container-ranking{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-content: center;
    align-items: center;
}

.btn-jugar-rapido{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}



.p-inplace-display{
    color: #ffa500;
}

.btn-sign-out{
    display: flex;
    position: absolute;
    justify-content: center;
    /* margin-top: auto; */
    margin-top: 25%;
    margin-left: 50%;
    /* margin-bottom: auto; */

}

input[type="radio"]{
    display: none;
}

.avatar-edit{
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

input[type="radio"]:checked + label>.avatar-edit{
    border: 2px solid #007bff;
}

.p-fieldset-legend{
    background-color: #0ec69bc9;
    width: 100%;
    padding: 0;
}
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

.btn-edit-name{
    /* width: 70%; */
    margin-left: auto;
    margin-right: auto;
}

.avatar-edit:hover{
    opacity: 0.6;
    cursor: pointer;
}

.edit-name{
    display: inline-block;
}

.btn-login {
    cursor: pointer;
}

.navbar {
    /* padding: 10px; */
    padding-right: 30px;
}

.container-join-room-public {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 13vh;
}

.btn-refresh {
    top: 25%;
    font-size: 0.9em;
    padding: 0.5em 0.5em;
}

.text-red-500{
    color: red;

}

.radiobutton-div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.text-radiobutton {
    padding-left: 10px;
    padding-right: 10px;
}

.code {
    text-align: center;
}

.custom-otp-input:focus {
    outline: 2px solid var(--primary-color);
}

.text-create-room {
    padding-bottom: 20px;
    font-size: 20px;
}

.text-join-room {
    font-size: 20px;
}

.btn-create {
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

.container-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: right;
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

.rooms-container {
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

.p-toolbar p-component{
    border-radius: none;
}

.container-public-room {
    border-right: 10px solid #f0af4e;
    /* Color representativo de MathPotato */
}

.container-join-room {
    border-left: 10px solid #f0af4e;
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

.container-svg {
    /* background-color: #333; */
    position: relative;
    width: 55%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-right: 20px;

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

.input {
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

.buttonSave{
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-top: 6%;
    margin-bottom: 2%;
}

.p-fieldset-content{
    padding: 0;
}
</style>