import Fragment from '../models/fragment';
import {removeSpikes} from '../../util/stats';

export default class BufferOutput {


	_canvas = null;

	_ctx = null;

	_video = null;

	_manifest = null;

	_columnWidths = null;


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
		this._onResize();
	}





	/*____________________________________________

	Private 
	_____________________________________________*/
	_init() {
		this._bind();
		window.addEventListener('resize', this._onResize);
		this._ctx = this._canvas.getContext('2d');
		this._video.addEventListener('mousemove', this._onMouseMove);
	}


	_bind() {
		this._onResize = ::this._onResize;
		this._onMouseMove = ::this._onMouseMove;
	}


	_onResize(event) {
		this._layout();
		this._columnWidths = this._getColumnWidths(this._manifest.numberOfFragments);
		this._draw();
	}


	_onMouseMove(event) {
		const mouseX = event.clientX;
		const mouseY = event.clientY;
		if (this._columnWidths.length > 0) {
			const fragmentIndex = this._columnWidths.findIndex( colData => mouseX >= colData.x && mouseX <= colData.r);
			let fragment;
			if (fragmentIndex > -1) {
				fragment = this._getLoadedFragments()[fragmentIndex];

				if (fragment !== undefined) {
					this._drawBandwidthVariances(this._ctx, mouseX, mouseY, fragment.loadData);
				}
			}
		}
	}


	_drawBandwidthVariances(ctx, screenX, screenY, loadData) {
		this._draw();
		const w = 100;
		const h = 100;
		const area = 0;

		let bandwidths = loadData.range.all.sort((a, b) => a - b);

		const maxBandwidth = bandwidths[bandwidths.length - 1];
		const minBandwidth = bandwidths[0];

		const bandWidthDifference = maxBandwidth - minBandwidth;
		const xModifer = w / (bandwidths.length - 1);

		// Draw Background
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(screenX, screenY, 100, 100);

		// Draw Area
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.beginPath();
		ctx.moveTo(screenX + 0, screenY + h); // bottom left

		function yMod(bandwidth) {
			if (bandWidthDifference === 0) return 0;
			return ((bandwidth - minBandwidth) / bandWidthDifference) * h;
		}

		for (let i = 0; i < bandwidths.length; i++) {
			let y = yMod(bandwidths[i]);
			let yInvert = h - y;
			let x = i * xModifer;

			ctx.lineTo(screenX + x, screenY + yInvert);
		}

		ctx.lineTo(screenX + w, screenY + h);
		ctx.lineTo(screenX + w, screenY + h);
		ctx.closePath();
		ctx.fill();

		// Draw Clip Line
		let areaPercentage = this._getAreaPercentage(bandwidths);

		// Render the clip line
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(screenX, screenY + (h - (areaPercentage * h)), w, 1);
	}


	_getAreaPercentage(values) {

		let area = 0;
		const max = values.reduce((previous, next) => Math.max(previous, next));
		const min = values.reduce((previous, next) => { return Math.min(previous, next)}, max);
		
		const difference = max - min;
		let maxArea = difference * (values.length - 1);

		for (let i = 0; i < values.length; i++) {
			area += values[i] - min;
		}

		return area / maxArea;
	}


	_layout() {
		let rowHeight = 10;

		this._canvas.height = this._video.clientHeight;
		this._canvas.width = this._video.clientWidth;
	}


	_draw() {
		if (this._canvas.width !== this._video.clientWidth || this._canvas.height !== this._video.clientHeight ) {
			this._layout();
		}

		const manifest = this._manifest;
		const margin = 20;
		const w = this._canvas.width - (margin * 2);
		const h = this._canvas.height - (margin * 2);
		const x = margin;
		const y = margin;

		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		const fragmentsBottom = this._drawFragments(this._columnWidths, x, y, w, h);

		this._drawPlayhead(x, y, w, h);

		this._drawBandwidth(this._columnWidths, x, fragmentsBottom + margin , w, h - fragmentsBottom);
	}


	_getColumnWidths(columns) {
		const margin = 20;
		const gutter = 1;
		const w = this._canvas.width - (margin * 2);
		let decrementedRemainder = 0;
		let col = 0;
		let colWidth = 0;
		const colWidths = [];
		// create column widths array
		let colWidthPlusGutter = Math.floor((w + gutter) / columns);
		// calculate the remaining gap to divide up to ensure nice fit across full width
		let remainder = w - ((colWidthPlusGutter * columns) - gutter);

		decrementedRemainder = remainder;
		col = margin;
		
		for (let i = 0; i < columns; i++) {
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

		return colWidths;
	}


	_getLoadedFragments() {
		const manifest = this._manifest;
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

		return loadedFragments;
	}


	_drawFragments(colWidths, x, y, w, h) {
		const manifest = this._manifest;
		const ctx = this._ctx;
		let row = y;
		let rowHeight = 10;
		const gutter = 1;
		let fIdx = 0;

		for (let stream of manifest) {
			fIdx = 0;

			for (let fragment of stream) {

				this._drawBox(colWidths[fIdx].x, row, colWidths[fIdx].w, rowHeight, fragment, ctx);

				fIdx += 1;
			}

			row += rowHeight + gutter;
		}

		return row;
	}


	_drawPlayhead(x, y, w, h) {
		const manifest = this._manifest;
		const ctx = this._ctx;
		let rowHeight = 10;
		const gutter = 1;
		const rows = manifest.numberOfStreams;
		const playheadX = Math.round(x + (this._video.currentTime / manifest.duration) * w);
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(playheadX, y, 1, (rows * rowHeight) + (rows + gutter) - 1);
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

		const loadedFragments = this._getLoadedFragments();

		if (loadedFragments.length === 0) return;

		const bandwidths = loadedFragments.map(fragment => fragment.loadData.bandwidth);
		const ranges = loadedFragments.map(fragment => fragment.loadData.range);
		const estimatedBandwidths = loadedFragments.map(fragment => fragment.loadData.estimatedBandwidth);

		let maxBandwidth = bandwidths.reduce(function(previous, next) {
			return Math.max(previous, next)
		});



		// console.dir({
		// 	'maxBandwidth': maxBandwidth,
		// 	bandwidth: bandwidths[bandwidths.length - 1],
		// 	range: ranges[ranges.length - 1],
		// });
		maxBandwidth *= 1.1;
		//maxBandwidth = 1000000;
		if (isFinite(maxBandwidth) === false) {
			debugger;
		}
		if (isNaN(maxBandwidth)) {
			debugger;
		}
		// round to nearest 10
		//maxBandwidth = Math.pow(10, String(Math.round(maxBandwidth)).length);
		// maxBandwidth = 1000000;
		const maxBandwidthString =  `${maxBandwidth / 1000000} mbits / s`;
		


		// Draw Estimated Bandwidth
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "red";
		ctx.moveTo(0,0);
		fIdx = 0;

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


		// Draw Bandwidth Range
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
		ctx.beginPath();
		ctx.moveTo(0,0);

		for (let i = 0; i < ranges.length; i++) {
			let bandwidth = ranges[i].start;
			let x = colWidths[i].x + (colWidths[i].w / 2);
			let row = y + (h - ((bandwidth / maxBandwidth) * h));

			if (i === 0) {
				ctx.moveTo(x, row);
			}

			ctx.lineTo(x, row);
		}

		for (let i = ranges.length - 1; i > -1; i--) {
			let bandwidth = ranges[i].end;
			let x = colWidths[i].x + (colWidths[i].w / 2);
			let row = y + (h - ((bandwidth / maxBandwidth) * h));

			ctx.lineTo(x, row);
		}

		ctx.closePath();
		ctx.fill();


		// Draw Points and Numbers
		ctx.fillStyle = "white";
		ctx.fillText(maxBandwidthString, x + 10, y + 20);
		fIdx = 0;

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


		// Draw Load Speed
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "white";
		ctx.moveTo(0,0);
		fIdx = 0;

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
