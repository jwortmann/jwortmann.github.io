var count = 2;         // Zählvariable für die Gegner
var anz_opponents = 0; // Anzahl eingetragener Gegner
var sum_gw = 0;        // Summe der Gewinnwahrscheinlichkeiten

// Funktion zur Berechnung der Gewinnwahrscheinlichkeiten bei zwei gegebenen TTR-Werten
function Probability(ttr1, ttr2) {
    return 1/(1+Math.pow(10, (ttr2 - ttr1)/150));
}

angular.module('myApp', [])
    .controller('MyController', ['$scope', function($scope) {
        $scope.konst = 16;
        $scope.ttr0 = "";

        $scope.opponents = [
            {nr:1, ttr:"", gw:"", gw_round:"", newTTR:""},
            {nr:2, ttr:"", gw:"", gw_round:"", newTTR:""}
        ];
 
        $scope.addOpponent = function() {
            count++;
            $scope.opponents.push({nr:count, ttr:"", gw:"", gw_round:"", newTTR:""});
        };

        $scope.calculate = function() {
            // alle berechneten Ausgabewerte löschen
            $scope.ttr0 = "";
            for (var i = 0; i < $scope.opponents.length; i++) {
                $scope.opponents[i].gw = "";
                $scope.opponents[i].gw_round = "";
                $scope.opponents[i].newTTR = "";
            }

            anz_opponents = 0;
            sum_gw = 0;

            if (!isNaN($scope.currentTTR) && $scope.currentTTR > 0) {
                for (var i = 0; i < $scope.opponents.length; i++) {
                    if (!isNaN($scope.opponents[i].ttr) && $scope.opponents[i].ttr > 0) {
                        anz_opponents++;
                        $scope.opponents[i].gw = Probability($scope.currentTTR, $scope.opponents[i].ttr);
                        sum_gw += $scope.opponents[i].gw;
                        $scope.opponents[i].gw_round = Math.round($scope.opponents[i].gw * 1000) / 1000;
                    }
                }

                if (anz_opponents > 0) {
                    $scope.ttr0 = Math.round(eval($scope.currentTTR - $scope.konst * sum_gw));
                    for (var i = 1; i <= anz_opponents; i++) {
                        $scope.opponents[i-1].newTTR = Math.round(eval($scope.currentTTR - $scope.konst * (sum_gw - i)));
                    }
                }
            }
        };
    }]);