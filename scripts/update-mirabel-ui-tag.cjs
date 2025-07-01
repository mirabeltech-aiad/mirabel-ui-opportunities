const fs = require('fs');
const { execSync } = require('child_process');

const PACKAGE_NAME = 'mirabel-ui';
const BITBUCKET_REPO = 'mirabeldevelopment/mirabel-ui-components'; // shorthand repo name

function getLatestTag() {
  try {
    const result = execSync(`git ls-remote --tags https://bitbucket.org/${BITBUCKET_REPO}`, {
      encoding: 'utf8',
    });

    const tags = result
      .split('\n')
      .filter(line => line.includes('refs/tags/'))
      .map(line => line.split('refs/tags/')[1])
      .filter(tag => !tag.includes('^{}'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return tags[tags.length - 1];
  } catch (err) {
    console.error('❌ Failed to fetch tags from Bitbucket:', err.message);
    return null;
  }
}

function updatePackageJson(latestTag) {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.dependencies?.[PACKAGE_NAME]) {
    console.error(`❌ '${PACKAGE_NAME}' not found in dependencies`);
    return;
  }

  const newUrl = `bitbucket:${BITBUCKET_REPO}#${latestTag}`;
  const current = pkg.dependencies[PACKAGE_NAME];

  if (current === newUrl) {
    console.log(`✅ Already using latest tag: ${latestTag}`);
    return;
  }

  console.log(`⬆️ Updating ${PACKAGE_NAME} to: ${newUrl}`);
  pkg.dependencies[PACKAGE_NAME] = newUrl;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`📦 Running npm install...`);
}

// Main
const tag = getLatestTag();
if (tag) {
  updatePackageJson(tag);
}
