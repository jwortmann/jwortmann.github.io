var count = 2;                        // Zählvariable für die Gegner

// Funktion zur Berechnung der Gewinnwahrscheinlichkeiten bei zwei gegebenen TTR-Werten
function gewinnwahrscheinlichkeit(ttr1, ttr2) {
    return 1/(1+Math.pow(10, (ttr2 - ttr1)/150));
}

angular.module('myApp', [])
    .controller('myController', ['$scope', function($scope) {
        $scope.aenderungskonstante = "16";
        $scope.new_ttr0 = "";
        $scope.veraenderung0 = "";

        $scope.opponents = [
            {nr:1, ttr:"", gw:"", gw_display:"", new_ttr:"", veraenderung:""},
            {nr:2, ttr:"", gw:"", gw_display:"", new_ttr:"", veraenderung:""}
        ];
 
        $scope.addOpponent = function() {
            count++;
            $scope.opponents.push({nr:count, ttr:"", gw:"", gw_display:"", new_ttr:"", veraenderung:""});
        };

        $scope.calculate = function() {
            // alle berechneten Ausgabewerte löschen
            $scope.new_ttr0 = "";
            $scope.veraenderung0 = "";
            for (var i = 0; i < $scope.opponents.length; i++) {
                $scope.opponents[i].gw = "";
                $scope.opponents[i].gw_display = "";
                $scope.opponents[i].new_ttr = "";
                $scope.opponents[i].veraenderung = "";
            }

            // Eingabefelder überprüfen
            if (isNaN($scope.current_ttr) || $scope.current_ttr < 0 || $scope.current_ttr > 9999) {
                $("input[name='input1']").parent().parent().addClass("has-error");
            } else {
                $("input[name='input1']").parent().parent().removeClass("has-error");
            }

            for (var i = 0; i < $scope.opponents.length; i++) {
                var j = i+1;
                if (isNaN($scope.opponents[i].ttr) || $scope.opponents[i].ttr < 0 || $scope.opponents[i].ttr > 9999) {
                    $("input[name='opponent" + j + "']").parent().parent().addClass("has-error");
                } else {
                    $("input[name='opponent" + j + "']").parent().parent().removeClass("has-error");
                }
            }

            if (!isNaN($scope.current_ttr) && $scope.current_ttr > 0 && $scope.current_ttr < 10000) {
                var anz_opponents = 0; // Anzahl eingetragener Gegner
                var sum_gw = 0;        // Summe der Gewinnwahrscheinlichkeiten

                // Gewinnwahrscheinlichkeit berechnen
                for (var i = 0; i < $scope.opponents.length; i++) {
                    if (!isNaN($scope.opponents[i].ttr) && $scope.opponents[i].ttr > 0 && $scope.opponents[i].ttr < 10000) {
                        anz_opponents++;
                        // exakte Gewinnwahrscheinlichkeit
                        $scope.opponents[i].gw = gewinnwahrscheinlichkeit($scope.current_ttr, $scope.opponents[i].ttr);
                        // Gewinnwahrscheinlichkeiten summieren
                        sum_gw += $scope.opponents[i].gw;
                        // gerundete Gewinnwahrscheinlichkeit
                        $scope.opponents[i].gw_display = Math.round($scope.opponents[i].gw * 1000) / 1000;
                    }
                }

                // neue TTR-Werte berechnen
                if (anz_opponents > 0 && !isNaN($scope.aenderungskonstante) && $scope.aenderungskonstante > 0) {
                    // neuer TTR-Wert bei 0 Siegen
                    $scope.new_ttr0 = Math.round(eval($scope.current_ttr - $scope.aenderungskonstante * sum_gw));
                    // Veränderung bei 0 Siegen
                    $scope.veraenderung0 = $scope.new_ttr0 - $scope.current_ttr;
                    if ($scope.veraenderung0 < 0) {
                        $scope.veraenderung0 = "(".concat($scope.veraenderung0.toString()).concat(")");
                    } else {
                        $scope.veraenderung0 = "(+".concat($scope.veraenderung0.toString()).concat(")");
                    }

                    // neuer TTR-Wert bei i>0 Siegen
                    for (var i = 1; i <= anz_opponents; i++) {
                        $scope.opponents[i-1].new_ttr = Math.round(eval($scope.current_ttr - $scope.aenderungskonstante * (sum_gw - i)));
                        $scope.opponents[i-1].veraenderung = $scope.opponents[i-1].new_ttr - $scope.current_ttr;
                        if ($scope.opponents[i-1].veraenderung < 0) {
                            $scope.opponents[i-1].veraenderung = "(".concat($scope.opponents[i-1].veraenderung.toString()).concat(")");
                        } else {
                            $scope.opponents[i-1].veraenderung = "(+".concat($scope.opponents[i-1].veraenderung.toString()).concat(")");
                        }
                    }
                }
            }
        };
    }]);