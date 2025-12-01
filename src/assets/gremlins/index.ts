// Gremlin asset exports
export { default as loginGremlin } from './login.png';
export { default as successGremlin } from './erfolg.png';
export { default as loadingGremlin } from './loadingbar.png';
export { default as hideGremlin } from './hide.png';
export { default as sleepGremlin } from './sleep.png';
export { default as mailGremlin } from './mail.png';
export { default as maintanceGremlin } from './maintance.png';
export { default as downGremlin } from './down.png';
export { default as buyGremlin } from './buy.png';
export { default as error404Gremlin } from './404.png';

// Gremlin object for easy access
import login from './login.png';
import erfolg from './erfolg.png';
import loadingbar from './loadingbar.png';
import hide from './hide.png';
import sleep from './sleep.png';
import mail from './mail.png';
import maintance from './maintance.png';
import down from './down.png';
import buy from './buy.png';
import error404 from './404.png';

export const gremlins = {
  login,
  success: erfolg,
  loading: loadingbar,
  hide,
  sleep,
  mail,
  maintenance: maintance,
  down,
  buy,
  error404,
};

export type GremlinType = keyof typeof gremlins;