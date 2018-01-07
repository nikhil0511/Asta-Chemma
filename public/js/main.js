var app = angular.module("gameModule", []);
app.controller("gameboard", ["$scope", function ($scope) {
    $scope.count = [];
    $scope.nextAttemptChance = [0, 1, 4, 6, 8];
    $scope.playDisabled = false;
    $scope.randowSelectedNumber = 0;
    
    (function () {
        $.getJSON("data/moves.json", function(data) {
            $scope.$apply(function(){$scope.gameMoves = data;});
        });
    })();
    
    $.getJSON("data/board.json", function(data) {
        $scope.$apply(function(){$scope.boardData = data;});
    });
    
    $scope.coinHoverIn = function(event){
        if($scope.count.length > 0) {
            var startingPosition = angular.element(event.currentTarget).attr("startingpoint");
            var currentPosition = angular.element(event.currentTarget).attr("currentposition");
			angular.forEach($scope.count, function(value,index){
                console.log("Values that are selected is : ",value);
				if(currentPosition == "-1_-1") {
					$scope.findToBeHoveredCell(startingPosition, value);
				} else {
					$scope.findToBeHoveredCell(currentPosition, value);
				}
			});
        }
    };
	
	$scope.findToBeHoveredCell = function(currentPosition, strikeValue) {
		var newIndexValue = currentPosition;
		if(($scope.gameMoves.firstLevel.indexOf(currentPosition) + strikeValue) >= $scope.gameMoves.firstLevel.length) {
			newIndexValue = ($scope.gameMoves.firstLevel.indexOf(currentPosition) + strikeValue) - $scope.gameMoves.firstLevel.length;
		} else {
			newIndexValue = $scope.gameMoves.firstLevel.indexOf(currentPosition) + strikeValue;
		}
		angular.element(document.querySelectorAll('td[position="'+$scope.gameMoves.firstLevel[newIndexValue]+'"] div')).addClass('canDrop');
		$scope.canCoinDropArray.push({"position" : $scope.gameMoves.firstLevel[newIndexValue], "strikeValue":strikeValue});
	}
    $scope.coinHoverOut = function(event){
		angular.element(document.querySelectorAll('td div.canDrop')).removeClass("canDrop");
		$scope.canCoinDropArray = [];
    };
    
    $scope.rollShellsFunc = function() {
        var randomNumber = Math.floor(Math.random() * 8);
        if($scope.nextAttemptChance.indexOf(randomNumber) >= 0) {
            console.log("Next chance");
        } else {
            console.log("Done with your chance");
        }
        
        $scope.incrementScoreBoard(randomNumber);
    };
    
    	var index = $scope.count.indexOf(caseStr);
		if (index > -1) {
			$scope.count.splice(index, 1);
		}
		
		if($scope.count.length == 0) {
			$scope.playDisabled = false;
		}
