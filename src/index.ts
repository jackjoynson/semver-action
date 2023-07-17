import * as core from '@actions/core';
import * as semver from 'semver';

async function run() {
  try {
    const currentVersion = core.getInput('current_version');
    const bumpLevel = core.getInput('level');

    const newVersion = await bumpSemver(currentVersion, bumpLevel);
    core.setOutput('new_version', newVersion);
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

async function bumpSemver(
  currentVersion: string,
  bumpLevel: string
): Promise<string | null> {
  if (!semver.valid(currentVersion)) {
    throw new Error(`${currentVersion} is not a valid semver`);
  }

  if (!isReleaseType(bumpLevel)) {
    throw new Error(
      `${bumpLevel} is not supported. {major, premajor, minor, preminor, patch, prepatch, prerelease} is available.`
    );
  }

  const hasVPrefix = currentVersion.startsWith('v');

  const bumpedVersion = semver.inc(currentVersion, bumpLevel);

  let newVersion = bumpedVersion;
  if (hasVPrefix) {
    newVersion = `v${newVersion}`;
  }

  return newVersion;
}

function isReleaseType(s: string): s is semver.ReleaseType {
  return [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
  ].includes(s);
}

run();