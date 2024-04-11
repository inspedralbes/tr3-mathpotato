import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        lobbies: [
            { idLobby: '', nameLobby: '', mode: '', waitUntilFull: false, numUser: 0 },
        ],
        infoGame: {
            rooms: {
                gameRooms: [
                    {
                        users: [
                            { username: '', bomba: false, tutorial: true, image: './assets/Icon_2.png' }
                        ]
                    },
                ],
            }
        },
        guestInfo: {
            username: '',
            bomba: false,
            image: 1,
            lives: 2,
            email: 'none',
            lost: false,
            win: false,
            tutorial: true,
            token: '',
            consecutiveVictories: 0,
            wins: 0,
            losses: 0,
        },
        users: [],
        pregunta: {
            id_pregunta: "",
            pregunta: "",
        },
        actualRoomName: '',
        respostaAnterior: true,
        explodes: false,
        timer: 0,
        sugerencia: 0,
        gameStarted: false,
        gameWinner: false,
        open: false,
        error: "",
        ranking: [],
        countdown: -2,
        shieldUser: {
            activated: false,
            sec: 0
        }
    }),
    actions: {
        setDefaultValues() {
            this.lobbies = [
                { idLobby: '', nameLobby: '', mode: '', waitUntilFull: false, numUser: 0 },
            ],
                this.infoGame = {
                    rooms: {
                        gameRooms: [
                            {
                                users: [
                                    { username: '', bomba: false, tutorial: true, image: './assets/Icon_2.png' }
                                ]
                            },
                        ],
                    }
                },
                this.users = [],
                this.pregunta = {
                    id_pregunta: "",
                    pregunta: "",
                },
                this.actualRoomName = '',
                this.respostaAnterior = true,
                this.explodes = false,
                this.timer = 0,
                this.gameStarted = false,
                this.gameWinner = false,
                this.error = "",
                this.ranking = [],
                this.open = false,
                this.countdown = -2,
                this.shieldUser = {
                    activated: false,
                    sec: 0
                }
        },
        setCountdown(countdown) {
            this.countdown = countdown;
        },
        getCountdown() {
            return this.countdown;
        },
        setLobbiesName(lobbies) {
            this.lobbies[0].nameLobby = lobbies;
            this.lobbies[0].mode = lobbies;
            this.lobbies[0].numUser = 20;

        },
        setOpen(data) {
            this.open = data;
        },
        getOpen() {
            return this.open;
        },
        setModes(modes) {
            this.lobbies[0].mode = modes;
        },
        getModes() {
            return this.lobbies[0].mode;
        },
        getLobbiesName() {
            return this.lobbies;
        },
        updateLobbies(lobbies) {
            this.lobbies[0].nameLobby = lobbies;
            this.lobbies[0].mode = lobbies;
        },
        setSalas(salas) {
            this.lobbies = salas;
        },
        getSalas() {
            return this.lobbies;
        },
        setRoomName(data) {
            console.log('RoomName: ', data);
            this.actualRoomName = data;
        },
        setGameStarted(gameStarted) {
            this.gameStarted = gameStarted;

        },
        setSugerenciaCompletada(data) {
            this.sugerencia = data.sugerencia;
        },
        getSugerencias() {
            return this.sugerencia;
        },
        getGameStarted() {
            return this.gameStarted;
        },
        setGameRooms(gameRooms) {
            this.infoGame.rooms.gameRooms = gameRooms;
            console.log(this.infoGame.rooms.gameRooms);
        },
        getGameRooms() {
            return this.infoGame.rooms.gameRooms;
        },
        getRoomName() {
            return this.actualRoomName;
        },
        setPublicRooms(gameRooms) {
            this.infoGame.rooms.gameRooms[0].roomName = gameRooms;
            console.log(this.infoGame.rooms.gameRooms[0].roomName);
        },
        getPublicRooms() {
            return this.infoGame.rooms.gameRooms[0].roomName;
        },
        setUsersInRoom(users) {
            this.infoGame.rooms.gameRooms[0].users = users;
            console.log(this.infoGame.rooms.gameRooms[0].users);
        },
        getUsersInRoom() {
            return this.infoGame.rooms.gameRooms[0].users;
        },
        updateUsersOnDisconnectInRoom({ roomName, users }) {
            if (this.infoGame.rooms.hasOwnProperty(roomName)) {
                this.infoGame.rooms[roomName].users = users;
                console.log('Usuarios en la sala ${roomName} actualizados: ', users);
            }
        },
        setUsers(users) {
            this.users = users;
            console.log(this.users);
        },
        getUsers() {
            return this.users;
        },
        updateUsersOnDisconnect(users) {
            this.setUsers(users);
        },
        setGuestInfo(data) {
            if (data.hasOwnProperty('username')) {
                this.guestInfo.username = data.username;
            }
            if (data.hasOwnProperty('id')) {
                this.guestInfo.id = data.id;
            }
            if (data.hasOwnProperty('image')) {
                this.guestInfo.image = data.image;
            }
            if (data.hasOwnProperty('email')) {
                this.guestInfo.email = data.email;
            }
            if (data.hasOwnProperty('win')) {
                this.guestInfo.win = data.win;
            }
            if (data.hasOwnProperty('lost')) {
                this.guestInfo.lost = data.lost;
            }
            if (data.hasOwnProperty('tutorial')) {
                this.guestInfo.tutorial = data.tutorial;
            }
            if (data.hasOwnProperty('token')) {
                this.guestInfo.token = data.token;
            }
            if (data.hasOwnProperty('consecutiveVictories')) {
                this.guestInfo.consecutiveVictories = data.consecutiveVictories;
            }
            if (data.hasOwnProperty('wins')) {
                this.guestInfo.wins = data.wins;
            }
            if (data.hasOwnProperty('losses')) {
                this.guestInfo.losses = data.losses;
            }
            console.log('*infoGuest*');
            console.log(this.guestInfo.username);
            console.log(this.guestInfo.id);
        },
        getGuestInfo() {
            return this.guestInfo;
        },
        clearGuestInfo() {
            this.guestInfo.username = '';
            this.guestInfo.id = '';
            this.guestInfo.bomba = false;
            this.guestInfo.email = 'none';
        },
        setShieldUser(shieldUser) {
            this.shieldUser.activated = shieldUser.activated;
            this.shieldUser.sec = shieldUser.sec;
        },
        getShieldUser() {
            return this.shieldUser;
        },
        setPregunta(pregunta) {
            this.pregunta.id_pregunta = pregunta.id_pregunta;
            this.pregunta.pregunta = pregunta.pregunta
        },
        getPregunta() {
            return this.pregunta;
        },
        setRespostaAnterior(resposta) {
            this.respostaAnterior = resposta;
        },
        getRespostaAnterior() {
            return this.respostaAnterior;
        },
        setTimer(timerValue) {
            this.timer = timerValue;
        },
        getTimer() {
            return this.timer;
        },
        setError(error) {
            this.error = error;
        },
        getError() {
            return this.error;
        },
        setGuestImage(image) {
            console.log('Imagen: ', image);
            this.guestInfo.image = image;
        },
        setUpdateProfile(data) {
            console.log("data updateProfile", data);
            this.guestInfo.image = data.foto_perfil;
            this.guestInfo.email = data.email;
            this.guestInfo.username = data.username;
        },
        getUpdateProfile() {
            return this.guestInfo;
        },
        setRanking(ranking) {
            this.ranking = ranking;
        },
        getRanking() {
            return this.ranking;
        },
        setWin() {
            this.guestInfo.win = true;
            this.setTutorial()
            console.log('Ganador: ', this.guestInfo.tutorial);
        },
        getWin() {
            return this.guestInfo.win;
        },
        setLost() {
            this.guestInfo.lost = true;
            this.setTutorial()
            console.log('Perdedor: ', this.guestInfo.tutorial);
        },
        getLost() {
            return this.guestInfo.lost;
        },
        setTutorial() {
            this.guestInfo.tutorial = false;
        },
        getTutorial() {
            return this.guestInfo.tutorial;
        },
        clearGuestInfo() {
            this.guestInfo.username = '';
            this.guestInfo.id = '';
            this.guestInfo.bomba = false;
            this.guestInfo.image = './assets/Icon_2.png';
            this.guestInfo.lives = 2;
            this.guestInfo.email = '';
            this.guestInfo.lost = false;
            this.guestInfo.win = false;

        },
        getExplodes() {
            return this.explodes;
        },
        setExplodes(explodes) {
            this.explodes = explodes;
        }
    },

});