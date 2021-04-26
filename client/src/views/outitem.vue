<template>
<v-container fluid>

    <v-card flat style="background-color: rgb(255, 101, 0)">
        <v-card-text class="text-center display-1">
            SCAN TRAVEL TAG QR CODE
        </v-card-text>
    </v-card>

    <v-row>
        <v-col cols="12" md="3" sm="6">
            <v-text-field label="CONSTRUCTION CODE" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="2" sm="6">
            <v-text-field label="HOUSE CODE" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="2" sm="6">
            <v-text-field label="SHIPMENT" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
            <v-text-field label="PROCESSED BY" dense outlined></v-text-field>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <span>BASIC INFORMATION</span>
        </v-col>
    </v-row>

    <v-card outlined>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="4" sm="12">
                    <v-card outlined>
                        <v-card-text>
                            <span>EXPORT HINBAN (MOTHER HINBAN)</span>
                            <v-text-field dense outlined></v-text-field>
                            <span>HINBAN CODE</span>
                            <v-text-field dense outlined></v-text-field>
                            <span>HINBAN JAPANESE NAME</span>
                            <v-text-field dense outlined></v-text-field>
                            <v-card outlined height="250" max-height="250" max-width="350">
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card outlined>
                        <v-card-title>
                            PARTS HINBAN
                        </v-card-title>
                        <v-card-text>
                            <v-card>
                                <v-card-text>
                                    <v-simple-table fixed-header height="380px">
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left">ITEM PARTS</th>
                                                    <th class="text-left">QUANTITY</th>
                                                    <th class="text-left">REMARKS</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>
                            </v-card>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn dense dark color="primary">
                                <v-icon left>mdi-printer</v-icon>PRINT TRAVEL TAG/PALLET CODE
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</v-container>
</template>
