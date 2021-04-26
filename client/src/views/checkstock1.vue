<template>
<v-container fluid>

    <v-card outlined>
        <v-card-text>
            <v-row dense>
                <v-col cols="12" md="3" sm="4">
                    <v-select class="txtboxHead" v-model="insert_data.req" outlined dense label="REQUEST KIND" target="#dropdown-example" item-text="BarchartName" item-value="BarchartNo" :items="reqKind" disabled></v-select>
                </v-col>

                <v-col cols="12" md="2" sm="4">
                    <v-text-field class="txtboxHead" v-model="insert_data.week" label="WEEK" dense outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="2" sm="4">
                    <v-text-field class="txtboxHead" v-model="insert_data.year" label="YEAR" dense outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="3" sm="4">
                    <v-select class="txtboxHead" v-model="insert_data.dstn" outlined dense label="DSTN" target="#dropdown-example" item-text="DSTN" :items="dstn" disabled></v-select>
                </v-col>

                <v-col cols="12" md="2" sm="4">
                    <v-btn class="searchBtn" dark color="primary" @click="filter_expand()">
                        <v-icon left>mdi-database-search</v-icon>SEARCH
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <v-row>
        <v-col cols="12" lg="6" md="6" sm="12">
            <v-card outlined>
                <v-card-title>
                    <small>LIST OF PLANS</small>
                    <v-spacer></v-spacer>
                    <v-badge overlap color="blue" v-if="unRegister != 'OK'">
                        <span slot="badge">{{unRegister.length}}</span>
                        <v-btn color="red" dark @click="showUnregister = true">NOT REGISTER HINBAN</v-btn>
                    </v-badge>  
                </v-card-title>
                <v-card-text>
                    <!-- {{filteredExpand.length}} -->
                    <!-- <v-simple-table fixed-header height="600px">
                        <template v-slot:default>
                            <thead color="rgb(0, 128, 128)">
                                <tr>
                                    <th class="text-left" colspan="2">LIST OF PLANS</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in filteredData" :key="index">
                                    <td>
                                        <v-checkbox></v-checkbox>
                                    </td>
                                    <td>{{ item.House_CD }}</td>
                                    <td class="text-center">{{ item.Code_No }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table> -->
                    <v-data-table :items="filteredExpand" :single-expand="true" :expanded.sync="expanded" class="elevation-1 myTable" item-key="codeNo" height="490px">
                        <template fixed-header v-slot:header="{}">
                            <tr>
                                <th v-if="filteredExpand != ''">
                                    <v-checkbox v-model="checkAll" @change="selectAll()"></v-checkbox>
                                </th>
                                <th>HOUSE CODE</th>
                                <th>CUSTOMER CODE</th>
                                <th></th>
                            </tr>
                        </template>

                        <template v-slot:item="{item}">
                            <tr>
                                <!-- <tr @dblclick="checkStatus(item)"> -->

                                <td v-if="item.picker != null && item.isFinished == null" style="background-color: rgb(33, 150, 243)">
                                    <v-checkbox v-model="item.check" @change="checkBox()" disabled></v-checkbox>
                                </td>
                                <td v-else-if="item.picker != null && item.isFinished != null" style="background-color: rgb(153, 204, 0)">
                                    <v-checkbox v-model="item.check" @change="checkBox()" disabled></v-checkbox>
                                </td>
                                <td v-else>
                                    <v-checkbox v-model="item.check" @change="checkBox()"></v-checkbox>
                                </td>
                                <!-- <td v-else>
                                    <v-checkbox v-model="item.check" @change="checkB(item.codeNo)"></v-checkbox>
                                </td> -->

                                <td v-if="item.picker != null && item.isFinished == null" style="background-color: rgb(33, 150, 243)"><span style="color:#FFFFFF">{{ item.HOUSECD }}</span></td>
                                <td v-else-if="item.picker != null && item.isFinished != null" style="background-color: rgb(153, 204, 0)"><span style="color:#FFFFFF">{{ item.HOUSECD }}</span></td>
                                <td v-else>{{ item.HOUSECD }}</td>

                                <td v-if="item.picker != null && item.isFinished == null" style="background-color: rgb(33, 150, 243)"><span style="color:#FFFFFF">{{ item.codeNo }}</span></td>
                                <td v-else-if="item.picker != null && item.isFinished != null" style="background-color: rgb(153, 204, 0)"><span style="color:#FFFFFF">{{ item.codeNo }}</span></td>
                                <td v-else>{{ item.codeNo }}</td>

                                <td v-if="item.picker != null && item.isFinished == null" style="background-color: rgb(33, 150, 243)">
                                    <v-btn small icon @click="expanded = [item]" disabled>
                                        <v-icon>mdi-chevron-down</v-icon>
                                    </v-btn>
                                </td>
                                <td v-else-if="item.picker != null && item.isFinished != null" style="background-color: rgb(153, 204, 0)">
                                    <v-btn small icon @click="expanded = [item]" disabled>
                                        <v-icon>mdi-chevron-down</v-icon>
                                    </v-btn>
                                </td>
                                <td v-else>
                                    <v-btn small icon @click="expanded = [item]" v-if=" !expanded.includes(item)">
                                        <v-icon>mdi-chevron-down</v-icon>
                                    </v-btn>
                                    <v-btn small icon @click="expanded = []" v-if=" expanded.includes(item)">
                                        <v-icon>mdi-chevron-up</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>

                        <!-- <template v-slot:expanded-item="{ expandData }">
                            <tr v-for="(item, index) in expandData" :key="index">
                                <td>{{item.HINBAN}}</td>
                            </tr>
                        </template> -->
                        <template v-slot:expanded-item="expand">
                            <!-- <v-icon @click="sample()">mdi-plus</v-icon> -->
                            <!-- <tr v-for="(item, index) in expandData" :key="index"> -->
                            <tr v-for="(item, i) in expand.item.HINBAN" :key="i">
                                <td colspan="3" class="text-justify" @click="getParts(item.hinbanData, item.qtyData)">{{item.hinbanData}}</td>
                                <td>{{ item.qtyData }}</td>
                                <!-- <td><v-checkbox></v-checkbox></td>
                            <td>{{item.hinbanData}}</td>
                            <td></td> -->
                            </tr>
                        </template>

                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-chip color="green" label></v-chip>
                    FINISHED
                    <v-chip color="blue" label></v-chip>
                    ON GOING
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col cols="12" lg="6" md="6" sm="12">
            <v-card outlined>
                <v-card-title>
                    <h5 class="headline mb-2">TOTAL PLANS</h5>
                    <!-- {{selected_counter().length}} -->
                    <v-text-field class="mt-6 subtitle-2 font-weight-black" :value="selected_counter().length" single-line outlined disabled style="width: 20px"></v-text-field>
                    <v-spacer></v-spacer>
                    <v-card flat color="red" v-if="lack == 1">
                        <v-card-text style="color: white" class="text-center title">
                            STOCKS LACKING
                        </v-card-text>
                    </v-card>
                    <v-card flat color="green" v-else-if="lack == 0">
                        <v-card-text style="color: white" class="text-center title">
                            AVAILABLE
                        </v-card-text>
                    </v-card>
                    <v-card flat color="grey" v-else>
                        <v-card-text style="color: white" class="text-center title">
                            N/A
                        </v-card-text>
                    </v-card>
                </v-card-title>
                <v-card-title>
                    <small>PARTS ITEM REQUIREMENTS</small>
                    <v-spacer></v-spacer>
                    <small>RECORD AS OF</small>
                </v-card-title>
                <v-card-text>
                    <v-card outlined>
                        <v-simple-table fixed-header height="400px" dense>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-center">ITEM PARTS</th>
                                        <th class="text-center">QUANTITY</th>
                                        <th class="text-center">AVAILABLE</th>
                                        <th class="text-center">LACKING</th>
                                    </tr>
                                </thead>
                                <tbody v-if="bodyChecker == 0">
                                    <tr v-for="(item, i) in childHinban" :key="i">
                                        <!-- <td v-if="(item.qty * item.motherQty) > item.availableQty" style="color: red">{{item.child}}</td>
                                        <td v-else>{{item.child}}</td> -->
                                        <td v-if="item.qty > item.availableQty" style="color: red">{{item.child}}</td>
                                        <td v-else>{{item.child}}</td>

                                        <!-- <td v-if="(item.qty * item.motherQty) > item.availableQty" style="color: red">{{item.qty * item.motherQty}}</td>
                                        <td v-else>{{item.qty * item.motherQty}}</td> -->
                                        <td v-if="item.qty  > item.availableQty" style="color: red">{{item.qty}}</td>
                                        <td v-else>{{item.qty}}</td>

                                        <!-- <td v-if="(item.qty * item.motherQty) > item.availableQty" style="color: red">{{item.availableQty}}</td>
                                        <td v-else>{{item.availableQty}}</td> -->
                                        <td v-if="item.qty > item.availableQty" style="color: red">{{item.availableQty}}</td>
                                        <td v-else>{{item.availableQty}}</td>

                                        <!-- <td v-if="(item.qty * item.motherQty) > item.availableQty" style="color: red">{{(item.qty * item.motherQty) - item.availableQty}}</td>
                                        <td v-else></td> -->
                                        <td v-if="item.qty > item.availableQty" style="color: red">{{item.qty - item.availableQty}}</td>
                                        <td v-else></td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, i) in childHinban" :key="i">
                                        <td v-if="(item.Quantity * hinbanQty) > item.AvailableQty" style="color: red">{{ item.HinbanPartCode }}</td>
                                        <td v-else>{{ item.HinbanPartCode }}</td>

                                        <td v-if="(item.Quantity * hinbanQty) > item.AvailableQty" style="color: red">{{ item.Quantity * hinbanQty }}</td>
                                        <td v-else>{{ item.Quantity * hinbanQty }}</td>

                                        <td v-if="(item.Quantity * hinbanQty) > item.AvailableQty" style="color: red">{{ item.AvailableQty }}</td>
                                        <td v-else>{{ item.AvailableQty }}</td>

                                        <td v-if="(item.Quantity * hinbanQty) > item.AvailableQty" style="color: red">{{ (item.Quantity * hinbanQty) - item.AvailableQty }}</td>
                                        <td v-else></td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="distribute()">
                        <v-icon left>mdi-share-all</v-icon>DISTRIBUTE
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <small>TOTAL HOUSES:</small>
                    <small>{{ selected_counter().length }}</small>
                    <v-spacer></v-spacer>
                    <small>Process Date:</small>
                    <small>{{ this.processDate }}</small>
                </v-card-title>
                <v-card-text>
                    <v-card outlined>
                        <v-simple-table fixed-header height="300px">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-center">SELECT</th>
                                        <th class="text-center" colspan="2">PICKER</th>
                                        <th class="text-center">PICK COUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in picker" :key="i">
                                        <td class="text-center">
                                            <v-checkbox v-model="selectedPicker[i]" @change="assign(item, i)"></v-checkbox>
                                        </td>
                                        <td class="text-left">{{ item.EmployeeID }}</td>
                                        <td class="tetx-left">{{ item.EmployeeName }}</td>
                                        <td class="text-center">{{ item.PickCount }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" dark @click="dialog = false">BACK</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="saveTrapper()">SAVE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="dialog1" persistent max-width="600px">
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="dialogConstruction" label="CONSTRUCTION CODE" dense outlined readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" sm="12">
                            <v-text-field v-model="dialogHouse" label="HOUSE" dense outlined readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <v-text-field v-model="dialogShipment" label="SHIPMENT" dense outlined readonly></v-text-field>
                        </v-col>
                    </v-row>
                    <v-card outlined>
                        <v-simple-table fixed-header height="250px" dense>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-center">EXPORT HINBAN/MOTHER HINBAN</th>
                                        <th class="text-center">FINISHED</th>
                                        <th class="text-center">DATE TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in status" :key="i">
                                        <td class="text-center">{{ item.HINBAN +'-'+ item.CLR}}</td>
                                        <td class="text-center">
                                            <v-icon color="black">mdi-check-bold</v-icon>
                                        </td>
                                        <td class="text-center"></td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" dark @click="dialog1 = false">BACK</v-btn>
                    <!-- <v-spacer></v-spacer>
                    <v-btn color="primary" @click="close()">CLOSE</v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row justify="center">
        <v-dialog v-model="saveQuestioner" persistent max-width="290">
            <v-card>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <p class="subtitle-1 font-weight-black">Are you sure to distribute the item(s) to {{ assigned.EmployeeName }} ?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="saveQuestioner = false">CANCEL</v-btn>
                    <v-btn color="blue darken-1" text @click="saveAssign()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-layout row justify-center>
        <v-dialog v-model="value" persistent content content-class="centered-dialog">
            <v-container fill-height>
                <v-layout column justify-center align-center>
                    <v-progress-circular indeterminate :size="70" :width="7" :color="progressColor"></v-progress-circular>
                    <h1 v-if="message != null">{{message}}</h1>
                </v-layout>
            </v-container>
        </v-dialog>
    </v-layout>

    <v-dialog v-model="showUnregister" max-width="500">
        <v-card>
            <v-card-title>
                NOT YET REGISTERED
                <v-spacer></v-spacer>
                <v-text-field v-model="searchHinban" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-simple-table fixed-header dense height="400">
                    <thead>
                        <tr>
                            <th class="text-center">Hinban</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in filterHinban" :key="i">
                            <td>{{ item.hinban }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="blue" @click="confirmAdd = true">REGISTER</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="confirmAdd" persistent max-width="300">
        <v-card>
            <v-card-title>
                REGISTER ALL HINBAN
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="red" @click="confirmAdd = false">CANCEL</v-btn>
                <v-btn dark color="primary" @click="registerAllHinban()">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
export default {
    data() {
        return {
            loadCon: 0,
            value: false,
            message: '',
            progressColor: 'purple',
            subti: [],
            codex: [],
            codez: '',
            grupo: [],
            total: 0,
            totalPlans: 0,
            bodyChecker: 0,
            dialog1: false,
            dialog: false,
            dstnData: [],
            reqKind: [],
            dstn: [],
            insert_data: {
                week: '',
                year: ''
            },
            filteredData: [],
            importedHinban: {},
            // expandData: {},
            expand: [],
            expanded: [],
            childHinban: [],
            childHinbanOrders: [],
            checkboxData: [],
            values: [],
            values1: [],
            picker: [],
            singleExpand: true,
            motherHinban: [],
            hinbanPart: "",
            hinbanQty: 0,
            lack: null,
            holderChecked: {},
            // checked: false,
            sample: {},
            selectedPicker: [],
            assigned: {},
            pickerCount: 0,
            saveQuestioner: false,
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
            showUnregister: false,
            searchHinban: '',
            confirmAdd: false,
            filteredExpand: [],
            statusConstruction: '',
            statusHouse: '',
            statusShipment: '',
            dialogConstruction: '',
            dialogHouse: '',
            dialogShipment: '',
            status: [],
            assignPickerTrap: '',
            processDate: '',
            checkAll: false,
            // unRegister: []
        }
    },
    created() {
        // this.insert_data = ""
        this.getDstnData()
        this.getReqKind()
        this.getDstn()
        this.filterData()
        this.getExpand()
        this.getPicker()
        // console.log(this.unRegister[0].length)
    },
    computed: {
        filterHinban() {
            if(this.unRegister == 'OK') {
                return
            } 
            else{
                return this.unRegister.filter(rec => {
                    return rec.hinban.toLowerCase().includes(this.searchHinban.toLowerCase())
                })
            }
            
        }
        // checked_child_hinban() {
        //     alert('selected_expand')

        // },
    },

    methods: {
        selected_counter() {
            return this.filteredExpand.filter(each => {
                return each.check == true
            })
        },
        unSelectAll() {
            for (var x = 0; x < this.filteredExpand.length; x++) {
                if (this.filteredExpand[x].check == true) {
                    this.filteredExpand[x].check = false
                }
            }
            this.checkBox()
        },
        selectAll() {
            for (var x = 0; x < this.filteredExpand.length; x++) {
                if (this.filteredExpand[x].isFinished != true && this.filteredExpand[x].picker == null) {
                    this.filteredExpand[x].check = this.checkAll == true ? true : false
                    // console.log(this.filteredExpand[x].check)
                }
            }
            //    setTimeout(()=>{
            // console.log(this.selected_counter().length)
            this.checkBox()
            //    },500)

        },
        filter_expand() {
            this.unSelectAll()
            this.filteredExpand = []
            this.childHinban = []
            if (this.insert_data.year.length > 0 || this.insert_data.week.length > 0) {
                this.filteredExpand = this.expand.filter(each => {
                    for (var x = 0; x < each.HINBAN.length; x++) {
                        if (this.insert_data.year != '' && this.insert_data.week != '') {
                            if (each.HINBAN[x].year == this.insert_data.year && each.HINBAN[x].week == this.insert_data.week) {
                                return each
                            }
                        } else {
                            if (each.HINBAN[x].year == this.insert_data.year) {
                                return each
                            }
                            if (each.HINBAN[x].week == this.insert_data.week) {
                                return each
                            }
                        }
                    }
                })
            } else {
                this.filteredExpand = []
            }
        },
        checkBox() {
            this.lack = null
            this.values = []
            let selected_expand = this.selected_counter()
            // let selected_expand = this.subti
            var ctr = 0
            // console.log(selected_expand.length, 'length')
            for (var z = 0; z < selected_expand.length; z++) {
                for (var x = 0; x < selected_expand[z].HINBAN.length; x++) {
                    // console.log(selected_expand[z].HINBAN[x],'ano to <--')
                    if (selected_expand[z].HINBAN[x].childData === undefined) {

                    } else {
                        // ctr += selected_expand[z].HINBAN[x].childData.length
                        if (selected_expand[z].HINBAN[x].childData.length !== 0) {
                            for (var i = 0; i < selected_expand[z].HINBAN[x].childData.length; i++) {
                                this.values.push({
                                    child: selected_expand[z].HINBAN[x].childData[i].HinbanPartCode,
                                    qty: selected_expand[z].HINBAN[x].childData[i].Quantity,
                                    onStock: selected_expand[z].HINBAN[x].childData[i].OnStockQty,
                                    availableQty: selected_expand[z].HINBAN[x].childData[i].AvailableQty,
                                    motherQty: selected_expand[z].HINBAN[x].qtyData,
                                    year: selected_expand[z].HINBAN[x].year,
                                    week: selected_expand[z].HINBAN[x].week,
                                    codeNo: selected_expand[z].codeNo,
                                    barchartNo: selected_expand[z].HINBAN[x].BarchartNo,
                                    houseCode: selected_expand[z].HOUSECD,
                                    motherHinban: selected_expand[z].HINBAN[x].hinbanData
                                })
                            }
                        }
                        // values.concat(val.HINBAN.childData[x])
                    }
                }
            }
            // console.log(this.values, 'values')

            this.values1 = []
            for (var a = 0; a < selected_expand.length; a++) {
                for (var b = 0; b < selected_expand[a].HINBAN.length; b++) {
                    this.values1.push({
                        motherHinban: selected_expand[a].HINBAN[b].hinbanData,
                        seq: selected_expand[a].HINBAN[b].seq,
                        year: selected_expand[a].HINBAN[b].year,
                        week: selected_expand[a].HINBAN[b].week,
                        codeNo: selected_expand[a].codeNo,
                        barchartNo: selected_expand[a].HINBAN[b].barchartNo,
                        houseCode: selected_expand[a].HOUSECD
                    })
                }
            }

            this.motherHinban = this.values1
            // console.log(this.motherHinban)
            // console.log(this.values,'111111')

            this.childHinbanOrders = this.values.map(rec => {
                return {
                    child: rec.child,
                    qty: rec.qty,
                    onStock: rec.onStock,
                    availableQty: rec.availableQty,
                    motherQty: rec.motherQty,
                    year: rec.year,
                    week: rec.week,
                    codeNo: rec.codeNo,
                    barchartNo: rec.barchartNo,
                    houseCode: rec.houseCode,
                    motherHinban: rec.motherHinban,
                    // groupQty: rec.qty *0 rec.motherQty
                }
            })
            // console.log(this.childHinbanOrders,'<=======')

            // let aa = _.groupBy(this.values, 'child')
            let xx = this.values.map(recc => {
                let multi = _.multiply(recc.qty, recc.motherQty)
                return {
                    child: recc.child,
                    // qty: _.multiply(r.quantity, r.motherQty),
                    qty: multi,
                    onStock: recc.onStock,
                    availableQty: recc.availableQty,
                    motherQty: recc.motherQty,
                    year: recc.year,
                    week: recc.week,
                    codeNo: recc.codeNo,
                    barchartNo: recc.barchartNo,
                    houseCode: recc.houseCode,
                    motherHinban: recc.motherHinban
                }
            })
            let aa = _.chain(xx).groupBy("child").map(r => {
                // let multi = ((r.motherQty)*(r.qty))
                // console.log(multi,'multi')
                let quantity = _.sumBy(r, 'qty')
                // let quantity = _.sum([r[0].motherQty, r[0].qty])
                // console.log(quantity,'<test')
                // let quantity = _.multiply(r)
                return {
                    child: r[0].child,
                    // qty: _.multiply(r.quantity, r.motherQty),
                    qty: quantity,
                    onStock: r[0].onStock,
                    availableQty: r[0].availableQty,
                    motherQty: r[0].motherQty,
                    year: r[0].year,
                    week: r[0].week,
                    codeNo: r[0].codeNo,
                    barchartNo: r[0].barchartNo,
                    houseCode: r[0].houseCode,
                    motherHinban: r[0].motherHinban
                }
            }).value()
            //  console.log(aa, 'chain')
            this.childHinban = aa

            // for (let x = 0; x < this.childHinban.length; x++) {
            //     if ((this.childHinban[x].motherQty * this.childHinban[x].qty) > this.childHinban[x].availableQty) {
            //         this.lack = 1
            //     }
            // }
            for (let x = 0; x < this.childHinban.length; x++) {
                if (this.childHinban[x].qty > this.childHinban[x].availableQty) {
                    this.lack = 1
                }
            }
            if (this.childHinban.length == 0) {
                this.lack = null
            } else {
                if (this.lack != 1) {
                    this.lack = 0
                }
            }

            if (selected_expand.length > 0) {
                this.bodyChecker = 0
            } else {
                this.bodyChecker = 1
            }

        },
        filterData() {
            this.filteredData = this.dstnData.filter(each => {
                if (this.insert_data.req == null && this.insert_data.week == null && this.insert_data.year == null && this.insert_data.dstn == null) {
                    return each
                } else {
                    return each.BarchartNo == this.insert_data.req && each.Bs_WW == this.insert_data.week && each.Bs_YY == this.insert_data.year && each.DSTN == this.insert_data.dstn
                }
            })
        },
        requestKind_Data() {
            axios.post(`${this.url}requestData`, {
                insertdata: this.insert_data
            })
            // .then(res => {
            //     console.log(res.data)
            // })
        },
        getDstnData() {
            axios.get(`${this.url}checkstock`).then(res => {
                // console.log(res.data)
                this.dstnData = res.data
            })
        },
        getReqKind() {
            axios.get(`${this.url}reqKind`).then(res => {
                // console.log(res.data)
                this.reqKind = res.data
            })
        },
        getDstn() {
            axios.get(`${this.url}dstn`).then(res => {
                // console.log(res.data)
                this.dstn = res.data
            })
        },
        getExpand() {
            if (this.loadCon == 1) {
                this.message = 'Distributing Items...'
            } else {
                this.message = 'Loading List of Plans...'
            }
            this.value = true
            axios.get(`${this.url}newTrial`)
                .then(res => {
                    this.expand = res.data
                    this.value = false
                    this.filter_expand()
                    if (this.loadCon == 1) {
                        this.$toast.success('ITEM DISTRIBUTED', 'Success!!', this.notificationSystem.options.success)
                    }
                    this.loadCon = 0
                    // console.log(this.expand, 'all data')
                    //this.filteredExpand = res.data
                })
        },
        // getExpand() {
        //     axios.post(`${this.url}expand`, {
        //         barchartData: this.insert_data
        //     })
        //     .then(res => {
        //         this.expand = res.data
        //         console.log(this.expand)
        //     }) 
        // },
        getParts(part, qty) {
            this.bodyChecker = 1
            this.lack = null
            this.hinbanPart = part
            this.hinbanQty = qty
            axios.post(`${this.url}partsHinban`, {
                    partHinban: this.hinbanPart
                })
                .then(res => {
                    // console.log(res.data)
                    for (let x = 0; x < res.data.length; x++) {
                        // console.log(res.data[x].HinbanPartCode +' '+ res.data[x].Quantity + ' qtyyyyyyy')
                        if ((res.data[x].Quantity * this.hinbanQty) > res.data[x].AvailableQty) {
                            this.lack = 1
                        }
                    }

                    if (res.data.length == 0) {
                        this.lack = null
                    } else {
                        if (this.lack != 1) {
                            this.lack = 0
                        }
                    }
                    this.childHinban = res.data
                    // console.log(this.childHinban)
                })
        },
        getPicker() {
            axios.get(`${this.url}picker`).then(res => {
                this.picker = res.data
            })
        },
        distribute() {
            // console.log(this.childHinban)
            this.selectedPicker = []
            this.pickerCount = 0
            if (this.unRegister != 'OK') {
                this.$toast.error('Register hinban first!', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            if (this.childHinban != null && this.lack == 0) {
                this.processDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
                //console.log(currentDateWithFormat)
                this.dialog = true
            } else {
                // console.log(this.childHinban)
                if (this.childHinban == "") {
                    this.$toast.error('No Item Available', 'Invalid', this.notificationSystem.options.error)
                }
                if (this.lack == 1) {
                    this.$toast.error('Lacking of Parts', 'Invalid', this.notificationSystem.options.error)
                }
            }
        },
        assign(val, indication) {
            if (this.selectedPicker[indication] == true) {
                this.pickerCount = 1
                for (let x = 0; x < this.picker.length; x++) {
                    if (x != indication) {
                        this.selectedPicker[x] = false
                    }
                }
                this.assigned = val
            } else {
                this.pickerCount = 0
                this.assigned = {}
            }
            // console.log(this.assigned)
        },
        saveTrapper() {
            if (this.pickerCount == 1) {
                this.saveQuestioner = true
            } else {
                this.$toast.error('Please Select Picker', 'Invalid', this.notificationSystem.options.error)
            }
        },
        saveAssign() {
            if (this.pickerCount == 1) {
                var a = this.childHinbanOrders
                var datachildHinbanOrders = a.map(rec => {
                    return {
                        Year: rec.year,
                        Week: rec.week,
                        CustomerCode: rec.codeNo,
                        HinbanPartCode: rec.child,
                        ExportHinbanName: rec.motherHinban,
                        TotalOrders: rec.qty * rec.motherQty,
                        TotalPick: 0,
                        Lacking: null,
                        isFinished: null,
                        PickerID: null,
                        DeletedDate: null,
                        UpdatedBy: ''
                    }
                })

                // console.log(datachildHinbanOrders)
                this.value = true
                axios.post(`${this.url}assignPicker`, {
                        picker: this.assigned,
                        order: this.childHinban,
                        // actualOrder: this.childHinbanOrders,

                        actualOrder: datachildHinbanOrders,
                        mother: this.motherHinban
                    })
                    .then(res => {
                        // console.log(res.data)
                        this.assignPickerTrap = res.data
                        // this.filteredExpand = []
                        this.childHinban = []
                        // this.filter_expand()
                        this.lack = null
                        this.assigned = {}
                        this.selectedPicker = []
                        this.pickerCount = 0
                        this.getDstnData()
                        this.getPicker()
                        // this.filterData()
                        this.loadCon = 1
                        this.getExpand()
                        this.saveQuestioner = false
                        this.dialog = false
                        // this.value = false
                        // this.$toast.success('ITEM DISTRIBUTED', 'Success!!', this.notificationSystem.options.success)
                    })
            } else {
                this.$toast.error('Please Select Picker', 'Invalid', this.notificationSystem.options.error)
            }
        },
        checkStatus(item) {
            // console.log(item)
            this.statusConstruction = item.codeNo
            this.statusHouse = item.HOUSECD
            axios.post(`${this.url}statusExportHinban`, {
                    construction: this.statusConstruction,
                    house: this.statusHouse
                })
                .then(res => {
                    this.status = res.data
                    // console.log(this.status, 'STATUS')
                    this.dialogConstruction = this.statusConstruction
                    this.dialogHouse = this.statusHouse
                    this.dialog1 = true
                })
        },
        registerAllHinban() {
            // console.log(this.filterHinban)
            axios.post(`${this.url}registerAllHinban`, {
                hinban: this.unRegister
            }).then(res => {
                this.$store.commit('GETUNREGISTER', 'OK')
                this.$toast.success('Hinban registered!', 'Success', this.notificationSystem.options.success)
                this.confirmAdd = false
                this.showUnregister = false
            })
        }
    },
}
</script>

<style scoped>
.myTable tr,
td {
    border: 1px solid black;
}

.myTable tr th {
    font-size: 20px;
    /* position: sticky;
    top: 0;
    z-index: 5; */
}

.dialog.centered-dialog,
.v-dialog.centered-dialog {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
    overflow: hidden;
}

.txtboxHead {
    height: 41px;
}

.searchBtn {
    width: 100%;
    margin-top: 2px;
}
</style>
