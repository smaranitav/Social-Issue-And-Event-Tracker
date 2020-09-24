var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/communitydb", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
app.get('/', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.sendFile("/Desktop/SuSmars/mymean/public/communitypg.html" );  
})

app.get('/communitypg.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "communitypg.html" );    
}) 
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/issue_insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "issue_insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): Reporter :"+req.body.e_name+" Reported time :"+req.body.e_time+" Issue description :"+req.body.e_description+" Issue date :"+req.body.e_date);
		// Submit to the DB
  	var issue_reporter = req.body.e_name;
  	var issue_time = req.body.e_time;
  	var issue_description = req.body.e_description;
  	var issue_date = req.body.e_date;
  	var issue_assignee="John James"; //By default, issue is assigned to this person to resolve

	db.collection('issues').insert({reporter:issue_reporter,time:issue_time,description:issue_description,date:issue_date,assignee:issue_assignee});
    res.send('Issue Reported-->'+issue_reporter+' assignee is '+issue_assignee);
    res.end();
    /*Sending the respone back to the angular Client */
});

//--------------UPDATE------------------------------------------
app.get('/issue_update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "issue_update.html" );
})

app.get("/updateissue", function(req, res) {
  //update the assignee of the issue
	var reporter_name=req.query.issue_reporter;
	var assignee_name=req.query.issue_assignee;
    
	db.collection('issues', function (err, data) {
        data.update({"reporter":reporter_name},{$set:{"assignee":assignee_name}},
            function(err, result){
				if (err) {
					console.log("Failed to update data.");
			} else {
				res.send('<h4>Issue Record Updated for '+reporter_name+'<br> Issue Assigned to '+assignee_name+'</h4>');
				console.log("Issue Updated")
			}
        });
    });
})	
//--------------SEARCH------------------------------------------
app.get('/issue_search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "issue_search.html" );    
})

app.get("/searchissue", function(req, res) {
	var issue_description=req.query.issue_description;
    db.collection('issues').find({description:issue_description}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
	res.send("No such issues found");
    } else {
	res.status(200).json(docs);
      res.send("<h4>Issue name is "+doc.description+"<br>Assigned to "+doc.assignee);
    }
  });
  });
  

//--------------DELETE------------------------------------------
app.get('/issue_delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "issue_delete.html" );    
})

app.get("/deleteissue", function(req, res) {
	var issue_description=req.query.issue_description;
	db.collection('issues', function (err, data) {
        data.remove({"description":issue_description}, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				res.send('<h4>Issue Deleted for '+issue_description+'</h4>');
				console.log("Issue Deleted")
			}
        });
    });
    
  });


app.get('/displayissues', function (req, res) { 
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('issues').find().sort({issue:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('issue_disp.ejs',{issues: i})  
     })
})

app.get('/event_insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "event_insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post2', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are (POST): Event name :"+req.body.e_name+" Event description :"+req.body.e_desc+"Event date :"+req.body.e_date+" Event venue :"+req.body.e_venue);
		// Submit to the DB
  	var e_name = req.body.e_name;
  	var e_desc = req.body.e_desc;
  	var e_venue = req.body.e_venue;
  	var e_date = req.body.e_date;
  	var e_limit=200; // default limit for an event is 200 people

	db.collection('events').insert({ename:e_name,edesc:e_desc,evenue:e_venue,edate:e_date,elimit:e_limit});
    res.send('Event Record Inserted-->'+e_name);
    res.end();
    /*Sending the response back to the angular Client */
});

//--------------UPDATE------------------------------------------
app.get('/event_update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "event_update.html" );
})

app.get("/updateevent", function(req, res) {
	var e_name=req.query.e_name;
	var e_venue=req.query.e_venue;
  // change venue of an event
	db.collection('events', function (err, data) {
        data.update({"ename":e_name},{$set:{"evenue":e_venue}},
            function(err, result){
				if (err) {
					console.log("Failed to update data.");
			} else {
				res.send('<h4>Event Updated for '+e_name+'<br> Venue is '+e_venue+'</h4>');
				console.log("Event Updated")
			}
        });
    });
})	
//--------------SEARCH------------------------------------------
app.get('/event_search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "event_search.html" );    
})

app.get("/searchevent", function(req, res) {
	
	var e_name=req.query.e_name;
    db.collection('events').find({ename:e_name}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
      res.send("<h4>Event name is "+doc.ename+"<br>Venue is "+doc.evenue+"<br>Date is "+doc.edate);
    }
  });
  });
  

//--------------DELETE------------------------------------------
app.get('/event_delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "event_delete.html" );    
})

app.get("/deleteevent", function(req, res) {
	var e_name=req.query.e_name;
	db.collection('events', function (err, data) {
        data.remove({"ename":e_name}, function(err, result){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				res.send('<h4>Event Deleted for '+e_name+'</h4>');
				console.log("Event Deleted")
			}
        });
    });
    
  });


app.get('/displayevent', function (req, res) { 
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('events').find().sort({ename:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('events_disp.ejs',{events: i})  
     })

}) 


var server = app.listen(5005, function () {  
var host = server.address().address  
  var port = server.address().port  
console.log("Social Issues Reporting app listening at http://%s:%s", host, port)  
})  
}
else
{   db.close();  }
  
});
