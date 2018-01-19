import { USE_TREE_ID,
         TREES_WITHOUT_PARENT,
         TREE_TABS_WITHOUT_PARENT,
         MAIN_CONTETN_ID,
         EXPAND_TREES,
         NUMBER_OF_COLS,
         TILE_VIEW_TAG,
         TABLE_VIEW_TAG } from './report-data.constants';

/**
 * 
 * @param initObject 
 */
export function isAllowedParent(activeTree) {
  return TREES_WITHOUT_PARENT.indexOf(ManageIQ.controller) === -1 &&
    TREE_TABS_WITHOUT_PARENT.indexOf(activeTree) === -1;
}

/**
 * 
 * @param columns 
 */
export function translateColumns(columns) {
  columns.forEach(col => col.text && (col.text = __(col.text)));
}

/**
 * 
 * @param messages 
 */
export function displayMessages(messages) {
  messages && messages.forEach((oneMessage) => add_flash(oneMessage.msg, oneMessage.level));
}

/**
 * 
 * @param settings 
 */
export function calculateStart(settings) {
  return (settings.current - 1) * settings.perpage;
}

/**
 * 
 * @param cols 
 * @param sortCol 
 */
export function calculateSortId(cols, sortCol) {
  return _.findIndex(cols, {col_idx: parseInt(sortCol, 10)});
}

/**
 * 
 * @param showUrl 
 * @param isExplorer 
 */
export function defaultShowUrl(showUrl: any, isExplorer: boolean): any {
  if (showUrl === '') {
    showUrl = '/' + ManageIQ.controller;
    if (isExplorer) {
      showUrl += '/x_show/';
    } else {
      showUrl += '/show/';
    }
  } else if (showUrl === 'false') {
    showUrl = false;
  }
  return calculateUrl(showUrl);
}

/**
 * 
 * @param url 
 */
export function calculateUrl(url: string): string {
  if (url) {
    let splitUrl = url.split('/');
    if (splitUrl && splitUrl[1] === 'vm') {
      splitUrl[1] = splitUrl[2] === 'policies' ? 'vm_infra' : 'vm_cloud';
      url = splitUrl.join('/');
    }
  }
  return url;
}

/**
 * 
 */
export function tileViewSelector() {
  return document.querySelector(TILE_VIEW_TAG);
}

/**
 * 
 */
export function tableViewSelector() {
  return document.querySelector(TABLE_VIEW_TAG);
}

/**
 * TODO: test
 * @param initObject 
 * @param item 
 */
export function constructSuffixForTreeUrl(showUrl, activeTree, item) {
  let itemId = _.isString(showUrl) && showUrl.indexOf('xx-') !== -1 ? '_-' + item.id : '-' + item.id;
  if (item.parent_id && item.parent_id[item.parent_id.length - 1] !== '-') {
    itemId = item.parent_id + '_' + item.tree_id;
  } else if (isAllowedParent(activeTree)) {
    itemId = (USE_TREE_ID.indexOf(ManageIQ.controller) === -1) ? '_' : '';
    itemId = itemId + item.tree_id;
  }
  return itemId;
}

/**
* Private method for setting rootPoint of MiQEndpointsService.
* @param {Object} MiQEndpointsService service responsible for endpoits.
* @returns {undefined}
*/
export function initEndpoints(MiQEndpointsService) {
  MiQEndpointsService.rootPoint = '/' + ManageIQ.controller;
  MiQEndpointsService.endpoints.listDataTable = '/' + ManageIQ.constants.reportData;
}

/**
 * 
 * @param splitUrl 
 */
export function isCurrentControllerOrPolicies(splitUrl) {
  return splitUrl && (splitUrl[1] === ManageIQ.controller || splitUrl[2] === 'policies');
}

