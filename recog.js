//Calls DetectFaces API and shows estimated ages of detected faces

function DetectFaces(imageData) {
  AWS.region = " ";
  var rekognition = new AWS.Rekognition();
  var params = {
    Image: {
      Bytes: imageData
    },
    Attributes: [
      'ALL',
    ]
  };
  rekognition.detectFaces(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
     var table = "<table><tr><th>Happy</th><th>Sad</th><th>Calm</th><th>Angry</th><th>Confused</th></tr>";
      // show each face and build out estimated age table
      for (var i = 0; i < data.FaceDetails.length; i++) {
        for (var j=0; j<data.FaceDetails[i].Emotions.length; j++) {
          if (data.FaceDetails[i].Emotions[j].Type=="HAPPY"){
            var happyScore = data.FaceDetails[i].Emotions[j].Confidence.toFixed(2);
          }
          if (data.FaceDetails[i].Emotions[j].Type=="SAD"){
            var sadScore = data.FaceDetails[i].Emotions[j].Confidence.toFixed(2);
          }
          if (data.FaceDetails[i].Emotions[j].Type=="CALM"){
            var clamScore = data.FaceDetails[i].Emotions[j].Confidence.toFixed(2);
          }
          if (data.FaceDetails[i].Emotions[j].Type=="ANGRY"){
            var angryScore = data.FaceDetails[i].Emotions[j].Confidence.toFixed(2);
          }
          if (data.FaceDetails[i].Emotions[j].Type=="CONFUSED"){
            var confusedScore = data.FaceDetails[i].Emotions[j].Confidence.toFixed(2);
          }
        }
        table += '<tr><td>' + happyScore + '</td><td>' + sadScore + '</td><td>' + clamScore + '</td><td>' + angryScore + '</td><td>' + confusedScore + '</td></tr>';
        var hs=happyScore/100;
        console.log(hs);
        httpGet(hs);
        redarLoad(happyScore, sadScore, clamScore, angryScore, confusedScore);     
      }
      table += "</table>";
      document.getElementById("opResult").innerHTML = table;
    }
  });
}
//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage() {
  AnonLog();
  var control = document.getElementById("fileToUpload");
  var file = control.files[0];

  // Load base64 encoded image 
  var reader = new FileReader();

  // 将文件以Data URL形式进行读入页面
  //console.log(reader);

  reader.onload = (function (theFile) {
    return function (e) {
      var img = document.createElement('img');
      var image = null;
      img.src = e.target.result;

      document.getElementById("image").innerHTML = '<img height="350" width="350" src ="'+img.src+'"/>';

      var jpg = true;
      try {
        image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

      } catch (e) {
        jpg = false;
      }
      if (jpg == false) {
        try {
          image = atob(e.target.result.split("data:image/png;base64,")[1]);
        } catch (e) {
          alert("Not an image file Rekognition can process");
          return;
        }
      }

      //unencode image bytes for Rekognition DetectFaces API 
      var length = image.length;
      imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
      }
      //Call Rekognition  
      DetectFaces(imageBytes);
    };
  })(file);
  reader.readAsDataURL(file);
  

}

function redarLoad(happyScore, sadScore, clamScore, angryScore, confusedScore){
    var players = [
        { player: "User1",Happy: happyScore, Sad: sadScore, Calm: clamScore, Angry: angryScore, Confused: confusedScore}, 
    ]; 
    var team = {
        Happy: 100,
        Sad: 100,
        Calm: 100,
        Angry: 100,
        Confused: 100,
    };
    var labels = [
        [0, "Happy"],
        [1, "Sad"],
        [2, "Calm"],
        [3, "Angry"],
        [4, "Confused"] 
    ];
    var get_player = function(name) {
           for (var i=0; i<players.length; i++) {
               if (players[i].player === name) return players[i];
           } 
    } 
    var player_data = function(name) { 
        var obj = {}, i = 0;
        obj.label = name; 
        obj.data = []; 
        for (var key in team) {
            obj.data.push([i, get_player(name)[key]]); 
            i++; 
        };
        return obj; 
    };

    //window.onload = function(){
        Flotr.draw(
            document.getElementById("chart"), 
            [
                player_data("User1")
            ],{
                title:"Emotion Analysis",
                radar:{show:true},
                legend:{show:false},
                grid:{circular:true,},
                xaxis:{ticks:labels, fontSize:15},
                yaxis:{showLabels:false,min:0,max:100},
            }
        )
    //}
}

//Provides anonymous log on to AWS services
function AnonLog() {
  
  // Configure the credentials provider to use your identity pool
  AWS.config.region = ''; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '',
  });
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
  });
}

function httpGet(happyScore)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://c1yoy0a9j5.execute-api.us-east-1.amazonaws.com/beta/search?happy='+happyScore, false); // false for synchronous request
    xmlHttp.send();
    console.log(xmlHttp.responseText);
    var musicJson = JSON.parse(xmlHttp.response);
    console.log(musicJson.tracks);
    //console.log(musicJson.tracks[0].album.uri.substring(0));
    var album1 = musicJson.tracks[0].album.uri.substring(14);
    document.getElementById("music1").innerHTML = '<iframe src="https://open.spotify.com/embed/album/'+album1+'" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    var album2 = musicJson.tracks[1].album.uri.substring(14);
    document.getElementById("music2").innerHTML = '<iframe src="https://open.spotify.com/embed/album/'+album2+'" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    var album3 = musicJson.tracks[2].album.uri.substring(14);
    document.getElementById("music3").innerHTML = '<iframe src="https://open.spotify.com/embed/album/'+album3+'" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    
    //return xmlHttp.responseText;

}
