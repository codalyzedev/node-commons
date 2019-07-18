import * as express from 'express';

declare module 'express' {
  interface Request {
    id?: any
    currentUser?: any
  }
}
