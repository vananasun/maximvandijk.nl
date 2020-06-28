@echo off
start sh.exe --login -c "gulp; gulp watch; read -n 1 \"Press le any key.""
start sh.exe --login -c "node server.js; read -n 1 \"Press le any key.""
start "" "http://localhost/index.html"
start explorer.exe "%CD%"
atom ./
