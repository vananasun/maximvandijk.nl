FilterAnimation = function() {

    this._filter = document.getElementById('psy');
    this._feOffsets = this._filter.querySelectorAll('feOffset');

    this.origX = 2.8;
    this.origY = 0;

}

FilterAnimation.prototype.update = function(time) {

    let angle, x, y;

    angle = time / 684.0;
    x = Math.cos(angle) * this.origX - Math.sin(angle) * this.origY;
    y = Math.sin(angle) * this.origX + Math.cos(angle) * this.origY;
    this._feOffsets[0].setAttribute('dx', x);
    this._feOffsets[0].setAttribute('dy', y);

    angle = -(time / 746.4);
    x = Math.cos(angle) * this.origX - Math.sin(angle) * this.origY;
    y = Math.sin(angle) * this.origX + Math.cos(angle) * this.origY;
    this._feOffsets[1].setAttribute('dx', x);
    this._feOffsets[1].setAttribute('dy', y);

}

module.exports = FilterAnimation;
