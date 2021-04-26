<template>
<v-container fluid>
    <v-row>
        <v-col cols="12" md="3" sm="4">
            <v-text-field v-model="motherHinban" label="EXPORT HINBAN (MOTHER HINBAN)" dense outlined class="text-center"></v-text-field>
        </v-col>
        <v-col>
            <v-btn dense color="primary" dark @click="checkHinban()">
                <v-icon left>mdi-file-find</v-icon>CHECK
            </v-btn>
        </v-col>
    </v-row>

    <small>BASIC INFORMATION</small>
    <v-card outlined>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4" sm="12">
                    <v-card outlined>
                        <v-card-text>
                            <v-form>
                                <span>EXPORT HINBAN(MOTHER HINBAN)</span>
                                <v-text-field v-model="fetching.exportHinban" dense outlined readonly class="text-align: center"></v-text-field>
                                <span>HINBAN CODE</span>
                                <v-text-field v-model="fetching.hinbanCode" dense outlined readonly></v-text-field>
                                <span>HINBAN JAPANESE NAME</span>
                                <v-text-field v-model="fetching.japaneseName" dense outlined readonly></v-text-field>
                                <v-card outlined height="300" max-height="300" max-width="350">
                                </v-card>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card outlined>
                        <v-card-title>
                            <small>HINBAN PARTS</small>
                            <!-- <v-spacer></v-spacer>
                            <v-btn dense color="primary" dark @click="edit=true">
                                <v-icon left>mdi-briefcase-plus</v-icon>ADD
                            </v-btn> -->
                        </v-card-title>
                        <v-card-text>
                            <v-card outlined>
                                <v-card-text>
                                    <v-simple-table fixed-header height="500px">
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left">ITEM PARTS</th>
                                                    <th class="text-left">QUANTITY</th>
                                                    <!-- <th class="text-left">REMARKS</th> -->
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, i) in checkedHinban" :key="i">
                                                    <td>{{ item.HinbanPartCode }}</td>
                                                    <td>{{ item.Quantity }}</td>
                                                    <!-- <td></td> -->
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-row justify="center">
        <v-dialog v-model="edit" persistent max-width="300px">
            <v-card>
                <v-card-text>
                    <v-card-title></v-card-title>
                    <v-row>
                        <v-text-field label="ITEM PART" dense outlined></v-text-field>
                    </v-row>
                    <v-row>
                        <v-text-field label="QUANTITY" dense outlined></v-text-field>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" dark @click="edit = false">BACK</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="edit = false">UPDATE</v-btn>
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
            edit: false,
            checkedHinban: [],
            motherHinban: '',
            fetching: {}
        }
    },
    methods: {
        checkHinban() {
            this.fetching = {}
            this.checkedHinban = ''
            if (this.motherHinban != '') {
                axios.post(`${this.url}motherChild`, {
                        motherChild: this.motherHinban
                    })
                    .then(res => {
                        if (res.data != '') {
                            this.checkedHinban = res.data
                            // console.log(this.checkedHinban)
                            this.$set(this.fetching, 'exportHinban', this.checkedHinban[0].ExportHinbanName)
                            this.$set(this.fetching, 'hinbanCode', this.checkedHinban[0].ExportHinbanCode)
                        }
                    })
            }
        }
    }
}
</script>
