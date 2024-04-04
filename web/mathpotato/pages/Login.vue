<template>
    <div id="Background">
        <div class="middle">
            <h2>Login</h2>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <Button severity="warning" @click="login" label="Log In" icon="pi pi-user" class="w-full" />
                <Button severity="contrast" @click="register" label="Sign In" icon="pi pi-user" class="w-full"  />
            
            
        </div>
    </div>
</template>

<style scoped>
    #Background {
        background-image: url(../assets/back-login-form.jpg);
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

    form {
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        font-weight: bold;
    }

    input[type="email"],
    input[type="password"],
    button {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    button {
        /* background-color: #007bff; */
        color: #ffffff;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
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
            console.log(this.error);
            if (this.error == 1) {
                this.$router.push({ path: '/rooms' });
            } else if(this.error == 0){
                alert("pinga");
            }
        },
    },
    methods: {
        register() {
            this.$router.push({ path: '/register' });
        },
        login() {
            console.log(this.email);
            const encryptedPassword = CryptoJS.SHA256(this.password).toString();
            socket.emit('login', { email: this.email, password: encryptedPassword });
        }
    },
};
</script>