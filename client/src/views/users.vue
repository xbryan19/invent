<template>
<v-container fluid>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="searching.searchID = '', addUser = true, mode='create'">
                <v-icon left>mdi-account-plus</v-icon>ADD USER
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-card>
                <v-card-title>
                    <h2>USERS LIST</h2>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="accounts" :search="search" height="550" fixed-header>
                        <template v-slot:item.action="{ item }">
                            <v-icon v-if="item.DeletedDate == null" color="red" @click="openModalQuestion(item.EmployeeID), deletionStatus = 0">
                                mdi-delete
                            </v-icon>
                            <v-icon v-else color="green" @click="openModalQuestion(item.EmployeeID), deletionStatus = 1">
                                mdi-delete-restore
                            </v-icon>
                            <v-icon color="blue" @click="editUser(item.EmployeeID, item.EmployeeName, item.UserLevel)">
                                mdi-pencil-box
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>

    <v-row justify="center">
        <v-dialog v-model="addUser" persistent max-width="700">
            <v-card>
                <v-card-title>
                    <h4 v-if="this.mode=='create'">USER REGISTRATION</h4>
                    <h4 v-else>UPDATE USER LEVEL</h4>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-text-field v-if="this.mode=='create'" v-model="searching.searchID" label="ID NUMBER" dense outlined></v-text-field>
                        <v-btn v-if="this.mode=='create'" dark color="primary" large height="40px" @click="searchID()">SEARCH</v-btn>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="3" sm="12">
                            <span>ID NUMBER</span>
                            <v-text-field v-model="userText.idNumber" dense outlined disabled></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <span>EMPLOYEE NAME</span>
                            <v-text-field v-model="userText.name" dense outlined disabled></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" sm="12">
                            <span>LEVEL</span>
                            <v-select v-model="userText.level" outlined dense :items="userLevel" item-value="UserLevel" item-text="UserLevelName"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-btn dark color="primary" @click="cancel()">CANCEL</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="mode == 'create'" dark color="primary" @click="register()">REGISTER</v-btn>
                        <v-btn v-else dark color="primary" @click="update()">UPDATE</v-btn>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="deleteQuestion" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <!-- <v-card-subtitle></v-card-subtitle> -->
                <v-card-text>
                    <p v-if="deletionStatus == 0" class="subtitle-1 font-weight-medium">Deactivate user?</p>
                    <p v-else class="subtitle-1 font-weight-medium">Activate user?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deleteQuestion = false">CANCEL</v-btn>
                    <v-btn v-if="deletionStatus == 0" color="blue darken-1" text @click="deleteAccount()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="activateAccount()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            mode: '',
            addUser: false,
            search: '',
            empID: '',
            deleteQuestion: false,
            deletionStatus: '',
            accounts: [],
            userLevel: [],
            employee: {},
            searching: {},
            userText: {},
            headers: [{
                    text: 'ID',
                    value: 'EmployeeID'
                },
                {
                    text: 'Name',
                    value: 'EmployeeName'
                },
                {
                    text: 'Level',
                    value: 'UserLevelName'
                },
                {
                    text: 'RegisteredDate',
                    value: 'RegisteredDate'
                },
                {
                    text: 'UpdatedDate',
                    value: 'UpdatedDate'
                },
                {
                    text: 'DeletedDate',
                    value: 'DeletedDate'
                },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false
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
                }
            },
        }
    },
    created() {
        this.searching.searchID = ''
        this.getAccounts()
        this.getUserLevel()
    },
    methods: {
        getAccounts() {
            // console.log('run')UserLevelNameUserLevel
            axios.get(`${this.url}fetchAccounts`)
                .then(res => {
                    let x = res.data.map(rec => {
                        return {
                            EmployeeID: rec.EmployeeID,
                            EmployeeName: rec.EmployeeName,
                            UserLevelName: rec.UserLevelName,
                            RegisteredDate: rec.RegisteredDate.substr(0, 10),
                            DeletedDate: rec.DeletedDate,
                            UpdatedDate: rec.UpdatedDate.substr(0, 10),
                            UserLevel: rec.UserLevel
                        }

                    })
                    for (var a = 0; a < x.length; a++) {
                        if (x[a].DeletedDate != null) {
                            x[a].DeletedDate = x[a].DeletedDate.substr(0, 10)
                        }
                    }
                    this.accounts = x
                    // console.log(this.accounts)
                })
        },
        getUserLevel() {
            axios.get(`${this.url}fetchUserLevel`)
                .then(res => {
                    this.userLevel = res.data
                })
        },
        searchID() {
            // console.log(this.searching.searchID)
            if (this.searching.searchID != '' || this.searching.searchID != null) {
                axios.post(`${this.url}searchID`, {
                        idNumber: this.searching.searchID
                    })
                    .then(res => {
                        this.employee = res.data
                        // console.log(this.employee)
                        if (this.employee == '' || this.employee == null) {
                            this.$toast.error('Unknown ID Number', 'Invalid', this.notificationSystem.options.error)
                        } else {
                            // console.log(this.employee[0].EmployeeCode)
                            this.$set(this.userText, 'idNumber', this.employee[0].EmployeeCode)
                            this.$set(this.userText, 'name', this.employee[0].EmployeeName)
                        }
                    })
            }
        },
        register() {
            if (this.userText.idNumber == null || this.userText.idNumber == '' || this.userText.name == null || this.userText.name == '' || this.userText.level == null || this.userText.level == '') {
                this.$toast.error('Please fill up', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            axios.post(`${this.url}trapRegistration`, {
                id: this.userText.idNumber
            }).then(res => {
                if (res.data == null || res.data == '') {
                    axios.post(`${this.url}userRegistration`, {
                    insertUser: this.userText.level,
                    employee: this.employee
                    })
                    .then(res => {
                    this.$toast.success('Added!!', 'Success', this.notificationSystem.options.success)
                    setTimeout(() => {
                        this.getAccounts()
                    }, 300);
                    this.searching.searchID = ''
                    this.userText = ''
                    this.addUser = false
                })
                } else {
                    this.$toast.error('User already exists!', 'Invalid', this.notificationSystem.options.error)
                }
            })
        },
        editUser(id, name, level) {
            // console.log(id, name, level)
            this.mode = 'edit'
            this.$set(this.userText, 'idNumber', id)
            this.$set(this.userText, 'name', name)
            this.$set(this.userText, 'level', level)
            this.addUser = true
        },
        update() {
            axios.post(`${this.url}updateUserLevel`, {
                passUser: this.userText
            })
            .then(res => {
                this.$toast.success('Updated!!', 'Success', this.notificationSystem.options.success)
                setTimeout(() => {
                    this.getAccounts()
                }, 300);
                this.addUser = false
            })
        },
        cancel() {
            this.userText.idNumber = ''
            this.userText.name = ''
            this.userText.level = ''
            this.addUser = false
        },
        openModalQuestion(id) {
            this.empID = id
            this.deleteQuestion = true
        },
        deleteAccount() {
            axios.post(`${this.url}deleteAccount`, {
                deleteID: this.empID
            })
            .then(res => {
                setTimeout(() => {
                    this.getAccounts()
                }, 300);
                this.$toast.error('ACCOUNT DELETED!!', 'Success', this.notificationSystem.options.error)
                this.deleteQuestion = false
            })
            
        },
        activateAccount() {
            axios.post(`${this.url}activateAccount`, {
                activateID: this.empID
            })
            .then(res => {
                setTimeout(() => {
                    this.getAccounts()
                }, 300);
                this.$toast.success('ACCOUNT ACTIVATED!!', 'Success', this.notificationSystem.options.success)
                this.deleteQuestion = false
            })
        }
    }

}
</script>
