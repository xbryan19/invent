<template>
<v-container fluid>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="print(FilteredGetStock)">
                <v-icon color="primary">mdi-printer</v-icon>Print
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-card>
                <v-card-title>
                    <span class="display-1">Critical Level</span>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="FilteredGetStock" fixed-header :search="search"
                                    class="elevation-1 myTable" id="test" height="550">
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
    
</v-container>
</template>

<script>
import axios from 'axios';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
    data() {
        return {
            stockData: [],
            search: '',
            headers: [{
                    text: 'Parts',
                    align: 'center',
                    value: 'HinbanPartCode',
                },
                {
                    text: 'Location',
                    align: 'center',
                    value: 'CabinetCode',
                },
                {
                    text: 'Minimum Stock',
                    align: 'center',
                    value: 'MinimumStockQty'
                },
                {
                    text: 'On Stock',
                    align: 'center',
                    value: 'OnStockQty'
                }
            ],
        }
    },
    created() {
        this.getStock()
    },
    computed: {
        FilteredGetStock() {
            return this.stockData.filter(each => {
                if (each.OnStockQty <= each.MinimumStockQty) {
                    return each
                }
            })
        }
    },
    methods: {
        getStock() {
            axios.get(`${this.url}stockdata`).then(res => {
                // console.log(res.data,'critical')
                this.stockData = res.data
            })
        },
        print(val) {
            // playground requires you to assign document definition to a variable called dd
            let PDF = val.map(rec => {
                return {
                    Parts: rec.HinbanPartCode,
                    MinimumStockQty: rec.MinimumStockQty,
                    OnStockQty: rec.OnStockQty
                }
            })
            // console.log(PDF)

            function buildTableBody(data, columns) {
                var body = [];

                body.push(columns);

                data.forEach(function (row) {
                    var dataRow = [];

                    columns.forEach(function (column) {
                        dataRow.push({
                            text: row[column].toString(),
                        });
                    })
                    body.push(dataRow);
                });
                columns[0] = 'Parts'
                columns[1] = 'MinimumStockQty'
                columns[2] = 'OnStockQty'

                // console.log(data+'<==========')
                return body;
            }

            function table(data, columns) {
                return {
                    table: {
                        headerRows: 3,
                        widths: [300, '*', '*'],
                        body: buildTableBody(data, columns)
                    }
                };
            }

            var dd = {
                content: [{
                        text: 'Critical Level',
                        style: "header",
                    },

                    table(PDF, ['Parts', 'MinimumStockQty', 'OnStockQty'])

                ],
                styles: {
                    header: {
                        fontSize: 25,
                        bold: true,
                        alignment: 'center',
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                        alignment: 'center'
                    },
                    position: {
                        alignment: 'right',
                    }
                },
                defaultStyle: {
                    alignment: 'center'
                }
            }
            pdfMake.createPdf(dd).open()
        }

    }
}
</script>

<style>
#test th {
    color: black;
}

.myTable th {
    font-family: Times;
    font-size: 20px !important;
    position: relative;
    clear: both;
    border-top: 1px solid black;
    font-weight: bold;
}

.myTable td {
    font-family: Times;
    font-size: 16px !important;
    border-bottom: 1px solid black;
    border-top: 1px solid black;
}

.myTable table {
    border: 1px solid black;
    border-bottom: none;
    border-top: none;
    /* border-collapse: collapse; */
}
</style>
