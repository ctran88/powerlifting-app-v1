#!/bin/bash 

# Strip filename from working directory to make it the root directory
cd ${0%/*}

# Start fresh by removing existing files
echo '[DEPLOY] Removing old files...'
if [ -d deploy ]; then
    rm -rf deploy
fi

# Create deployment directory
echo '[DEPLOY] Create deployment directory'
if ! [ -d deploy ]; then
    mkdir deploy
fi

# Lint files or abort if linting error occurred
echo '[DEPLOY] Linting...'
./node_modules/.bin/eslint --fix . || {
    echo '\n[DEPLOY] ERROR: Linting errors occurred: aborting deployment!'; 
    exit 1;
}

# Run endpoint tests or abort if test error occurred  
# echo '[DEPLOY] Running endpoint tests...'
# npm run test || { 
#     echo '\n[DEPLOY] ERROR: Endpoint tests failed: aborting deployment!';
#     exit 1;
# }

# Rsync files to deployment folder
echo '[DEPLOY] Copying files...'
rsync -av --progress ./ * ./deploy --exclude=deploy --exclude=node_modules

echo '[DEPLOY] Success!'
exit 0
