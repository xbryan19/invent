<template>
<v-container>
    <v-card>
        <v-card-title>
            <v-text-field style="height: 25px" dense append-icon="mdi-magnify" v-model="serKey" label="Search Hinban" outlined solo rounded></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="getAddSetup()">ADD SETUP</v-btn>
        </v-card-title>
        <v-card-title>
            <span class="subtitle-2" v-if="serKey.length > 0">Total Filtered Record(s): {{filterGetSetup.length}}</span>
            <span class="subtitle-2" v-else>Total Record(s): {{filterGetSetup.length}}</span>
        </v-card-title>
    </v-card>

    <v-row>
        <v-col>
            <span style="font-size: 25px"><b>HINBAN</b></span>
        </v-col>
        <v-col>
            <span style="font-size: 25px"><b>TOTAL PARTS</b></span>
        </v-col>
        <v-col>
            <span style="font-size: 25px"><b>GR0UP</b></span>
        </v-col>
        <v-col>
            <span style="font-size: 25px"><b>DELETE</b></span>
        </v-col>
    </v-row>

    <v-expansion-panels accordion inset>
        <v-expansion-panel flat v-for="(item, i) in filterGetSetup" :key="i">
            <v-expansion-panel-header dense class="grey lighten-2">
                <v-col>
                    {{item.ExportHinban}}
                </v-col>
                <v-col>
                    {{item.Part.length}}
                </v-col>
                <v-col>
                    {{item.GroupID}}
                </v-col>
                <v-col>
                    <v-icon color="red" @click.native.stop="deleteSetupAsk(item.ExportHinban)">mdi-delete</v-icon>
                </v-col>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-row>
                    <v-col cols="10">
                        <v-row dense class="d" v-for="(parts, j) in item.Part" :key="j">
                            <v-col>{{parts.HinbanPartCode}}</v-col>
                            <v-col>{{parts.Quantity}}</v-col>
                        </v-row>
                    </v-col>
                </v-row>

            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog v-model="addSetup" persistent max-width="600">
        <v-card>
            <v-card-title>
                ADD SETUP
            </v-card-title>
            <v-card-text>
                <v-card>
                    <v-card-title>
                        SELECT HINBAN
                        <v-spacer></v-spacer>
                        <v-text-field style="height: 25px" dense append-icon="mdi-magnify" v-model="serNoPart" label="Search Hinban" outlined solo rounded></v-text-field>
                    </v-card-title>
                    <v-card-text>
                        <v-simple-table dense height="200" fixed-header>
                            <thead>
                                <tr>
                                    <th class="text-center">HINBAN</th>
                                    <th class="text-center">SELECT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in filterNoSetup" :key="i">
                                    <td>{{item.ExportHinban}}</td>
                                    <td class="text-center">
                                        <v-btn x-small color="primary" dark @click="setHinban(item.ExportHinban)">>>></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-spacer></v-spacer>
                    MOTHER HINBAN: <b>{{hinbanCode}}</b>
                    <v-spacer></v-spacer>
                    <v-card-title>
                        <!-- SELECT GROUP -->
                        <!-- <v-spacer></v-spacer> -->
                        <v-text-field style="height: 25px" dense append-icon="mdi-magnify" v-model="serGroup" label="Search" outlined solo rounded></v-text-field>
                    </v-card-title>
                    <v-card-title>
                        <v-select v-model="filterValue" dense outlined label="FILTER" prepend-inner-icon="mdi-filter" :items="sort" item-value="id" item-text="name"></v-select>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table fixed-header dense :headers="headers" :items="filterGroup" single-expand :expanded.sync="expanded" item-key="GroupID" show-expand class="elevation-1" height="200">
                            <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                    <v-simple-table id="mesa">
                                        <tr v-for="(part, p) in item.Part" :key="p">
                                            <td>{{ part.Child }}</td>
                                            <td>{{ part.Quantity }}</td>
                                        </tr>
                                    </v-simple-table>
                                </td>
                            </template>
                            <template v-slot:item.action="{item}">
                                <v-btn x-small color="primary" dark @click="newSetupTrap(item.GroupID)">>>></v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-btn dark color="red" @click="back()">BACK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteSetupQ" persistent max-width="300">
        <v-card>
            <v-card-title>
                Delete Setup?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="red" @click="deleteSetupQ = false">CANCEL</v-btn>
                <v-btn dark color="primary" @click="deleteSetup()">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="newSetupQ" persistent max-width="300">
        <v-card>
            <v-card-title>
                Add Setup?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark color="red" @click="newSetupQ = false">CANCEL</v-btn>
                <v-btn dark color="primary" @click="newSetup()">OK</v-btn>
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
            serKey: '',
            serNoPart: '',
            serGroup: '',
            hinbanCode: '',
            groupID: '',
            toDeleteHinban: '',
            filterValue: 1,
            setup: [],
            noSetup: [],
            group: [],
            groupTest: [],
            expanded: [],
            addSetup: false,
            deleteSetupQ: false,
            newSetupQ: false,
            headers: [{
                    text: 'Group',
                    value: 'GroupName'
                },
                {
                    text: 'Select',
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
        this.getSetup()
    },
    methods: {
        getSetup() {
            axios.get(`${this.url}getSetup`).then(res => {
                // console.log(res.data, 'setup')
                this.setup = res.data
            })
        },
        getAddSetup() {
            axios.get(`${this.url}getAddSetup`).then(res => {
                this.noSetup = res.data
                this.getGroup()
                this.addSetup = true
            })
        },
        getGroup() {
            axios.get(`${this.url}getGroup`).then(res => {
                this.group = res.data
                // console.log(res.data[0].Part)
            })
        },
        deleteSetupAsk(hinban) {
            this.toDeleteHinban = hinban
            this.deleteSetupQ = true
        },
        deleteSetup() {
            axios.post(`${this.url}deleteHinbanSetup`, {
                hinban: this.toDeleteHinban
            }).then(res => {
                this.toDeleteHinban = ''
                this.deleteSetupQ = false
                this.getSetup()
                this.$toast.success('Hinban Setup Delete!', 'Success', this.notificationSystem.options.success)
            })
        },
        setHinban(hinban) {
            this.hinbanCode = hinban
        },
        newSetupTrap(id) {
            this.groupID = id
            if (this.hinbanCode == '' || this.hinbanCode == null) {
                this.$toast.error('Please select hinban!', 'Invalid', this.notificationSystem.options.error)
            } else {
                this.newSetupQ = true
            }
        },
        newSetup() {
            axios.post(`${this.url}setupHinban`, {
                hinban: this.hinbanCode,
                group: this.groupID
            }).then(res => {
                this.hinbanCode = ''
                this.groupID = ''
                this.getSetup()
                this.getAddSetup()
                this.newSetupQ = false
                this.$toast.success('Hinban Setup Added!', 'Success', this.notificationSystem.options.success)
            })
        },
        back() {
            this.hinbanCode = ''
            this.groupID = ''
            this.addSetup = false
        },
        test1() {
            // var a=[];
            //  a = this.group.map(group => {
            //     group.Part.filter(part => {
            //         // console.log(part.Child)
            //         return part.Child.toLowerCase().includes(this.serGroup.toLowerCase())
            //     })
            // })
            this.groupTest = [];
            for (var i = 0; i < this.group.length; i++) {
                // console.log('loop1')
                // console.log(this.group[i].Part.ength)
                var ss = 0;
                for (var ii = 0; ii < this.group[i].Part.length; ii++) {
                    for (var iii = 0; iii < this.group[i].Part[ii].Child.length; iii++) {
                        // var sss='GAWAITA-HIDARI-W';
                        var myReg = new RegExp('/' + this.serGroup + '.*/')
                        if (this.group[i].Part[ii].Child.toLowerCase().match(this.serGroup.toLowerCase(), '.*/')) {
                            // console.log(this.group[i].Part[ii].Child);
                            ss = 1;

                        }
                    }
                }
                if (ss == 1) {
                    this.groupTest.push(this.group[i])
                }
            }
            console.log(this.groupTest)
        }
    },
    computed: {
        filterGetSetup() {
            return this.setup.filter(rec => {
                return rec.ExportHinban.toLowerCase().includes(this.serKey.toLowerCase())
            })
        },
        filterNoSetup() {
            return this.noSetup.filter(rec => {
                return rec.ExportHinban.toLowerCase().includes(this.serNoPart.toLowerCase())
            })
        },
        filterGroup() {
            this.groupTest = [];
            if (this.filterValue == 1) {
                for (var i = 0; i < this.group.length; i++) {
                // console.log('loop1')
                // console.log(this.group[i].Part.ength)
                var ss = 0;
                    for (var ii = 0; ii < this.group[i].Part.length; ii++) {
                        for (var iii = 0; iii < this.group[i].Part[ii].Child.length; iii++) {
                            // var sss='GAWAITA-HIDARI-W';
                            // var myReg = new RegExp('/' + this.serGroup + '.*/')
                            if (this.group[i].Part[ii].Child.toLowerCase().match(this.serGroup.toLowerCase(), '.*/')) {
                                // console.log(this.group[i].Part[ii].Child);
                                ss = 1;

                            }
                        }
                    }
                    if (ss == 1) {
                        this.groupTest.push(this.group[i])
                    }
                }
            } else {
                this.groupTest = this.group.filter(rec => {
                    return rec.GroupName.toLowerCase().includes(this.serGroup.toLowerCase())
                })
            }
            
            return this.groupTest
        },
        test() {

            // return this.group.filter(rec => {
            //     var a =  this.group.map(rec => {
            //         return rec.Part[0]
            //     }).filter(rec => {
            //         return rec.Child.toLowerCase().includes(this.serGroup.toLowerCase())
            //     })

            //     rec.Part == a
            // })

            // return this.group.map(rec => {
            //     return rec.Part[0]
            // }).filter(rec => {
            //     return rec.Child.toLowerCase().includes(this.serGroup.toLowerCase())
            // })

            // console.log(a)
        }
    }
}
</script>

<style>
#mesa td {
    border: none;
}
</style>
