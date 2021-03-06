# DataFire

[![Travis][travis-image]][travis-link]
[![NPM version][npm-image]][npm-link]
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://www.npmjs.com/package/datafire)
<!--[![Dependency status][deps-image]][deps-link]
[![devDependency status][devdeps-image]][devdeps-link]-->
<!--[![Code Climate][climate-image]][climate-link]-->

[twitter-image]: https://img.shields.io/badge/Share-on%20Twitter-blue.svg
[twitter-link]: https://twitter.com/intent/tweet?text=DataFire%20-%20open+source+integration+framework:&url=http%3A%2F%2Fgithub.com%2FDataFire%2FDataFire
[gitter-image]: https://img.shields.io/badge/Chat-on%20Gitter-blue.svg
[gitter-link]: https://gitter.im/DataFire/Lobby
[npm-image]: https://img.shields.io/npm/v/datafire.svg
[npm-link]: https://npmjs.org/package/datafire
[travis-image]: https://travis-ci.org/DataFire/DataFire.svg?branch=master
[travis-link]: https://travis-ci.org/DataFire/DataFire
[climate-image]: https://codeclimate.com/github/DataFire/DataFire.png
[climate-link]: https://codeclimate.com/github/DataFire/DataFire
[deps-image]: https://img.shields.io/david/DataFire/DataFire.svg
[deps-link]: https://david-dm.org/DataFire/DataFire
[devdeps-image]: https://img.shields.io/david/dev/DataFire/DataFire.svg
[devdeps-link]: https://david-dm.org/DataFire/DataFire#info=devDependencies
[blog-image]: https://img.shields.io/badge/Read-on%20Medium-blue.svg
[blog-link]: https://medium.com/datafire-io
[mail-image]: https://img.shields.io/badge/Subscribe-on%20MailChimp-blue.svg
[mail-link]: http://eepurl.com/c3t10T

