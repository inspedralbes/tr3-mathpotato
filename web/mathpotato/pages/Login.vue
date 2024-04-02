<template>
    <div id="Background">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6 middle">
            <div class="text-center mb-5">
                <img src="../assets/LePotata.png" alt="Image" height="50" class="mb-3" />
                <div class="text-900 text-3xl font-medium mb-3">Benvingut!</div>
                <span class="text-600 font-medium line-height-3">Don't have an account?</span>
                <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="Register">Create today!</a>
            </div>

            <div>
                <label for="email1" class="block text-900 font-medium mb-2">Email</label>
                <InputText id="email1" type="text" class="w-full mb-3" v-model="email" />

                <label for="password1" class="block text-900 font-medium mb-2">Password</label>
                <InputText id="password1" type="password" class="w-full mb-3" v-model="password" />

                <div class="flex align-items-center justify-content-between mb-6">
                    <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
                </div>

                <Button @click="Loggin" label="Sign In" icon="pi pi-user" class="w-full"></Button>
            </div>
        </div>
    </div>
</template>
<style scoped> #Background {
     background-image: url(../assets/landing_background.png);
     background-repeat: no-repeat;
     background-size: cover;
     background-position: center;
     height: 100vh;
     opacity: 80%;
     width: 100vw;
     z-index: -1;
 }

 .middle {
     margin: auto;
     width: 50%;
     padding: 10px;
 }
</style>
<script>
import { useAppStore } from '../stores/guestStore.js';
import { socket } from '../socket';
import CryptoJS from 'crypto-js'

export default {
    data() {
        return {
            email: '',
            password: '',
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
                this.$router.push({ path: '/rooms' });
                
            } else {
                alert('Invalid credentials. Please try again.');
            }
        },
    },
    methods: {
        Register() {

            this.$router.push({ path: '/register' });

        },
        handleUserList(users) {
            this.users = users;
            console.log(this.users);
        },
        Loggin() {
            console.log(this.email);
            const encryptedPassword = CryptoJS.SHA256(this.password).toString();
            socket.emit('login', { email: this.email, password: encryptedPassword });
        }
    },
};
</script>