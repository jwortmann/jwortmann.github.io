var count = 2;

function cgw(ttr1, ttr2) {
    return 1/(1+Math.pow(10, (ttr2 - ttr1)/150));
}

angular.module('myApp', [])
    .controller('myController', ['$scope', function($scope) {
        $scope.ak = "16";

        $scope.opp = [
            {n:1, ttr:"", gw:"", gwr:""},
            {n:2, ttr:"", gw:"", gwr:""}
        ];

        $scope.wins = [
            {n:0, ttr:"", dttr:""},
            {n:1, ttr:"", dttr:""},
            {n:2, ttr:"", dttr:""}
        ];
 
        $scope.add = function() {
            count++;
            $scope.opp.push({n:count, ttr:"", gw:"", gwr:""});
            $scope.wins.push({n:count, ttr:"", dttr:""});
        };

        $scope.calc = function() {
            // alle berechneten Ausgabewerte löschen
            for (var i = 0; i < $scope.opp.length; i++) {
                $scope.opp[i].gw = "";
                $scope.opp[i].gwr = "";
            }

            for (var i = 0; i < $scope.wins.length; i++) {
                $scope.wins[i].ttr = "";
                $scope.wins[i].dttr = "";
            }

            if (!isNaN($scope.ttr0) && $scope.ttr0 > 0) {
                var nopp = 0;  // Anzahl eingetragener Gegner
                var gwsum = 0; // Summe der Gewinnwahrscheinlichkeiten

                // Schleife über alle Gegner
                for (var i = 0; i < $scope.opp.length; i++) {
                    if (!isNaN($scope.opp[i].ttr) && $scope.opp[i].ttr > 0) {
                        nopp++;
                        // exakte Gewinnwahrscheinlichkeit berechnen
                        $scope.opp[i].gw = cgw($scope.ttr0, $scope.opp[i].ttr);
                        // Gewinnwahrscheinlichkeiten aufsummieren
                        gwsum += $scope.opp[i].gw;
                        // gerundete Gewinnwahrscheinlichkeit
                        $scope.opp[i].gwr = (Math.round($scope.opp[i].gw * 1000) / 10).toString().concat(" %");
                    }
                }

                // neue TTR-Werte berechnen
                if (nopp > 0) {
                    for (var i = 0; i <= nopp; i++) {
                        $scope.wins[i].ttr = Math.round(eval($scope.ttr0 - $scope.ak * (gwsum - i)));
                        $scope.wins[i].dttr = $scope.wins[i].ttr - $scope.ttr0;
                        if ($scope.wins[i].dttr < 0) {
                            $scope.wins[i].dttr = $scope.wins[i].dttr.toString();
                        } else {
                            $scope.wins[i].dttr = "+".concat($scope.wins[i].dttr.toString());
                        }

                    }
                }
            }
        };
    }]);