

const Motion = function(parent, move) {

	this.level;
	this.pos = [];

	if (parent == undefined) {
		this.level = 0;
		this.pos = GAME.pos.map(p => (p));
	} else {
		this.level = parent.level + 1;
		this.pos = parent.pos.map(p => (p));
		let empty = this.pos.indexOf(-1);
		this.pos[empty] = this.pos[empty + move];
		this.pos[empty + move] = -1;
	}
	console.log(this);

};

Motion.prototype.equals = function(m) {
	let same = true;
	//return this.pos.map((p,i) => (p == m.pos[i])).filter(p => p == false).length == 0;
	return ! this.pos.some(function(p, i) {
		return p != m.pos[i];
	});
};