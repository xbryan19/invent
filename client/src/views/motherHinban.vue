<template>
<v-container fluid>
    <v-card outlined>
        <v-card-text>
            <v-row dense>
                <v-col cols="12" md="8" sm="12">
                    <v-text-field class="searchTxt" v-model="search" append-icon="mdi-magnify" label="Search" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="2" sm="12">
                    <v-btn class="searchBtn btn" color="primary" :disabled="whenSearch" @click="searching()"><v-icon left>mdi-database-search</v-icon>SEARCH</v-btn>
                </v-col>
                <v-col cols="12" md="2" sm="12">
                    <v-btn class="refreshBtn btn" color="primary" dark @click="refresh()"><v-icon left>mdi-database-refresh</v-icon>REFRESH</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <v-row dense>
        <v-spacer></v-spacer>
        <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="newBtn" v-on="on" @click="new_item"><v-icon left>mdi-database-plus</v-icon>New Hinban</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4" v-if="editedIndex != -1">
                                <v-text-field readonly v-model="insertData.ExportHinbanCode" label="Export Hinban Code"></v-text-field>
                            </v-col>
                            <!-- <v-col cols="12" sm="6" md="4" v-else>
                                <v-text-field readonly v-model="insertData.ExportHinbanCode" label="Export Hinban Code Add"></v-text-field>
                            </v-col> -->
                            <v-col cols="12" sm="6" md="8" v-if="editedIndex != -1">
                                <v-text-field v-model="insertData.ExportHinban" label="Export Hinban Name"></v-text-field>
                            </v-col>
                            <v-col cols="12" v-else>
                                <v-text-field v-model="insertData.ExportHinban" label="Export Hinban Name"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-card>
        <v-card-text>
            <v-data-table dense fixed-header hide-default-footer disable-pagination :headers="headers" :items="displayTable" class="elevation-1" height="500" :loading="loading" loading-text="Loading... Please wait">
                <template v-slot:item.action="{ item }">
                    <v-icon color="primary" class="mr-2" @click="editItem(item)">
                        mdi-pencil-box
                    </v-icon>
                    <v-icon v-if="item.DeletedDate == null" color="red" @click="questionDelete(item), deleteStatus = 0">
                        mdi-delete
                    </v-icon>
                    <v-icon v-else color="green" @click="questionDelete(item), deleteStatus = 1">
                        mdi-delete-restore
                    </v-icon>
                </template>
            </v-data-table>
        </v-card-text>
        <v-card-actions>
            <v-row dense>
                <v-col cols="12" xs="12" sm="2">
                    <v-select class="drop" label="rows per page:" outlined v-model="down" dense :items="perPage" item-value="value" item-text="text" @change="gg()"></v-select>
                </v-col>
                <v-col cols="12" xs="12" sm="10">
                    <template>
                        <div class="text-center">
                            <v-pagination
                                v-model="page"
                                :length="pageLength"
                                :total-visible="totalShow">
                            </v-pagination>
                        </div>
                    </template>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>

    <v-row justify="center">
        <v-dialog v-model="saveQuestioner" persistent max-width="290">
            <v-card>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <p v-if="deleteStatus ==0" class="subtitle-1 font-weight-black">Are you sure to delete this?</p>
                    <p v-else class="subtitle-1 font-weight-black">Activate Export Hinban?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="saveQuestioner = false">CANCEL</v-btn>
                    <v-btn v-if="deleteStatus ==0" color="blue darken-1" text @click="deleteItem()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="activateItem()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            hinbanItem: {},
            saveQuestioner: false,
            dialog: false,
            loading: false,
            search: '',
            deleteStatus: '',
            page: 1,
            totalShow: 7,
            down: 25,
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
            perPage: [{
                    text: '25',
                    value: 25
                },
                {
                    text: '50',
                    value: 50
                },
                {
                    text: '100',
                    value: 100
                },
                {
                    text: '250',
                    value: 250
                },
                {
                    text: '500',
                    value: 500
                }
            ],
            headers: [{
                    text: 'Export Hinban Code',
                    align: 'center',
                    value: 'ExportHinbanCode',
                },
                {
                    text: 'Export Hinban',
                    align: 'left',
                    value: 'ExportHinban'
                },
                {
                    text: 'Group',
                    align: 'center',
                    value: 'GroupID'
                },
                {
                    text: 'Deleted Date',
                    align: 'center',
                    value: 'DeletedDate'
                },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false
                }
            ],
            motherData: [],
            motherDataCopy: [],
            motherDataHolder: [],
            insertData: [],
            editedIndex: -1,
            editedItem: {},
            defaultItem: {},
            trapEdit: {}
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Hinban' : 'Edit Hinban'
        },
        displayTable() {
            this.motherDataHolder = this.motherDataCopy
            return this.motherDataHolder.slice((this.page - 1) * this.down, (this.page - 1) * this.down + this.down) 
        },
        pageLength() {
            let divide = parseInt(this.motherDataHolder.length / this.down)
            return (parseInt(this.motherDataHolder.length % this.down)) ? divide += 1 : divide += 0
        },
        whenSearch() {
            return (this.search.trim().length > 0) ? false : true
        }
    },
    created() {
        this.getMotherHinban()
    },
    methods: {
        new_item() {
            this.insertData = {}
            axios.get(`${this.url}getMaxID`).then(res => {
                if (res.data[0].id != null) {
                    this.$set(this.insertData, 'ExportHinbanCode', res.data[0].id + 1)
                } else {
                    this.$set(this.insertData, 'ExportHinbanCode', 1)
                }
            })
        },
        getMotherHinban() {
            this.loading = true
            axios.get(`${this.url}getMotherHinban`)
            .then(res => {
                let x = res.data.map(rec => {
                    return {
                        CreatedDate: rec.CreatedDate,
                        DeletedDate: rec.DeletedDate,
                        ExportHinbanCode: rec.ExportHinbanCode,
                        ExportHinban: rec.ExportHinban,
                        UpdatedDate: rec.UpdatedDate,
                        DeletedDate: rec.DeletedDate,
                        GroupID: rec.GroupID
                    }
                })
                for (var a = 0; a < x.length; a++) {
                    if (x[a].DeletedDate != null) {
                        x[a].DeletedDate = x[a].DeletedDate.substr(0, 10)
                    }
                }
                this.motherData = x
                this.motherDataCopy = this.motherData
                this.loading = false
                this.page = 1
                this.totalShow = 7
            })
        },
        editItem(item) {
            this.trapEdit = item
            this.editedIndex = this.motherData.indexOf(item)
            // this.insertData = item
            this.insertData.ExportHinbanCode = item.ExportHinbanCode
            this.insertData.ExportHinban = item.ExportHinban
            this.dialog = true
        },
        questionDelete(item) {
            this.hinbanItem = item
            this.saveQuestioner = true
        },

        deleteItem() {
            // console.log(item)
            // if (confirm('Are you sure to delete this?')) {
            // var index = this.motherData.indexOf(item)
            // this.motherData.splice(index, 1)
            axios.post(`${this.url}deleteItem`, this.hinbanItem).then(res => {
                // console.log(res.data)
                this.getMotherHinban()
                this.$toast.error('Deleted Successfully!', 'DELETED', this.notificationSystem.options.error)
                this.saveQuestioner = false
            })

            // }
        },
        activateItem() {
            axios.post(`${this.url}activateItem`, this.hinbanItem).then(res => {
                this.getMotherHinban()
                this.$toast.success('Item activated!', 'SUCCESS', this.notificationSystem.options.success)
                this.saveQuestioner = false
            })
        },

        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        save() {
            if (this.insertData.ExportHinban == '' || this.insertData.ExportHinban == null) {
                this.$toast.error('Please fill up!', 'INVALID', this.notificationSystem.options.error)
            } else {
                if (this.editedIndex > -1) {
                    if (this.trapEdit.ExportHinban == this.insertData.ExportHinban) {
                        this.$toast.success('Successfully', 'Updated!!', this.notificationSystem.options.success)
                        this.close()
                    } else {
                        axios.post(`${this.url}trappingInsert`, {
                            name: this.insertData.ExportHinban
                        }).then(res => {
                            if (res.data.length == 0) {
                                axios.post(`${this.url}toEditMother`, {
                                    code: this.insertData.ExportHinbanCode,
                                    name: this.insertData.ExportHinban,
                                    updated: this.userInfo.employeeCode
                                }).then(res => {
                                    // this.motherData = res.data
                                    this.getMotherHinban()
                                    this.$toast.success('Successfully', 'Updated!!', this.notificationSystem.options.success)
                                    this.close()
                                }).catch((e) => {
                                    console.log(e)
                                })
                            } else {
                                this.$toast.error('Hinban already exists!', 'INVALID', this.notificationSystem.options.error)
                            }
                        })
                    }
                } else {
                    axios.post(`${this.url}trappingInsert`, {
                        name: this.insertData.ExportHinban
                    }).then(res => {
                        // console.log(res.data.length)
                        if (res.data.length == 0) {
                            axios.post(`${this.url}insertMotherHinban`, {
                                insertData: this.insertData.ExportHinban
                            }).then(res => {
                                var trap = res.data
                                // console.log(res.data + 'saved')
                                this.getMotherHinban()
                                this.close()
                                this.$toast.success('Successfully', 'Saved!!', this.notificationSystem.options.success)
                            })
                        } else {
                            this.$toast.error('Hinban already exists!', 'INVALID', this.notificationSystem.options.error)
                        }
                    })
                }
            }
        },
        gg() {
            this.page = 1
            this.totalShow = 7
        },
        searching() {
            this.motherDataCopy = this.motherData.filter(rec => {
                return rec.ExportHinban.toLowerCase().includes(this.search.toLowerCase().trim()) || rec.GroupID == this.search.trim()
            })
            this.page = 1
            this.totalShow = 7
        },
        refresh() {
            this.search = ''
            this.getMotherHinban()
        }
    }
}
</script>

<style scoped>
    .searchTxt {
        height: 41px;
    }

    .btn {
        width: 100%;
        margin-top: 2px;
    }

    .newBtn {
        margin-top: 15px;
        margin-bottom: 15px;
        margin-right: 22px;
    }

    .drop {
        width: 100%;
        height: 41px;
    }
    
</style>
