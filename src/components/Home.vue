<template>
    <div class="mx-3 md:mx-10 mb-5 md:mb-10">

        <div class="relative">
            <img src="assets/header2.jpg" class="w-full h-auto mb-5 md:mb-10 rounded-b-lg">
            <h1 class="absolute top-0 left-0 font-heading font-bold text-xs md:text-3xl text-white mb-5 md:mb-10 leading-tight py-1 px-2 md:py-5 md:px-10 mt-2 md:mt-12 bg-black bg-opacity-75">The Royal Warriors Hunting Report</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 md:gap-10">

            <div class="mt-10 md:mt-0 md:col-span-2 row-start-2 md:row-start-1">

                <div id="canvas-holder" class="w-full p-5 border border-gray-200 shadow-xl rounded-lg">
                    <p class="text-center mb-3">Today's Hunting comparison between Level 2 & Level 3 Monsters</p>
                    <canvas id="compareChart"></canvas>
                </div>

                <div id="canvas-holder" class="w-full p-5 border border-gray-200 shadow-xl rounded-lg mt-10">
                    <canvas id="dailyChart"></canvas>
                </div>

                <!-- <div id="canvas-holder" class="w-full p-5 border border-gray-200 shadow-xl rounded-lg mt-10">
                    <canvas id="lvl2Chart"></canvas>
                </div>

                <div id="canvas-holder" class="w-full p-5 border border-gray-200 shadow-xl rounded-lg mt-10">
                    <canvas id="lvl3Chart"></canvas>
                </div> -->

                <div id="canvas-holder" class="w-full p-5 border border-gray-200 shadow-xl rounded-lg mt-10">
                    <canvas id="scoreChart"></canvas>
                </div>

            </div>
            
            <div class="md:col-span-3">

                <div class="w-full font-heading text-sm md:text-2xl p-5 border border-gray-200 shadow-xl rounded-lg text-center">
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

                <div v-if="tabledata" class="w-full p-3 border border-gray-200 shadow-xl rounded-lg  mt-10">
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
            leader: '',
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
                    { column: "lvl2", dir: "desc" }
                ],
                columns: [
                    {title:"S#", formatter:"rownum", width:70, align:"center", responsive:3},
                    {title:"Player Name", field:"name", minWidth:150},
                    {title:"Lvl 2", field:"lvl2", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Lvl 3", field:"lvl3", sorter:"number", align:"center", formatter:"money", formatterParams:{precision:false}, bottomCalc:"sum", minWidth:80},
                    {title:"Score", field:"score", sorter:"number", align:"center", formatterParams:{precision:true}, bottomCalc:"avg"}
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
    },
    methods: {
        playersTable() {
            let monsters = "http://localhost:8080/data/todayStats.csv";
            this.$papa.parse(monsters, {
                header: true,
                download: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    
                    this.tabledata = results.data;

                    this.leader = results.data.reduce((p, c) => p.lvl2 > c.lvl2 ? p : c);

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
            let data = "http://localhost:8080/data/dailyStats.csv";

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

                    // Level 2 Hunting CHART //
                    // let lvl2 = data.map((doc) =>  doc.lvl2 );;
                    // let lvl2Chart = {
                    //     labels: chartLabels,
                    //     stepSize: 0.5,
                    //     datasets: [{
                    //         label: 'Daily Level 2 Hunting Progress',
                    //         data: lvl2,
                    //         backgroundColor: 'rgb(50, 173, 142)',
                    //     }],
                    // };

                    // let lvl2Container = document.getElementById('lvl2Chart');
                    // new Chart(lvl2Container, {
                    //     type: 'bar',
                    //     data: lvl2Chart,
                    //     options: options
                    // });

                    // Level 3 Hunting CHART //
                    
                    // let lvl3Chart = {
                    //     labels: chartLabels,
                    //     datasets: [{
                    //         label: 'Daily Level 3 Hunting Progress',
                    //         data: lvl3,
                    //         backgroundColor: 'rgb(0, 141, 229)',
                    //     }],
                    // };
                    // let lvl3Container = document.getElementById('lvl3Chart');
                    // new Chart(lvl3Container, {
                    //         type: 'bar',
                    //         data: lvl3Chart,
                    //         options: options
                    // });

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
        }
    },
    computed: {
        filteredUsers() {
            return this.tabledata.filter((name) => {
                return name.name.toLowerCase().match(this.search.toLowerCase())
            })
        }
    }
}
</script>