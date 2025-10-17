#!/bin/bash

# Marisol Fit - Run on Physical Device Script
echo "📱 Starting Marisol Fit on physical iPhone..."

# Your device UDID
DEVICE_UDID="00008120-001665EC0C9BC01E"

# Check if device is connected
echo "🔍 Checking device connection..."
DEVICE_STATUS=$(xcrun xctrace list devices 2>&1 | grep "$DEVICE_UDID")

if [ -z "$DEVICE_STATUS" ]; then
    echo "❌ Device not found!"
    echo ""
    echo "Please make sure:"
    echo "  1. Your iPhone is connected via USB"
    echo "  2. Your iPhone is unlocked"
    echo "  3. You've trusted this computer"
    echo ""
    echo "Available devices:"
    xcrun xctrace list devices 2>&1 | grep -i "iPhone" | grep -v "Simulator"
    exit 1
fi

echo "✅ Device found: $DEVICE_STATUS"
echo ""
echo "🚀 Building and installing app on your iPhone..."
echo "⏱️  This will take a few minutes on first run..."
echo ""

# Run expo on the physical device
npx expo run:ios --device "$DEVICE_UDID"

# Check if the command succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║           ✅ APP INSTALLED SUCCESSFULLY!                 ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "📱 The app should now be running on your iPhone!"
    echo ""
    echo "💡 Tips:"
    echo "   • Shake your device to open developer menu"
    echo "   • Enable Fast Refresh for instant updates"
    echo "   • Check console logs in Metro bundler"
    echo ""
else
    echo ""
    echo "❌ Build failed. Common issues:"
    echo ""
    echo "1. Code Signing:"
    echo "   → Open ios/marisolfit.xcworkspace in Xcode"
    echo "   → Select your team in Signing & Capabilities"
    echo ""
    echo "2. Trust Developer:"
    echo "   → Settings → General → VPN & Device Management"
    echo "   → Trust your developer certificate"
    echo ""
    echo "3. Developer Mode:"
    echo "   → Settings → Privacy & Security → Developer Mode → ON"
    echo ""
    exit 1
fi

