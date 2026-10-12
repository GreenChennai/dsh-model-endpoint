# dsh-model-endpoint

Publishes the model your DeepSeek Harness profile is already using as an
**OpenAI-compatible HTTP endpoint**.

Point any OpenAI client — the `openai` SDK, LangChain, Cline, a shell script,
another Harness instance — at the base URL this plugin prints, and it answers
with whichever model you have selected in chat or on the Models settings page.
No second credential store, no extra configuration on the client side beyond a
base URL.

Because the listener is created by the plugin itself (not by the Harness web
server), the bind address is yours to choose: `127.0.0.1` keeps it on this
machine, `0.0.0.0` publishes it to your LAN, and the same port behind a router
or NAT forward is reachable from the public internet. **Nothing in the request
path depends on which of those three topologies you use.**

---

## What it does

| | |
|---|---|
| `GET /v1/models` | Lists every model this profile can route, as `provider/model` and as a bare id when unambiguous. |
| `GET /v1/models/<id>` | One model object, or `404 model_not_found`. |
| `POST /v1/chat/completions` | OpenAI chat completions, streaming (SSE) and non-streaming. |
| `GET /health` | Live bind state, reachability per topology, auth mode, current model. |
| `GET /` | The same document as `/health`. |

Also served, on the Harness web server rather than this endpoint:

| | |
|---|---|
| `GET /plugins/model-endpoint` | The same status document, same-origin, for the settings page. |
| `GET /plugins/model-endpoint/models` | The status document plus the reachable-model catalog. |

### Model resolution

The endpoint answers with, in order of precedence:

1. **The `model` field of the request**, if it names a routable model. Both
   `provider/model` and a bare model id are accepted.
2. **The profile's current selection** — the same value the chat picker and the
   Models settings page write. Switch models in chat, and the endpoint switches
   with you.
3. **The fallback provider and model** on this plugin's settings page.
4. **Whatever is selected**, even when `followSelection` is off, as a last
   resort. An endpoint that answers with the model you are looking at beats one
   that answers with a 503.

If nothing is routable, the response is `503 model_unavailable` and the message
names every candidate that failed and why.

### Reasoning effort

`reasoning_effort` is honoured only when the served model actually declares that
effort; otherwise the model's own default applies. This is why an unknown effort
degrades quietly instead of failing the request. The setting on the plugin's page
supplies a default for requests that omit the field.

### Streaming

`POST /v1/chat/completions` with `"stream": true` answers with SSE. Text arrives
as `delta.content`, reasoning as `delta.reasoning_content` (the extension
DeepSeek clients already understand), and tool calls as the usual indexed
`delta.tool_calls`. A keep-alive comment is sent while the model is thinking, so
proxies do not time the connection out. Usage is reported in a final chunk
carried with the terminal `finish_reason`.

### Tool calling

`tools` and `tool_choice` are forwarded, tool calls come back on both the
streaming and non-streaming paths, and `role: "tool"` messages are accepted on
the way in. Function calling therefore works with clients that rely on it.

---

## Install

From a checkout, or from a packed tarball:

```sh
dsh plugin --profile desktop add /absolute/path/to/dsh-model-endpoint
# or
pnpm pack --pack-destination dist
dsh plugin --profile desktop add /absolute/path/to/dist/dsh-model-endpoint-1.0.0.tgz
```

The plugin mounts itself, starts its listener, and adds a **Model endpoint** page
under Settings. Nothing else is required — the Harness exposes no inbound HTTP
API of its own, so this plugin owns its listener end to end.

Verify:

```sh
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/v1/models
```

Uninstall:

```sh
dsh plugin --profile desktop remove dsh-model-endpoint
```

### Two things worth knowing

**Install with `dsh plugin add`, not by hand.** Editing the profile manifest
yourself leaves the running process with a stale module-resolution table: the
plugin loads as a *dead row* — present in the composition, never activated, no
error anywhere — until the process restarts. This is not specific to this plugin.

**Never install a plugin with `link:` and later replace it with a tarball.**
pnpm removes the old `node_modules` entry, and on Windows it follows the reparse
point, which empties the source directory the link pointed at. Install one way
and stay there.

---

## Settings

Settings → **Model endpoint**.

| Field | Default | Meaning |
|---|---|---|
| Run the endpoint | on | Turn the listener off without uninstalling. |
| Bind address | `127.0.0.1` | `0.0.0.0` accepts connections on every interface. |
| Port | `8787` | The port clients connect to. |
| API key | empty | When set, clients send `Authorization: Bearer <key>`. |
| Follow the selected model | on | Serve whatever is picked in chat or on the Models page. |
| Fallback provider / model | empty | Used when not following the selection, or when nothing is selected. |
| Reasoning effort | model default | Only applied when the served model declares it. |
| Extra system prompt | empty | Prepended only for requests that carry no system message of their own. |
| Default max output tokens | `8192` | Applied when a request omits `max_tokens`. |
| Request timeout (ms) | `600000` | Upper bound for one completion, including streaming. |
| Allowed browser origin | `*` | Sent as `Access-Control-Allow-Origin`. |

