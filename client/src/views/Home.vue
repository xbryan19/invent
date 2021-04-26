<template>
    <div class="text-center">
        <!-- {{userInfo}} -->
        <v-card
            class="mx-auto"
            max-width="344"
            outlined
        >
            <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{userInfo.fullName}}</div>
                <v-list-item-title class="headline mb-1">{{userInfo.employeeCode}}</v-list-item-title>
                <v-list-item-subtitle>
                    {{userInfo.department}} Department, {{userInfo.section}} Section
 
                </v-list-item-subtitle>
            </v-list-item-content>
 
            <v-list-item-avatar
                tile
                size="80"
                color="grey"
            >
                <v-img
                    :src="imageUrl"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    max-width="100"
                    max-height="100"
                ></v-img>
            </v-list-item-avatar>
            </v-list-item>
 
            <v-card-actions>
                <v-btn fab icon>
                    <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn fab icon>
                    <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn fab icon>
                    <v-icon>mdi-instagram</v-icon>
                </v-btn>
                <v-btn fab icon>
                    <v-icon>mdi-youtube</v-icon>
                </v-btn>
 
            </v-card-actions>
        </v-card>
 
    </div>
</template>
 
<script>
export default {
    data: () => {
        return{
 
        }
    },
    methods: {
 
    },
    computed: {
        imageUrl() {
            return `http://hrdapps48:3001/ftp/employee_pictures/0${this.userInfo.employeeCode}.jpg`
        }
    }
}
</script>