/**
* Method for init paging component for GTL.
* Default paging has 5, 10, 20, 50, 100, 1000
* @returns {Object} pagination object.
*/
export function defaultPaging() {
  return {
    labelItems: __('Items'),
    enabled: true,
    text: 10,
    value: 10,
    hidden: false,
    items: [
      {id: 'per_page_5', text: 5, value: 5, hidden: false, enabled: true},
      {id: 'per_page_10', text: 10, value: 10, hidden: false, enabled: true},
      {id: 'per_page_20', text: 20, value: 20, hidden: false, enabled: true},
      {id: 'per_page_50', text: 50, value: 50, hidden: false, enabled: true},
      {id: 'per_page_100', text: 100, value: 100, hidden: false, enabled: true},
      {id: 'per_page_1000', text: 1000, value: 1000, hidden: false, enabled: true},
    ],
  };
}

/**
 * 
 * @param itemId 
 */
export function activateNodeSilently(itemId: number) {
  const treeId = angular.element('.collapse.in .treeview').attr('id');
  if (EXPAND_TREES.indexOf(treeId) !== -1) {
    miqTreeExpandRecursive(treeId, itemId);
  }
}

/**
 * 
 * @param viewType 
 */
export function setExtraClasses(viewType?: any) {
  const mainContent = document.getElementById(MAIN_CONTETN_ID);
  if (mainContent) {
    angular.element(mainContent).removeClass('miq-sand-paper');
    angular.element(mainContent).removeClass('miq-list-content');
    angular.element(document.querySelector('#paging_div .miq-pagination')).css('display', 'none');
    if (viewType && (viewType === 'grid' || viewType === 'tile')) {
      angular.element(document.querySelector('#paging_div .miq-pagination')).css('display', 'block');
      angular.element(mainContent).addClass('miq-sand-paper');
    } else if (viewType && viewType === 'list') {
      angular.element(mainContent).addClass('miq-list-content');
      angular.element(document.querySelector('#paging_div .miq-pagination')).css('display', 'block');
    }
  }
}

/**
 * 
 * @param start 
 * @param end 
 * @param total 
 */
export function translateTotalOf(start, end, total) {
  if (typeof start !== 'undefined' && typeof end !== 'undefined' && typeof total !== 'undefined') {
    return sprintf(__('%d - %d of %d'), start + 1, end + 1, total);
  }
  return start + ' - ' + end + ' of ' + total;
}

/**
 * 
 * @param current 
 * @param total 
 */
export function loadComplete(current, total) {
  ManageIQ.gtl.loading = false;
  ManageIQ.gtl.isFirst = current === 1;
  ManageIQ.gtl.isLast = current === total;
}

/**
 * 
 * @param dropdownClass 
 */
export function movePagination(dropdownClass) {
  setTimeout(() => {
    let sortItems = document.getElementsByTagName('miq-sort-items');
    if (sortItems) {
      angular.element(sortItems).addClass(dropdownClass);
    }
    $('table td.narrow').addClass('table-view-pf-select').removeClass('narrow');
    let pagination = document.getElementsByClassName('miq-pagination');
    let pagingDiv = document.querySelector('#paging_div');
    // If more than one angular pagination is present remove some left overs.
    if (pagination.length !== 1) {
      Array.prototype.forEach.call(pagination, function(index, item) {
        // keep the first one
        index !== 0 && item.remove();
      });
    }
    if (pagination && pagination.length > 0 && pagingDiv && $(pagingDiv).find(pagination).length !== 1) {
      let oldPagination = pagingDiv.querySelector('div');
      oldPagination ? oldPagination.remove() : null;

      let cols = NUMBER_OF_COLS;
      if ($('#form_buttons_div').css('display') !== 'none') {
        if ($('#form_buttons_div').children().length !== 0) {
          cols = 10;
        } else {
          $('#form_buttons_div').css('display', 'none');
        }
      }

      let col = $('<div class="col-md-' + cols + '"></div>');
      $(pagingDiv).append(col);
      col[0].appendChild(pagination[0]);
    }
    // calculates the height of main content from toolbar and footer, needed
    // to make sure the paginator is not off the screen
    miqInitMainContent();
  });
}
