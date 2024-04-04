import express, { response } from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'path';
import mysql from 'mysql';

const app = express();

var lobbies = [];
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

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function findOpenGame(lobby) {
    let returnData = null;
    if (lobby) {
        if (lobby.games) {
            lobby.games.forEach(game => {
                if (game.users.length < 6 && !game.started) {
                    returnData = game;
                }
            });
        }
    }
    return returnData;
}

function findLobbieByGameroomId(idGame) {
    let returnData = null;
    lobbies.forEach(lobby => {
        lobby.games.forEach(game => {
            if (game.idGame === idGame) {
                returnData = lobby;
            }
        });
    });
    return returnData;

}

function findFirstPublicLobby() {
    let returnData = null;
    lobbies.forEach(lobby => {
        if (!lobby.private) {
            returnData = lobby;
        }
    });
    return returnData;
}

function createLobby(data, socket) {
    console.log("createLobby");
    let publicLobby = false;
    if (typeof data.private === 'string' || data.private instanceof String) { publicLobby = data.private == "false" ? false : true; } else { publicLobby = data.private; }

    lobbies.push({ "id": makeid(6), "nameLobby": data.name, "games": [], "mode": data.mode, "private": publicLobby, "leader": socket.id, "WaitUntilFull": data.WaitUntilFull, "uniqueIndicator": 0 });
    console.log("games", lobbies);
    return lobbies[lobbies.length - 1];
}

function joinLobby(lobby, socket, data) {
    let openGame = findOpenGame(lobby);
    let theGame;
    if (openGame) {
        socket.join(openGame.idGame);
        openGame.users.push({ "id": socket.id, "username": data.username, "image": data.image, "tutorial": data.tutorial, "bomba": false, "hasClickedStart": false, "lives": 3, "email": data.email });
        theGame = openGame;
    } else {
        lobby.games.push({ idGame: lobby.id + lobby.uniqueIndicator, users: [], started: false, pregunta: "", timer: 1, timerAnterior: 0, shieldUser: "" })
        lobby.games[lobby.games.length - 1].users.push({ "id": socket.id, "username": data.username, "image": data.image, "tutorial": data.tutorial, "bomba": true, "hasClickedStart": false, "lives": 3, "email": data.email });
        lobby.uniqueIndicator++;
        theGame = lobby.games[lobby.games.length - 1];
    }
    return theGame;
}

function findIndexRoomBySocketId(socketId, gameRooms) {

    for (let i = 0; i < gameRooms.length; i++) {
        for (let j = 0; j < gameRooms[i].users.length; j++) {
            if (gameRooms[i].users[j].id === socketId) {
                return i;
            }
        }
    }
}

async function getUser(data, socket) {
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
        console.log(responseData.status, "==", 1);
        if (responseData.status === 1) {
            let returnData = responseData;
            returnData.id = socket.id;
            returnData.image = responseData.foto_perfil;
            returnData.username = responseData.username;
            returnData.email = responseData.email;
            if (responseData.tutorial === 1) {
                returnData.tutorial = true;
            }
            else {
                returnData.tutorial = false;
            }
            returnData.status = 1;
            socket.emit('loginSuccess', returnData);

            // console.log("response.ok....", responseData);

            return returnData;
        } else {
            // console.log("response.Notok....", responseData);
            socket.emit('loginError', responseData.status);
        }

    } catch (error) {
        // console.error('There has been a problem with your fetch operation:', error);
    }
}

