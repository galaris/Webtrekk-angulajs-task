# Creativite Solution for Webtrekk angularjs task

well, i tried to come up with something a bit out of box to make this task more interesting.

## Details

- Recived Task: Sept 4th 2017
- Deadline     : Sept 7th 2017
- Specs :  [exercise_angularjs_eng.pdf](../exercise_angularjs_eng.pdf)

## Work done

- custome build system using only Node.Js
  - Great Modularity and Separation of concerns setup
  - Every module is contained inside its own folder.
  - root module doesnot depend on any sub.modules
  - allow multiple team to work on separat folders
  - run development against processed build src, to memic production enviroment
  - include express server ready to deploy for production, nodejs handle
    - Minification
    - Concat of vendor and app files
    - Annotation
    - Babel Transform for es6
    - Jasmin Test
    - hot-reloading using socket.io during development
    - Protractor E2E testing
    - Istambule Coverage reports
    - production ready Express server
    - html5 mode routing enabled
    - Node.Js handle lanuching server and building app from /src folder with single command
    - heroku friendly for rapid deployment.
- 1 Factory for data persistence
- 1 data service
- 3 directives for rouing
- 1 class for data validation and normalization

## why no webpack/gulp/grunt or any other task manager/build sys ?

- pre 2015, most apps built using AngularJs 1.X did not have access to such new tooling(s)

- Refractoring of an in-production large scale app to use ES6 of modules can be a challenge;

i chose to get a bit creative with this task, and try to create a custome build system for us !

i crafted an experimental nodejs + socket.io + express server located @ server.js & webtrekk_build.js, that handle all source code minification, concat, Annotation and even included socket.io to add a hotreload :D !

it was fun to build, although took most of 48hrs that was given for me to complete task; i think this Idea of a -build sys- deliver a great team development experince :) ! i actually might continue to explore it further after task completetion !

## why no modules nor any AMD loaders ?

same reason why i used nodejs for a build system +

- i wantted to create a build system that would work with john-papa styleguide, and backthen < 2015 most angularjs styleguids did not use AMD loaders
- its not always possible/fesiable to port large scale apps into new modular AMD world, so i wanted to experiment creating a build system that support those apps and compare outcome with what i could have saved if i used modern webpack/AMD tools.


## why all modules are exending root angular.module ?

`Many Small, Self Contained Modules ` [Y160](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y160) is greate; yet for this task i decided to explore having a single Module that all app sub-modules inherit from;

using glob to scan /src folder and automaticly concat all modules into single file;
i thought it might be a good idea to free root modules from any dependencies; since now all sub-modules call root module and regiester there own .run and .config blocks etc..

this setup **Pro** was adding a new route is just a matter of creating a new file inside src folder and it will automaticly work.. no need to hack root module.

yet tbh, by end of this task i can see Cons of this approach;

- that you cannot have your team develop experimental Modules which you exclude from root module dependencies and by that prevent them from loading untill u decide to do so.
- testing now easier; you mock load a single module it contain everything; yet in a huge app this can be a huge performance hit that hurt developers experince.

- i think i wouldn't recommend this for any future work [Y160](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y160)is more solid.


## why use directives and not >1.5 angular.component

requirements stated to used bootstrap

angular.component does not support "replace:true" templates, this make styling components a bit of a challenge unless you decied to us Js-css which is not case here.

- using angular.components whould break bootstrap styles, and requires lots of hacking to modify css selectors for bootstrap

- there are many existent bugs assosiated with angular.components and advantage it provides over using angular.directives is not much.


## Getting Started

- `yarn run dev` run karma + development server on localhost:8080
- `yarn run live` build src and run production express server
- `yarn run deploy-setup` setup heroku
- `yarn run deploy` push localchanges to remote heroku then open new heroku


## Testing

### unit test using jasmin

tests run against all files ending with .spec.js

karma will load /public/app.js which should contain all you app code; for this reason you need to have dev server running if you change any code inside /src folder; since dev server will rebuild public/app.js file automaticly

- `yarn run test` will run karma only in watch mode; so prefer use `yarn run dev` to run both dev server and karma server.
- all files end with .spec.js

### e2e using protractor

- `yarn run e2e`


with this setup we can let multilple teams work on multiple sections of monolithic app, with complete separation they don't even have to be in same repo.

## in nutshell

all components depends on `src/module.js`  while `src/module.js` depends on only 3rd parties.

`module.js` is the entry file for all components, all components will inherit from it, this is place to add global configuration; only one person should be respobsible for updating this file because it will affect all components.

## Getting started

to run both tests and production server
```shell
yarn dev
```

to run server and hotreload
```
yarn start
```

to run e2e tests (require protractor)
```
yarn run e2e
```


to run karma-jasmin unit-tests tests (requires karma)
```
yarn run test
```