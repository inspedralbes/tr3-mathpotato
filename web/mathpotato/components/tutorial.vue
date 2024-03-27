<template>
  <div class="tutorial">
    <div id="page1" class="explain" v-if="page === 1">
      Benvingut a Mathpotato! Aquest joc consisteix en respondre preguntes de matemàtiques per passar la patata, evitant
      explotar
    </div>
    <div id="page2" class="explain" v-else-if="page === 2">
      Tú ets el personatge amb el nombre taronga, tens la bomba! pero no et preocupis tens un temps marcat a la bomba
      per passar-la
    </div>
    <div id="page3" class="explain" v-else-if="page === 3">
      Per passar la bomba, has de respondre correctament la pregunta que et mostrem a la pantalla
    </div>
    <div id="page4" class="explain" v-else-if="page === 4">
      Encara que no tinguis la bomba pots respondre la pregunta per restar-li temps a la bomba (Durant la partida el
      temps baixarà sol)
    </div>
    <div id="page5" class="explain" v-else-if="page === 5">
      Si no respons la pregunta o la resposta és incorrecta, la bomba explotarà i perdràs una vida
    </div>
    <div id="page6" class="explain" v-else-if="page === 6">
      Quan la preugnta canvia la pregunta, el jugador amb la bomba rebrà un escut de 5 segons, si no tens la bomba no
      podràs respondre
    </div>
    <div id="page7" class="explain" v-else-if="page === 7">
      Si perds totes les vides, perdràs la partida, si ets l'ultim en peu guanyaras la partida.
    </div>
    <div class="explanationSection">
      <div id="background">
        <div id="grid">
          <div id="topmid">
            <div class="userTutorial topmid" id="userTutorial0">
              <div class="imageContainer">
                <div class="vidaContainer" v-for="n in 2" :key="n">
                  <img src="@/assets/potatHeart.png">
                </div>

                <img src='@/assets/Icon_Poltata.png' alt="image" class="icon">

              </div>

              <p class="name nameuserTutorial">Tú</p>
            </div>
          </div>
          <div id="bottomleft">
            <div class="userTutorial" id="userTutorial2">
              <div class="imageContainer">
                <div class="vidaContainer">
                  <img src="@/assets/potatHeart.png">
                  <img src="@/assets/potatHeart.png">
                </div>

                <img src='@/assets/Icon_alvaro.png' alt="image" class="icon">

              </div>

              <p class="name">No ets tú</p>
            </div>
          </div>
          <div id="bottomright">
            <div class="userTutorial" id="userTutorial1">
              <div class="imageContainer">
                <div class="vidaContainer" v-for="n in lives" :key="n">
                  <img src="@/assets/potatHeart.png">
                </div>

                <img src='@/assets/Icon_Ermengol.png' alt="image" class="icon" id="shieldUser">


              </div>

              <p class="name">100% no tú</p>
            </div>
          </div>
          <div id="bombContainerTutorial">
            <img src="@/assets/lePotata.png" alt="" class="bomb" id="bomb"><span id="bombCounter">30</span>
          </div>


          <div id="middle">
            <div class="gameContainer">
              <h3 id="pregunta">2-2</h3>
              <!-- <div>{{ socket }}</div> -->
              <input type="text" name="resposta" id="resposta" disabled />
            </div>

          </div>
        </div>
      </div>

    </div>
    <div>
      <button @click="nextPage()" v-if="page < 7">Next</button>
      <button @click="latestPage()" v-if="page > 1">Latest</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      page: 1,
      lastuserTutorialWithBomb: 2,
      userTutorialWithBomb: 0,
      lives: 2
    }
  },
  methods: {
    nextPage() {
      this.page++;
      console.log(this.page);
      this.specificChanges();
    },
    latestPage() {
      this.page--;
      this.specificChanges();
    },
    specificChanges() {
      if (this.page == 2) {
        if (this.lastuserTutorialWithBomb != 1) {
          this.lastuserTutorialWithBomb = 1;
          this.userTutorialWithBomb = 0;
        }
        document.getElementById("pregunta").innerHTML = "2-2";
        this.changeBombTutorial();

      }

      if (this.page == 3) {
        if (document.getElementById("pregunta").innerHTML == "2-2") {
          document.getElementById("resposta").value = "0";
        }
        setTimeout(() => {
          this.lastuserTutorialWithBomb = 0;
          this.userTutorialWithBomb = 1;
          document.getElementById("pregunta").innerHTML = "2/2";
          this.changeBombTutorial();
          document.getElementById("resposta").value = "";
          document.getElementById("bombCounter").innerHTML = "30";
        }, 1000);

      }
      if (this.page == 4) {
        document.getElementById("resposta").value = "1";
        this.lives = 2;
        setTimeout(() => {
          document.getElementById("bombCounter").innerHTML = "25";
          document.getElementById("pregunta").innerHTML = "3×2";
          document.getElementById("resposta").value = "";
        }, 1000);
      }
      if (this.page == 5) {
        document.getElementById("shieldUser").classList.remove("shielduserTutorial");
        document.getElementById("resposta").value = "7";
        setTimeout(() => {
          if(this.lives == 2){
            this.lives--;
          document.getElementById("bombCounter").innerHTML = "30";
          document.getElementById("pregunta").innerHTML = "3×3";
          document.getElementById("resposta").value = "";
          this.hideButton();
          }
         
        }, 1000);
      }
      if (this.page == 6) {
        document.getElementById("shieldUser").classList.add("shielduserTutorial");
        this.$emit('hButton');
      }
      if (this.page == 7) {
        console.log("end");
        this.$emit('sButton');
      }

    },
    changeBombTutorial() {

      console.log(this.lastuserTutorialWithBomb);
      if (this.lastuserTutorialWithBomb !== this.userTutorialWithBomb) {
        console.log(this.lastuserTutorialWithBomb, "!=", this.userTutorialWithBomb);
        if (this.userTutorialWithBomb > 2) {
          this.userTutorialWithBomb = 0;
        }
        console.log(this.userTutorialWithBomb);
        let userTutorialWithBomb = document.getElementById("userTutorial" + this.userTutorialWithBomb);
        console.log(userTutorialWithBomb);
        if (this.userTutorialWithBomb !== -1) {
          let userTutorialBombpos = userTutorialWithBomb.getBoundingClientRect();
          let objectAntElement = document.getElementById("bombContainerTutorial");

          let objectAntpos = objectAntElement.getBoundingClientRect();
          let userTutorialBombXAnt = objectAntpos.x;
          let userTutorialBombYAnt = objectAntpos.y;

          document.getElementById("bombContainerTutorial").style.setProperty("--xPositionAnt", userTutorialBombXAnt + "px");
          document.getElementById("bombContainerTutorial").style.setProperty("--yPositionAnt", userTutorialBombYAnt + "px");

          let userTutorialBombX = userTutorialBombpos.x + 100;
          let userTutorialBombY = userTutorialBombpos.y;

          document.getElementById("bombContainerTutorial").style.top = userTutorialBombY + "px";
          document.getElementById("bombContainerTutorial").style.left = userTutorialBombX + "px";
          document.getElementById("bombContainerTutorial").style.setProperty("--xPosition", userTutorialBombX + "px");
          document.getElementById("bombContainerTutorial").style.setProperty("--yPosition", userTutorialBombY + "px");

          document.getElementById("bombContainerTutorial").classList.add("moveBomb");

          setTimeout(() => {
            document.getElementById("bombContainerTutorial").classList.remove("moveBomb");
          }, 800);
        }
      }
    },

  },
  mounted() {
    this.changeBombTutorial();
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
  font-size: 1vw;
  font-family: Verdana, Geneva, Tahoma, sans-serif
}

