# DataFire "Hello World" Project
This is a small sample project to demonstrate DataFire's features. It will create
a single Action, which takes in a name, and outputs a greeting. We'll also link
that action to an HTTP endpoint and a scheduled task.

## Action
We'll create our action in `hello.js`.

> You can also return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
> from your action if you want to perform asynchronous operations.

#### hello.js
```js
var datafire = require('datafire');
module.exports = new datafire.Action({
  handler: input => "Hello, world",
})
```

Now let's run it:
```bash
datafire run ./hello.js
```

## HTTP Endpoints
Now let's create a `GET /hello` API endpoint in `DataFire.yml` that will trigger the Action:

#### DataFire.yml
```yaml
paths:
  /hello:
    get:
      action: ./hello.js
```

We can try it out with `datafire serve`
```bash
datafire serve --port 3000 &
# DataFire listening on port 3000

curl http://localhost:3000/hello
# "Hello, world"
```

## Adding Inputs
You can add inputs with [JSON Schema](http://json-schema.org/).

```js
var datafire = require('datafire');
module.exports = new datafire.Action({
  handler: input => 'Hello, ' + input.name,
  inputs: [{
    title: 'name',
    type: 'string',
    maxLength: 20,
    pattern: '\w+'
    default: "World",
  }],
})
```

Then we can run:
```bash
datafire serve --port 3000 &
# DataFire listening on port 3000

curl http://localhost:3000/hello?name=world
# "Hello, world"

curl http://localhost:3000/hello
# {"error": "Missing required query parameter 'name'"}
```

## HTTP Responses
By default, DataFire will return your handler's output as JSON with a 200 status
code (as well as 404/400/500 errors when appropriate). However, you can specify
custom response codes, content types, and bodies in your Action.

```js
module.exports = new datafire.Action({
  inputs: [{title: 'name'}],
  handler: input => {
    if (input.name === 'Voldemort') {
      return new datafire.Response({
        statusCode: 401,
        headers: {'Content-Type': 'text/html'},
        body: "<h1>Nope.</h1>",
      });
    } else {
      return "Hello, " + input.name;
    }
  }
})
```

## HTTP Requests
You can use `context.request` to access the original request

```js
module.exports = new datafire.Action({
  handler: (input, context) => {
    if (context.type === 'http') {
      console.log(context.request.method, context.request.path);
      console.log(context.request.query.name);
      console.log(context.request.headers.authorization);
    }
  }
})
```

