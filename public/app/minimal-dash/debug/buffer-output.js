

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

	draw(manifest) { this._draw(manifest) }





	/*____________________________________________

	Private 
	_____________________________________________*/
	_init() {
		this._bind();
		this._canvas.addEventListener('resize', this._onResize);
		this._ctx = this._canvas.getContext('2d');
	}


	_bind() {
		// this._onResize = ::this._onResize;
	}


	// _onResize() {
	// 	this._draw();
	// }


	_draw(manifest) {

		let row = 0;
		let col = 0;
		let rowHeight = 10;

		if (this._manifest == null) {
			this._manifest = manifest;
			this._canvas.height = manifest.numberOfStreams * rowHeight + (manifest.numberOfStreams - 1);
			this._canvas.width = window.innerWidth;
		}

		const ctx = this._ctx;

		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		
		let colWidth = Math.floor((this._canvas.width / manifest.numberOfFragments) - 1);
		// let remainder = this._canvas.width - ((Math.floor(colWidth) + 1) * manifest.numberOfFragments);
		// colWidth = Math.floor(colWidth);
		let remainder = this._canvas.width - ((Math.floor(colWidth) + 1) * manifest.numberOfFragments);

		let decrementedRemainder;
		let updatedColWidth;
		let colWidthFloor = colWidth = Math.floor(colWidth);
		for (let stream of manifest) {
			row = stream.index * (rowHeight + 1);

			decrementedRemainder = remainder;
			
			for (let fragment of stream) {
				updatedColWidth = colWidthFloor;

				// if (decrementedRemainder > 0) {
				// 	updatedColWidth = colWidth + 1;
				// 	decrementedRemainder -= 1;
				// }

				col = fragment.index * (updatedColWidth + 1);

				this._drawBox(col, row, updatedColWidth, rowHeight, fragment, ctx);
			}
		}

		const playheadX = (this._video.currentTime / manifest.duration) * this._canvas.width;
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(playheadX, 0, 1, this._canvas.height);
	}


	_drawBox(col, row, colWidth, rowHeight, fragment, ctx) {
		switch (fragment.status) {
			case 'empty':
				ctx.fillStyle = "#CCCCCC";
				break;
			case 'loading':
				ctx.fillStyle = "#666666";
				break;
			case 'loaded':
				ctx.fillStyle = "#00FFFF";
				break;
		}
		ctx.fillRect(col, row, colWidth, rowHeight);
	}
}
