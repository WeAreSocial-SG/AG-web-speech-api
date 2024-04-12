// set up web speech class
class WebSpeech{
  constructor(){
    // create speech recognition object
    const GlobalSpeechRecognition = webkitSpeechRecognition
    this.speechRecognition = new GlobalSpeechRecognition()

    // handle config
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.onresult = (result)=>{console.log(`speech recognition has recorded: ${result}`)}
    this.shouldContinue = false;
    // recognition.interimResults = true;
    // recognition.maxAlternatives = 1;

    // setup ending event for continous listening
    const onEndCallback = ()=>{
      if(this.shouldContinue){
        this.speechRecognition.start()
      }
    }
    this.speechRecognition.onend = onEndCallback.bind(this)

    // listen for results
    this.speechRecognition.onresult = ((event)=>{
        const results = event.results;
        const newLine = results[results.length - 1][0].transcript
        this.onresult(newLine)
    }).bind(this)
  }
  start(){
    this.speechRecognition.start();
    this.shouldContinue = true;
    console.log("speech started")
  }
  stop(){
    this.shouldContinue = false;
    this.speechRecognition.stop();
    console.log("speech ended")
  }
}


//  ----------- setup websocket
let socket;
const elConnectButton = document.getElementById("connectButon");
elConnectButton.addEventListener('pointerdown', ()=>{
  // get url
  const url = document.getElementById("inputUrl").value;
  // connect
  // let socket = new WebSocket('ws://localhost:3301')
  let socket = new WebSocket(url)
  socket.onopen = ()=>{
    socket.send("h3llo")
    socket.onmessage = ({data})=>{console.log(data)}
  }
})



// ------------ setup speech
const speech = new WebSpeech();

// on result send socket to our node server
speech.onresult = (result)=>{
  const newDiv = document.createElement('div')
  document.body.append(newDiv)
  newDiv.innerHTML += `Sending to node: ${result}`
  socket.send(`webSpeech_${result}`)
}

// start and stop events
document.getElementById("startButton").addEventListener('click', ()=>{
  speech.start()
})
document.getElementById("stopButton").addEventListener('click', ()=>{
  speech.stop()
})
