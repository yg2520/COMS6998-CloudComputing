function submit(){
var apigClient = apigClientFactory.newClient({
	  accessKey: '',
  	secretKey: '',
    apiKey: ''
});
var params = {
  // This is where any modeled request parameters should be added.
  // The key is the parameter name, as it is defined in the API in API Gateway.
};

var body = {
  // This is where you define the body of the request,
  "input": document.getElementById('msg_content').value
};

apigClient.chatbotPost(params, body)
    .then(function(result){
      // Add success callback code here.
      console.log('success');
      console.log(result.data.body);
      if (document.getElementById('answer1').innerHTML.length==0){
        document.getElementById('question1').innerHTML = document.getElementById('msg_content').value;
        document.getElementById('question1').style.backgroundColor='#C0D9D9';
        document.getElementById('answer1').innerHTML = result.data.body;
        document.getElementById('answer1').style.backgroundColor='#FFFFFF';
      } else if (document.getElementById('answer2').innerHTML.length==0){
        document.getElementById('question2').innerHTML = document.getElementById('msg_content').value;
        document.getElementById('question2').style.backgroundColor='#C0D9D9';
        document.getElementById('answer2').innerHTML = result.data.body;
        document.getElementById('answer2').style.backgroundColor='#FFFFFF';
      } else if (document.getElementById('answer3').innerHTML.length==0){
        document.getElementById('question3').innerHTML = document.getElementById('msg_content').value;
        document.getElementById('question3').style.backgroundColor='#C0D9D9';
        document.getElementById('answer3').innerHTML = result.data.body;
        document.getElementById('answer3').style.backgroundColor='#FFFFFF';
      } else{
        document.getElementById('question4').innerHTML = document.getElementById('msg_content').value;
        document.getElementById('question4').style.backgroundColor='#C0D9D9';
        document.getElementById('answer4').innerHTML = result.data.body;
        document.getElementById('answer4').style.backgroundColor='#FFFFFF';
      }
      

    }).catch( function(result){
      // Add error callback code here.
      console.log('fail');
    });
}
