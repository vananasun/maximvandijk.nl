
/*
 * @TODO: Add JPEG fallbacks.
 * @TODO: Add on-resize loading.
 */

function LazyLoader() {
    this.sizes = [
        [ 160 ,   90 ],
        [ 640 ,  360 ],
        [ 1024,  576 ],
        [ 1280,  720 ],
        [ 1920, 1080 ],
        [ 2560, 1440 ],
        [ 3200, 1800 ],
        [ 3840, 2160 ]
    ];

    for (let i = 0; i < this.sizes.length; i++) {
        this.maxSizeIndex = i;
        if (this.sizes[i][0] >= window.innerWidth
        &&  this.sizes[i][1] >= window.innerHeight)
            break;
    }
}

LazyLoader.prototype.loadImage = function(name, callback) {

    let ext = '.webp'; // @TODO: Add JPEG fallback.

    for (let sizeIndex = 0; sizeIndex < this.maxSizeIndex; sizeIndex++) {

        let size = this.sizes[sizeIndex][0] + 'x' + this.sizes[sizeIndex][1];
        let url = name + '_' + size + ext;

        let image = new Image();
        image.src = url;
        image.addEventListener('load', function() {

            callback(image);

        }, false);
    }

}

module.exports = LazyLoader;
