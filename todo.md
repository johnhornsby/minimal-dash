# TODO

- Loss of worker postMessage on loading fragment on chrome osX when you move to a new os space. When you switch back time has skipped and stalled. Hang on to adrift workers untill hidden = false


- this error should be ok, this is where a init file is being appened to buffer and took 4 seconds and will not update with the next fragment
- source.js:180 Uncaught (in promise) Error: Will not appendBuffer with fragment index -1, SourceBuffer is still being updated with fragment index 7, try later

- need to look again at bandwidth analysis and when fragments are cached.

- const fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);
is getting 51 as a fragment index, really I guess this should resolve to 0

- no auto play on safari

- inifite loop for safari and firefox when attempting to assertain when buffer is empty at due to ranges been out, I've added a tolerance for now