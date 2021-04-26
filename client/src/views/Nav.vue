<template>
<div>
    <v-app-bar clipped-left app color="rgb(0, 128, 128)" dark>
        <v-icon @click="myDrawer = !myDrawer" left v-if="userInfo.userLevel != 3">mdi-menu</v-icon>
        <v-toolbar-title class="dark: true">SCAD CABINET WAREHOUSE</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="userInfo.userLevel == 3">
            <template v-slot:activator="{ on, attr }">
                <v-avatar size="36">
                    <img :src="imageUrl" alt="A" v-bind="attr" v-on="on">
                </v-avatar>
            </template>

            <v-list>
                <div class="text-center">
                    <v-avatar size="90">
                        <v-img aspect-ratio="1" :src="imageUrl"></v-img>
                    </v-avatar>
                </div>
                <v-list-item two-line style="text-align: center">
                    <v-list-item-content v-if="userInfo.fullName">
                        <v-list-item-title class="title">{{userInfo.fullName | toSmallCase }}</v-list-item-title>
                        <v-list-item-subtitle>{{userInfo.UserLevelName}}</v-list-item-subtitle>
                        <!-- <v-list-item-subtitle>{{userInfo.section}}</v-list-item-subtitle> -->
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider color="white"></v-divider>

            <v-list dense>
                <v-list-item-group color="blue">
                    <v-list-item v-for="(item, i) in accountItem" :key="i" @click="clickLogout()">
                        <v-list-item-icon>
                            <v-icon small>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
        <v-icon v-else @click="clickLogout">mdi-logout</v-icon>
    </v-app-bar>
    <v-navigation-drawer app clipped v-model="myDrawer" v-if="userInfo.userLevel != 3">
        <template v-slot:prepend>
            <v-list>
                <div class="text-center">
                    <v-avatar size="90">
                        <v-img aspect-ratio="1" :src="imageUrl"></v-img>
                    </v-avatar>
                </div>
                <v-list-item two-line style="text-align: center">
                    <v-list-item-content v-if="userInfo.fullName">
                        <v-list-item-title class="title">{{userInfo.fullName | toSmallCase }}</v-list-item-title>
                        <v-list-item-subtitle>{{userInfo.UserLevelName}}</v-list-item-subtitle>
                        <!-- <v-list-item-subtitle>{{userInfo.section}}</v-list-item-subtitle> -->
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider color="white"></v-divider>
        </template>
        <template>
            <!-- <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        MENU
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item> -->

            <!-- <v-divider></v-divider> -->

            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        INVENTORY
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list dense nav v-if="userInfo.UserLevelName == 'admin'">
                <v-list-item :to="item.to" v-for="(item, i) in items1" :key="i" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-list dense nav v-else-if="userInfo.UserLevelName == 'picker'">
                <v-list-item :to="item.to" v-for="(item, i) in picker" :key="i" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-list dense nav v-else>
                <v-list-item :to="scheduler.to" v-for="(sched, i) in scheduler" :key="i" link>
                    <v-list-item-icon>
                        <v-icon>{{ sched.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ sched.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider v-if="userInfo.UserLevelName == 'admin'"></v-divider>

            <v-list-item v-if="userInfo.UserLevelName == 'admin'">
                <v-list-item-content>
                    <v-list-item-title class="title">
                        MASTER
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list dense nav v-if="userInfo.UserLevelName == 'admin'">
                <v-list-item :to="each.to" v-for="(each, index) in items2" :key="index" link>
                    <v-list-item-icon>
                        <v-icon>{{ each.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ each.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</div>
</template>

<script>
export default ({
    data() {
        var self = this
        return {
            myDrawer: true,
            // logo: require('@/assets/logoTR.png'),
            accountItem: [{
                title: 'LOGOUT',
                icon: 'mdi-logout'
            }],
            scheduler: [{
                title: 'CHECK STOCK',
                icon: 'mdi-bag-checked',
                to: '/'
            }],
            picker: [{
                    title: 'Pick Items',
                    icon: 'mdi-dolly',
                    to: 'picker'
                },
                {
                    title: 'Check Export Hinban',
                    icon: 'mdi-home-export-outline',
                    to: 'checkExport'
                }
            ],
            items1: [{
                    title: 'CHECK STOCK',
                    icon: 'mdi-bag-checked',
                    to: '/'
                },
                {
                    title: 'IN ITEM',
                    icon: 'mdi-clipboard-arrow-right',
                    to: 'initem'
                },
                // {
                //     title: 'OUT ITEM',
                //     icon: 'mdi-door-open',
                //     to: 'outitem'
                // },
                {
                    title: 'MONITORING',
                    icon: 'mdi-monitor-dashboard',
                    to: 'monitoring1'
                },
                {
                    title: 'NEW STOCK',
                    icon: 'mdi-new-box',
                    to: 'newstock'
                },
                {
                    title: 'IMPORT',
                    icon: 'mdi-file-import',
                    to: 'import'
                },
                // {
                //     title: 'FIRST PROCESS',
                //     icon: 'mdi-home-floor-1',
                //     to: 'firstprocess'
                // },   
                // {
                //     title: 'CRITICAL LEVEL',
                //     icon: 'mdi-home-alert',
                //     to: 'critical'
                // },
                // {
                //     title: 'Pick Items',
                //     icon: 'mdi-dolly',
                //     to: 'picker'
                // },
                // {
                //     title: 'Check Export Hinban',
                //     icon: 'mdi-home-export-outline',
                //     to: 'checkExport'
                // }
            ],
            items2: [{
                    title: 'USERS',
                    icon: 'mdi-account-group',
                    to: 'users'
                },
                // {
                //     title: 'MOTHER and CHILD',
                //     icon: 'mdi-human-female-boy',
                //     to: 'mother2'
                // },
                {
                    title: 'RACK/CABINET',
                    icon: 'mdi-file-cabinet',
                    to: 'rackCabinet'
                },
                {
                    title: 'MOTHER HINBAN',
                    icon: 'mdi-mother-heart',
                    to: 'motherHinban'
                },
                {
                    title: 'MANAGE GROUP',
                    icon: 'mdi-group',
                    to: 'manageGroup'
                }
            ],
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
                    question: {
                        close: false,
                        overlay: true,
                        toastOnce: true,
                        id: 'question',
                        zindex: 999,
                        position: 'center',
                        progressBar: false,
                        timeout: false,
                        buttons: [
                            ['<button><b>YES</b></button>', function (instance, toast) {
                                instance.hide({
                                    transitionOut: 'fadeOut'
                                }, toast, 'button');
                                self.logout()
                            }, true],
                            ['<button>NO</button>', function (instance, toast) {
                                instance.hide({
                                    transitionOut: 'fadeOut'
                                }, toast, 'button');
                            }]
                        ]
                    },
                }
            },
        }
    },
    created() {
        // if (this.userInfo != null) {
        //     if (this.userInfo.userLevel == 2) {
        //         this.$router.push('/picker')
        //     } else {
        //         this.$router.push('/checkstock1')
        //     }
        // } else {
        //     this.$router.push('/login')
        // }
    },
    computed: {
        imageUrl() {
            // return `http://hrdapps48:3001/ftp/employee_pictures/0${this.userInfo.employeeCode}.jpg`
            if (this.userInfo.gender == 'F') {
                return `../../img/female.png`
            } else if (this.userInfo.gender == 'M') {
                return `../../img/male.png`
            } else {
                return `../../img/default.png`
            }
        }
    },
    methods: {
        clickLogout() {
            this.$toast.question('Do you want to logout?', 'Exit!',
                this.notificationSystem.options.question)
            // this.$toast.question('?', 'tae', this.notificationSystem.options.question)
        },

        logout() {
            this.$store.commit('CHANGE_USER_INFO', '')
            this.$store.commit('GETUNREGISTER', [])
            this.$router.push('/login')
        }
    },
    filters: {
        toSmallCase(val) {
            // if (!val) {
            //     return ''
            // } else {
            //     let arrName = val.toLowerCase().split(" ")
            //     return arrName[1].charAt(0).toUpperCase() + arrName[1].slice(1)
            // }
            let arrName = val.toLowerCase().split(" ")
            let arr = []
            for (let i = 0; i < arrName.length; i++) {
                arr.push(arrName[i].charAt(0).toUpperCase() + arrName[i].slice(1))
            }
            return arr.join(" ")
        }
    },
})
</script>