function getRoomBySocketId(socketId) {
    let room = false;
    lobbies.forEach(Lobby => {
        Lobby.games.forEach(gameRoom => {
            gameRoom.users.forEach(user => {
                if (user.id === socketId) {
                    room = gameRoom;
                }
            });
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

function findGameByUserId(lobbyGames, socket) {
    let returnData = null;
    lobbyGames.forEach(game => {
        game.users.forEach(user => {
            if (user.id === socket) {
                returnData = game;
            }
        });
    });
    return returnData;
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
    activarEscudoUserNewPregunta(room);
    room.pregunta = pregunta;
    room.pregActual = id_pregunta;
    io.to(room.idGame).emit('pregunta', { "id": room.pregActual, "pregunta": room.pregunta });
}
function getUserWithBomb(room, gameRooms) {

    for (let i = 0; i < gameRooms[room].users.length; i++) {
        if (gameRooms[room].users[i].bomba) {
            return i;
        }
    }
}
function respostaCorrecta(roomIndex, userWithBomb, gameRooms, socket) {
    gameRooms[roomIndex].pregActual++;
    console.log(gameRooms[roomIndex].users[userWithBomb]);
    if (socket.id == gameRooms[roomIndex].users[userWithBomb].id) {
        respostaCorrectaUsuariCorrecte(roomIndex, userWithBomb, gameRooms);
    } else {
        if (!gameRooms[roomIndex].shieldUser) {
            respostaCorrectaUsuariIncorrecte(roomIndex, userWithBomb, gameRooms);
        }
    }
}

function respostaCorrectaUsuariCorrecte(roomIndex, userWithBomb, gameRooms) {
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
    io.to(gameRooms[roomIndex].idGame).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true, "explodes": false });
}

function respostaCorrectaUsuariIncorrecte(roomIndex, userWithBomb, gameRooms) {

    console.log("resposta correcta!");
    gameRooms[roomIndex].users[userWithBomb].bomba = true;
    gameRooms[roomIndex].timer -= 10;
    io.to(gameRooms[roomIndex].idGame).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true, "explodes": false });
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
async function updateVictorias(roomIndex, gameRooms) {
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

// function findLobbieByPassword(password) {
//     let room = lobbies.find(lobby => lobby.id === password);
//     return room;
// }

function UserHasNoLives(roomIndex, userWithBomb, gameRooms) {
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
    socket.leave(gameRooms[roomIndex].idGame);
    socket.emit('userLost', gameRooms[roomIndex].users[userWithBomb]);
    gameRooms[roomIndex].users.splice(userWithBomb, 1);
    console.log("USERS -> " + gameRooms[roomIndex].users);
    if (gameRooms[roomIndex].users.length == 1 && gameRooms[roomIndex].started == true) {
        updateVictorias(roomIndex, gameRooms);
        let lobbie=findLobbieByGameroomId(gameRooms[roomIndex].idGame);
        io.to(gameRooms[roomIndex].idGame).emit('finishGame', ({ gameStarted: false, timer: 0, username: gameRooms[roomIndex].users[0].username, image: gameRooms[roomIndex].users[0].image, email: gameRooms[roomIndex].users[0].email }));
        io.sockets.sockets.get(gameRooms[roomIndex].users[0].id).leave(gameRooms[roomIndex].idGame);
        lobbie.games.splice(roomIndex, 1);
       
    } else {
        if (gameRooms[roomIndex].users.length > 1) {
            io.to(gameRooms[roomIndex].idGame).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true, "explodes": false });
        }
       
    }
}
function respostaIncorrectaUsuariCorrecte(roomIndex, userWithBomb, gameRooms) {
    gameRooms[roomIndex].timer = gameRooms[roomIndex].timerAnterior;
    gameRooms[roomIndex].pregActual++;
    gameRooms[roomIndex].users[userWithBomb].lives--;
    let check = gameRooms[roomIndex].idGame;
    console.log("lives restantes -> " + gameRooms[roomIndex].users[userWithBomb].lives);

    if (gameRooms[roomIndex].users[userWithBomb].lives == 0) {
        UserHasNoLives(roomIndex, userWithBomb, gameRooms);
    }
    if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1 && gameRooms[roomIndex].idGame == check) {
        io.to(gameRooms[roomIndex].idGame).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true, "explodes": true });
    }
}

