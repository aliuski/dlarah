import React from 'react';

export class CustomizedDot extends React.Component {
	render() {
		const { cx, cy, payload } = this.props;

		if (payload.cp != null) {
			var wind = payload.cp + 90;
			var yc = Math.round(128.0 * Math.sin(wind * Math.PI / 180.0));
			var xc = Math.round(128.0 * Math.cos(wind * Math.PI / 180.0));
			var lx1 = 128 + xc;
			var ly1 = 128 + yc;
			var lx2 = 128 - xc;
			var ly2 = 128 - yc;
			var yc1 = Math.round(100.0 * Math.sin((wind + 45.0) * Math.PI / 180.0));
			var xc1 = Math.round(100.0 * Math.cos((wind + 45.0) * Math.PI / 180.0));
			var yc2 = Math.round(100.0 * Math.sin((wind - 45.0) * Math.PI / 180.0));
			var xc2 = Math.round(100.0 * Math.cos((wind - 45.0) * Math.PI / 180.0));
			var ax = 128 + xc1;
			var ay = 128 + yc1;
			var bx = 128 + xc;
			var by = 128 + yc;
			var dx = 128 + xc2;
			var dy = 128 + yc2;
			return (
				<svg x={cx - 20} y={cy} width={20} height={20} viewBox="0 0 256 256">
					<line key={1} x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="red" strokeWidth="10" />
					<line key={2} x1={ax} y1={ay} x2={bx} y2={by} stroke="red" strokeWidth="10" />
					<line key={3} x1={bx} y1={by} x2={dx} y2={dy} stroke="red" strokeWidth="10" />
				</svg>
			);
		}
		else
			return (null);
	}
}
