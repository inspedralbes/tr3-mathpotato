<template>
    <div>
      <div id="background_page" class="flex flex-row justify-content-between h-100vh">
        <!-- Logo a la izquierda -->
        <div class="flex flex-column align-items-center ">
            <Button @click="login()" class="button_login" label="LOG IN" />
            <Button @click="RankingView()" class="button_ranking" label="RANKING"></Button>
        </div>
        <div class="flex flex-column align-items-center justify-content-center">
          <img v-show="currentLogo === 'logo1'" src="../assets/LePotata.png" alt="logo" class="logo_pos move-forward" />
          <img v-show="currentLogo === 'logo2'" src="../assets/animationPotato.png" alt="logo" class="logo_pos" />
  
          <!-- <span class="text-3xl font-bold">Math Potato</span> -->
        </div>
        <!-- Botón "JUGAR!" a la derecha -->
        <div class="flex flex-column align-items-center justify-content-center">
          <Button @click="jugar()" class="button_game" label="JUGAR!" size="large" />
        </div>
      </div>
      
    </div>
</template>

<style scoped>

/*slidedown-icon*/

@keyframes slidedown-icon {
    0% {
        transform: translateY(0);
    }

    10% {
        transform: translateY(20px);
    }
}
.slidedown-icon {
    animation: slidedown-icon;
    animation-duration: 3s;
    animation-iteration-count: infinite;
}

/*animation potato*/

@keyframes movePotato {
    0% {
        transform: translateX(0);
        content: url('../assets/LePotatadinamita-new.png');
        left: 3%;
        top: 20%;
    }
    10%{
        transform: translateX(3px);
        content: url('../assets/animationPotatoDinamita-new3.png');
        left: 6%;
        top: 23%;
    }
    20%{
        transform: translateX(6px);
        content: url('../assets/LePotatadinamita-new.png');
        left: 9%;
        top: 20%;
    }
    30%{
        transform: translateX(9px);
        content: url('../assets/animationPotatoDinamita-new3.png');
        left: 12%;
        top: 23%;
    }
    40%{
        transform: translateX(12px);
        content: url('../assets/LePotatadinamita-new.png');
        left: 15%;
        top: 20%;
    }
    50%{
        transform: translateX(15px);
        content: url('../assets/animationPotatoDinamita-new3.png');
        left: 18%;
        top: 23%;
    }
    60%{
        transform: translateX(18px);
        content: url('../assets/LePotatadinamita-new.png');
        left: 21%;
        top: 20%;
    }
    70%{
        transform: translateX(21px);
        content: url('../assets/animationPotatoDinamita-new3.png');
        left: 24%;
        top: 23%;
    }
    80%{
        transform: translateX(24px);
        content: url('../assets/dinamita_1.png');
        left: 27%;
        top: 20%;
    }
    90%{
        transform: translateX(27px);
        content: url('../assets/dinamita-new_2.png');
        left: 30%;
        top: 23%;
    }

    100% {
        transform: translateX(30px);
        content: url('../assets/dinamita_3.png');
        left: 33%;
        top: 20%;

    }
}

.logo_pos {
    position: absolute;
    top: 20%;
    left: 4%;
    width: 38vw;
    transform: translate(-50%, -50%);
    animation: movePotato 10s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
}

/* .move-forward {
    animation: movePotato 2s ease-in-out infinite;
} */

.button_game {
    position: absolute;
    top: 60%;
    left: 75%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(#2ecc71, #27ae60); /* Cambiado a verde */
    color: var(--primary-color-text); /* Cambiado a verde */
    font-size: 2rem;
    font-weight: bold;
    border-radius: 1rem;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.button_login {
    position: absolute;
    top: 5%;
    left: 93%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(var(--primary-300), var(--primary-600));
    color: var(--primary-color-text);
    font-size: 1rem;
    font-weight: bold;
    border-radius: 1rem;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.button_ranking {
    position: absolute;
    top: 5%;
    left: 7%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(var(--primary-300), var(--primary-600));
    color: var(--primary-color-text);
    font-size: 1rem;
    font-weight: bold;
    border-radius: 1rem;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

#background_page {
    background-image: url(../assets/landing_background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    opacity: 80%;
    width: 100vw;
    z-index: -1;
}

.box {
    background-image: radial-gradient(var(--primary-300), var(--primary-600));
    color: var(--primary-color-text);
}

</style>

<script>
export default {
    data() {
        return {
            currentLogo: 'logo1',
            isMoving: true
        };
    },
    mounted() {
        setInterval(() => {
            if (this.isMoving) {
                this.currentLogo = this.currentLogo === 'logo1' ? 'logo2' : 'logo1';
            }
        }, 10000);
    },
    methods: {
        stopMoving() {
            this.isMoving = false;
        },
        jugar() {
            this.$router.push({ path: '/guest' });
        },
        login() {
            this.$router.push({ path: '/login' });
        },
        RankingView() {
            this.$router.push({ path: '/ranking' });
        }

    }
};
</script>