function respostaIncorrectaUsuariIncorrecte(roomIndex, userWithBomb, roomEnviada, gameRooms, socket) {

    if (gameRooms[roomIndex].idGame == roomEnviada) {
        console.log("resposta incorrecta!");
        gameRooms[roomIndex].pregActual++;
        gameRooms[roomIndex].users[userWithBomb].bomba = false;

        console.log(gameRooms[roomIndex].users[userWithBomb].bomba);
        let userBombN = gameRooms[roomIndex].users.findIndex(user => user.id === socket.id);
        gameRooms[roomIndex].users[userBombN].bomba = true;
        io.to(gameRooms[roomIndex].idGame).emit('changeBomb', { "arrayUsers": gameRooms[roomIndex].users, "bombChange": true, "explodes": false });
    }
}
function respostaIncorrecta(roomIndex, userWithBomb, gameRooms, socket) {
    console.log("resposta incorrecta!");
    if (gameRooms[roomIndex].users[userWithBomb].id == socket.id) {
        respostaIncorrectaUsuariCorrecte(roomIndex, userWithBomb, gameRooms);
    } else {
        if (!gameRooms[roomIndex].shieldUser) {
            respostaIncorrectaUsuariIncorrecte(roomIndex, userWithBomb, gameRooms[roomIndex].idGame, gameRooms, socket);
        }
    }

}

function activarEscudoUserNewPregunta(room) {
    let sec = 5;
    io.to(room.idGame).emit('shieldUser', { "activated": true, "sec": sec });
    room.shieldUser = true;
    const interval = setInterval(() => {
        sec--;

        if (sec === 0) {
            io.to(room.idGame).emit('shieldUser', { "activated": false, "sec": sec });
            room.shieldUser = false;
            clearInterval(interval);

        } else {
            io.to(room.idGame).emit('shieldUser', { "activated": true, "sec": sec });
        }
    }, 1000);
}
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

async function startTimer(idRoom, socket) {
    console.log("startTimer");
    let gameRooms = findLobbieBySocketId(socket.id);
    if (gameRooms.length > 0) {
        // console.log("Hay estas rooms", gameRooms);
        let roomPosition = gameRooms.findIndex(room => room.idGame === idRoom);
        if (roomPosition !== -1) {
            // console.log("timer --> ", gameRooms[roomPosition]);
            if (gameRooms[roomPosition].timer > 0 && gameRooms[roomPosition].started == true) {
                setTimeout(() => {
                    // console.log("Aqui", gameRooms[roomPosition]);
                    if (roomPosition !== -1 && gameRooms[roomPosition] !== undefined) {
                        if (gameRooms[roomPosition].idGame == idRoom) {
                            gameRooms[roomPosition].timer--;
                            io.to(gameRooms[roomPosition].idGame).emit('timer', gameRooms[roomPosition].timer);
                            // console.log("tiempo --> ", gameRooms[roomPosition].timer);
                        }


                        if (gameRooms[roomPosition].users.length == 1 && gameRooms[roomPosition].started == true) {
                            console.log(gameRooms)

                        } else {
                            if (gameRooms[roomPosition].users.length > 1) {
                                startTimer(idRoom, socket);
                            }
                        }
                    }
                }, 1000);
            } else {
                if (gameRooms[roomPosition].started == true && gameRooms[roomPosition].timer <= 0) {
                    let userWithBomb = getUserWithBomb(roomPosition, gameRooms);
                    respostaIncorrectaUsuariCorrecte(roomPosition, userWithBomb, gameRooms);
                    if (gameRooms[roomPosition] && gameRooms[roomPosition].users.length > 1 && gameRooms[roomPosition].idGame == idRoom) {
                        newPregunta(gameRooms[roomPosition]);
                    }
                    console.log("timer acabado");
                    startTimer(idRoom, socket);
                }
            }
        }
    }
}

function findLobbieBySocketId(socketId) {
    let rooms = [];
    lobbies.forEach(lobby => {
        lobby.games.forEach(game => {
            game.users.forEach(user => {
                if (user.id === socketId) {
                    rooms.push(game);
                }
            });
        });
    });
    return rooms;
}

