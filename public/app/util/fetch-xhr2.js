



export default class FetchXHR2 {
 
	static fetch(url, responseType = 'text') {
		return new Promise(function(resolve, reject) {

			let xhr = FetchXHR2._createCORSRequest("GET", url);

			if (xhr == null) {
				reject(new Error("CORS not supported"));
			}

			//xhr.withCredentials = true;
			xhr.responseType = responseType;

			addEventListeners();

			xhr.send();


			function addEventListeners() {
				xhr.addEventListener("loadstart", handleEvent, false);
				xhr.addEventListener("progress", handleEvent, false);
				xhr.addEventListener("abort", handleEvent, false);
				xhr.addEventListener("error", handleEvent, false);
				xhr.addEventListener("timeout", handleEvent, false);
				xhr.addEventListener("load", handleEvent, false);
				xhr.addEventListener("readystatechange", handleEvent, false);
			}


			function removeEventListeners() {
				xhr.removeEventListener("loadstart", handleEvent, false);
				xhr.removeEventListener("progress", handleEvent, false);
				xhr.removeEventListener("abort", handleEvent, false);
				xhr.removeEventListener("error", handleEvent, false);
				xhr.removeEventListener("timeout", handleEvent, false);
				xhr.removeEventListener("load", handleEvent, false);
				xhr.removeEventListener("readystatechange", handleEvent, false);
			}


			function handleEvent(event) {
				switch(event.type) {
				case 'loadstart':
					break;
				case 'progress':
					break;
				case 'abort':
					break;
				case 'error':
					reject(`${event.type}`);
					break;
				case 'timeout':
					reject(`${event.type}`);
					break;
				case 'load':
					handleLoad(event);
					break;
				case 'readystatechange':
					if (xhr.readyState === 2 && xhr.status === 404) {
						const error = new Error(`FetchXHR2:${event.type} - readyState:${xhr.readyState} status:${xhr.status} statusText:${xhr.statusText} url:${url}`);
						reject(error);
					}
					if (xhr.readyState === 4 && xhr.status !== 200) {
						const error = new Error(`FetchXHR2:${event.type} - readyState:${xhr.readyState} status:${xhr.status} statusText:${xhr.statusText} url:${url}`);
						reject(error);
					}
					break;
				}

				// if (Globals.LOG) console.log(event.type);
			}


			function handleLoad(event) {
				removeEventListeners();

				switch(xhr.responseType) {
				case 'arraybuffer':
					handleArrayBufferLoad(event);
					break;
				case 'blob':
					handleImageLoad(event);
					break;
				case 'text':
					handleTextLoad(event);
					break;

				}
			}

			function handleArrayBufferLoad(event) {
				resolve(new Uint8Array(event.target.response));

				destroy();
			}

			function handleImageLoad(event) {
				const img = document.createElement('img');

        		img.onload = function(event) {
					URL.revokeObjectURL(img.src); // Clean up after yourself.

					resolve(img, url, img.src);

					destroy();
			    };

        		img.src = URL.createObjectURL(xhr.response);
			}

			function handleTextLoad(event) {
				const text = xhr.response;
				resolve(text);
			}


			function destroy() {
				xhr = null;
			}
			
		});
	}

	static _createCORSRequest(method, url) {

		let xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest != "undefined") {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		} 
		return xhr;
	}
}
