
### Methodology

* A user will enter a goal comment onto a yearly goal thread
* This script will execute against that thread, looking for new goals
* New goal comments are parsed, and stored in a thread created by the bot as JSON
* As a goal is parsed, a comment is added to the original goal comment notifying the user of the location of the data
* Every 1st of the month, we'll iterate over all of the comments made by the bot to the user and see if the user needs to update their goal progress
* A message will be sent to the user if they requested to update on that day
* Replies to these messages will result in a new thread each day. These new threads will be stored as JSON and will need to reference previous updates
* At the end of the year, a new thread will be created tagging each of the users and showing the success/failure of their goals

### Features Not Supported
* Personal goals
* Non-registered investment vehicle (can maybe create a generic one?)

### Setup

* Install Node v10+, Yarn
* Checkout the project
* Perform a `yarn install`

### To Run

* Execute the script `USERNAME=<your username> PASSWORD=<your password> node index.js`


### API

#### Goal Comments
Comment structure, right now, is very, very specific.

```
Goals: Max <investment vehicle>, Contribute $x to <investment vehicle>, Save $x"
Timeframe: <time frame>
Currency: <currency>
```

**Lines must have two line feeds between each line**

Required Fields:
* Goals
* Timeframe

Definitions:
* time frame - monthly, quarterly, bi-annually, annually
* investment vehicle - 401k, Roth 401k, SEP-401k, HSA, IRA, Roth IRA, 529, 457, 403
* currency - 3 letter representation of currency (currency code). Default to USD.

#### Goal Update Message Replies
