const AnimHelper = require('AnimHelper');
cc.Class({
    extends: cc.Component,

    properties: {
      anims: {
        default: [],
        type: AnimHelper
      },
      arrow: cc.Animation
    },

    // use this for initialization
    onLoad: function () {
        this.lastTouchLoc = cc.p(0, 0);
        this.isPaused = false;
        this.isLastPlayed = false;
        this.animIdx = 0;
        this.node.on('touchstart', this.touchStartListener, this);
        this.node.on('touchend', this.pushUpListener, this);
        for (let i = 0; i < this.anims.length; ++i) {
            this.anims[i].init(this);
            if (i !== 0) {
                this.anims[i].node.active = false;
            }
        }
        this.arrow.node.opacity = 0;
        //"launch"事例
        if (window._hmt) {
            window._hmt.push(['_trackEvent', 'progress', 'launch']);
        }
    },

    start () {
        this.anims[0].anim.play();
    },

    step (isLast) {
        this.isPaused = true;
        this.arrow.play('arrow-blink');
        if (isLast) {
            this.isLastPlayed = true;
        }
    },

    touchStartListener (event) {
        this.lastTouchLoc = event.getLocation();
    },

    pushUpListener (event) {
        if (!this.isPaused) return;
        var touchLoc = event.getLocation();
        var delta = cc.pSub(touchLoc, this.lastTouchLoc);
        cc.log('delta: ' + delta);
        if (delta.y > 100) {
            this.anims[this.animIdx].resume();
            this.arrow.stop();
            this.arrow.node.opacity = 0;
            this.isPaused = false;
            if (this.isLastPlayed) {
                if (window._hmt)
                    window._hmt.push(['_trackEvent', 'progress', 'finish']);
                return;
            }

            var newIdx = this.animIdx + 1;
            if (newIdx < this.anims.length) {
                this.anims[newIdx].node.active = true;
                this.anims[newIdx].anim.play();
                this.animIdx = newIdx;
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
