const fs = require('fs')
const path = require('path')

// Function to get the version from command line arguments
function getVersionFromArgs() {
  const args = process.argv.slice(2)
  const versionIndex = args.indexOf('--version')

  if (versionIndex !== -1 && versionIndex < args.length - 1) {
    return args[versionIndex + 1]
  }

  console.error('Please provide a version using --version <version>')
  process.exit(1)
}

// New version number from command line arguments
const newVersion = getVersionFromArgs()

// List of paths to package.json files
const packageJsonPaths = [
  'package.json',
  'theatre/package.json',
  'theatre/core/package.json',
  'theatre/studio/package.json',
  'packages/browser-bundles/package.json',
  'packages/dataverse/package.json',
  'packages/r3f/package.json',
  'packages/react/package.json',
  'packages/theatric/package.json',
]

// Function to update the version in a package.json file
function updateVersion(filePath) {
  // Read the file content
  const fileContent = fs.readFileSync(filePath, 'utf8')

  // Parse JSON content
  let packageJson = JSON.parse(fileContent)

  // Update the version field
  packageJson.version = newVersion

  // Write the updated JSON back to the file
  fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8')
  console.log(`Updated version in ${filePath} to ${newVersion}`)
}

// Iterate over each path and update the version
packageJsonPaths.forEach(updateVersion)
