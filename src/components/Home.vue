<template>
    <div class="mx-3 md:mx-10 mb-5 md:mb-10">

        <div class="relative">
            <img src="assets/header2.jpg" class="w-full h-auto mb-5 md:mb-10 rounded-b-lg">
            <h1 class="absolute top-0 left-0 font-heading font-bold text-xs md:text-3xl text-white mb-5 md:mb-10 leading-tight py-1 px-2 md:py-5 md:px-10 mt-2 md:mt-12 bg-black bg-opacity-75">The Royal Warriors Hunting Report for {{ today }}</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 md:gap-10">

            <div class="mt-10 md:mt-0 md:col-span-2 row-start-2 md:row-start-1">

                <div class="w-full p-3 md:p-10 shadow-xl rounded-lg">
                    <select class="w-full border border-gray-300 py-2 px-4" @change="redirectPage($event)">
                        <option>Select a Date</option>
                        <option v-for="(file, index) in files" :key="index" :value="file">{{ file }}</option>
                    </select>
                </div>

                <div class="w-full p-3 md:p-10 shadow-xl rounded-lg mt-10">
                    <h2 class="text-center mb-3 text-2xl font-heading font-bold">Today's Hunting Ratio</h2>
                    <canvas id="compareChart"></canvas>
                </div>

                <div class="w-full p-3 md:p-10 shadow-xl rounded-lg mt-10">
                    <h2 class="text-center mb-3 text-2xl font-heading font-bold">Hunting Kills History</h2>
                    <canvas id="dailyChart"></canvas>
                </div>

                <div class="w-full p-3 md:p-10 shadow-xl rounded-lg mt-10">
                    <h2 class="text-center mb-3 text-2xl font-heading font-bold">Hunting Score History</h2>
                    <canvas id="scoreChart"></canvas>
                </div>

            </div>
            
            <div class="md:col-span-3">

                <div class="w-full font-heading text-sm md:text-2xl p-5 shadow-xl rounded-lg text-center">
                    <div class="flex items-center justify-center">
                        <img src="assets/crown.svg" class="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3 text-yellow-500" />
                        <h2 class="font-bold mr-3">
                            Leader of the Day: 
                        </h2>
                        <span class="font-medium mr-3">{{ leader.name }}</span>
                        <div class="flex items-center justify-center">
                            <img src="assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                            <img src="assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                            <img src="assets/confetti.svg" class="w-3 h-3 mr-1 md:w-6 md:h-6" />
                        </div>
                    </div>
                </div>

                <div v-if="tabledata" class="w-full p-3 md:p-10 shadow-xl rounded-lg  mt-10">
                    <div>
                        <input class="w-full border border-gray-400 px-4 py-2 mb-2" type="text" v-model="search" placeholder="Filter Data by Player Name">
                    </div>
                    <VueTabulator v-model="filteredPlayers" :options="options" />
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
        </div>
    </div>
</template>
<script>
import Chart from 'chart.js';
import moment from 'moment'
export default {
    data() {
        return {
            loading: false,
            files: '',
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
        this.scoreChart();
    },
    mounted() {
        this.autoNumFormatter = function(){
            return document.getElementsByClassName("tabulator-row").length + 1;
        }

        // Get files from History folder
        const files = require.context(
        '../../public/data/history',
        true,
        /^.*\.csv$/
        )

        this.files = files.keys().map( (file) => {
            return file.substring(2, file.length - 4);
        })
        console.log(this.files)
    },
    methods: {
        score(value, data, type, params, component){
            return data.lvl2 * 5 + data.lvl3 * 20; //return the sum of the other two columns.
        },
        playersTable() {
            let monsters = "/data/todayStats.csv";
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
                    //console.log(this.oneKill)

                    let lvl2Monsters = this.sum(results.data, 'lvl2');
                    let lvl3Monsters = this.sum(results.data, 'lvl3');

                    // Comparison Pie CHART //
                    let chartBg = ['rgb(50, 173, 142)', 'rgb(0, 141, 229)'];
                    let chartLabels = ['Level 2', 'Level 3'];
                    let compare = [lvl2Monsters, lvl3Monsters]

                    let chartCompare = {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Compare Progress',
                            data: compare,
                            backgroundColor: chartBg,
                            borderColor: "#fff",
                        }],
                    }
                    let compareContainer = document.getElementById('compareChart');
                    new Chart(compareContainer, {
                            type: 'doughnut',
                            data: chartCompare
                    });
                    
                }
            })
        },
        scoreChart(){  
            let data = "/data/dailyStats.csv";

            this.$papa.parse(data, {
                header: true,
                download: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    //console.log(results);
                    let data = results.data;

                    let chartLabels = data.map((doc) => moment(doc.date).format('DD MMM YYYY') );
                    
                    let options = {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }

                    let lvl2 = data.map((doc) =>  doc.lvl2 );
                    let lvl3 = data.map((doc) =>  doc.lvl3 );

                    let dailyChart = {
                        labels: chartLabels,
                        stepSize: 0.5,
                        datasets: [{
                            label: 'Level 2 Hunting Progress',
                            data: lvl2,
                            borderColor: 'rgb(50, 173, 142)',
                            backgroundColor: 'rgb(50, 173, 142)',
                            fill: false,
                        },
                        {
                            label: 'Level 3 Hunting Progress',
                            data: lvl3,
                            borderColor: 'rgb(0, 141, 229)',
                            backgroundColor: 'rgb(0, 141, 229)',
                            fill: false,
                        }],
                    };

                    let dailyChartContainer = document.getElementById('dailyChart');
                    new Chart(dailyChartContainer, {
                        type: 'line',
                        data: dailyChart,
                        options: options
                    });

                     // SCORE CHART //
                    let score = data.map((doc) =>  doc.score );;
                    let chartScore = {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Hunting Score Progress',
                            data: score,
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                        }],
                    };
                    let scoreContainer = document.getElementById('scoreChart');
                    new Chart(scoreContainer, {
                            type: 'bar',
                            data: chartScore,
                            options: options
                    });

                }
            })
        },
        sum(items, prop){
            return items.reduce( function(a, b)
            {
                return a + b[prop];
            }, 0);
        },
        redirectPage(event) {
            window.location.href = '/report/'+event.target.value;
        }
    },
    computed: {
        filteredPlayers() {
            return this.tabledata.filter((name) => {
                return name.name.toLowerCase().match(this.search.toLowerCase())
            })
        }
    }
}
</script>