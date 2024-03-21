<template>
  <div id="page1" class="explain" v-if="page === 1">
    Benvingut a Mathpotato! Aquest joc consisteix en respondre preguntes de matemàtiques per passar la patata, evitant
    explotar
  </div>
  <div id="page2" class="explain" v-else-if="page == 2">
    Per començar, selecciona una imatge de perfil
  </div>
  <div class="explanationSection">
    <button @click="changeBomb()">as</button>
    <div id="background">
      <div id="grid">
        <div id="topmid">
          <div class="user topmid" id="user0">
            <div class="imageContainer">
              <div class="vidaContainer" v-for="n in 2" :key="n">
                <img src="@/assets/potatHeart.png">
              </div>

              <img src='@/assets/Icon_Poltata.png' alt="image" class="icon shieldUser">

            </div>

            <p class="name nameUser">Tú</p>
          </div>
        </div>
        <div id="bottomleft">
          <div class="user" id="user1">
            <div class="imageContainer">
              <div class="vidaContainer" v-for="n in 2" :key="n">
                <img src="@/assets/potatHeart.png">
              </div>

              <img src='@/assets/Icon_alvaro.png' alt="image" class="icon">

            </div>

            <p class="name">No ets tú</p>
          </div>
        </div>
        <div id="bottomright">
          <div class="user" id="user2">
            <div class="imageContainer">
              <div class="vidaContainer" v-for="n in 2" :key="n">
                <img src="@/assets/potatHeart.png">
              </div>

              <img src='@/assets/Icon_Ermengol.png' alt="image" class="icon">


            </div>

            <p class="name">100% no tú</p>
          </div>
        </div>
        <div id="bombContainer">
          <img src="@/assets/lePotata.png" alt="" class="bomb" id="bomb"><span class="bombCounter">30</span>
        </div>


        <div id="middle">
          <div class="gameContainer">
            <h3>2-2</h3>
            <!-- <div>{{ socket }}</div> -->
            <input type="text" name="resposta" id="resposta" disabled />
          </div>

        </div>
      </div>
    </div>

  </div>
  <div>
    <button @click="nextPage()">Next</button>
  </div>

</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      page: 1,
      lastUserWithBomb: -1,
      userWithBomb: 0,
    }
  },
  methods: {
    nextPage() {
      this.page++;
      console.log(this.page);
    },
    changeBomb() {

      console.log(this.lastUserWithBomb);
      if (this.lastUserWithBomb !== this.userWithBomb) {
        console.log(this.lastUserWithBomb, "!=", this.userWithBomb);
        this.lastUserWithBomb = this.userWithBomb;
        this.userWithBomb = this.userWithBomb + 1;
        if (this.userWithBomb > 2) {
          this.userWithBomb = 0;
        }
        console.log(this.userWithBomb);
        let userWithBomb = document.getElementById("user" + this.userWithBomb);
        console.log(userWithBomb);
        if (this.userWithBomb !== -1) {
          let userBombpos = userWithBomb.getBoundingClientRect();
          let objectAntElement = document.getElementById("bombContainer");

          let objectAntpos = objectAntElement.getBoundingClientRect();
          let userBombXAnt = objectAntpos.x;
          let userBombYAnt = objectAntpos.y;

          document.getElementById("bombContainer").style.setProperty("--xPositionAnt", userBombXAnt + "px");
          document.getElementById("bombContainer").style.setProperty("--yPositionAnt", userBombYAnt + "px");

          let userBombX = userBombpos.x + 100;
          let userBombY = userBombpos.y;

          document.getElementById("bombContainer").style.setProperty("--xPosition", userBombX + "px");
          document.getElementById("bombContainer").style.setProperty("--yPosition", userBombY + "px");

          document.getElementById("bombContainer").classList.add("moveBomb");

          setTimeout(() => {
            document.getElementById("bombContainer").classList.remove("moveBomb");
          }, 800);
        }
      }
    },

  }
}
</script>

<style scoped>
:root {
  --xPositionAnt: 0;
  --yPositionAnt: 0;
  --xPosition: 0;
  --yPosition: 0;
}

.explain {
  font-size: 2rem;
  text-align: center;
  margin-top: 1%;
}

.buttonRed {
  background-color: #ED1C2F;
}

.buttonGreen {
  background-color: #4CAF50;
}

.hidden {
  display: none;
}

.name {
  text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
  color: white;
  font-family: Verdana, Geneva, Tahoma, sans-serif
}

.nameUser {
  color: #ffa500;
}

html:lang(ar) {
  font-size: 20px;
}

#background {
  background-image: url("../assets/backround2.png");
  background-repeat: no-repeat;
  width: 100%;
  height: 80%;
  background-size: cover;
  background-position: center;
}

.gameContainer>h3 {
  color: white;
  text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;

}

.gameContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-image: url("../assets/backgroundPregunta.png"); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  border-radius: 20px;
  width: 90%;
}

#explosion {
  width: 10vw;
}

