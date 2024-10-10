import { expect } from 'chai';
import { stub } from 'sinon';
import winston from 'winston';

const consoleDebugStub = stub(console, 'debug');
const consoleLogStub = stub(console, 'log');
const consoleInfoStub = stub(console, 'info');
const consoleErrorStub = stub(console, 'error');

const winstonDebugStub = stub(winston, 'debug');
const winstonInfoStub = stub(winston, 'info');
const winstonErrorStub = stub(winston, 'error');

import { Loggable } from './Loggable';

describe('loggable', function () {
  describe('console', function () {
    beforeEach(function () {
      consoleDebugStub.resetHistory();
      consoleLogStub.resetHistory();
      consoleInfoStub.resetHistory();
      consoleErrorStub.resetHistory();
    });

    it('should default to console logging', function () {
      class Foo extends Loggable() {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.log('log');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(consoleDebugStub.calledOnce).to.be.false;
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it('should hide configured internal logs', function () {
      class Foo extends Loggable(undefined, { internal: ['debug', 'log'] }) {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.log('log');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(consoleDebugStub.calledOnce).to.be.false;
      expect(consoleLogStub.calledOnce).to.be.false;
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it('should log internals', function () {
      class Foo extends Loggable(undefined, {
        internal: ['debug', 'log'],
        logInternals: true,
      }) {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.log('log');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(consoleDebugStub.calledOnce).to.be.true;
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });
  });

  describe('winston', function () {
    beforeEach(function () {
      winstonDebugStub.resetHistory();
      winstonInfoStub.resetHistory();
      winstonErrorStub.resetHistory();
    });

    it('should log to winston', function () {
      class Foo extends Loggable(undefined, { logger: winston }) {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.false;
      expect(winstonInfoStub.calledOnce).to.be.true;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });

    it('should hide configured internal logs', function () {
      class Foo extends Loggable(undefined, {
        internal: ['debug', 'info'],
        logger: winston,
      }) {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.false;
      expect(winstonInfoStub.calledOnce).to.be.false;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });

    it('should log internals', function () {
      class Foo extends Loggable(undefined, {
        internal: ['debug', 'info'],
        logger: winston,
        logInternals: true,
      }) {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.true;
      expect(winstonInfoStub.calledOnce).to.be.true;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });
  });

  describe('dynamic', function () {
    beforeEach(function () {
      consoleDebugStub.resetHistory();
      consoleLogStub.resetHistory();
      consoleInfoStub.resetHistory();
      consoleErrorStub.resetHistory();
    });

    it('should support settings change', function () {
      class Foo extends Loggable() {
        constructor(public bar = 'baz') {
          super();

          this.loggable.logger.debug('debug');
          this.loggable.logger.info('info');
          this.loggable.logger.error('error');
        }
      }

      const foo = new Foo();

      foo.setLoggable({ logInternals: true });

      consoleDebugStub.resetHistory();
      consoleLogStub.resetHistory();
      consoleInfoStub.resetHistory();
      consoleErrorStub.resetHistory();

      foo.loggable.logger.debug('debug');

      expect(consoleDebugStub.calledOnce).to.be.true;
    });
  });
});
