import { describe, expect, spyOn, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SiteDeploy } from './site-deploy.mjs';

const CONFIG = {
  appId: 'd000000000000',
  region: 'ca-central-1',
  domain: 'site.example',
  roles: {},
  requiredHeaders: { 'x-content-type-options': 'nosniff' },
  probes: [{ path: '/', contains: 'Welcome', contentTypes: ['text/html'] }],
};

function fakeTools(responses = {}) {
  const calls = [];
  const fetched = [];
  const logs = [];
  const jobStates = [...(responses.jobStates ?? [])];
  const pages = responses.pages ?? {};
  return {
    calls,
    fetched,
    logs,
    tools: {
      run: (command, args, options) => {
        calls.push([command, ...args]);
        if (command === 'zip') return SiteDeploy.run(command, args, options);
        if (args[1] === 'create-deployment') return JSON.stringify({ jobId: '7', zipUploadUrl: 'https://upload.example/zip' });
        if (args[1] === 'get-job') return JSON.stringify({ job: { summary: { status: jobStates.shift() } } });
        if (args[1] === 'get-app') return JSON.stringify({ app: { customHeaders: responses.policy ?? '' } });
        return '';
      },
      fetch: async (url, options = {}) => {
        fetched.push([url, options.method ?? 'GET']);
        const page = pages[url.split('?')[0]] ?? { status: 404, body: '' };
        return new Response(page.body, { status: page.status ?? 200, headers: page.headers ?? {} });
      },
      sleep: async () => {},
      log: (line) => logs.push(line),
    },
  };
}

function siteDirectory() {
  const directory = mkdtempSync(join(tmpdir(), 'site-deploy-'));
  mkdirSync(join(directory, 'docs'));
  writeFileSync(join(directory, 'index.html'), '<h1>Welcome</h1>');
  writeFileSync(join(directory, 'docs', 'index.html'), '<h1>Docs</h1>');
  return directory;
}

describe('SiteDeploy.package', () => {
  test('builds the same zip twice from the same site and records the version', () => {
    const output = mkdtempSync(join(tmpdir(), 'site-zip-'));
    const site = new SiteDeploy(fakeTools().tools);
    const first = site.package(siteDirectory(), '26.46.01', 'abc123', join(output, 'first.zip'));
    const second = site.package(siteDirectory(), '26.46.01', 'abc123', join(output, 'second.zip'));
    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  test('writes site-version.json into the site', () => {
    const directory = siteDirectory();
    new SiteDeploy(fakeTools().tools).package(directory, '26.46.01', 'abc123', join(mkdtempSync(join(tmpdir(), 'site-zip-')), 'site.zip'));
    expect(JSON.parse(readFileSync(join(directory, 'site-version.json'), 'utf8'))).toEqual({ version: '26.46.01', commit: 'abc123' });
  });

  test('stores the files in sorted order with no directory entries', () => {
    const zip = join(mkdtempSync(join(tmpdir(), 'site-zip-')), 'site.zip');
    new SiteDeploy(fakeTools().tools).package(siteDirectory(), '26.46.01', 'abc123', zip);
    expect(SiteDeploy.run('unzip', ['-Z1', zip]).trim().split('\n')).toEqual(['docs/index.html', 'index.html', 'site-version.json']);
  });
});

describe('SiteDeploy.verify', () => {
  test('accepts the matching checksum', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'site-sum-')), 'a.zip');
    writeFileSync(file, 'zip');
    const site = new SiteDeploy(fakeTools().tools);
    expect(() => site.verify(file, `${site.checksum(file)}\n`)).not.toThrow();
  });

  test('rejects a different checksum', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'site-sum-')), 'a.zip');
    writeFileSync(file, 'zip');
    expect(() => new SiteDeploy(fakeTools().tools).verify(file, '0'.repeat(64))).toThrow('SHA-256');
  });
});

