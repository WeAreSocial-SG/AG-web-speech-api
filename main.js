class WebSpeech{
  constructor(){
    // create speech recognition object
    const GlobalSpeechRecognition = webkitSpeechRecognition
    this.speechRecognition = new GlobalSpeechRecognition()

    // handle config
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = "en-US";
    this.onresult = (result)=>{console.log(`speech recognition has recorded: ${result}`)}
    // recognition.interimResults = true;
    // recognition.maxAlternatives = 1;

    // setup ending event for continous listening
    const onEndCallback = ()=>{
      this.speechRecognition.start()
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
    console.log("speech started")
  }
}
const speech = new WebSpeech();
speech.start();

speech.onresult = (result)=>{
  const newDiv = document.createElement('div')
  document.body.append(newDiv)
  newDiv.innerHTML += `Sending to cinder: ${result}`
}


