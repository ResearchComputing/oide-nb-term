'use strict';

angular.module('sandstone.nbterm')

.factory('NotebookService', ['$http','$log',function($http,$log) {
  var nbCells = {
    cells: []
  };
  var kernelStatus = 'idle';
  var lastSave = '';

  return {
    cellsObj: nbCells,
    getKernelStatus: function() {
      return kernelStatus;
    },
    startKernel: function() {
      $http({
        url: '/nbterm/a/kernel/execute',
        method: 'POST',
        data: {
          operation: 'START_KERNEL'
        }
      }).success(function(data){
        $log.log(data);
        kernelStatus = 'idle';
      });
    },
    stopKernel: function() {
      $http({
        url: '/nbterm/a/kernel/execute',
        method: 'POST',
        data: {
          operation: 'SHUTDOWN_KERNEL'
        }
      }).success(function(data){
        $log.log(data);
        kernelStatus = 'stopped';
      });
    },
    executeCodeCell: function(cell) {
      $log.log(cell);
      $http({
        url: '/nbterm/a/kernel/execute',
        method: 'POST',
        data: {
          code: cell.input,
          operation: 'EXECUTE_CODE'
        }
      }).success(function(data){
        $log.log(data);
        cell.output = data.res[1].text;
        cell.running = false;
        cell.hasExecuted = true;
        kernelStatus = 'idle';
      });
    },
    openNotebook: function(filepath) {
      $http({
        url: '/nbterm/a/notebook',
        method: 'GET',
        params: {
          filepath: filepath
        }
      }).success(function(data) {
        $log.log(data);
        nbCells.cells = [];
        angular.forEach(data.cells, function(cell,index) {
          nbCells.cells.push(cell);
        });
      });
    },
    saveNotebook: function(cells,filepath) {
      $http({
        url: '/nbterm/a/notebook',
        method: 'POST',
        data: {
          cells: cells
        },
        params: {
          filepath: filepath
        }
      }).success(function(data){
        $log.log(data);
        lastSave = new Date();
      });
    }
  };
}]);
