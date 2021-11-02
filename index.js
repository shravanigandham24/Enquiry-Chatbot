const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Payload } =require("dialogflow-fulfillment");
const app = express();
const fs = require('fs');
var PORT = 8080;
const path = require('path');
app.use(express.static('public'));


app.get("/", function (request, response){
    //show this file when the "/" is requested
    response.sendFile(__dirname+"/index.html");
});
app.get('/display',function(req,res){
  res.sendFile(path.join(__dirname+'/build.html'));
  
});
app.get('/pdf',function(req,res){
    res.sendFile(path.join(__dirname+'/build.pdf'));
    
  });




const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


app.post("/dialogflow", express.json(), (req, res) => {
    const agent = new WebhookClient({ 
		request: req, response: res 
        });

const client = new MongoClient(url,{useUnifiedTopology: true});


function welcome_note(agent)
{
    agent.add("Hello! Welcome to NGIT Placement Cell.");
    agent.add(" Enter the given passcode to continue.");
    
}

async function identify_company(agent)
{
    const Company_Passcode = agent.parameters.number
    try
    {
        await client.connect();
        const cursor = await client.db("college").collection("company_vistited").findOne({Company_Passcode: Company_Passcode});
        if (cursor == null) 
        {
            agent.add("Oops!! There is no such Company registered with this Passcode.\n Enter START to restart the conversation");
        }
        else
        {
            user_name=cursor.Company_Name;
            await agent.add("Welcome  "+user_name+"!!  \n Enter OK to continue");
        }
    }
    
    finally 
    {
        await client.close();
    }
}
    
async function get_third_year_details(agent)
{
    const ug_gpa = agent.parameters.ug_gpa
    const senior_secondary = agent.parameters.senior_secondary
    const tenth_gpa = agent.parameters.tenth_gpa
    const languages = agent.parameters.languages
    try
    {

        await client.connect();
        const databse = client.db("college");
        const collection = databse.collection("3rd_year");
        const query={Intermediate_Percantage:{$gt:senior_secondary},tenth_CGPA:{$gt:tenth_gpa},Avg_present_GPA:{$gt:ug_gpa},languages:languages};         
        const cursor = collection.find(query);
        const sendtofile = await collection.find(query).toArray();
        const num = await client.db("college").collection("3rd_year").countDocuments(query);
        if ((await cursor.count()) === 0) 
        {
            agent.add("There are no students based on given criteria");
        }
        else
        {
            
            fs.writeFileSync('data.json',JSON.stringify(sendtofile));
            if(num>1)
            {
                await agent.add("There are "+num+" students sorted based on given criteria");
                

                
                
            }
            else
            {
               await agent.add("There is "+num+" student sorted based on given criteria");
                
            }
            
            agent.add("Click the below link to view the selected student details");
            
            var payLoadData=
            {
                "richContent": 
                [
                    [
                        {
                            "type": "chips",
                            "options":
                            [
                                {
                                    "text": "View Student Details",
                                    "link": "http://localhost:8080/display"
                                }
                            ]
                        }
                    ]
                ]
            }
            agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
            

    
    
            

        }

    }
    finally {
        await client.close();
    }
    
    
}
async function get_fourth_year_details(agent)
{
    const ug_gpa = agent.parameters.ug_gpa
    const senior_secondary = agent.parameters.senior_secondary
    const tenth_gpa = agent.parameters.tenth_gpa
    const languages = agent.parameters.languages
    try
    {

        await client.connect();
        const databse = client.db("college");
        const collection = databse.collection("4th_year");
        const query={Intermediate_Percantage:{$gt:senior_secondary},tenth_CGPA:{$gt:tenth_gpa},Avg_present_GPA:{$gt:ug_gpa},languages:languages};
        const cursor = collection.find(query);
        const sendtofile = await collection.find(query).toArray();
        const num = await client.db("college").collection("4th_year").countDocuments(query);
        if ((await cursor.count()) === 0) 
        {
            agent.add("There are no students based on given criteria");
        }
        else
        {
            fs.writeFileSync('data.json',JSON.stringify(sendtofile));
            if(num>1)
            {
                await agent.add("There are "+num+" students sorted based on given criteria");
                
                
            }
            else
            {
                await agent.add("There is "+num+" student sorted based on given criteria");
                
            }
            agent.add("Click the below link to view the selected student details");
            var payLoadData=
            {
                "richContent": 
                [
                    [
                        {
                            "type": "chips",
                            "options":
                            [
                                {
                                    "text": "View Student Details",
                                    "link": "http://localhost:8080/display"
                                }
                            ]
                        }
                    ]
                ]
            }
            agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
            
            
        }

    }
    finally {
        await client.close();
    }
    
    
}
async function get_both_year_details(agent)
{
    const ug_gpa = agent.parameters.ug_gpa
    const senior_secondary = agent.parameters.senior_secondary
    const tenth_gpa = agent.parameters.tenth_gpa
    const languages = agent.parameters.languages
    try
    {

        await client.connect();
        const databse = client.db("college");
        const collection = databse.collection("both");
        const query={Intermediate_Percantage:{$gt:senior_secondary},tenth_CGPA:{$gt:tenth_gpa},Avg_present_GPA:{$gt:ug_gpa},languages:languages};
        const cursor = collection.find(query);
        const sendtofile = await collection.find(query).toArray();
        const num = await client.db("college").collection("both").countDocuments(query);
        if ((await cursor.count()) === 0) 
        {
            agent.add("There are no students based on given criteria")
        }
        else
        {
            fs.writeFileSync('data.json',JSON.stringify(sendtofile));
            if(num>1)
            {
                await agent.add("There are "+num+" students sorted based on given criteria");
               
                
            }
            else
            {
                await agent.add("There is "+num+" student sorted based on given criteria");
                
            }
            agent.add("Click the below link to view the selected student details");
            var payLoadData=
            {
                "richContent": 
                [
                    [
                        {
                            "type": "chips",
                            "options":
                            [
                                {
                                    "text": "View Student Details",
                                    "link": "http://localhost:8080/display"
                                }
                            ]
                        }
                    ]
                ]
            }
            agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
            

        }

    }
    finally {
        await client.close();
    }
    
    
}

    




var intentMap = new Map();
intentMap.set("Company_Name", identify_company);
intentMap.set("3rd_year",get_third_year_details);
intentMap.set("4th_year",get_fourth_year_details);
intentMap.set("both",get_both_year_details);
intentMap.set("Default_Welcome_Intent",welcome_note);



agent.handleRequest(intentMap);

});

//app.listen(process.env.PORT || 8080);
app.listen(PORT, function(err){ 
    if (err) console.log(err); 
    console.log("Server listening on PORT", PORT); 
}); 
        
        