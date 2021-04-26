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
                    <span class="display-1">FirstProcess</span>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="FilteredGetStock" fixed-header 
                                class="elevation-1 myTable" id="test" :search="search" height="550">
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
import axios from 'axios'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
    data() {
        return {
            search: '',
            stockData: [],
            headers: [{
                    text: 'Parts',
                    align: 'center',
                    value: 'HinbanPartCode',
                },
                {
                    text: 'Range Qty',
                    align: 'center',
                    value: 'RangeQty'
                },
                {
                    text: 'On Stock',
                    align: 'center',
                    value: 'OnStockQty'
                },
                {
                    text: 'Maximum Stock',
                    align: 'center',
                    value: 'MaximumStockQty'
                },
                {
                    text: 'Total Stock Needed',
                    align: 'center',
                    value: 'TotalStock'
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
                return each.TotalStock != 'N/A'
            })
        }
    },
    methods: {
        getStock() {
            axios.get(`${this.url}stockdata`).then(res => {
                // console.log(res.data,'firstProcess')
                this.stockData = res.data
                for (var x = 0; x < this.stockData.length; x++) {
                    let tsum = (this.stockData[x].MaximumStockQty - this.stockData[x].OnStockQty) - ((this.stockData[x].MaximumStockQty - this.stockData[x].OnStockQty) % this.stockData[x].RangeQty)
                    // console.log(tsum)
                    // this.$set(this.stockData[x], 'TotalStock', parseFloat(this.stockData[x].MaximumStockQty) - (parseFloat(this.stockData[x].OnStockQty) %  parseFloat(this.stockData[x].RangeQty)))

                    if (tsum > 0) {
                        this.$set(this.stockData[x], 'TotalStock', tsum)
                    } else {
                        this.$set(this.stockData[x], 'TotalStock', 'N/A')
                        // this.stockData[x] = ''
                    }
                }
            })
        },
        print(val) {
            // playground requires you to assign document definition to a variable called dd
            let PDF = val.map(rec => {
                return {
                    Parts: rec.HinbanPartCode,
                    RangeQty: rec.RangeQty,
                    OnStockQty: rec.OnStockQty,
                    MaximumStockQty: rec.MaximumStockQty,
                    TotalStock: rec.TotalStock
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
                columns[1] = 'Range'
                columns[2] = 'On Stock'
                columns[3] = 'Maximum'
                columns[4] = 'Total Stock Needed'

                // console.log(data+'<==========')
                return body;
            }

            function table(data, columns) {
                return {
                    table: {
                        headerRows: 5,
                        widths: [200, 50, 50, 60, 120],
                        body: buildTableBody(data, columns)
                    }
                };
            }

            var dd = {
                content: [{
                        text: 'First Process',
                        style: "header",
                    },

                    table(PDF, ['Parts', 'RangeQty', 'OnStockQty', 'MaximumStockQty', 'TotalStock'])

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
