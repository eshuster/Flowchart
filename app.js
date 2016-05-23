
//
// Define the 'app' module.
//
angular.module('app', ['flowChart', 'ngContextMenu'])

//
// Simple service to create a prompt.
//
.factory('prompt', function () {

	/* Uncomment the following to test that the prompt service is working as expected.
	return function () {
		return "Test!";
	}
	*/

	// Return the browsers prompt function.
	return prompt;
})

//
// Application controller.
//
.controller('AppCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

	//
	// Code for the delete key.
	//
	var deleteKeyCode = 46;

	//
	// Code for control key.
	//
	var ctrlKeyCode = 17;

	//
	// Set to true when the ctrl key is down.
	//
	var ctrlDown = false;

	//
	// Code for A key.
	//
	var aKeyCode = 65;

	//
	// Code for esc key.
	//
	var escKeyCode = 27;

	//
	// Selects the next node id.
	//
	// var nextNodeID = 10;
	var nextNodeID = 1;
	var yIncrement = 10


	var chartDataModel = {
		nodes: [{
			id: 1,
			x: 650.00,
			y: 10,
			name: 'nodeName',
			description: "",
			orgType: null,
			status: null,
			organizationType: null,
			parentId: nextNodeID,
			companyId: null,
			subOrganizations: [],
			description: null,
			inputConnectors: [{}],
			outputConnectors: [{}],
		}],
     // connections: [{}]
   };

	//
	// Event handler for key-down on the flowchart.
	//
	$scope.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Event handler for key-up on the flowchart.
	//
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			//
			// Delete key.
			//
			$scope.chartViewModel.deleteSelected();
		}

		if (evt.keyCode == aKeyCode && ctrlDown) {
			//
			// Ctrl + A
			//
			$scope.chartViewModel.selectAll();
		}

		if (evt.keyCode == escKeyCode) {
			// Escape.
			$scope.chartViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;

			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Add a new node to the chart.
	//
	$scope.addNewNode = function () {

		var nodeName = prompt("Enter a node name:", "New node");
		if (!nodeName) {
			return;
		}

		//
		// Template for a new node.
		//
		var newNodeDataModel = {
			name: nodeName,
			id: nextNodeID++,
			x: 200,
			y: 50,
			inputConnectors: [{}],
			outputConnectors: [{}],
		};
		$scope.chartViewModel.addNode(newNodeDataModel);
	};


	//
	// Delete selected nodes and connections.
	//
	$scope.deleteSelected = function () {

		$scope.chartViewModel.deleteSelected();
	};

	$scope.functionList = [
	{
		name: 'Add New Node'
	},
	{
		name: 'Delete Selected',
	},
	{
		name: 'Save'
	}
	]

	$scope.clickMenu = function (item) {
		if (item.name === "Add New Node"){
       // $scope.chart
       // console.log($scope)
       $scope.addNewNode()
     } else if (item.name === "Delete Selected") {
     	$scope.deleteSelected()
     } else {
     	$scope.savedOrg = $scope.orgChart
     	$localStorage.orgChart = $scope.savedOrg
     	$scope.createJSON();
     }
   };

   $scope.createJSON = function() {
   	var connectionArray = $scope.chartViewModel.data.nodes
   	var jsonArray = []

   	for (connection = 0; connection < connectionArray.length; connection++) {
   		jsonStructure = {
   			description: "",
   			status: "ACTIVE",
   			organizationType: 1,
   			nodeID: connectionArray[connection].id,
   			parentId: connectionArray[connection].parentId,
   			subOrganizations: [],
   		}
   		jsonArray.push(jsonStructure)
   	}
   	setTimeout(function(){
   		$scope.createTree(jsonArray)
   	}, 200)
   }

  $scope.createTree = function(nodes){
    var nodesList = nodes;
    var hier = [];

    for (var i = 0; i<nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeID != 1) {
        var parentNode = Utils.searchArray(nodes, node.parentId, "nodeID");

        if (parentNode) {
          parentNode.subOrganizations.push(node);
        }
      }

    }
    // console.log(hier)
    $scope.jsonStructure = nodes[0];
}

 $scope.$on('orgChart', function(event, data){
     $scope.orgChart = JSON.parse(data)
  })

	//
	// Create the view-model for the chart and attach to the scope.
	//
	$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
}])
;