DataFire is an open source framework for building and integrating APIs. It
provides over [600 integrations](https://github.com/DataFire/Integrations), including:

AWS &bull; Azure &bull; MongoDB &bull; Slack &bull; GitHub &bull;
Twilio &bull; Trello &bull; Square &bull;
Google Sheets &bull; Gmail &bull; Heroku

Each integration provides a set of composable actions. New actions can be built by
combining existing actions, JavaScript, and external libraries. They are driven by JavaScript Promises,
and can be triggered by a URL, on a schedule, or manually.

Want more? [DataFire.io](https://datafire.io) provides a simple interface for building,
managing, and hosting DataFire projects.

[![Share on Twitter][twitter-image]][twitter-link]
[![Read on Medium][blog-image]][blog-link]
[![Chat on Gitter][gitter-image]][gitter-link]
[![Subscribe on MailChimp][mail-image]][mail-link]


## Sample Projects
|  |  |  |
|--|--|--|
| Create an API backed by Google Sheets | [Repo](https://github.com/DataFire-repos/spreadsheet-base) | [Run on DataFire.io](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-repos%2Fspreadsheet-base) |
| E-mail yourself news headlines | [Repo](https://github.com/DataFire-flows/headlines) | [Run on DataFire.io](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-flows%2Fheadlines)|
| Backend for a "Contact Us" form | [Repo](https://github.com/DataFire-repos/contact-us-base) | [Run on DataFire.io](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-repos%2Fcontact-us-base) |
| Sync GitHub issues to a Trello board | [Repo](https://github.com/DataFire-flows/github-issues-to-trello) | [Run on DataFire.io](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-flows%2Fgithub-issues-to-trello) |
| Create a Spotify playlist from r/listentothis | [Repo](https://github.com/DataFire-flows/listen-to-this) | [Run on DataFire.io](https://app.datafire.io/projects?baseRepo=https:%2F%2Fgithub.com%2FDataFire-flows%2Flisten-to-this) |

## Installation
> Be sure to install DataFire both globally and as a project dependency.

```
npm install -g datafire
npm install --save datafire
```

## Hello World
> [See the full example](docs/Hello%20World.md) to learn about input validation,
> custom HTTP responses, and more.

Let's set up a simple DataFire project that has a single URL, `GET /hello`.
We'll need two things: an **action**, and a **trigger**.

### Action
First we create a new action - the logic that will be run when the URL is loaded:
###### ./hello.js
```js
let datafire = requrie('datafire');
module.exports = new datafire.Action({
  handler: input => "Hello, world!",
});
```

### Trigger
Next we set up a `path` trigger in DataFire.yml.

###### ./DataFire.yml
```yaml
paths:
  /hello:
    get:
      action: ./hello.js
```

### Running
Now we can run:
```bash
datafire serve --port 3000 &
# DataFire listening on port 3000

curl http://localhost:3000/hello
# "Hello, world!"

kill $! # Stop the server
```

## DataFire.yml Configuration
> [Learn more about DataFire.yml](./docs/DataFire_yml.md)

Your actions, triggers, credentials, and configuration options are set in DataFire.yml.
[Here's a sample DataFire.yml](./docs/DataFire_yml.md)


## Integrations
> [Learn more about integrations](./docs/Integrations.md)

Over 500 integrations are available on npm, under the `@datafire` scope.
For example, to install the `hacker_news` integration:
```bash
npm install @datafire/hacker_news
```

Each integration comes with a set of actions. For example, the `hacker_news` integration
contains the `getStories`, `getItem`, and `getUser` actions.

Check out the [usage](docs/Integrations.md) and [authentication](docs/Authentication.md) documentation to learn more.

## Actions
Actions come in two varieties:
* actions you build yourself in JavaScript, e.g. `./actions/hello.js`
* and actions that are part of an integration e.g. `hacker_news/getUser`

You can run actions on the command line:
```bash
datafire run hacker_news/getUser -i.username norvig
```

Or create triggers for them:
```yaml
paths:
  /hn/profile:
    get:
      action: hacker_news/getUser
      input:
        username: 'norvig'
```

Or run them in JavaScript:
```js
var hackerNews = require('@datafire/hacker_news').create();

// Using await (requires NodeJS >= v7.10):
(async function() {

  var user = await hackerNews.getUser({username: 'norvig'});
  console.log(user);

})();

// Or with Promises:
hackerNews.getUser({
  username: 'norvig',
}).then(user => {
  console.log(user);
});
```

### Building Actions
> [Learn more about building actions](docs/Hello%20World.md) 

Every action has a `handler`, which must return a value or a Promise. Actions can also
specify their inputs and outputs (using JSON schema).
Input (but not output) will be validated each time the action is run.

## Triggers
In DataFire, actions are run by triggers. There are three different types of triggers:

* `paths` - URLs like `GET /hello` or `POST /pets/{id}`
* `tasks` - Jobs that run on a schedule, like "every hour", or "every tuesday at 3pm"
* `tests` - Jobs that can be run manually using the `datafire` command line tool

Each trigger must have an `action`, and can also specify the `input` and `accounts` to pass
to that action.

### Paths
Paths create URLs that trigger your actions. For example, you can create a URL that returns
your GitHub profile:
```yaml
paths:
  /github_profile:
    get:
      action: github/users.username.get
      input:
        username: 'torvalds'
```

If you don't specify the `input` field, DataFire will automatically pass either query parameters
(for GET/DELETE/HEAD/OPTIONS) or the JSON body (for POST/PATCH/PUT) from the request to the
action.

Start serving your paths with:
```bash
datafire serve --port 3000
```

### Tasks
You can schedule tasks in DataFire.yml by specifying a
[rate or cron expression](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#RateExpressions).
```yaml
tasks:
  send_database_report:
    action: ./send-db-report.js
    schedule: rate(1 day) // or cron(0 0 * * * *)
    accounts:
      google_gmail: lucy
      mongodb: mongo_read_only
```

#### Monitors
A monitor will poll a particular resource for new items,
and only run your action if a new item is found. For instance, we can
check for new items on Reddit every 5 minutes:

```yaml
tasks:
  watch_reddit:
    schedule: rate(5 minutes)
    monitor:
      action: reddit_rss/frontPage
      array: feed.entries
      trackBy: link
      input:
        subreddit: sports
    action: ./post-story-to-slack.js
```

Start running tasks with:
```
datafire serve --tasks
```

### Tests
Tests allow you to save a particular set of inputs and accounts for a given action, so that
the action can be run manually with the DataFire command-line tool.

```yaml
tests:
  get_torvalds:
    action: github/users.username.get
    input:
      username: torvalds
  get_norvig:
    action: github/users.username.get
    input:
      username: norvig
```

Run a test with:
```
datafire test <test_id>
```

## Cookbook
Check out the [cookbook](docs/Cookbook.md) for common patterns, including
paginated responses and mocking/testing.

## Commands
> Run `datafire --help` or `datafire <command> --help` for more info

```bash
datafire serve --port 3000  # Start API server
datafire serve --tasks      # Start API server and start running tasks

datafire list             # View installed integrations
datafire list -a          # View all available integrations
datafire list -a -q news  # Search for integrations by keyword

datafire integrate --name petstore --openapi http://petstore.swagger.io/v2/swagger.json
datafire integrate --name reddit --rss http://www.reddit.com/.rss

datafire describe hacker_news           # Show info and actions
datafire describe hacker_news/getItem   # Show action details

datafire authenticate google_gmail      # Store credentials in DataFire-auth.yml

# Run an action
datafire run ./sendMessage.js

# Run integration actions with [integration]/[action]
datafire run github/repositories.get

# Pass parameters with --input
datafire run github/search.repositories.get --input.q java

# Use credentials with --accounts
datafire run github/user.get --accounts.github.access_token "abcde"
```

## Contributing
Contributions are welcome!

### Getting Started
```bash
git clone https://github.com/DataFire/DataFire && cd DataFire
npm install
```

Tests are run with `npm test` and require ports 3333-3336 to be open.

