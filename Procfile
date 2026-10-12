release: node ./node_modules/typeorm/cli.js migration:run -d ./build/dataSource.js
web: node --max-old-space-size=512 -r newrelic build/server.js
