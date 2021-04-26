<template>
<v-container fluid>
    <v-card outlined>
        <v-card-title>
            <small>{{ userInfo.employeeCode }}</small>
            <v-spacer></v-spacer>
            <small>{{ userInfo.fullName }}</small>
        </v-card-title>
        <v-card-text>
            <v-row>
                <!-- <v-col cols="12" sm="5" xs="12">
                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field disabled id="txt" dense v-model="date" outlined label="PICKING DATE" value="PICKING DATE" readonly v-on="on">
                                <v-icon color="primary" dark slot="append">
                                    mdi-calendar
                                </v-icon>
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="date" scrollable>
                            <v-btn text color="primary" @click="$refs.dialog.save(null)">Clear</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col> -->
                <v-col cols="12" sm="5" xs="12">
                    <v-text-field v-model="constructionCode" label="CONSTRUCTION CODE" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" xs="12">
                    <v-btn dark color="primary" @click="searchItems()">FIND</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-row>
        <v-col>
            <v-card outlined>
                <v-card-text>
                    <v-simple-table style="border: 1px solid grey" height="590">
                        <thead>
                            <tr>
                                <th style="background-color: rgb(0, 128, 128);"></th>
                                <th class="text-center" style="background-color: rgb(0, 128, 128);"><span style="color:#FFFFFF">NAME CD</span></th>
                                <th class="text-center" style="background-color: rgb(0, 128, 128);"><span style="color:#FFFFFF">CONSTRUCTION CODE</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in searchingData" :key="i" @click="exportHinban(item)">
                                <td class="text-center" style="background-color: rgb(153, 204, 0)" v-if="item.picker != null && item.isFinished != null">{{ i+1 }}</td>
                                <td class="text-center" v-else>{{ i+1 }}</td>

                                <td class="text-center" style="background-color: rgb(153, 204, 0)" v-if="item.picker != null && item.isFinished != null">{{ item.HOUSECD }}</td>
                                <td class="text-center" v-else>{{ item.HOUSECD }}</td>

                                <td class="text-center" style="background-color: rgb(153, 204, 0)" v-if="item.picker != null && item.isFinished != null">{{ item.codeNo }}</td>
                                <td class="text-center" v-else>{{ item.codeNo }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="hinbanModal" persistent max-width="500px">
            <v-card>
                <v-card-text>
                    <v-row>
                        <h5>{{ userInfo.employeeCode }}</h5>
                        <v-spacer></v-spacer>
                        <h5>{{userInfo.fullName}}</h5>
                    </v-row>
                    <v-row>
                        <p class="headline mx-auto">
                            CUSTOMER
                        </p>
                    </v-row>
                    <v-row>
                        <h3>{{ hinbanMother.HOUSECD }}</h3>
                        <v-spacer></v-spacer>
                        <h3>{{ hinbanMother.codeNo }}</h3>
                    </v-row>
                    <v-card outlined>
                        <v-card-text>
                            <v-simple-table fixed-header height="300px">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th colspan="2" class="text-center">EXPORT HINBAN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, i) in hinbanMother.HINBAN" :key="i" @click="partsHinban(item)">
                                            <td>{{ i+1 }}</td>
                                            <td>{{ item.hinbanData }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-btn dark color="error" @click="hinbanModal = false">BACK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="partsModal" persistent max-width="600px">
            <v-card>
                <v-card-text>
                    <v-row>
                        <h5>{{ userInfo.employeeCode }}</h5>
                        <v-spacer></v-spacer>
                        <h5>{{ userInfo.fullName }}</h5>
                    </v-row>
                    <v-row>
                        <p class="headline mx-auto">
                            CUSTOMER
                        </p>
                    </v-row>
                    <v-row>
                        <h3>{{ hinbanMother.HOUSECD }}</h3>
                        <v-spacer></v-spacer>
                        <h3>{{ hinbanMother.codeNo }}</h3>
                    </v-row>
                    <v-row>
                        <v-col>
                            <span>EXPORT HINBAN</span>
                            <v-text-field v-model="txtExportHinban" outlined dense disabled></v-text-field>
                        </v-col>    
                    </v-row>
                    <v-card outlined>
                        <v-simple-table fixed-header height="300px">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-center">ITEM PARTS</th>
                                        <th class="text-center">QTY</th>
                                        <th class="text-center">RACK</th>
                                        <th class="text-center">CABINET</th>
                                        <th class="text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in parts" :key="i">
                                        <td>{{ i+1 }}</td>
                                        <td>{{ item.HinbanPartCode }}</td>
                                        <td class="text-center">{{ item.TotalOrders }}</td>
                                        <td class="text-center">{{ item.RackCode }}</td>
                                        <td class="text-center">{{ item.CabinetCode }}</td>
                                        <td v-if="item.isFinished != null"><v-btn dense color="primary" disabled>PICK</v-btn></td>
                                        <td v-else><v-btn dense color="primary" @click="parte = item.HinbanPartCode, parteQty = item.TotalOrders, pickStatus = 1, pickQuestion = true">PICK</v-btn></td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-btn dense color="error" @click="partsModal = false, hinbanModal = true">BACK</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn dense color="primary" @click="showQR()" :disabled="dsbldShowQR">SHOW QR CODE</v-btn>
                    <v-btn dense color="primary" @click="pickStatus = 0, pickQuestion = true" :disabled="dsbldComplete">COMPLETE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="qrModal" max-width="250">
            <v-card>
                <v-card-title>
                    <!-- SCAN TO PRINT -->
                </v-card-title>
                <v-card-text>
                    <qr-code :text="qrText" :size="qrSize" color="black" bg-color="white" error-level="L" @decode="scan()">
                    </qr-code>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-text-field v-model="qrAllParts" dense @keyup.enter="save()" :autofocus="focus"></v-text-field> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="pickQuestion" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                    <p v-if="pickStatus == 1" class="subtitle-1 font-weight-medium">Pick Item?</p>
                    <p v-else class="subtitle-1 font-weight-medium">Pick All Items?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="pickQuestion = false">CANCEL</v-btn>
                    <v-btn v-if="pickStatus == 0" color="blue darken-1" text @click="finished()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="finishedOne()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            disband: 0,
            dsbldTrap: 0,
            dsbldComplete: false,
            qrModal: false,
            locationModal: false,
            hinbanModal: false,
            partsModal: false,
            date: new Date().toISOString().substr(0, 10),
            constructionCode: '',
            searchingData: [],
            menu: false,
            modal: false,
            menu2: false,
            pickQuestion: false,
            assignedItems: [],
            hinbanMother: [],
            hinbanParts: [],
            txtExportHinban: '',
            txtExportHinbanA: '',
            year: '',
            week: '',
            parts: [],
            parte: '',
            parteQty: '',
            qrSize: 200,
            qrText: '',
            qrText1: [],
            qrAllParts: '',
            pickStatus: '',
            focus: false,
            trapCount: 0,
            trappings: [],
            dsbldShowQR: false,
            // ordersExportHinban: [],
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
        // console.log(this.userInfo.employeeCode)
        this.qrAllParts = this.qrText
        this.date = null
        // this.$refs.focus.focus()
        this.getAssignItems()
        this.trap()
        // console.log(this.$router.options.routes[0], 'router')
    },

    methods: {
        scan() {
            console.log('test')
        },
        getAssignItems() {
            axios.post(`${this.url}getAssignItems`, {
                    pickerID: this.userInfo.employeeCode
                })
                .then(res => {
                    this.assignedItems = res.data
                    this.searchingData = this.assignedItems
                    // console.log(this.assignedItems)
                })
        },
        exportHinban(item) {
            // console.log(item)
            this.hinbanMother = item
            this.hinbanModal = true
        },
        partsHinban(item) {
            this.dsbldTrap = 0
            this.hinbanParts = item
            this.week = this.hinbanParts.week
            this.year = this.hinbanParts.year
            this.txtExportHinbanA = this.hinbanParts.hinban
            this.txtExportHinban = this.hinbanParts.hinbanData
            axios.post(`${this.url}pickerGetHinbanParts`, {
                    motherHinban: this.txtExportHinban,
                    customerCode: this.hinbanMother.codeNo
                })
                .then(res => {
                    this.parts = res.data
                    // console.log(this.parts, 'item parts')
                    this.hinbanModal = false
                    for (let x = 0; x < this.parts.length; x++) {
                        if (this.parts[x].isFinished == null) {
                            this.dsbldTrap = 1
                        }
                    }
                    // console.log(this.dsbldTrap, 'its a trap')
                    if (this.dsbldTrap == 0) {
                        this.dsbldComplete = true
                    } else {
                        this.dsbldComplete = false
                    }

                    if (this.parts.length == 0) {
                        this.dsbldShowQR = true
                    } else {
                        this.dsbldShowQR = false
                    }

                    this.partsModal = true
                    // console.log(this.parts, 'partssss')
                })

            // console.log(this.hinbanParts)
        },
        refreshParts() {
            axios.post(`${this.url}pickerGetHinbanParts`, {
                motherHinban: this.txtExportHinban,
                customerCode: this.hinbanMother.codeNo
            })
            .then(res => {
                this.parts = res.data
                // console.log(this.parts, 'refresh parts')
                this.hinbanModal = false
                for (let x = 0; x < this.parts.length; x++) {
                    if (this.parts[x].isFinished == null) {
                        this.dsbldTrap = 1
                    }
                }
                // console.log(this.dsbldTrap, 'its a trap')
                if (this.dsbldTrap == 0) {
                    this.dsbldComplete = true
                } else {
                    this.dsbldComplete = false
                }

                if (this.parts.length == 0) {
                    this.dsbldShowQR = true
                } else {
                    this.dsbldShowQR = false
                }
                this.disbanded()
            })
        },
        finished() {
            // this.trap()
            // console.log(this.parts, 'partsssss')
            axios.post(`${this.url}finishedOrder`, {
                week: this.week,
                year: this.year,
                houseCode: this.hinbanMother.HOUSECD,
                customerCode: this.hinbanMother.codeNo,
                hinban: this.txtExportHinbanA,
                motherHinban: this.txtExportHinban,
                itemParts: this.parts,
                finishedHinban: this.hinbanMother.HINBAN,
                picker: this.userInfo.employeeCode
            }).then(res => {
                if (res.data != "error") {
                    this.trap()
                    setTimeout(() => {
                        this.qrText = ''
                        for (let x = 0; x < this.parts.length; x++) {
                            if (this.qrText == '') {
                                this.qrText += this.parts[x].HinbanPartCode
                            } else {
                                this.qrText += ',' + this.parts[x].HinbanPartCode
                            }
                        }

                        //manipula change data in front end only
                        for (let e = 0; e < this.trappings.length; e++) {
                            let aaa = this.trappings[e].CustomerCode
                            let bbb = this.trappings[e].HINBAN
                            if (aaa == this.hinbanMother.codeNo) {
                                for (let f = 0; f < bbb.length; f++) {
                                    for (let g = 0; g < this.parts.length; g++) {
                                        // this is where the conflict starts
                                        if (bbb[f].ExportHinbanCode == this.txtExportHinban && bbb[f].HinbanPartCode == this.parts[g].HinbanPartCode) {
                                            bbb[f].isFinished = 1
                                        } 
                                    }
                                }
                            }
                        }

                        this.trapCount = 0
                        for (let a = 0; a < this.trappings.length; a++) {
                            this.trap()
                            let trapCode = this.trappings[a].CustomerCode
                            let trap = this.trappings[a].HINBAN
                            if (this.hinbanMother.codeNo == trapCode) {
                                for (let b = 0; b < trap.length; b++) {
                                    this.trap()
                                   if (trap[b].isFinished == null) {
                                        this.trapCount = 1
                                    }
                                    this.trap()
                                }
                            }
                        }

                        this.$toast.success('ITEM COMPLETED', 'Success!!', this.notificationSystem.options.success)
                        this.pickQuestion = false
                        // this.trap()
                        if (this.trapCount == 0) {
                            axios.post(`${this.url}finishedStatus`, {
                                    week: this.week,
                                    year: this.year,
                                    houseCode: this.hinbanMother.HOUSECD,
                                    customerCode: this.hinbanMother.codeNo,
                                    hinban: this.txtExportHinban,
                                    trapCount: this.trapCount,
                                    finishedHinban: this.hinbanMother.HINBAN,
                                    picker: this.userInfo.employeeCode
                                })
                                .then(res => {
                                    this.dsbldComplete = true
                                    this.$toast.success('ALL ITEMS COMPLETED', 'Success!!', this.notificationSystem.options.success)
                                    setTimeout(() => {
                                        this.getAssignItems()
                                        // changed at 2020 06 02 | 12 : 18 pm
                                        // this.partsModal = false
                                        // this.hinbanModal = true
                                    }, 100)
                                })
                        }

                    })
                } else {
                    console.log('error')
                }
                this.refreshParts()
            })

            // this.trap()
            this.getAssignItems()
            // this.partsModal = false
            // this.hinbanModal = true
            // }
            // this.qrModal = true
        },
        finishedOne() {
            axios.post(`${this.url}finishedOne`, {
                week: this.week,
                year: this.year,
                houseCode: this.hinbanMother.HOUSECD,
                customerCode: this.hinbanMother.codeNo,
                hinban: this.txtExportHinbanA,
                motherHinban: this.txtExportHinban,
                itemParts: this.parte,
                itemQty: this.parteQty,
                finishedHinban: this.hinbanMother.HINBAN,
                picker: this.userInfo.employeeCode
            }).then(res => {
                if (res.data != "error") {
                    this.trap()
                    setTimeout(() => {
                        // this.qrText = ''
                        // for (let x = 0; x < this.parts.length; x++) {
                        //     if (this.qrText == '') {
                        //         this.qrText += this.parts[x].HinbanPartCode
                        //     } else {
                        //         this.qrText += ',' + this.parts[x].HinbanPartCode
                        //     }
                        // }

                        for (let e = 0; e < this.trappings.length; e++) {
                            let aaa = this.trappings[e].CustomerCode
                            let bbb = this.trappings[e].HINBAN
                            if (aaa == this.hinbanMother.codeNo) {
                                for (let f = 0; f < bbb.length; f++) {
                                    if (bbb[f].ExportHinbanCode == this.txtExportHinban && bbb[f].HinbanPartCode == this.parte) {
                                        bbb[f].isFinished = 1
                                    }
                                }
                            }
                        }
                        // console.log(this.trappings, 'trappings')

                        this.trapCount = 0
                        for (let a = 0; a < this.trappings.length; a++) {
                            this.trap()
                            let trapCode = this.trappings[a].CustomerCode
                            let trape = this.trappings[a].HINBAN
                            // console.log(trape, 'trapppe')
                            if (this.hinbanMother.codeNo == trapCode) {
                                for (let b = 0; b < trape.length; b++) {
                                    this.trap()
                                    if (trape[b].isFinished == null) {
                                        this.trapCount = 1
                                    }
                                    this.trap()
                                }
                            }
                        }
                        // console.log(this.trapCount, 'trapCount')

                        this.$toast.success('ITEM COMPLETED', 'Success!!', this.notificationSystem.options.success)
                        this.pickQuestion = false
                        if (this.trapCount == 0) {
                            axios.post(`${this.url}finishedStatus`, {
                                    week: this.week,
                                    year: this.year,
                                    houseCode: this.hinbanMother.HOUSECD,
                                    customerCode: this.hinbanMother.codeNo,
                                    hinban: this.txtExportHinban,
                                    trapCount: this.trapCount,
                                    finishedHinban: this.hinbanMother.HINBAN,
                                    picker: this.userInfo.employeeCode
                            })
                            .then(res => {
                                this.dsbldComplete = true
                                this.$toast.success('ALL ITEMS COMPLETED', 'Success!!', this.notificationSystem.options.success)
                                setTimeout(() => {
                                    this.getAssignItems()
                                }, 100)
                            })
                        }

                    })
                } else {
                    console.log('error')
                }
                this.refreshParts()
            })

            this.getAssignItems()
        },
        showQR() {
            this.qrText = ''
            this.qrAllParts = ''
            // console.log(this.parts[0].HinbanPartCode)
            for (let x = 0; x < this.parts.length; x++) {
                if (this.qrText == '') {
                    this.qrText += this.parts[x].HinbanPartCode
                } else {
                    this.qrText += ',' + this.parts[x].HinbanPartCode
                }
            }

            for (let x = 0; x < this.parts.length; x++) {
                this.qrText1.push({name: this.parts[x].HinbanPartCode})
            }
            console.log(this.qrText1)

            this.qrModal = true
        },
        trap() {
            axios.get(`${this.url}trappingFinish`)
                .then(res => {
                    this.trappings = res.data
                    // console.log(this.trappings, 'trappings')
                })
        }, 
        searchItems() {
            this.searchingData = []
            this.searchingData = this.assignedItems.filter(each => {
                if (this.constructionCode != '') {
                    if (this.constructionCode == each.codeNo) {
                        return each
                    }
                } else {
                    return each
                }
            })
        },
        disbanded() {
            this.disband = 0
            // console.log(this.parts, 'disbandParts')
            for (var a = 0; a < this.trappings.length; a++) {
                let vvv = this.trappings[a].HINBAN
                for (var x = 0; x < vvv.length; x++) {
                    for (var y = 0; y < this.parts.length; y++) {
                        if (vvv[x].ExportHinbanCode == this.txtExportHinban && vvv[x].HinbanPartCode == this.parts[y].HinbanPartCode) {
                            // this.trap()
                            // console.log(vvv[x].isFinished, 'isFinished')
                            // console.log(this.parts[y].isFinished, 'isFinished')
                            // if (vvv[x].isFinished == null) {
                            //     this.disband = 1
                            // }
                            if (this.parts[y].isFinished == null) {
                                this.disband = 1
                            }
                        }
                    }
                }
            }
            if (this.disband == 0) {
                this.dsbldComplete = true
            } 
        }
    }
}
</script>

<style>
#txt {
    text-align: center;
}
</style>
