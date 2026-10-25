# dsh-model-endpoint

[English](README.en.md) | **中文**

把 DeepSeek Harness profile 当前正在使用的模型发布成一个 **OpenAI 兼容的 HTTP 端点**。

任意 OpenAI 客户端 —— `openai` SDK、LangChain、Cline、一个 shell 脚本、另一个 Harness
实例 —— 指向本插件打印出的 base URL，它就会用你在聊天里、或在「模型」设置页里选中的那个
模型作答。不需要第二份凭据，客户端侧除了一个 base URL 之外也没有任何额外配置。

因为监听器是插件自己创建的（不是 Harness 的 Web 服务器），绑定地址由你决定：`127.0.0.1`
只留在本机，`0.0.0.0` 发布到局域网，同一个端口放在路由器或 NAT 转发之后即可从公网访问。
**请求路径完全不取决于你用的是这三种拓扑里的哪一种。**

---

## 它做什么

| | |
|---|---|
| `GET /v1/models` | 列出本 profile 能路由的每个模型，既有 `provider/model` 形式，也有无歧义时的裸 id。 |
| `GET /v1/models/<id>` | 单个模型对象，否则 `404 model_not_found`。 |
| `POST /v1/chat/completions` | OpenAI 对话补全，支持流式（SSE）与非流式。 |
| `GET /health` | 实时绑定状态、各拓扑下的可达性、鉴权模式、当前模型。 |
| `GET /` | 与 `/health` 同一份文档。 |

另外还有几条挂在 Harness Web 服务器上（不是本端点）的路由：

| | |
|---|---|
| `GET /plugins/model-endpoint` | 同一份状态文档，同源，供设置页使用。 |
| `GET /plugins/model-endpoint/models` | 状态文档加上可路由模型目录。 |
| `GET /plugins/model-endpoint/efforts?provider=&model=` | 该路由声明的推理强度，供设置页下拉框使用。 |
| `GET /plugins/model-endpoint/tools` | 每个已注册工具及其开关状态，供设置页使用。 |

### 模型解析

端点按以下优先级作答：

1. **请求里的 `model` 字段**，前提是它指向一个可路由的模型。`provider/model` 与裸模型 id
   都接受。
2. **profile 当前的选择** —— 与聊天选择器和「模型」设置页写入的是同一个值。在聊天里换
   模型，端点就跟着换。
3. **本插件设置页上的备用提供方与模型**。
4. **无论选中的是什么**，即使 `followSelection` 关着，也作为最后手段使用。一个用你正看着
   的模型作答的端点，好过一个回 503 的端点。

如果没有任何可路由的东西，响应是 `503 model_unavailable`，报文里会列出每一个失败候选及
其原因。

### 推理强度

只有当被服务的模型确实声明了该强度时，`reasoning_effort` 才会生效；否则按模型自己的默认
值。这就是未知强度会安静降级而不是让请求失败的原因。插件页面上的设置项为省略该字段的请求
提供默认值。

备用模型与推理强度都是下拉框，不是自由文本。它们取自「模型」设置页读取的同一份目录，所以
你能选的就是这个 profile 真正能路由到的，而强度列表属于你实际选中的那个模型。已经存下来
但不再被提供的值 —— 提供方下线了、它的模型不再声明某个强度了 —— 仍然可选并带标注，而不
会被悄悄改写。

### 流式

`POST /v1/chat/completions` 带 `"stream": true` 时以 SSE 作答。文本作为 `delta.content`
到达，推理作为 `delta.reasoning_content`（DeepSeek 客户端已经理解的扩展），工具调用则是
惯常的带索引 `delta.tool_calls`。模型思考期间会发送保活注释，使代理不会因超时切断连接。
用量报告在最后一个 chunk 里，随终结性的 `finish_reason` 一起发出。

### 工具调用

这里有两件不同的事都叫「工具调用」，它们可以叠加。

**调用方自带的工具。** `tools` 会被转发给模型，工具调用在流式与非流式两条路径上都会回来，
入站的 `role: "tool"` 消息也照收。端点**从不**执行请求塞给它的工具 —— 那些属于调用方，调用
会在 `finish_reason: "tool_calls"` 下原样返回给调用方去跑。因此依赖 function calling 的
客户端可以正常工作。

