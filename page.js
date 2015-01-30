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
            delete item.$$hashKey
            var table = client.getTable(table);
            return table.update(item);
        }
        return {
            client:client,
            get:get,
            insert:insert,
            update:update,
            del:del
        };
    }])
    .controller('BuiltInDirectivesController', ['$scope', function($scope){
        $scope.items = ngs
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
              $scope.updateThis = function(item){
                    $scope.$emit('update-item',item)
              }            
              $scope.$on('refresh-items',$scope.load)
            },
            template:'<div class="">'+
                        '<h3>{{table}}</h3>'+
                        '<alert ng-repeat="item in items" type="success" close="remove(item)">{{item.name}} <span class="glyphicon glyphicon-pencil" data-ng-click="updateThis(item)"></span></alert>'+
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
                $scope.addNew = false
                $scope.$on('update-item',function(currentScope,item){
                    $scope.item = item
                    $scope.addADD(true)
                    $scope.update=true
                })
                $scope.addADD = function(bool){
                    if(bool){
                        $scope.addNew = true
                        $scope.update = false
                    }
                    else{
                        $scope.item = {}
                        $scope.addNew = false
                    }
                }
                $scope.reset = function(form) {
                    if (form) {
                      form.$setPristine();
                      form.$setUntouched();
                    }
                };
                $scope.refresh = function(item){
                    $scope.$emit('refresh-items',item)
                    $scope.addADD(false)
                }
                $scope.insert = function(item){
                    var request
                    if($scope.update){
                        request = azureConfig.update($scope.table,item)
                    }else{
                        request = azureConfig.insert($scope.table,item)
                    }
                    request.then($scope.refresh)
                }
            },
            template:''+
                    '<button class="btn btn-primary" data-ng-if="!addNew" data-ng-click="addADD(true)">Add new</button>'+
                    '<button class="btn btn-primary" data-ng-if="addNew" data-ng-click="addADD(false)">Cancel</button>'+
                    '<form name="form" novalidate class="col-md-12" data-ng-if="addNew">'+
                        '<div class="form-group" data-ng-repeat="model in models">'+
                           '<label class="control-label" for="{{model}}">{{model}}</label>'+
                           '<div class="controls class="col-md-12"">'+
                                '<input placeholder="{{model}}" data-ng-model="item[models[$index]]" type="{{typeModels[$index]}}"/>'+
                           '</div>'+
                        '</div>'+
                        '<div ng-if="!form.$valid">'+
                           'Há algo errado com o formulario'+
                        '</div>'+
                        '<input type="button" data-ng-if="form.$dirty" class="btn btn-primary" ng-click="reset(form)" value="Reset" />'+
                        '<input type="submit" data-ng-if="form.$valid && form.$dirty || update" class="btn btn-primary" ng-click="insert(item)" value="Save" />'+
                     '</form>'
        };
    }])
    .directive('filterList',function(){
        return {
            restrict:'EA',
            controller:function($scope){
                $scope.items = ngs
            },
            template:''+
                    '<p><input type="text" data-ng-model="queryFilter"></p>'+
                    '<ul max-height="100px">'+
                        '<li data-ng-repeat="item in items | filter:queryFilter">{{item}}</li>'+
                    '</ul>'
        }
    })
    .filter('customFilter',function(){
        return function(items,expression,comparador){
            //logica aqui
            return items
        }
    })
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
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                'request': function (config) {
                    $rootScope.$broadcast('loading-started');
                    return config || $q.when(config);
                },
                'response': function (response) {
                    $rootScope.$broadcast('loading-complete');
                    return response || $q.when(response)
                }
            }
        })
    });
})()



var ngs = ['ngApp',
                            'ngBind',
                            'ngBindHtml',
                            'ngBindTemplate',
                            'ngBlur',
                            'ngChange',
                            'ngChecked',
                            'ngClass',
                            'ngClassEven',
                            'ngClassOdd',
                            'ngClick',
                            'ngCloak',
                            'ngController',
                            'ngCopy',
                            'ngCsp',
                            'ngCut',
                            'ngDblclick',
                            'ngDisabled',
                            'ngFocus',
                            'ngForm',
                            'ngHide',
                            'ngHref',
                            'ngIf',
                            'ngInclude',
                            'ngInit',
                            'ngKeydown',
                            'ngKeypress',
                            'ngKeyup',
                            'ngList',
                            'ngModel',
                            'ngModelOptions',
                            'ngMousedown',
                            'ngMouseenter',
                            'ngMouseleave',
                            'ngMousemove',
                            'ngMouseover',
                            'ngMouseup',
                            'ngNonBindable',
                            'ngOpen',
                            'ngOptions',
                            'ngPaste',
                            'ngPluralize',
                            'ngReadonly',
                            'ngRepeat',
                            'ngSelected',
                            'ngShow',
                            'ngSrc',
                            'ngSrcset',
                            'ngStyle',
                            'ngSubmit',
                            'ngSwitch',
                            'ngTransclude ']