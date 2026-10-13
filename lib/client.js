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
      warnExposed: "This endpoint is bound beyond this machine and has no API key. Anyone who can reach the port can spend this profile's model quota.",
      warnBindFailed: "The listener could not bind the configured address. Check the Host log for the reason.",
      followLabel: "Follow the selected model",
      followHint:
        "Serve whatever model is picked in chat or on the Models settings page, and switch when you switch there.",
      modelLabel: "Fallback model",
      modelHint:
        "Used when the endpoint is not following the selection, or when nothing is selected. Pick from the models this profile can actually reach.",
      modelFollowHint: "follow the selected model",
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
      loading: "Reading current settings…",
      save: "Save",
      saving: "Saving…",
      saved: "Saved. The listener rebinds on its own.",
      discard: "Discard",
      saveFailed: "The setting could not be saved.",
      current: "current",
      copy: "Copy",
      copied: "Copied",
      refresh: "Refresh",
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
      warnExposed: "该端点绑定在非本机地址且未设置 API 密钥。任何能访问该端口的人都能消耗本配置的模型额度。",
      warnBindFailed: "监听器无法绑定所配置的地址，具体原因见 Host 日志。",
      followLabel: "跟随所选模型",
      followHint: "对外提供聊天窗口或「模型」设置页中选中的模型，并随其切换。",
      modelLabel: "回退模型",
      modelHint: "当端点未跟随所选模型、或当前没有选中模型时使用。仅可从本配置实际可访问的模型中选择。",
      modelFollowHint: "跟随所选模型",
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
      loading: "正在读取当前设置…",
      save: "保存",
      saving: "保存中…",
      saved: "已保存，监听器会自动重新绑定。",
      discard: "放弃修改",
      saveFailed: "设置保存失败。",
      current: "当前值",
      copy: "复制",
      copied: "已复制",
      refresh: "刷新",
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
.dsh-me-inline{display:flex;align-items:center;gap:8px}
.dsh-me-check{accent-color:var(--dsw-alias-state-business-primary);height:16px;width:16px}
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
      const efforts = useEfforts(provider, model, remote);
      const defaultEffort = efforts.provider === provider && efforts.model === model ? efforts.defaultEffort : undefined;

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
       * A stored route that the catalog no longer lists is appended as a
       * disabled option rather than silently rewritten, so opening the page can
       * never destroy a configuration whose provider is merely offline.
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
          h("option", { value: "" }, t("modelFollowHint")),
          modelOptions,
          stored !== "" && !listed
            ? h("option", { value: stored }, stored + " — " + t("notListed"))
            : null,
        );
      };

      /**
       * The reasoning-effort dropdown. Its options come from the model's own
       * declaration, so an unsupported effort cannot be chosen. A stored value
       * the model no longer declares is kept as an extra option.
       */
      const effortSelect = () => {
        const stored = state.field("reasoningEffort") ?? "";
        const rows = efforts.provider === provider && efforts.model === model ? efforts.efforts : [];
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
          h(
            "span",
            { className: "dsh-me-inline" },
            h("input", {
              type: "checkbox",
              className: "dsh-me-check",
              checked: enabled,
              disabled,
              onChange: (event) => state.edit("enabled", event.target.checked),
            }),
          ),
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
          textField("apiKey", t("apiKeyPlaceholder")),
        ),
        exposedWithoutKey ? h("p", { className: "dsh-me-warn" }, t("warnExposed")) : null,
        live !== null && enabled && live.status !== "ok"
          ? h("p", { className: "dsh-me-warn" }, t("warnBindFailed"))
          : null,

        h(
          Row,
          { label: t("followLabel"), hint: t("followHint") },
          h(
            "span",
            { className: "dsh-me-inline" },
            h("input", {
              type: "checkbox",
              className: "dsh-me-check",
              checked: follow,
              disabled,
              onChange: (event) => state.edit("followSelection", event.target.checked),
            }),
          ),
        ),

        h(
          Row,
          { label: t("modelLabel"), hint: t("modelHint") },
          h(
            "div",
            { className: "dsh-me-field-stack" },
            modelSelect(),
            catalog.length === 0 ? h("p", { className: "dsh-me-row-hint" }, t("modelUnavailable")) : null,
          ),
        ),

        h(
          Row,
          { label: t("effortLabel"), hint: t("effortHint") },
          h(
            "div",
            { className: "dsh-me-field-stack" },
            effortSelect(),
            provider === "" || model === ""
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
