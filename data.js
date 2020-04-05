let ipURL = "https://ipapi.co/json/";
let coronaUnitedStatesURL = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs";
let coronaWorldURL = "https://coronavirus-19-api.herokuapp.com/countries";
let hospitalsURL = "https://opendata.arcgis.com/datasets/6ac5e325468c4cb9b905f1728d6fbf0f_0.geojson"

var ip;
var corona;
var hospitals;



let binarySearch = function (arr, x) { 
   
    let start=0, end=arr.length-1; 
          
    // Iterate while start not meets end 
    while (start<=end){ 
  
        // Find the mid index 
        let mid=Math.floor((start + end)/2); 
   
        // If element is present at mid, return True 
        if (arr[mid]===x) return true; 
  
        // Else look in left or right half accordingly 
        else if (arr[mid] < x)  
             start = mid + 1; 
        else
             end = mid - 1; 
    } 
   
    return false; 
} 

async function getData(url) {
	let response = await fetch(url);

	if (response.ok) {
  		let json = await response.json();
		return json;
	} else {
  		alert("HTTP-Error: " + response.status);
	}
};

async function getIPLocation() {
    return getData("https://ipapi.co/json/");
}

function findHospitals(zip, range) {
    let localHospitals = []

    for (let index = 0; index < hospitals.length; index++) {
        const hospital = hospitals[index];

        if ((hospital.properties.ZIP > zip - range) && (hospital.properties.ZIP < zip + range)) {
            localHospitals.push(hospital);
        }
    }

    return localHospitals;
}

function getNearHospitals() {
	if (typeof(hospitals) != "undefined" && typeof(ip) != "undefined") {
		var localHospitals = findHospitals(ip.postal, 100);

		localHospitals.forEach(hospital => {
			
			console.log(hospital.properties.NAME);
		});
	} else {
		console.log("Waiting...")
		setTimeout(getNearHospitals, 250);
	}
}

function setCoronaStats(stats) {
	document.getElementById("location").innerHTML = stats.location;
	document.getElementById("stats-1").innerHTML = stats.confirmed;
	document.getElementById("stats-2").innerHTML = stats.deaths;
	document.getElementById("stats-3").innerHTML = stats.recovered;
}

function getNearCorona() {
	if (typeof(corona) != "undefined" && typeof(ip) != "undefined") {
		if (ip.country == "US") {
			console.log(ip)
			var localLocations = [];
			for (let index = 0; index < corona.locations.length; index++) {
				const location = corona.locations[index];
				// console.log(location)
				
				if(location.province == ip.region) {
					localLocations.push(location);
				}
			}
			
			var latest = {"location": ip.region, "confirmed": 0, "deaths": 0, "recovered": 0};
			for (let index = 0; index < localLocations.length; index++) {
				const localLatest = localLocations[index].latest;

				latest.confirmed += localLatest.confirmed;
				latest.deaths += localLatest.deaths;
				latest.deaths += localLatest.deaths;

				
				
			}
			console.log(localLocations)

			setCoronaStats(latest)
		} else {

		}
	} else {
		console.log("Waiting...");
		setTimeout(getNearCorona, 250);
	}
}

getData(ipURL).then(json => {
	ip = json;
	if(ip.country != "US") {
		getData(coronaWorldURL).then(json => {
			corona = json;
		});
	} else {
		getData(coronaUnitedStatesURL).then(json => {
			corona = json;
		})
	}
});


getData(hospitalsURL).then(json => {
	hospitals = json.features;
    hospitals.sort((a, b) => (a.properties.ZIP > b.properties.ZIP) ? 1:-1);
})

getNearHospitals();
getNearCorona();
 

async function organizeData(json) {
	console.log(json)
	
	
	// Needs optimization
	// document.getElementById("stats-1").innerHTML = countryStats.active;
	// document.getElementById("stats-2").innerHTML = countryStats.cases;
	// document.getElementById("stats-3").innerHTML = countryStats.casesPerOneMillion;
	// document.getElementById("stats-4").innerHTML = countryStats.critical;
	// document.getElementById("stats-5").innerHTML = countryStats.deaths;
	// document.getElementById("stats-6").innerHTML = countryStats.recovered;
	// document.getElementById("stats-7").innerHTML = countryStats.todayCases;
	// document.getElementById("stats-8").innerHTML = countryStats.todayDeaths;
}

// console.clear();
// getData();

