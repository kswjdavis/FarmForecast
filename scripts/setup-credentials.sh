#!/bin/bash

# FarmForecast Credential Setup Script
# Sets up secure credential management for development

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }

echo "======================================"
echo "🔐 FarmForecast Credential Setup"
echo "======================================"
echo ""

# Check Node.js version
log_info "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    log_error "Node.js 20 or higher required. Current: $(node -v)"
    exit 1
fi
log_success "Node.js version OK: $(node -v)"

# Check if .env exists
if [ ! -f .env ]; then
    log_warning ".env file not found"
    
    if [ -f .env.example ]; then
        read -p "Create .env from .env.example? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            log_success "Created .env file"
            log_warning "Please edit .env with your actual credentials before continuing"
            exit 0
        fi
    else
        log_error ".env.example not found. Cannot proceed."
        exit 1
    fi
else
    log_success ".env file found"
fi

# Load environment variables
log_info "Loading environment variables..."
source .env

# Verify required credentials exist
log_info "Verifying required credentials..."
REQUIRED_VARS=(
    "NEO4J_URI"
    "NEO4J_PASSWORD"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "VISUALCROSSING_API_KEY"
    "NOAA_API_TOKEN"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    log_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    log_warning "Please edit .env file and add missing credentials"
    exit 1
fi

log_success "All required credentials present"

# Create credential directory structure
log_info "Creating credential directory structure..."
mkdir -p .credentials/{local,staging,production,backups}
log_success "Credential directories created"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed"
fi

# Run credential verification
log_info "Verifying external service connections..."
npm run verify:all

if [ $? -ne 0 ]; then
    log_error "Credential verification failed"
    log_warning "Please check your credentials and try again"
    exit 1
fi

# Ask about vault encryption
echo ""
read -p "Do you want to encrypt credentials with vault? (recommended) (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Setting up credential vault..."
    
    # Generate encryption key
    log_info "Generating encryption key..."
    DOTENV_KEY=$(openssl rand -base64 32)
    echo "dotenv://:key_${DOTENV_KEY}@dotenvx.com/vault/.env.vault?environment=$(date +%s)" > .credentials/local/DOTENV_KEY
    log_success "Encryption key generated"
    
    # Encrypt credentials
    log_info "Encrypting credentials..."
    npx @dotenvx/dotenvx encrypt -f .env -o .credentials/local/.env.vault
    
    if [ $? -eq 0 ]; then
        log_success "Credentials encrypted successfully"
        log_warning "IMPORTANT: Store the DOTENV_KEY file securely!"
        log_info "Key location: .credentials/local/DOTENV_KEY"
        
        # Create backup
        log_info "Creating credential backup..."
        npm run credentials:backup
        log_success "Backup created"
    else
        log_error "Failed to encrypt credentials"
        exit 1
    fi
else
    log_warning "Skipping vault encryption (not recommended for production)"
fi

# Setup pre-commit hooks
log_info "Setting up pre-commit hooks..."

# Create .husky directory if it doesn't exist
mkdir -p .husky

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Check for credentials in staged files
echo "Checking for exposed credentials..."
git diff --cached --name-only | xargs -I {} sh -c 'grep -E "(password|secret|key|token).*=.*['\''\"]\w+" {} 2>/dev/null' && {
    echo "❌ Potential credential exposure detected!"
    echo "Please review your changes and remove any credentials."
    exit 1
}

# Run credential verification
npm run verify:credentials || {
    echo "❌ Credential verification failed"
    exit 1
}

echo "✅ Pre-commit checks passed"
EOF

chmod +x .husky/pre-commit
log_success "Pre-commit hooks configured"

# AWS Secrets Manager setup (optional)
echo ""
read -p "Do you want to store credentials in AWS Secrets Manager? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Storing credentials in AWS Secrets Manager..."
    
    # Create a TypeScript runner script
    cat > /tmp/store-secrets.ts << 'EOF'
import AWSSecretsManager from './src/services/aws-secrets.js';

async function main() {
    try {
        await AWSSecretsManager.storeAllCredentials();
        console.log('✅ Credentials stored in AWS Secrets Manager');
    } catch (error) {
        console.error('❌ Failed to store credentials:', error);
        process.exit(1);
    }
}

main();
EOF
    
    npx tsx /tmp/store-secrets.ts
    rm /tmp/store-secrets.ts
    
    if [ $? -eq 0 ]; then
        log_success "Credentials stored in AWS Secrets Manager"
    else
        log_warning "Failed to store in AWS Secrets Manager (continuing...)"
    fi
fi

# Generate summary report
echo ""
echo "======================================"
echo "📋 Setup Summary"
echo "======================================"
echo ""
log_success "✓ Environment variables loaded"
log_success "✓ Credential directories created"
log_success "✓ External services verified"

if [ -f .credentials/local/.env.vault ]; then
    log_success "✓ Credentials encrypted in vault"
fi

if [ -f .husky/pre-commit ]; then
    log_success "✓ Pre-commit hooks installed"
fi

echo ""
echo "======================================"
echo "📝 Next Steps"
echo "======================================"
echo ""
echo "1. Run development server: npm run dev"
echo "2. Run tests: npm test"
echo "3. View credential status: npm run verify:all"

if [ -f .credentials/local/DOTENV_KEY ]; then
    echo ""
    log_warning "IMPORTANT: Securely store the encryption key!"
    echo "Location: .credentials/local/DOTENV_KEY"
    echo "This key is required to decrypt your credentials."
fi

echo ""
log_success "Credential setup complete! 🎉"