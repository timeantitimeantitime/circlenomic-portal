#!/bin/bash
set -e

echo "=== Circlenomic Portal Installer ==="
echo ""

# Detect platform
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin) PLATFORM="macos" ;;
  Linux)  PLATFORM="linux" ;;
  *)      echo "Unsupported OS: $OS"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH_NAME="x86_64" ;;
  arm64|aarch64) ARCH_NAME="arm64" ;;
  *)            echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

echo "Platform: $PLATFORM ($ARCH_NAME)"
echo ""

# Check for Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "Node.js found: $NODE_VERSION"
else
  echo "Node.js not found. Installing via nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
  echo "Node.js installed: $(node --version)"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
  echo "Error: npm not found after Node.js install"
  exit 1
fi
echo "npm found: $(npm --version)"
echo ""

# Setup ravend binary
BIN_DIR="$(cd "$(dirname "$0")" && pwd)/mining-layer/bin"
mkdir -p "$BIN_DIR"

if [ -f "$BIN_DIR/ravend" ] && [ -f "$BIN_DIR/raven-cli" ]; then
  echo "ravend binaries found in $BIN_DIR"
else
  echo "Downloading Ravencoin v4.3.2.1..."
  RAVEN_VERSION="4.3.2.1"

  if [ "$PLATFORM" = "macos" ]; then
    RAVEN_URL="https://github.com/RavenProject/Ravencoin/releases/download/v${RAVEN_VERSION}/raven-${RAVEN_VERSION}-osx.tar.gz"
  elif [ "$PLATFORM" = "linux" ]; then
    if [ "$ARCH_NAME" = "arm64" ]; then
      RAVEN_URL="https://github.com/RavenProject/Ravencoin/releases/download/v${RAVEN_VERSION}/raven-${RAVEN_VERSION}-aarch64-linux-gnu.tar.gz"
    else
      RAVEN_URL="https://github.com/RavenProject/Ravencoin/releases/download/v${RAVEN_VERSION}/raven-${RAVEN_VERSION}-x86_64-linux-gnu.tar.gz"
    fi
  fi

  TEMP_DIR=$(mktemp -d)
  curl -L -o "$TEMP_DIR/raven.tar.gz" "$RAVEN_URL"
  tar -xzf "$TEMP_DIR/raven.tar.gz" -C "$TEMP_DIR"

  # Find and copy binaries
  find "$TEMP_DIR" -name "ravend" -exec cp {} "$BIN_DIR/ravend" \;
  find "$TEMP_DIR" -name "raven-cli" -exec cp {} "$BIN_DIR/raven-cli" \;
  chmod +x "$BIN_DIR/ravend" "$BIN_DIR/raven-cli"

  rm -rf "$TEMP_DIR"
  echo "ravend installed to $BIN_DIR"
fi
echo ""

# Install npm dependencies
echo "Installing dependencies..."
cd "$(dirname "$0")/portal"
npm install
echo ""

# Create start script
cat > "$(dirname "$0")/start.sh" << 'STARTEOF'
#!/bin/bash
cd "$(dirname "$0")"
export PATH="$(pwd)/mining-layer/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd portal
echo "Starting Circlenomic Portal..."
npm start
STARTEOF
chmod +x "$(dirname "$0")/start.sh"

echo "=== Installation Complete ==="
echo ""
echo "To start the portal:"
echo "  ./start.sh"
echo ""
echo "Or manually:"
echo "  cd portal && npm start"
