<template>
    <div class="mx-auto px-3 md:px-0 w-full md:w-1/2 mt-3">
        <div v-if="tabledata">
            <div>
                <input class="w-full border border-gray-400 px-4 py-2 mb-2" type="text" v-model="search" placeholder="Filter Data by Player Name">
            </div>
            <VueTabulator id="usersData" v-model="filteredUsers" :options="options" />
        </div>
        <div v-else>
            <h1>Error</h1>
            <p>We're having issues with retrieving data. Please try again in few moments</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            tabledata: [],
            autoNumFormatter: null,
            search: '',
            options: {
                layout:"fitColumns",
                //layout:"fitDataTable",
                responsiveLayout:"collapse",
                //movableColumns: true,
                tooltips: true,
                tooltipsHeader: true,
                height: '580',
                 resizableColumns: 'header',
                //pagination:"local",
                //paginationSize:20,
                //paginationSizeSelector:[20, 50, 100],
                //columnMinWidth: '80',
                initialSort : [
                    { column: "Lvl 2", dir: "desc" }
                ],
                columns: [
                    {title:"S#", formatter:"rownum", width:70, align:"center"},
                    {title:"Player Name", field:"Name"},
                    {title:"Level 2 Monster", field:"Lvl 2", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum"},
                    {title:"Level 3 Monster", field:"Lvl 3", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum"},
                    {title:"Score", field:"Score", sorter:"number", align:"center", formatterParams:{precision:true}, bottomCalc:"sum"}
                ]
            }
        }
    },
    created() {
        this.usersTable();
    },
    mounted() {
        this.autoNumFormatter = function(){
            return document.getElementsByClassName("tabulator-row").length + 1;
        }
    },
    methods: {
        usersTable() {
            let monsters = "http://localhost:8080/MonsterHuntingToday.csv";
            this.$papa.parse(monsters, {
                header: true,
                download: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    this.tabledata = results.data;
                }
            })

        }
    },
    computed: {
        filteredUsers() {
            return this.tabledata.filter((Name) => {
                return Name.Name.toLowerCase().match(this.search.toLowerCase())
            })
        }
    }
}
</script>