# fridge-controller-server
Contains the source code for the rest server for the raspberry pi fridge controller

Testing

To run the mocha tests as well as report on test coverage, use the following command. Coverage reports can be viewed with the web interface.
```
$ gulp test
```

$ gulp lint

Installation from scratch

Clone repo:
$ git clone https://github.com/mike-hewitson/fridge-controller-server.git
$ cd fridge-controller-server
$ npm install
$ sudo pm2 start ./bin/www

Update from repo
$ cd fridge-controller-server
$ git pull
$ npm install
$ sudo pm2 restart www

Envrionments
Environment variable for the rest server port and the mongo server ip and port are contained in the .env file. This is not contained in the repo. An example is:
```
DB_SERVER='CSJHBAN8G8WN.local'
DB_PORT='27017'
PORT='3000'
```