.gameContainer>input {
  width: 80%;
  height: 5vh;
  border-radius: 10px;
  border: 1px solid black;
  margin-bottom: 10px;
  font-size: 1.5vw;
  font-weight: bold;
  color: black;
  filter: brightness(1);
}

.moveBomb {
  animation-name: bombMovement;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate;
}

#bombContainer {
  position: absolute;
  top: var(--yPosition);
  left: var(--xPosition);

}

@keyframes bombMovement {
  from {
    top: var(--yPositionAnt);
    left: var(--xPositionAnt);
  }

  to {
    top: var(--yPosition);
    left: var(--xPosition);
  }
}


.icon {
  border-radius: 50%;
  width: 7vw;
  border: 1px solid black;
  background-color: blanchedalmond;
  margin: 0;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;

}

.imageContainer {
  display: flex;

}

.vidaContainer img {
  width: 40px;
  height: 40px;
  margin-top: 5px;
}

#grid {
  background-image: url("../assets/table.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: grid;
  grid-template-areas: ". topleft topmid topright ." "leftmid . middle . rightmid" ". bottomleft bottommid bottomright .";
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

#middle {
  grid-area: middle;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;

  font-weight: bold;

}


#topleft {
  grid-area: topleft;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#topmid {
  grid-area: topmid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#topright {
  grid-area: topright;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#leftmid {
  grid-area: leftmid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#rightmid {
  grid-area: rightmid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#bottomleft {
  grid-area: bottomleft;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#bottommid {
  grid-area: bottommid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

#bottomright {
  grid-area: bottomright;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  font-weight: bold;
  color: white;
}

.bomb {
  width: 10vw;
  animation-name: hunch;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  position: absolute;
}

.bombCounter {
  position: absolute;
  top: 6vw;
  left: 9.3vh;
  animation-name: hunch;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  font-size: 1.2rem;
  font-weight: bold;
  color: red;
  text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
}



.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

/* Estilos generales */
.modal-content {
  width: 30vw;
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-victoria-content {
  width: 35vw;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-derrota-content {
  width: 35vw;
  background-color: #FCB6BE;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
}

.modal {
  z-index: 100;
}

.shieldUser {
  background-image: url('../assets/shield-user.png');
  background-size: cover;
  width: 7vw;
  height: 7vw;
  animation-name: fadeOut;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}


.letra {
  font-size: 2rem;
}

.content-bottom {
  margin-top: 20px;
  /* Ajusta el margen según sea necesario */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.victoria {
  width: 7vw;
  margin-right: 2vw;
}

button {
  background-color: green;
  color: white;
  padding: 10px 20px;
  font-size: 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  /* Efecto de transición en el color de fondo */
}

.derrota {
  width: 7vw;
  margin-right: 2vw;

}


/* Estilos del cierre (X) */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #555;
}

.letra {
  font-size: 2rem;
  font-weight: bold;
}

.close:hover {
  color: #000;
}

.ListItem {
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
}

.List {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#myModal {
  display: flex;
  align-items: center;
  justify-content: center;
}

#modal-victory {
  display: flex;
  align-items: center;
  justify-content: center;
}

#modal-derrota {
  display: flex;
  align-items: center;
  justify-content: center;
}

.explanationSection {
  display: flex;
  justify-content: space-between;
}


.explanationColumn,
.explanationColumn2 {
  width: 45%;
}

.explanationColumn h2,
.explanationColumn2 h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5vh;
}

.explanationColumn .jugador,
.explanationColumn2 img {
  border-radius: 50%;
  width: 8vw;
  border: 2px solid #fff;
  background-color: blanchedalmond;
  margin: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.explanationColumn .bombIniciar {
  width: 8vw;
  animation: hunch 1s infinite alternate;
  position: absolute;
}

.explanationColumn p,
.explanationColumn2 p {
  font-size: 1.5rem;
  font-weight: normal;

}


.explanationColumn2 {
  margin-left: 5vw;
}


#startGameButton {
  margin-top: 1vh;
  padding: 10px 15px;
  font-size: 0.8em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#goBackButton {
  margin-top: 2vh;
  background-color: #ED1C2F;
  padding: 15px 25px;
  font-size: 1.2em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#startGameButton:disabled {
  background-color: #6c757d;
  color: #fff;
  cursor: not-allowed;
}

.modal-tutorial {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-tutorial-content {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 80%;
}

.modal-victoria {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-derrota {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

@keyframes hunch {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.2);
  }
}

.userWithBomb {
  border: 4px solid #3772FF;
}

.userWithout {
  filter: grayscale(30%);
  /* opacity: 0.7; */
}

/*VICTORY & DEFEAT */

@keyframes growAndBlink {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  50% {
    transform: scale(1.5);
    opacity: 1;
  }

  100% {
    transform: scale(1.3);
    opacity: 0.8;
  }
}

.modal-victoria-content img {
  animation: growAndBlink 2.5s ease-in-out infinite;
}

@keyframes slideIn {
  0% {
    transform: scale(1);
    opacity: 0;
  }

  100% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.victory-text {
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  animation: slideIn 2.5s ease-in-out infinite;
}

/* MODAL TUTORIAL */
</style>