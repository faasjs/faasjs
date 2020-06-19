/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Server } from '../index';
import { IncomingMessage } from 'http';

describe('server', function () {
  test('init', function () {
    const server = new Server(process.cwd() + '/funcs');

    expect(server.root).toEqual(process.cwd() + '/funcs/');
    expect(server.opts).toEqual({ cache: false });
  });

  test('hello', async function () {
    const server = new Server(__dirname + '/funcs');

    let res;

    const promise = new Promise(function (resolve) {
      res = {
        statusCode: null,
        body: null,
        headers: {},
        write (body) {
          this.body = body;
        },
        end () {
          resolve();
        },
        setHeader (key, value) {
          this.headers[key as string] = value;
        }
      };
      void server.processRequest({
        url: '/hello',
        headers: {},
        on (event, handler) {
          handler();
        },
        read: () => true
      } as IncomingMessage, res);
    });

    await promise;

    expect(res.body).toEqual('{"data":"hello"}');
  });

  test('a', async function () {
    const server = new Server(__dirname + '/funcs');

    let res;

    const promise = new Promise(function (resolve) {
      res = {
        statusCode: null,
        body: null,
        headers: {},
        write (body) {
          this.body = body;
        },
        end () {
          resolve();
        },
        setHeader (key, value) {
          this.headers[key as string] = value;
        }
      };
      void server.processRequest({
        url: '/a',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      } as IncomingMessage, res);
    });

    await promise;

    expect(res.body).toEqual('{"data":"a"}');
  });

  test('404', async function () {
    const server = new Server(__dirname + '/funcs');

    let res;

    const promise = new Promise(function (resolve) {
      res = {
        statusCode: null,
        body: null,
        headers: {},
        write (body) {
          this.body = body;
        },
        end () {
          resolve();
        },
        setHeader (key, value) {
          this.headers[key as string] = value;
        }
      };
      void server.processRequest({
        url: '/404',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      } as IncomingMessage, res);
    });

    await promise;

    expect(res.statusCode).toEqual(500);
  });

  test('500', async function () {
    const server = new Server(__dirname + '/funcs');

    let res;

    const promise = new Promise(function (resolve) {
      res = {
        statusCode: null,
        body: null,
        headers: {},
        write (body) {
          this.body = body;
        },
        end () {
          resolve();
        },
        setHeader (key, value) {
          this.headers[key as string] = value;
        }
      };
      void server.processRequest({
        url: '/error',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      } as IncomingMessage, res);
    });

    await promise;

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"error"}}');
  });
});
