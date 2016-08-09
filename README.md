# Misfit Bolt HTTP Interface


HTTP wrapper around [flochtililoch/misfit-bolt](https://github.com/flochtililoch/misfit-bolt).


## Prerequisites

To connect to the Misfit Bolt, you need BLE capabilities.
[See flochtililoch/misfit-bolt prerequisites](https://github.com/flochtililoch/misfit-bolt#prerequisites) for more details.


## Setup

```bash
npm install misfit-bolt-http
```


## Usage

This package starts an HTTP server, then initiate Misfit Bolt bulbs discovery.
Every bulb discovered will be exposed as a resource identified by its BLE UUID.
Use optional `-p` argument to pass in a port number. Defaults to `3000`.

```bash
misfit-bolt-http -p 1234
```

## Routes

Following routes assume bolt UUID is `29852E52-67A0-490A-BC55-7FAB809AD0C0`.


### Read State

Retrive current `red`, `green`, `blue`, `alpha`, `hue`, `saturation`, `brightness` and `state` values.

*Request:*

`GET /29852E52-67A0-490A-BC55-7FAB809AD0C0`

*Response status:*

```
200
```

*Response body:*

```json
{
  "id": "29852E52-67A0-490A-BC55-7FAB809AD0C0",
  "red": 0,
  "green": 255,
  "blue": 255,
  "alpha": 100,
  "hue": 180,
  "saturation": 100,
  "brightness": 100,
  "state": true
}
```

### Write State

Accepts one or several parameters at the same time.
Allowed parameters are `red` (`0` to `255`), `green` (`0` to `255`), `blue` (`0` to `255`), `alpha` (`0` to `100`), `hue` (`0` to `360`), `saturation` (`0` to `100`), `brightness` (`0` to `100`) and `state` (`true` / `false`).

#### Examples:

*Request:*

```
PATCH /29852E52-67A0-490A-BC55-7FAB809AD0C0
{"state": true}
```

```
PATCH /29852E52-67A0-490A-BC55-7FAB809AD0C0
{
  "state": true,
  "red": 255,
  "state": 255
}
```


*Response status:*

```
204
```


## TODO
- Tests
