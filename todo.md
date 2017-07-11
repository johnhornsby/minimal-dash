# TODO

- Loss of worker postMessage on loading fragment on chrome osX when you move to a new os space. When you switch back time has skipped and stalled. Hang on to adrift workers untill hidden = false


- this error should be ok, this is where a init file is being appened to buffer and took 4 seconds and will not update with the next fragment
- source.js:180 Uncaught (in promise) Error: Will not appendBuffer with fragment index -1, SourceBuffer is still being updated with fragment index 7, try later. -1 is the appending of the init fragment 

- need to look again at bandwidth analysis and when fragments are cached.

- const fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);
is getting 51 as a fragment index, really I guess this should resolve to 0

- no auto play on safari

- play pause toggle does not work when media is loading

- inifite loop for safari and firefox when attempting to assertain when buffer is empty at due to ranges been out, I've added a tolerance for now




- Bug, When currentTime gets too close and within negative tollerance of emptyAt it misscalculates the next fragment to load, and creates a loop.

// Console Log before the Loop Begins

_checkVideoBuffer shouldGetData:true bufferEmptyAtTime:12
07:38:42.147 bandwidth.js:97 _start fragment video/5/seg-13.m4f
07:38:42.148 player.js:358 _checkCachedData {"readyState":4,"fragmentIndex":12,"loadingFragment":false,"fragmentStatus":"empty"}
07:38:42.154 video-element.js:246 VIDEO EVENT: resize 10.019452
07:38:42.642 video-element.js:246 VIDEO EVENT: timeupdate 10.507904
07:38:42.643 player.js:211 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:12
07:38:42.643 player.js:358 _checkCachedData {"readyState":4,"fragmentIndex":12,"loadingFragment":true}
07:38:42.892 video-element.js:246 VIDEO EVENT: timeupdate 10.757928
07:38:42.893 player.js:211 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:12
07:38:42.893 player.js:358 _checkCachedData {"readyState":4,"fragmentIndex":12,"loadingFragment":true}
07:38:43.392 video-element.js:246 VIDEO EVENT: timeupdate 11.257404
07:38:43.392 player.js:211 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:12
07:38:43.393 player.js:358 _checkCachedData {"readyState":4,"fragmentIndex":12,"loadingFragment":true}
07:38:43.892 video-element.js:246 VIDEO EVENT: timeupdate 11.757756
07:38:43.893 player.js:211 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:12
07:38:43.893 player.js:358 _checkCachedData {"readyState":4,"fragmentIndex":12,"loadingFragment":true}
07:38:44.103 video-element.js:246 VIDEO EVENT: timeupdate 11.968432

$0.buffered.start(0) = 0
$0.buffered.end(0) = 11.999999

consg equalOrGreaterThanStart = (currentTime >= (0 - RANGE_START_END_TOLERANCE)) || (currentTime >= (0 + RANGE_START_END_TOLERANCE))
equalOrLessThanEnd = (currentTime <= (11.999999 - RANGE_START_END_TOLERANCE)) || (currentTime >= (11.999999 + RANGE_START_END_TOLERANCE));

equalOrLessThanEnd = false

equalOrGreaterThanStart && equalOrLessThanEnd

Because current time is just before but within tollerance we do not enter the conditional and assign the current time to the empty at, which is wrong. Ergo when the current time is too close to the empty at time it loops and locks.

12 loaded
13 loading

// Console Log after the Loop Begins

source.js:171 _appendToBuffer onUpdateEnd
07:52:07.963 player.js:295 _checkCachedData COMPLETE
07:52:15.005 player.js:211 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:11.968432
07:52:15.005 source.js:150 _appendToBuffer arrayBuffer length: 447026 video/5/seg-12.m4f
07:52:15.005 player.js:358 _checkCachedData {"readyState":2,"fragmentIndex":11,"streamIsInitialised":true,"quality":4,"switchStreams":false}
07:52:15.006 video-element.js:246 VIDEO EVENT: progress 11.968432
07:52:25.527 video-element.js:246 VIDEO EVENT: stalled 11.968432
07:52:25.529 source.js:171 _appendToBuffer onUpdateEnd
07:52:25.529 player.js:295 _checkCachedData COMPLETE