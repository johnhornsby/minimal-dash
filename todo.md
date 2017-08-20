# TODO

## Add handling of timeout for loading Fragment

_checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:25.071 bandwidth.js:97 _start fragment video/7/seg-48.m4f
20:04:25.072 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":false,"fragmentStatus":"empty"}
20:04:25.234 video-element.js:251 VIDEO EVENT: timeupdate 45.733233
20:04:25.234 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:25.234 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":true}
20:04:25.332 video-element.js:251 VIDEO EVENT: progress 45.831202
20:04:25.484 video-element.js:251 VIDEO EVENT: timeupdate 45.983307
20:04:25.484 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:25.484 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":true}
20:04:25.734 video-element.js:251 VIDEO EVENT: timeupdate 46.233627
20:04:25.734 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:25.735 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":true}
20:04:25.984 video-element.js:251 VIDEO EVENT: timeupdate 46.483797
20:04:25.985 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:25.985 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":true}
20:04:26.234 video-element.js:251 VIDEO EVENT: timeupdate 46.733867
20:04:26.235 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:26.235 player.js:372 _checkCachedData {"readyState":4,"fragmentIndex":47,"loadingFragment":true}
20:04:26.464 video-element.js:251 VIDEO EVENT: timeupdate 46.963399
20:04:26.465 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:26.465 player.js:372 _checkCachedData {"readyState":2,"fragmentIndex":47,"loadingFragment":true}
20:04:26.468 video-element.js:251 VIDEO EVENT: waiting 46.963399
20:04:28.483 video-element.js:251 VIDEO EVENT: stalled 46.963399
20:04:52.003 78d5ce71-4fc9-41d1-bc69-e0972db96d3f:9 [object DedicatedWorkerGlobalScope] worker.onLoad https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-48.m4f
20:04:52.005 load.js:234 worker message received https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-48.m4f
20:04:52.005 78d5ce71-4fc9-41d1-bc69-e0972db96d3f:61 [object DedicatedWorkerGlobalScope] worker.retrieveResponse https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-48.m4f
20:04:52.005 load.js:234 worker message received https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-48.m4f
20:04:52.006 bandwidth.js:123 _stop fragment video/7/seg-48.m4f load time: 26819 bps: 12.644079290801297
20:04:52.006 player.js:221 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:47
20:04:52.006 player.js:372 _checkCachedData {"readyState":2,"fragmentIndex":47,"streamIsInitialised":true,"switchStreams":true}
20:04:52.007 source.js:150 _appendToBuffer arrayBuffer length: 688 video/7/init.mp4
20:04:52.007 source.js:171 _appendToBuffer onUpdateEnd
20:04:52.007 source.js:150 _appendToBuffer arrayBuffer length: 43405 video/7/seg-48.m4f
20:04:52.009 source.js:171 _appendToBuffer onUpdateEnd
20:04:52.009 player.js:320 _checkCachedData COMPLETE


## Cache timeout and fail to load 
player.js:302 _checkCachedData COMPLETE
08:28:42.566 player.js:218 _checkVideoBuffer shouldGetData:false bufferEmptyAtTime:36
08:28:42.740 video-element.js:251 VIDEO EVENT: timeupdate 33.500745
08:28:42.740 player.js:218 _checkVideoBuffer shouldGetData:false bufferEmptyAtTime:36
08:28:42.840 video-element.js:251 VIDEO EVENT: progress 33.600664
08:28:42.990 video-element.js:251 VIDEO EVENT: timeupdate 33.750934
08:28:42.991 player.js:218 _checkVideoBuffer shouldGetData:false bufferEmptyAtTime:36
08:28:43.241 video-element.js:251 VIDEO EVENT: timeupdate 34.001117
08:28:43.241 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:43.241 bandwidth.js:93 _start fragment video/7/seg-37.m4f
08:28:43.243 player.js:369 _checkCachedData {"readyState":4,"fragmentIndex":36,"loadingFragment":false,"fragmentStatus":"empty"}
08:28:43.740 video-element.js:251 VIDEO EVENT: timeupdate 34.500687
08:28:43.741 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:43.741 player.js:369 _checkCachedData {"readyState":4,"fragmentIndex":36,"loadingFragment":true}
08:28:44.240 video-element.js:251 VIDEO EVENT: timeupdate 35.000137
08:28:44.240 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:44.240 player.js:369 _checkCachedData {"readyState":4,"fragmentIndex":36,"loadingFragment":true}
08:28:44.490 video-element.js:251 VIDEO EVENT: timeupdate 35.250884
08:28:44.491 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:44.491 player.js:369 _checkCachedData {"readyState":4,"fragmentIndex":36,"loadingFragment":true}
08:28:44.991 video-element.js:251 VIDEO EVENT: timeupdate 35.75197
08:28:44.992 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:44.992 player.js:369 _checkCachedData {"readyState":4,"fragmentIndex":36,"loadingFragment":true}
08:28:45.206 video-element.js:251 VIDEO EVENT: timeupdate 35.966535
08:28:45.206 player.js:218 _checkVideoBuffer shouldGetData:true bufferEmptyAtTime:36
08:28:45.207 player.js:369 _checkCachedData {"readyState":2,"fragmentIndex":36,"loadingFragment":true}
08:28:45.209 video-element.js:251 VIDEO EVENT: waiting 35.966535
08:28:45.992 video-element.js:251 VIDEO EVENT: stalled 35.966535
08:29:24.053 s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-37.m4f:1 GET https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/video/7/seg-37.m4f net::ERR_TIMED_OUT



## FIXED Loss of worker postMessage on loading fragment on chrome osX when you move to a new os space. When you switch back time has skipped and stalled. Hang on to adrift workers untill hidden = false


## FIXED this error should be ok, this is where a init file is being appened to buffer and took 4 seconds and will not update with the next fragment
 source.js:180 Uncaught (in promise) Error: Will not appendBuffer with fragment index -1, SourceBuffer is still being updated with fragment index 7, try later. -1 is the appending of the init fragment 


## need to look again at bandwidth analysis and when fragments are cached.


## FIXED const fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);
is getting 51 as a fragment index, really I guess this should resolve to 0


## FIXED No auto play on safari


## FIXED Play pause toggle does not work when media is loading


## FIXED Inifite loop for safari and firefox when attempting to assertain when buffer is empty at due to ranges been out, I've added a tolerance for now


## FIXED Check Buffer Loop When Current Time Hits Loading
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



## Again checking buffer near the end we fall foul of not adjusting for tollerance.

On Safari
end = 50.3333
duration = 51

On Chrome
end = 49.9999
duration = 51

if (range.end > this._manifest.duration - fragmentDuration) {
	shouldGetData = false;
}


