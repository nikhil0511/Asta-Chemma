var app = angular.module("gameModule", []);
app.controller("gameboard", ["$scope", function ($scope) {
    $scope.count = [];
    $scope.nextAttemptChance = [0, 1, 4, 6, 8];
    $scope.playDisabled = false;
    $scope.randowSelectedNumber = 0;
    $scope.zeroCount = 0;
    $scope.oneCount = 0;
    $scope.fourCount = 0;
    $scope.sixCount = 0;
    $scope.eightCount = 0;
    $scope.otherNumber = 0;
    $scope.canCoinDropArray = [];
    
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
	$scope.incrementScoreBoard = function (caseStr) {
        console.log("Entered updateScoreBoardFunction : ",caseStr);
        $scope.randowSelectedNumber = caseStr;
        switch (caseStr) {
            case 0:
                $scope.zeroCount++;
                break;
            case 1:
                $scope.oneCount++;
                break;
            case 4:
                $scope.fourCount++;
                break;
            case 6:
                $scope.sixCount++;
                break;
            case 8:
                $scope.eightCount++;
                break;
            default:
                $scope.otherNumber = caseStr;
                $scope.playDisabled = true;
                break;
        }
		$scope.count.push(caseStr);
    };
	
	$scope.decrementScoreBoard = function (caseStr) {
        console.log("Entered updateScoreBoardFunction : ",caseStr);
        $scope.randowSelectedNumber = caseStr;
		switch (caseStr) {
            case 0:
                $scope.zeroCount--;
                break;
            case 1:
                $scope.oneCount--;
                break;
            case 4:
                $scope.fourCount--;
                break;
            case 6:
                $scope.sixCount--;
                break;
            case 8:
                $scope.eightCount--;
                break;
            default:
                $scope.otherNumber = 0;
                break;
        }
    
    	var index = $scope.count.indexOf(caseStr);
		if (index > -1) {
			$scope.count.splice(index, 1);
		}
		
		if($scope.count.length == 0) {
			$scope.playDisabled = false;
		}
	
$scope.allowDrop = function(ev){
		ev.preventDefault();
    };
	$scope.drag = function(ev){
		ev.dataTransfer.setData("text", $(ev.target).parent("span.playerCoinContainer").attr("id"));
		ev.dataTransfer.setData("playerText", $(ev.target).parent("span.playerCoinContainer").attr("player"))
    };
	$scope.drop = function(ev){
		ev.preventDefault();
		console.log("Value of dropped area is : ",$(ev.target).hasClass(".canDrop"));
		if($(ev.target).hasClass("canDrop")) {
			console.log("Entered into condition");
			var coinId = ev.dataTransfer.getData("text");
			var playerText = ev.dataTransfer.getData("playerText")
			$(ev.target).append($("#"+coinId+"[player='"+playerText+"']"));
			$("#"+coinId+"[player='"+playerText+"']").attr("currentposition", $(ev.target).parents(".gameCellBoxes").attr("position"));
			var result = $.grep($scope.canCoinDropArray, function(e){ 
				return e.position == $(ev.target).parents(".gameCellBoxes").attr("position"); 
			});
			$scope.decrementScoreBoard(result[0].strikeValue);
		}
    };
}]);

function allowDrop(ev) {
    ev.preventDefault();
	angular.element(document.getElementById("gameContainer")).scope().allowDrop(ev);
}

function drag(ev) {
	angular.element(document.getElementById("gameContainer")).scope().drag(ev);
}

function drop(ev) {
	ev.preventDefault();
	angular.element(document.getElementById("gameContainer")).scope().drop(ev);
}
