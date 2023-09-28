//variables
let noChance = 0;
let audio_context;
let recorder;
let recording = 0;
const Wrapperspinner = document.querySelector("#wrapperSpinner");
const wrapperData = document.querySelector("#data-speech");
//write in the document
const sendDatatoDocumnt = (data) => {
  const { frase, speechText, score, indexValues } = data;
  const wrapperFrase = document.querySelector("#frase_response");
  const wrapperSpeech = document.querySelector("#speech");
  const wrapperScore = document.querySelector("#score");
  handleTraductionSpeechAlert();
  setTimeout(() => {
    disabledLoadingSpinner();
    sendStatuScore(score);
    setNewPhrease();
    wrapperFrase.innerHTML = `${frase}`;
    wrapperSpeech.innerHTML = `${speechText}`;
    wrapperScore.innerHTML = `${score} PTS.`;
    wrapperData.classList.add("active");
  }, 2000);
};
// colorScore
const sendStatuScore = (score) => {
  const wrapperScore = document.querySelector("#score");
  wrapperScore.classList.value = "text-score";
  if (score >= 70) {
    wrapperScore.classList.add("good");
  } else if (score <= 40) {
    wrapperScore.classList.add("bad");
  } else {
    wrapperScore.classList.add("medium");
  }
};
const enableLoadingSpinner = () => {
  Wrapperspinner.classList.add("active");
  const spinner = document.querySelector("#spinner");
  spinner.innerHTML = `<div class="double-bounce1"></div>
  <div class="double-bounce2"></div>`;
};
const disabledLoadingSpinner = () => {
  Wrapperspinner.classList.remove("active");
  const spinner = document.querySelector("#spinner");
  spinner.innerHTML = "";
};

const setNewPhrease = () => {
  if (noChance === 3) {
    noChance = 0;
  } else {
    noChance = noChance + 1;
  }
  const frase = document.querySelector("#frase");
  const stringArray = [
    "archi requete recontra rica",
    "tres tristes tigres tragaban trigo en un trigal",
    "pablito clavo un clavito en la calva de un calvito",
    "el ajo pico a la col la col picó al ajo ajo col caracol caracol col ajo",
  ];
  frase.innerHTML = stringArray[noChance];
};
//petición
const handlePost = async (data) => {
  try {
    const formData = new FormData();
    formData.append("noChance", noChance);
    formData.append("track", data);
    try {
      let response = await fetch("/audio", {
        method: "post",
        body: formData,
        headers: { enctype: "multipart/form-data" },
      });
      response = await response.json();
      sendDatatoDocumnt(response);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

function GetRecorder() {
  audioRecorder.requestDevice(
    function (recorderObject) {
      recorder = recorderObject;
    },
    { recordAsOGG: false }
  );
}

//función grabar
function startRecording(button) {
  recording = recording + 1;
  recorder.clear();
  recorder && recorder.record();
  button.disabled = true;
  button.nextElementSibling.disabled = false;
}

//función detener grabación
function stopRecording(button) {
  recorder && recorder.stop();
  button.disabled = true;
  button.previousElementSibling.disabled = false;
  enableLoadingSpinner();
  createRecordAudio();
}

//Función exportar audio
function createRecordAudio() {
  recorder.exportWAV(function (blob) {
    console.log(blob);
    handlePost(blob);
  });
}

//función que se debe realizar al cargar la página.
window.onload = function init() {
  handleInfoAlert(GetRecorder);
};
