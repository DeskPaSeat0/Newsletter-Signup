const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { parse } = require("path");
const PORT = process.env.PORT || 3030;


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log("Server is running on Port ${PORT}");
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const eAdd = req.body.emailAddress;

    var data = {
        members: [
            {
                email_address: eAdd,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/6b07e014e5";

    const options = {
        method: "POST",
        auth: "carson925:dc6ead7fe576c09ee9d34ab29167347f-us21"
    }

    const request = https.request(url, options, function(response){

        response.on("data", function(data){
            receivedData = JSON.parse(data);

            if(receivedData.error_count != 0){
                res.sendFile(__dirname + "/failure.html");
            }
            else
            {
                res.sendFile(__dirname + "/success.html");
            }

            console.log(receivedData);
        });
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

//API Key
//dc6ead7fe576c09ee9d34ab29167347f-us21

//List ID
//6b07e014e5