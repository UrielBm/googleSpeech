const multer = require("multer");
// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const fs = require("fs");
const stringArray = [
  "archi requete recontra rica",
  "tres tristes tigres tragaban trigo en un trigal",
  "pablito clavo un clavito en la calva de un calvito",
  "el ajo pico a la col la col picó al ajo ajo col caracol caracol col ajo",
];
class audioController {
  getFrase = (number) => {
    const frase = stringArray[number];
    return frase;
  };
  getSpeechToText = async (data) => {
    try {
      // Creates a google client
      const client = new speech.SpeechClient();
      const audio = {
        content: data,
      };
      //config audio
      const config = {
        encoding: "LINEAR16",
        sampleRateHertz: 48000,
        languageCode: "es-MX",
      };
      //request data to Api speech google
      const request = {
        audio: audio,
        config: config,
      };

      // Detects speech in the audio file
      const [response] = await client.recognize(request);
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");
      return transcription;
    } catch (error) {
      const speechText = "archi requete compa rica";
      return speechText;
    }
  };
  getScoreToSpeech(frase, speech) {
    // intanciando valiables.
    const lengthFrase = frase.length;
    const fraseLower = frase.toLowerCase();
    const speechLower = speech.toLowerCase();
    const arrayFrase = [...fraseLower];
    const arraySpeech = [...speechLower];
    let indexValues = [];
    let score;

    if (fraseLower === speechLower) {
      score = 100;
    } else {
      indexValues = arrayFrase.map((letter, index) => {
        return letter !== arraySpeech[index] && index;
      });
      indexValues = indexValues.filter((status) => status !== false);
      score = 100 - (indexValues.length * 100) / lengthFrase;
    }
    return {
      indexValues,
      score,
    };
  }
  async GetAudio(req, res, next) {
    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      limits: {
        fields: 1,
        fileSize: 600000000,
        files: 1,
        parts: 3,
      },
    });
    upload.single("track")(req, res, async () => {
      try {
        //Data from post
        const { noChance } = req.body;
        const file = req.file.buffer;

        //Get dataAudio and frase
        const audioBytes = file.toString("base64");
        const frase = this.getFrase(noChance);

        //Transform audio to text
        const speechText = await this.getSpeechToText(audioBytes);
        // const speechText = "archi requete compa rica";
        const { score, indexValues } = this.getScoreToSpeech(frase, speechText);
        const response = {
          frase,
          speechText,
          score,
          indexValues,
        };
        res.json(response);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
module.exports = audioController;
