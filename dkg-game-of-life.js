var dkg = (function(module) {

	function game_of_life_funcs(POND_WIDTH, POND_HEIGHT) {
		var cellInPond = _.partial(cellInBounds, POND_WIDTH, POND_HEIGHT);
		var cachedCellNeighbors = _.memoize(cellNeighbors);

		function nextGeneration(livingCells) {
			var allDeadNeighbors = [];
			var nextGenCells = _.reduce(livingCells, function(nextGen, cell) {
				var deadNeighbors = _.difference(cachedCellNeighbors(cell), livingCells);
				allDeadNeighbors = _.union(allDeadNeighbors, deadNeighbors);
				if (_.contains([5, 6], _.size(deadNeighbors))) {
					nextGen.push(cell);
				}

				return nextGen;
			}, []);

			return _.reduce(allDeadNeighbors, function(nextGen, cell) {
				if (_.size(_.intersection(livingCells, cachedCellNeighbors(cell))) == 3) {
					nextGen.push(cell);
				}

				return nextGen;
			}, nextGenCells);
		}

		function cellNeighbors(cell) {
			var cells = mapCombined([-1, 0, 1], [-1, 0, 1], function(deltaX, deltaY) {
				return (asPoint(cell).x + deltaX) + ':' + (asPoint(cell).y + deltaY);
			});

			return _.map(_.without(cells, cell), function(c) {
				return cellInPond(c);
			});
		}

		function asPoint(cell) {
			return _.object(['x', 'y'], _.map(cell.split(':'), function(v) { return parseInt(v) }));
		}

		function cellInBounds(width, height, cell) {
			var p = asPoint(cell);
			p.x = (p.x < 1) ? width + p.x : p.x;
			p.x = (p.x > width) ? p.x - width : p.x;
			p.y = (p.y < 1) ? height + p.y : p.y;
			p.y = (p.y > height) ? p.y - width : p.y;

			return p.x + ':' + p.y;
		}

		function mapCombined(list_a, list_b, iterFunc) {
			return _.reduce(list_a, function(results, item_a) {
				return _.union(results, _.map(list_b, function(item_b) { return iterFunc(item_a, item_b); }));
			}, []);
		}

        function symetric_difference(list_a, list_b) {
          return _.difference(_.union(list_a, list_b), _.intersection(list_a, list_b));
        }

		return {
			nextGeneration: nextGeneration,
			cellNeighors: cellNeighbors,
			cachedCellNeighbors: cachedCellNeighbors,
			mapCombined: mapCombined,
			symetric_difference: symetric_difference
		};
	}

	module.game_of_life_funcs = game_of_life_funcs;

	return module;

})(dkg || {});
