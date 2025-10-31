import  EventEmitter  from 'events';

// Create and export a SINGLE, SHARED instance.
const appEmitter = new EventEmitter();

export default appEmitter;