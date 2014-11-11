app.directive("egonetGraph", function($http) {
    return {
        restrict: "E",
        scope: {
            selectedNode: '=',
            xDim: '@',
            yDim: '@'
        },
        template:"<div id=\"egonetGraph\" class=\"egonet\"></div>",
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            var args = {"jsonrpc":"2.0",
                        "method":"egonet",
                        "params":{
                            "source":$scope.selectedNode,
                            "strings":true,
                            "incident_edges":true,
                            "get_etypes":true
                        }, "id":1};

            var config = {
                "headers": {
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            };

            var promise = $http.post('http://' + window.location.hostname + ':8088/jsonrpc', args, config);

            promise.success(function(data,status,headers,config) {
                var nodes = [];
                var edges = [];

                for (var i=0; i < data.result["egonet"].length; i++) {
                    var n1 = data.result["egonet"][i][0];
                    var n2 = data.result["egonet"][i][1];

                    edges.push([Number(n1),Number(n2)])
                }


                for (var i=0; i < data.result["vertices"].length; i++) {
                    var nodeID = Number(data.result["vertices"][i]);
                    var nodeStr = data.result["vertices_str"][i];


                    var size = 1;
                    var c = 2.5;

                    if (nodeStr == $scope.selectedNode) {
                        size = 10;
                        c = 1.5;
                    }

                    nodes.push({
                        id: nodeID,
                        text: nodeStr,
                        size: size,
                        cluster: c
                    });
                }

                var el = document.getElementById("egonetGraph");

                var options =  {
                    width: $scope.xDim,
                    height: $scope.yDim,
                    collisionAlpha: 0.5,
                    colors: { "1": "blue", "2": "red", "3": "green" }
                };


                var g = new Insights(el,nodes,edges,options).render();

                g.on("node:click", function(d) {
                    // Fill in with on-click event
                });

                g.tooltip("<div>{{text}}</div>");
            });
        }],
        link: function(scope, element, attrs) {
        }
    };
});