**借出的工具。** 端点还可以把*这个 Harness* 已注册的工具借给模型，自己执行，再把结果回填
—— 一次请求内完成完整的模型/工具往返。那是对本机的真实能力，所以它**默认关闭**，开启后
也只发送被逐个打开的工具。见[借出的工具](#借出的工具)。

自带 `tools` 的请求永远不会收到借出的工具。把它们混在一起，等于把调用方跑不了的调用交还
给它。

---

## 借出的工具

设置 → **Model endpoint** → **把这个 profile 的工具借给模型**。

开启后，Harness 已注册的每个工具都会按名字列出并各带一个开关。只有打开的工具会被发送给
模型。当模型调用其中一个时，端点经 Harness 工具运行时执行它、附加结果、再问模型一次 ——
最多 **Max tool rounds**（默认 `8`）轮。达到上限的一轮会以 `409 tool_round_limit` 被切断，
而不是无限重试。

开关上方，**全选**一次写入打开所有已列出的工具，**全不选**则全部关闭，这样一长串工具不必
一行一行点。两者写入的是与单个开关相同的 `toolSwitches` 字典。

**如实说明粒度。** 开关是**按工具，而不是按插件**。Harness 注册表记录工具的名字、描述与
参数；它不记录是哪个插件注册的，而工具注册所在的 scope 属于调用它的 agent，不属于插件。
因此按插件的开关将不得不猜测本插件无从观测的归属。按工具比按插件更细，而且是失败关闭的，
所以提供的就是按工具。

有些工具会执行代码、读写文件或访问网络。请只为那些你愿意替一个未鉴权调用方亲自运行的工具
打开开关 —— 如果监听器在 `127.0.0.1` 之外可达，还要设一个 API 密钥。

```sh
curl http://127.0.0.1:8787/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"model":"auto","messages":[{"role":"user","content":"列出工作区里的文件。"}]}'
```

是否调用借出的工具由模型决定；没有任何东西强制它。

---

## 安装

从一份检出，或从一个打包好的 tarball：

```sh
dsh plugin --profile desktop add /absolute/path/to/dsh-model-endpoint
# 或者
pnpm pack --pack-destination dist
dsh plugin --profile desktop add /absolute/path/to/dist/dsh-model-endpoint-1.0.0.tgz
```

插件会自行挂载、启动监听器，并在「设置」下添加一个 **Model endpoint** 页面。除此之外无需
任何东西 —— Harness 自身不暴露任何入站 HTTP API，所以本插件从头到尾拥有自己的监听器。

**最低版本：DeepSeek Harness 0.2.1-rc.2。** 图像转发依赖该版本提供的内置附件服务。

验证：

```sh
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/v1/models
```

卸载：

```sh
dsh plugin --profile desktop remove dsh-model-endpoint
```

### 两点值得知道的事

**用 `dsh plugin add` 安装，不要手工改。** 自己编辑 profile 清单会让正在运行的进程留下一张
过期的模块解析表：插件会作为一个*死行*加载 —— 出现在组合里、从未激活、任何地方都不报错 ——
直到进程重启。这不是本插件特有的问题。

**绝不要先用 `link:` 安装、之后又换成 tarball。** pnpm 会移除旧的 `node_modules` 条目，而在
Windows 上它会跟随重解析点，从而清空链接指向的源码目录。用一种方式安装，就一直用那种方式。

---

## 设置

设置 → **Model endpoint**。

| 字段 | 默认值 | 含义 |
|---|---|---|
| Run the endpoint | 开 | 在不卸载的情况下关掉监听器。 |
| Bind address | `127.0.0.1` | `0.0.0.0` 接受每个接口上的连接。 |
| Port | `8787` | 客户端连接的端口。 |
| API key | 空 | 设置后，客户端需发送 `Authorization: Bearer <key>`。 |
| Follow the selected model | 开 | 服务聊天或「模型」页里选中的任何模型。开启期间备用模型下拉框会隐藏，因为它不是实际被服务的东西。 |
| Fallback provider / model | 空 | 不跟随当前选择、或什么都没选时使用。从本 profile 真正能到的模型下拉框里选。 |
| Reasoning effort | 模型默认 | 只在被服务的模型声明它时生效。下拉框列的正是所选备用模型声明的强度，加上该模型自己的默认值。 |
| Extra system prompt | 空 | 只为自身不带 system 消息的请求前置。 |
| Default max output tokens | `8192` | 请求省略 `max_tokens` 时使用。`0` 表示本端点不加任何上限 —— 请求不带 `maxTokens` 字段发出，由提供方按它自己模型的限制处理。 |
| Request timeout (ms) | `600000` | 一次补全（含流式）的上界。 |
| Allowed browser origin | `*` | 作为 `Access-Control-Allow-Origin` 发送。 |
| Lend this profile's tools | 关 | 把下面打开开关的 Harness 工具交给模型，并在此执行。 |
| （逐个工具） | 关 | 每个已注册工具一个开关。只有打开的工具会被发送。 |
| Max tool rounds | `8` | 一次请求在被切断前可进行的模型/工具往返次数。 |

**API key** 那一行有一个 **Generate** 按钮，会用 62 个字符的字母表加拒绝采样填上一个全新的
48 字符密钥（约 286 位，没有需要转义的 `+`/`/`/`=`，也没有易混的字符对）。它只是填入字段 ——
按 **Save** 才生效，并且请先把它复制出去，因为本字段是它唯一的存放处。

每个字段都是实时的：改一个，监听器就自行重新绑定。字段上方的状态块显示**实际**绑定的端口
和本机可达的地址，读自正在运行的监听器，而不是把表单里的值回显出来。

### 安全

只有在绑定 `127.0.0.1` 时才可以留空 API 密钥。当端点在无密钥的情况下绑定到本机之外时，
设置页会给出警告，因为那种配置下**任何能连到这个端口的人都能花掉本 profile 的模型额度**。
API 密钥以常量时间比较。

没有 TLS。如果你要把它暴露到公网，请在反向代理处终结 TLS，或把连接保持在隧道内 —— 无论
哪种方式，端点本身说的都是明文 HTTP。

---

## 连接一个客户端

任意 OpenAI 兼容客户端：

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8787/v1", api_key="unused")
client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "hello"}],
)
```

`model: "auto"`（或 `"default"`，或省略该字段）表示「用这个 profile 当前选中的」。鉴权关闭
时，任意非空字符串都能当 API 密钥用。

用 `curl`：

```sh
curl http://127.0.0.1:8787/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"model":"auto","messages":[{"role":"user","content":"hello"}],"stream":true}'
```

### 图像输入

用户消息可使用标准 OpenAI Chat Completions image_url 内容块；端点会把图像下载为有大小上限的字节，再通过 Harness 附件服务持久化后交给模型，不会把 image_url 直接传给文本端点。

支持 PNG、JPEG、WebP、GIF；HTTP(S) URL 仅允许默认端口和公开 IP 目标，DNS 结果会固定到本次请求，重定向会重新校验。每个请求最多 8 张图、累计最多 20 MiB、单张最多 8 MiB；每个 URL 最多 3 次重定向，每跳 15 秒。也支持 base64 data: URL（总 JSON 请求体仍受现有 8 MiB 上限限制）。私有/本地地址和非图像响应会拒绝。

如果模型目录明确声明所选模型不接受 image 输入，端点会在下载前返回 400 unsupported_content。模型元数据没有提供模态信息时，端点会尝试提交图像；最终仍取决于该模型适配器是否支持图像。

示例：

```json
{"model":"auto","messages":[{"role":"user","content":[{"type":"text","text":"这张图片里有什么？"},{"type":"image_url","image_url":{"url":"https://example.com/photo.jpg"}}]}]}
```

---

### 从另一台机器访问

1. 把 **Bind address** 设为 `0.0.0.0`，并给端点设一个 **API key**。
2. 从状态块里读 **Local network** URL —— 那是本机在局域网里的地址，端口已经填好。
3. 要从公网访问，就在路由器上把该端口转发到本机，然后使用你的公网地址。端点不需要知道
   转发这件事；到达的请求就是会被作答的请求。

如果 Host 日志说监听器无法绑定，那说明端口被占用，或者绑定地址在本机并不存在。设置页会把
这种情况呈现为「Unknown」状态，而不是默默假装在跑。

---

## 错误

错误使用 OpenAI 的信封：

```json
{"error": {"message": "...", "type": "invalid_request_error", "code": "model_not_found"}}
```

| 状态 | 代码 | 原因 |
|---|---|---|
| 400 | `invalid_request_error` | 消息、角色、工具或请求体格式错误。 |
| 400 | `unsupported_content` | 内容块不受支持，或元数据明确声明所选模型不接收图像；若元数据未提供模态信息，则尝试提交并由适配器判断。 |
| 401 | `invalid_api_key` | 缺少或错误的 bearer token。 |
| 404 | `not_found` | 没有这条路由。 |
| 404 | `model_not_found` | 请求的 `model` 不可路由。 |
| 405 | `method_not_allowed` | 对已知路由用了错误的方法。 |
| 409 | `tool_round_limit` | 模型在超过 **Max tool rounds** 之后仍在调用借出的工具。 |
| 413 | `request_too_large` | 请求体超过 8 MiB，或单图/请求累计图像字节超限。 |
| 502 | `upstream_error` | 上游模型调用或公共图像 URL 获取失败。 |
| 504 | `request_timeout` | 公共图像 URL 获取超时。 |
| 429 | `rate_limit_exceeded` | 上游提供方限流。 |
| 429 | `insufficient_quota` | 上游额度耗尽。 |
| 503 | `model_unavailable` | 无法解析出任何可路由的目标。 |

上游失败保留 Harness 自己的分类，因此 `AUTH`、`RATE_LIMIT`、`QUOTA`、`ACCOUNT_QUOTA`
与 `CONTEXT_WINDOW_EXCEEDED` 会以上表中的代码到达，而不会被拍平成一个笼统的错误。

---

## 目录结构

```
cordis.patch.yml    profile 条目：id `model-endpoint` —— 同时也是它的设置命名空间
lib/index.js        Host 半侧：HTTP 监听器与 OpenAI 转译
lib/client.js       Client 半侧：设置页
lib/openai-content.js OpenAI 内容转换与附件接入
lib/openai-images.js 受限数据 URL/远程图像读取
tests/*.test.js      图像输入与 URL 安全回归测试
locale/{en,zh}.json 插件列表用的显示元数据
icon.svg            插件图标
```

`cordis.patch.yml` 里的 profile 条目 id 是承重的：设置服务按条目 id 寻址插件，所以设置
命名空间与 id 必须一致。只改一个而不改另一个，设置页就会脱钩。

---

## 开发

语法检查两半：

```sh
ELECTRON_RUN_AS_NODE=1 "/path/to/DeepSeek Harness" --check lib/index.js
ELECTRON_RUN_AS_NODE=1 "/path/to/DeepSeek Harness" --check lib/client.js
```

运行回归测试：

```sh
npm test
```

打包：

```sh
pnpm pack --pack-destination dist
```

Host 半侧是 ESM，导入 `@deepseek-ai/schemastery` 与 `@deepseek-ai/dsh-llm`。两者都经
Harness 安装解析，所以本包把它们声明为 peer 依赖，`node_modules/` 不进仓库。

---

## 免责声明

在你依赖它之前请先审阅。它是针对 Harness **0.2.0-rc.2** 写的，没有任何东西保证它跟得上
之后的版本。

它是通过阅读那份安装自身的源码写成的，并对着一个正在运行的 profile 做过现场验证：监听器
能绑定、`/v1/models` 能枚举出 profile 的提供方、`/v1/chat/completions` 能流式返回真实
补全、设置页能通过设置服务读写。借出工具的往返循环是对着一个用假工具注册表驱动 Host 半侧
的测试台验证的，覆盖了能跑的工具、会失败的工具、只在后续 delta 上才出现名字的调用、畸形的
参数、撞到轮数上限的模型循环，以及一个绝不能被与借出工具混用的调用方自带工具。

它不是从任何现有插件抄来的。它仍可能含有错误，且不附带任何担保。在把它暴露到网络之前，
请先读一遍。

---

## 由 AI 生成

本仓库中的一切都由 AI 助手应仓库所有者的要求生成：

- Host 半侧（`lib/index.js`），包括每个请求处理器、OpenAI 转译层与监听器生命周期；
- Client 半侧（`lib/client.js`），包括设置页、其样式、胶囊开关、随机密钥生成器，以及中英文
  文案；
- 设置页的额外 system 提示词字段及其空默认值 —— 端点刻意不注入任何自己的东西，因此调用方
  自己的 system 消息原样通过；
- 本 README、插件清单、`cordis.patch.yml` 与 `icon.svg`；
- 每个文件里的每一条代码注释。

---

## 许可证

MIT —— 见 [LICENSE](LICENSE)。