describe('SiteDeploy.checkHeaders', () => {
  test('accepts a policy whose folded value contains the required header', () => {
    const policy = "customHeaders:\n  - pattern: '**/*'\n    headers:\n      - key: X-Content-Type-Options\n        value: >-\n          nosniff\n";
    expect(() => new SiteDeploy(fakeTools({ policy }).tools).checkHeaders(CONFIG)).not.toThrow();
  });

  test('names the headers the live policy lacks', () => {
    expect(() => new SiteDeploy(fakeTools({ policy: '' }).tools).checkHeaders(CONFIG)).toThrow('x-content-type-options');
  });

  test('reads the policy with GetApp only', () => {
    const fake = fakeTools({ policy: 'x-content-type-options nosniff' });
    new SiteDeploy(fake.tools).checkHeaders(CONFIG);
    expect(fake.calls).toEqual([['aws', 'amplify', 'get-app', '--app-id', CONFIG.appId, '--region', 'ca-central-1', '--output', 'json']]);
  });
});

describe('SiteDeploy.deploy', () => {
  test('uploads the zip, starts the job and waits until it succeeds', async () => {
    const zip = join(mkdtempSync(join(tmpdir(), 'site-up-')), 'site.zip');
    writeFileSync(zip, 'zip');
    const fake = fakeTools({ jobStates: ['RUNNING', 'SUCCEED'], pages: { 'https://upload.example/zip': { status: 200, body: '' } } });
    await new SiteDeploy(fake.tools).deploy(CONFIG, 'staging', zip);
    expect(fake.calls.map((call) => call[2])).toEqual(['create-deployment', 'start-deployment', 'get-job', 'get-job']);
    expect(fake.calls[1]).toContain('7');
    expect(fake.fetched).toEqual([['https://upload.example/zip', 'PUT']]);
  });

  test('fails when the Amplify job fails', async () => {
    const zip = join(mkdtempSync(join(tmpdir(), 'site-up-')), 'site.zip');
    writeFileSync(zip, 'zip');
    const fake = fakeTools({ jobStates: ['FAILED'], pages: { 'https://upload.example/zip': { status: 200, body: '' } } });
    await expect(new SiteDeploy(fake.tools).deploy(CONFIG, 'production', zip)).rejects.toThrow('FAILED');
  });

  test('fails before starting when the upload is refused', async () => {
    const zip = join(mkdtempSync(join(tmpdir(), 'site-up-')), 'site.zip');
    writeFileSync(zip, 'zip');
    const fake = fakeTools({ pages: { 'https://upload.example/zip': { status: 403, body: '' } } });
    await expect(new SiteDeploy(fake.tools).deploy(CONFIG, 'staging', zip)).rejects.toThrow('HTTP 403');
    expect(fake.calls.map((call) => call[2])).toEqual(['create-deployment']);
  });
});

describe('SiteDeploy.liveVersion', () => {
  test('reads the version the branch serves', async () => {
    const fake = fakeTools({ pages: { 'https://staging.site.example/site-version.json': { body: '{"version":"26.46.01"}' } } });
    expect(await new SiteDeploy(fake.tools).liveVersion(CONFIG, 'staging')).toBe('26.46.01');
  });

  test('is empty when the site has no version file yet', async () => {
    expect(await new SiteDeploy(fakeTools().tools).liveVersion(CONFIG, 'production')).toBe('');
  });
});

describe('SiteDeploy.probe', () => {
  test('passes when the version, content, type and headers match', async () => {
    const fake = fakeTools({
      pages: {
        'https://site.example/site-version.json': { body: '{"version":"26.46.01"}' },
        'https://site.example/': { body: 'Welcome', headers: { 'content-type': 'text/html; charset=utf-8', 'x-content-type-options': 'nosniff' } },
      },
    });
    await new SiteDeploy(fake.tools).probe(CONFIG, 'production', '26.46.01');
    expect(fake.logs.at(-1)).toBe('https://site.example serves 26.46.01; 1 probes passed');
  });

  test('lists every failed check', async () => {
    const fake = fakeTools({
      pages: {
        'https://site.example/site-version.json': { body: '{"version":"26.46.01"}' },
        'https://site.example/': { body: 'Other', headers: { 'content-type': 'text/plain' } },
      },
    });
    await expect(new SiteDeploy(fake.tools).probe(CONFIG, 'production', '26.46.01')).rejects.toThrow(
      'Probes failed: / lacks "Welcome"; / has content type text/plain; / lacks header x-content-type-options',
    );
  });

  test('fails when the branch never serves the new version', async () => {
    const fake = fakeTools({ pages: { 'https://staging.site.example/site-version.json': { body: '{"version":"26.45.07"}' } } });
    await expect(new SiteDeploy(fake.tools).probe(CONFIG, 'staging', '26.46.01')).rejects.toThrow('does not serve 26.46.01');
  });
});

