import express, { response } from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'path';
import mysql from 'mysql';

// import { useAppStore } from './tr2-MathPotato-Front/src/stores/guestStore.js';

// import fetch from 'node-fetch';
const app = express();

var gameRooms = [];
var lastRoom = 0;


app.use(cors());
const server = createServer(app);

const usersConectados = [];

const objPreguntes = {};
const URL = "http://127.0.0.1:8000/api/preguntes/random";

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

//--------------------------BASE DE DATOS----------------------------

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "potato"
});

io.on('connection', (socket) => {
    console.log("User connected.");
    console.log(socket.id);

    console.log('Salas: ', io.sockets.adapter.rooms);

    socket.on('join', (data) => {
        console.log("Soy", data);
        if (gameRooms.length == 0) {
            gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0 });
        } else {
            if (gameRooms[gameRooms.length - 1].users.length == 6 || gameRooms[gameRooms.length - 1].started === true) {
                lastRoom++;
                gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0 });
            }
        }

        if (gameRooms[gameRooms.length - 1].users.length == 0) {
            // Si no hay usuarios conectados, se agrega el primer usuario a la sala
            gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: true, image: data.image, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: false });
        } else {
            // Si ya hay usuarios, se agrega un nuevo usuario a la sala
            gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: false, image: data.image, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: falsec });
        }
        socket.join("gameRoom" + lastRoom);
        console.log(gameRooms[gameRooms.length - 1].users[gameRooms[gameRooms.length - 1].users.length - 1]);
        socket.emit('userDataUpdate', gameRooms[gameRooms.length - 1].users[gameRooms[gameRooms.length - 1].users.length - 1]);
        io.to("gameRoom" + lastRoom).emit('usersConnected', gameRooms[gameRooms.length - 1].users, gameRooms[gameRooms.length - 1].roomName);
        console.log('Salas: ', io.sockets.adapter.rooms);
    });


    socket.on('register', async (userData) => {
        console.log(userData);
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();
        if (responseData.status === 1) {
            // if (gameRooms.length == 0) {
            //     gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 0, timerAnterior: 0 });
            // } else {
            //     if (gameRooms[gameRooms.length - 1].users.length == 6 || gameRooms[gameRooms.length - 1].started === true) {
            //         lastRoom++;
            //         gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 0, timerAnterior: 0 });
            //     }
            // }
            // if (gameRooms[gameRooms.length - 1].users.length == 0) {
            //     // Si no hay usuarios conectados, se agrega el primer usuario a la sala
            //     gameRooms[gameRooms.length - 1].users.push({ username: userData.username, id: socket.id, bomba: true, image: "./src/assets/Icon_" + userData.foto_perfil + ".png", roomPosition: lastRoom, lives: 3 });
            // } else {
            //     // Si ya hay usuarios, se agrega un nuevo usuario a la sala
            //     gameRooms[gameRooms.length - 1].users.push({ username: userData.username, id: socket.id, bomba: false, image: "./src/assets/Icon_" + userData.foto_perfil + ".png", roomPosition: lastRoom, lives: 3 });
            // }
            // socket.join("gameRoom" + lastRoom);
            // console.log(gameRooms[gameRooms.length - 1].users);
            // io.to("gameRoom" + lastRoom).emit('usersConnected', gameRooms[gameRooms.length - 1].users, gameRooms[gameRooms.length - 1].roomName);
            // console.log('Salas: ', io.sockets.adapter.rooms);
            userData.status = 1;
            userData.id = socket.id;
            userData.image = userData.foto_perfil;
            console.log("userData", userData);
            socket.emit('loginSuccess', userData);
            return responseData;
        } else {
            console.log(response);
            socket.emit('loginError', responseData.status);

        }
    });
    socket.on('login', async (data) => {
        console.log(data);
        console.log("data to send...", data)
        await getUser(data);
    });
    async function getUser(data) {
        try {
            console.log("data to send...", data)
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            // console.log("response..??", response);
            const responseData = await response.json();
            if (responseData.status === 1) {
                responseData.id = socket.id;
                responseData.image = responseData.foto_perfil;
                socket.emit('loginSuccess', responseData);

                console.log("response.ok....", responseData);

                return responseData;
            } else {
                console.log("response.Notok....", responseData);
                socket.emit('loginError', responseData.status);
            }

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    // socket.on('preguntes', () => {
    //     console.log('preguntasAleatorias', objPreguntes);
    //     io.emit('preguntas', objPreguntes);
    // });



    socket.on('startGame', (data) => {
        console.log(`Usuario ${socket.id} hizo clic en el botón "start".`);

        let roomPosition;

        if (data.roomPosition) {
            // Primer bloque de código
            roomPosition = data.roomPosition;
            let room = gameRooms[roomPosition];
            let userIndex = room.users.findIndex(user => user.id === socket.id);
            room.users[userIndex].hasClickedStart = true;

            if (todosUsuariosHanClickeadoInicio(room)) {
                // Marcar la sala como iniciada y realizar otras acciones necesarias
                if (room.users.length >= 3 && room.users.length <= 6) {
                    room.started = true;
                    console.log("startGame");
                    newPregunta(room);
                    iniciarTimer(roomPosition);
                    startTimer(roomPosition);

                    // Emitir evento de inicio de juego a todos los usuarios en la sala
                    io.to("gameRoom" + roomPosition).emit('gameStarted', { allPlayersStarted: true });
                }
            }
        } else if (data.roomName) {
            // Segundo bloque de código
            roomPosition = gameRooms.findIndex(room => room.roomName === data.roomName);
            gameRooms[roomPosition].started = true;
            if (gameRooms[roomPosition].users.length >= 3 && gameRooms[roomPosition].users.length <= 6) {
                console.log("startGame");
                newPregunta(gameRooms[roomPosition]);
                iniciarTimer(roomPosition);
                startTimer(gameRooms[roomPosition].idRoom);
                io.to(data.roomName).emit('gameStarted', true);
            }
        }
    });
    function todosUsuariosHanClickeadoInicio(room) {
        // Asegúrate de que todos los usuarios en la sala han hecho clic en "start"
        let everyOneHasClickedStart = true;
        for (let i = 0; i < room.users.length; i++) {
            if (!room.users[i].hasClickedStart) {
                everyOneHasClickedStart = false;

            }
        }
        console.log("everyOneHasClickedStart", everyOneHasClickedStart);
        return everyOneHasClickedStart;


    }

    function newPregunta(room) {
        let n1 = Math.floor(Math.random() * 100);
        let n2 = Math.floor(Math.random() * 100);
        let tipoPreg = Math.floor(Math.random() * 4);
        let pregunta = "";
        switch (tipoPreg) {
            case 0:
                pregunta = n1 + "+" + n2;
                break;
            case 1:
                do {
                    if (n1 < n2) {
                        n1 = Math.floor(Math.random() * 100);
                        n2 = Math.floor(Math.random() * 100);
                    }
                } while (n1 < n2);
                pregunta = n1 + "-" + n2;
            case 2:
                n1 = Math.floor(Math.random() * 10);
                n2 = Math.floor(Math.random() * 10);
                pregunta = n1 + "x" + n2;
                break;
            case 3:
                do {
                    n1 = Math.floor(Math.random() * 10);
                    n2 = Math.floor(Math.random() * 10) + 1;
                    if (n1 % n2 !== 0) {
                        n1 = Math.floor(Math.random() * 10);
                        n2 = Math.floor(Math.random() * 10) + 1;
                    }
                } while (n1 % n2 !== 0);
                pregunta = n1 + "/" + n2;
                break;

        }
        let id_pregunta = room.pregActual + 1;
        room.pregunta = pregunta;
        room.pregActual = id_pregunta;
        io.to(room.roomName).emit('pregunta', { "id": room.pregActual, "pregunta": room.pregunta });
    }
    function getUserWithBomb(room) {
        for (let i = 0; i < gameRooms[room].users.length; i++) {
            if (gameRooms[room].users[i].bomba) {
                return i;
            }
        }
    }

    socket.on('resposta', async (data) => {
        // CambiaEsta =
        let roomIndex = gameRooms.findIndex(room => room.roomName === data.roomName);
        console.log("Pregunta: ", gameRooms[roomIndex].pregunta);

        const preguntaParaEvaluar = gameRooms[roomIndex].pregunta.replace('x', '*');
        const resultatPregunta = eval(preguntaParaEvaluar);
        console.log("Result correct --> ", resultatPregunta); //FUNCIONA
        console.log(data.resposta);
        let userWithBomb = getUserWithBomb(roomIndex);
        if (data.resposta !== "") {
            if (resultatPregunta == data.resposta) {
                if (socket.id == gameRooms[roomIndex].users[userWithBomb].id) {
                    console.log("respuesta correcta");
                    gameRooms[roomIndex].pregActual++;
                    gameRooms[roomIndex].users[userWithBomb].bomba = false;

                    console.log("user bomba: " + gameRooms[roomIndex].users[userWithBomb].bomba);
                    if (userWithBomb == gameRooms[roomIndex].users.length - 1) {
                        gameRooms[roomIndex].users[0].bomba = true;
                        if (gameRooms[roomIndex].timerAnterior > 20) {
                            gameRooms[roomIndex].timerAnterior = gameRooms[roomIndex].timerAnterior - 5;
                        } else {
                            if (gameRooms[roomIndex].timerAnterior > 5) {
                                gameRooms[roomIndex].timerAnterior = gameRooms[roomIndex].timerAnterior - 2;
                            }
                        }
                    } else {
                        gameRooms[roomIndex].users[userWithBomb + 1].bomba = true;
                    }
                    gameRooms[roomIndex].timer = gameRooms[roomIndex].timerAnterior;
                    io.to(data.roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });

                } else {
                    console.log("resposta correcta!");
                    gameRooms[roomIndex].pregActual++;
                    gameRooms[roomIndex].users[userWithBomb].bomba = true;
                    gameRooms[roomIndex].timer -= 10;
                    io.to(data.roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
                }
            } else {
                if (gameRooms[roomIndex].users[userWithBomb].id == socket.id) {
                    gameRooms[roomIndex].timer = gameRooms[roomIndex].timerAnterior;
                    console.log("resposta incorrecta!");
                    gameRooms[roomIndex].pregActual++;
                    gameRooms[roomIndex].users[userWithBomb].bomba = true;
                    gameRooms[roomIndex].users[userWithBomb].lives--;
                    console.log("lives restantes -> " + gameRooms[roomIndex].users[userWithBomb].lives);

                    if (gameRooms[roomIndex].users[userWithBomb].lives == 0) {
                        if (gameRooms[roomIndex].users[userWithBomb].email !== 'none') {
                            var email = gameRooms[roomIndex].users[userWithBomb].email;

                            // let response = await console.log("Connected!!!!!!!!!!");
                            let response = await fetch('http://localhost:8000/api/updateDerrotas', {
                                method: 'POST',
                                body: JSON.stringify({ email }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            console.log("entrooo????? --> ", email);

                        }
                        if (userWithBomb == gameRooms[roomIndex].users.length - 1) {
                            gameRooms[roomIndex].users[0].bomba = true;
                        }
                        else {
                            gameRooms[roomIndex].users[userWithBomb + 1].bomba = true;
                        }
                        socket.leave(gameRooms[roomIndex].roomName);
                        socket.emit('userLost', gameRooms[roomIndex].users[userWithBomb]);
                        gameRooms[roomIndex].users.splice(userWithBomb, 1);
                        if (gameRooms[roomIndex].users.length == 1 && gameRooms[roomIndex].started == true) {
                            console.log(roomIndex);
                            if (email !== 'none') {
                                let response = await fetch('http://localhost:8000/api/updateVictorias', {
                                    method: 'POST',
                                    body: JSON.stringify({ email }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                                console.log("entrooo????? --> ", email);
                            }
                            gameRooms[roomIndex].gameStarted = false;
                            io.to(gameRooms[roomIndex].roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: gameRooms[roomIndex].users[0].username, image: gameRooms[roomIndex].users[0].image, email: gameRooms[roomIndex].users[0].email }));
                            io.sockets.sockets.get(gameRooms[roomIndex].users[0].id).leave(gameRooms[roomIndex].roomName);
                            gameRooms.splice(data.room, 1);
                        }
                    }
                    io.to(data.roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
                } else {
                    console.log("resposta incorrecta!");
                    gameRooms[roomIndex].pregActual++;
                    gameRooms[roomIndex].users[userWithBomb].bomba = false;

                    console.log(gameRooms[roomIndex].users[userWithBomb].bomba);
                    let userBombN = gameRooms[roomIndex].users.findIndex(user => user.id === socket.id);
                    gameRooms[roomIndex].users[userBombN].bomba = true;
                    io.to(data.roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
                }
            }
            newPregunta(gameRooms[roomIndex]);
        }


    });

    function iniciarTimer(roomPosition) {
        const size = gameRooms[roomPosition].users.length;

        switch (size) {
            case 3:
                gameRooms[roomPosition].timer = 31;
                break;
            case 4:
                gameRooms[roomPosition].timer = 36;
                break;
            case 5:
            case 6:
                gameRooms[roomPosition].timer = 41;
                break;
        }
        gameRooms[roomPosition].timerAnterior = gameRooms[roomPosition].timer;
    }

    async function startTimer(idRoom) {
        if (gameRooms.length > 0) {
            console.log("Hay estas rooms", gameRooms);
            let roomPosition = gameRooms.findIndex(room => room.idRoom === idRoom);
            if (roomPosition !== -1) {
                console.log("timer --> ", gameRooms[roomPosition]);
                if (gameRooms[roomPosition].timer > 0 && gameRooms[roomPosition].started == true) {
                    setTimeout(() => {
                        console.log("Aqui", gameRooms[roomPosition]);
                        if (roomPosition !== -1 && gameRooms[roomPosition] !== undefined) {
                            if (gameRooms[roomPosition].idRoom == idRoom) {
                                gameRooms[roomPosition].timer--;
                                io.to(gameRooms[roomPosition].roomName).emit('timer', gameRooms[roomPosition].timer);
                                console.log("tiempo --> ", gameRooms[roomPosition].timer);
                            }


                            if (gameRooms[roomPosition].users.length == 1 && gameRooms[roomPosition].started == true) {
                                // console.log("game finished!!!!!!!!!");
                                // gameRooms[roomPosition].timer=0;
                                console.log(gameRooms)

                            } else {
                                if (gameRooms[roomPosition].users.length > 1) {
                                    startTimer(idRoom);
                                }
                            }
                        }
                    }, 1000);
                } else {
                    if (gameRooms[roomPosition].started == true && gameRooms[roomPosition].timer <= 0) {
                        console.log("timer acabado");
                        newPregunta(gameRooms[roomPosition]);
                        gameRooms[roomPosition].timer = gameRooms[roomPosition].timerAnterior - 1;
                        io.to(gameRooms[roomPosition].roomName).emit('timer', gameRooms[roomPosition].timer);
                        let userWithBomb = getUserWithBomb(roomPosition);
                        gameRooms[roomPosition].users[userWithBomb].lives--;
                        if (gameRooms[roomPosition].users[userWithBomb].lives == 0) {
                            if (gameRooms[roomPosition].users[userWithBomb].email !== 'none') {
                                var email = gameRooms[roomPosition].users[userWithBomb].email;

                                // let response = await console.log("Connected!!!!!!!!!!");
                                let response = await fetch('http://localhost:8000/api/updateDerrotas', {
                                    method: 'POST',
                                    body: JSON.stringify({ email }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                                console.log("entrooo????? --> ", email);

                            }
                            if (userWithBomb == gameRooms[roomPosition].users.length - 1) {
                                gameRooms[roomPosition].users[0].bomba = true;
                            }
                            else {
                                gameRooms[roomPosition].users[userWithBomb + 1].bomba = true;
                            }
                            let my_socket = io.sockets.sockets.get(gameRooms[roomPosition].users[userWithBomb].id);
                            my_socket.leave(gameRooms[roomPosition].roomName);
                            my_socket.emit('userLost', gameRooms[roomPosition].users[userWithBomb]);
                            gameRooms[roomPosition].users.splice(userWithBomb, 1);

                            if (gameRooms[roomPosition].users.length == 1 && gameRooms[roomPosition].started == true) {
                                gameRooms[roomPosition].gameStarted = false;
                                gameRooms[roomPosition].timer = 0;
                                var email = gameRooms[roomPosition].users[0].email;


                                // let response = await console.log("Connected!!!!!!!!!!");
                                if (email !== 'none') {
                                    let response = await fetch('http://localhost:8000/api/updateVictorias', {
                                        method: 'POST',
                                        body: JSON.stringify({ email }),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    console.log("entrooo????? --> ", email);
                                }
                                gameRooms[roomPosition].gameStarted = false;
                                io.to(gameRooms[roomPosition].roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: gameRooms[roomPosition].users[0].username, image: gameRooms[roomPosition].users[0].image, email: gameRooms[roomPosition].users[0].email }));
                                io.sockets.sockets.get(gameRooms[roomPosition].users[0].id).leave(gameRooms[roomPosition].roomName);
                                gameRooms.splice(roomPosition, 1);
                                // gameRooms[roomPosition].lives=0;

                                // gameRooms[roomPosition].users[0].bomba = false;

                                // console.log("game over");
                                // io.to(gameRooms[roomPosition].roomName).emit('gameOver', { "arrayUsers": gameRooms[roomPosition].users, "bombChange": true });
                            } else {
                                newPregunta(gameRooms[roomPosition]);
                            }
                        }
                        if (gameRooms[roomPosition].users.length > 1) {
                            console.log(gameRooms[roomPosition].users);
                            startTimer(idRoom);
                            console.log(gameRooms[roomPosition]);
                            io.to(gameRooms[roomPosition].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomPosition].users, "bombChange": true });
                            gameRooms[roomPosition].pregActual++;
                        }


                        // newPregunta(gameRooms[roomPosition]);



                    }
                }
            }
        }
    }
    socket.on('leaveRoom', () => {

        if (gameRooms.length > 0) {
            gameRooms.forEach(async room => {
                let usuarioDesconectadoIndex = room.users.findIndex(user => user.id === socket.id);
                console.log(usuarioDesconectadoIndex);
                if (usuarioDesconectadoIndex !== -1) {
                    if (room.users[usuarioDesconectadoIndex].bomba) {
                        if (usuarioDesconectadoIndex == room.users.length - 1) {
                            room.users[0].bomba = true;
                        } else {
                            room.users[usuarioDesconectadoIndex + 1].bomba = true;
                        }
                    }
                    console.log("VAAAAAAAAAA", room.users[usuarioDesconectadoIndex]);
                    if (room.users[usuarioDesconectadoIndex].email != 'none') {
                        var email = room.users[usuarioDesconectadoIndex].email;


                        // let response = await console.log("Connected!!!!!!!!!!");
                        let response = await fetch('http://localhost:8000/api/updateDerrotas', {
                            method: 'POST',
                            body: JSON.stringify({ email }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log("entrooo????? --> ", email);

                    }
                    let usuarioDesconectado = room.users.splice(usuarioDesconectadoIndex, 1);
                    socket.leave(room.roomName);
                    io.to(room.roomName).emit('usersDesconectados', room.users, room.roomName);
                    if (room.users.length == 1 && room.started == true) {
                        room.gameStarted = false;
                        room.timer = 0;
                        let email = room.users[0].email;
                        if (email != 'none') {
                            let response = await fetch('http://localhost:8000/api/updateVictorias', {
                                method: 'POST',
                                body: JSON.stringify({ email }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            console.log("entrooo????? --> ", email);
                        }
                        gameRooms[room.idRoom].gameStarted = false;
                        io.to(room.roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: room.users[0].username, image: room.users[0].image, email: room.users[0].email }));
                        gameRooms.splice(room.idRoom, 1);
                        io.sockets.sockets.get(room.users[0].id).leave(room.roomName);

                    }
                    console.log('Usuario desconectado: ', usuarioDesconectado);

                }

            });
        }
    });

    socket.on('disconnect', () => {
        // let CambiaEsta=
        if (gameRooms.length > 0) {
            gameRooms.forEach(async room => {
                let usuarioDesconectadoIndex = room.users.findIndex(user => user.id === socket.id);
                console.log(usuarioDesconectadoIndex);
                if (usuarioDesconectadoIndex !== -1) {
                    if (room.users[usuarioDesconectadoIndex].bomba) {
                        if (usuarioDesconectadoIndex == room.users.length - 1) {
                            room.users[0].bomba = true;
                        } else {
                            room.users[usuarioDesconectadoIndex + 1].bomba = true;
                        }
                    }
                    console.log("VAAAAAAAAAA", room.users[usuarioDesconectadoIndex]);
                    if (room.users[usuarioDesconectadoIndex].email != 'none') {
                        var email = room.users[usuarioDesconectadoIndex].email;


                        // let response = await console.log("Connected!!!!!!!!!!");
                        let response = await fetch('http://localhost:8000/api/updateDerrotas', {
                            method: 'POST',
                            body: JSON.stringify({ email }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log("entrooo????? --> ", email);

                    }
                    let usuarioDesconectado = room.users.splice(usuarioDesconectadoIndex, 1);
                    socket.leave(room.roomName);
                    io.to(room.roomName).emit('usersDesconectados', room.users, room.roomName);
                    if (room.users.length == 1 && room.started == true) {
                        room.gameStarted = false;
                        room.timer = 0;
                        let email = room.users[0].email;
                        if (email != 'none') {
                            let response = await fetch('http://localhost:8000/api/updateVictorias', {
                                method: 'POST',
                                body: JSON.stringify({ email }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            console.log("entrooo????? --> ", email);
                        }
                        gameRooms[room.idRoom].gameStarted = false;
                        io.to(room.roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: room.users[0].username, image: room.users[0].image, email: room.users[0].email }));
                        gameRooms.splice(room.idRoom, 1);
                        io.sockets.sockets.get(room.users[0].id).leave(room.roomName);

                    }
                    console.log('Usuario desconectado: ', usuarioDesconectado);

                }

            });
        }

    });
    socket.on('eliminarPartida', (roomName) => {
        let roomIndex = gameRooms.findIndex(room => room.roomName === roomName);
        gameRooms.splice(roomIndex, 1);
    });
    socket.on('login', (data) => {
        console.log(data);
    });
    socket.on('getRanking', async () => {
        let response = await fetch('http://localhost:8000/api/ranking', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let ranking = await response.json();
        console.log(ranking);
        socket.emit('updateRanking', await ranking);

    });
    socket.on('changeSkin', async (data) => {
        console.log(data);
        let response = await fetch('http://localhost:8000/api/changeIcon', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseData = await response.json();
        if (responseData.status == 1) {
            console.log("Icono cambiado correctamente");
            console.log(data.foto_perfil);
            socket.emit('changeSkinSuccess', data.foto_perfil);
        }
    });
});
// io.emit('arrayUsers', usersConectados);

server.listen(5175, () => {
    console.log('Listening on http://localhost:5175');

});