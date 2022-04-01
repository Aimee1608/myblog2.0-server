
import dev from './dev'
import prod from './prod'
const env = process.env.NODE_ENV || 'dev';

let config = dev
if(env ==='prod'){
  config = prod
}

// const config = Reflect.get(configs,env);
// console.log('config', config)
export default config;
