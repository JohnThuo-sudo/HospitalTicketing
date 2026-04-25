#!/bin/bash

# Helper script to get Supabase keys for local or cloud setup

echo "🔑 Supabase Keys Helper"
echo "======================="
echo ""

# Check if local Supabase is running
if command -v supabase &> /dev/null; then
    echo "Checking for local Supabase instance..."
    echo ""
    
    # Try to get status
    if supabase status &> /dev/null; then
        echo "✓ Local Supabase instance detected!"
        echo ""
        echo "Running: supabase status"
        echo "---"
        supabase status
        echo "---"
        echo ""
        echo "📋 Instructions for local Supabase:"
        echo "1. Copy the service role secret from above"
        echo "2. Add to your .env file:"
        echo "   SUPABASE_SERVICE_ROLE_KEY=<service-role-secret>"
    else
        echo "⚠️  No local Supabase running"
        echo "Start it with: supabase start"
    fi
else
    echo "⚠️  Supabase CLI not found"
    echo "Install it: https://supabase.com/docs/guides/cli/getting-started"
fi

echo ""
echo "For Supabase Cloud:"
echo "1. Go to: https://app.supabase.com"
echo "2. Select your project"
echo "3. Settings → API → Service Role Secret"
echo "4. Copy and add to .env as SUPABASE_SERVICE_ROLE_KEY"
