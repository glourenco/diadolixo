#!/bin/bash

# Dia do Lixo - App Store Build and Submit Script
echo "🚀 Starting Dia do Lixo App Store build and submission process..."

# Increment version number
echo "📝 Incrementing version number..."
CURRENT_VERSION=$(node -p "require('./app.json').expo.version")
echo "   Current version: $CURRENT_VERSION"

# Split version into major.minor.patch
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "   New version: $NEW_VERSION"

# Update app.json with new version
node -e "
const fs = require('fs');
const appJson = require('./app.json');
appJson.expo.version = '$NEW_VERSION';
fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 2) + '\n');
"

echo "✅ Version updated to $NEW_VERSION"

# Clean prebuild
echo "📁 Running expo prebuild --clean..."
yes | npx expo prebuild --clean

# Check if prebuild was successful
if [ $? -ne 0 ]; then
    echo "❌ Prebuild failed. Exiting."
    exit 1
fi

echo "✅ Prebuild completed successfully."

# Build the app locally
echo "🔨 Building iOS app locally..."
NPM_CONFIG_LEGACY_PEER_DEPS=true eas build -p ios --local --non-interactive --clear-cache

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting."
    exit 1
fi

echo "✅ Build completed successfully."

# Find the latest IPA file
echo "🔍 Looking for IPA file..."
IPA_PATH=$(find . -name "*.ipa" -type f | sort | tail -n 1)

if [ -z "$IPA_PATH" ]; then
    echo "❌ IPA file not found. Build may have failed."
    exit 1
fi

echo "📱 Found IPA file: $IPA_PATH"

# Submit the app to App Store Connect
echo "📤 Submitting app to App Store Connect..."
eas submit -p ios --non-interactive --path "$IPA_PATH"

# Check if submission was successful
if [ $? -eq 0 ]; then
    echo "✅ Submission successful!"
    echo "🗑️  Cleaning up IPA file..."
    rm "$IPA_PATH"
    echo "🎉 App Store submission completed successfully!"
    echo "📋 Check App Store Connect for review status."
else
    echo "❌ Submission failed. Keeping IPA file for troubleshooting."
    echo "📁 IPA file location: $IPA_PATH"
    exit 1
fi