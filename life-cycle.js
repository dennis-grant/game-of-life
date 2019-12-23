var dkg = (function(module) {
    var PULSE_PERIOD = 40;

    var LifeCycle = function(_pond) {
        var self = this;

        this.pond = _pond;
        this.isRunning = false;
        this.runningIntervalId = undefined;
        this.displayPond();

        this.pulse = function() {
            self.pond.cycle();
       };
    };

    LifeCycle.prototype = {
        start: function() {
            this.runningIntervalId = setInterval(this.pulse, PULSE_PERIOD);
            this.isRunning = true;
        },

        stop: function() {
            if (this.isRunning == true) {
                clearInterval(this.runningIntervalId);
                this.runningIntervalId = undefined;
                this.isRunning = false;
            }
        },

        displayPond: function() {
            $("body").append(this.pond.$el);
        },

        invertLivingCells: function() {
            this.pond.invertLivingCells();
        },

        wipeThemOut: function() {
            this.pond.killAllLivingCells();
        }
    };

    module.LifeCycle = LifeCycle;

    return module;

})(dkg || {});
