#!/usr/bin/env node

const fs = require("node:fs");

const manifestPath = "io.filen.Filen.yml";
const repo = "FilenCloudDienste/filen-desktop";
const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;

const targets = [
  {
    arch: "x86_64",
    asset: "Filen_linux_x86_64.AppImage",
  },
  {
    arch: "aarch64",
    asset: "Filen_linux_arm64.AppImage",
  },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    fail(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function findAsset(release, name) {
  const asset = release.assets.find((item) => item.name === name);
  if (!asset) {
    fail(`Latest Filen release ${release.tag_name} does not include ${name}`);
  }

  return asset;
}

function replaceSource(manifest, target, tagName, sha256) {
  const escapedAsset = target.asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sourcePattern = new RegExp(
    `url: https://github\\.com/FilenCloudDienste/filen-desktop/releases/download/[^/]+/${escapedAsset}\\n` +
      `        dest-filename: Filen\\.AppImage\\n` +
      `        sha256: [a-f0-9]{64}\\n` +
      `        only-arches: \\[${target.arch}\\]`,
  );
  const replacement =
    `url: https://github.com/FilenCloudDienste/filen-desktop/releases/download/${tagName}/${target.asset}\n` +
    `        dest-filename: Filen.AppImage\n` +
    `        sha256: ${sha256}\n` +
    `        only-arches: [${target.arch}]`;

  if (!sourcePattern.test(manifest)) {
    fail(`Could not find ${target.arch} AppImage source block in ${manifestPath}`);
  }

  return manifest.replace(sourcePattern, replacement);
}

async function main() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const release = JSON.parse(await fetchText(apiUrl, headers));
  const tagName = release.tag_name;

  if (!tagName) {
    fail("Latest Filen release did not include a tag name");
  }

  let manifest = fs.readFileSync(manifestPath, "utf8");

  for (const target of targets) {
    const asset = findAsset(release, target.asset);
    const checksumAsset = findAsset(release, `${target.asset}.sha256.txt`);
    const sha256 = (await fetchText(checksumAsset.browser_download_url)).trim();

    if (!/^[a-f0-9]{64}$/.test(sha256)) {
      fail(`Invalid sha256 for ${target.asset}: ${sha256}`);
    }

    if (!asset.browser_download_url.endsWith(`/${tagName}/${target.asset}`)) {
      fail(`Unexpected download URL for ${target.asset}: ${asset.browser_download_url}`);
    }

    manifest = replaceSource(manifest, target, tagName, sha256);
  }

  fs.writeFileSync(manifestPath, manifest);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${tagName}\n`);
  }

  console.log(`Updated ${manifestPath} to Filen ${tagName}`);
}

main().catch((error) => fail(error.stack || error.message));
