

const Motion = function(parent, move) {

	if (Motion.count == undefined) Motion.count = 0;
	else Motion.count++;


	this.level;
	this.pos = [];
	this.empty = 0;
	this.parentId = -1;
	this.id = Motion.count;

	if (parent == undefined) {
		this.level = 0;
		this.pos = GAME.pos.map(p => (p));
		this.empty = this.pos.indexOf(-1);
	} else {
		this.level = parent.level + 1;
		this.pos = parent.pos.map(p => (p));
		this.empty = this.pos.indexOf(-1);
		this.pos[this.empty] = this.pos[this.empty + move];
		this.empty += move;
		this.pos[this.empty] = -1;
		this.parentId = parent.id;
	}

};

Motion.prototype.equals = function(m) {
	let same = true;
	//return this.pos.map((p,i) => (p == m.pos[i])).filter(p => p == false).length == 0;
	return ! this.pos.some(function(p, i) {
		return p != m.pos[i];
	});
};


Motion.prototype.moves = function() {
  let d = [];
	//console.log(this);

  if (this.empty < 12) d.push(4);
  if (this.empty > 3) d.push(-4);
  if (this.empty % 4 > 0) d.push(-1);
  if (this.empty % 4 < 3) d.push(1);

  //console.log(this.empty)
  return d;
};
