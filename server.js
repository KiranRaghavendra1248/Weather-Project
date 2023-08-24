const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})
app.post("/", function(req, res){
    // Parse request
    const cityName = req.body.city
    // Generate response
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid=651143a12fd6220c7cc2477f473e5593&units=metric"
    console.log(url)
    https.get(url, (apiRes)=>{
        console.log(apiRes.statusCode)
        if(apiRes.statusCode === 404){
            res.send("City name not in database")
        }
        else{
            apiRes.on("data",(data)=>{
                const jsonObject = JSON.parse(data)
                console.log(jsonObject)
                const icon = jsonObject.weather[0].icon
                const iconUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png"

                res.write("<h1>Weather Application</h1>")
                res.write("<h2>The weather in "+ jsonObject.name+ " is "+ jsonObject.weather[0].description+" with " + jsonObject.main.temp +" degree C</h2>")
                res.write("<img src="+iconUrl+" alt='Icon'>")
                
            
                res.send()
            })
        }
    })   
})

app.listen(5000, function(){
    console.log("Server running on port 5000..")
})