Every field is live: change one and the listener rebinds on its own. The status
block above the fields shows the **actual** bound port and the addresses this
machine is reachable at, read from the running listener rather than echoed back
from the form.

### Security

Leave the API key empty only while bound to `127.0.0.1`. The settings page warns
when the endpoint is bound beyond this machine without a key, because in that
configuration **anyone who can reach the port can spend this profile's model
quota**. API keys are compared in constant time.

There is no TLS. If you expose this to the public internet, terminate TLS at
your reverse proxy, or keep the connection inside a tunnel — either way the
endpoint itself speaks plain HTTP.

---

## Connecting a client

Any OpenAI-compatible client:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8787/v1", api_key="unused")
client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "hello"}],
)
```

`model: "auto"` (or `"default"`, or omitting the field) means "use whatever this
profile has selected". Any non-empty string works as the API key when
authentication is off.

With `curl`:

```sh
curl http://127.0.0.1:8787/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"model":"auto","messages":[{"role":"user","content":"hello"}],"stream":true}'
```

### Reaching it from another machine

1. Set **Bind address** to `0.0.0.0` and give the endpoint an **API key**.
2. Read the **Local network** URL from the status block — that is this machine's
   address on your LAN, with the port already filled in.
3. From the internet, forward that port on your router to this machine and use
   your public address. The endpoint needs no knowledge of the forward; a request
   that arrives is a request that is answered.

If the Host log says the listener could not bind, the port is taken or the bind
address does not exist on this machine. The settings page surfaces this as
"Unknown" status rather than silently pretending to run.

---

## Errors

Errors use OpenAI's envelope:

```json
{"error": {"message": "...", "type": "invalid_request_error", "code": "model_not_found"}}
```

| Status | Code | Cause |
|---|---|---|
| 400 | `invalid_request_error` | Malformed message, role, tool, or body. |
| 400 | `unsupported_content` | A non-text content part. This endpoint serves text-only models. |
| 401 | `invalid_api_key` | Missing or wrong bearer token. |
| 404 | `not_found` | No such route. |
| 404 | `model_not_found` | The requested `model` is not routable. |
| 405 | `method_not_allowed` | Wrong method for a known route. |
| 413 | `request_too_large` | Body above 8 MiB, or an oversized input. |
| 429 | `rate_limit_exceeded` | Upstream provider rate limit. |
| 429 | `insufficient_quota` | Upstream quota exhausted. |
| 500 | `upstream_error` | The model call failed without a more specific code. |
| 503 | `model_unavailable` | Nothing routable could be resolved. |

Upstream failures keep the Harness's own classification, so `AUTH`,
`RATE_LIMIT`, `QUOTA`, `ACCOUNT_QUOTA` and `CONTEXT_WINDOW_EXCEEDED` arrive as
the codes above rather than being flattened into one generic error.

---

## Layout

```
cordis.patch.yml    profile entry: id `model-endpoint` — also its settings namespace
lib/index.js        Host half: the HTTP listener and the OpenAI translation
lib/client.js       Client half: the settings page
locale/{en,zh}.json display metadata for the plugin list
icon.svg            plugin icon
```

The profile entry id in `cordis.patch.yml` is load-bearing: the settings service
addresses a plugin by its entry id, so the settings namespace and the id must
match. Changing one without the other detaches the settings page.

---

## Development

Syntax check both halves:

```sh
ELECTRON_RUN_AS_NODE=1 "/path/to/DeepSeek Harness" --check lib/index.js
ELECTRON_RUN_AS_NODE=1 "/path/to/DeepSeek Harness" --check lib/client.js
```

Pack:

```sh
pnpm pack --pack-destination dist
```

The Host half is ESM and imports `@deepseek-ai/schemastery` and
`@deepseek-ai/dsh-llm`. Both resolve through the Harness installation, so the
package declares them as peer dependencies and `node_modules/` stays out of the
repository.

---

## AI-generated

Everything in this repository was generated by an AI assistant, at the request
of the repository owner:

- the Host half (`lib/index.js`), including every request handler, the OpenAI
  translation layer, and the listener lifecycle;
- the Client half (`lib/client.js`), including the settings page, its styles,
  and the English and Chinese copy;
- the default system prompt, if the settings field is left empty;
- this README, the plugin manifest, `cordis.patch.yml`, and `icon.svg`;
- every code comment in every file.

It was written against DeepSeek Harness `0.2.0-rc.2` by reading that
installation's own source, and verified live against a running profile: the
listener binds, `/v1/models` enumerates the profile's providers,
`/v1/chat/completions` streams real completions, and the settings page reads and
writes through the settings service.

It is not copied from any existing plugin. It may still contain mistakes, and it
is offered without warranty. Read it before you expose it to a network.

---

## License

MIT — see [LICENSE](LICENSE).
