#!/bin/bash
[[ $1 = '' ]] && BRANCH="master" || BRANCH=$1

SERVER="46.101.156.51"
DEST_FOLDER="junidev"
PARAMS="BRANCH=\"$BRANCH\" DEST_FOLDER=\"$DEST_FOLDER\""

echo ===================================================
echo Autodeploy server
echo selected barcn $BRANCH
chmod 400 $SSH_KEY_PATH
echo ===================================================
echo Connecting to remote server...
ssh -i $SERVER $PARAMS 'bash -i'  <<-'ENDSSH'
    #Connected

    cd $DEST_FOLDER

    pm2 stop junidev

    git stash
    # to stash package-lock.json file changes

    git pull
    git checkout $BRANCH
    git pull origin $BRANCH

    rm -rf node_modules/

    npm install

    pm2 start npm --name junidev -- run prod
    pm2 save

    pm2 list

    exit
ENDSSH
