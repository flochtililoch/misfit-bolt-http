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

*Request:*

`GET /29852E52-67A0-490A-BC55-7FAB809AD0C0/state`

*Response:*

```json
{"state": true}

```

### Write State

*Request:*

```
PUT /29852E52-67A0-490A-BC55-7FAB809AD0C0/state
{"state": true}
```

*Response:*

```json
{"state": true}

```

### Read Hue

*Request:*

`GET /29852E52-67A0-490A-BC55-7FAB809AD0C0/hue`

*Response:*

```json
{"hue": 87}

```

### Write Hue

*Request:*

```
PUT /29852E52-67A0-490A-BC55-7FAB809AD0C0/hue
{"hue": 87}
```

*Response:*

```json
{"hue": 87}

```

### Read Saturation

*Request:*

`GET /29852E52-67A0-490A-BC55-7FAB809AD0C0/saturation`

*Response:*

```json
{"saturation": 87}

```

### Write Saturation

*Request:*

```
PUT /29852E52-67A0-490A-BC55-7FAB809AD0C0/saturation
{"saturation": 87}
```

*Response:*

```json
{"hue": 87}

```

### Read Brightness

*Request:*

`GET /29852E52-67A0-490A-BC55-7FAB809AD0C0/brightness`

*Response:*

```json
{"brightness": 87}

```

### Write Brightness

*Request:*

```
PUT /29852E52-67A0-490A-BC55-7FAB809AD0C0/brightness
{"brightness": 87}
```

*Response:*

```json
{"brightness": 87}

```


## TODO
- Tests
