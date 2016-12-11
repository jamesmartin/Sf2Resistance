# Sf2 Resistance

## Installation

We pull events from [findthefight.org](http://findthefight.org). Add the URL of
the events host to the `env.js` file:

```
cp env.js.example env.js
# Edit env.js and add the events host URL to the `eventsHostUrl` property
```

If you want to run the events host locally, check out [its
repo](https://github.com/sdhull/find_the_fight).

```
npm install
npm start
# In a new shell...
react-native run-ios
```

If 💩 goes bad, clear all the caches and start again

```
./nukeit
```
