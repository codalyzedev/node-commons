import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
// import * as monitor from 'pg-monitor';

export default (databaseUrl: string, disableMonitor?: boolean) => {
  const initOptions = {
    promiseLib: promise,
    error (error: Error) {
      return {...error, DB_ERROR: true};
    }
  };
  if (!disableMonitor) {
    // console.log('attached pg-monitor');
    // monitor.attach(initOptions);
  }
  const pgp = pgPromise(initOptions);
  const db = pgp(databaseUrl);

  return db;
};
