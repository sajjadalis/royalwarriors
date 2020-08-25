<template>
    <div class="mx-3 md:mx-10 mb-5 md:mb-10">

        <div class="relative">
            <img src="/assets/header2.jpg" class="w-full h-auto mb-5 md:mb-10 rounded-b-lg">
            <h1 class="absolute top-0 left-0 font-heading font-bold text-xs md:text-3xl text-white mb-5 md:mb-10 leading-tight py-1 px-2 md:py-5 md:px-10 mt-2 md:mt-12 bg-black bg-opacity-75">The Royal Warriors Hunting Report for {{ today }}</h1>
        </div>

        <a href="/" class="block p-4 text-center text-2xl font-heading font-bold bg-gray-300 hover:bg-gray-400 rounded-lg shadow-xl transition duration-500 ease-in-out">
            Back to Home Page
        </a>

        <div class="w-full font-heading text-sm md:text-2xl p-5 shadow-xl rounded-lg text-center mt-10">
            <div class="flex items-center justify-center">
                <img src="/assets/crown.svg" class="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3 text-yellow-500" />
                <h2 class="font-bold mr-3">
                    Player of the Day: 
                </h2>
                <span class="font-medium mr-3">{{ leader.name }}</span>
                <div class="flex items-center justify-center">
                    <img src="/assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                    <img src="/assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                    <img src="/assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                </div>
            </div>
        </div>

        <div v-if="tabledata" class="w-full p-3 md:p-10 shadow-xl rounded-lg  mt-10">
            <div>
                <input class="w-full border border-gray-400 px-4 py-2 mb-2" type="text" v-model="search" placeholder="Filter Data by Player Name">
            </div>
            <VueTabulator id="usersData" v-model="tabledata" :options="options" />
        </div>

        <div v-else>
            <h1>Error</h1>
            <p>We're having issues with retrieving data. Please try again in few moments</p>
        </div>

        <div v-if="zeroKill" class="w-full p-3 md:p-10 shadow-xl rounded-lg mt-10">
            <h2 class="text-center mb-3 text-2xl font-heading font-bold">{{ zeroKill.length }} Players with Zero Kill 🤦‍♂️</h2>
            <ul>
                <li v-for="(player, index) in zeroKill" :key="index" class="inline-block border border-gray-200 mr-2 p-2 mt-2 rounded-md hover:bg-gray-100">
                    {{ player.name }}
                </li>
            </ul>
        </div>

        <div v-if="oneKill" class="w-full p-3 md:p-10 shadow-xl rounded-lg mt-10">
            <h2 class="text-center mb-3 text-2xl font-heading font-bold">{{ oneKill.length }} Players with One Kill (Lvl 2) 😔</h2>
            <ul>
                <li v-for="(player, index) in oneKill" :key="index" class="inline-block border border-gray-200 mr-2 p-2 mt-2 rounded-md hover:bg-gray-100">
                    {{ player.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    data() {
        return {
            loading: false,
            today: '',
            leader: '',
            zeroKill: '',
            oneKill: '',
            tabledata: [],
            autoNumFormatter: null,
            search: '',
            options: {
                layout:"fitColumns",
                responsiveLayout:"collapse",
                tooltips: true,
                tooltipsHeader: true,
                height: '580',
                 resizableColumns: 'header',
                initialSort : [
                    { column: "score", dir: "desc" }
                ],
                columns: [
                    {title:"S#", formatter:"rownum", width:70, align:"center", responsive:3},
                    {title:"Player Name", field:"name", minWidth:150},
                    {title:"Lvl 2", field:"lvl2", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Lvl 3", field:"lvl3", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Score", field:"score", sorter:"number", align:"center", mutator:this.score, bottomCalc:"avg"},
                ]
            }
        }
    },
    created() {
        this.playersTable();
    },
    mounted() {
        this.autoNumFormatter = function(){
            return document.getElementsByClassName("tabulator-row").length + 1;
        }

        const illustrations = require.context(
        '@/data',
        true,
        /^.*\.csv$/
        )
        console.log(illustrations.keys())
    },
    methods: {
        score(value, data, type, params, component){
            return data.lvl2 * 5 + data.lvl3 * 20; //return the sum of the other two columns.
        },
        playersTable() {
            let monsters = "/data/history/"+ this.$route.params.report+".csv"
        console.log(monsters);
            this.$papa.parse(monsters, {
                header: true,
                download: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    
                    this.tabledata = results.data;

                    this.today = moment(results.data[0].date).format('DD MMMM YYYY');

                    this.leader = results.data.reduce((a, c) => a.lvl2 > c.lvl2 ? a : c);

                    this.zeroKill = results.data.filter( (val) => {
                        return val.lvl2 === 0 && val.lvl3 === 0
                    });

                    this.oneKill = results.data.filter( (val) => {
                        return val.lvl2 === 1 && val.lvl3 === 0
                    });
                    
                }
            })
        },
        sum(items, prop){
            return items.reduce( function(a, b)
            {
                return a + b[prop];
            }, 0);
        }
    },
    // computed: {
    //     filteredUsers() {
    //         return this.tabledata.filter((name) => {
    //             return name.name.toLowerCase().match(this.search.toLowerCase())
    //         })
    //     }
    // }
}
</script>