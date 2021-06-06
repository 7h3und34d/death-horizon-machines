import { MachineConfig } from 'xstate';

export interface States {
  states: {
    init: {};
    filtering: {};
    noMatch: {};
    failure: {};
    empty: {};
    'show-results': {};
  }
}

export type Events = 
  | { type: 'done.invoke.filtering', data: any }
  | { type: 'error.invoke.filtering', data: Error }
  | { type: 'CLEAR_FILTER' }
  | { type: 'FILTER' }
  | { type: 'RETRY' };

export const machineConfig: MachineConfig<undefined, States, Events> = {
  id: 'table',
  initial: 'init',
  states: {
    init: {
      always: [
        { target: 'empty', cond: 'hasNoResults' },
        { target: 'show-results' },
      ]
    },
    empty: {},
    'show-results': {
      on: {
        FILTER: {
          target: 'filtering',
          actions: ['updateFilter'],
        },
        CLEAR_FILTER: {
          target: 'filtering',
          actions: ['removeFilters'],
        },
      },
    },
    noMatch: {
      on: {
        CLEAR_FILTER: {
          target: 'filtering',
          actions: ['removeFilters'],
        }
      }
    },
    filtering: {
      invoke: {
        src: 'filterData',
        onDone: {
          target: 'init',
          actions: ['storeResults'],
        },
        onError: {
          target: 'failure',
          actions: ['storeError'],
        },
      }
    },
    failure: {
      on: {
        RETRY: 'filtering'
      }
    },
  }
};

