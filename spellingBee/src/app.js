import Speech from "speak-tts";

const _addVoicesList = voices => {
  const list = window.document.createElement("div");
  let html =
    '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>';
  voices.forEach(voice => {
    html += `<option value="${voice.lang}" data-name="${voice.name}">${
      voice.name
    } (${voice.lang})</option>`;
  });
  list.innerHTML = html;
  window.document.body.appendChild(list);
};

const _wordsToSpell = [
    'rat',
    'bat',
    'population',
    'gentleman',
    'physician',
    'earthquake',
    'appreciation',
    'permission',
    'imagination',
    'noticable'
];

let scoreCount =0;
let wordIndex=0;
function _init() {
  const speech = new Speech();
  speech
    .init({
      volume: 0.5,
      lang: "en-GB",
      rate: 1,
      pitch: 1,
      //'voice':'Google UK English Male',
      //'splitSentences': false,
      listeners: {
        onvoiceschanged: voices => {
          console.log("Voices changed", voices);
        }
      }
    })
    .then(data => {
      console.log("Speech is ready", data);
      _addVoicesList(data.voices);
      _prepareSpeakButton(speech);
    })
    .catch(e => {
      console.error("An error occured while initializing : ", e);
    });
  const text = speech.hasBrowserSupport()
    ? "Hurray, your browser supports speech synthesis"
    : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !";
  document.getElementById("support").innerHTML = text;
}

function _prepareSpeakButton(speech) {
  const speakButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const resumeButton = document.getElementById("resume");
  const startTrainingButton = document.getElementById("startMyTraining");
  const submitAnswerButton=document.getElementById("submitAnswer");
  const inputAnswer=document.getElementById("inputAnswer");

  const textarea = document.getElementById("text");
  const languages = document.getElementById("languages");

  let currentWordToSpell = "cat";
  submitAnswer.disabled=true;

  speakButton.addEventListener("click", () => {
    const language = languages.value;
    const voice = languages.options[languages.selectedIndex].dataset.name;
    if (language) speech.setLanguage(languages.value);
    if (voice) speech.setVoice(voice);
    speech
      .speak({
        text: textarea.value,
        queue: false,
        listeners: {
          onstart: () => {
            console.log("Start utterance");
          },
          onend: () => {
            console.log("End utterance");
          },
          onresume: () => {
            console.log("Resume utterance");
          },
          onboundary: event => {
            console.log(
              event.name +
                " boundary reached after " +
                event.elapsedTime +
                " milliseconds."
            );
          }
        }
      })
      .then(data => {
        console.log("Success !", data);
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });
  });

  pauseButton.addEventListener("click", () => {
    speech.pause();
  });

  resumeButton.addEventListener("click", () => {
    speech.resume();
  });

  submitAnswerButton.addEventListener("click",()=>{
    if(inputAnswer.value.toLowerCase()==currentWordToSpell.toLocaleLowerCase())
    {
        if(scoreCount % 2 === 0){
            console.log('odd score');
        speech
      .speak({
        text: "Very Good my Friend. Now for the next word",
        queue:false})
        setTimeout(2000,{})
      }
      else{
        console.log('even score');
        speech
        .speak({
          text: "Great Going buddy. Your current score is :"+scoreCount+"points. Next word coming up",
          queue:false})
      }
        scoreCount++;
        setNextWord();
    }
    else{
        speech
        .speak({
          text: "Sorry That was an Incorrect Answer. Try Again!",
          queue:false})

          inputAnswer.style.backgroundColor = "red";
    }

  });

  function setNextWord(){
    inputAnswer.value = "";
    inputAnswer.style.backgroundColor = "white";
      if(wordIndex>=_wordsToSpell.length)
      {
        speech
        .speak({
          text: "You have completed Training for all the words today. Your Final score is "+scoreCount+" points",
          queue:false})
      }
      else
      {
        currentWordToSpell=_wordsToSpell[wordIndex];
        speech
        .speak({
          text: "Ready for Next Word..., spell "+currentWordToSpell,
          queue:false})
      }
    wordIndex++;
  };
  startTrainingButton.addEventListener("click",()=>{
    speech
      .speak({
        text: "Spell "+currentWordToSpell,
        queue: false,
        listeners: {
          onstart: () => {
            submitAnswer.disabled=true;
            console.log("Start utterance");
          },
          onend: () => {
            console.log("End utterance");
          },
          onresume: () => {
            console.log("Resume utterance");
          },
          onboundary: event => {
            console.log(
              event.name +
                " boundary reached after " +
                event.elapsedTime +
                " milliseconds."
            );
          }
        }
      })
      .then(data => {
        console.log("Success !", data);
        submitAnswer.disabled=false;
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });
   
  })
}

_init();
