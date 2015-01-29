(function(){
    angular.module('app',['ui.bootstrap'])
    .factory('azureConfig', [function () {
        var client = new WindowsAzure.MobileServiceClient('https://mcvclicenciamento.azure-mobile.net/', 'GfnDwsbCakIOvLUBpvCIXaVIgdIgrr58') 
        var get = function(table,query){
            var table = client.getTable(table)
            if(query)return table.read(query);
            else return table.read(query);
        }
        var insert = function(table,item){
            var table = client.getTable(table)
            return table.insert(item)
        }
        var del = function (table,item){
            var table = client.getTable(table)
            return table.del({id:item.id})
        }
        var update = function(table,item){

        }
        return {
            client:client,
            get:get,
            insert:insert,
            update:update,
            del:del
        };
    }])
    .directive('listItems', [function () {
        return {
            restrict: 'EA',
            require:['?table'],
            link:function(scope,element,attr){
                scope.table = attr.table
                scope.load()
            },
            controller:function($scope,azureConfig){
                $scope.load = function(){
                    $scope.get($scope.table).then(function(items){
                        $scope.$apply(function(){
                            $scope.items = items
                        })
                    })
                }
                $scope.get = azureConfig.get;
              $scope.remove = function(item){
                    azureConfig.del($scope.table,item).then($scope.load)
              }
              $scope.$on('refresh-items',$scope.load)
            },
            template:'<div class="">'+
                        '<h3>{{table}}</h3>'+
                        '<alert ng-repeat="item in items" type="success" close="remove(item)">{{item.name}}</alert>'+
                        '<alert data-ng-if="!items.length" type="info">Nenhum registro</alert>'+
                    '</div>'
        };
    }])
    .directive('listItemsForm', [function () {
        return {
            restrict: 'EA',
            require:['?models','?typeModels','?table'],
            link:function(scope,element,attr){
                scope.models = attr.models.split(',')
                scope.typeModels = attr.typeModels.split(',')
                scope.table = attr.table
            },
            controller:function($scope,azureConfig){
                $scope.item = {}
                $scope.reset = function(form) {
                    if (form) {
                      form.$setPristine();
                      form.$setUntouched();
                    }
                };
                $scope.insert = function(item){
                    azureConfig.insert($scope.table,item).then(function(item){
                        $scope.$emit('refresh-items',item)
                        $scope.item = {}
                    })
                }
            },
            template:'<form name="form" novalidate class="col-md-12">'+
                        '<div class="form-group" data-ng-repeat="model in models">'+
                           '<label class="control-label" for="{{model}}">{{model}}</label>'+
                           '<div class="controls class="col-md-12"">'+
                                '<input placeholder="{{model}}" data-ng-model="item[models[$index]]" type="{{typeModels[$index]}}"/>'+
                           '</div>'+
                        '</div>'+
                        '<div ng-if="!form.$valid">'+
                           'Há algo errado com o formulario'+
                        '</div>'+
                        '<input type="button" class="btn btn-primary" ng-click="reset(form)" value="Reset" />'+
                        '<input type="submit" data-ng-if="form.$valid && form.$dirty" class="btn btn-primary" ng-click="insert(item)" value="Save" />'+
                     '</form>'
        };
    }])
    .directive("loadingIndicator", function () {
        return {
            restrict: "A",
            template: '<progressbar class="progress-striped active" value="100" type="info">Loading....</progressbar>',
            link: function (scope, element, attrs) {
                scope.$on("loading-started", function (e) {
                    element.css({ "display": "" });
                });
                scope.$on("loading-complete", function (e) { 
                    element.css({ "display": "none" }); 
                });

            }
        }})
    .config(function ($httpProvider) {$httpProvider.interceptors.push(function ($q, $rootScope) {return {'request': function (config) {$rootScope.$broadcast('loading-started');return config || $q.when(config);},'response': function (response) {$rootScope.$broadcast('loading-complete');return response || $q.when(response)}}})});
})()