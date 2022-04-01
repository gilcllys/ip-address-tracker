import key_ip from "./apiKey.js";
const button = document.getElementById('btn')
const input = document.getElementById('ipdata')
const boxErro = document.querySelector('div.erro')
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
    if(!isNaN(parseFloat(input_user))){
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
// Checking the IP format
function CheckIP(input_user){
    let sum = 0
    for (let letters of input_user){
        if (letters == '.'){
            sum ++
        }
        else{
            continue
        }
    }
    if (sum == 3){
        return true
    }else{
        return false
    }
}
// Checking the Domain format
function CheckDomain(input_user){
    let domain = input_user.split('.')
    if (domain[0] == 'www' && domain[2] == 'com' || domain[2] == 'br'){
        return true
    }
    else{
        return false
    }
}

// Checking if the input format is correct
function CheckInput(input_user){   
    if(input_user == null){
        return true
    }
    else{ 
        if(!isNaN(parseFloat(input_user))){
            return CheckIP(input_user)
        }else{
            return CheckDomain(input_user)
        }
    }
}

// --------------------------------------------------------------------------------------
// Event handler
button.addEventListener('click',()=>{
    let validation = CheckInput(input.value)
    console.log(validation)
    //console.log(boxErro)
    if (validation == false){
        // mostrar mensagem de erro
        boxErro.style.display = 'block'
    }else{
        // consumir a API e rodar o código normalmente
        boxErro.style.display = 'none'
        const url = ip_or_domain(input.value)
        console.log(url)
        get_API(url)
    }
})
