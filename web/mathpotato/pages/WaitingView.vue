<template>
    <div>
        <ul>
            <li>
                <h3>Users Conectados</h3>
                <ul v-if="users.length > 0">
                    <li v-for="user in users" :key="user" >
                        {{ console.log(users)  }}
                        {{ user.username }}
                        {{ user.bomba }}
                        
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    import { socket } from '../socket';
    import { useAppStore } from '../stores/guestStore.js';
    import { computed } from 'vue';

    export default {
        data() {
            const store = useAppStore();
            return {
               /* users: [{
                    username: computed(() => store.username),
                    id: computed(() => store.id),
                    
                }],*/

                users: computed(() => store.getUsers()),
                
            };
        },
        methods: {
            
            handleUserList(users) {
            this.users = users;
            console.log(this.users);
            socket.emit('usersWaitingGame', this.users);
            

            // const store = useAppStore();
            // store.getGuestInfo(this.users);
            },
        },
    }
    
  
</script>

<style lang="scss" scoped>

</style>