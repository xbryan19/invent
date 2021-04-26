<template>
<v-container>
    <div class="steady">
        <v-card outlined>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" lg="4" md="4" sm="12">
                        <v-select class="txtboxHead" v-model="filterValue" dense outlined label="FILTER BY" prepend-inner-icon="mdi-filter" :items="sort" item-value="id" item-text="name"></v-select>
                    </v-col>
                    <v-col cols="12" lg="4" md="4" sm="12">
                        <v-text-field class="txtboxHead" v-model="serKeyGroup" dense x-small append-icon="mdi-magnify" :label="labelCondition" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12">
                        <v-btn class="txtboxHead btnHead" dark color="primary" @click="searchFilterGroup()">
                            <v-icon left>mdi-card-search-outline</v-icon>SEARCH
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="12">
                        <v-btn class="txtboxHead btnHead" dark color="primary" @click="refresh()">
                            <v-icon left>mdi-database-refresh-outline</v-icon>REFRESH
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card outlined>
            <v-card-text>
                <v-row dense>
            <!-- {{sample}}
            {{pageLength}} -->
                    <v-col cols="12" lg="8" md="8" sm="12">
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
                    <v-col cols="12" lg="2" md="2" sm="6" xs="6">
                        <h4 class="total">Total Record(s): {{groupHolder.length}}</h4>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="6" xs="6">
                        <v-btn class="total" dark color="primary" @click="addFlag = 'GROUP', setGroup = true, groupNameRead = false, groupName = '', groupID = ''">
                            <v-icon left>mdi-table-plus</v-icon>NEW GROUP
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
    
    <v-row>
        <v-col>
            <span style="font-size: 25px"><b>GROUP ID</b></span>
        </v-col>
        <v-col>
            <span style="font-size: 25px"><b>GROUP NAME</b></span>
        </v-col>
        <v-col>
            <span style="font-size: 25px"><b>PARTS</b></span>
        </v-col>
    </v-row>

    <v-expansion-panels accordion inset>
        <v-expansion-panel flat v-for="(item, i) in filterGroup" :key="i">
            <v-expansion-panel-header dense class="grey lighten-2">
                <v-col>
                    Group - {{item.GroupID}}
                </v-col>
                <v-col>
                    {{item.GroupName}}
                </v-col>
                <v-col>
                    {{item.Part.length}}
                </v-col>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-row>
                    <v-col cols="10">
                        <v-row dense v-for="(part, p) in item.Part" :key="p">
                            <v-col cols="6">{{part.Child}}</v-col>
                            <v-col cols="3">{{part.Quantity}}</v-col>
                            <v-col cols="3">
                                <v-btn class="mt-0" small text color="#EF5350" v-if="item.Part.length > 1" @click="groupID = item.GroupID, deleteFlag = 'PART', hinbanPart = part.Child, deleteGroupQ = true">
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
                                <v-btn fab dark small color="green" @click="groupID = item.GroupID, getEditPart(), addFlag = 'EDIT', editAllPart = true">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn fab dark small color="indigo" @click="groupID = item.GroupID, getCurrentPart(), addFlag = 'PART', groupName = item.GroupName, groupNameRead = true, setGroup = true">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                                <v-btn fab dark small color="red" @click="groupID = item.GroupID, deleteFlag = 'GROUP', deleteGroupQ = true">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-speed-dial>
                        </v-card>
                    </v-col>
                </v-row>

            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog v-model="setGroup" persistent max-width="550">
        <v-card>
            <v-card-title>
                SET GROUP
                <v-spacer></v-spacer>
                <v-btn rounded dark color="primary" @click="back()"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-title>
                <v-text-field v-model="groupName" dense outlined label="GROUP NAME" :readonly="groupNameRead"></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-card>
                    <v-card-title dense>
                        <span>SELECT PARTS</span> 
                        <v-spacer></v-spacer>
                        <v-text-field class="searchSetGroup" @keyup.enter="searchSelectPart()" @click:clear="clearSelect()" v-model="searchPartAdd" append-icon="mdi-magnify" label="Search" outlined dense clearable></v-text-field>
                    </v-card-title>
                    <v-card-text>
                        <v-simple-table dense fixed-header height="200px">
                            <thead>
                                <tr>
                                    <th class="text-center">Item Part</th>
                                    <th class="text-center">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in filterAllPart" :key="i">
                                    <td>{{item.HinbanPartCode}}</td>
                                    <td class="text-center">
                                        <v-btn x-small color="primary" dark @click="qtyPart = item.HinbanPartCode, setQty = true">>>></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <template>
                            <div class="text-center">
                                <v-pagination
                                v-model="pageSelectPart"
                                :length="selectPageLength"
                                :total-visible="totalShow"
                                prev-icon="mdi-menu-left"
                                next-icon="mdi-menu-right"
                                ></v-pagination>
                            </div>
                        </template>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>
                        SELECTED PARTS
                        <v-spacer></v-spacer>
                        <v-text-field class="searchSetGroup" @keyup.enter="searchSelectedPart()" @click:clear="clearSelected()" v-model="searchCurrentPart" append-icon="mdi-magnify" label="Search" outlined dense clearable></v-text-field>
                    </v-card-title>
                    <v-card-text>
                        <v-simple-table dense fixed-header height="180px">
                            <thead>
                                <tr>
                                    <th class="text-center">Item Part</th>
                                    <th class="text-center">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in filterCurrentPart" :key="i">
                                    <td>{{item.HinbanPartCode}}</td>
                                    <td class="text-center">{{item.Quantity}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editAllPart" max-width="550">
        <v-card>
            <v-card-title>
                EDIT PART
                <v-spacer></v-spacer>
                <v-text-field v-model="searchEditAllPart" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-simple-table dense fixed-header height="300">
                    <thead>
                        <tr>
                            <th class="text-center">ITEM PART</th>
                            <th class="text-center">QUANTITY</th>
                            <th class="text-center">EDIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in filterGetEditPart" in :key="i">
                            <td>{{item.HinbanPartCode}}</td>
                            <td class="text-center">{{item.Quantity}}</td>
                            <td class="text-center">
                                <v-btn x-small color="primary" @click="qtyPart = item.HinbanPartCode, qty = item.Quantity, setQty = true">>>></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="addGroupQ" max-width="250">
        <v-card>
            <v-card-title>
                <span v-if="addFlag == 'EDIT'">UPDATE PART?</span>
                <span v-else>ADD PART?</span>
            </v-card-title>
            <v-card-text>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark @click="addGroupQ = false">CANCEL</v-btn>
                <v-btn v-if="addFlag == 'GROUP'" color="primary" dark @click="addGroup()">OK</v-btn>
                <v-btn v-else-if="addFlag == 'PART'" color="primary" dark @click="addPart()">OK</v-btn>
                <v-btn v-else color="primary" dark @click="updatePart()">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteGroupQ" max-width="250">
        <v-card>
            <v-card-title>
                <span v-if="deleteFlag == 'GROUP'">DELETE GROUP?</span>
                <span v-else>DELETE PART</span>
            </v-card-title>
            <v-card-text>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark @click="deleteGroupQ = false">CANCEL</v-btn>
                <v-btn v-if="deleteFlag == 'GROUP'" color="primary" dark @click="deleteGroup()">OK</v-btn>
                <v-btn v-else color="primary" dark @click="deletePart()">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="setQty" max-width="300">
        <v-card>
            <v-card-title>
                SET QUANTITY
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="qtyPart" outlined readonly dense></v-text-field>
                <v-text-field v-model="qty" outlined dense></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="red" @click="setQty = false">CANCEL</v-btn>
                <v-btn dark color="primary" @click="addGroupTrap()">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="test" max-width="100">
        <v-card>
            <v-card-title>
                TAE
            </v-card-title>
        </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            test: false,
            serKeyGroup: '',
            searchPartAdd: '',
            searchCurrentPart: '',
            searchEditAllPart: '',
            groupID: '',
            addFlag: '',
            deleteFlag: '',
            hinbanPart: '',
            qtyPart: '',
            qty: '',
            groupName: '',
            filterValue: 0,
            page: 1,
            pageSelectPart: 1,
            perPage: 100,
            totalShow: 7,
            setGroup: false,
            addGroupQ: false,
            deleteGroupQ: false,
            setAddPartGroup: false,
            setQty: false,
            editAllPart: false,
            groupNameRead: false,
            group: [],
            allPart: [],
            allPartCopy: [],
            partAdd: [],
            partAddCopy: [],
            partCond: [],
            editPart: [],
            groupHolder: [],
            filterAllPartHolder: [],
            groupCopy: [],
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
            },
            sort: [{
                    id: 0,
                    name: 'GROUP NAME'
                },
                {
                    id: 1,
                    name: 'GROUP PART'
                }
            ]
        }
    },
    created() {
        this.getGroup()
        this.getAllPart()
    },
    computed: {
        filterGroup() {
            this.groupHolder = this.groupCopy
            return this.groupHolder.slice((this.page - 1) * this.perPage, ((this.page - 1) * this.perPage) + this.perPage)
        },
        filterAllPart() {
            this.filterAllPartHolder = this.allPartCopy
            return this.filterAllPartHolder.slice((this.pageSelectPart - 1) * this.perPage, ((this.pageSelectPart - 1) * this.perPage) + this.perPage)
        },
        filterCurrentPart() {
            return this.partAddCopy
        },
        filterGetEditPart() {
            return this.editPart.filter(rec => {
                return rec.HinbanPartCode.toLowerCase().includes(this.searchEditAllPart.toLowerCase())
            })
        },
        pageLength() {
            let paging = parseInt(this.groupCopy.length / this.perPage)
            let trapMod = parseInt(this.groupCopy.length % this.perPage)
            if (trapMod != 0) {
                paging += 1
            }
            return paging
        },
        selectPageLength() {
            let paging = parseInt(this.allPartCopy.length / this.perPage)
            let trapMod = parseInt(this.allPartCopy.length % this.perPage)
            if (trapMod != 0) {
                paging += 1
            }
            return paging
        },
        labelCondition() {
            return (this.filterValue == 0) ? 'Search Group' : 'Search Part'
        }
    },
    methods: {
        getGroup() {
            axios.get(`${this.url}getGroup`).then(res => {
                this.page = 1
                this.totalShow = 7
                this.group = res.data
                this.groupCopy = this.group
            })
        },
        filterGetPart() {
            axios.post(`${this.url}filterGetPart`, {
                id: this.groupID,
                part: this.partCond
            }).then(res => {
                this.allPart = res.data
                this.allPartCopy = this.allPart
            })
        },
        getAllPart() {
            axios.get(`${this.url}getAllPart`).then(res => {
                this.allPart = res.data
                this.allPartCopy = this.allPart
            })
        },
        getCurrentPart() {
            axios.post(`${this.url}getCurrentPart`, {
                id: this.groupID
            }).then(res => {
                this.partAdd = res.data
                this.partCond = []
                for (var x = 0; x < this.partAdd.length; x++) {
                    this.partCond.push(this.partAdd[x].HinbanPartCode)
                }
                this.partAddCopy = this.partAdd
                this.filterGetPart()
            })
        },
        getEditPart() {
            axios.post(`${this.url}getCurrentPart`, {
                id: this.groupID
            }).then(res => {
                this.editPart = res.data
            })
        },
        addGroupTrap() {
            if (this.qty == 0 || this.qty == '') {
                this.$toast.error('Please set quantity!', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            if (this.groupName == '' || this.groupName == null) {
                this.$toast.error('Please set group name!', 'Invalid', this.notificationSystem.options.error)
                return false
            }
            if (!this.partAdd.length) {
                axios.post(`${this.url}compareName`, {
                    name: this.groupName
                }).then(res => {
                    if (res.data.length > 0) {
                        this.$toast.error('Group name already exists!', 'Invalid', this.notificationSystem.options.error)
                        return false
                    } else {
                        this.addGroupQ = true
                    }
                })
            } else {
                this.addGroupQ = true
            }
        },
        addGroup() {
            if (this.groupID == null || this.groupID == '') {
                axios.get(`${this.url}getMax`).then(res => {
                    if (res.data[0].id == null) {
                        this.groupID = 1
                    } else {
                        this.groupID = res.data[0].id + 1
                    }
                    axios.post(`${this.url}addGroup`, {
                        id: this.groupID,
                        groupName: this.groupName,
                        part: this.qtyPart,
                        qty: this.qty
                    }).then(res => {
                        this.$toast.success('GROUP ADDED', 'Success', this.notificationSystem.options.success)
                        this.groupNameRead = true
                        this.qty = ''
                        this.addGroupQ = false
                        this.setQty = false
                        this.getGroup()
                        this.getCurrentPart()
                    })
                })
            } else {
                axios.post(`${this.url}addGroup`, {
                    id: this.groupID,
                    groupName: this.groupName,
                    part: this.qtyPart,
                    qty: this.qty
                }).then(res => {
                    this.$toast.success('GROUP ADDED', 'Success', this.notificationSystem.options.success)
                    this.qty = ''
                    this.addGroupQ = false
                    this.setQty = false
                    this.getGroup()
                    this.getCurrentPart()
                })
            }
        },
        addPart() {
            axios.post(`${this.url}addPartGroup`, {
                id: this.groupID,
                groupName: this.groupName,
                part: this.qtyPart,
                qty: this.qty
            }).then(res => {
                this.$toast.success('PART ADDED TO GROUP', 'Success', this.notificationSystem.options.success)
                this.addGroupQ = false
                this.setQty = false
                this.qty = ''
                this.getGroup()
                this.getCurrentPart()
            })
        },
        updatePart() {
            axios.post(`${this.url}updatePartGroup`, {
                id: this.groupID,
                part: this.qtyPart,
                qty: this.qty
            }).then(res => {
                this.$toast.success('PART UPDATED!', 'Success', this.notificationSystem.options.success)
                this.qtyPart = ''
                this.qty = ''
                this.addGroupQ = false
                this.setQty = false
                this.getGroup()
                this.getEditPart()
            })
        },
        deleteGroup() {
            axios.post(`${this.url}deleteGroup`, {
                id: this.groupID
            }).then(res => {
                this.$toast.success('GROUP DELETED', 'Success', this.notificationSystem.options.success)
                this.deleteGroupQ = false
                this.getGroup()
            })
        },
        deletePart() {
            axios.post(`${this.url}deleteHinbanPartGroup`, {
                id: this.groupID,
                part: this.hinbanPart
            }).then(res => {
                this.$toast.success('PART DELETED', 'Success', this.notificationSystem.options.success)
                this.getGroup()
                this.deleteGroupQ = false
            })
        },
        back() {
            this.qtyPart = ''
            this.partAdd = []
            this.partAddCopy = []
            this.setGroup = false
        },
        searchFilterGroup() {
            this.page = 1
            this.groupCopy = []
            if (this.filterValue == 1) {
                for (var x = 0; x < this.group.length; x++) {
                    var mark = 0
                    for (var y = 0; y < this.group[x].Part.length; y++) {
                        for (var z = 0; z < this.group[x].Part[y].Child.length; z++) {
                            if (this.group[x].Part[y].Child.toLowerCase().match(this.serKeyGroup.toLowerCase(), '.*/')) {
                                mark = 1
                            }
                        }
                    }
                    if (mark == 1) {
                        this.groupCopy.push(this.group[x])
                    }
                }
            } else {
                this.groupCopy = this.group.filter(rec => {
                    return rec.GroupName.toLowerCase().includes(this.serKeyGroup.toLowerCase())
                })
            }
            this.totalShow = 7
            console.log(this.groupCopy)
        },
        refresh() {
            this.totalShow = 7
            this.getGroup()
            this.getAllPart()
            this.serKeyGroup = ''
        },
        searchSelectPart() {
            this.allPartCopy = []
            this.allPartCopy = this.allPart.filter(rec => {
                return rec.HinbanPartCode.toLowerCase().includes(this.searchPartAdd.toLowerCase())
            })
            this.pageSelectPart = 1
            this.totalShow = 7
        },
        clearSelect() {
            this.pageSelectPart = 1
            this.totalShow = 7
            this.allPartCopy = this.allPart
        },
        searchSelectedPart() {
            this.partAddCopy = []
            this.partAddCopy = this.partAdd.filter(rec => {
                return rec.HinbanPartCode.toLowerCase().includes(this.searchCurrentPart.toLowerCase())
            })
        },
        clearSelected() {
            this.partAddCopy = this.partAdd
        },
    },
}
</script>

<style scoped>
#create .v-speed-dial {
    position: absolute;
}

#create .v-btn--floating {
    position: relative;
}

.txtboxHead {
    height: 42px;
}

.btnHead {
    width: 100%;
    margin-top: 2px;
}

.total {
    width: 100%;
    margin-top: 5px;
}

.searchSetGroup {
    height: 41px;
}

</style>
