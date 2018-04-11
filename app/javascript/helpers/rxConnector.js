import { listenToRx } from '../miq_observable';

function callMapperFunction(eventMapper, event) {
  return Object.prototype.hasOwnProperty.call(eventMapper, event.type)
    && eventMapper[event.type](event.payload);
}

export function subscribeToRx(eventMapper) {
  listenToRx(event => event.type && !event.controller && callMapperFunction(eventMapper, event));
}

/**
 * Event types are stored here.
 */
export const DELETE_EVENT = 'delete'; // Reacts to event - {type: 'delete', payload: {...}}
export const REFRESH_EVENT = 'refresh'; // Reacts to event - {type: 'refresh', payload: {...}}
