function getUrlParams() {
  const url = window.location.search;
  const params = {};

  if (url.length === 0) {
    return params;
  }

  const queryString = url.substring(1);
  const pairs = queryString.split("&");

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1] || "");

    // Handle duplicate keys
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }

  return params;
}

// Example usage:
const params = getUrlParams();
const currentLanguage = params.language || "en-US";
// see languages supported here: https://stackoverflow.com/questions/14257598/what-are-language-codes-in-chromes-implementation-of-the-html5-speech-recogniti
console.log(currentLanguage);

// set up web speech class
class WebSpeech {
  constructor(lang) {
    // create speech recognition object
    const GlobalSpeechRecognition = webkitSpeechRecognition;
    this.speechRecognition = new GlobalSpeechRecognition();

    // handle config
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = lang;
    this.onresult = (result) => {
      console.log(`speech recognition has recorded: ${result}`);
    };
    this.shouldContinue = false;
    // recognition.interimResults = true;
    // recognition.maxAlternatives = 1;

    // setup ending event for continous listening
    const onEndCallback = () => {
      if (this.shouldContinue) {
        this.speechRecognition.start();
      }
    };
    this.speechRecognition.onend = onEndCallback.bind(this);

    // listen for results
    this.speechRecognition.onresult = ((event) => {
      const results = event.results;
      const newLine = results[results.length - 1][0].transcript;
      this.onresult(newLine);
    }).bind(this);
  }
  start() {
    this.speechRecognition.start();
    this.shouldContinue = true;
    console.log("speech started");
  }
  stop() {
    this.shouldContinue = false;
    this.speechRecognition.stop();
    console.log("speech ended");
  }
}

// // websocket
// const socket = new WebSocket('ws://localhost:3301')
// socket.onopen = ()=>{
//     socket.onmessage = ({data})=>{console.log(data)}
// }

const speech = new WebSpeech(currentLanguage);

// on result send socket to our node server
speech.onresult = (result) => {
  const newDiv = document.createElement("div");
  document.body.append(newDiv);
  newDiv.innerHTML += `Sending to node: ${result}`;
  // socket.send(`webSpeech_${result}`)
};

// start and stop events
document.getElementById("startButton").addEventListener("click", () => {
  speech.start();
});
document.getElementById("stopButton").addEventListener("click", () => {
  speech.stop();
});
