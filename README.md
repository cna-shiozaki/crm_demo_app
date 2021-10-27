# CRM Demo application
This repository holds the source code of a side project I made, using the following stack :
* SAP's [OpenUI5] frontend Single Page Application 
* [Jaystack] OData V4 Server, using NodeJS, Express, Typescript
* [MongoDB] as a persistent service

## Features
The app is quite simple and consists of a dashboard of activities that typically could be found in a Customer Relationship System (CRM).
The user is able to create, display, edit and search documents of type "Activity".
Each document has a 0...N relationship to Business Partners (such as "Creator", "Ship-To", etc.).

## Requirements
Node.js 14 or later
MongoDB 4 Standalone

## How to install
After pulling the content of this repository, execute `npm install` in your command shell in the root folder crm_demo_app.
What's more, go to the `back` folder and run `mongo < mongodb_setup` to fill up the database with mock data. 

Not ready (yet!) for production environments.

## Run the app
Execute `npm run start` in the root folder crm_demo_app.
Open a browser and open URL : http://localhost:1337/index.html
Make sure your MongoDB instance is running.

## How it works
The Single Page application is served from localhost port 1337; it provides a OpenUI5 app consisting of a non-minified and non-bundled set of javascript files.
In addition, an API endpoint is served from localhost port 5000; this API endpoint is the OData V4 service that allows to communicate with the middleware.
A proxy is enabled to redirect API requests (initially targeted at localhost:1337/API/*) to localhost port 5000. 

[OpenUI5]: <https://openui5.org/>
[Jaystack]: https://jaydata.org/jaystack-odata-v4-server
[MongoDB]: https://www.mongodb.com/