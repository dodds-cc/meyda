var context = new AudioContext();
var tune = new Audio('test.mp3');
tune.play();
var source = context.createMediaElementSource(tune);

function meme(data) {
	//console.log(data);
}
var options = {
  "audioContext":context, // required
  "source":source, // required
  "bufferSize": 512, // required
  "windowingFunction": "hamming", // optional
  "featureExtractors": ["lufs"], // optional - A string, or an array of strings containing the names of features you wish to extract.
  "callback": meme // optional callback in which to receive the features for each buffer
}

var meydaAnalyzer = Meyda.createMeydaAnalyzer(options);
meydaAnalyzer.start(options.featureExtractors);
//console.log(meydaAnalyzer);