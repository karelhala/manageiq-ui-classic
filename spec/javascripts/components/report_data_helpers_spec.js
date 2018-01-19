describe('report-data', function() {
  var translateFunc = jasmine.createSpy('__').and.callFake(function() {return 'translated'}),
  flashFunc = jasmine.createSpy('add_flash'), sprintfFunc = jasmine.createSpy('sprintf'),
  expandTreeFunc = jasmine.createSpy('miqTreeExpandRecursive'),
  miqInitMainContent = jasmine.createSpy('miqInitMainContent');
  var treeId = 'widgets_treebox';
  beforeEach(module('ManageIQ.report_data'));

  describe('helpers', function() {
    var mockedFunctions = {};
    beforeEach(inject(function($injector) {
      $injector.get('MOCKED_FUNCTIONS').forEach(function(funcName) {
        mockedFunctions[funcName] = $injector.get(funcName);
      });
      __ = translateFunc;
      add_flash = flashFunc;
      sprintf = sprintfFunc;
      miqTreeExpandRecursive = expandTreeFunc;
      miqInitMainContent = miqInitMainContent;
    }));

    it('isAllowedParent should return false for different controller', function() {
      ManageIQ.controller = 'pxe';
      expect(mockedFunctions.isAllowedParent('action_tree')).toBe(false);
      expect(mockedFunctions.isAllowedParent('something_strange')).toBe(false);
    });

    it('isAllowedParent should return true for different controller', function() {
      ManageIQ.controller = 'something_strange';
      expect(mockedFunctions.isAllowedParent('something_strange')).toBe(true);
    });

    it('translateColumns should call translate function to all text columns', function() {
      var columns = [{text: 'something'}, {b: 'b'}, {text: 'something else'}];
      mockedFunctions.translateColumns(columns);
      expect(translateFunc.calls.count()).toEqual(2);
      expect(columns[0].text).toBe('translated');
      expect(columns[2].text).toBe('translated');
    });

    it('displayMessages should call add_flash function for all messages', function() {
      mockedFunctions.displayMessages(['some', 'messages', 'to', 'be', 'displayed']);
      expect(flashFunc.calls.count()).toEqual(5);
    });

    it('calculateStart should return correct start', function() {
      expect(mockedFunctions.calculateStart({perpage: 20, current: 1})).toBe(0);
      expect(mockedFunctions.calculateStart({perpage: 20, current: 2})).toBe(20);
    });

    it('calculateSortId should return correct index', function() {
      var cols = [
        {some: 'text'},
        {some: 'text'},
        {col_idx: 0},
        {col_idx: 1},
        {col_idx: 2}
      ];
      expect(mockedFunctions.calculateSortId(cols, 2)).toBe(4);
      expect(mockedFunctions.calculateSortId(cols, "1")).toBe(3);
    });

    it('calculateSortId should return -1 for wrong index', function() {
      var cols = [
        {some: 'text'},
        {some: 'text'},
        {col_idx: 0},
        {col_idx: 1},
        {col_idx: 2}
      ];
      expect(mockedFunctions.calculateSortId(cols, 5)).toBe(-1);
    });

    it('defaultShowUrl should not change if not empty', function() {
      expect(mockedFunctions.defaultShowUrl('/some_controller/show', false)).toBe('/some_controller/show');
    });

    it('defaultShowUrl should change if not empty', function() {
      expect(mockedFunctions.defaultShowUrl('/vm/policies', true)).toBe('/vm_infra/policies');
      expect(mockedFunctions.defaultShowUrl('/vm/something', true)).toBe('/vm_cloud/something');
    });

    it('defaultShowUrl should change if empty', function() {
      ManageIQ.controller = 'some_ctrl'
      expect(mockedFunctions.defaultShowUrl('', false)).toBe('/some_ctrl/show/');
      expect(mockedFunctions.defaultShowUrl('', true)).toBe('/some_ctrl/x_show/');
      expect(mockedFunctions.defaultShowUrl('false', true)).toBe(false);
    });

    it('tileViewSelector should return correct element', function() {
      document.querySelector('body').appendChild(document.createElement('miq-tile-view'));
      expect(mockedFunctions.tileViewSelector().localName).toBe('miq-tile-view');
    });

    it('tableViewSelector should return correct element', function() {
      document.querySelector('body').appendChild(document.createElement('miq-data-table'));
      expect(mockedFunctions.tableViewSelector().localName).toBe('miq-data-table');
    });

    it('initEndpoints should init correct endpoints', function() {
      var EndpointService = {endpoints: {}};
      ManageIQ.controller = 'some_ctl';
      ManageIQ.constants.reportData = 'report_data';
      mockedFunctions.initEndpoints(EndpointService);
      expect(EndpointService.rootPoint).toBe('/some_ctl');
      expect(EndpointService.endpoints.listDataTable).toBe('/report_data');
    });

    it('isCurrentControllerOrPolicies should return true', function() {
      ManageIQ.controller = 'some_ctl';
      expect(mockedFunctions.isCurrentControllerOrPolicies(['/', 'something', 'policies'])).toBe(true);
      expect(mockedFunctions.isCurrentControllerOrPolicies(['/', 'some_ctl'])).toBe(true);
    });

    it('defaultPaging should return correct object', function() {
      var defaultPaging = mockedFunctions.defaultPaging();
      expect(defaultPaging.enabled).toBe(true);
      expect(defaultPaging.hidden).toBe(false);
      expect(defaultPaging.text).toBe(10);
      expect(defaultPaging.value).toBe(10);
      expect(defaultPaging.labelItems).toBe('translated');
      expect(translateFunc).toHaveBeenCalledWith('Items');
      expect(defaultPaging.items.length).toBe(6);
      defaultPaging.items.forEach(function(item) {
        expect(item.hidden).toBe(false);
        expect(item.enabled).toBe(true);
        expect(item.value).toBe(item.text);
        expect(item.id).toBe('per_page_' + item.text);
      });
    });

    it('activateNodeSilently should call expand tree with correct ids', function() {
      var mockedTree = document.createElement('div');
      mockedTree.innerHTML = '<div class="collapse in"><div id="' + treeId + '" class="treeview"></div></div>';
      document.querySelector('body').appendChild(mockedTree);
      var itemId = 5;

      mockedFunctions.activateNodeSilently(itemId);
      expect(expandTreeFunc).toHaveBeenCalledWith(treeId, itemId);
    });

    describe('setExtraClasses should set correct classes', function() {
      beforeEach(function() {
        var mockedDiv = document.createElement('div');
        mockedDiv.innerHTML = '<div id="main-content" class="miq-sand-paper miq-list-content some-class">'+
        '<div id="paging_div"><div class="miq-pagination"></div></div></div>';
        document.querySelector('body').appendChild(mockedDiv);
      });

      it('no view type', function() {
        mockedFunctions.setExtraClasses();
        var mainContent = document.querySelector('body #main-content');
        expect(mainContent.classList.toString()).toBe('some-class');
        expect(mainContent.classList.length).toBe(1);
        expect(mainContent.querySelector('.miq-pagination').style.display).toBe("none");
      });

      it('view type grid', function() {
        mockedFunctions.setExtraClasses('grid');
        var mainContent = document.querySelector('body #main-content');
        expect(mainContent.querySelector('.miq-pagination').style.display).toBe("block");
        expect(mainContent.classList.toString()).toBe('some-class miq-sand-paper');
      });

      it('view type grid', function() {
        mockedFunctions.setExtraClasses('list');
        var mainContent = document.querySelector('body #main-content');
        expect(mainContent.querySelector('.miq-pagination').style.display).toBe("block");
        expect(mainContent.classList.toString()).toBe('some-class miq-list-content');
      });
    });

    it('translateTotalOf should have been called with correct texts', function() {
      var start = 1, end = 20, total = 150;
      mockedFunctions.translateTotalOf(start, end, total);
      expect(sprintfFunc).toHaveBeenCalledWith('translated', start + 1, end + 1, total);
      expect(translateFunc).toHaveBeenCalledWith('%d - %d of %d');
    });

    it('loadComplete should set correct glpbal variables', function() {
      mockedFunctions.loadComplete(1, 1);
      expect(ManageIQ.gtl.loading).toBe(false);
      expect(ManageIQ.gtl.isFirst).toBe(true);
      expect(ManageIQ.gtl.isLast).toBe(true);
      mockedFunctions.loadComplete(1, 5);
      expect(ManageIQ.gtl.isFirst).toBe(true);
      expect(ManageIQ.gtl.isLast).toBe(false);
      mockedFunctions.loadComplete(2, 5);
      expect(ManageIQ.gtl.isFirst).toBe(false);
      expect(ManageIQ.gtl.isLast).toBe(false);
      mockedFunctions.loadComplete(5, 5);
      expect(ManageIQ.gtl.isFirst).toBe(false);
      expect(ManageIQ.gtl.isLast).toBe(true);
    });

    describe('move pagination function', function() {

      xit('should call miqInitMainContent', function(done) {
        mockedFunctions.movePagination();
        setTimeout(function() {
          expect(miqInitMainContent).toHaveBeenCalled();
          done();
        });
      });

      it('should add correct narrow classes', function(done) {
        var mockedDiv = document.createElement('div')
          mockedDiv.innerHTML = '<table>'+
          '<tr><td class="narrow"></td></tr>'+
          '<tr><td></td></tr>'+
          '<tr><td class="narrow"></td></tr>'+
          '</table>';
          document.querySelector('body').appendChild(mockedDiv);
          mockedFunctions.movePagination();
        setTimeout(function() {
          expect(document.querySelectorAll('.narrow').length).toBe(0);
          expect(document.querySelectorAll('.table-view-pf-select').length).toBe(2);
          done();
        });
      });
    });
  });
});
