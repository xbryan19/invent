<template>
<v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="8">
            <v-card>
                <v-toolbar color="grey lighten-1" dark flat>
                    <v-toolbar-title>ADD PARTS QTY</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <!-- <v-row>
                            <v-col cols="2"> -->
                                <v-checkbox
                                    class="check"
                                    v-model="isScan"
                                    label="isScan"
                                    @change="check()">
                                </v-checkbox>
                            <!-- </v-col>
                        </v-row> -->
                        <v-row>
                            <v-col>
                                <span>{{ changeLabel }}</span>
                                <v-text-field class="txtboxHead" :autofocus="hoomagFocus" clearable @keyup.enter="filterKanbanNo()" v-model="search" type="text" :disabled="da" outlined dense/>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <span>RACK</span>
                                <v-text-field class="txtboxHead" v-model="insertData.RackCode" readonly type="text" outlined dense />
                            </v-col>
                            <v-col>
                                <span>CABINET</span>
                                <v-text-field class="txtboxHead" v-model="insertData.CabinetCode" readonly type="text" outlined dense />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <span>AVAILABLE QTY</span>
                                <v-text-field class="txtboxHead" v-model="insertData.AvailableQty" readonly type="text" outlined dense />
                            </v-col>
                            <!-- <v-col>
                                <span>ADD QTY(SCAN BARCODE)</span>
                                <v-text-field class="txtboxHead" :disabled="qtyDsbld" :autofocus="qtyFocus" v-model="toBeAdd" @keypress="isQtyValid($event)" @keyup.enter="checkHoomag()" type="number" outlined dense clearable />
                            </v-col> -->
                            <v-col>
                                <span>ADD QTY</span>
                                <v-text-field class="txtboxHead" :disabled="qtyDsbld" :autofocus="qtyFocus" v-model="toBeAdd" @keypress="isQtyValid($event)" outlined dense clearable />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn color="primary" @click="addChecking()" dark>SAVE</v-btn> -->
                    <v-btn color="primary" @click="addingQuestion = true" :disabled="daSave">SAVE</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-dialog v-model="addingQuestion" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                    <p class="subtitle-1 font-weight-medium">Add quantity of {{toBeAdd}} to {{search}}?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="addingQuestion = false">CANCEL</v-btn>
                    <v-btn color="blue darken-1" text @click="addQTY()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
    <!-- original -->
    <!-- <v-row justify="center">
        <v-dialog v-model="addingQuestion" persistent max-width="290">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                    <p v-if="filterKanban.length > 0" class="subtitle-1 font-weight-medium">Add quantity of {{toBeAdd}} to {{filterKanban[0].HinbanPartCode}}?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="addingQuestion = false">CANCEL</v-btn>
                    <v-btn color="blue darken-1" text @click="addQTY()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row> -->
    <!--  -->
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            toBeAdd: '',
            addingQuestion: false,
            hoomagFocus: false,
            qtyFocus: false,
            isScan: false,
            insertData: [],
            filterData: [],
            getData: [],
            search: '',
            labelHoomag: 'HINBAN PART',
            scanHoomag: 'SCAN QR CODE',
            daSave: true,
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
        this.$barcodeScanner.init(this.filterQR)
        this.hoomagFocus = true
        this.getKanbanItem()
    },
    computed: {
        filterKanban() {
            return this.getData.filter(rec => {
                // return rec.KanbanCard == this.search
                return (this.isScan) ? rec.KanbanCard == this.search : rec.HinbanPartCode == this.search
            })
        },
        changeLabel() {
            return (this.isScan) ? this.scanHoomag : this.labelHoomag
        },
        trapMsg() {
            return (this.isScan) ? 'Undefined Part' : 'Undefined Part'
        },
        da() {
            return (this.isScan) ? true : false
        },
        qtyDsbld() {
            return (this.isScan) ? true : false
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

        filterQR(val) {
            if (this.isScan) {
                let qrSplit = val.split('#')
                let qrSerial = qrSplit[1]
                let qrHinban = qrSplit[2]
                let qrQty = qrSplit[3]
                axios.post(`${this.url}checkSerial/${qrSerial}`).then(res => {
                    let result = res.data
                    // console.log(result)
                    if (result == '0') {
                        axios.post(`${this.url}updateQty`, { qrHinban }).then(res => {
                            let exc = res.data
                            // console.log(exc)
                            if (res.data != '0') {
                                this.search = exc[0].HinbanPartCode
                                this.$set(this.insertData, 'CabinetCode', exc[0].CabinetCode)
                                this.$set(this.insertData, 'RackCode', exc[0].RackCode)
                                this.$set(this.insertData, 'AvailableQty', exc[0].AvailableQty)
                                this.toBeAdd = qrQty
                                this.daSave = false
                            } else {
                                this.$toast.error('Hinban is not registered!', 'Invalid', this.notificationSystem.options.error)
                            }
                        })
                    } else {
                        this.$toast.error('Serial is not registered!', 'Invalid', this.notificationSystem.options.error)
                    }
                })
            }
        },
        
        filterKanbanNo() {
            console.log(this.filterKanban)
            if (this.filterKanban.length > 0) {
                this.$set(this.insertData, 'CabinetCode', this.filterKanban[0].CabinetCode)
                this.$set(this.insertData, 'RackCode', this.filterKanban[0].RackCode)
                this.$set(this.insertData, 'AvailableQty', this.filterKanban[0].AvailableQty)
                this.hoomagFocus = false
                this.qtyFocus = true
                this.daSave = false
            } else {
                this.$toast.error(this.trapMsg, 'Invalid', this.notificationSystem.options.error)
                this.search = ''
                this.insertData = {}
            }
        },
        getKanbanItem() {
            axios.get(`${this.url}getKanban`).then(res => {
                // console.log(res.data)
                this.getData = res.data
                // console.log(this.getData)
            })
        },
        //original-------------
        // addChecking() {
        //     var add = this.toBeAdd
        //     var sumTotal = 0
        //     if (this.filterKanban.length == 0) {
        //         this.$toast.error(this.trapMsg, 'Invalid', this.notificationSystem.options.error)
        //         return false
        //     } else if (this.toBeAdd = '' || this.toBeAdd == null) {
        //         this.$toast.error('Scan Qty!', 'Invalid', this.notificationSystem.options.error)
        //     } else {
        //         sumTotal = parseInt(add) + parseInt(this.filterKanban[0].OnStockQty)
        //         if (sumTotal >= parseInt(this.filterKanban[0].MinimumStockQty) && sumTotal <= parseInt(this.filterKanban[0].MaximumStockQty)) {
        //             this.toBeAdd = add
        //             this.addingQuestion = true
        //         } else {
        //             this.$toast.error('OnStock Qty cannot be Higher than Maximum and Less than Minimum', 'Invalid!!', this.notificationSystem.options.error)
        //             this.insertData.addqty = ''
        //             return false
        //         }
        //     }
        // },
        //-------------------
        addQTY() {
            axios.post(`${this.url}addQty`, {
                    addqty: this.toBeAdd,
                    search: this.search,
                    scan: this.isScan
                })
                .then(res => {
                    var trap = res.data
                    this.$toast.success('Updated', 'Successfully!', this.notificationSystem.options.success)
                    this.insertData = {}
                    this.search = ''
                    this.toBeAdd = ''
                    this.isScan = false
                    this.getKanbanItem()
                    this.addingQuestion = false
                    this.daSave = true
                })
        },
        checkHoomag() {
            if (this.search == null || this.search == '') {
                this.$toast.error('Scan Hoomag first!', 'Invalid!!', this.notificationSystem.options.error)
                this.toBeAdd = ''
            } else {
                if (this.toBeAdd.length > 3) {
                    this.$toast.error('Please scan bar code!', 'Invalid!!', this.notificationSystem.options.error)
                    this.toBeAdd = ''
                }
            }
        },
        check() {
            this.search = ''
            this.insertData = {}
            this.toBeAdd = ''
        }
    }
}
</script>

<style scoped>
    .txtboxHead {
        height: 42px;
    }

    .check {
        height: 23px;
        padding: 0;
        margin: 2px auto;
    }
</style>
