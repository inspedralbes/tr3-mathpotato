import express, { response } from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'path';
import mysql from 'mysql';
import { set } from '@vue/composition-api';
import { count } from 'node:console';

const app = express();

var gameRooms = [];
var lastRoom = 0;


app.use(cors());
const server = createServer(app);
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
        console.log("tutorial", data.tutorial);
        if (gameRooms.length == 0) {
            lastRoom++;
            gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0, shieldUser: "" });
        } else {
            if (gameRooms[gameRooms.length - 1].users.length == 6 || gameRooms[gameRooms.length - 1].started === true) {
                lastRoom++;
                gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0, shieldUser: "" });
            }
        }
        if (gameRooms[gameRooms.length - 1].users.length == 0) {
            // Si no hay usuarios conectados, se agrega el primer usuario a la sala
            gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: true, image: data.image, tutorial: data.tutorial, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: false });

        } else {
            // Si ya hay usuarios, se agrega un nuevo usuario a la sala
            gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: false, image: data.image, tutorial: data.tutorial, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: false });
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
            userData.status = 1;
            userData.id = socket.id;
            userData.image = userData.foto_perfil;
            // console.log("userData", userData);
            socket.emit('loginSuccess', userData);
            return responseData;
        } else {
            // console.log(response);
            socket.emit('loginError', responseData.status);

        }
    });
    socket.on('login', async (data) => {
        // console.log(data);
        // console.log("data to send...", data)
        await getUser(data);
    });
    async function getUser(data) {
        try {
            // console.log("data to send...", data)
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            const responseData = await response.json();
            if (responseData.status === 1) {
                responseData.id = socket.id;
                responseData.image = responseData.foto_perfil;
                socket.emit('loginSuccess', responseData);

                // console.log("response.ok....", responseData);

                return responseData;
            } else {
                // console.log("response.Notok....", responseData);
                socket.emit('loginError', responseData.status);
            }

        } catch (error) {
            // console.error('There has been a problem with your fetch operation:', error);
        }
    }

    function getRoomBySocketId(socketId) {
        let room;
        gameRooms.forEach(gameRoom => {
            gameRoom.users.forEach(user => {
                if (user.id === socketId) {
                    room = gameRoom;
                }
            });
        });
        return room;
    }

    function checkAllPlayersClickedStart(room) {
        let allPlayersClickedStart = true;
        room.users.forEach(user => {
            if (!user.hasClickedStart) {
                allPlayersClickedStart = false;
            }
        });
        return allPlayersClickedStart;
    }

    socket.on('startGame', (data) => {

        let room = getRoomBySocketId(socket.id);

        if (room) {
            // Primer bloque de código
            let userIndex = room.users.findIndex(user => user.id === socket.id);
            room.users[userIndex].hasClickedStart = !room.users[userIndex].hasClickedStart;


            // Marcar la sala como iniciada y realizar otras acciones necesarias
            io.to(room.roomName).emit('usersDesconectados', room.users, room.roomName);
            if (room.users.length >= 3 && room.users.length <= 6 && checkAllPlayersClickedStart(room)) {
                room.started = true;
                let countdown = 3;
                for (let index = countdown; index >= 0; index--) {
                    setTimeout(() => {
                        if (checkAllPlayersClickedStart(room) && index == 0) {
                            console.log(room);
                            console.log("startGame");
                            let roomPosition = room.roomPosition;
                            newPregunta(room);
                            iniciarTimer(room);
                            startTimer(room.idRoom);
                            // Emitir evento de inicio de juego a todos los usuarios en la sala
                            io.to(room.roomName).emit('gameStarted', { allPlayersStarted: true });
                        } else {
                            if (checkAllPlayersClickedStart(room)) {
                                console.log("index" + index);
                                io.to(room.roomName).emit('countdown', index);
                            } else {
                                room.started = false;
                                index = -2;
                                console.log("No todos los jugadores han clicado en start");
                                io.to(room.roomName).emit('countdown', index);
                            }
                        }
                    }, 1500 * (countdown - index));
                }

            } 


        }
    });

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
        activarEscudoUserNewPregunta(room);
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
    function respostaCorrecta(roomIndex, userWithBomb) {
        gameRooms[roomIndex].pregActual++;
        console.log("respuesta correcta");
        if (socket.id == gameRooms[roomIndex].users[userWithBomb].id) {
            respostaCorrectaUsuariCorrecte(roomIndex, userWithBomb);
        } else {
            if (!gameRooms[roomIndex].shieldUser) {
                respostaCorrectaUsuariIncorrecte(roomIndex, userWithBomb);
            }
        }
    }

    function respostaCorrectaUsuariCorrecte(roomIndex, userWithBomb) {
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
        console.log("users in room -> ", gameRooms[roomIndex].users);
        io.to(gameRooms[roomIndex].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
    }

    function respostaCorrectaUsuariIncorrecte(roomIndex, userWithBomb) {

        console.log("resposta correcta!");
        gameRooms[roomIndex].users[userWithBomb].bomba = true;
        gameRooms[roomIndex].timer -= 10;
        io.to(gameRooms[roomIndex].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
    }

    async function addToRanking(email) {
        let response = await fetch('http://localhost:8000/api/updateDerrotas', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    async function updateVictorias(roomIndex) {
        let email = gameRooms[roomIndex].users[0].email;
        // console.log(email);
        if (email !== 'none') {
            let response = await fetch('http://localhost:8000/api/updateVictorias', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // console.log("entrooo????? --> ", email);
        }
    }
    function UserHasNoLives(roomIndex, userWithBomb, roomToEliminate) {
        if (gameRooms[roomIndex].users[userWithBomb].email !== 'none') {
            var email = gameRooms[roomIndex].users[userWithBomb].email;
            addToRanking(email);
        }
        if (userWithBomb == gameRooms[roomIndex].users.length - 1) {
            gameRooms[roomIndex].users[0].bomba = true;
        }
        else {
            gameRooms[roomIndex].users[userWithBomb + 1].bomba = true;
        }
        let socket = io.sockets.sockets.get(gameRooms[roomIndex].users[userWithBomb].id);
        socket.leave(gameRooms[roomIndex].roomName);
        socket.emit('userLost', gameRooms[roomIndex].users[userWithBomb]);
        gameRooms[roomIndex].users.splice(userWithBomb, 1);
        console.log("USERS -> " + gameRooms[roomIndex].users);
        if (gameRooms[roomIndex].users.length == 1 && gameRooms[roomIndex].started == true) {
            updateVictorias(roomIndex);
            io.to(gameRooms[roomIndex].roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: gameRooms[roomIndex].users[0].username, image: gameRooms[roomIndex].users[0].image, email: gameRooms[roomIndex].users[0].email }));
            io.sockets.sockets.get(gameRooms[roomIndex].users[0].id).leave(gameRooms[roomIndex].roomName);
            gameRooms.splice(roomToEliminate, 1);
        } else {
            if (gameRooms[roomIndex].users.length > 1) {
                io.to(gameRooms[roomIndex].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
            }

        }
    }
    function respostaIncorrectaUsuariCorrecte(roomIndex, userWithBomb) {
        gameRooms[roomIndex].timer = gameRooms[roomIndex].timerAnterior;
        gameRooms[roomIndex].pregActual++;
        gameRooms[roomIndex].users[userWithBomb].lives--;
        let check = gameRooms[roomIndex].roomName;
        console.log("lives restantes -> " + gameRooms[roomIndex].users[userWithBomb].lives);

        if (gameRooms[roomIndex].users[userWithBomb].lives == 0) {
            UserHasNoLives(roomIndex, userWithBomb, gameRooms[roomIndex]);
        }
        if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1 && gameRooms[roomIndex].roomName == check) {
            io.to(gameRooms[roomIndex].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
        }
    }

    function respostaIncorrectaUsuariIncorrecte(roomIndex, userWithBomb, roomEnviada) {

        if (gameRooms[roomIndex].roomName == roomEnviada) {
            console.log("resposta incorrecta!");
            gameRooms[roomIndex].pregActual++;
            gameRooms[roomIndex].users[userWithBomb].bomba = false;

            console.log(gameRooms[roomIndex].users[userWithBomb].bomba);
            let userBombN = gameRooms[roomIndex].users.findIndex(user => user.id === socket.id);
            gameRooms[roomIndex].users[userBombN].bomba = true;
            io.to(gameRooms[roomIndex].roomName).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true });
        }
    }
    function respostaIncorrecta(roomIndex, userWithBomb) {
        console.log("resposta incorrecta!");
        if (gameRooms[roomIndex].users[userWithBomb].id == socket.id) {
            respostaIncorrectaUsuariCorrecte(roomIndex, userWithBomb);
        } else {
            if (!gameRooms[roomIndex].shieldUser) {
                respostaIncorrectaUsuariIncorrecte(roomIndex, userWithBomb, gameRooms[roomIndex].roomName);
            }
        }

    }

    function activarEscudoUserNewPregunta(room) {
        let sec = 5;
        io.to(room.roomName).emit('shieldUser', { "activated": true, "sec": sec });
        room.shieldUser = true;
        const interval = setInterval(() => {
            sec--;

            if (sec === 0) {
                io.to(room.roomName).emit('shieldUser', { "activated": false, "sec": sec });
                room.shieldUser = false;
                clearInterval(interval);

            } else {
                io.to(room.roomName).emit('shieldUser', { "activated": true, "sec": sec });
            }
        }, 1000);
    }

    socket.on('resposta', async (data) => {
        let roomIndex = gameRooms.findIndex(room => room.roomName === data.roomName);
        console.log("Pregunta: ", gameRooms[roomIndex].pregunta);

        const preguntaParaEvaluar = gameRooms[roomIndex].pregunta.replace('x', '*');
        const resultatPregunta = eval(preguntaParaEvaluar);
        console.log("Result correct --> ", resultatPregunta);
        console.log(data.resposta);
        let userWithBomb = getUserWithBomb(roomIndex);
        if (data.resposta !== "") {
            if (resultatPregunta == data.resposta) {
                respostaCorrecta(roomIndex, userWithBomb);
            } else {
                respostaIncorrecta(roomIndex, userWithBomb);

            }
            if (socket.id == gameRooms[roomIndex].users[userWithBomb].id) {
                if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1 && gameRooms[roomIndex].roomName == data.roomName) {
                    newPregunta(gameRooms[roomIndex]);
                }
            } else {
                if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1 && gameRooms[roomIndex].roomName == data.roomName && !gameRooms[roomIndex].shieldUser) {
                    newPregunta(gameRooms[roomIndex]);
                }
            }
        }


    });

    function iniciarTimer(room) {
        const size = room.users.length;

        switch (size) {
            case 3:
                room.timer = 31;
                break;
            case 4:
                room.timer = 36;
                break;
            case 5:
            case 6:
                room.timer = 41;
                break;
        }
        room.timerAnterior = room.timer;
    }

    async function startTimer(idRoom) {
        if (gameRooms.length > 0) {
            // console.log("Hay estas rooms", gameRooms);
            let roomPosition = gameRooms.findIndex(room => room.idRoom === idRoom);
            if (roomPosition !== -1) {
                // console.log("timer --> ", gameRooms[roomPosition]);
                if (gameRooms[roomPosition].timer > 0 && gameRooms[roomPosition].started == true) {
                    setTimeout(() => {
                        // console.log("Aqui", gameRooms[roomPosition]);
                        if (roomPosition !== -1 && gameRooms[roomPosition] !== undefined) {
                            if (gameRooms[roomPosition].idRoom == idRoom) {
                                gameRooms[roomPosition].timer--;
                                io.to(gameRooms[roomPosition].roomName).emit('timer', gameRooms[roomPosition].timer);
                                // console.log("tiempo --> ", gameRooms[roomPosition].timer);
                            }


                            if (gameRooms[roomPosition].users.length == 1 && gameRooms[roomPosition].started == true) {
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
                        let userWithBomb = getUserWithBomb(roomPosition);
                        respostaIncorrectaUsuariCorrecte(roomPosition, userWithBomb);
                        if (gameRooms[roomPosition] && gameRooms[roomPosition].users.length > 1 && gameRooms[roomPosition].idRoom == idRoom) {
                            newPregunta(gameRooms[roomPosition]);
                        }
                        startTimer(idRoom);
                    }
                }
            }
        }
    }
    socket.on('leaveRoom', () => {

        if (gameRooms.length > 0) {
            gameRooms.forEach(async room => {
                let usuarioDesconectadoIndex = room.users.findIndex(user => user.id === socket.id);
                // console.log(usuarioDesconectadoIndex);
                if (usuarioDesconectadoIndex !== -1) {
                    if (room.users[usuarioDesconectadoIndex].bomba) {
                        if (usuarioDesconectadoIndex == room.users.length - 1) {
                            room.users[0].bomba = true;
                        } else {
                            room.users[usuarioDesconectadoIndex + 1].bomba = true;
                        }
                    }
                    // console.log("VAAAAAAAAAA", room.users[usuarioDesconectadoIndex]);
                    if (room.users[usuarioDesconectadoIndex].email != 'none') {
                        var email = room.users[usuarioDesconectadoIndex].email;


                        let response = await fetch('http://localhost:8000/api/updateDerrotas', {
                            method: 'POST',
                            body: JSON.stringify({ email }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        // console.log("entrooo????? --> ", email);

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
                            // console.log("entrooo????? --> ", email);
                        }
                        gameRooms[room.idRoom].gameStarted = false;
                        io.to(room.roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: room.users[0].username, image: room.users[0].image, email: room.users[0].email }));
                        gameRooms.splice(room.idRoom, 1);
                        io.sockets.sockets.get(room.users[0].id).leave(room.roomName);

                    }
                    // console.log('Usuario desconectado: ', usuarioDesconectado);

                }

            });
        }
    });

    socket.on('disconnect', () => {
        if (gameRooms.length > 0) {
            gameRooms.forEach(async room => {
                let usuarioDesconectadoIndex = room.users.findIndex(user => user.id === socket.id);
                // console.log(usuarioDesconectadoIndex);
                if (usuarioDesconectadoIndex !== -1) {
                    if (room.users[usuarioDesconectadoIndex].bomba) {
                        if (usuarioDesconectadoIndex == room.users.length - 1) {
                            room.users[0].bomba = true;
                        } else {
                            room.users[usuarioDesconectadoIndex + 1].bomba = true;
                        }
                    }
                    // console.log("VAAAAAAAAAA", room.users[usuarioDesconectadoIndex]);
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
                        // console.log("entrooo????? --> ", email);

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
                            // console.log("entrooo????? --> ", email);
                        }
                        io.to(room.roomName).emit('finishGame', ({ gameStarted: false, timer: 0, username: room.users[0].username, image: room.users[0].image, email: room.users[0].email }));
                        gameRooms.splice(room.idRoom, 1);
                        io.sockets.sockets.get(room.users[0].id).leave(room.roomName);

                    }
                    // console.log('Usuario desconectado: ', usuarioDesconectado);

                }

            });
        }

    });
    socket.on('eliminarPartida', (roomName) => {
        let roomIndex = gameRooms.findIndex(room => room.roomName === roomName);
        gameRooms.splice(roomIndex, 1);
    });
    socket.on('login', (data) => {
        // console.log(data);
    });
    socket.on('getRanking', async () => {
        let response = await fetch('http://localhost:8000/api/ranking', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let ranking = await response.json();
        // console.log(ranking);
        socket.emit('updateRanking', await ranking);

    });
    socket.on('changeSkin', async (data) => {
        // console.log(data);
        let response = await fetch('http://localhost:8000/api/changeIcon', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let responseData = await response.json();
        if (responseData.status == 1) {
            // console.log("Icono cambiado correctamente");
            // console.log(data.foto_perfil);
            socket.emit('changeSkinSuccess', data.foto_perfil);
        }
    });
});

server.listen(5175, () => {
    console.log('Listening on http://localhost:5175');

});