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

		document.getElementById("numHospitals").innerHTML = localHospitals.length;

		localHospitals.forEach(hospital => {
			putHospital(hospital.properties);
		});
	} else {
		console.log("Waiting...")
		setTimeout(getNearHospitals, 250);
	}
}

function putHospital(hospital) {
	console.log(hospital)
	var mapURL = "https://open.mapquestapi.com/staticmap/v4/getmap?key=zbIGi4Mg5TzTGFaAvgU6jt9vtAO9jMVd&size=400,400&zoom=16&center=" +
	hospital.LATITUDE + "," + hospital.LONGITUDE;

	var mapLink = "https://www.google.com/maps/dir//" + encodeURI(hospital.ADDRESS);
	
	var parent = document.getElementById("nearHospitals");

	var wrapper = document.createElement('div');
	var card = document.createElement('div');
	var row = document.createElement('div');
	var col8 = document.createElement('div');
	var textleft = document.createElement('div');
	var hospitalName = document.createElement('h4');
	var small = document.createElement('small');
	var hospitalLocation = document.createElement('span');
	var icon = document.createElement('ICON');
	var hospitalWebsite = document.createElement('a');
	var hospitalPhone = document.createElement('p');

	var col = document.createElement('div');
	var profileContainer = document.createElement('div');
	var profileHeader = document.createElement('div');
	var profileimg = document.createElement('img');
	var profileimgLink = document.createElement('a');
	var profileLabelContainer = document.createElement('div');
	var profileLabel = document.createElement('span');
	
	wrapper.className = 'col-xs-12 col-sm-6 col-md-6';
	card.className = 'well rounded-mg shadow-light p-4 m-4'
	row.className = 'row';
	col8.className = 'col-8';
	textleft.className = 'text-left';
	icon.className = 'fa fa-map-marker';
	hospitalWebsite.className = 'text-wrap w-100';
	hospitalWebsite.style = 'white-space: pre-line !important; word-wrap: break-word !important;'

	col.className = 'col';
	profileContainer.className = 'profile-header-container';
	profileHeader.className = 'profile-header-img';
	profileimg.className = 'img-circle rounded-circle shadow-light';
	profileLabelContainer.className = 'rank-label-container';
	profileLabel.className = 'label label-default rank-label bg-light';

	textleft.appendChild(hospitalName);
	hospitalLocation.appendChild(icon);
	small.appendChild(hospitalLocation);
	textleft.appendChild(small);
	textleft.appendChild(hospitalWebsite);
	textleft.appendChild(hospitalPhone);

	col8.appendChild(textleft);

	profileLabelContainer.appendChild(profileLabel);
	profileimgLink.appendChild(profileimg);
	profileHeader.appendChild(profileimgLink);
	profileHeader.appendChild(profileLabelContainer);
	profileContainer.appendChild(profileHeader);

	col.appendChild(profileContainer);

	row.appendChild(col8);
	row.appendChild(col);

	card.appendChild(row);

	wrapper.appendChild(card);
	
	hospitalName.innerHTML = hospital.NAME;
	hospitalLocation.innerHTML = hospital.ADDRESS;
	hospitalWebsite.innerHTML = hospital.WEBSITE;
	hospitalWebsite.href = hospital.WEBSITE;
	hospitalWebsite.target = '_blank';
	hospitalPhone.innerHTML = hospital.TELEPHONE;
	profileLabel.innerHTML = hospital.BEDS + " Beds";
	
	
	profileimg.src = mapURL;
	profileimg.width = 100;
	profileimg.height = 100;
	profileimgLink.href = mapLink;
	profileimgLink.target = '_blank';


	parent.appendChild(wrapper)
	
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

