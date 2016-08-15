import Fragment from '../models/fragment';

export default class BufferOutput {


	_canvas = null;

	_ctx = null;

	_video = null;

	_manifest = null;


	constructor(player, video, canvas) {



		this._canvas = canvas;

		this._video = video;


		this._init();
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	draw() { this._draw() }

	set manifest(manifest) {
		this._manifest = manifest
		this._layout();
		this._draw();
	}





	/*____________________________________________

	Private 
	_____________________________________________*/
	_init() {
		this._bind();
		window.addEventListener('resize', this._onResize);
		this._ctx = this._canvas.getContext('2d');
	}


	_bind() {
		this._onResize = ::this._onResize;
	}


	_onResize() {
		this._layout();
		this._draw();
	}


	_layout() {
		let rowHeight = 10;

		this._canvas.height = this._video.clientHeight;

		//this._canvas.height = this._manifest.numberOfStreams * rowHeight + (this._manifest.numberOfStreams - 1);
		this._canvas.width = this._video.clientWidth;
	}


	_draw() {
		if (this._canvas.width !== this._video.clientWidth || this._canvas.height !== this._video.clientHeight ) {
			this._layout();
		}

		const manifest = this._manifest;
		const margin = 20;
		const gutter = 1;
		const w = this._canvas.width - (margin * 2);
		const h = this._canvas.height - (margin * 2);
		const x = margin;
		const y = margin;
		let decrementedRemainder = 0;
		let col = 0;
		let colWidth = 0;
		const colWidths = [];

		// create column widths array
		let colWidthPlusGutter = Math.floor((w + gutter) / manifest.numberOfFragments);
		// calculate the remaining gap to divide up to ensure nice fit across full width
		let remainder = w - ((colWidthPlusGutter * manifest.numberOfFragments) - gutter);

		for (let stream of manifest) {
			
			decrementedRemainder = remainder;
			col = x;
			
			for (let fragment of stream) {
				colWidth = colWidthPlusGutter - gutter;

				// supliment column width from reminder until gone
				if (decrementedRemainder > 0) {
					colWidth += 1;
					decrementedRemainder -= 1;
				}

				colWidths.push({
					x: col,
					w: colWidth,
					r: col + colWidth + gutter
				});

				col += colWidth + gutter;
			}
		}

		const fragmentsBottom = this._drawFragments(colWidths, x, y, w, h);

		this._drawBandwidth(colWidths, x, fragmentsBottom + margin , w, h - fragmentsBottom);

	}


	_drawFragments(colWidths, x, y, w, h) {
		const manifest = this._manifest;
		const ctx = this._ctx;
		let row = y;
		let rowHeight = 10;
		const gutter = 1;
		let fIdx = 0;

		ctx.clearRect(x, y, w, h);

		for (let stream of manifest) {
			fIdx = 0;

			for (let fragment of stream) {

				this._drawBox(colWidths[fIdx].x, row, colWidths[fIdx].w, rowHeight, fragment, ctx);

				fIdx += 1;
			}

			row += rowHeight + gutter;
		}

		const playheadX = Math.round(x + (this._video.currentTime / manifest.duration) * w);
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(playheadX, y, 1, row - y);

		return row;
	}


	_drawBandwidth(colWidths, x, y, w, h) {
		const manifest = this._manifest;
		const ctx = this._ctx;
		let fIdx = 0;

		ctx.clearRect(x, y, w, h);
		ctx.beginPath();
		ctx.lineWidth="1";
		ctx.strokeStyle="white";
		ctx.rect(x + 0.5, y + 0.5, w - 1, h - 1);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.stroke();

		ctx.font = "10px Arial";
		// let ping = '';
		// if (this._manifest.getFragment(0,0).loadData) {
		// 	ping = `ping: ${this._manifest.getFragment(0,0).loadData.ping}`;
		// }


		// ctx.fillText(ping, x + 10, y + 10);

		const loadedFragments = [];
		let fragment;
		for (let i = 0; i < manifest.numberOfFragments; i++) {
			for (let s = 0; s < manifest.numberOfStreams; s++) {
				fragment = manifest.getFragment(s, i);
				if (fragment.status === Fragment.status.LOADED) {
					loadedFragments.push(fragment);
					break;
				}
			}
		}

		if (loadedFragments.length === 0) return;

		const bandwidths = loadedFragments.map(fragment => fragment.loadData.bandwidth);
		const estimatedBandwidths = loadedFragments.map(fragment => fragment.loadData.estimatedBandwidth);

		let maxBandwidth = bandwidths.reduce(function(previous, next) {
			return Math.max(previous, next)
		});

		// console.log('max bandwidth '+ maxBandwidth);

		// round to nearest 10
		maxBandwidth = Math.pow(10, String(Math.round(maxBandwidth)).length);
		const maxBandwidthString =  `${maxBandwidth / 1000000} mbits / s`;
		ctx.fillStyle = "white";
		ctx.fillText(maxBandwidthString, x + 10, y + 20);


		for (let bandwidth of bandwidths) {
			let row = y + (h - ((bandwidth / maxBandwidth) * h));

			let x = colWidths[fIdx].x + (colWidths[fIdx].w / 2);

			ctx.beginPath();
			
			ctx.arc(x, row, 1, 0, 2 * Math.PI, false);
			ctx.fillText(fIdx + 1, x + 10, row);
			ctx.fillStyle = 'white';
			ctx.fill();

			fIdx += 1;
		}





		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "white";
		ctx.moveTo(0,0);
		fIdx = 0;

		//ctx.moveTo(colWidths[fIdx].x + (colWidths[fIdx].w / 2), bandwidths[0]);
		for (let bandwidth of bandwidths) {

			let x = colWidths[fIdx].x + (colWidths[fIdx].w / 2);
			let row = y + (h - ((bandwidth / maxBandwidth) * h));

			if (fIdx === 0) {
				ctx.moveTo(x, row);
			}

			ctx.lineTo(x, row);

			fIdx += 1;
		}
		ctx.stroke();


		

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "red";
		ctx.moveTo(0,0);
		fIdx = 0;

		//ctx.moveTo(colWidths[fIdx].x + (colWidths[fIdx].w / 2), bandwidths[0]);
		for (let bandwidth of estimatedBandwidths) {

			let x = colWidths[fIdx].x + (colWidths[fIdx].w / 2);
			let row = y + (h - ((bandwidth / maxBandwidth) * h));

			if (fIdx === 0) {
				ctx.moveTo(x, row);
			}

			ctx.lineTo(x, row);

			fIdx += 1;
		}
		ctx.stroke();
		

	}


	_drawBox(col, row, colWidth, rowHeight, fragment, ctx) {
		switch (fragment.status) {
			case 'empty':
				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				break;
			case 'loading':
				ctx.fillStyle = "#FF0000";
				break;
			case 'loaded':
				ctx.fillStyle = "rgba(255, 255, 255, 1)";
				break;
		}
		ctx.fillRect(col, row, colWidth, rowHeight);
	}
}
