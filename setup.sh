#!/bin/bash

echo "Setting up Dia do Lixo app..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create placeholder assets
echo "Creating placeholder assets..."
mkdir -p assets

# Create a simple icon (you can replace this with a proper icon later)
echo "Creating placeholder icon..."
cat > assets/icon.png << 'EOF'
# This is a placeholder - replace with actual PNG icon
EOF

# Create placeholder splash screen
echo "Creating placeholder splash screen..."
cat > assets/splash.png << 'EOF'
# This is a placeholder - replace with actual PNG splash screen
EOF

# Create placeholder adaptive icon
echo "Creating placeholder adaptive icon..."
cat > assets/adaptive-icon.png << 'EOF'
# This is a placeholder - replace with actual PNG adaptive icon
EOF

# Create placeholder favicon
echo "Creating placeholder favicon..."
cat > assets/favicon.png << 'EOF'
# This is a placeholder - replace with actual PNG favicon
EOF

echo "Setup complete! You can now run 'npm start' to start the development server."
echo ""
echo "Note: Replace the placeholder asset files in the assets/ directory with actual images."
echo ""
echo "The app is configured to work with the Supabase database that was set up."
echo "Database includes:"
echo "- Seixal city with multiple zones"
echo "- 4 garbage types (papel, embalagens, bioresiduos, indiferenciados)"
echo "- Sample collection schedules"

