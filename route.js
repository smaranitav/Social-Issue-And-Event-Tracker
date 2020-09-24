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
