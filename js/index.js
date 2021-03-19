function setCurrent(currentVals,cname){
    const mwc = document.createElement("div");
    mwc.classList.add("main-weather-card");
    const sub = document.createElement("div");
    sub.classList.add("sub");
    const temp = document.createElement("div");
    temp.classList.add("temp");
    temp.innerText = currentVals.temp_c+" C";
    const city = document.createElement("div");
    city.classList.add("city");
    city.innerText = cname;
    const wind = document.createElement("div");
    wind.classList.add("wind");
    wind.innerText = currentVals.gust_kph;
    const temp_pic = document.createElement("div");
    temp_pic.classList.add("temp-pic")
    let code = currentVals.condition.icon.split("/")
    code = code[code.length-1];
    code = parseInt(code.split(".")[0]);
    temp_pic.classList.add("p_"+code);
    sub.append(temp);
    sub.append(city);
    sub.append(wind);
    mwc.append(sub);
    mwc.append(temp_pic);
    return mwc;
}

function createForecast(f){
    const card = document.createElement("div");
    card.classList.add("card");


    const temp_pic = document.createElement("div");
    temp_pic.classList.add("temp-pic");
    let code = f.day.condition.icon.split("/");
    code = code[code.length-1];
    code = parseInt(code.split(".")[0])
    temp_pic.classList.add("p_"+code);

    const temp = document.createElement("div");
    temp.classList.add("temp");
    temp.innerText = f.day.avgtemp_c;

    const d = document.createElement("div");
    d.classList.add("date");
    d.innerText = f.date;

    card.append(temp_pic)
    card.append(temp)
    card.append(d)

    return card;

}

function setForecast(forecast){
    const fcast = document.createElement("div");
    fcast.classList.add("forecast");


    const head = document.createElement("div");
    head.classList.add("head");
    const main_txt = document.createElement("div");
    main_txt.classList.add("main-txt");
    main_txt.innerText = "Forecast";
    head.append(main_txt);

    fcast.append(head);

    const cards = document.createElement("div");
    cards.classList.add("cards");

    forecast.forecastday.forEach((e)=>{
        cards.append(createForecast(e));
    })

    fcast.append(cards);

    return fcast;

}



window.navigator.geolocation.getCurrentPosition((e)=>{
    const lat = e.coords.latitude,lon = e.coords.longitude;
    const API_KEY = "YOUR API KEY"
    const url = "http://api.weatherapi.com/v1/forecast.json?key="+API_KEY+"&q="+lat+","+lon+"&days=5&aqi=no&alerts=no";
    const x = new XMLHttpRequest();
    x.onreadystatechange = (e)=>{
        if(x.readyState===4&&x.status===200){
            const main = document.querySelector(".main");
            const data = JSON.parse(x.responseText)
            main.querySelector(".loader").remove();
            main.append(setCurrent(data.current,data.location.name));
            main.append(setForecast(data.forecast));
        }
        else if(x.status===404){
            window.alert("Unable to connect!:(");
            document.querySelector(".main .loader").classList.add("error");
            document.querySelector(".main .loader").title = "Error!";
        }
    }
    x.open("GET",url,true);
    x.setRequestHeader("Access-Control-Allow-Origin","*")
    x.send();
},()=>{
    window.alert("Unable to fetch location!:(");
    document.querySelector(".main .loader").classList.add("error");
    document.querySelector(".main .loader").title = "Error!";
})