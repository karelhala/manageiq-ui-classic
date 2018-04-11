import 'angular-mocks';
import * as commonActions from '../packs/toolbar-actions-common';
import * as refreshActions from '../toolbar-actions/refresh';
import fetch from './fetch';

describe('Toolbar actions', () => {
  beforeEach(() => {
    angular.mock.module('miq.api');
  });

  describe('gridChecks', () => {
    beforeEach(() => {
      window.ManageIQ.gridChecks = [];
    });

    it('should use ManageIQ.gridChecks if any present', () => {
      window.ManageIQ.gridChecks = ['something', '15586'];
      expect(commonActions.getGridChecks()).toEqual([{ id: 'something' }, { id: '15586' }]);
    });

    it('should use ManageIQ.record if no gridChecks', () => {
      window.ManageIQ.record = { recordId: 'something' };
      expect(commonActions.getGridChecks()).toEqual([{ id: 'something' }]);
    });
  });

  describe('API refresh', () => {
    let add_flash;

    beforeEach(() => {
      add_flash = jasmine.createSpy('add_flash');
      window.add_flash = add_flash;
    });

    test('should send correct data', async () => {
      expect.assertions(3);
      const data = await refreshActions.APIRefresh('example_entity', [{id: 'rr'}, {id: '5'}]);
      expect(data.url).toBe('/api/example_entity')
      expect(data.options.body.action).toBe('refresh');
      expect(data.options.body.resources).toEqual([{id: 'rr'}, {id: '5'}]);
    });

    test('should call correct functions', async () => {
      expect.assertions(1);
      const data = await refreshActions.APIRefresh('example_entity', [{id: 'rr'}, {id: '5'}]);
      expect(add_flash).toHaveBeenCalled();
    });
  });
});
