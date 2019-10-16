import { Server } from '../index';

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
      server.processRequest({
        url: '/hello',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      }, res);
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
      server.processRequest({
        url: '/a',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      }, res);
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
      server.processRequest({
        url: '/404',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      }, res);
    });

    await promise;

    expect(res.statusCode).toEqual(404);
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
      server.processRequest({
        url: '/error',
        headers: {},
        on: (event, handler) => {
          handler();
        },
        read: () => true
      }, res);
    });

    await promise;

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('error');
  });
});
