import { IModule } from 'angular';

import { ReduxApi } from '../miq-redux/redux-typings';

interface MiqAngular {
  app: IModule;
  rxSubject: any;
}

declare global {

  /**
   * `ManageIQ` runtime global, holding application-specific objects.
   */
  namespace ManageIQ {
    const angular: MiqAngular;
    let redux: ReduxApi; // initialized by miq-redux pack
    let gridChecks: any;
    const controller: any;
    const constants: any;
    const qe: any;
    let gtl: any;
  }

  /**
   * This global is available when running tests with Jasmine.
   */
  const jasmine: any;

  const miqHttpInject: (module: any) => void;

  const angular: any;

  const _: any;

  const __: any;

  const miqTreeExpandRecursive: any;

  const $: any;

  const miqInitMainContent: any;

  const miqSparkleOn: any;

  const sprintf: any;

  const add_flash: any;
}
