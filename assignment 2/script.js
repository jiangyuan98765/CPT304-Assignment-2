function fn1() {
    var city = document.getElementById("City").value;
    const weatherapiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e5eb20914f993f76ee41d0eabe52ab75`;
    fetch(weatherapiurl)
        .then((data)=>data.json())
        .then((weather)=>generateHTML(weather))

    const generateHTML = (data) =>{
        const html=`
            <div class="weather">Current Weather: ${data.weather[0].description}</div>
            <div class="temperature">Current Temperature ${Math.round((data.main.temp-273.15)*100)/100}</div><br>
        `
        const weatherdiv=document.querySelector(".weather")
        weatherdiv.innerHTML=html

        const holidayapiurl = `https://calendarific.com/api/v2/holidays?&api_key=64931719ef8200ea2c7013311cbf0a7717f422ab&country=${data.sys.country}&year=2021`;
        fetch(holidayapiurl)
            .then((data2)=>data2.json())
            .then((holiday)=>generateHTML2(holiday))

        const generateHTML2 = (data2) =>{
            var html2=`<div>Choose a Holiday</div><select name="holiday" id="holiday">`
            var i=0;
            for (i = 0; i < data2.response.holidays.length; i++) {
                html2 += `<option value=${data2.response.holidays[i].date.iso}>${data2.response.holidays[i].name}</option>`;
            }
            html2+=`</select><br><button onclick="fn2()" id="submit">Submit</button>`
            const holidaydiv=document.querySelector(".holiday")
            holidaydiv.innerHTML=html2
        }
    }

}function fn2(){
    var date=document.getElementById("holiday").value;
    var city = document.getElementById("City").value;
    fetch(`https://hotels4.p.rapidapi.com/locations/search?query=${city}&locale=en_US`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "ecac80d97cmsheee186fc6932dbep140071jsn545c5ba8c7e3",
            "x-rapidapi-host": "hotels4.p.rapidapi.com"
        }
    })
        .then((data3)=>data3.json())
        .then((id)=>getid(id))

    const getid = (data3) => {
        var id = data3.suggestions[0].entities[0].destinationId;
        var parts = date.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        var mydate2 = new Date(parts[0], parts[1] - 1, parts[2]);
        mydate.setDate(mydate.getDate()+2);
        var temp = mydate.toISOString().split("T", 1);
        var date2 = temp[0];
        fetch(`https://hotels4.p.rapidapi.com/properties/list?adults1=1&pageNumber=1&destinationId=${id}&pageSize=25&checkOut=${date2}&checkIn=${date}&sortOrder=PRICE&locale=en_US&currency=USD`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "ecac80d97cmsheee186fc6932dbep140071jsn545c5ba8c7e3",
                "x-rapidapi-host": "hotels4.p.rapidapi.com"
            }
        })
            .then((data4) => data4.json())
            .then((id) => generateHTML3(id))
        const generateHTML3 = (data4) => {
            var today=new Date();
            var html3=`<div>Your choosen holiday is on ${date}</div><br>`;
            if(today>mydate2){
                html3 += `<div>Cannot find hotel for holiday that have already passed</div>`
            }
            else {
                html3 += `<div>List of Hotels:</div>`
                var i = 0;
                for (i = 0; i < data4.data.body.searchResults.results.length; i++) {
                    html3 += `<li>${data4.data.body.searchResults.results[i].name}</li>`;
                }
            }
            const hotelsdiv=document.querySelector(".hotels")
            hotelsdiv.innerHTML=html3
        }
    }
}