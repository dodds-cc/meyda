export function main(args) {
  if (typeof args.ampSpectrum !== 'object' ||
         typeof args.barkScale !== 'object') {
    throw new TypeError();
  }
  //console.log('the lufs extractor has been called and initted with the following args');
  //console.log(args);

  //push samples into the global bucket
  var inputSignal = args.ampSpectrum;

  for (var i = 0; i < args.globalBuckets.momentaryBucketArray.length; i++) {
    if (args.globalBuckets.momentaryBucketCount === 0) {
      args.globalBuckets.momentaryBucketCount = args.globalBuckets.momentaryBucketArray.length;
    }
    args.globalBuckets.momentaryBucketArray[args.globalBuckets.momentaryBucketCount] = args.signal[i];
    //this.bin400Left[this.momentaryCount] = 0.1369; //-18
    //this.bin400Right[this.momentaryCount] = 0.1369; //-18
    //this.bin400Left[this.momentaryCount] = 0.068; //-24
    //this.bin400Right[this.momentaryCount] = 0.068; //-24
    // this.bin400Left[this.momentaryCount] = 0.0044; //-48
    // this.bin400Right[this.momentaryCount] = 0.0044; //-48
    args.globalBuckets.momentaryBucketCount -= 1;
    //console.log(i);
  }

  function log10(val) {
    return Math.log(val) / Math.LN10;
  }

//   function returnMomentaryLUFS() {
//     var sumOfBin400 = 0;
//     var momentaryReading = 0
//     for (var j = 0; j < args.globalBuckets.momentaryBucketArray.length; j++) {
//       sumOfBin400 += (args.globalBuckets.momentaryBucketArray[j] * args.globalBuckets.momentaryBucketArray[j]);
//     }
//     var average = sumOfBin400 / (args.globalBuckets.momentaryBucketArray.length + args.globalBuckets.momentaryBucketArray.length);
//     momentaryReading = -0.691 + (10 * log10(average));
// console.log(momentaryReading);
//     return momentaryReading;

//   };


  function returnMomentaryLUFS() {
    //console.log(args.globalBuckets);
  var sumOfBin400 = 0;
  var momentaryReading;
  for (var j = 0; j < args.globalBuckets.momentaryBucketArray.length; j++) {
    //console.log(args.globalBuckets.momentaryBucketArray[j]);
    sumOfBin400 += (args.globalBuckets.momentaryBucketArray[j] * args.globalBuckets.momentaryBucketArray[j]);
  }
  var average = sumOfBin400 / (args.globalBuckets.momentaryBucketArray.length + args.globalBuckets.momentaryBucketArray.length);
  momentaryReading = -0.691 + (10 * log10(average));
  //console.log(momentaryReading);
  //console.log(momentaryReading);
  return momentaryReading;
};
  
  // then performt he calculation and resrun the result



  // var NUM_BARK_BANDS = 24;
  // var specific = new Float32Array(NUM_BARK_BANDS);
  // var total = 0;
  // var normalisedSpectrum = args.ampSpectrum;
  // var bbLimits = new Int32Array(NUM_BARK_BANDS + 1);

  // bbLimits[0] = 0;
  // var currentBandEnd = args.barkScale[normalisedSpectrum.length - 1] /
  //       NUM_BARK_BANDS;
  // var currentBand = 1;
  // for (let i = 0; i < normalisedSpectrum.length; i++) {
  //   while (args.barkScale[i] > currentBandEnd) {
  //     bbLimits[currentBand++] = i;
  //     currentBandEnd = currentBand *
  //               args.barkScale[normalisedSpectrum.length - 1] /
  //               NUM_BARK_BANDS;
  //   }
  // }

  // bbLimits[NUM_BARK_BANDS] = normalisedSpectrum.length - 1;

  // //process

  // for (let i = 0; i < NUM_BARK_BANDS; i++) {
  //   let sum = 0;
  //   for (let j = bbLimits[i]; j < bbLimits[i + 1]; j++) {

  //     sum += normalisedSpectrum[j];
  //   }

  //   specific[i] = Math.pow(sum, 0.23);
  // }

  // //get total loudness
  // for (let i = 0; i < specific.length; i++) {
  //   total += specific[i];
  // }



  return {
    momentary: returnMomentaryLUFS(),
    shortTerm: 20
  };
  // return {
  //   specific: specific,
  //   total: total,
  // };
};
export function init(args) {
  console.log('initting lufs with: ', args);
  //should return requirements

  var shortTermBucketArray = new Array(args.audioContext.sampleRate * 3).fill(0);
  var shortTermBucketCount = 0;
  var momentaryBucketArray = new Array(args.audioContext.sampleRate * 0.4).fill(0);
  var momentaryBucketCount = 0;

  // for (var i = 0; i < shortTermBucketArray.length; i++) {
  //   shortTermBucketArray.push(0);
  // }
  // for (var j = 0; j < momentaryBucketArray; j++) {
  //   momentaryBucketArray.push(0);
  // }

  return {
    shortTermBucketArray: shortTermBucketArray,
    shortTermBucketCount: shortTermBucketCount,
    momentaryBucketArray: momentaryBucketArray,
    momentaryBucketCount: momentaryBucketCount
  };
};



// The measurement parameters for ‘EBU Mode’ are:
// 1. The momentary loudness uses a sliding rectangular time window of length 0.4 s. The
// measurement is not gated.
// 2. The short-term loudness uses a sliding rectangular time window of length 3 s. The
// measurement is not gated. The update rate for ‘live meters’ shall be at least 10 Hz.
// 3. The integrated loudness uses gating as described in ITU-R BS.1770-4. The update rate
// for ‘live meters’ shall be at least 1 Hz.