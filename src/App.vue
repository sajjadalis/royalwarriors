<template>
  <div id="app">
	<Home/>
  </div>
</template>

<script>
import Home from '@/components/Home'

export default {
  name: 'App',
  components: {
    Home
  },
  data() {
    return{
	  lvl2Monsters: null,
	  lvl3Monsters: null
    }
  },
  methods: {
    sum(items, prop){
	  return items.reduce( function(a, b)
	  {
          return a + b[prop];
      }, 0);
    }
  },
  mounted() {
    let cases = "http://localhost:8080/MonsterHuntingToday.csv";

            this.$papa.parse(cases, {
                header: true,
                download: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(results);
					this.lvl2Monsters = this.sum(results.data, 'Lvl 2');
					this.lvl3Monsters = this.sum(results.data, 'Lvl 3');
					console.log(this.lvl2Monsters);
                }
            })
  }
}
</script>