<template>
<v-container fluid>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn dark color="primary" @click="addRack()">
                        ADD RACK
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-card outlined>
                        <v-card-title>
                            RACK LIST
                            <v-spacer></v-spacer>
                            <v-text-field v-model="searchRack" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="rackHeaders" :items="racks" :search="searchRack" height="550">
                                <template v-slot:item.action="{ item }">
                                    <v-icon v-if="item.DeletedDate == null" color="red" @click="rackModalDelete(item.RackNo), rackDeleteStatus = 0">
                                        mdi-delete
                                    </v-icon>
                                    <v-icon v-else color="green" @click="rackModalDelete(item.RackNo), rackDeleteStatus = 1">
                                        mdi-delete-restore
                                    </v-icon>
                                    <v-icon color="blue" @click="updateRack(item)">
                                        mdi-pencil-box
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col>
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn dark color="primary" @click="addCabinet()">
                        ADD CABINET
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-card>
                        <v-card-title>
                            CABINET LIST
                            <v-spacer></v-spacer>
                            <v-text-field v-model="searchCabinet" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="cabinetHeaders" :items="cabinet" :search="searchCabinet" height="550">
                                <template v-slot:item.action="{ item }">
                                    <v-icon v-if="item.DeletedDate == null" color="red" @click="cabinetModalDelete(item.CabinetNo), cabinetDeleteStatus = 0">
                                        mdi-delete
                                    </v-icon>
                                    <v-icon v-else color="green" @click="cabinetModalDelete(item.CabinetNo), cabinetDeleteStatus = 1">
                                        mdi-delete-restore
                                    </v-icon>
                                    <v-icon color="blue" @click="updateCabinet(item)">
                                        mdi-pencil-box
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="rackModal" persistent max-width="500">
            <v-card>
                <v-card-title>
                    <h4 v-if="rackMode == 'create'">ADD RACK</h4>
                    <h4 v-else>UPDATE RACK</h4> 
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="3">
                            <span>RACK NO</span>
                            <v-text-field v-model="txtRackNo" outlined dense disabled></v-text-field>
                        </v-col>
                        <v-col cols="9">
                            <span>RACK NAME</span>
                            <v-text-field v-model="txtRackName" outlined dense></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" @click="cancelRack()">CANCEL</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="rackMode == 'create'" color="primary" @click="saveRack()">ADD</v-btn>
                    <v-btn v-else color="primary" @click="saveRack()">UPDATE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="cabinetModal" persistent max-width="500">
            <v-card>
                <v-card-title>
                    <h4 v-if="cabinetMode == 'create'">ADD CABINET</h4>
                    <h4 v-else>UPDATE CABINET</h4>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4">
                            <span>RACK</span>
                            <v-select v-model="txtCabinetRackNo" outlined dense :items="rackActive" item-value="RackNo" item-text="RackCode">
                            </v-select>
                        </v-col>
                        <v-col cols="3">
                            <span>CABINET NO</span>
                            <v-text-field v-model="txtCabinetNo" outlined dense disabled></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <span>CABINET NAME</span>
                            <v-text-field v-model="txtCabinetName" outlined dense></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" @click="cancelCabinet()">CANCEL</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="cabinetMode == 'create'" color="primary" @click="saveCabinet()">ADD</v-btn>
                    <v-btn v-else color="primary" @click="saveCabinet()">UPDATE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="deleteQuestionRack" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <!-- <v-card-subtitle></v-card-subtitle> -->
                <v-card-text>
                    <p v-if="rackDeleteStatus == 0" class="subtitle-1 font-weight-medium">Deactivate rack?</p>
                    <p v-else class="subtitle-1 font-weight-medium">Activate rack?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deleteQuestionRack = false">CANCEL</v-btn>
                    <v-btn v-if="rackDeleteStatus == 0" color="blue darken-1" text @click="deleteRack()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="activateRack()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="deleteQuestionCabinet" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <!-- <v-card-subtitle></v-card-subtitle> -->
                <v-card-text>
                    <p v-if="cabinetDeleteStatus == 0" class="subtitle-1 font-weight-medium">Deactivate cabinet?</p>
                    <p v-else class="subtitle-1 font-weight-medium">Activate cabinet?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deleteQuestionCabinet = false">CANCEL</v-btn>
                    <v-btn v-if="cabinetDeleteStatus == 0" color="blue darken-1" text @click="deleteCabinet()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="activateCabinet()">OK</v-btn>
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
            rackModal: false,
            rackMode: '',
            cabinetMode: '',
            cabinetModal: false,
            searchRack: '',
            searchCabinet: '',
            txtRackNo: '',
            txtRackName: '',
            txtCabinetRackNo: '',
            txtCabinetNo: '',
            txtCabinetName: '',
            rackNoDelete: '',
            rackDeleteStatus: '',
            deleteQuestionRack: false,
            cabinetNoDelete: '',
            cabinetDeleteStatus: '',
            deleteQuestionCabinet: false,
            racks: [],
            rackActive: [],
            cabinet: [],
            rackEdit: [],
            cabinetEdit: [],
            rackHeaders: [{
                    text: 'RACK NO',
                    value: 'RackNo'
                },
                {
                    text: 'RACK NAME',
                    value: 'RackCode'
                },
                {
                    text: 'DELETED DATE',
                    value: 'DeletedDate'
                },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false
                }
            ],
            cabinetHeaders: [{
                    text: 'RACK',
                    value: 'RackCode'
                },
                {
                    text: 'CABINET NO',
                    value: 'CabinetNo'
                },
                {
                    text: 'CABINET NAME',
                    value: 'CabinetCode'
                },
                {
                    text: 'DELETED DATE',
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
            }
        }
    },
    created() {
        this.getRack()
        this.getCabinet()
        this.getRackActive()
    },
    methods: {
        getRackActive() {
            axios.get(`${this.url}getRackActive`)
                .then(res => {
                    this.rackActive = res.data
                })
        },
        getRack() {
            axios.get(`${this.url}getRack`)
                .then(res => {
                    this.racks = res.data
                    for (let x = 0; x < this.racks.length; x++) {
                        if (this.racks[x].DeletedDate != null) {
                            this.racks[x].DeletedDate = this.racks[x].DeletedDate.substr(0, 10)
                        }
                    }
                })
        },
        getCabinet() {
            axios.get(`${this.url}getCabinet`)
                .then(res => {
                    this.cabinet = res.data
                    for (let y = 0; y < this.cabinet.length; y++) {
                        if (this.cabinet[y].DeletedDate != null) {
                            this.cabinet[y].DeletedDate = this.cabinet[y].DeletedDate.substr(0, 10)
                        }
                    }
                })
        },
        addRack() {
            this.rackMode = 'create'
            this.rackModal = true
            this.txtRackNo = this.racks[this.racks.length - 1].RackNo + 1
        },
        addCabinet() {
            this.cabinetMode = 'create'
            this.cabinetModal = true
            this.txtCabinetNo = this.cabinet[this.cabinet.length - 1].CabinetNo + 1
            // this.txtCabinetNo = th
        },
        saveRack() {
            if (this.txtRackName == '') {
                this.$toast.error('Please put a Rack Name', 'Invalid', this.notificationSystem.options.error)
            } else {
                if (this.rackMode == 'create') {
                    axios.post(`${this.url}saveRack`, {
                            rackName: this.txtRackName
                        })
                        .then(res => {
                            if (res.data != '') {
                                this.$toast.success('RACK ADDED!', 'Success!!', this.notificationSystem.options.success)
                                this.txtRackName = ''
                                this.rackModal = false
                                setTimeout(() => {
                                    this.getRack()
                                }, 300);
                            } else {
                                this.$toast.error('Data Failed to insert', 'Failed!!', this.notificationSystem.options.error)
                            }
                        })
                } else {
                    axios.post(`${this.url}updateRack`, {
                        rack: this.rackEdit,
                        racktxt: this.txtRackName
                    })
                    .then(res => {
                        this.$toast.success('RACK UPDATED!', 'Success!!', this.notificationSystem.options.success)
                        this.txtRackName = ''
                        this.RackNo = ''
                        this.rackEdit = []
                        this.rackModal = false
                        setTimeout(() => {
                            this.getRack()
                        }, 300);
                    })
                }
            }
        },
        saveCabinet() {
            if (this.txtCabinetRackNo == '' || this.txtCabinetName == '') {
                this.$toast.error('Please put a Rack and Cabinet Name', 'Invalid', this.notificationSystem.options.error)
            } else {
                if (this.cabinetMode == 'create') {
                    axios.post(`${this.url}saveCabinet`, {
                            cabinetRackNo: this.txtCabinetRackNo,
                            cabinetName: this.txtCabinetName
                        })
                        .then(res => {
                            if (res.data != '') {
                                this.$toast.success('CABINET ADDED!', 'Success!!', this.notificationSystem.options.success)
                                this.txtCabinetRackNo = ''
                                this.txtCabinetName = ''
                                this.cabinetModal = false
                                setTimeout(() => {
                                    this.getCabinet()
                                }, 300);
                            } else {
                                this.$toast.error('Data Failed to insert', 'Failed!!', this.notificationSystem.options.error)
                            }
                        })
                } else {
                    axios.post(`${this.url}updateCabinet`, {
                        rack: this.cabinetEdit,
                        cabinetRackNo: this.txtCabinetRackNo,
                        cabinetName: this.txtCabinetName
                    })
                    .then(res => {
                        this.$toast.success('CABINET UPDATED!', 'Success!!', this.notificationSystem.options.success)
                        this.txtCabinetRackNo = ''
                        this.txtCabinetNo = ''
                        this.txtCabinetName = ''
                        this.cabinetEdit = []
                        this.cabinetModal = false
                        setTimeout(() => {
                            this.getCabinet()
                        }, 300);
                    })
                }
            }
        },
        updateRack(item) {
            this.rackEdit = item
            this.rackMode = 'edit'
            this.txtRackNo = item.RackNo
            this.txtRackName = item.RackCode
            this.rackModal = true
        },
        updateCabinet(item) {
            this.cabinetEdit = item
            this.cabinetMode = 'edit'
            this.txtCabinetRackNo = this.cabinetEdit.RackNo
            this.txtCabinetNo = this.cabinetEdit.CabinetNo
            this.txtCabinetName = this.cabinetEdit.CabinetCode
            this.cabinetModal = true
        },
        rackModalDelete(item) {
            this.rackNoDelete = item
            this.deleteQuestionRack = true
        },
        deleteRack() {
            axios.post(`${this.url}deleteRack`, {
                delete: this.rackNoDelete
            })
            .then(res => {
                setTimeout(() => {
                    this.getRack()
                    this.getRackActive()
                }, 300);
                this.$toast.error('RACK DELETED!', 'Deleted!!', this.notificationSystem.options.error)
                this.deleteQuestionRack = false
            })
        },
        cabinetModalDelete(item) {
            this.cabinetNoDelete = item
            this.deleteQuestionCabinet = true
        },
        deleteCabinet() {
            axios.post(`${this.url}deleteCabinet`, {
                delete: this.cabinetNoDelete
            })
            .then(res => {
                setTimeout(() => {
                    this.getCabinet()
                }, 300);
                this.$toast.error('CABINET DELETED!', 'Deleted!!', this.notificationSystem.options.error)
                this.deleteQuestionCabinet = false
            })
        },
        activateRack() {
            axios.post(`${this.url}activateRack`, {
                activate: this.rackNoDelete
            })
            .then(res => {
                setTimeout(() => {
                    this.getRack()
                    this.getRackActive()
                }, 300);
                this.$toast.success('RACK ACTIVATED!', 'Success!!', this.notificationSystem.options.success)
                this.deleteQuestionRack = false
            })
        },
        activateCabinet() {
            axios.post(`${this.url}activateCabinet`, {
                activate: this.cabinetNoDelete
            })
            .then(res => {
                setTimeout(() => {
                    this.getCabinet()
                }, 100);
                this.$toast.success('CABINET ACTIVATED!', 'Success!!', this.notificationSystem.options.success)
                this.deleteQuestionCabinet = false
            })
        },
        cancelRack() {
            this.txtRackName = ''
            this.RackNo = ''
            this.rackEdit = []
            this.rackModal = false
        },
        cancelCabinet() {
            this.txtCabinetRackNo = ''
            this.txtCabinetNo = ''
            this.txtCabinetName = ''
            this.cabinetEdit = []
            this.cabinetModal = false
        }
    }
}
</script>
