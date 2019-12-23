var dkg = (function(module) {
    var Pond = function(_width, _height, _cellWidth, _cellHeight) {
        this.width = _width;
        this.height = _height;
        this.cellWidth = (_cellWidth == undefined) ? 12 : _cellWidth;
        this.cellHeight = (_cellHeight == undefined) ? 12 : _cellHeight;
        this.game_of_life_funcs = module.game_of_life_funcs(this.width, this.height);
        this.allCells = this.game_of_life_funcs.mapCombined(_.range(this.width), _.range(this.height), function(x, y) {
            return (x + 1) + ':' + (y + 1);
        });
        this.livingCells = [];
        this.$el = this.createElement();
    };

    Pond.prototype = {
        createElement: function() {
            var self = this;

            var templ = this.pond_template();
            
            var $pond_el = $(templ({
                width: this.width * (this.cellWidth + 1),
                height: this.height * (this.cellHeight + 1)
            }));

            templ = this.cell_template();
            _.each(this.allCells, function(c) {
                var $cell_el = $(templ({
                    id: c.replace(':', '_'),
                    width: self.cellWidth,
                    height: self.cellHeight
                }));
                $cell_el.click(_.bind(self.cellClicked, self));

                $pond_el.append($cell_el);
            });

            return $pond_el;
        },

        pond_template: function() {
            return _.template('<div class="pond" style="width: <%=width%>px; height: <%=height%>px;"></div>');
        },

        cell_template: function() {
            return _.template('<div id="<%=id%>" class="cell" style="width: <%=width%>px; height: <%=height%>px;"></div>');
        },

        cellClicked: function(e) {
            var $cell = $(e.target);
            var id = $cell.attr('id').replace('_', ':');
            $cell.toggleClass('alive');
            if (_.contains(this.livingCells, id)) {
                this.livingCells = _.without(livingCells, id);
            }
            else {
                this.livingCells.push(id);
            }
        },

        cycle: function() {
            this.replaceLivingCells(this.game_of_life_funcs.nextGeneration(this.livingCells));
        },

        killAllLivingCells: function() {
            this.$el.find('.alive').toggleClass('alive');
            this.livingCells = [];
        },

        replaceLivingCells: function(cells) {
          _.each(this.game_of_life_funcs.symetric_difference(this.livingCells, cells), function(c) {
            $('#' + c.replace(':', '_')).toggleClass('alive');
          });
          this.livingCells = cells;
        },

        addLivingCells: function(cells) {
          _.each(_.difference(cells, this.livingCells), function(c) {
            $('#' + c.replace(':', '_')).toggleClass('alive');
          });
          this.livingCells = _.union(this.livingCells, cells);
        },

        invertLivingCells: function() {
            var deadNeighbors = this._allDeadNeighbors();
            this.killAllLivingCells();
            console.log(deadNeighbors.join('|'));
            this.addLivingCells(deadNeighbors);
        },

        _allDeadNeighbors: function() {
            var self = this;
            return _.reduce(this.livingCells, function(deadNeighbors, cell) {
                return _.union(deadNeighbors, _.difference(self.game_of_life_funcs.cachedCellNeighbors(cell), self.livingCells));
            }, []);
        }
    };

    module.Pond = Pond;

    return module;
})(dkg || {});
