import { io } from "socket.io-client";
// import { onMounted } from 'vue';
import { useAppStore } from '@/stores/guestStore';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "localhost:5175";

export const socket = io(URL);

// const join = (roomGame) => {
//     const store = useAppStore();
//     socket.emit('join', { username: store.guestInfo.username, id: store.guestInfo.id, room: roomGame });
//   };

// onMounted(() => {
//     //join sala de juego
//     join('gameRoom');
//     console.log('hi');
function getCurrentUser(users) {
    console.log(users[0]);
    for (let i = 0; i < users.length; i++) {
        
        if (users[i].id === socket.id) {
            
            return users[i];
        }
    }
}
    socket.on("usersConnected", (usersConnected, roomName) => {
        console.log("*Conectado al servidor*", usersConnected);
        console.log('Sala de juego: ', roomName);
        const store = useAppStore();
        
        // Filtra los usuarios basándose en el socket.id actual
  

        // Establece el array de usuarios en Pinia
        store.setUsers(usersConnected);
        store.setRoomName(roomName);
        store.setUsersInRoom(usersConnected);
        store.setRespostaAnterior(true);

        // socket.join(roomGame);
    });

    // socket.on("username", (username, id) => { 
    //     const store = useAppStore();
    //     store.setGuestInfo(username, id);
    //     console.log(username);
        
    // });

    
    socket.on("usersDesconectados", (usersConnected) => { 
        const store = useAppStore();
        console.log('Usuarios desconectados: ', usersConnected);
        store.updateUsersOnDisconnect(usersConnected);  
        store.updateUsersOnDisconnectInRoom(usersConnected);  
    });

    socket.on("disconnect", (usersConnected) => {
        const store = useAppStore();
        console.log("*Desconectado del servidor*");
        store.clearGuestInfo();
        store.updateUsersOnDisconnectInRoom(usersConnected);
    });

    socket.on("gameStarted", (gameStarted) => {
        console.log('El juego ha comenzado! ', gameStarted);
        const store = useAppStore();
        store.setGameStarted(gameStarted);

    });

    socket.on("pregunta", (pregunta) => {
        const store = useAppStore();
        console.log('Nueva pregunta: ', pregunta);
        store.setPregunta(pregunta);
    });

    socket.on("changeBomb", (newUsersData) => {
        const store = useAppStore();
        console.log('Cambio de bomba: ', newUsersData.bombChange);
        store.setUsers(newUsersData.arrayUsers);
        store.setRespostaAnterior(newUsersData.bombChange);
    });

    socket.on("userLost", (UsersData) => {
        const store = useAppStore();
        store.setLost();
        store.setGameStarted(UsersData.gameStarted);
        });

    // socket.on("gameRooms", (gameRooms) => {
    //     const store = useAppStore();
    //     console.log('Salas de juego: ', gameRooms);
    //     store.setGameRooms(gameRooms);
    // });

    socket.on('timer', (timerValue) => {
        const store = useAppStore();
        store.setTimer(timerValue);
    });

    socket.on("finishGame", (dataPartida) => {
        console.log('El juego ha terminado! ', dataPartida);
        const store = useAppStore();
        store.setGameStarted(dataPartida.gameStarted);
        store.setWin();
        // store.setGuestInfo({ lives: 0});
    });

    socket.on("loginError", (error) => {
        console.log('Error: ', error);
        const store = useAppStore();
        store.setError(error);
    });

    socket.on("loginSuccess", (data) => {
        console.log('Login correcto: ', data);
        const store = useAppStore();
        store.setError(data.status);
        console.log(data);
        let user = {username: data.username, id: data.id, image: data.image, email: data.email};
        store.setGuestInfo(user);
    });

    socket.on("changeSkinSuccess", (data)=>{
        console.log('Cambio de skin correcto: ', data);
        const store = useAppStore();
        store.setGuestImage(data); 
    });

    socket.on("updateRanking",(ranking)=>{
        console.log("HOLAAAAAAAAAAAAAAAA")
        const store = useAppStore();
        store.setRanking(ranking);
    });

    socket.on("userDataUpdate",(data)=>{
        const store = useAppStore();
        console.log(data)
        store.setGuestInfo(data); 
    });