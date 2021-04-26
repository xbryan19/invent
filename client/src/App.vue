<template>
<v-app>
    <Nav v-if="confirmed"/>
    <v-main>
        <router-view></router-view>
    </v-main>
</v-app>
</template>

<script>
import Nav from '@/views/Nav.vue';
// import { userInfo } from 'os'
export default {
    components: {
        Nav,
    },
    data() {
        return {
            confirmed: false
        }
    },
    watch: {
        userInfo() {    
          this.authenticate()
        }
    },
    created() {
        this.authenticate()
    },
    methods: {
        authenticate() {
            if (this.userInfo.employeeCode != undefined) {
                this.confirmed = true
            } else {
                this.confirmed = false
            }
        }
    }
};
</script>
