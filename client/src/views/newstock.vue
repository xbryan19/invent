<template>
<v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="6">
            <v-card>
                <v-toolbar color="grey lighten-1" dark flat>
                    <v-toolbar-title>HINBAN PART REGISTRATION</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <span>ITEM PART</span>
                        <v-text-field class="txtboxHead" v-model="insertData.itemPart" type="text" outlined dense />

                        <v-row>
                            <!-- <v-col>
                                <span>RANGE QTY</span>
                                <v-text-field type="text" @keypress="isQtyValid($event)" v-model="insertData.rangeQty" outlined dense :autofocus="focusRange" />
                            </v-col> -->
                            <v-col>
                                <span>CABINET</span>
                                <v-select class="txtboxHead" v-model="insertData.cabinetNo" outlined dense target="#dropdown-example" item-text="CabinetCode" item-value="CabinetNo" :items="cabinet"></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <span>MAXIMUM STOCK QTY</span>
                                <v-text-field class="txtboxHead" v-model="insertData.maximumStockQty" @keypress="isQtyValid($event)" type="text" outlined dense />
                            </v-col>
                            <v-col>
                                <span>MINIMUM STOCK QTY</span>
                                <v-text-field class="txtboxHead" v-model="insertData.minimumStockQty" @keypress="isQtyValid($event)" type="text" outlined dense />
                            </v-col>
                            
                        </v-row>

                        <!-- <v-row>
                            <v-col>
                                <span>STOCK DATE</span>
                                <v-text-field v-model="insertData.stockDate" type="text" outlined dense disabled />
                            </v-col>
                        </v-row> -->
                        <span>SCAN KANBAN CARD</span>
                        <v-text-field class="txtboxHead" clearable v-model="insertData.kanbanCard" type="text" outlined dense />

                        <!-- <v-simple-table dense height="200">
                            <thead>
                                <tr>
                                    <th>SEQ</th>
                                    <th>KANBAN</th>
                                    <th>QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in kanbanTbl" :key="i">
                                    <td>{{item.Seq}}</td>
                                    <td>{{item.Kanban}}</td>
                                    <td>
                                        <v-text-field v-model="kanbanTbl[i].Qty" dense outlined class="mt-4"></v-text-field>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table> -->
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="checkRegister()" dark><v-icon left>mdi-content-save-all</v-icon> SAVE</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="saveQuestioner" persistent max-width="290">
            <v-card>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <p class="subtitle-1 font-weight-black">Save Item Part?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="saveQuestioner = false">CANCEL</v-btn>
                    <v-btn color="blue darken-1" text @click="register()">OK</v-btn>
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
            saveQuestioner: false,
            focusRange: false,
            cabinet: [],
            allParts: [],
            insertData: {},
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
        this.fetchCabinet()
        this.checkingExportHinban()
    },
    computed: {
        displayNoPart() {
            return this.countBadge.filter(rec => {
                return rec.HINBAN.toLowerCase().includes(this.serKey.toLowerCase())
            })
        }
    },
    methods: {
        isQtyValid: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        checkRegister() {
            this.checkingExportHinban()

            if (this.insertData.itemPart == "" ||
                this.insertData.maximumStockQty == null ||
                this.insertData.minimumStockQty == null ||
                this.insertData.cabinetNo == "" ||
                this.insertData.cabinetNo == null ||
                this.insertData.kanbanCard == null ||
                this.insertData.kanbanCard == "") {
                this.$toast.error('Please complete the fields', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            if (parseInt(this.insertData.minimumStockQty) >= parseInt(this.insertData.maximumStockQty)) {
                this.$toast.error('Minimum Qty is >= Maximum Qty', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            for (let x = 0; x < this.allParts.length; x++) {
                if (this.insertData.itemPart == this.allParts[x].HinbanPartCode) {
                    this.$toast.error('Item Part already exists!', 'Invalid', this.notificationSystem.options.error)
                    return false
                }
            }

            this.saveQuestioner = true
        },
        register() {
            // console.log(this.hinbanM, 'hinbanM')
            axios.post(`${this.url}hinbanParts`, {
                    insertdata: this.insertData
                })
                .then(res => {
                    // console.log(res.data)
                    this.$toast.success('DATA INSERTED!', 'SUCCESS', this.notificationSystem.options.success)
                    this.saveQuestioner = false
                    this.insertData = {}
                    this.checkingExportHinban()
                })
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
        updateKanban() {

        }
    }
    
}
</script>

<style scoped>
    .txtboxHead {
        height: 42px;
    }
</style>



