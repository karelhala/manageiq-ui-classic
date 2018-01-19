describe('report-data', function() {
  var configObj = {}, translateFunc = jasmine.createSpy('__').and.callFake(function() {return 'translated'}),
  flashFunc = jasmine.createSpy('add_flash');
  beforeEach(module('ManageIQ.report_data'));
  describe('controller', function() {
    var reportDataCtrl;
    beforeEach(function() {
      bindings = {
        config: configObj
      };
      angular.mock.inject(function($componentController) {
        tileController = $componentController('report-data', null, bindings);
      });
    });
  });

  describe('component', function() {
    var compile, scope;
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    }));
    beforeEach(function() {
      scope.config = configObj;
      compiledElement = compile(
        angular.element(
          '<report-data config="config"></report-data>'
        ))(scope);
      scope.$digest();
      scope.$apply();
    });
  });
})
