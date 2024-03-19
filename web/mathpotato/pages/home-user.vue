<template>
    <div id="backgroundLogged">
        <div id="grid">
            <div id="buttons"></div>
            <Button @click="jugar" class="button_game">JUGAR!</Button>
            <!-- <Button class="button_rooms" disabled>Crear Partida</Button> -->
            <div v-if="users.image" @mouseover="showChangeSkinButton" @mouseleave="hideChangeSkinButton" class="user">
                <img :src="'./_nuxt/assets/Icon_' + users.image + '.png'" class="icon">
                <button v-if="showSkinButton" @click="changeSkin" class="change-skin-button">Cambiar Skin</button>
                <button v-if="showSkinButton" label="ChangeSkin" class="change-skin-button" @click="visible = true">Cambiar
                    Skin</button>
                <Dialog v-model:visible="visible" modal header="Selecciona la nova Icona" :style="{ width: '50rem' }"
                    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div id="Image_gallery">
                        <div><input type="radio" name="image" id="1" value="1" checked v-model="imatgeSeleccionada"><label
                                for="1"><img src="./_nuxt/assets/Icon_1.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="2" value="2" v-model="imatgeSeleccionada"><label
                                for="2"><img src="./_nuxt/assets/Icon_2.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="3" value="3" v-model="imatgeSeleccionada"><label
                                for="3"><img src="./_nuxt/assets/Icon_3.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="4" value="4" v-model="imatgeSeleccionada"><label
                                for="4"><img src="./_nuxt/assets/Icon_4.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="5" value="5" v-model="imatgeSeleccionada"><label
                                for="5"><img src="./_nuxt/assets/Icon_5.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="6" value="6" v-model="imatgeSeleccionada"><label
                                for="6"><img src="./_nuxt/assets/Icon_6.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="7" value="7" v-model="imatgeSeleccionada"><label
                                for="7"><img src="./_nuxt/assets/Icon_7.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="8" value="8" v-model="imatgeSeleccionada"><label
                                for="8"><img src="./_nuxt/assets/Icon_8.png" alt="" class="iconModal"></label></div>
                        <div><input type="radio" name="image" id="9" value="9" v-model="imatgeSeleccionada"><label
                                for="9"><img src="./_nuxt/assets/Icon_9.png" alt="" class="iconModal"></label></div>
                    </div>
                    <div class="p-d-flex p-jc-end">
                        <Button label="Confirmar" @click="guardarDades" />
                    </div>
                </Dialog>
                <p class="name">{{ users.username }}</p>
            </div>


        </div>
    </div>
</template>

<script>
import { useAppStore } from '../stores/guestStore.js';
import { socket } from '../socket';
export default {
    data() {
        return {
            showSkinButton: false,
            visible: false,
            imatgeSeleccionada: 1,
        };
    },
    computed: {
        users() {
            let store = useAppStore();
            return store.getGuestInfo();
        },
    },
    methods: {
        showChangeSkinButton() {
            this.showSkinButton = true;
        },
        hideChangeSkinButton() {
            this.showSkinButton = false;
        },
        changeSkin() {
            // Implementa la lógica para cambiar la skin aquí

            console.log('Cambiando la skin...');
        },
        jugar() {
            socket.emit('join', { username: this.users.username, image: this.users.image, email: this.users.email });

            this.$router.push({ path: '/play' });
        },
        guardarDades() {
            socket.emit('changeSkin', { email: this.users.email, foto_perfil: this.imatgeSeleccionada });
            this.visible = false;
        },
    },
}
</script>

<style scoped>
#backgroundLogged {
    background-image: url("../assets/loggedView.jpg");
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center;

}

/* #grid{
    display: grid;
} */


.button_game {
    position: absolute;
    top: 60%;
    left: 25%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(#2ecc71, #27ae60);
    /* Cambiado a verde */
    color: var(--primary-color-text);
    /* Cambiado a verde */
    font-size: 2rem;
    font-weight: bold;
    border-radius: 1rem;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.button_rooms {
    position: absolute;
    top: 70%;
    left: 25%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(#2ecc71, #27ae60);
    /* Cambiado a verde */
    color: var(--primary-color-text);
    /* Cambiado a verde */
    font-size: 2rem;
    font-weight: bold;
    border-radius: 1rem;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.icon {
    display: flex;
    border-radius: 50%;
    width: 12vw;
    right: 25vw;
    top: 40vh;
    position: absolute;
    border: 1px solid black;
    background-color: blanchedalmond;
    margin: 0;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

}

.change-skin-button {
    display: flex;
    width: 6vw;
    right: 28vw;
    top: 55vh;
    background-color: red;
    color: white;
    position: absolute;
    border: 1px solid black;
    margin: 0;
    font-size: 1rem;
    padding: 0.5rem;
    border: none;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.icon:hover {
    opacity: 80%;
}

#Image_gallery {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 50vw;
    margin-left: auto;
    margin: auto;
}

.iconModal {
    width: 10vw;
}

input[type="radio"] {
    display: none;
}

input[type="radio"]:checked+label>img {
    border: 2px solid #000;
}

.name {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    right: 29vw;
    top: 65vh;
    justify-content: center;
    font-size: 2vw;
    font-weight: bold;
    color: white;

}</style>
../socket.js