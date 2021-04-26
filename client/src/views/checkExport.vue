<template>
<v-container fluid>
    <v-card outlined>
        <v-card-title>
            <h5>{{ userInfo.employeeCode }}</h5>
            <v-spacer></v-spacer>
            <h5>{{ userInfo.fullName }}</h5>
        </v-card-title>
        <v-card-title>
            <v-row>
                <!-- <v-col> -->
                <!-- <span>ENTER EXPORT HINBAN</span> -->
                <v-text-field v-model="exportHinban" label="ENTER EXPORT HINBAN" outlined dense></v-text-field>
                <v-btn color="primary" @click="checkParts()">CHECK</v-btn>
                <!-- </v-col> -->
            </v-row>

        </v-card-title>
        <v-card-text>
            <v-card outlined>
                <v-card-text>
                    <v-simple-table fixed-header height="500px" dense>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th colspan="2" class="text-center">ITEM PARTS</th>
                                    <th class="text-center">QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in parts" :key="i">
                                    <td class="text-center">{{ i+1 }}</td>
                                    <td>{{ item.HinbanPartCode }}</td>
                                    <td class="text-center">{{ item.Quantity }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            exportHinban: '',
            parts: [],
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
        this.exportHinban = ''
    },
    methods: {
        checkParts() {
            this.parts = []
            if (this.exportHinban != '') {
                axios.post(`${this.url}pickerCheckExport`, {
                        exportHinban: this.exportHinban
                    })
                    .then(res => {
                        // console.log(res.data)
                        if (res.data == '') {
                            this.$toast.error('No Item Parts on Export Hinban ' + `${this.exportHinban}`, 'Undefined!', this.notificationSystem.options.error)
                        } else {
                            this.parts = res.data
                        }
                    })
            } else {
                this.$toast.error('Please put a Export Hinban', 'Invalid', this.notificationSystem.options.error)
            }
        }
    },
}
</script>