.nameuserTutorial {
  color: #ffa500;
}

html:lang(ar) {
  font-size: 20px;
}

#background {
  background-image: url("../assets/backround2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 50vh;
  width: 80%;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  margin-left: auto;
  margin-right: auto;
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
  width: 50%;

}

#explosion {
  width: 10vw;
}

.gameContainer>input {
  width: 80%;
  /* height: 5vh; */
  border-radius: 10px;
  border: 1px solid black;
  margin-bottom: 10px;
  font-size: 1vw;
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

#bombContainerTutorial {
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
  width: 4vw;
  border: 1px solid black;
  background-color: blanchedalmond;
  margin: 0;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.userTutorial {
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
  /* height: 40px; */
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
  height: 50vh;
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
  width: 5vw;
  animation-name: hunch;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  position: absolute;
}

#bombCounter {
  position: absolute;
  top: 2.7vw;
  left: 4.7vh;
  animation-name: hunch;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  font-size: 0.78rem;
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

.shielduserTutorial {
  background-image: url('../assets/shield-userTutorial.png');
  background-size: cover;
  width: 4vw;
  /* height: 7vw; */
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


.explanationSection {
  width: 100%;
  height: 50vh;
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
  height: 80%;
  background-color: rgba(0, 0, 0, 0.7);
}

.tutorial {
  width: 100% !important;
}

.modal-tutorial-content {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 80%;
}

@keyframes hunch {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.2);
  }
}

.userTutorialWithBomb {
  border: 4px solid #3772FF;
}

.userTutorialWithout {
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