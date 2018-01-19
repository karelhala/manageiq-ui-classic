import { CONTROLLER_NAME,
         MAIN_CONTETN_ID,
         DEFAULT_VIEW,
         TOOLBAR_CLICK_FINISH,
         BASIC_SETTINGS } from './report-data.constants';
import { tileViewSelector,
         tableViewSelector,
         constructSuffixForTreeUrl,
         initEndpoints,
         isCurrentControllerOrPolicies,
         defaultPaging,
         setExtraClasses,
         activateNodeSilently,
         movePagination,
         loadComplete,
         translateTotalOf,
         translateColumns,
         displayMessages,
         calculateUrl,
         calculateStart,
         calculateSortId,
         defaultShowUrl } from './report-data.helpers';
import { ReportDataInterface, GTLDataInterface } from './report-data.interface';

export default class ReportDataComponent {
  public templateUrl: string = '/static/angular/data-table.html.haml';
  public controller: any = ReportDataController;
  public controllerAs: string = 'dataCtrl';
  public bindings: any = {
    config: '<'
  };
}

class ReportDataController implements ReportDataInterface {
  public settings: any;
  public gtlData: GTLDataInterface;
  public config: any;
  public apiFunctions: any;
  public perPage: any;
  public gtlType: any;
  private subscription: any;
  public static $inject = [
    'MiQDataTableService',
    'MiQEndpointsService',
    '$timeout',
    '$window'
  ];

  constructor(private MiQDataTableService,
              private MiQEndpointsService,
              private $timeout,
              private $window) {
    initEndpoints(this.MiQEndpointsService);
    if (ManageIQ.qe && ManageIQ.qe.gtl && ManageIQ.qe.gtl.actionsToFunction) {
      this.apiFunctions = ManageIQ.qe.gtl.actionsToFunction.bind(this)();
    }
    this.subscribeToSubject();
    this.perPage = defaultPaging();
  }

  public $onChanges(changesObj: any) {
    if (changesObj.config) {
      this.initController();
    }
  }

  /**
   * FIXME: move calculation of url to ruby
   * @inheritdoc
   */
  public onItemClicked(item: any, event: any): boolean {
    event.stopPropagation();
    event.preventDefault();
    if (this.config.showUrl) {
      miqSparkleOn();
      let prefix = this.config.showUrl;
      let splitUrl = this.config.showUrl.split('/');
      if (item.parent_path && item.parent_id) {
        this.$window.DoNav(item.parent_path + '/' + item.parent_id);
      } else if (this.config.isExplorer && isCurrentControllerOrPolicies(splitUrl)) {
        let itemId = item.id;
        if (_.isString(this.config.showUrl) && this.config.showUrl.indexOf('?id=') !== -1) {
          itemId = constructSuffixForTreeUrl(this.config, item);
          activateNodeSilently(itemId);
        }
        if (itemId.indexOf('unassigned') !== -1) {
          prefix = '/' + ManageIQ.controller + '/tree_select/?id=';
        }
        let url = prefix + itemId;
        $.post(url).always(function() {
          setExtraClasses();
        }.bind(this));
      } else if (prefix !== "true") {
        let lastChar = prefix[prefix.length - 1];
        prefix = (lastChar !== '/' && lastChar !== '=') ? prefix + '/' : prefix;
        this.$window.DoNav(prefix + (item.long_id || item.id));
      }
    }
    return false;
  }

  /**
   * 
   * @inheritdoc
   */
  public onItemSelect(item: any, isSelected: any): void {
    if (typeof item !== 'undefined') {
      let selectedItem = _.find(this.gtlData.rows, {long_id: item.long_id});
      if (selectedItem) {
        selectedItem.checked = isSelected;
        selectedItem.selected = isSelected;
        this.$window.sendDataWithRx({rowSelect: selectedItem});
        if (isSelected) {
          ManageIQ.gridChecks.push(item.long_id);
        } else {
          const index = ManageIQ.gridChecks.indexOf(item.long_id);
          index !== -1 && ManageIQ.gridChecks.splice(index, 1);
        }
      }
    }
  }