describe('SiteDeploy.origin', () => {
  test('serves production from the domain itself', () => {
    expect(new SiteDeploy(fakeTools().tools).origin(CONFIG, 'production')).toBe('https://site.example');
  });

  test('serves staging from its subdomain', () => {
    expect(new SiteDeploy(fakeTools().tools).origin(CONFIG, 'staging')).toBe('https://staging.site.example');
  });
});

function configFile() {
  const path = join(mkdtempSync(join(tmpdir(), 'site-config-')), 'site-deploy.json');
  writeFileSync(path, JSON.stringify(CONFIG));
  return path;
}

function liveSite() {
  return {
    'https://upload.example/zip': { status: 200, body: '' },
    'https://staging.site.example/site-version.json': { body: '{"version":"26.46.01"}' },
    'https://staging.site.example/': { body: 'Welcome', headers: { 'content-type': 'text/html', 'x-content-type-options': 'nosniff' } },
  };
}

async function printed(argv, fake) {
  const log = spyOn(console, 'log').mockImplementation(() => {});
  await SiteDeploy.main(argv, new SiteDeploy(fake.tools));
  const output = log.mock.calls.at(-1)?.[0];
  log.mockRestore();
  return output;
}

describe('SiteDeploy.main', () => {
  test('package prints the zip checksum', async () => {
    const output = await printed(['package', siteDirectory(), '26.46.01', 'abc123', join(mkdtempSync(join(tmpdir(), 'site-zip-')), 's.zip')], fakeTools());
    expect(output).toMatch(/^[0-9a-f]{64}$/);
  });

  test('verify confirms a matching checksum', async () => {
    const file = join(mkdtempSync(join(tmpdir(), 'site-sum-')), 'a.zip');
    writeFileSync(file, 'zip');
    expect(await printed(['verify', file, new SiteDeploy(fakeTools().tools).checksum(file)], fakeTools())).toBe('verified');
  });

  test('check-headers reads the config file', async () => {
    expect(await printed(['check-headers', configFile()], fakeTools({ policy: 'x-content-type-options: nosniff' }))).toBe('header policy covers the required headers');
  });

  test('deploy runs the Amplify deployment', async () => {
    const zip = join(mkdtempSync(join(tmpdir(), 'site-up-')), 'site.zip');
    writeFileSync(zip, 'zip');
    expect(await printed(['deploy', configFile(), 'staging', zip], fakeTools({ jobStates: ['SUCCEED'], pages: liveSite() }))).toBe('deployed');
  });

  test('live-version prints the served version', async () => {
    expect(await printed(['live-version', configFile(), 'staging'], fakeTools({ pages: liveSite() }))).toBe('26.46.01');
  });

  test('probe reports the probes passed', async () => {
    expect(await printed(['probe', configFile(), 'staging', '26.46.01'], fakeTools({ pages: liveSite() }))).toBe('probes passed');
  });

  test('an unknown command prints the usage', async () => {
    await expect(SiteDeploy.main(['publish'], new SiteDeploy(fakeTools().tools))).rejects.toThrow('Usage');
  });
});

describe('SiteDeploy.run', () => {
  test('returns the standard output of a command', () => {
    expect(SiteDeploy.run('printf', ['ready'])).toBe('ready');
  });

  test('fails when the command fails', () => {
    expect(() => SiteDeploy.run('false', [])).toThrow('false failed');
  });

  test('live tools are wired to the real process', () => {
    expect(SiteDeploy.live().tools.run).toBe(SiteDeploy.run);
  });
});
