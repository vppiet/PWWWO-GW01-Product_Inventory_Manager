# Product Inventory Manager

## Introduction
Product Inventory Manager aims to provide a simple and coherent solution for managing user's inventory. Application deals with the following data objects: product, product type, and vendor. With the web application, user can:
- add a data object
- list all data objects
- update a data object
- remove a data object
- access web application via a REST API (not implemented)

This repository contains an implemented web application for a groupwork assignment of the course Palvelinpuolen WWW-ohjelmointi in Turku University of Applied Sciences.

## Deployment
1. Install dependencies: `npm install`
2. Create config directory into which place default.json containing MongoDB connection string as follows:
```json
{
  "database": {
	"connectionstring": ""
  }
}
```
3. Deploy: `npm start` or `npm run devstart`.

## Collaborators
- [Veikka Hämäläinen](https://github.com/hamvei)
- [Ville Pietarinen](https://github.com/vppiet)
- [Mikko Saarimaa](https://github.com/mikkosaarimaa)
- [Aleksi Valojää](https://github.com/Avaloja16)
