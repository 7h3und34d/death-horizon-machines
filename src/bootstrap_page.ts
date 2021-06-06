import { MachineConfig } from 'xstate';

interface States {
  states: {
    loading: {};
    success: {
      states: {
        init: {};
      }
    };
    failure: {};
  }
}

export type Events = 
  | { type: 'done.invoke.loading', data: any }
  | { type: 'error.invoke.loading', data: Error }
  | { type: 'RETRY' };

const machineConfig: MachineConfig<undefined, States, Events> = {
  id: 'bootstrap-page',
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: ['storeResults'],
        },
        onError: {
          target: 'failure',
          actions: ['storeError'],
        }
      }
    },
    success: {
      type: 'final',
    },
    failure: {
      on: {
        RETRY: 'loading',
      }
    }
  }
};
