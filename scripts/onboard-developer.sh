#!/bin/bash

# FarmForecast Developer Onboarding Script
# Automates setup for new developers

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Helper functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_header() { echo -e "\n${BOLD}$1${NC}\n"; }

clear

echo "======================================"
echo "🚀 FarmForecast Developer Onboarding"
echo "======================================"
echo ""
echo "Welcome to the FarmForecast project!"
echo "This script will set up your development environment."
echo ""

# Step 1: Check prerequisites
log_header "Step 1: Checking Prerequisites"

# Check Node.js
log_info "Checking Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js not found. Please install Node.js 20 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    log_error "Node.js 20 or higher required. Current: $(node -v)"
    exit 1
fi
log_success "Node.js $(node -v) ✓"

# Check npm
log_info "Checking npm..."
if ! command -v npm &> /dev/null; then
    log_error "npm not found"
    exit 1
fi
log_success "npm $(npm -v) ✓"

# Check Git
log_info "Checking Git..."
if ! command -v git &> /dev/null; then
    log_error "Git not found. Please install Git."
    exit 1
fi
log_success "Git $(git --version | cut -d' ' -f3) ✓"

# Check AWS CLI (optional but recommended)
log_info "Checking AWS CLI..."
if command -v aws &> /dev/null; then
    log_success "AWS CLI $(aws --version | cut -d' ' -f1 | cut -d'/' -f2) ✓"
else
    log_warning "AWS CLI not found (optional)"
fi

# Step 2: Verify Story 1.0 Prerequisites
log_header "Step 2: Verifying External Service Access"

log_info "This project requires access to external services."
log_info "Please ensure you have received credentials for:"
echo ""
echo "  • Neo4j Aura Database"
echo "  • AWS Account (S3, Secrets Manager)"
echo "  • Visual Crossing Weather API"
echo "  • NOAA Climate Data API"
echo "  • GitHub Repository Access"
echo ""

read -p "Do you have all required credentials? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_error "Cannot proceed without credentials"
    echo ""
    echo "Please contact the project lead to obtain:"
    echo "1. Access to the credentials vault"
    echo "2. Or individual service credentials"
    echo ""
    echo "Required credentials are documented in CREDENTIAL_SETUP.md"
    exit 1
fi

# Step 3: Clone repository (if not already in it)
if [ ! -f "package.json" ]; then
    log_header "Step 3: Repository Setup"
    
    read -p "Clone repository? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cloning FarmForecast repository..."
        git clone https://github.com/kswjdavis/FarmForecast.git
        cd FarmForecast
        log_success "Repository cloned"
    else
        log_error "Please navigate to the FarmForecast directory"
        exit 1
    fi
else
    log_header "Step 3: Repository Setup"
    log_success "Already in FarmForecast repository"
fi

# Step 4: Install dependencies
log_header "Step 4: Installing Dependencies"

log_info "Installing npm packages..."
npm install
log_success "Dependencies installed"

# Step 5: Environment configuration
log_header "Step 5: Environment Configuration"

if [ ! -f .env ]; then
    log_info "Setting up environment variables..."
    
    # Check if credentials vault exists
    if [ -f .credentials/local/DOTENV_KEY ]; then
        log_info "Found credential vault"
        read -p "Decrypt existing vault? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Decrypt vault
            npx @dotenvx/dotenvx decrypt -f .credentials/local/.env.vault -o .env
            log_success "Credentials decrypted"
        fi
    elif [ -f .env.example ]; then
        log_info "Creating .env from template..."
        cp .env.example .env
        log_warning "Please edit .env with your credentials"
        
        # Open editor if available
        if command -v code &> /dev/null; then
            code .env
        elif command -v nano &> /dev/null; then
            nano .env
        else
            log_info "Edit .env file with your preferred editor"
        fi
        
        read -p "Press Enter when you've added credentials..."
    fi
else
    log_success ".env file exists"
fi

# Step 6: Verify credentials
log_header "Step 6: Credential Verification"

log_info "Verifying external service connections..."
npm run verify:all

if [ $? -ne 0 ]; then
    log_error "Credential verification failed"
    echo ""
    echo "Please check:"
    echo "1. All credentials are correctly entered in .env"
    echo "2. External services are accessible"
    echo "3. API keys/tokens are valid"
    echo ""
    echo "Run 'npm run verify:all' after fixing credentials"
    exit 1
fi

log_success "All external services verified!"

# Step 7: Git configuration
log_header "Step 7: Git Configuration"

log_info "Setting up Git hooks..."
npx husky install
log_success "Git hooks installed"

# Configure git user if not set
if [ -z "$(git config user.email)" ]; then
    log_info "Configuring Git user..."
    read -p "Enter your email for Git commits: " git_email
    git config user.email "$git_email"
    read -p "Enter your name for Git commits: " git_name
    git config user.name "$git_name"
    log_success "Git user configured"
fi

# Step 8: Optional services
log_header "Step 8: Optional Services"

# Docker
log_info "Checking Docker..."
if command -v docker &> /dev/null; then
    log_success "Docker installed ✓"
    
    read -p "Start local services with Docker? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f docker-compose.yml ]; then
            log_info "Starting Docker services..."
            docker-compose up -d
            log_success "Docker services started"
        else
            log_warning "docker-compose.yml not found"
        fi
    fi
else
    log_warning "Docker not installed (optional)"
    echo "Install Docker for local Neo4j and Redis: https://docker.com"
fi

# Step 9: Run tests
log_header "Step 9: Running Tests"

log_info "Running test suite..."
npm test

if [ $? -eq 0 ]; then
    log_success "All tests passed!"
else
    log_warning "Some tests failed (this may be expected for new setup)"
fi

# Step 10: Summary
log_header "🎉 Onboarding Complete!"

echo "======================================"
echo "📋 Setup Summary"
echo "======================================"
echo ""
log_success "✓ Prerequisites verified"
log_success "✓ Repository configured"
log_success "✓ Dependencies installed"
log_success "✓ Credentials configured"
log_success "✓ External services verified"
log_success "✓ Git hooks installed"
echo ""

echo "======================================"
echo "📚 Quick Reference"
echo "======================================"
echo ""
echo "${BOLD}Common Commands:${NC}"
echo "  npm run dev          - Start development server"
echo "  npm test             - Run test suite"
echo "  npm run verify:all   - Verify all credentials"
echo "  npm run lint         - Run linter"
echo "  npm run build        - Build for production"
echo ""

echo "${BOLD}Project Structure:${NC}"
echo "  /src                 - Source code"
echo "  /scripts             - Utility scripts"
echo "  /docs                - Documentation"
echo "  /.credentials        - Encrypted credentials"
echo ""

echo "${BOLD}Documentation:${NC}"
echo "  README.md            - Project overview"
echo "  CREDENTIAL_SETUP.md  - Credential setup guide"
echo "  docs/architecture/   - Technical documentation"
echo "  docs/stories/        - User stories"
echo ""

echo "${BOLD}Getting Help:${NC}"
echo "  Slack: #farmforecast-dev"
echo "  Wiki: https://github.com/kswjdavis/FarmForecast/wiki"
echo "  Issues: https://github.com/kswjdavis/FarmForecast/issues"
echo ""

log_success "Welcome to the team! Happy coding! 🚀"
echo ""

# Offer to start dev server
read -p "Start development server now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Starting development server..."
    npm run dev
fi