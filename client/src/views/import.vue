<template>
  <div class="container">
    <div class="row justify-content-center">
      <v-card flat>
       
        <!-- <v-card-title><h1>Test</h1></v-card-title> -->
         <!-- {{vBomHinban}} -->
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-row>
                <v-file-input
                  prepend-inner-icon="mdi-paperclip"
                  prepend-icon=""
                  v-model="files"
                  hide-details
                  multiple
                  outlined
                  dense
                  class="ml-3"
                  style="border-right: none"
                ></v-file-input>

                <v-btn
                  style="height: 40px"
                  color="success"
                  hide-details
                  @click="uploadFiles()"
                  >Import</v-btn
                >
              </v-row>
            </v-col>

            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-text-field
                v-model="search"
                hide-details
                dense
                prepend-inner-icon="mdi-magnify"
                outlined
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <a-table
                class="mx-2"
                size="small"
                :columns="columns"
                :data-source="cSearch"
                rowKey="Hinban"
                :scroll="{ y: 550 }"
                bordered
                :loading="spin"
                style="text-align:center"
              >
                <template
                  v-for="col in ['BomHinban']"
                  :slot="col"
                  slot-scope="text, record"
                >
                  <div :key="col">
                    <a-textarea
                      autoSize
                      v-if="record.editable"
                      style="margin: -5px 0"
                      v-model="vBomHinban"
                    />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </template>
                <template slot="Action" slot-scope="text, record, index">
                  <div class="editable-row-operations">
                    <!-- <span v-if="record.editable">
                      <a @click="() => save(record.key)">Save</a>
                      <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
                        <a>Cancel</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                      <a :disabled="editingKey !== ''" @click="() => edit(record.key)">Edit</a>
                    </span> -->
                    <span v-if="record.editable">
                      <a @click="() => save(record,index,vBomHinban)" class="mr-5">Save</a>

                      <!-- <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record)">
                        <a>Cancel</a>
                      </a-popconfirm> -->
                       <a @click="() => cancel(record)">Cancel</a>
                    </span>
                    <span v-else>
                      <a :disabled="editingKey !== ''" @click="() => edit(record)"
                      ><v-icon color="success">mdi-file-edit</v-icon></a>
                    </span>
                  </div>
                </template>
              </a-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
const columns = [
  {
    title: "Hinban",
    dataIndex: "Hinban",
    scopedSlots: { customRender: "Hinban" },
  },
  {
    title: "BomHinban",
    dataIndex: "BomHinban",
    scopedSlots: { customRender: "BomHinban" },
  },
  {
    title: "Action",
    dataIndex: "Action",
    width: '20%',
    scopedSlots: { customRender: "Action" },
    align: 'center'
  },
];
export default {
  data() {
    return {
      columns,
      BomPartsHinban: [],
      vBomHinban: {},
      editingKey: "",
      spin: true,
      search: "",
      files: [],
    };
  },
  created() {
    this.getHinban();
  },
  computed: {
    cSearch() {
      if (this.search == null) {
        this.search = "";
      }
      let data = this.BomPartsHinban;

      data = data.filter((r) => {
        return (
          r.Hinban.includes(this.search) ||
          r.BomHinban.toUpperCase().includes(this.search.toUpperCase())
        );
      });

      return data;
    },
  },
  methods: {
    save(record, index, values){
        let data = this.BomPartsHinban;
        data = data.map((rec) => {
          rec.editable = false
          return rec
        });
        this.BomPartsHinban = data;
        
        axios.post(`${this.url}updateHinban`,{Hinban:record.Hinban, BomHinban: values})
        .then(res=>{
          this.getHinban();
          this.$notification.success({
              message: `SCAD Cabinet Warehouse System`,
              description:
              'Successfully Updated!!!!',
          });
        })
        
    },
    cancel(record){
      // console.log(record);
      let key = record.key;
      let data = this.BomPartsHinban;
      data = data.map((rec) => {
        rec.editable = false;
        return rec;
      });
      data[key].editable = false;
      this.BomPartsHinban = data;

    },
    edit(record) {
      // console.log(key)
      // const target = record.filter(r=> {return record.key});
      let key = record.key;
      let data = this.BomPartsHinban;
      data = data.map((rec) => {
        rec.editable = false;
        return rec;
      });
      data[key].editable = true;
      this.vBomHinban=  data[key].BomHinban
      this.BomPartsHinban = data;
    },
    getHinban() {
      axios
        .get(`${this.url}getImport`)
        .then((res) => {
          this.BomPartsHinban = res.data;
          let data = this.BomPartsHinban;
          let a = -1;
          data = data.map((rec) => {
            a += 1;
            rec.editable = false;
            rec.key = a;
            return rec;
          });
        })
        .finally(() => {
          this.spin = false;
        });
    },
    uploadFiles() {
      let formData = new FormData();
      let myData = { 
        uploadedDate: moment().format("YYYY-MM-DD"),
      };
      formData.append("myData", JSON.stringify(myData));
      for (var j = 0; j < this.files.length; j++) {
        let file = this.files[j];
        formData.append("files[]", file);
      }

      axios
        .post(`${this.url}uploadFiles`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            dataType: "json",
          },   
        })
        .then((res) => {
          if(res.data[0] == 'Successfully Inserted!'){
            this.getHinban();
            this.$notification.success({
                message: `SCAD Cabinet Warehouse System`,
                description:
                'Files Successfully Imported!!!!',
            });
          }else {
            this.$notification.error({
                message: `SCAD Cabinet Warehouse System`,
                description:
                'Files already exists!!!!',
            });
          }
          
        });
    },
  },
};
</script>

<style scoped>
.ant-table table {
    text-align: center;
}
</style>