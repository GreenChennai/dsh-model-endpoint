/**
 * dsh-model-endpoint — Client half.
 *
 * One settings page for the endpoint: where it binds, who may call it, and
 * which model it serves. The page reads live state from the Host half's
 * same-origin status route, so it can show the real bound port and the
 * addresses this machine is reachable at, instead of echoing settings back.
 *
 * This file is AI-generated. See README.md. It must not load any Harness
 * Client package: only `react` and `react/jsx-runtime` are available here.
 */
window.__ModuleLoader__.load({
  id: "dsh-model-endpoint",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } = React;

    /** Locale namespace; also the settings namespace prefix used by the Host. */
    const LOCALE_NS = "dsh-model-endpoint";
    /** Profile entry id of the Host half — the settings namespace it registers. */
    const CONFIG_NS = "model-endpoint";
    /** Same-origin status route mounted by the Host half. */
    const STATUS_ROUTE = "/plugins/model-endpoint";

    const en = {
      nav: "Model endpoint",
      title: "Model endpoint",
      intro:
        "Serves the model this profile is using over an OpenAI-compatible HTTP API. Point any OpenAI client at the base URL below; the same address works on this machine, across your LAN, and through a router or NAT port forward.",
      unavailable: "The Host half of this plugin is not running, so its settings cannot be read.",
      readOnly: "These settings are read-only in this session.",
      statusLabel: "Status",
      statusRunning: "Listening",
      statusStopped: "Stopped",
      statusUnknown: "Unknown",
      baseUrlLabel: "Base URL",
      baseUrlOwn: "Use this as the OpenAI base URL, and any non-empty string as the API key.",
      reachThisMachine: "This machine",
      reachLocalNetwork: "Local network",
      reachPublic: "Public internet",
      reachPublicValue: "this port, through your router or NAT forward",
      reachUnavailable: "not exposed on this bind address",
      authLabel: "Authentication",
      authNone: "none — anyone who can reach the port can use this profile's models",
      authBearer: "bearer token",
      enabledLabel: "Run the endpoint",
      enabledHint: "Turn the listener off without uninstalling the plugin.",
      hostLabel: "Bind address",
      hostHint:
        "127.0.0.1 keeps it on this machine. 0.0.0.0 accepts connections from every interface, which is what makes it reachable from your LAN and, through a port forward, from the internet.",
      hostPlaceholder: "127.0.0.1",
      portLabel: "Port",
      portHint: "The port clients connect to.",
      apiKeyLabel: "API key",
      apiKeyHint:
        "When set, clients must send it as Authorization: Bearer <key>. Leave empty only while bound to 127.0.0.1.",
      apiKeyPlaceholder: "no authentication",
      apiKeyGenerate: "Generate",
      apiKeyGenerateHint:
        "Fills the field with a fresh random 256-bit key. Copy it into your client before saving — the field is the only place it is stored.",
      warnExposed: "This endpoint is bound beyond this machine and has no API key. Anyone who can reach the port can spend this profile's model quota.",
      warnBindFailed: "The listener could not bind the configured address. Check the Host log for the reason.",
      followLabel: "Follow the selected model",
      followHint:
        "Serve whatever model is picked in chat or on the Models settings page, and switch when you switch there. Turn this off to pin the endpoint to one model below.",
      modelLabel: "Fallback model",
      modelHint:
        "Served whenever the selection cannot be followed, or when nothing is selected. Pick from the models this profile can actually reach.",
      modelNone: "no fallback — use the selection or report no model",
      modelFollowsHint: "Following the selection. Turn Follow off to pin a model here.",
      modelUnavailable: "No model is reachable from this profile, so there is nothing to choose yet.",
      notListed: "not currently reachable",
      effortLabel: "Reasoning effort",
      effortHint: "Only applied when the served model declares it; otherwise the model's own default is used.",
      effortDefault: "model default",
      effortModelDefault: "the model's own default",
      effortUnavailable: "Pick a fallback model to see the efforts it supports.",
      notDeclared: "not declared by this model",
      promptLabel: "Extra system prompt",
      promptHint: "Prepended only for requests that carry no system message of their own.",
      tokensLabel: "Default max output tokens",
      tokensHint: "Applied when a request omits max_tokens.",
      timeoutLabel: "Request timeout (ms)",
      timeoutHint: "Upper bound for one completion, including streaming.",
      corsLabel: "Allowed browser origin",
      corsHint: "Value sent as Access-Control-Allow-Origin. Use * to allow any web page to call the endpoint.",
      catalogLabel: "Models reachable from this profile",
      catalogEmpty: "No provider reported any model.",
      toolsLabel: "Lend this profile's tools",
      toolsHint:
        "Lets the calling model see tools this Harness has registered and run them through the Harness, with the authority they already have. Off by default; each tool below is switched on individually.",
      toolsUnavailable: "This profile registers no tools, so there is nothing to lend.",
      toolsStale:
        "The running Host half predates this page, so the tool list cannot be read. Restart DeepSeek Harness to load it.",
      toolsOff: "Off. Turn this on to choose which tools are lent.",
      toolsEmpty: "On, but no tool is switched on below, so nothing is lent yet.",
      toolsRoundLimit: "Round-trip limit",
      toolsRoundLimitHint: "How many model/tool round trips one request may take before it is cut off.",
      toolsAttribution:
        "The Harness does not record which plugin registered a tool, so this list is by tool name rather than by plugin.",
      toolOn: "lent",
      toolOffTag: "kept back",
      loading: "Reading current settings…",
      save: "Save",
      saving: "Saving…",
      saved: "Saved. The listener rebinds on its own.",
      discard: "Discard",
      saveFailed: "The setting could not be saved.",
      copy: "Copy",
      copied: "Copied",
    };

    const zh = {
      nav: "模型端点",
      title: "模型端点",
      intro:
        "把当前配置使用的模型以 OpenAI 兼容 HTTP 接口发布出去。把任意 OpenAI 客户端指向下方 Base URL 即可；同一地址在本机、局域网以及路由器/NAT 端口转发后都同样可用。",
      unavailable: "本插件的主进程半侧未运行，无法读取其设置。",
      readOnly: "当前会话中这些设置为只读。",
      statusLabel: "状态",
      statusRunning: "监听中",
      statusStopped: "已停止",
      statusUnknown: "未知",
      baseUrlLabel: "Base URL",
      baseUrlOwn: "把它用作 OpenAI 的 base URL，API key 填任意非空字符串即可。",
      reachThisMachine: "本机",
      reachLocalNetwork: "局域网",
      reachPublic: "公网",
      reachPublicValue: "此端口，经路由器 / NAT 端口转发",
      reachUnavailable: "当前绑定地址未对外开放",
      authLabel: "鉴权",
      authNone: "无 —— 任何能访问该端口的人都能使用本配置的模型",
      authBearer: "Bearer 令牌",
      enabledLabel: "启用端点",
      enabledHint: "无需卸载插件即可关闭监听。",
      hostLabel: "绑定地址",
      hostHint:
        "127.0.0.1 只在本机可用。0.0.0.0 接受来自所有网卡的连接，这是让局域网、以及经端口转发后的公网能够访问的关键。",
      hostPlaceholder: "127.0.0.1",
      portLabel: "端口",
      portHint: "客户端连接的端口。",
      apiKeyLabel: "API 密钥",
      apiKeyHint: "设置后客户端需以 Authorization: Bearer <key> 发送。仅在绑定 127.0.0.1 时才可留空。",
      apiKeyPlaceholder: "不鉴权",
      apiKeyGenerate: "随机生成",
      apiKeyGenerateHint: "生成一个新的 256 位随机密钥填入。保存前请先复制到客户端——该字段是它唯一的存放位置。",
      warnExposed: "该端点绑定在非本机地址且未设置 API 密钥。任何能访问该端口的人都能消耗本配置的模型额度。",
      warnBindFailed: "监听器无法绑定所配置的地址，具体原因见 Host 日志。",
      followLabel: "跟随所选模型",
      followHint:
        "对外提供聊天窗口或「模型」设置页中选中的模型，并随其切换。关闭后可在下方固定一个模型。",
      modelLabel: "回退模型",
      modelHint: "当无法跟随所选模型、或当前没有选中模型时使用。仅可从本配置实际可访问的模型中选择。",
      modelNone: "无回退 —— 使用所选模型，或报告无可用模型",
      modelFollowsHint: "正在跟随所选模型。关闭「跟随」即可在此固定模型。",
      modelUnavailable: "本配置当前没有可访问的模型，暂无可选项。",
      notListed: "当前不可访问",
      effortLabel: "推理强度",
      effortHint: "仅在所服务的模型声明该强度时生效，否则使用模型自身的默认值。",
      effortDefault: "模型默认",
      effortModelDefault: "模型自身默认值",
      effortUnavailable: "先选择一个回退模型，即可看到它支持的推理强度。",
      notDeclared: "该模型未声明此强度",
      promptLabel: "附加系统提示词",
      promptHint: "仅对未自带 system 消息的请求前置。",
      tokensLabel: "默认最大输出 tokens",
      tokensHint: "当请求未提供 max_tokens 时使用。",
      timeoutLabel: "请求超时（毫秒）",
      timeoutHint: "单次补全的上限，含流式传输时间。",
      corsLabel: "允许的浏览器来源",
      corsHint: "作为 Access-Control-Allow-Origin 发送。填 * 表示允许任意网页调用该端点。",
      catalogLabel: "本配置可访问的模型",
      catalogEmpty: "没有任何 provider 报告模型。",
      toolsLabel: "借出本配置的工具",
      toolsHint:
        "让调用方模型看到本 Harness 已注册的工具，并由 Harness 代为运行，权限与这些工具原本拥有的相同。默认关闭；下方每个工具需单独开启。",
      toolsUnavailable: "本配置未注册任何工具，因此没有可借出的内容。",
      toolsStale: "正在运行的 Host 半侧早于本页面，无法读取工具列表。重启 DeepSeek Harness 后即可加载。",
      toolsOff: "已关闭。开启后可选择借出哪些工具。",
      toolsEmpty: "已开启，但下方没有任何工具被打开，因此暂不借出。",
      toolsRoundLimit: "往返轮次上限",
      toolsRoundLimitHint: "单个请求最多可进行的模型/工具往返次数，超出即中止。",
      toolsAttribution: "Harness 不记录工具由哪个插件注册，因此此列表按工具名而非插件划分。",
      toolOn: "已借出",
      toolOffTag: "已保留",
      loading: "正在读取当前设置…",
      save: "保存",
      saving: "保存中…",
      saved: "已保存，监听器会自动重新绑定。",
      discard: "放弃修改",
      saveFailed: "设置保存失败。",
      copy: "复制",
      copied: "已复制",
    };

    /* ------------------------------------------------------------------ css */

    const css = `
.dsh-me-page{display:flex;flex-direction:column;gap:8px;padding:4px 0 32px;max-width:760px}
.dsh-me-page h2{color:var(--dsw-alias-label-primary);font-size:16px;font-weight:600;line-height:24px;margin:0}
.dsh-me-intro{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;margin:0 0 8px}
.dsh-me-row{border-bottom:.5px solid var(--dsw-alias-border-l2);display:flex;flex-direction:column;gap:6px;padding:16px 0}
.dsh-me-row:last-of-type{border-bottom:none}
.dsh-me-label{color:var(--dsw-alias-label-primary);display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;line-height:20px}
.dsh-me-tag{background:var(--dsw-alias-bg-layer-3);border-radius:4px;color:var(--dsw-alias-label-tertiary);font-size:11px;font-weight:400;padding:1px 6px}
.dsh-me-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin:0}
.dsh-me-input,.dsh-me-select{background:var(--dsw-alias-bg-layer-2);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,6px);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:20px;padding:6px 8px;width:100%}
.dsh-me-input:focus,.dsh-me-select:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline:none}
.dsh-me-input:disabled,.dsh-me-select:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dsh-me-input[data-mono="true"]{font-family:var(--dsw-font-family-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px}
/* The switch keys its appearance off aria-checked rather than a parallel class,
 * so what is drawn can never disagree with what assistive technology reads. The
 * capsule track and round thumb opt out of the global superellipse. */
.dsh-me-switch{background:var(--dsw-alias-border-l3);border:0;border-radius:999px;box-sizing:border-box;corner-shape:round;cursor:pointer;flex:0 0 auto;height:20px;padding:2px;position:relative;width:36px}
.dsh-me-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}
.dsh-me-switch:disabled{cursor:default;opacity:.5}
.dsh-me-switch:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dsh-me-thumb{background:var(--dsw-alias-label-primary-foreground);border-radius:50%;corner-shape:round;display:block;height:16px;transition:transform 120ms ease;width:16px}
.dsh-me-switch[aria-checked="false"] .dsh-me-thumb{background:var(--dsw-alias-switch-thumb)}
.dsh-me-switch[aria-checked="true"] .dsh-me-thumb{transform:translateX(16px)}
.dsh-me-switch-row{align-items:center;display:flex;gap:10px}
.dsh-me-switch-row .dsh-me-hint{flex:1}
.dsh-me-key{display:flex;gap:8px}
.dsh-me-key .dsh-me-input{flex:1}
.dsh-me-tools{border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,6px);display:flex;flex-direction:column;max-height:280px;overflow-y:auto}
.dsh-me-tool{align-items:center;border-bottom:.5px solid var(--dsw-alias-border-l2);display:flex;gap:10px;padding:8px 10px}
.dsh-me-tool:last-child{border-bottom:none}
.dsh-me-tool[data-off="true"]{opacity:.6}
.dsh-me-tool-text{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.dsh-me-tool-name{color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px;line-height:18px;overflow-wrap:anywhere}
.dsh-me-tool-desc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.dsh-me-status{align-items:center;display:flex;gap:8px;font-size:13px;line-height:20px}
.dsh-me-dot{border-radius:50%;height:8px;width:8px;flex:none}
.dsh-me-dot[data-state="ok"]{background:var(--dsw-alias-state-success-primary)}
.dsh-me-dot[data-state="stopped"]{background:var(--dsw-alias-label-dimmed)}
.dsh-me-dot[data-state="unknown"]{background:var(--dsw-alias-state-warning-primary,var(--dsw-alias-label-tertiary))}
.dsh-me-url{display:flex;align-items:center;gap:8px}
.dsh-me-code{background:var(--dsw-alias-bg-layer-3);border-radius:4px;color:var(--dsw-alias-label-primary);flex:1;font-family:var(--dsw-font-family-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px;line-height:18px;overflow-wrap:anywhere;padding:6px 8px}
.dsh-me-reach{display:flex;flex-direction:column;gap:4px}
.dsh-me-reach-row{display:flex;gap:8px;font-size:12px;line-height:18px}
.dsh-me-reach-key{color:var(--dsw-alias-label-tertiary);flex:none;min-width:96px}
.dsh-me-reach-value{color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.dsh-me-footer{align-items:center;display:flex;gap:8px;padding-top:8px}
.dsh-me-primary{background:var(--dsw-alias-button-primary-fill);border:none;border-radius:var(--dsw-radius-sm,6px);color:var(--dsw-alias-label-primary-foreground);cursor:pointer;font-size:13px;height:28px;padding:0 12px}
.dsh-me-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
.dsh-me-primary:disabled{background:var(--dsw-alias-button-ghost-active-fill);color:var(--dsw-alias-label-dimmed);cursor:default}
.dsh-me-ghost{background:transparent;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,6px);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:13px;height:28px;padding:0 12px}
.dsh-me-ghost:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-me-ghost:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dsh-me-note{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dsh-me-note[data-tone="error"]{color:var(--dsw-alias-label-error)}
.dsh-me-note[data-tone="success"]{color:var(--dsw-alias-state-success-primary)}
.dsh-me-warn{color:var(--dsw-alias-label-error);font-size:12px;line-height:18px;margin:0}
.dsh-me-catalog{display:flex;flex-wrap:wrap;gap:4px}
.dsh-me-field-stack{display:flex;flex-direction:column;gap:4px}
.dsh-me-row-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin:0}
`;

    const cssTagId = "dsh-model-endpoint/settings.module.css";
    if (
      typeof document !== "undefined" &&
      document.querySelector("style[data-plugin-css=" + JSON.stringify(cssTagId) + "]") === null
    ) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-model-endpoint";
      tag.dataset.pluginCss = cssTagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    /* --------------------------------------------------------------- helpers */

    /** Resolve a plugin route against the page base. */
    function api(path) {
      try {
        return new URL(path, document.baseURI).pathname;
      } catch {
        return path;
      }
    }

    /** Read a JSON response, tolerating a body that is not JSON. */
    async function readJson(response) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }

    /**
     * Compare two field values the way the settings service does, so the dirty
     * flag does not flicker on structurally equal objects.
     */
    function sameValue(left, right) {
      if (Object.is(left, right)) return true;
      if (typeof left !== "object" || typeof right !== "object" || left === null || right === null) return false;
      try {
        return JSON.stringify(left) === JSON.stringify(right);
      } catch {
        return false;
      }
    }

    /**
     * Local edit buffer over one `ConfigFormController`. `t` is the slot
     * translator, used to report a failed write.
     */
    function useConfigForm(form, t) {
      const snapshot = useSyncExternalStore(
        useCallback((listener) => form.subscribe(listener), [form]),
        useCallback(() => form.getSnapshot(), [form]),
      );
      const [edits, setEdits] = useState({});
      const [saving, setSaving] = useState(false);
      const [failure, setFailure] = useState(null);
      const [saved, setSaved] = useState(false);

      // Drop the edit buffer whenever the Host publishes a new revision.
      const revision = snapshot.revision;
      const lastRevision = useRef(revision);
      useEffect(() => {
        if (lastRevision.current === revision) return;
        lastRevision.current = revision;
        setEdits({});
      }, [revision]);

      const value = snapshot.value ?? {};
      const field = useCallback((key) => (key in edits ? edits[key] : value[key]), [edits, value]);
      const dirty = useMemo(
        () => Object.keys(edits).some((key) => !sameValue(edits[key], value[key])),
        [edits, value],
      );

      const edit = useCallback((key, next) => {
        setSaved(false);
        setFailure(null);
        setEdits((current) => ({ ...current, [key]: next }));
      }, []);

      const discard = useCallback(() => {
        setEdits({});
        setFailure(null);
        setSaved(false);
      }, []);

      const save = useCallback(async () => {
        const changed = Object.keys(edits).filter((key) => !sameValue(edits[key], value[key]));
        if (changed.length === 0) return;
        setSaving(true);
        setFailure(null);
        setSaved(false);
        try {
          for (const key of changed) {
            const next = edits[key];
            // An empty text field means "restore the schema default".
            const accepted =
              next === "" || next === null || next === undefined
                ? await form.unset(key)
                : await form.set(key, next);
            if (accepted !== true) {
              setFailure(t("saveFailed"));
              return;
            }
          }
          setEdits({});
          setSaved(true);
        } catch {
          setFailure(t("saveFailed"));
        } finally {
          setSaving(false);
        }
      }, [edits, form, t, value]);

      return { snapshot, field, dirty, saving, failure, saved, edit, discard, save };
    }

    /** Poll the Host half's status route for the live bind state. */
    function useStatus() {
      const [status, setStatus] = useState({ phase: "loading", value: null });
      const reload = useCallback(async (signal) => {
        try {
          const response = await fetch(api(STATUS_ROUTE), { signal, cache: "no-store" });
          const payload = await readJson(response);
          // Require the fields the page dereferences, so a partial or foreign
          // response degrades to "unknown" instead of breaking the render.
          if (
            payload === null ||
            payload.ok !== true ||
            typeof payload.bind !== "object" ||
            payload.bind === null ||
            typeof payload.bind.baseUrl !== "string" ||
            typeof payload.status !== "string"
          ) {
            setStatus({ phase: "failed", value: null });
            return;
          }
          setStatus({ phase: "ready", value: payload });
        } catch (error) {
          if (signal?.aborted) return;
          setStatus({ phase: "failed", value: null });
        }
      }, []);
      useEffect(() => {
        const controller = new AbortController();
        void reload(controller.signal);
        const timer = setInterval(() => void reload(controller.signal), 5000);
        return () => {
          controller.abort();
          clearInterval(timer);
        };
      }, [reload]);
      return { status, reload };
    }

    /**
     * The Host-generation model catalog, fetched once per page load.
     *
     * The session remote is the same source the composer's own model picker
     * reads: it already carries each model's reasoning declaration, so both
     * dropdowns here agree with the picker by construction and can never offer
     * an effort the provider would reject. Enumerating every provider is
     * expensive, so concurrent callers share one request.
     */
    let catalogCache = { at: 0, promise: null };

    function loadModelCatalog(remote) {
      const now = Date.now();
      if (catalogCache.promise !== null && now - catalogCache.at < 60_000) return catalogCache.promise;
      const promise = Promise.resolve()
        .then(() => remote?.session?.modelCatalog?.())
        .catch(() => null);
      catalogCache = { at: now, promise };
      return promise;
    }

    /**
     * Flatten one remote catalog into `{provider, id, name}` rows, or return
     * null when the remote did not answer with a catalog at all.
     */
    function catalogRows(response) {
      if (response === null || response === undefined || response.ok !== true) return null;
      const groups = response.value?.groups;
      if (!Array.isArray(groups)) return null;
      const rows = [];
      for (const group of groups) {
        for (const model of group.models ?? []) {
          rows.push({
            provider: group.id,
            id: model.id,
            name: typeof model.name === "string" && model.name !== "" ? model.name : model.id,
          });
        }
      }
      return rows;
    }

    /**
     * Every model the endpoint can route to. Reloads when `reloadToken`
     * changes: the Host half exposes the same list over its own status route,
     * which is the fallback for a client that cannot reach the session remote.
     */
    function useCatalog(reloadToken, remote) {
      const [catalog, setCatalog] = useState([]);
      useEffect(() => {
        const controller = new AbortController();
        void (async () => {
          const remoteRows = catalogRows(await loadModelCatalog(remote));
          if (remoteRows !== null) {
            setCatalog(remoteRows);
            return;
          }
          try {
            const response = await fetch(api(STATUS_ROUTE + "/models"), { signal: controller.signal, cache: "no-store" });
            const payload = await readJson(response);
            if (payload === null || payload.ok !== true || !Array.isArray(payload.catalog)) {
              setCatalog([]);
              return;
            }
            setCatalog(
              payload.catalog.map((row) => ({
                provider: row.provider,
                id: row.id,
                name: typeof row.name === "string" && row.name !== "" ? row.name : row.id,
              })),
            );
          } catch {
            // A catalog that cannot be read simply renders as empty.
          }
        })();
        return () => controller.abort();
      }, [reloadToken, remote]);
      return catalog;
    }

    /**
     * The reasoning efforts the given route accepts, read from the same remote
     * catalog. Falls back to the plugin's own route so the dropdown still
     * works on a client that cannot reach the session remote. Re-resolves
     * whenever the route changes.
     */
    function useEfforts(provider, model, remote) {
      const [efforts, setEfforts] = useState({ provider: "", model: "", efforts: [], defaultEffort: undefined });
      useEffect(() => {
        if (provider === "" || model === "") {
          setEfforts({ provider, model, efforts: [], defaultEffort: undefined });
          return undefined;
        }
        let cancelled = false;
        void (async () => {
          const readRemote = async () => {
            const response = await loadModelCatalog(remote);
            if (response?.ok !== true) return undefined;
            const group = response.value?.groups?.find((entry) => entry.id === provider);
            const found = group?.models?.find((entry) => entry.id === model);
            if (found === undefined) return { efforts: [], defaultEffort: undefined };
            return {
              efforts: (found.reasoning?.efforts ?? []).map((effort) => ({ id: effort.id, name: effort.name })),
              defaultEffort: found.reasoning?.defaultEffort,
            };
          };
          const readHost = async () => {
            const query =
              STATUS_ROUTE + "/efforts?provider=" + encodeURIComponent(provider) + "&model=" + encodeURIComponent(model);
            const response = await fetch(api(query), { cache: "no-store" });
            const payload = await readJson(response);
            if (payload?.ok !== true || !Array.isArray(payload.efforts?.efforts)) return undefined;
            return { efforts: payload.efforts.efforts, defaultEffort: payload.efforts.defaultEffort };
          };
          let found;
          for (const read of [readRemote, readHost]) {
            try {
              found = await read();
            } catch {
              found = undefined;
            }
            if (found !== undefined) break;
          }
          if (cancelled) return;
          setEfforts({
            provider,
            model,
            efforts: found?.efforts ?? [],
            defaultEffort: found?.defaultEffort,
          });
        })();
        return () => {
          cancelled = true;
        };
      }, [provider, model, remote]);
      return efforts;
    }

    /**
     * The tools this profile has registered, with their switch state, read from
     * the Host half's status route. The list itself comes from the Host because
     * only it can enumerate the registry.
     *
     * An empty `toolList` is a real answer — the profile registers no tools. A
     * response with no `toolList` at all means the running Host half is older
     * than this page: the route exists, but this browser half was reloaded
     * without the app restarting, and ES modules are cached by URL. Saying
     * "stale" rather than "no tools" keeps the page from claiming an empty
     * registry it never actually enumerated.
     */
    function useTools(reloadToken) {
      const [state, setState] = useState({ phase: "loading", rows: [] });
      useEffect(() => {
        const controller = new AbortController();
        void (async () => {
          try {
            const response = await fetch(api(STATUS_ROUTE + "/tools"), { signal: controller.signal, cache: "no-store" });
            const payload = await readJson(response);
            if (payload === null || payload.ok !== true || !Array.isArray(payload.toolList)) {
              setState({ phase: "stale", rows: [] });
              return;
            }
            setState({
              phase: "ready",
              rows: payload.toolList.map((row) => ({
                name: typeof row.name === "string" ? row.name : "",
                description: typeof row.description === "string" ? row.description : "",
                enabled: row.enabled === true,
              })),
            });
          } catch {
            setState({ phase: "failed", rows: [] });
          }
        })();
        return () => controller.abort();
      }, [reloadToken]);
      return state;
    }

    /**
     * A capsule on/off switch.
     *
     * A button with `role="switch"` rather than a checkbox: the visual state
     * keys off `aria-checked`, so what is drawn and what a screen reader
     * announces cannot drift apart, and the label is exposed as the accessible
     * name instead of being a sibling that needs wiring up.
     */
    function Switch({ checked, disabled, label, onToggle }) {
      return h(
        "button",
        {
          type: "button",
          role: "switch",
          className: "dsh-me-switch",
          "aria-checked": checked ? "true" : "false",
          "aria-label": label,
          disabled,
          onClick: () => onToggle(!checked),
        },
        h("span", { className: "dsh-me-thumb" }),
      );
    }

    /**
     * A fresh random key, uniform over the alphabet this endpoint compares.
     *
     * Base64url would be shorter, but this is the string a person pastes into a
     * client config, so it stays inside an unambiguous 62-character set: no
     * padding, no `+`/`/` to escape in a URL, and no look-alike pairs.
     *
     * Bytes at or above 248 are rejected rather than folded in, because 256 is
     * not a multiple of 62 and `byte % 62` would make the first eight letters
     * about 1.6% likelier than the rest. 48 characters is ~286 bits.
     */
    function generateKey() {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const limit = Math.floor(256 / alphabet.length) * alphabet.length;
      const random = (target) => {
        if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
          crypto.getRandomValues(target);
          return;
        }
        for (let index = 0; index < target.length; index += 1) target[index] = Math.floor(Math.random() * 256);
      };
      let out = "";
      while (out.length < 48) {
        const bytes = new Uint8Array(48);
        random(bytes);
        for (const byte of bytes) {
          if (byte >= limit) continue;
          out += alphabet[byte % alphabet.length];
          if (out.length === 48) break;
        }
      }
      return out;
    }

    /** One labelled settings row. */
    function Row({ label, hint, tag, children }) {
      return h(
        "div",
        { className: "dsh-me-row" },
        h(
          "label",
          { className: "dsh-me-label" },
          label,
          tag === undefined ? null : h("span", { className: "dsh-me-tag" }, tag),
        ),
        children,
        hint === undefined ? null : h("p", { className: "dsh-me-hint" }, hint),
      );
    }

    /** A read-only URL with a copy button. */
    function UrlLine({ value, copyLabel, copiedLabel }) {
      const [copied, setCopied] = useState(false);
      const timer = useRef(null);
      useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
      return h(
        "div",
        { className: "dsh-me-url" },
        h("code", { className: "dsh-me-code" }, value),
        h(
          "button",
          {
            type: "button",
            className: "dsh-me-ghost",
            onClick: () => {
              try {
                void navigator.clipboard?.writeText(value);
                setCopied(true);
                if (timer.current !== null) clearTimeout(timer.current);
                timer.current = setTimeout(() => setCopied(false), 1400);
              } catch {
                // Clipboard access is best-effort; the code block is selectable.
              }
            },
          },
          copied ? copiedLabel : copyLabel,
        ),
      );
    }

    /** The plugin's dedicated settings page. */
    function EndpointSettingsSection({ configForms, t, remote }) {
      const form = useMemo(() => configForms.get(CONFIG_NS), [configForms]);
      const state = useConfigForm(form, t);
      const { status } = useStatus();
      const liveCatalog = useCatalog(status.value === null ? 0 : 1, remote);
      const tools = useTools(status.value === null ? 0 : 1);

      const snapshot = state.snapshot;
      const writable = snapshot.writable === true;
      const enabled = state.field("enabled") !== false;
      const host = state.field("host") ?? "";
      const apiKey = state.field("apiKey") ?? "";
      const follow = state.field("followSelection") !== false;
      const live = status.value;
      const liveStatus = live === null ? "unknown" : live.status === "ok" ? "ok" : "stopped";
      const loopback = host === "127.0.0.1" || host === "localhost" || host === "::1";
      const exposedWithoutKey = !loopback && apiKey.trim() === "";
      const boundPort = live === null ? state.field("port") : live.bind.port;
      const baseUrl =
        live === null
          ? "http://" + (host === "" || host === "0.0.0.0" ? "127.0.0.1" : host) + ":" + boundPort + "/v1"
          : live.bind.baseUrl;

      const disabled = !writable || state.saving;
      const statusText = liveStatus === "ok" ? t("statusRunning") : liveStatus === "stopped" ? t("statusStopped") : t("statusUnknown");
      const reach = live === null ? null : live.reachableFrom;
      const catalog = liveCatalog;

      // The catalog is the single source of truth for what can be picked: the
      // dropdowns are built from it, never typed into.
      const providers = useMemo(() => {
        const seen = [];
        for (const row of catalog) {
          if (!seen.includes(row.provider)) seen.push(row.provider);
        }
        return seen.sort();
      }, [catalog]);
      const modelsOfProvider = useMemo(() => {
        const byProvider = new Map();
        for (const row of catalog) {
          if (!byProvider.has(row.provider)) byProvider.set(row.provider, []);
          byProvider.get(row.provider).push(row);
        }
        for (const rows of byProvider.values()) rows.sort((left, right) => left.id.localeCompare(right.id));
        return byProvider;
      }, [catalog]);

      const provider = state.field("provider") ?? "";
      const model = state.field("model") ?? "";
      const toolsEnabled = state.field("toolsEnabled") === true;
      const switches = state.field("toolSwitches") ?? {};
      // A tool's switch is a draft value when the draft names it and the saved
      // value otherwise, so the row reflects what saving would produce rather
      // than what is currently stored.
      const toolOn = useCallback(
        (row) => (row.name in switches ? switches[row.name] === true : row.enabled),
        [switches],
      );
      const switchedOn = tools.rows.filter((row) => toolOn(row)).length;
      // While following, the fallback route is not what gets served, so the
      // effort menu has to describe the model that is: the one the Host reports
      // as live. Keeping that menu populated is why it is not hidden along with
      // the fallback model — the effort setting still applies to a followed
      // model whose own default it overrides.
      const followed =
        live !== null && live.model !== null && typeof live.model === "object" ? live.model : null;
      const effortRoute =
        follow && followed !== null && typeof followed.provider === "string" && typeof followed.model === "string"
          ? { provider: followed.provider, model: followed.model }
          : { provider, model };
      const efforts = useEfforts(effortRoute.provider, effortRoute.model, remote);
      const defaultEffort =
        efforts.provider === effortRoute.provider && efforts.model === effortRoute.model
          ? efforts.defaultEffort
          : undefined;

      /**
       * Group the catalog by provider for a single flat `provider/model` menu.
       * One control instead of two keeps the two halves of the pair from ever
       * disagreeing.
       */
      const modelOptions = useMemo(() => {
        const options = [];
        for (const name of providers) {
          options.push(
            h(
              "optgroup",
              { key: name, label: name },
              (modelsOfProvider.get(name) ?? []).map((row) =>
                h(
                  "option",
                  { key: row.provider + "/" + row.id, value: row.provider + "/" + row.id },
                  row.id === row.name ? row.id : row.id + " — " + row.name,
                ),
              ),
            ),
          );
        }
        return options;
      }, [providers, modelsOfProvider]);

      // Every hook above runs on every render, so this placeholder must stay
      // below all of them: returning early before a hook would break React's
      // call-order contract the moment a save flips `status`.
      if (snapshot.status !== "ready") {
        return h(
          "div",
          { className: "dsh-me-page" },
          h("h2", null, t("title")),
          h("p", { className: "dsh-me-note" }, snapshot.status === "loading" ? t("loading") : t("unavailable")),
        );
      }

      /** Numeric text input backed by a number field. */
      const numberField = (key, min, step) =>
        h("input", {
          className: "dsh-me-input",
          type: "number",
          inputMode: "numeric",
          min,
          step,
          value: state.field(key) ?? "",
          disabled,
          onChange: (event) => state.edit(key, Number(event.target.value)),
        });

      /** Text input backed by a string field. */
      const textField = (key, placeholder, mono) =>
        h("input", {
          className: "dsh-me-input",
          type: "text",
          spellCheck: false,
          ...(mono === true ? { "data-mono": "true" } : {}),
          value: state.field(key) ?? "",
          placeholder,
          disabled,
          onChange: (event) => state.edit(key, event.target.value),
        });

      /**
       * One dropdown over `provider/model`, built from the live catalog.
       *
       * Shown only while Follow is off, because that is the only time the value
       * is what gets served. A stored route the catalog no longer lists is
       * appended as an extra option rather than silently rewritten, so opening
       * the page can never destroy a configuration whose provider is merely
       * offline.
       */
      const modelSelect = () => {
        const stored = provider !== "" && model !== "" ? provider + "/" + model : "";
        const listed = catalog.some((row) => row.provider === provider && row.id === model);
        return h(
          "select",
          {
            className: "dsh-me-select",
            value: stored,
            disabled,
            onChange: (event) => {
              const chosen = event.target.value;
              if (chosen === "") {
                state.edit("provider", "");
                state.edit("model", "");
                return;
              }
              const cut = chosen.indexOf("/");
              state.edit("provider", chosen.slice(0, cut));
              state.edit("model", chosen.slice(cut + 1));
            },
          },
          h("option", { value: "" }, t("modelNone")),
          modelOptions,
          stored !== "" && !listed
            ? h("option", { value: stored }, stored + " — " + t("notListed"))
            : null,
        );
      };

      /**
       * The reasoning-effort dropdown. Its options come from the served model's
       * own declaration, so an unsupported effort cannot be chosen. A stored
       * value the model no longer declares is kept as an extra option.
       */
      const effortSelect = () => {
        const stored = state.field("reasoningEffort") ?? "";
        const rows = efforts.provider === effortRoute.provider && efforts.model === effortRoute.model ? efforts.efforts : [];
        const listed = rows.some((row) => row.id === stored);
        return h(
          "select",
          {
            className: "dsh-me-select",
            value: stored,
            disabled,
            onChange: (event) => state.edit("reasoningEffort", event.target.value),
          },
          h("option", { value: "" }, t("effortDefault")),
          rows.map((row) =>
            h(
              "option",
              { key: row.id, value: row.id },
              row.id === defaultEffort ? row.name + " — " + t("effortModelDefault") : row.name,
            ),
          ),
          stored !== "" && !listed ? h("option", { value: stored }, stored + " — " + t("notDeclared")) : null,
        );
      };

      /**
       * The API key field plus its generator.
       *
       * The generator only fills the field; saving is still an explicit act, so
       * a key that was generated but never saved cannot come back to lock a
       * caller out of a listener it was never applied to.
       */
      const apiKeyField = () =>
        h(
          "div",
          { className: "dsh-me-key" },
          textField("apiKey", t("apiKeyPlaceholder"), true),
          h(
            "button",
            {
              type: "button",
              className: "dsh-me-ghost",
              disabled,
              onClick: () => {
                const next = generateKey();
                state.edit("apiKey", next);
                try {
                  void navigator.clipboard?.writeText(next);
                } catch {
                  // The field is selectable, so a refused clipboard is not fatal.
                }
              },
            },
            t("apiKeyGenerate"),
          ),
        );

      return h(
        "div",
        { className: "dsh-me-page" },
        h("h2", null, t("title")),
        h("p", { className: "dsh-me-intro" }, t("intro")),
        !writable ? h("p", { className: "dsh-me-note" }, t("readOnly")) : null,

        h(
          Row,
          { label: t("statusLabel"), hint: t("baseUrlOwn") },
          h(
            "div",
            { className: "dsh-me-status" },
            h("span", { className: "dsh-me-dot", "data-state": liveStatus }),
            h("span", null, statusText),
          ),
          h(UrlLine, { value: baseUrl, copyLabel: t("copy"), copiedLabel: t("copied") }),
        ),

        reach === null
          ? null
          : h(
              Row,
              { label: t("baseUrlLabel") },
              h(
                "div",
                { className: "dsh-me-reach" },
                [
                  { key: t("reachThisMachine"), value: reach.thisMachine },
                  { key: t("reachLocalNetwork"), value: reach.localNetwork },
                  {
                    key: t("reachPublic"),
                    value: reach.publicInternet === null ? t("reachUnavailable") : t("reachPublicValue"),
                  },
                ].map((entry) =>
                  h(
                    "div",
                    { className: "dsh-me-reach-row", key: entry.key },
                    h("span", { className: "dsh-me-reach-key" }, entry.key),
                    h("span", { className: "dsh-me-reach-value" }, entry.value ?? t("reachUnavailable")),
                  ),
                ),
              ),
              h(
                "p",
                { className: "dsh-me-hint" },
                t("authLabel") + ": " + (live !== null && live.authentication === "none" ? t("authNone") : t("authBearer")),
              ),
            ),

        h(
          Row,
          { label: t("enabledLabel"), hint: t("enabledHint") },
          h(Switch, {
            checked: enabled,
            disabled,
            label: t("enabledLabel"),
            onToggle: (next) => state.edit("enabled", next),
          }),
        ),

        h(
          Row,
          { label: t("hostLabel"), hint: t("hostHint") },
          textField("host", t("hostPlaceholder")),
        ),

        h(Row, { label: t("portLabel"), hint: t("portHint") }, numberField("port", 1, 1)),

        h(
          Row,
          { label: t("apiKeyLabel"), hint: t("apiKeyHint") },
          apiKeyField(),
          h("p", { className: "dsh-me-row-hint" }, t("apiKeyGenerateHint")),
        ),
        exposedWithoutKey ? h("p", { className: "dsh-me-warn" }, t("warnExposed")) : null,
        live !== null && enabled && live.status !== "ok"
          ? h("p", { className: "dsh-me-warn" }, t("warnBindFailed"))
          : null,

        h(
          Row,
          { label: t("followLabel"), hint: t("followHint") },
          h(Switch, {
            checked: follow,
            disabled,
            label: t("followLabel"),
            onToggle: (next) => state.edit("followSelection", next),
          }),
        ),

        // The fallback model only decides anything while Follow is off, so it is
        // shown only then rather than left on screen as a field that silently
        // does nothing.
        follow
          ? null
          : h(
              Row,
              { label: t("modelLabel"), hint: t("modelHint") },
              h(
                "div",
                { className: "dsh-me-field-stack" },
                modelSelect(),
                catalog.length === 0 ? h("p", { className: "dsh-me-row-hint" }, t("modelUnavailable")) : null,
              ),
            ),

        follow ? h("p", { className: "dsh-me-row-hint" }, t("modelFollowsHint")) : null,

        h(
          Row,
          { label: t("effortLabel"), hint: t("effortHint") },
          h(
            "div",
            { className: "dsh-me-field-stack" },
            effortSelect(),
            effortRoute.provider === "" || effortRoute.model === ""
              ? h("p", { className: "dsh-me-row-hint" }, t("effortUnavailable"))
              : null,
          ),
        ),

        h(
          Row,
          { label: t("promptLabel"), hint: t("promptHint") },
          h(
            "textarea",
            {
              className: "dsh-me-input",
              rows: 3,
              value: state.field("systemPrompt") ?? "",
              disabled,
              spellCheck: false,
              onChange: (event) => state.edit("systemPrompt", event.target.value),
            },
          ),
        ),

        h(Row, { label: t("tokensLabel"), hint: t("tokensHint") }, numberField("defaultMaxTokens", 1, 1)),
        h(Row, { label: t("timeoutLabel"), hint: t("timeoutHint") }, numberField("requestTimeoutMs", 1000, 1000)),
        h(Row, { label: t("corsLabel"), hint: t("corsHint") }, textField("corsOrigin", "*")),

        h(
          Row,
          { label: t("toolsLabel"), hint: t("toolsHint") },
          h(Switch, {
            checked: toolsEnabled,
            disabled,
            label: t("toolsLabel"),
            onToggle: (next) => state.edit("toolsEnabled", next),
          }),
          tools.phase === "loading" ? null : tools.phase !== "ready"
            ? h("p", { className: "dsh-me-row-hint" }, t(tools.phase === "stale" ? "toolsStale" : "unavailable"))
            : tools.rows.length === 0
              ? h("p", { className: "dsh-me-row-hint" }, t("toolsUnavailable"))
              : !toolsEnabled
                ? h("p", { className: "dsh-me-row-hint" }, t("toolsOff"))
                : switchedOn === 0
                  ? h("p", { className: "dsh-me-row-hint" }, t("toolsEmpty"))
                  : null,
          h(
            "div",
            { className: "dsh-me-tools", hidden: tools.phase !== "ready" },
            tools.rows.map((row) => {
              const on = toolOn(row);
              return h(
                "div",
                { className: "dsh-me-tool", key: row.name, "data-off": toolsEnabled && on ? "false" : "true" },
                h(
                  "div",
                  { className: "dsh-me-tool-text" },
                  h("span", { className: "dsh-me-tool-name" }, row.name),
                  row.description === "" ? null : h("span", { className: "dsh-me-tool-desc" }, row.description),
                ),
                h("span", { className: "dsh-me-tag" }, on ? t("toolOn") : t("toolOffTag")),
                h(Switch, {
                  checked: on,
                  disabled: disabled || !toolsEnabled,
                  label: row.name,
                  onToggle: (next) => state.edit("toolSwitches", { ...switches, [row.name]: next }),
                }),
              );
            }),
          ),
          h("p", { className: "dsh-me-row-hint" }, t("toolsAttribution")),
        ),

        h(
          Row,
          { label: t("toolsRoundLimit"), hint: t("toolsRoundLimitHint") },
          numberField("maxToolRounds", 1, 1),
        ),

        h(
          Row,
          { label: t("catalogLabel") },
          catalog.length === 0
            ? h("p", { className: "dsh-me-hint" }, t("catalogEmpty"))
            : h(
                "div",
                { className: "dsh-me-catalog" },
                catalog.map((entry) =>
                  h("span", { className: "dsh-me-tag", key: entry.provider + "/" + entry.id }, entry.provider + "/" + entry.id),
                ),
              ),
        ),

        h(
          "div",
          { className: "dsh-me-footer" },
          h(
            "button",
            {
              type: "button",
              className: "dsh-me-primary",
              disabled: disabled || !state.dirty,
              onClick: () => {
                void state.save();
              },
            },
            state.saving ? t("saving") : t("save"),
          ),
          h(
            "button",
            { type: "button", className: "dsh-me-ghost", disabled: disabled || !state.dirty, onClick: state.discard },
            t("discard"),
          ),
          state.failure !== null
            ? h("span", { className: "dsh-me-note", "data-tone": "error" }, state.failure)
            : state.saved
              ? h("span", { className: "dsh-me-note", "data-tone": "success" }, t("saved"))
              : null,
        ),
      );
    }

    /* ----------------------------------------------------------------- apply */

    const inject = ["slots", "locale", "configForms"];

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(LOCALE_NS, { en, zh }));

      // The plugin's own settings page; the endpoint itself needs no composer seat.
      ctx.slots.inject("settings.section", () =>
        ctx.slots.register(
          {
            name: "settings.section",
            id: "model-endpoint",
            order: 62,
            label: () => ctx.locale.bind(LOCALE_NS)("nav"),
            locale: LOCALE_NS,
            inject: () => ({ configForms: ctx.configForms, remote: ctx.get("remote") }),
          },
          EndpointSettingsSection,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
