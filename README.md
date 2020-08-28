# ecompbackend

> Option A

1) Clone
2) `npm install`
3) `npm test`
4) `npm start` for frontend support
5) `git log` is also an interesting adventure

Did it in TypeScript just to be fancy. The testing is done in Mocha with assert. I used this framework to make everything easier - it includes a code generator for RESTful services, models, database connections, and application hooks.

I did the money wrong. It's a float when it should be a very long integer (a bit like Bitcoin does). I'm not changing it.

I also did account numbers wrong. Should be strings. Rookie mistake. This is why I love TDD - it protects you from yourself. I did change this one.

A better way to do the tests would be to store test data in a 'test data repo' somewhere that is disconnected from the code repo itself. The there would be a 'beforeEach' function in Mocha that can load a very large ES6 Map with the test name or function hash as the key and the data as the value. Even better, use one of those handy-dandy in-memory DB's you can find on NPM that were meant to go with Mocha. I should also have used JSON schema validation.

The data model could also better.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/ecompbackend
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
