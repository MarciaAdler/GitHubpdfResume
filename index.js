var fs = require("fs");
var inquirer = require("inquirer");
var axios = require("axios");
var convertFactory = require('electron-html-to')
inquirer
    .prompt([
        {
            type: "input",
            message: "What is your GitHub username?",
            name: "name" 
        },

        {
            type: "list",
            name: "color",
            message: "what is your favorite color?",
            choices: ["blue","grey","pink","green"]
        }

    ])
    .then(function(data) {
        var username = data.name;
        var backgroundColor = data.color;
        console.log(backgroundColor);
        var queryURL = "https://api.github.com/users/" + username;
        axios.get(
            queryURL,
        ).then(function(response){
            const queryURL = "https://api.github.com/users/" + username + "/repos"
            axios.get(
                queryURL,
            ).then(function(stars){
                let starsArr = stars.data;
                let starCount = 0;
                starsArr.forEach(stars => {
                    starCount += stars.stargazers_count;
                }) 
                console.log(starCount);
                var conversion = convertFactory({
                    converterPath: convertFactory.converters.PDF
                });
                
                conversion({ html: createHTML(response, backgroundColor, starCount) }, function(err, result) {
                    if (err) {
                    return console.error(err);
                    }
                    console.log(result.numberOfPages);
                    console.log(result.logs);
                    result.stream.pipe(fs.createWriteStream(`./${username}.pdf`));
                    conversion.kill();
                })
            })
        })

        
    })
    function createHTML(response, color, starCount) {
       console.log(starCount);
        var htmlPage = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <style>
        
        * {
            -webkit-print-color-adjust:exact !important; 
        }

        body {
            
            text-align: center;
            background-color: ${color};
        }
        
        #background {
            height: 1100px;
            background-color: ${color};
            padding-top: 50px;
            width: 1000px;
            margin:0;
        }
        
        #top {
            background-color:lightblue;
            margin: 50px 100px -10px 100px;
            padding-bottom: 50px;
            color: white;
            border-radius: 1rem;
        }
        #picture {
            height: 200px;
            width: auto;
            border-radius: 15rem;
        }
        #wrapper {
            background-color: white;
            padding-top:10px;
            height:auto;
            overflow: auto;
            padding-bottom: 30px;
        }

        .boxes {
            background-color: #808080;
            color:white;
            width: 30%;
            float:left;
            margin-right: 50px;
            margin-left: 90px;
            margin-top: 30px;
            margin-bottom: 20px;
            height: 75px;
            padding-top: 20px;
            border-radius: .3em; 
            font-size: 1.3em;
        }
        
       
            </style>

        </head>
        <body id="container">
            <div class="container" id="background">
                 <div id="top">
                    <img id="picture" src='${response.data.avatar_url}'/>
                    <h1>Hi!</h1>
                    <h2 id="my-name">My name is ${response.data.name}</h2>
                    <a href='${response.data.url}'>GitHub</a>
                    <a href='${response.data.location}'>${response.data.location}</a>
                    <a href='${response.data.blog}'>Blog</a>
                    
                    
                </div>
                <section id="wrapper">
                    <h3 id="user-bio">${response.data.bio}</h3>
                    <div class="boxes" id="repositories">Public Repositories<br>${response.data.public_repos}</div>
                    <div class="boxes" id="followers">Followers<br>${response.data.followers}</div>
                    <div class="boxes" id="github-stars">GitHub Stars<br>${starCount}</div>
                    <div class="boxes" id="following">Following<br>${response.data.following}</div>
                </section>
            </div> 
            
        </body>
        </html>`
        
        return htmlPage
        
    }