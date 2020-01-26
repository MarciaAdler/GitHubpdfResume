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
        var queryURL = "https://api.github.com/users/" + username;
        axios.get(
            queryURL,
        ).then(function(response){
            console.log(response);
            var conversion = convertFactory({
                converterPath: convertFactory.converters.PDF
              });
               
              conversion({ html: createHTML(response, backgroundColor) }, function(err, result) {
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
    function createHTML(response, color) {
        var htmlPage = `<!DOCTYPE html>
        <html lang="en"></html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <script
            src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
            crossorigin="anonymous"></script>
            <style>


        html{
            text-align: center;
            background-color: ${color};
        }
        
        #top {
            background-color:purple;
            margin: 50px 100px -10px 100px;;
            padding-bottom: 30px;
            color: white;
            
        }

        #wrapper {
            background-color: white;
            overflow:auto;
            padding-top:30px;
        }

        .boxes {
            background-color: purple;
            color:white;
            width: 40%;
            float:left;
            margin: 20px;
        }
            </style>

        </head>
        <body>
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
                    <div class="boxes" id="repositories">Public Repositories ${response.data.public_repos}</div>
                    <div class="boxes" id="followers">Followers ${response.data.followers}</div>
                    <div class="boxes" id="github-stars">GitHub Stars ${response.data.public_gists}</div>
                    <div class="boxes" id="following">Following ${response.data.following}</div>
                </section>
            </div> 
            <script type="text/javascript" src="index.js"></script>  
        </body>
        </html>`
        return htmlPage
    }