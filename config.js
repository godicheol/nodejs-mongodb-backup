'use strict';

module.exports = {
    uri: undefined, // mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/?authSource=<AUTH DB>
    host: "localhost",
    port: 27017,
    authenticationDatabase: undefined, // admin?
    authenticationMechanism: undefined,
    username: undefined,
    password: undefined,
    db: undefined, // database name
    gzip: true,
    os: "windows",
}