  /**
   * 
   */
  private initObjects() {
    this.settings = this.settings || {};
    this.gtlData = { cols: [], rows: [] };
    this.gtlType = this.config.gtlType || DEFAULT_VIEW;
    this.config.modelName = decodeURIComponent(this.config.modelName);

    this.$window.ManageIQ.gtl = this.$window.ManageIQ.gtl || {};
    this.$window.ManageIQ.gtl.loading = true;
    this.settings.isLoading = true;
    
    ManageIQ.gridChecks = [];
    this.$window.sendDataWithRx({setCount: 0});
  }

  /**
   * 
   */
  private setDefaults() {
    this.settings.selectAllTitle = __('Select All');
    this.settings.sortedByTitle = __('Sorted By');
    this.settings.isLoading = false;
    this.settings.scrollElement = MAIN_CONTETN_ID;
    this.settings.dropdownClass = ['dropup'];
    this.settings.translateTotalOf = translateTotalOf;
    this.settings.translateTotalof = this.settings.translateTotalOf;
  }

  /**
   * 
   */
  private getData(): Promise<GTLDataInterface> {
    return this.MiQDataTableService
      .retrieveRowsAndColumnsFromUrl(this.config.modelName,
                                     this.config.activeTree,
                                     this.config.parentId,
                                     this.config.isExplorer,
                                     this.settings,
                                     this.config.records,
                                     this.config.additionalOptions)
      .then((gtlData) => {
        this.settings = gtlData.settings || BASIC_SETTINGS;
        this.settings.sort_col = this.settings.sort_col === -1 ? 0 : this.settings.sort_col;
        this.perPage.text = this.settings.perpage;
        this.perPage.value = this.settings.perpage;
        this.config.showUrl = defaultShowUrl(this.settings.url || this.config.showUrl, this.config.isExplorer)
        displayMessages(gtlData.messages);
        translateColumns(gtlData.cols);
        return gtlData;
    });
  }

  /**
   * 
   */
  private initController(): Promise<GTLDataInterface> {
    this.initObjects();
    setExtraClasses(this.config.gtlType);
    return this.getData()
      .then((data: GTLDataInterface) => {
        this.gtlData = data;
        this.settings.hideSelect = this.config.hideSelect;
        this.setPaging(calculateStart(this.settings), this.settings.perpage);
        this.setSort(calculateSortId(this.gtlData.cols, this.settings.sort_col), this.settings.sort_dir === 'ASC');
        this.setDefaults();
        movePagination(this.settings.dropdownClass[0]);
        this.$timeout(() => loadComplete(this.settings.current, this.settings.total));
        return data;
    });
  }


  /**
   * 
   * @param headerId 
   * @param isAscending 
   */
  private setSort(headerId, isAscending): void {
    if (headerId !== -1 && this.gtlData.cols[headerId]) {
      this.settings.sortBy = {
        sortObject: this.gtlData.cols[headerId],
        isAscending: isAscending,
      };
    }
  }

  /**
   * 
   * @param start 
   * @param perPage 
   */
  private setPaging(start, perPage): void {
    this.perPage.value = perPage;
    this.perPage.text = perPage + ' ' + this.perPage.labelItems;
    this.settings.perpage = perPage;
    this.settings.startIndex = start;
    this.settings.current = ( start / perPage) + 1;
  }

  /**
   * 
   */
  private onUnsubscribe() {
    this.subscription.dispose();
  }

  /**
   * 
   */
  private subscribeToSubject() {
    this.subscription = ManageIQ.angular.rxSubject.subscribe(
      (event) => this.subscribeFunctions(event),
      (err) => console.error('Angular RxJs Error: ', err),
      () => console.debug('Angular RxJs subject completed, no more events to catch.')
    );
  }

  /**
   * 
   * @param event 
   */
  private subscribeFunctions(event) {
    if (event.initController && event.initController.name === CONTROLLER_NAME) {
      this.config = event.initController.data
      this.initController();
    } else if (event.refreshData && event.refreshData.name === CONTROLLER_NAME) {
      this.initController();
    } else if (event.unsubscribe && event.unsubscribe === CONTROLLER_NAME) {
      this.onUnsubscribe();
    } else if (event.toolbarEvent && (event.toolbarEvent === 'itemClicked')) {
      setExtraClasses();
    } else if (event.type === TOOLBAR_CLICK_FINISH && (tileViewSelector() || tableViewSelector())) {
      setExtraClasses(this.config.gtlType);
    } 
  }
}
