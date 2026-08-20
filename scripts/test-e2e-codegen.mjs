import { spawn } from 'node:child_process';

const host = '127.0.0.1';
const port = '4173';
const baseURL = `http://${host}:${port}`;
const defaultViewport = '1920,1080';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const run = (command, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: options.stdio || 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '0',
      PORT: process.env.PORT || port,
    },
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      reject(new Error(`${command} ${args.join(' ')} exited with signal ${signal}`));
      return;
    }

    if (code !== 0) {
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      return;
    }

    resolve();
  });

  child.on('error', reject);
});

const waitForServer = (child) => new Promise((resolve, reject) => {
  let settled = false;

  const handleReady = (chunk) => {
    const output = chunk.toString();
    process.stdout.write(output);
    if (!settled && output.includes(`shotplot test server listening on ${baseURL}`)) {
      settled = true;
      resolve();
    }
  };

  child.stdout.on('data', handleReady);
  child.stderr.on('data', (chunk) => process.stderr.write(chunk.toString()));

  child.on('exit', (code, signal) => {
    if (!settled) {
      reject(new Error(`test server exited before becoming ready (code=${code}, signal=${signal})`));
    }
  });

  child.on('error', reject);
});

let serverProcess;

const stopServer = () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill('SIGTERM');
  }
};

process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

process.on('SIGTERM', () => {
  stopServer();
  process.exit(143);
});

try {
  await run(npmCommand, ['run', 'test:e2e:build']);

  serverProcess = spawn('node', ['scripts/serve-dist.mjs'], {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: process.env.PORT || port,
    },
  });

  await waitForServer(serverProcess);

  const extraArgs = process.argv.slice(2);
  const hasViewportOverride = extraArgs.some((arg) => arg.startsWith('--viewport-size'));
  const codegenArgs = [
    'playwright',
    'codegen',
    baseURL,
    '--target=playwright-test',
    ...(hasViewportOverride ? [] : [`--viewport-size=${defaultViewport}`]),
    ...extraArgs,
  ];

  await run(npxCommand, codegenArgs);
} finally {
  stopServer();
}
