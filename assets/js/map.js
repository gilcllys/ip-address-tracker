import key_ip from "./apiKey.js";
const button = document.getElementById('btn')
const input = document.getElementById('ipdata')

let ip = document.getElementById('ipRequest')
let location = document.getElementById('locationData')
let timezone = document.getElementById('timeData')
let isp = document.getElementById('ispData')


// --------------------------------------------------------------------------------------
// change the information
function PutInformation(ipAddress,loc,time,internetService){
    ip.innerHTML = ipAddress
    location.innerHTML = loc
    timezone.innerHTML = time
    isp.innerHTML = internetService
}

// Starting the map
let map = L.map('map').setView([51.505, -0.09], 13); 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://account.mapbox.com/copyright">MapBox</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZ2lsY2xseXMiLCJhIjoiY2wxMnRsMWttMzdrOTNkcW92Mm51MWs3aiJ9.K9LvglsvoJaiSICc1dJ4vg'
}).addTo(map);

let IconLocation = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize:     [28, 35],
    iconAnchor:   [28, 25]
});

//--------------------------------------------------------------------------------------------

// function to load a new view 
function UpdateMap(lat,long){
    map.setView([lat, long], 13)
    L.marker([lat, long], {icon: IconLocation}).addTo(map)
}

// -----------------------------------------------------------------------------------------
// change the url according the input user 
function ip_or_domain(input_user){
    if(!isNaN(input_user)){
        return `https://geo.ipify.org/api/v2/country,city?apiKey=${key_ip}&ipAddress=${input_user}&domain=`
    }else{
        return `https://geo.ipify.org/api/v2/country,city?apiKey=${key_ip}&ipAddress=&domain=${input_user}`
    }
}

//-----------------------------------------------------------------------------------------
// consume the API
function get_API(url){
    axios(url)
    .then(response => {
        let data = response.data
        let adress = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
        PutInformation(data.ip,adress,data.location.timezone,data.isp)
        UpdateMap(data.location.lat,data.location.lng)
    })
    .catch(erro => console.log(erro))
}

// --------------------------------------------------------------------------------------
// Event handler
button.addEventListener('click',()=>{
    const url = ip_or_domain(input.value)
    get_API(url)
})
