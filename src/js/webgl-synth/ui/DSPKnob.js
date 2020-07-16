


var activeKnobs = {};

function setupKnob(knob, container) {

    var rect = container.getBoundingClientRect();
    knob.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
    knob.setDimensions(container.clientWidth, container.clientHeight);

    // Detect touch capable client
    if ('ontouchstart' in window) {

        container.addEventListener('touchstart', function(e) {
            var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
            // Keep track of the knobs currently being touched to support multitouch.
            activeKnobs[e.targetTouches[0].identifier] = knob;
            knob.doTouchStart(e.targetTouches, timeStamp);
            e.preventDefault();
        }, false);

        document.addEventListener('touchmove', function(e) {
            var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
            // Support multi-touch knobs by only passing the appropriate touch events.
            for(var i = 0, l = e.changedTouches.length; i < l; i++) {
                var k = activeKnobs[e.changedTouches[i].identifier];
                if(typeof k !== "undefined") {
                    k.doTouchMove([e.changedTouches[i]], timeStamp, e.scale);
                }
            }

        }, false);

        document.addEventListener('touchend', function(e) {
            var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
            knob.doTouchEnd(timeStamp);
        }, false);

        document.addEventListener('touchcancel', function(e) {
            var timeStamp = e.timeStamp.getTime ? e.timeStamp.getTime() : e.timeStamp;
            knob.doTouchEnd(timeStamp);
        }, false);

    } else {
        // No touch capable client detected, use mouse interactions
        var mousedown = false;

        container.addEventListener('mousedown', function(e) {

            knob.doTouchStart([{
                pageX: e.pageX,
                pageY: e.pageY
            }], e.timeStamp);

            mousedown = true;
        }, false);

        document.addEventListener('mousemove', function(e) {
            if (!mousedown) { return; }

            knob.doTouchMove([{
                pageX: e.pageX,
                pageY: e.pageY
            }], e.timeStamp);

            mousedown = true;

            // Prevent selection on drag
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        }, false);

        document.addEventListener('mouseup', function(e) {
            if (!mousedown) { return; }

            knob.doTouchEnd(e.timeStamp);

            mousedown = false;
        }, false);

        // Handle scroll for webkit
        container.addEventListener('mousewheel', function(e) {
            knob.doMouseScroll(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
            // Prevent page scroll
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        }, false);

        // Handle scroll for gecko
        // container.addEventListener('MozMousePixelScroll', function(e) {
        container.addEventListener('DOMMouseScroll', function(e) {
            knob.doMouseScroll(-4*e.detail, e.timeStamp, e.pageX, e.pageY);
            // Prevent page scroll
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        }, false);

    }
}















// /**
//  * @param {Element} knob
//  * @returns {Array} [ <circle>, <rect> ]
//  */
// function SelectSVGs(knob) {
//     let siblings = Array.prototype.filter.call(knob.element.parentNode.children, function(child) {
//         return child.tagname === 'svg' && child !== knob.element;
//     });
//     return siblings[0].children;
// }



/**
 *
 * @constructor
 */
DSPKnob = function(id, callback) {
    let self = this;
    this.callback = callback;
    this.knob = new Knob(document.getElementById(id),
        function(knob, indicator) {
            self.callback(knob.val());
            self.draw(knob, indicator);
        }
    );
    this.knob.val(this.knob.options.valueMax - this.knob.val());


    // create knob
    let $input     = $(this.knob.element),
        $container = $('<div class="AudioCanvas__Knob '+ id + '">'),
        $body      = $('<div class="ui-knob ui-shadow '+ id + '">'),
        $indicator = $('<div class="ui-indicator '+ id + '">');

    $container.append($body);
    $container.append($indicator);

    $input.hide();
    $container.insertBefore($input);
    $container.append($input);

    // center knob in container
    $body.css({
        "margin-top": -($body.outerHeight()/2),
        "margin-left":-($body.outerWidth()/2)
    });

    setupKnob(this.knob, $container[0]);
};


/**
 *
 * @param indicator
 */
DSPKnob.prototype.draw = function(knob, indicator) {
    var $indicator = $(knob.element).siblings('.ui-indicator');
    $indicator.css({
        left: indicator.x - $indicator.outerWidth()/2,
        top:  indicator.y - $indicator.outerHeight()/2
    });

    var rotateText = 'rotate('+(-indicator.angle)+'deg)';
    $indicator.css({
        'transform': rotateText,
        '-webkit-transform': rotateText,
        '-moz-transform': rotateText,
        '-o-transform': rotateText
    });
};



module.exports = DSPKnob;