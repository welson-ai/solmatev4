#!/bin/bash

# Auto-commit script - generates commits at regular intervals
# Makes changes ONLY in contracts/ and ai-agent/ folders (not landing page code)
# Usage: ./scripts/auto-commits.sh [interval_seconds] [num_commits]
# Default: 60 seconds interval, infinite commits

INTERVAL=${1:-60}
NUM_COMMITS=${2:-0}  # 0 = infinite

count=0

# Folders where auto-commits will make changes (safe zones)
SAFE_FOLDERS=("contracts" "ai-agent/strategies" "ai-agent/models" "ai-agent/monitoring")

# Commit message prefixes for variety
PREFIXES=("feat" "refactor" "docs" "chore" "wip" "update")

# Work descriptions for realistic commit messages
WORK_ITEMS=(
    "yield strategy optimization"
    "position monitoring logic"
    "smart contract scaffolding"
    "ML model architecture"
    "risk assessment module"
    "liquidity pool integration"
    "price feed handler"
    "wallet connection flow"
    "transaction builder"
    "APY calculation engine"
    "rebalancing algorithm"
    "slippage protection"
)

echo "🚀 Starting auto-commit loop..."
echo "   Interval: ${INTERVAL}s"
echo "   Commits: $([ $NUM_COMMITS -eq 0 ] && echo 'infinite' || echo $NUM_COMMITS)"
echo "   Safe folders: ${SAFE_FOLDERS[*]}"
echo "   Press Ctrl+C to stop"
echo ""

while true; do
    # Check if we've reached the limit
    if [ $NUM_COMMITS -gt 0 ] && [ $count -ge $NUM_COMMITS ]; then
        echo "✅ Completed $count commits"
        exit 0
    fi

    # Generate timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    DATE_SLUG=$(date +"%Y%m%d_%H%M%S")
    
    # Pick random folder, prefix, and work item
    FOLDER=${SAFE_FOLDERS[$RANDOM % ${#SAFE_FOLDERS[@]}]}
    PREFIX=${PREFIXES[$RANDOM % ${#PREFIXES[@]}]}
    WORK=${WORK_ITEMS[$RANDOM % ${#WORK_ITEMS[@]}]}
    
    # Create a progress file in the safe folder
    PROGRESS_FILE="$FOLDER/progress_$DATE_SLUG.md"
    echo "# Progress Update - $TIMESTAMP" > "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
    echo "Working on: $WORK" >> "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
    echo "## Notes" >> "$PROGRESS_FILE"
    echo "- Iteration $((count + 1))" >> "$PROGRESS_FILE"
    echo "- Auto-generated progress marker" >> "$PROGRESS_FILE"
    
    # Stage and commit
    git add "$PROGRESS_FILE"
    git commit -m "$PREFIX: $WORK"
    
    # Push to remote
    git push
    
    count=$((count + 1))
    echo "[$count] $PREFIX: $WORK → $FOLDER"
    
    # Wait for next interval
    sleep $INTERVAL
done
