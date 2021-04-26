<template>
<v-container fluid fill-height>
    <v-layout align-center justify-center>
        <v-flex xs8 class="grey lighten-2">
            <v-container style="position: relative;top: 50%;" class="text-xs-center">
                <v-row>
                    <v-col cols="12" md="6" sm="12" class="d-none d-md-flex">
                        <v-spacer></v-spacer>
                        <div class="logo">
                            <img src="@/assets/collogo.png" alt="SCAD">
                        </div>
                        <v-spacer></v-spacer>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <v-card flat>
                            <v-card-text>
                                <div style="text-align:center">
                                    <img src="@/assets/scad.png" alt="img">
                                </div>
                                <v-spacer></v-spacer>
                                <v-form>
                                    <v-text-field prepend-icon="mdi-account" label="Username" @keyup.enter="txtTrap && onLogin()" v-model="user"></v-text-field>
                                    <v-text-field v-model="pass" prepend-icon="mdi-lock" @keyup.enter="(txtTrap) ? onLogin() : void 0" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" label="Password" @click:append="show1 = !show1"></v-text-field>
                                    <v-card-actions>
                                        <v-btn :disabled="dLogin" primary large block outlined color="blue" @click="onLogin()">Login</v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom>

                </v-progress-linear>
            </v-container>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import axios from 'axios'
// import md5 from 'md5-hex'

export default {
    data() {
        return {
            show1: false,
            loading: false,
            dLogin: false,
            user: '',
            pass: '',
            tempInfo: '',
            holderUserInfo: {},
            userUrl: 'http://hrdapps48:5031/masterlist/id2/',
            notificationSystem: {
                options: {
                    success: {
                        position: "bottomRight"
                    },
                    error: {
                        position: "bottomRight"
                    },
                    info: {
                        position: "bottomLeft"
                    },
                }
            },
        }
    },

    created() {
        this.user = ''
        this.pass = ''
        // this.$barcodeScanner.init(this.sample);
    },

    computed: {
        txtTrap() {
            return (this.user.trim().length > 0 && this.pass.length > 0) ? true : false
        },
    },

    methods: {
        // sample(val){
        //     console.log(val)
        // },
        onLogin() {
            if (this.user == "" || this.pass == "") {
                this.$toast.error('Please fill the textbox!', 'Invalid', this.notificationSystem.options.error)
            } else {
                this.dLogin = true
                axios.post(this.url + 'login', {
                    user: this.user,
                    pass: this.pass
                }).then(res => {
                    if (res.data != "") {
                        this.loading = true
                        this.holderUserInfo = res.data[0]
                        if (res.data[0].userLevel == 1 || res.data[0].userLevel == 3) {
                            axios.get(`${this.url}ggg`).then(res => {
                                // console.log(res.data)
                                if (res.data.length > 0) {
                                    this.GETUNREGISTER(res.data)
                                } else {
                                    this.GETUNREGISTER('OK')
                                }
                                this.CHANGE_USER_INFO(this.holderUserInfo)
                                this.$toast.success(`${this.userInfo.fullName}!`, 'Welcome', this.notificationSystem.options.success)
                                // console.log(this.unRegister, 'unregister')
                                this.loading = false
                                this.$router.push('/')
                            })
                        } else if (res.data[0].userLevel == 2) {
                            this.CHANGE_USER_INFO(this.holderUserInfo)
                            this.$toast.success(`${this.userInfo.fullName}!`, 'Welcome', this.notificationSystem.options.success)
                            this.loading = false
                            this.$router.push('/picker')
                        }
                    } else {
                        this.$toast.error('Unknown user!', 'Invalid', this.notificationSystem.options.error)
                    }
                    this.dLogin = false
                }).catch((e) => {
                    console.log(e)
                })
            }
        }
    }
}
</script>

<style>
.logo {
    margin-top: 25%;
}
</style>
