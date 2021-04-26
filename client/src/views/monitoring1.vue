<template>
<v-container fluid>
    <v-card outlined dense>
        <v-card-text>
            <v-row dense>
                <v-col cols="12" sm="4" xs="12">
                    <v-select class="txtboxHead" v-model="txtKind" disabled outlined dense label="REQUEST KIND" target="#dropdown-example" :items="reqKind" item-text="BarchartName" item-value="BarchartNo"></v-select>
                </v-col>
                <v-col cols="12" sm="4" xs="12">
                    <v-select class="txtboxHead" v-model="txtCriticalLevel" disabled outlined dense label="CRITICAL LEVEL" target="#dropdown-example"></v-select>
                </v-col>
                <v-col cols="12" sm="4" xs="12">
                    <v-select class="txtboxHead" v-model="txtCabinet" outlined dense label="CABINET" target="#dropdown-example" :items="monitoringCabinet" item-value="CabinetNo" item-text="CabinetCode"></v-select>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="4" xs="12">
                    <v-text-field class="txtboxHead" v-model="txtHinbanChild" label="HINBAN CHILD" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" xs="12">
                    <v-btn class="searchBtn" dense dark color="primary" @click="filterMonitoring()">
                        <v-icon left>mdi-database-search</v-icon>SEARCH
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="4" xs="12">
                    <v-btn class="searchBtn" dense dark color="primary" @click="refresh()">
                        <v-icon left>mdi-database-refresh-outline</v-icon>REFRESH
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <v-card class="main">
        <v-card-text>
            <v-data-table hide-default-footer disable-pagination dense :headers="headers" :items="unFiltered" fixed-header height="390" :loading="loading" loading-text="Loading... Please wait">
                <template v-slot:item.action="{ item }">
                    <v-btn x-small dark color="primary" @click="transferHinban(item)">
                        <v-icon x-small>mdi-pencil</v-icon>
                    </v-btn>
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
                            <v-select v-model="holderHinban.cabinet" type="text" label="CABINET" item-text="CabinetCode" item-value="CabinetNo" :items="cabinet" dense outlined></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-text-field clearable v-model="holderHinban.kanbanCard" label="SCAN KANBAN" dense outlined></v-text-field>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark @click="dialog1 = false">CANCEL</v-btn>
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
            totalShow: 7,
            page: 1,
            down: 25,
            kanbanCard: '',
            kanbanItem: '',
            kanbanEdit: '',
            txtKind: '',
            txtHinbanChild: '',
            txtCabinet: '',
            txtCriticalLevel: '',
            dialog1: false,
            loading: false,
            test: '',
            allData: [],
            allDataHolder: [],
            cabinet: [],
            holderHinban: {},
            transfer: {},
            cuurentDataRow: {},
            reqKind: [],
            monitoringRack: [],
            monitoringCabinet: [],
            filteredMonitoring: [],
            filteredAllData: [],
            filteredAllDataHolder: [],
            updateModal: [],
            trap: [],
            kanbanTbl: [],
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
                }
            ],
            headers: [{
                    text: 'RACK',
                    value: 'RackCode'
                },
                {
                    text: 'CABINET',
                    value: 'CabinetCode'
                },
                {
                    text: 'ITEM PARTS',
                    value: 'HinbanPartCode'
                },
                {
                    text: 'STOCK',
                    value: 'OnStockQty',
                    align: 'center'
                },
                {
                    text: 'AVAILABLE',
                    value: 'AvailableQty',
                    align: 'center'
                },
                {
                    text: 'MAXIMUM',
                    value: 'MaximumStockQty',
                    align: 'center'
                },
                {
                    text: 'MINIMUM',
                    value: 'MinimumStockQty',
                    align: 'center'
                },
                // {
                //     text: 'RANGE',
                //     value: 'RangeQty',
                //     align: 'center'
                // },
                {
                    text: 'UPDATE',
                    value: 'action',
                    align: 'center',
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
        this.getAllData()
        this.fetchCabinet()
        this.getReqKind()
        this.getCabinet()
    },
    computed: {
        unFiltered() {
            this.filteredAllDataHolder = this.filteredAllData
            return this.filteredAllDataHolder.slice((this.page - 1) * this.down, (this.page - 1) * this.down + this.down) 
        },
        pageLength() {
            let divide = parseInt(this.filteredAllDataHolder.length / this.down)
            return (parseInt(this.filteredAllDataHolder.length % this.down)) ? divide += 1 : divide += 0
         }
    },
    methods: {
        getAllData() {
            this.loading = true
            axios.get(`${this.url}monitoringTable`).then(res => {
                this.loading = false
                this.allData = res.data
                this.filteredAllData = this.allData
            })
        },
        transferHinban(val) {
            this.currentDataRow = val
            this.$set(this.holderHinban, 'itemPart', this.currentDataRow.HinbanPartCode)
            this.$set(this.holderHinban, 'onStock', this.currentDataRow.OnStockQty)
            this.$set(this.holderHinban, 'available', this.currentDataRow.AvailableQty)
            this.$set(this.holderHinban, 'maximum', this.currentDataRow.MaximumStockQty)
            this.$set(this.holderHinban, 'cabinet', this.currentDataRow.CabinetNo)
            this.$set(this.holderHinban, 'criticalLevel', this.currentDataRow.MinimumStockQty)
            this.$set(this.holderHinban, 'kanbanCard', this.currentDataRow.KanbanCard)
            this.dialog1 = true
        },
        fetchCabinet() {
            axios.get(`${this.url}cabinet`).then(res => {
                this.cabinet = res.data
                // console.log(this.cabinet)
            })
        },
        updateMonitoring() {
            var totalQty = 0
            var trapQty = 0
            if (this.holderHinban.itemPart == "" ||
                this.holderHinban.itemPart == null ||
                this.holderHinban.cabinet == "" ||
                this.holderHinban.cabinet == null ||
                this.holderHinban.criticalLevel == "" ||
                this.holderHinban.criticalLevel == null ||
                this.holderHinban.maximum == "" ||
                this.holderHinban.maximum == null ||
                this.holderHinban.kanbanCard == "" ||
                this.holderHinban.kanbanCard == null) {
                this.$toast.error('Please Fill Up', 'Invalid!!', this.notificationSystem.options.error)
                return false
            }
            if (this.holderHinban.criticalLevel >= this.holderHinban.maximum) {
                this.$toast.error('Minimum Qty must be Less than Maximum Qty', 'Invalid!!', this.notificationSystem.options.error)
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
                this.reqKind = res.data
            })
        },
        getCabinet() {
            axios.get(`${this.url}monitoringCabinet`).then(res => {
                this.monitoringCabinet = res.data
            })
        },
        filterMonitoring() {
            this.filteredAllData = this.allData.filter(each => {
                if (this.txtCabinet == '' && this.txtHinbanChild == '') {
                    return each
                } else {
                    if (this.txtCabinet != '' && this.txtHinbanChild != '') {
                        return each.CabinetNo == this.txtCabinet && each.HinbanPartCode == this.txtHinbanChild
                    } else{
                        if (this.txtCabinet != '') {
                            return each.CabinetNo == this.txtCabinet
                        } else if (this.txtHinbanChild != '') {
                            return each.HinbanPartCode == this.txtHinbanChild
                        }
                    }
                }
            })
            this.page = 1
            this.totalShow = 7
        },
        refresh() {
            this.txtKind = ''
            this.txtHinbanChild = ''
            this.txtCabinet = ''
            this.txtCriticalLevel = ''
            this.getAllData()
            this.page = 1
            this.totalShow = 7
        },
        gg() {
            this.page = 1
            this.totalShow = 7
        }
    }
}
</script>

<style scoped>
    .txtboxHead {
        height: 41px;
    }

    .searchBtn {
        width: 100%;
        margin-top: 2px;
    }

    .drop {
        height: 41px;
        width: 100%;
    }

    .per {
        margin-top: 5px;
    }

    .main {
        margin-top: 15px;
    }

</style>
