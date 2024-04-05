<template>
    <div id="Background">
        <div class="middle">
            <h2>Sign In</h2>
            <div class="form-group">
                <label for="username">Usuario: <InlineMessage>Usuario requerido</InlineMessage></label>
                <input id="username" type="text" v-model="username" required>
                
            </div>
            <div class="form-group">
                <label for="email">Email: <InlineMessage>Email requerido</InlineMessage></label>
                <input id="email" type="email" v-model="email" required >
                
            </div>
            <div class="form-group">
                <label for="password">Contraseña: <InlineMessage>Contraseña requerida</InlineMessage></label>
                <input id="password" type="password" v-model="password" required>
                
            </div>
            <div class="form-group">
                <label for="password">Confirmación contraseña: <InlineMessage>Confirmación de usuario requerida</InlineMessage></label>
                <input id="password" type="password" v-model="passwordConfirmation" required>
                
            </div>
            <Divider type="solid" />
            <div class="card flex justify-content-center btn-chooseSkin">
                <Button label="Choose skin" @click="visibleChangeSkin = true" />
                <Dialog v-model:visible="visibleChangeSkin" modal header="Elige Tu Skin!" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <Divider type="solid" />
                    <div class="0">
                        <p>Selecciona</p>
                        <div id="image_gallery">
                            <div>
                                <input type="radio" name="image" id="1" value="1" checked v-model="imatgeSeleccionada">
                                <label for="1"><Avatar :image="'./_nuxt/assets/Icon_1.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="2" value="2" v-model="imatgeSeleccionada">
                                <label for="2"><Avatar :image="'./_nuxt/assets/Icon_2.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="3" value="3" v-model="imatgeSeleccionada">
                                <label for="3"><Avatar :image="'./_nuxt/assets/Icon_3.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="4" value="4" v-model="imatgeSeleccionada">
                                <label for="4"><Avatar :image="'./_nuxt/assets/Icon_4.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="5" value="5" v-model="imatgeSeleccionada">
                                <label for="5"><Avatar :image="'./_nuxt/assets/Icon_5.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="6" value="6" v-model="imatgeSeleccionada">
                                <label for="6"><Avatar :image="'./_nuxt/assets/Icon_6.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="7" value="7" v-model="imatgeSeleccionada">
                                <label for="7"><Avatar :image="'./_nuxt/assets/Icon_7.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="8" value="8" v-model="imatgeSeleccionada">
                                <label for="8"><Avatar :image="'./_nuxt/assets/Icon_8.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            <div>
                                <input type="radio" name="image" id="9" value="9" v-model="imatgeSeleccionada">
                                <label for="9"><Avatar :image="'./_nuxt/assets/Icon_9.png'" shape="circle" class="avatar-edit" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; display: block;" /></label>
                            </div>
                            
                        </div>
                        <Button label="Guardar" icon="pi pi-save" @click="visibleChangeSkin = false" />
                    </div>
                    
                </Dialog>
            </div>
            
                
            <div class="btn-div">
                <Button severity="info" label="Sign In" icon="pi pi-user" class="w-full" @click="register" text raised></Button>
            </div>
            </div>
        </div>

</template>
<style scoped>
    #Background {
        background-image: url(../assets/back-register-form.png);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #f0f0f0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .middle {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    #image_gallery{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2px;
    }

    input[type="radio"]{
        display: none;
    }
    .avatar-edit{
        background-color: blanchedalmond;
        border: 1px solid black;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    }

    input[type="radio"]:checked + label>.avatar-edit{
        border: 2px solid #007bff;
    }
    
    form {
        margin-bottom: 20px;
    }

    .btn-chooseSkin{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        font-weight: bold;
    }

    .btn-div{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type="email"],
    input[type="password"],
    input[type="text"] {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        /* border: 1px solid #ccc; */
        box-sizing: border-box;
    }

    button {
        width: 50%;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        /* border: 1px solid #ccc; */
        box-sizing: border-box;
        cursor: pointer;
    }

    .success-message {
        color: #4caf50;
    }

    .error-message {
        color: #ef0f0f;
    }

    
</style>

<script>
import { useAppStore } from '../stores/guestStore.js';
import { socket } from '../socket';
import CryptoJS from 'crypto-js'


export default {

    data() {
        return {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            imatgeSeleccionada: '1',
            tutorial: true,
            visibleChangeSkin: false,

        };
    },
    computed: {
        error() {
            let store = useAppStore();
            return store.getError();
        },
    },
    watch: {
        error() {
            if (this.error == 1) {
                this.$router.push({ path: '/rooms' })
            } else {
                alert('Invalid credentials. Please try again.');
            }
        },
    },
    methods: {
        Login() {
            this.$router.push({ path: '/login' });

        },
        handleUserList(users) {
            this.users = users;
            console.log(this.users);
        },
        register() {
            let user = {
                "username": this.username.slice(0, 20),
                "email": this.email,
                "password": CryptoJS.SHA256(this.password).toString(),
                "password_confirmation": CryptoJS.SHA256(this.passwordConfirmation).toString(),
                "foto_perfil": this.imatgeSeleccionada,
            };
            socket.emit('register', user);
        }
    },
}
</script>