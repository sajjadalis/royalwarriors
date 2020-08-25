<template>
    <div v-if="tabledata" class="w-full p-3 border border-gray-200 shadow-xl rounded-lg  mt-10">
        <VueTabulator id="usersData" v-model="tabledata" :options="options" />
    </div>
</template>
<script>
export default {
    data(){
        return{
            tabledata: [
                {
                    "name": "Haron",
                    "lvl2": 5,
                    "lvl3": 0,
                },
                {
                    "name": "Zehr",
                    "lvl2": 2,
                    "lvl3": 1,
                },
                {
                    "name": "mang",
                    "lvl2": 4,
                    "lvl3": 1,
                }
            ],
            options: {
                layout:"fitColumns",
                columns: [
                    {title:"S#", formatter:"rownum", width:70, align:"center", responsive:3},
                    {title:"Name", field:"name", minWidth:150},
                    {title:"Lvl 2", field:"lvl2", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Lvl 3", field:"lvl3", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Sum Column", field:"sumCol", mutator:this.score, bottomCalc:"avg"},
                ]
            }
        }
    },
    methods: {
        score(value, data, type, params, component){
        //value - original value of the cell
        //data - the data for the row
        //type - the type of mutation occurring  (data|edit)
        //params - the mutatorParams object from the column definition
        //component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column
        //console.log(data);
        return data.lvl2 * 5 + data.lvl3 * 20; //return the sum of the other two columns.
        }
    }
}
</script>