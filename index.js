const port = 8000
const express = require('express');
var cors = require('cors')
var app = express()
app.use(cors())
app.use(express.json());

app.post('/translate/normal', (req, res) => {
    if(req.body.text === undefined){
        res.json({"msg":"text field can't be empty!"});
    }
    const rovarsprak = translateTorovarsprak(req.body.text);
    res.json({
        text: rovarsprak
    });
})

app.post('/translate/rovarsprak', (req, res) => {
    if(req.body.text === undefined){
        res.json({"msg":"text field can't be empty!"});
    }
    const normal = translateToNormal(req.body.text);
    res.json({
        text: normal
    });
})


app.get('/jokeOfTheDay', (req, response) => {
    const https = require("https");

    const baseURL = "https://v2.jokeapi.dev";
    const categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
    const params = [
        "blacklistFlags=nsfw,religious,racist",
        "idRange=0-100"
    ];

    https.get(`${baseURL}/joke/${categories.join(",")}?${params.join("&")}`, res => {
        res.on("data", chunk => {
            let randomJoke = JSON.parse(chunk.toString());
            if (randomJoke.type == "single") {
                const translatedJoke = translateTorovarsprak(randomJoke.joke);
                response.send(translatedJoke);

            } 
            else {
             
                setTimeout(() => {
                    const translatedJokeSetup = translateTorovarsprak(randomJoke.setup);
                    const translatedJokeDelivery = translateTorovarsprak(randomJoke.delivery);
                    const fullJoke = translatedJokeSetup + " \n" + translatedJokeDelivery;
                    response.send(fullJoke);

                }, 3000);
            }
        });

        res.on("error", err => {
            console.error(`Error: ${err}`);
        });
    });


})

const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j','k', 'l', , 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

function translateTorovarsprak(text) {
   
    let len = text.length;
    let res = "";

    for (let i = 0; i < len; i++) {

        if (consonants.indexOf(text[i].toLowerCase()) === -1) {
            res = res + text[i];
        }
        else {
            res = res + text[i] + 'o' + text[i];
        }
    }

    return res;
}


function translateToNormal(text) {
  
    let len = text.length;
    let res = "";

    for (let i = 0; i < len; i++) {

        if (consonants.indexOf(text[i].toLowerCase()) === -1) {
            res = res + text[i];
        }

        else {
            res = res + text[i];
            i = i + 2;
        }
    }

    return res;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})