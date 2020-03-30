var covidData;

async function getData() {
	let response = await fetch("https://coronavirus-19-api.herokuapp.com/countries");

	if (response.ok) {
  		let json = await response.json();
		covidData = json;
		organizeData();
	} else {
  		alert("HTTP-Error: " + response.status);
	}
};

async function organizeData() {
	var userCountry;
	var countryStats;
	
	let responce = await fetch("https://ipapi.co/json/");
	
	if (responce.ok) {
		let json = await responce.json();
		userCountry = json.country_code_iso3;
	} else {
  		alert("HTTP-Error: " + response.status);
	}
	
	document.getElementById("country").innerHTML = userCountry;
	
	for (var i = 0; i < covidData.length; i++){
		if (covidData[i].country == userCountry) {
			countryStats = covidData[i];
		}
	}
	
	
	// Needs optimization
	document.getElementById("stats-1").innerHTML = countryStats.active;
	document.getElementById("stats-2").innerHTML = countryStats.cases;
	document.getElementById("stats-3").innerHTML = countryStats.casesPerOneMillion;
	document.getElementById("stats-4").innerHTML = countryStats.critical;
	document.getElementById("stats-5").innerHTML = countryStats.deaths;
	document.getElementById("stats-6").innerHTML = countryStats.recovered;
	document.getElementById("stats-7").innerHTML = countryStats.todayCases;
	document.getElementById("stats-8").innerHTML = countryStats.todayDeaths;
}

console.clear();
getData();

