<template>
<v-container fluid>
    <v-row align="center" justify="center">
        <v-card>
            <v-card-title>
                <v-text-field style="height: 25px" dense append-icon="mdi-magnify" v-model="serKey" label="Search Hinban" outlined solo rounded></v-text-field>
            </v-card-title>
            <v-card-title>
                <span class="subtitle-2" v-if="serKey.length > 0">Total Filtered Record(s): {{filteredHinban.length}}</span>
                <span class="subtitle-2" v-else>Total Record(s): {{filteredHinban.length}}</span>
                <v-spacer></v-spacer>
                <v-badge color="green">
                    <span slot="badge">{{filterNoPart.length}}</span>
                    <v-btn dark color="primary" @click="setup = 'SETUP', addItemParts = true">ADD SETUP</v-btn>
                </v-badge>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <span style="font-size: 25px"><b>CODE</b></span>
                    </v-col>
                    <v-col>
                        <span style="font-size: 25px"><b>HINBAN</b></span>
                    </v-col>
                    <v-col>
                        <span style="font-size: 25px"><b>PARTS</b></span>
                    </v-col>
                </v-row>

                <v-expansion-panels v-for="(item, i) in filteredHinban" :key="i">
                    <v-expansion-panel flat>
                        <v-expansion-panel-header dense class="grey lighten-2">
                            <v-col>
                                {{item.ExportHinbanCode}}
                            </v-col>
                            <v-col>
                                {{item.ExportHinbanName}}
                            </v-col>
                            <v-col>
                                {{item.Parts.length}}
                            </v-col>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="10">
                                    <v-row dense class="d" v-for="(parts, j) in item.Parts" :key="j">
                                        <v-col>{{parts.HinbanPartCode}}</v-col>
                                        <v-col>{{parts.StockQty}}</v-col>
                                        <v-col>
                                            <v-btn v-if="item.Parts.length > 1" class="mt-0" small text color="#EF5350" @click="passMotherCode = item.ExportHinbanCode, passMotherHinban = item.ExportHinbanName, partEdit = parts, deletion = 'PART', deletePartQ = true">
                                                <v-icon style="color:#EF5350;">mdi-delete</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="2">
                                    <v-card id="create">
                                        <v-speed-dial v-model="item.fab" center="center" right="right" direction="left" open-on-hover transition="scale-transition">
                                            <template v-slot:activator>
                                                <v-btn center class="mt-0" v-model="item.fab" color="blue darken-2" dark fab>
                                                    <v-icon v-if="item.fab">mdi-close</v-icon>
                                                    <v-icon v-else>mdi-dots-horizontal</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-btn fab dark small color="green" @click="editAll = item, codeTbl = item.ExportHinbanCode, showTbl(), editAllForm = true">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn fab dark small color="indigo" @click="passMotherCode = item.ExportHinbanCode, passMotherHinban = item.ExportHinbanName, setup = 'PART', addBtn()">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                            <v-btn fab dark small color="red" @click="passMotherCode = item.ExportHinbanCode, deletion = 'SETUP', deletePartQ = true">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </v-speed-dial>
                                    </v-card>
                                </v-col>
                            </v-row>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="editAllForm" persistent max-width="500">
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    HINBAN:{{editAll.ExportHinbanName}}
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-simple-table fixed-header height="300">
                        <thead>
                            <tr>
                                <th>PART</th>
                                <th>QTY</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(edit, i) in editTblData" :key="i">
                                <td>{{edit.HinbanPartCode}}</td>
                                <td>{{edit.Quantity}}</td>
                                <td>
                                    <v-btn fab dark x-small color="green" @click="conf = 'EDIT', updateSetup(edit.HinbanPartCode, edit.Quantity)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="editAllForm = false">BACK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="addItemParts" persistent max-width="500">
            <v-card>
                <v-card-title>
                    <span v-if="setup == 'SETUP'">ADD SETUP</span>
                    <span v-else>ADD PART</span>
                </v-card-title>
                <v-card-title v-if="setup == 'PART'">
                    <v-spacer></v-spacer>
                    MOTHER HINBAN: {{ passMotherHinban }}
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text v-if="setup == 'SETUP'">
                    <v-card>
                        <v-card-title>
                            MOTHER HINBAN
                        </v-card-title>
                        <v-card-subtitle>
                            <v-text-field style="height: 25px" x-small dense append-icon="mdi-magnify" v-model="serSetup" label="Search Hinban" outlined solo rounded></v-text-field>
                        </v-card-subtitle>
                        <v-card-text>
                            <v-simple-table dense fixed-header height="95">
                                <thead>
                                    <tr>
                                        <th>MOTHER HINBAN</th>
                                        <th>SELECT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(hinban, i) in setupPart" :key="i">
                                        <td>{{ hinban.HINBAN }}</td>
                                        <td>
                                            <v-btn x-small outlined color="primary" @click="passMotherHinban = hinban.HINBAN, getCode()">>>>></v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
                <v-card-title v-if="setup == 'SETUP'">
                    <v-spacer></v-spacer>
                    <span class="subtitle-2">MOTHER HINBAN: {{passMotherHinban}}</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-card>
                        <v-card-title>
                            CURRENT PART
                        </v-card-title>
                        <v-card-subtitle>
                            <v-text-field style="height: 25px" x-small dense append-icon="mdi-magnify" v-model="serCurrent" label="Search Part" outlined solo rounded></v-text-field>
                        </v-card-subtitle>
                        <v-card-text>
                            <v-simple-table dense fixed-header height="95">
                                <thead>
                                    <tr>
                                        <th class="text-center">PART</th>
                                        <th class="text-center">QTY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in tblCurrent" :key="i">
                                        <td class="text-center">{{item.HinbanPartCode}}</td>
                                        <td class="text-center">{{item.Quantity}}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
                <v-card-text>
                    <v-card>
                        <v-card-title>
                            SELECT PART
                        </v-card-title>
                        <v-card-subtitle>
                            <v-text-field style="height: 25px" x-small dense append-icon="mdi-magnify" v-model="serOption" label="Search Part" outlined solo rounded></v-text-field>
                        </v-card-subtitle>
                        <v-card-text>
                            <v-simple-table dense fixed-header height="95">
                                <thead>
                                    <tr>
                                        <th class="text-center">PART</th>
                                        <th class="text-center">SELECT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(option, i) in tblOption" :key="i">
                                        <td class="text-center">{{option.HinbanPartCode}}</td>
                                        <td class="text-center">
                                            <v-btn x-small outlined color="primary" @click="conf = 'ADD', addSetup(option)">>>>></v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-btn dense dark color="red" @click="back()">BACK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="addPart" persistent max-width="290">
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <span v-if="conf == 'ADD'">ADD ITEM PART</span>
                    <span v-else>UPDATE ITEM PART</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="addingTxt.itemPart" dense outlined readonly label="ITEM PART"></v-text-field>
                    <v-text-field v-model="addingTxt.qty" dense outlined label="QUANTITY"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="addPart = false">CANCEL</v-btn>
                    <v-btn color="blue darken-1" text @click="validateAddingPart()"><span v-if="conf == 'ADD'">ADD</span><span v-else>UPDATE</span></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="deletePartQ" persistent max-width="290">
            <v-card>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <p v-if="deletion == 'PART'">Are you sure you want to delete part <b>{{partEdit.HinbanPartCode}}</b> under <b>{{passMotherHinban}}</b>?</p>
                    <p v-else>Are you sure you want to delete this <b>SETUP</b>?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deletePartQ = false">CANCEL</v-btn>
                    <v-btn v-if="deletion == 'PART'" color="blue darken-1" text @click="deletePart()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="deleteSetup()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="confirmationAddEdit" persistent max-width="290">
            <v-card>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <p v-if="conf == 'ADD'" class="subtitle-1 font-weight-black">Add Item Part?</p>
                    <p v-else class="subtitle-1 font-weight-black">Update Item Part?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="confirmationAddEdit = false">CANCEL</v-btn>
                    <v-btn v-if="conf == 'ADD'" color="blue darken-1" text @click="addingPart()">OK</v-btn>
                    <v-btn v-else color="blue darken-1" text @click="updatingSetup()">OK</v-btn>
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
            setup: '',
            deletion: '',
            codeTbl: '',
            conf: '',
            addOrEdit: '',
            passMotherCode: '',
            passMotherHinban: '',
            passOrderQty: '',
            serKey: '',
            serCurrent: '',
            serOption: '',
            serSetup: '',
            semi: '',
            confirmationAddEdit: false,
            addItemParts: false,
            deletePartQ: false,
            addPart: false,
            editAllForm: false,
            editTblData: [],
            partsHinban: [],
            optionHinban: [],
            hinbans: [],
            cabinet: [],
            allParts: [],
            noPartHinban: [],
            filterNoPart: [],
            compareEdit: {},
            parText: {},
            partEdit: {},
            editAll: {},
            addingTxt: {},
            notificationSystem: {
                options: {
                    success: {
                        position: "bottomRight"
                    },
                    error: {
                        position: "bottomRight"
                    },
                    info: {
                        position: "bottomRight"
                    },
                }
            }
        }
    },
    created() {
        this.getAll()
        this.checkingExportHinban()
        this.fetchCabinet()
        this.getAllHinbans()
    },
    methods: {
        getAll() {
            axios.get(`${this.url}hinbanSetup`).then(res => {
                this.hinbans = res.data
                // console.log(this.hinbans, 'hinbans')
            })
        },
        getCode() {
            var code
            axios.post(`${this.url}getCode`, {
                hinban: this.passMotherHinban
            }).then(res => {
                // console.log(res.data, 'GETCODE')
                this.passMotherCode = res.data[0].ExportHinbanCode
                axios.post(`${this.url}getPartHinbanSetup`, {
                    code: this.passMotherCode
                }).then(res => {
                    this.partsHinban = res.data
                    var parts = []
                    for (let x = 0; x < this.partsHinban.length; x++) {
                        parts.push(this.partsHinban[x].HinbanPartCode)
                    }
                    // console.log(parts, 'parts')
                    axios.post(`${this.url}currentPart`, {
                            parts: parts
                        })
                        .then(res => {
                            this.optionHinban = res.data
                        })
                })
            })
        },
        getAllHinbans() {
            axios.get(`${this.url}noPartHinban`).then(res => {
                this.noPartHinban = res.data
                this.getNoParts()
            })
        },
        getNoParts() {
            this.filterNoPart = this.noPartHinban.filter(rec => {
                return rec.childData.length == 0
            })
        },
        addSetup(val) {
            this.addingTxt = {}
            // console.log(val)
            this.$set(this.addingTxt, 'itemPart', val.HinbanPartCode)
            this.addPart = true
        },
        validateAddingPart() {
            if (this.addingTxt.qty == null || this.addingTxt.qty == '') {
                this.$toast.error('Please complete the fields', 'Invalid', this.notificationSystem.options.error)
            } else {
                this.confirmationAddEdit = true
            }
        },
        addingPart() {
            axios.post(`${this.url}addingPart`, {
                code: this.passMotherCode,
                obj: this.addingTxt
            }).then(res => {
                this.addingTxt.itemPart = ''
                this.addingTxt.qty = ''
                this.$toast.success('ITEM PART ADDED!', 'SUCCESS', this.notificationSystem.options.success)
                this.confirmationAddEdit = false
                this.addPart = false
                this.addBtn()
                this.getAll()
                if (this.setup == 'SETUP') {
                    this.getAllHinbans()
                }
            })
        },
        updateSetup(code, qty) {
            this.addingTxt = {}
            this.$set(this.addingTxt, 'itemPart', code)
            this.$set(this.addingTxt, 'qty', qty)
            this.addPart = true
        },
        updatingSetup() {
            axios.post(`${this.url}updatingPart`, {
                code: this.codeTbl,
                obj: this.addingTxt
            }).then(res => {
                this.addingTxt.itemPart = ''
                this.addingTxt.qty = ''
                this.$toast.success('PART UPDATED!', 'SUCCESS', this.notificationSystem.options.success)
                this.confirmationAddEdit = false
                this.addPart = false
                // this.addBtn()
                this.showTbl()
                this.getAll()
                if (this.setup == 'SETUP') {
                    this.getAllHinbans()
                }
            })
        },
        addBtn() {
            // this.addOrEdit = 'ADD'
            // this.passMotherHinban = HinbanName
            // this.passMotherCode = HinbanCode
            // this.passOrderQty = Quantity

            axios.post(`${this.url}getPartHinbanSetup`, {
                code: this.passMotherCode
            }).then(res => {
                this.partsHinban = res.data
                var parts = []
                for (let x = 0; x < this.partsHinban.length; x++) {
                    parts.push(this.partsHinban[x].HinbanPartCode)
                }
                // console.log(parts, 'parts')
                axios.post(`${this.url}currentPart`, {
                    parts: parts
                })
                .then(res => {
                    this.optionHinban = res.data
                    if (this.setup == 'PART') {
                        this.addItemParts = true
                    }
                })
            })
        },
        showTbl() {
            // console.log(this.codeTbl, 'editAll')
            axios.post(`${this.url}showTbl`, {
                code: this.codeTbl
            }).then(res => {
                this.editTblData = res.data
            })
        },
        deletePart() {
            axios.post(`${this.url}deletepart`, {
                code: this.passMotherCode,
                part: this.partEdit.HinbanPartCode
            }).then(res => {
                this.$toast.success('ITEM PART DELETED!', 'SUCCESS', this.notificationSystem.options.success)
                this.getAll()
                this.deletePartQ = false
            })
        },
        deleteSetup() {
            axios.post(`${this.url}deleteSetup`, {
                code: this.passMotherCode
            }).then(res => {
                this.$toast.success('SETUP DELETED!', 'SUCCESS', this.notificationSystem.options.success)
                this.getAll()
                this.deletePartQ = false
            })
        },
        isQtyValid: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        checkingExportHinban() {
            axios.get(`${this.url}checkItemParts`)
                .then(res => {
                    this.allParts = res.data
                    // console.log(this.allParts)
                })
        },
        fetchCabinet() {
            axios.get(`${this.url}cabinet`).then(res => {
                // console.log(res.data)
                this.cabinet = res.data
            })
        },
        back() {
            this.serSetup = ''
            this.passMotherHinban = ''
            this.serCurrent = ''
            this.serOption = ''
            this.partsHinban = []
            this.optionHinban = []
            this.addItemParts = false
        }
    },
    computed: {
        filteredHinban() {
            return this.hinbans.filter(rec => {
                return rec.ExportHinbanName.toLowerCase().includes(this.serKey.toLowerCase())
            })
        },
        tblCurrent() {
            return this.partsHinban.filter(rec => {
                return rec.HinbanPartCode.toLowerCase().includes(this.serCurrent.toLowerCase())
            })
        },
        tblOption() {
            return this.optionHinban.filter(rec => {
                return rec.HinbanPartCode.toLowerCase().includes(this.serOption.toLowerCase())
            })
        },
        setupPart() {
            return this.filterNoPart.filter(rec => {
                return rec.HINBAN.toLowerCase().includes(this.serSetup.toLowerCase())
            })
        }
    }
}
</script>

<style>
#create .v-speed-dial {
    position: absolute;
}

#create .v-btn--floating {
    position: relative;
}
</style>