io.on('connection', (socket) => {
    console.log("User connected.");
    console.log(socket.id);

    console.log('Salas: ', io.sockets.adapter.rooms);

    socket.on('createGame', (data) => {
        if (data.MaxPlayers >= 3) {
            let lobbyToJoin = createLobby(data, socket);

            socket.emit('roomDone', lobbyToJoin);
            let openLobbies = lobbies.filter(lobby => !lobby.private);
            socket.broadcast.emit('salas', openLobbies);
            return false;
        } else {
            socket.emit('error', 'Minim 3 jugadors');
            return true;
        }
    });

    socket.on('join', (data) => {
        let game;
        let lobby = null;
        console.log("Soy", data);
        console.log("tutorial", data.tutorial);
        let error = false;
        if (data.idLobby || data.password) {
            
            if (data.idLobby) {
                lobby = lobbies.find(lobby => lobby.id === data.idLobby);
                console.log(lobby);
                if (lobby && ((lobby.private && lobby.password === data.password) || !lobby.private)) {
                    game = joinLobby(lobby, socket, data);
                    socket.emit('userJoined');
                } else {
                    socket.emit('joinError', 'Contrasenya incorrecta');
                    error = true;
                }
            } else {
                socket.emit('joinError', 'No existeix aquesta sala');
                error = true;
            }
        } else {
            lobby = findFirstPublicLobby();
            console.log(lobby);
            if (lobby) {
                console.log("Hi");
                game = joinLobby(lobby, socket, data);
            } else {
                console.log("No hi");
                let config = {
                    name: "Sala Rapida",
                    mode: "classic",
                    private: false,
                    WaitUntilFull: false
                }
                createLobby(config, socket);
                let openLobbies = lobbies.filter(lobby => !lobby.private);
                socket.broadcast.emit('salas', openLobbies);
                lobby = lobbies[lobbies.length - 1];
                game = joinLobby(lobby, socket, data);
            }

        }
        if (!error) {
            console.log("game", lobby);
            socket.join(game.idGame);
            socket.emit('userDataUpdate', { "user": game.users[game.users.length - 1], "game": lobby.id });
            console.log(game.users);
            io.to(game.idGame).emit('usersConnected', game.users);
            console.log('Salas: ', io.sockets.adapter.rooms);
            console.log('Salas: ', lobbies[0].games[0].users);
        }
    });

    // if (gameRooms.length == 0) {
    //     lastRoom++;
    //     gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0, shieldUser: "" });
    // } else {
    //     if (gameRooms[gameRooms.length - 1].users.length == 6 || gameRooms[gameRooms.length - 1].started === true) {
    //         lastRoom++;
    //         gameRooms.push({ idRoom: lastRoom, roomName: "gameRoom" + lastRoom, users: [], started: false, pregunta: "", pregActual: 0, timer: 1, timerAnterior: 0, shieldUser: "" });
    //     }
    // }
    // if (gameRooms[gameRooms.length - 1].users.length == 0) {
    //     // Si no hay usuarios conectados, se agrega el primer usuario a la sala
    //     gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: true, image: data.image, tutorial: data.tutorial, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: false });

    // } else {
    //     // Si ya hay usuarios, se agrega un nuevo usuario a la sala
    //     gameRooms[gameRooms.length - 1].users.push({ username: data.username, id: socket.id, bomba: false, image: data.image, tutorial: data.tutorial, roomPosition: lastRoom, lives: 3, email: data.email, roomName: gameRooms[gameRooms.length - 1].roomName, hasClickedStart: false });
    // }



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
        await getUser(data, socket);
    });




    socket.on('startGame', () => {
        let lobbyGames = findLobbieBySocketId(socket.id);
        let room = findGameByUserId(lobbyGames, socket.id);

        if (room) {
            // Primer bloque de código
            let userIndex = room.users.findIndex(user => user.id === socket.id);
            room.users[userIndex].hasClickedStart = !room.users[userIndex].hasClickedStart;


            // Marcar la sala como iniciada y realizar otras acciones necesarias
            io.to(room.idGame).emit('usersDesconectados', room.users, room.idGame);
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
                            startTimer(room.idGame, socket);
                            // Emitir evento de inicio de juego a todos los usuarios en la sala
                            io.to(room.idGame).emit('gameStarted', { allPlayersStarted: true });
                        } else {
                            if (checkAllPlayersClickedStart(room)) {
                                console.log("index" + index);
                                io.to(room.idGame).emit('countdown', index);
                            } else {
                                room.started = false;
                                index = -2;
                                console.log("No todos los jugadores han clicado en start");
                                io.to(room.idGame).emit('countdown', index);
                            }
                        }
                    }, 1500 * (countdown - index));
                }

            }


        }
    });




    socket.on('resposta', async (data) => {
        let gameRooms = findLobbieBySocketId(socket.id);
        console.log("gameRooms --> ", gameRooms);
        console.log("data --> ", data);
        let roomIndex = findIndexRoomBySocketId(socket.id, gameRooms);
        console.log("Room index --> ", roomIndex);
        console.log(gameRooms);
        console.log("Pregunta: ", gameRooms[roomIndex].pregunta);
        let control=gameRooms[roomIndex].idGame;
        const preguntaParaEvaluar = gameRooms[roomIndex].pregunta.replace('x', '*');
        const resultatPregunta = eval(preguntaParaEvaluar);
        console.log("Result correct --> ", resultatPregunta);
        console.log(data.resposta);
        let userWithBomb = getUserWithBomb(roomIndex, gameRooms);
        if (data.resposta !== "") {
            if (resultatPregunta == data.resposta) {
                console.log("Correcte", userWithBomb);
                respostaCorrecta(roomIndex, userWithBomb, gameRooms, socket);
            } else {
                respostaIncorrecta(roomIndex, userWithBomb, gameRooms, socket);

            }
            if (gameRooms[roomIndex] != undefined && gameRooms[roomIndex].idGame==control && gameRooms[roomIndex].users.length > 1) {
                userWithBomb = getUserWithBomb(roomIndex, gameRooms);
                if (socket.id == gameRooms[roomIndex].users[userWithBomb].id) {
                    console.log("NEWPREGUNTA")
                    if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1) {

                        newPregunta(gameRooms[roomIndex]);
                    }
                } else {
                    console.log("NEWPREGUNTA2")
                    if (gameRooms[roomIndex] && gameRooms[roomIndex].users.length > 1 && !gameRooms[roomIndex].shieldUser) {
                        newPregunta(gameRooms[roomIndex]);
                    }
                }
            }

        }


    });


    socket.on('leaveRoom', () => {
        let gameRooms = findLobbieBySocketId(socket.id);
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
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
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

    socket.on('getSalas', () => {
        let openLobbies = [];
        openLobbies = lobbies.filter(lobby => !lobby.private);
        console.log("perra", openLobbies);
        socket.emit('salas', openLobbies);
    })

    socket.on('disconnect', () => {
        let gameRooms = findLobbieBySocketId(socket.id);
        if (gameRooms) {
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
                        socket.leave(room.idGame);
                        io.to(room.idGame).emit('usersDesconectados', room.users, room.idGame);
                        if (room.users.length == 1 && room.started == true) {
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
                            io.to(room.idGame).emit('finishGame', ({ gameStarted: false, timer: 0, username: room.users[0].username, image: room.users[0].image, email: room.users[0].email }));


                            io.sockets.sockets.get(room.users[0].id).leave(room.idGame);

                        } else {
                            console.log("USERS", room.users);
                            if (room.users.length < 1) {
                                let lobbyToEliminate = findLobbieByGameroomId(room.idGame);
                                console.log('roomToEliminate', room);
                               
                                let roomIndex = lobbyToEliminate.games.findIndex(room => room.roomName === room.idGame);
                                lobbyToEliminate.games.splice(roomIndex, 1);
                                console.log(lobbyToEliminate.games);
                                if (lobbyToEliminate.games.length < 1) {
                                    let lobbyIndex = lobbies.findIndex(lobby => lobby.id === lobbyToEliminate.id);
                                    console.log('lobbyIndex', lobbyIndex);
                                    lobbies.splice(lobbyIndex, 1);

                                }
                            }
                        }
                        // console.log('Usuario desconectado: ', usuarioDesconectado);

                    }

                });
            }
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