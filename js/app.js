var app = new Vue({
	el: '#app',

	data: {
		members : [],
		mostLoyalArray: [],
		leastLoyalArray : [],
		mostEngagedArray : [],
		leastEngagedArray : [],
		checkedParties : ["R","D","I"],
		selectedState : "all",
		statistics : {
			democrats : {
				total : 0,
				voteswparty: 0
			},
			republicans : {
				total : 0,
				voteswparty: 0
			},
			independents : {
				total : 0,
				voteswparty : 0
			},
			totalReps : 0
		}
	},

	created : function(){
		var currentPage = $("#currentPage").html();

		var myHeaders = new Headers();
		myHeaders.append("X-API-Key","vekerCLzSF3gH117t0vj6IpP8ReVSEwPdSCUBvkd");

		var miInit={
			method : 'GET',
			headers : myHeaders
		};

		if(localStorage.getItem(currentPage)!=null){
			this.members = JSON.parse(localStorage.getItem(currentPage));
			this.mostLoyalArray = this.mostLoyal;
			this.leastEngagedArray = this.leastEngaged;
			this.mostEngagedArray = this.mostEngaged;
			this.leastLoyalArray = this.leastLoyal;
		}else{
			data = fetch("https://api.propublica.org/congress/v1/113/"+currentPage+"/members.json", miInit)
			.then(data => data.json())
			.then(json =>{
				localStorage.setItem(currentPage,JSON.stringify(json.results[0].members));
				this.members = json.results[0].members;
				this.mostLoyalArray = this.mostLoyal;
				this.leastEngagedArray = this.leastEngaged;
				this.mostEngagedArray = this.mostEngaged;
				this.leastLoyalArray = this.leastLoyal;
			})
		}


	},

	methods: {
		votesWithParty: function(a,b){
			return a-b;
		},

		calculateMembers: function(){

			var auxD = 0;
			var auxR = 0;
			var auxI = 0;
			var totaldem = 0;
			var totalrep = 0;
			var totalind = 0;
			var total = 0;
			var array = this.members.slice();

			for( i in array){
				if (array[i].party == "D") {
					totaldem++;
					total++;
					auxD += array[i].votes_with_party_pct;

				}else if (array[i].party == "R") {
					totalrep++;
					total++;
					auxR += array[i].votes_with_party_pct;
				}else{
					totalind++;
					total++;
					auxI += array[i].votes_with_party_pct;
				}


			}
			this.statistics.democrats.total = totaldem;
			this.statistics.republicans.total = totalrep;
			this.statistics.independents.total = totalind;
			this.statistics.totalReps = total;

			this.statistics.democrats.voteswparty = Math.trunc((auxD/totaldem)*100)/100;
			this.statistics.republicans.voteswparty = Math.trunc((auxR/totalrep)*100)/100;
			this.statistics.independents.voteswparty = Math.trunc((auxI/totalind)*100)/100;

		}

	},

	computed : {

		filteredSenators(){
			var parties = this.checkedParties;
			var state = this.selectedState;

			return this.members.filter(function(senator){

				for (var i = 0; i < parties.length; i++) {
					if(senator.party == parties[i]){
						if (senator.state == state || state == "all") {
							return true;
						}
				}
			}
			})
		},

		statesList(){
			var states = [];

			for(var i = 0 ; i < this.members.length; i++){
				states[i]=this.members[i].state;
			}

			var statesSinRepetir = []
				for(let i = 0;i < states.length; i++){
						if(statesSinRepetir.indexOf(states[i]) == -1){
								statesSinRepetir.push(states[i])
						}
				}

				statesSinRepetir.sort();

				return statesSinRepetir;
		},



		leastEngaged(){
			var arr = this.members;
			arr.sort(function(a,b){
				return a.missed_votes_pct - b.missed_votes_pct;
			});

			var returnArray = [];
			for(var i = 0 ; i < Math.floor((arr.length/100)*10) ; i++){
				returnArray.push(arr[i]);
			}
			return returnArray;
		},

			mostEngaged(){
			var arr = this.members;

			arr.sort(function(a,b){
				return b.missed_votes_pct - a.missed_votes_pct;
			});

			var returnArray = [];
			for(var i = 0 ; i < Math.floor((arr.length/100)*10) ; i++){
				returnArray.push(arr[i]);
			}
			return returnArray;
		},

		leastLoyal(){
			var arr = this.members;
			arr.sort(function(a,b){
				return a.votes_with_party_pct - b.votes_with_party_pct;
			});

			var returnArray = [];
			for(var i = 0 ; i < Math.floor((arr.length/100)*10) ; i++){
				returnArray.push(arr[i]);
			}
			return returnArray;

		},
		mostLoyal(){
			var arr = this.members;
			arr.sort(function(a,b){
				return b.votes_with_party_pct - a.votes_with_party_pct;
			});

			var returnArray = [];
			for(var i = 0 ; i < Math.floor((arr.length/100)*10) ; i++){
				returnArray.push(arr[i]);
			}
			return returnArray;
		}

	}
});
