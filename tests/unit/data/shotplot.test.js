import { createRequire } from 'node:module';
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

const require = createRequire(import.meta.url);

const envKeys = ['ROOT_URL', 'ELEVENTY_ENV', 'GTMID'];
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
const modulePath = require.resolve('../../../src/site/_data/shotplot');
const dotenvPath = require.resolve('dotenv');
const originalDotenvModule = require.cache[dotenvPath];

const mockDotenv = () => {
  require.cache[dotenvPath] = {
    id: dotenvPath,
    filename: dotenvPath,
    loaded: true,
    exports: {
      config: () => ({}),
    },
  };
};

const restoreEnv = () => {
  envKeys.forEach((key) => {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  });
  if (originalDotenvModule) {
    require.cache[dotenvPath] = originalDotenvModule;
  } else {
    delete require.cache[dotenvPath];
  }
  delete require.cache[modulePath];
};

const loadShotplotConfig = () => {
  mockDotenv();
  delete require.cache[modulePath];
  return require(modulePath);
};

describe('shotplot data', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('maps environment variables into the exported config object', () => {
    process.env.ROOT_URL = 'https://shotplot.app';
    process.env.ELEVENTY_ENV = 'development';
    process.env.GTMID = 'GTM-TEST';

    expect(loadShotplotConfig()).toEqual({
      rootUrl: 'https://shotplot.app',
      environment: 'development',
      GTMID: 'GTM-TEST',
    });
  });

  it('returns undefined values when environment variables are absent', () => {
    envKeys.forEach((key) => {
      delete process.env[key];
    });

    expect(loadShotplotConfig()).toEqual({
      rootUrl: undefined,
      environment: undefined,
      GTMID: undefined,
    });
  });
});
