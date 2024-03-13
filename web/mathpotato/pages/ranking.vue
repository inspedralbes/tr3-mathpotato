<template>
    <div>
        <div id="background_page" class="flex flex-column justify-content-center align-items-center h-100vh">
            <!-- Logo a la izquierda -->
            <div class="logo-container">
                <Button @click="tornar()" class="button_login" label="TORNAR"></Button>
            </div>

            <div class="ranking">
                <div v-for="(player, index) in ranking.ranking" :key="player.id" class="player-card"
                    :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }">
                    <span class="rank">{{ index + 1 }}. </span>
                    <span class="username">{{ player.username }}</span>
                    <span class="victories">Victorias: <span class="victories-number">{{ player.num_victorias
                    }}</span></span>
                    <span class="victories-porcentaje">% Victorias: <span class="victories-number-porcentaje">{{ calculateVictoryPercentage(player) }}</span></span>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
/* Estilos para el fondo y el diseño general */
#background_page {
    background-image: url(../assets/landing_background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    opacity: 0.8;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.logo-container {
    position: absolute;
    top: 5%;
    left: 5%;
    z-index: 1;
}

/* Estilos para el botón de login */
.button_login {
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

/* Estilos para el ranking y los jugadores */
.ranking {
    width: 80%;
    max-width: 800px;
    margin-top: 10vh;
    margin-bottom: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.ranking::-webkit-scrollbar {
    display: none;
}

.player-card {
    background-color: #f9f9f9;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 15px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

    .player-card.even-row {
        background-color: #f0f0f0;
    }

.rank {
    font-weight: bold;
    margin-right: 10px;
    margin-left: 2vw;
    text-align: center;
}

.username {
    flex-grow: 1;
}

.victories {
    margin-right: 5vw;
    color: #555;
    display: flex;
    justify-content: space-between;
}

.victories-porcentaje {
    margin-right: 1vw;
    color: #555;
    display: flex;
    justify-content: space-between;
}

.victories-number {
    font-weight: bold;
    color: #007bff;
    text-align: right;
}

.victories-number-porcentaje {
    font-weight: bold;
    color: #007bff;
    display: flex;
    text-align: right;
}

</style>
  
<script>
import { socket } from '../socket';
import { useAppStore } from '../stores/guestStore.js';
export default {
    computed: {
        ranking() {
            const store = useAppStore();
            return store.getRanking();
        }
    },
    methods: {
        getRanking() {
            console.log('getRanking');
            socket.emit('getRanking');
        },
        calculateVictoryPercentage(player) {
            const percentage = player.num_victorias / (player.num_victorias + player.num_derrotas) * 100;
            return isNaN(percentage) ? 0 : Math.round(percentage);
        },
        tornar() {
            this.$router.push({ path: '/' });
        }
    },
    watch: {
        ranking() {
            console.log('ranking', this.ranking.ranking[0].username);
        }
    },
    mounted() {
        this.getRanking();
        setInterval(this.getRanking, 60000);
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    }
};
</script>
  