<template>
<v-container fluid>
    <v-row>
        <v-col>
            <v-card outlined dense>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="4" xs="12">
                            <v-select v-model="txtKind" disabled outlined dense label="REQUEST KIND" target="#dropdown-example" :items="reqKind" item-text="BarchartName" item-value="BarchartNo"></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" xs="12">
                            <v-text-field v-model="txtHinbanChild" label="HINBAN CHILD" dense outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" xs="12">
                            <v-text-field v-model="txtMotherHinban" label="MOTHER HINBAN" dense outlined></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="4" xs="12">
                            <v-select v-model="txtRack" outlined dense label="RACK" target="#dropdown-example" :items="monitoringRack" item-value="RackNo" item-text="RackCode"></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" xs="12">
                            <v-select v-model="txtCabinet" outlined dense label="CABINET" target="#dropdown-example" :items="monitoringCabinet" item-value="CabinetNo" item-text="CabinetCode"></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" xs="12">
                            <v-select v-model="txtCriticalLevel" disabled outlined dense label="CRITICAL LEVEL" target="#dropdown-example"></v-select>
                        </v-col>
                    </v-row>
                    <!-- <v-spacer></v-spacer> -->
                    <v-row>
                        <v-col cols="12" sm="4" xs="12">
                            <v-btn class="ma-2" dense dark color="primary" @click="filterMonitoring()">
                                <v-icon left>mdi-database-search</v-icon>SEARCH
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-card-text>
            </v-card>
        </v-col>
        <!-- <v-col cols="12" lg="3" md="2" sm="12">
            <v-btn class="mt-9" dense dark color="primary">
                <v-icon left>mdi-file-find</v-icon>CHECK STOCK
            </v-btn>
        </v-col> -->
    </v-row>

    <v-row>

        <!-- {{filteredAllData.length}} -->
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-simple-table dense fixed-header height="450px">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center">RACK</th>
                                    <th class="text-center">CABINET</th>
                                    <th class="text-center">ITEM PARTS</th>
                                    <th class="text-center">ON STOCK</th>
                                    <th class="text-center">AVAILABLE</th>
                                    <th class="text-center">MAXIMUM QTY</th>
                                    <th class="text-center">CRITICAL LEVEL</th>
                                    <th class="text-center">RANGE QTY</th>
                                    <th class="text-center">UPDATE</th>
                                    <!-- <th class="text-center">DETAILS</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in filteredAllData" :key="index">
                                    <td class="text-center">{{ item.RackCode }}</td>
                                    <td class="text-center">{{ item.CabinetCode }}</td>
                                    <td class="text-center">{{ item.HinbanPartCode }}</td>
                                    <td class="text-center">{{ item.OnStockQty }}</td>
                                    <td class="text-center">{{ item.AvailableQty }}</td>
                                    <td class="text-center">{{ item.MaximumStockQty }}</td>
                                    <td class="text-center">{{ item.MinimumStockQty }}</td>
                                    <td class="text-center">{{ item.RangeQty }}</td>
                                    <td class="text-center">
                                        <v-btn x-small dark color="primary" @click="transferHinban(item)">
                                            <v-icon x-small>mdi-pencil</v-icon>
                                        </v-btn>
                                    </td>
                                    <!-- <td class="text-center">
                                        <v-btn small dark color="primary">
                                            <v-icon small>mdi-details</v-icon>
                                        </v-btn>
                                    </td> -->
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-dialog v-model="dialog1" persistent max-width="500px">
        <v-card>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-text-field v-model="holderHinban.itemPart" type="text" label="ITEM PARTS" dense outlined class="mt-5"></v-text-field>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="holderHinban.onStock" type="text" label="ON STOCK" dense outlined disabled></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="holderHinban.available" type="text" label="AVAILABLE" dense outlined disabled></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="holderHinban.maximum" type="text" label="MAXIMUM QTY" dense outlined></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="holderHinban.criticalLevel" type="text" label="CRITICAL LEVEL/MINIMUM" dense outlined></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="holderHinban.range" type="text" label="RANGE" dense outlined></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select v-model="holderHinban.cabinet" type="text" label="CABINET" item-text="CabinetCode" item-value="CabinetNo" :items="cabinet" dense outlined></v-select>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" dark @click="dialog1 = false">CANCEL</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="updateMonitoring()">UPDATE</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            txtKind: '',
            txtHinbanChild: '',
            txtMotherHinban: '',
            txtCabinet: '',
            txtCriticalLevel: '',
            txtRack: '',
            dialog1: false,
            test: '',
            allData: [],
            cabinet: [],
            holderHinban: {},
            transfer: {},
            cuurentDataRow: {},
            reqKind: [],
            monitoringRack: [],
            monitoringCabinet: [],
            filteredMonitoring: [],
            filteredAllData: [],
            updateModal: [],
            trap: [],
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
        // console.log(this.txtHinbanChild, 'created')
        this.getAllData()
        this.fetchCabinet()
        this.getReqKind()
        this.getCabinet()
        this.getRack()
        // this.filterMonitoring()
    },
    computed: {
        // filterMonitoring() {
        //     return this.allData.filter(each => {
        //         for (var x = 0; x < each.length; x++) {
        //             console.log('tae')
        //             if (each[x].RackNo == this.rack) {
        //                 return each
        //             }
        //         }
        //     })
        // }
    },
    methods: {
        getAllData() {
            axios.get(`${this.url}monitoringTable`).then(res => {
                // console.log(res.data)
                this.allData = res.data
                this.filteredAllData = res.data
            })
        },
        transferHinban(val) {
            // console.log(val)
            this.currentDataRow = val
            axios.post(`${this.url}editHinbanPart`, {
                    checkHinban: this.currentDataRow
                })
                .then(res => {
                    // console.log(res.data, 'MODAL')
                    this.updateModal = res.data
                    this.$set(this.holderHinban, 'itemPart', res.data[0].HinbanPartCode)
                    this.$set(this.holderHinban, 'onStock', res.data[0].OnStockQty)
                    this.$set(this.holderHinban, 'available', res.data[0].AvailableQty)
                    this.$set(this.holderHinban, 'maximum', res.data[0].MaximumStockQty)
                    this.$set(this.holderHinban, 'range', res.data[0].RangeQty)
                    this.$set(this.holderHinban, 'cabinet', res.data[0].CabinetNo)
                    this.$set(this.holderHinban, 'criticalLevel', res.data[0].MinimumStockQty)
                    // this.holderHinban.itemPart = res.data[0].HinbanPartCode
                    // this.holderHinban.onStock = res.data[0].OnStockQty
                    // this.holderHinban.cabinet = res.data[0].CabinetCode
                    // this.holderHinban.criticalLevel = res.data[0].MinimumStockQty
                    // console.log(this.holderHinban)
                    this.dialog1 = true
                })
        },
        fetchCabinet() {
            axios.get(`${this.url}cabinet`).then(res => {
                // console.log(res.data)
                this.cabinet = res.data
            })
        },
        updateMonitoring() {
            // console.log(this.updateModal[0].MaximumStockQty)
            if (this.holderHinban.itemPart == '' ||
                this.holderHinban.onStock == '' ||
                this.holderHinban.cabinet == '' ||
                this.holderHinban.criticalLevel == '' ||
                this.holderHinban.available == '' ||
                this.holderHinban.maximum == '' ||
                this.holderHinban.range == '') {
                this.$toast.error('Please Fill Up', 'Invalid!!', this.notificationSystem.options.error)
                return false
            }
            if (this.holderHinban.onStock > this.updateModal[0].MaximumStockQty && this.holderHinban.onStock < this.updateModal[0].MinimumStockQty) {
                this.$toast.error('OnStock must be equal or less than Maximum and equal or higher than Minimum', 'Invalid!!', this.notificationSystem.options.error)
                return false
            }
            if (this.holderHinban.criticalLevel >= this.holderHinban.maximum) {
                this.$toast.error('Minimum Qty must be Less than Maximum Qty', 'Invalid!!', this.notificationSystem.options.error)
                return false
            }
            if (this.holderHinban.maximum % this.holderHinban.range != 0) {
                this.$toast.error('Maximum Qty is not accurate to Range Qty', 'Invalid!!', this.notificationSystem.options.error)
                return false
            }

            axios.post(`${this.url}updateHinbanPart`, {
                    current: this.currentDataRow,
                    onUpdate: this.holderHinban
                })
                .then(res => {
                    this.trap = res.data
                    this.$toast.success('DATA UPDATED', 'Success!!', this.notificationSystem.options.success)
                    setTimeout(() => {
                        this.getAllData()
                    }, 500);
                    this.dialog1 = false
                })
        },
        getReqKind() {
            axios.get(`${this.url}reqKind`).then(res => {
                // console.log(res.data)
                this.reqKind = res.data
            })
        },
        getRack() {
            axios.get(`${this.url}monitoringRack`).then(res => {
                // console.log(res.data)
                this.monitoringRack = res.data
            })
        },
        getCabinet() {
            axios.get(`${this.url}monitoringCabinet`).then(res => {
                // console.log(res.data)
                this.monitoringCabinet = res.data
            })
        },
        filterMonitoring() {
            // alert(this.txtRack)
            this.filteredAllData = this.allData.filter(each => {
                // return each.Cabinet == this.txtCabinet && each.RackNo == this.txtRack
                if (this.txtRack == '' && this.txtCabinet == '' && this.txtMotherHinban == '' & this.txtHinbanChild == '') {
                    return each
                } else {
                    if (this.txtRack != '') {
                        if (this.txtCabinet != '') {
                            if (this.txtMotherHinban != '') {
                                return each.RackNo == this.txtRack && each.CabinetNo == this.txtCabinet && each.ExportHinbanName == this.txtMotherHinban
                            } else {
                                return each.RackNo == this.txtRack && each.CabinetNo == this.txtCabinet
                            }
                        } else {
                            return each.RackNo == this.txtRack
                        }
                    }
                }
            })
            // if(this.txtRack != '' || this.txtCabinet != '' || this.txtMotherHinban != '' || this.txtHinbanChild != ''){

        }
    }
}
</script>
