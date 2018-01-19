import ReportDataComponent from './report-data.component';
import * as HelperFunctions from './report-data.helpers';
import {APP_NAME} from './report-data.constants';

const app = angular.module(APP_NAME);
miqHttpInject(
  app.component('reportData', new ReportDataComponent)
);

/**
 * Enable helper functions to be accessed in jasmine tests.
 */
if (window['jasmine']) {
  Object.keys(HelperFunctions)
    .forEach(
      helperFuncKey => app.constant(helperFuncKey, HelperFunctions[helperFuncKey])
    );
}
