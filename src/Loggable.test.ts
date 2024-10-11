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
import { LoggableOptions } from './LoggableOptions';

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

          this.logger.debug('debug');
          this.logger.log('log');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      new Foo();

      expect(consoleDebugStub.calledOnce).to.be.false;
      expect(consoleLogStub.calledOnce).to.be.true;
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it('should hide disabled logs', function () {
      class Foo extends Loggable(undefined, console, {
        disabled: ['debug', 'log'],
      }) {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.log('log');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      new Foo();

      expect(consoleDebugStub.calledOnce).to.be.false;
      expect(consoleLogStub.calledOnce).to.be.false;
      expect(consoleInfoStub.calledOnce).to.be.true;
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it('should enable all', function () {
      class Foo extends Loggable(undefined, console, {
        disabled: ['debug', 'log'],
        enableAll: true,
      }) {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.log('log');
          this.logger.info('info');
          this.logger.error('error');
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
      class Foo extends Loggable(undefined, winston) {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.false;
      expect(winstonInfoStub.calledOnce).to.be.true;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });

    it('should hide disabled logs', function () {
      class Foo extends Loggable(undefined, winston, {
        disabled: ['debug', 'info'],
      }) {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.false;
      expect(winstonInfoStub.calledOnce).to.be.false;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });

    it('should enable all', function () {
      class Foo extends Loggable(undefined, winston, {
        disabled: ['debug', 'info'],
        enableAll: true,
      }) {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      new Foo();

      expect(winstonDebugStub.calledOnce).to.be.true;
      expect(winstonInfoStub.calledOnce).to.be.true;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });
  });

  describe('dynamic', function () {
    it('should support settings change', function () {
      class Foo extends Loggable() {
        constructor(public bar = 'baz') {
          super();

          this.logger.debug('debug');
          this.logger.info('info');
          this.logger.error('error');
        }
      }

      const foo = new Foo();

      foo.loggableOptions.enableAll = true;

      consoleDebugStub.resetHistory();
      consoleLogStub.resetHistory();
      consoleInfoStub.resetHistory();
      consoleErrorStub.resetHistory();

      foo.logger.debug('debug');

      expect(consoleDebugStub.calledOnce).to.be.true;
    });

    it('should support generic class', function () {
      function MyClass<Logger = Console>(
        logger: Logger = console as Logger,
        options?: LoggableOptions,
      ) {
        return class extends Loggable(undefined, logger, options) {
          myMethod() {
            this.logger.debug('debug log');
            this.logger.info('info log');
          }
        };
      }

      winstonDebugStub.resetHistory();
      winstonInfoStub.resetHistory();
      winstonErrorStub.resetHistory();

      const myInstance = new (MyClass(winston))();
      myInstance.myMethod();
      myInstance.logger.error('error log');

      expect(winstonDebugStub.calledOnce).to.be.false;
      expect(winstonInfoStub.calledOnce).to.be.true;
      expect(winstonErrorStub.calledOnce).to.be.true;
    });
  });
});
