var __defProp=Object.defineProperty;var __returnValue=(v)=>v;function __exportSetter(name,newValue){this[name]=__returnValue.bind(null,newValue)}var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0,configurable:!0,set:__exportSetter.bind(all,name)})};var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var exports_tac={};__export(exports_tac,{default:()=>tac_default});class Tac{props;tac;constructor(props={},tac=__ty_noopHelpers__){this.props=props,this.tac=tac}}var __ty_noopHelpers__,tac_default;var init_tac=__esm(()=>{__ty_noopHelpers__={isBrowser:!1,isServer:!0,bindPersistentFields:()=>{},env:(_,f)=>f,props:{},emit:()=>!1,fetch:(i,n)=>fetch(i,n),inject:(_,f)=>f,onMount:()=>{},provide:()=>{},rerender:()=>{}};tac_default=class tac_default extends Tac{onMount(){document.title="Tabs — DuVay Documentation",document.addEventListener("change",function(event){let tabs=event.target.closest&&event.target.closest("w-tabs[data-window]");if(!tabs)return;let win=document.getElementById(tabs.getAttribute("data-window"));if(!win)return;let index=Array.from(tabs.querySelectorAll("w-tab")).map(function(tab){return tab.getAttribute("value")}).indexOf(event.detail.value);if(index>=0)win.value=index})}}});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
const __ty_props__ = __ty_helpers__.decodeProps(props);
const { __ty_companion_import__ } = __ty_module_imports__;

const __ty_companion__ = await (async () => {
    const __ty_companion_module__ = await __ty_companion_import__();
    const __ty_Companion__ = __ty_companion_module__?.default;
    if (typeof __ty_Companion__ !== 'function') return null;
    const __ty_runtime_bindings__ = __ty_helpers__.createTacHelpers(__ty_props__);
    const __ty_instance__ = new __ty_Companion__(__ty_props__, __ty_runtime_bindings__);
    if (__ty_instance__) {
        if (__ty_instance__.__tac_wasm_ready__ && typeof __ty_instance__.__tac_wasm_ready__.then === 'function') {
            await __ty_instance__.__tac_wasm_ready__;
        }
        __ty_helpers__.bindCompanion(__ty_instance__, __ty_props__, __ty_runtime_bindings__);
    }
    return __ty_instance__;
})();
const __ty_scope__ = __ty_helpers__.createScope(__ty_companion__, __ty_props__);

with (__ty_scope__) {
    const emit = __ty_helpers__.emit;
    const fetch = __ty_helpers__.fetch;
    const isBrowser = __ty_helpers__.isBrowser;
    const isServer = __ty_helpers__.isServer;
    const onMount = __ty_helpers__.onMount;
    const rerender = __ty_helpers__.rerender;
    const inject = __ty_helpers__.inject;
    const provide = __ty_helpers__.provide;
    const env = __ty_helpers__.env;
    const fylo = __ty_helpers__.fylo;

    const demo_compare = await __ty_helpers__.loadTacModule('/components/demo/compare/tac.js')
    

    if (__ty_props__) {
        for (const __k__ of Object.keys(__ty_props__)) {
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(__k__) && !__k__.startsWith('__ty_')) {
                const __v__ = __ty_props__[__k__];
                try { eval(\`\${__k__} = __v__\`) } catch {}
            }
        }
    }

    const compRenders = new Map();
    const compRenderProps = new Map();

    return async function(elemId, event, compId) {
        const counters = { id: {}, ev: {}, bind: {}, persist: {} };
        const ty_componentRootId = compId
            ? (String(compId).startsWith('ty-') ? String(compId) : 'ty-' + compId + '-0')
            : null;

        __ty_helpers__.setRenderContext({ componentRootId: ty_componentRootId, elemId, event });

        const ty_generateId = (hash, source, displayHash = hash) => {
            const key = compId ? hash + '-' + compId : hash;
            const map = counters[source];
            const displayKey = compId ? displayHash + '-' + compId : displayHash;

            if (key in map) {
                return 'ty-' + displayKey + '-' + map[key]++;
            }

            map[key] = 1;
            return 'ty-' + displayKey + '-0';
        };

        const ty_invokeEvent = async (hash, action, targetHash = hash) => {
            if (elemId === ty_generateId(hash, 'ev', targetHash)) {
                if (typeof action === 'function') await action(event);
                else {
                    const toCall = (event && !action.endsWith(')')) ? action + "('" + event + "')" : action;
                    await eval(toCall);
                }
            }
            return '';
        };

        const ty_assignValue = (hash, variable, currentValue) => {
            let nextValue = currentValue;
            if (elemId === ty_generateId(hash, 'bind') && event) {
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(variable)) {
                    const __val__ = event.value;
                    try { eval(\`\${variable} = __val__\`) } catch {}
                    nextValue = __val__;
                }
            }
            return nextValue ?? '';
        };

        const ty_escapeHtml = (value) => {
            if (value === null || value === undefined) return '';
            return String(value)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        };

        const ty_escapeText = ty_escapeHtml;
        const ty_escapeAttr = ty_escapeHtml;

        let elements = '';
        let render;

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('a819157f', 'id'))}">\`
elements+=\`Tabs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b2809f51', 'id'))}">\`
elements+=\`Organize content into switchable panels. DuVay tabs support alignment, equal-width layouts, vertical orientation, stacked icons, overflow pagination, theming, and an animated selection indicator that glides between tabs.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('72ee6ecb', 'id'))}">\`
elements+=\`The indicator is progressively enhanced: hand-authored markup shows a static underline, while the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('39462eed', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` web component renders an animated slider (and falls back to the underline when JavaScript is absent). Pair tabs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b5be2e7a', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` for the matching content panes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7beeee81', 'id'))}">\`
elements+=\`Basic tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('aff3225c', 'id'))}">\`
elements+=\`Mark the selected tab with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2002fcdd', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` class, or set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('960a0c39', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a5249d0', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to the active tab's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c836ae0d', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`. The component emits a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3949907', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` event carrying the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2596388e', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aabe78ae', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\` when the selection changes.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cdd4189a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('da854c9d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c6e8e8a2', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d78c2492', 'id'))}">\`
elements+=\`Security\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('cb820014', 'id'))}">\`
elements+=\`Notifications\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f18a4671', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="account" id="\${ty_escapeAttr(ty_generateId('9d777949', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('49ddb74e', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="security" id="\${ty_escapeAttr(ty_generateId('1a1cb7e2', 'id'))}">\`
elements+=\`Security\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="notifications" id="\${ty_escapeAttr(ty_generateId('071d633d', 'id'))}">\`
elements+=\`Notifications\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('58861563', 'id'))}">\`
elements+=\`Tabs with content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e94f97eb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('18d327c6', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('148998b4', 'id'))}">\`
elements+=\`&lt;w-tabs-window-item&gt;\`
elements+=\`</code>\`
elements+=\` are Vuetify-named aliases for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('97fa99bf', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('75217817', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`. Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e198a52', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` on the tabs and set the window's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('531446cd', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` to the active index to keep them in sync.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('83ed6d0b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('5ebc0f53', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('5c030d09', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('b2d04c97', 'id'))}">\`
elements+=\`Details\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('98ef7a46', 'id'))}">\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c17c4dc0', 'id'))}">\`
elements+=\`Overview content goes here.\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('40e8c028', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" data-window="demo-window-basic" id="\${ty_escapeAttr(ty_generateId('11e2c654', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('cfa8344b', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="details" id="\${ty_escapeAttr(ty_generateId('5dc38161', 'id'))}">\`
elements+=\`Details\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('a2c7b29d', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
    \`
elements+=\`<w-tabs-window id="demo-window-basic">\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('1f44106e', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('9025e2f4', 'id'))}">\`
elements+=\`Overview — the big picture at a glance.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('4182a8be', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('52d9b66f', 'id'))}">\`
elements+=\`Details — every field, spelled out.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('cf9a20df', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('36718e42', 'id'))}">\`
elements+=\`Activity — a log of recent changes.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
    \`
elements+=\`</w-tabs-window>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('66cd1985', 'id'))}">\`
elements+=\`Alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2c7c2252', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('175168de', 'id'))}">\`
elements+=\`align-tabs\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0c4400a1', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb397d4e', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a29a087d', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`) to position the strip. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99f2d337', 'id'))}">\`
elements+=\`w-tabs--align-center\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bcc01bf0', 'id'))}">\`
elements+=\`w-tabs--align-end\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7d233c32', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--align-center" id="\${ty_escapeAttr(ty_generateId('7d7a3154', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('dfd238e9', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('dd369e4f', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('82d85c65', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('59b1ddfa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" align-tabs="center" id="\${ty_escapeAttr(ty_generateId('9b247036', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('471fe63f', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('1efd7c51', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="settings" id="\${ty_escapeAttr(ty_generateId('a8e6ef05', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fb179bc5', 'id'))}">\`
elements+=\`Fixed and grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6e77c817', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4964358', 'id'))}">\`
elements+=\`fixed-tabs\`
elements+=\`</code>\`
elements+=\` gives every tab an equal share of the width, capped at \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17d1e9ab', 'id'))}">\`
elements+=\`--w-tab-max-width\`
elements+=\`</code>\`
elements+=\` (18rem) and centered. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6987da06', 'id'))}">\`
elements+=\`grow\`
elements+=\`</code>\`
elements+=\` spreads the tabs to fill the whole strip with no cap.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('11524117', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--grow" id="\${ty_escapeAttr(ty_generateId('e287c2eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('402ddbc9', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d8d14a81', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d30a3c5f', 'id'))}">\`
elements+=\`Month\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('3d631feb', 'id'))}">\`
elements+=\`Year\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0ff2a380', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="week" grow="" id="\${ty_escapeAttr(ty_generateId('630ff8ed', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="day" id="\${ty_escapeAttr(ty_generateId('6ef678af', 'id'))}">\`
elements+=\`Day\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="week" id="\${ty_escapeAttr(ty_generateId('e492fc4f', 'id'))}">\`
elements+=\`Week\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="month" id="\${ty_escapeAttr(ty_generateId('753d17d1', 'id'))}">\`
elements+=\`Month\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="year" id="\${ty_escapeAttr(ty_generateId('687795db', 'id'))}">\`
elements+=\`Year\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6f47b991', 'id'))}">\`
elements+=\`Stacked\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fe9feb7a', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3b6f66a', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` to place an icon above the label. Slot an icon element followed by the text.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('92fd9194', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--stacked" id="\${ty_escapeAttr(ty_generateId('4a74ddac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('6792333a', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('b7b1b9ff', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('38ab2bda', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('db0f4f9f', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('92db2994', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('a3b6fd19', 'id'))}">\`
elements+=\`\uD83D\uDCCD\`
elements+=\`</span>\`
elements+=\`Nearby\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('072db47e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="recent" stacked="" id="\${ty_escapeAttr(ty_generateId('730b741f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="recent" id="\${ty_escapeAttr(ty_generateId('d8bdd9b6', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('e0c6d291', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="favorites" id="\${ty_escapeAttr(ty_generateId('d623dead', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('df201c63', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="nearby" id="\${ty_escapeAttr(ty_generateId('0da9aeb8', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('d5a92fb6', 'id'))}">\`
elements+=\`\uD83D\uDCCD\`
elements+=\`</span>\`
elements+=\`Nearby\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2b3c4a88', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fba57cde', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5787e0a3', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2953a2ac', 'id'))}">\`
elements+=\`w-tabs--vertical\`
elements+=\`</code>\`
elements+=\`) for a side rail with an inline-start indicator. It pairs naturally with a content window.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('28cfea73', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('31d06a03', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-tabs w-tabs--vertical" id="\${ty_escapeAttr(ty_generateId('664f8ec5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('ec69660a', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('4933c138', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('760cfefb', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('7ab727c1', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a5d5c043', 'id'))}">\`
elements+=\`Profile content goes here.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d59cdcc0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('dff9aa80', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tabs value="profile" direction="vertical" data-window="demo-window-vertical" id="\${ty_escapeAttr(ty_generateId('9695d309', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-tab value="profile" id="\${ty_escapeAttr(ty_generateId('484e9b12', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('21392f18', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="billing" id="\${ty_escapeAttr(ty_generateId('ef0411f3', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`</w-tabs>\`
elements+=\`
      \`
elements+=\`<w-tabs-window id="demo-window-vertical" class="w-flex-1">\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('0afc7026', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('f16f3335', 'id'))}">\`
elements+=\`Profile — your name and avatar.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('b6505d14', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('5ea129f5', 'id'))}">\`
elements+=\`Account — email and password.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('0025ff47', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('31cbd8e6', 'id'))}">\`
elements+=\`Billing — plan and invoices.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`</w-tabs-window>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f438d44b', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8d648160', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa7e5e31', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58c6194d', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('049adb19', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`) to tighten the tab height. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c663f853', 'id'))}">\`
elements+=\`w-tabs--comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7e6224e', 'id'))}">\`
elements+=\`w-tabs--compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a74c6c01', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--compact" id="\${ty_escapeAttr(ty_generateId('d5d9bfb5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('33f95214', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('fdf97338', 'id'))}">\`
elements+=\`Strip\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d117981f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="compact" density="compact" id="\${ty_escapeAttr(ty_generateId('2efbfcf5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="compact" id="\${ty_escapeAttr(ty_generateId('39f6e40c', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="strip" id="\${ty_escapeAttr(ty_generateId('ce902512', 'id'))}">\`
elements+=\`Strip\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('99340b3f', 'id'))}">\`
elements+=\`Color and slider color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7dfb4bd1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24725ad1', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the active tab's text and the default indicator color; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b10269ee', 'id'))}">\`
elements+=\`slider-color\`
elements+=\`</code>\`
elements+=\` overrides just the indicator; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30231c95', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\` tints the strip. Values are DuVay palette tokens (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('547ee725', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d471b59d', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d15e3833', 'id'))}">\`
elements+=\`tertiary\`
elements+=\`</code>\`
elements+=\`). With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3aeb76a3', 'id'))}">\`
elements+=\`--w-tabs-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('979b7a53', 'id'))}">\`
elements+=\`--w-tabs-slider-color\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd57380f', 'id'))}">\`
elements+=\`--w-tabs-bg\`
elements+=\`</code>\`
elements+=\` custom properties.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1ffacb97', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="--w-tabs-color: var(--w-success); --w-tabs-slider-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('13dfc687', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('20780553', 'id'))}">\`
elements+=\`Build\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('bc130a0a', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('86698333', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-mt-2" style="--w-tabs-bg: var(--w-surface-container-high); --w-tabs-slider-color: var(--w-tertiary)" id="\${ty_escapeAttr(ty_generateId('350af278', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('107b376b', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('e2464399', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('af7552ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="build" color="success" slider-color="success" id="\${ty_escapeAttr(ty_generateId('385cdfc8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="build" id="\${ty_escapeAttr(ty_generateId('17f70565', 'id'))}">\`
elements+=\`Build\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="deploy" id="\${ty_escapeAttr(ty_generateId('0d098de8', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="monitor" id="\${ty_escapeAttr(ty_generateId('c1d89a47', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
    \`
elements+=\`<w-tabs value="alpha" bg-color="surface-container-high" slider-color="tertiary" class="w-mt-2" id="\${ty_escapeAttr(ty_generateId('0e89e8fb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="alpha" id="\${ty_escapeAttr(ty_generateId('fd2646a0', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="beta" id="\${ty_escapeAttr(ty_generateId('f4589b5e', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('14e1e195', 'id'))}">\`
elements+=\`Hide slider\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b709bf50', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('31fb732b', 'id'))}">\`
elements+=\`hide-slider\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('575975ea', 'id'))}">\`
elements+=\`w-tabs--no-slider\`
elements+=\`</code>\`
elements+=\`) to remove the indicator entirely — the active tab is shown by color alone.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('75b110ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--no-slider" id="\${ty_escapeAttr(ty_generateId('7ca177a5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('8900aa28', 'id'))}">\`
elements+=\`No\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('6efa3fb8', 'id'))}">\`
elements+=\`Indicator\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6ec3fa61', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="no" hide-slider="" id="\${ty_escapeAttr(ty_generateId('903a9fa9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="no" id="\${ty_escapeAttr(ty_generateId('6a92ce07', 'id'))}">\`
elements+=\`No\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="indicator" id="\${ty_escapeAttr(ty_generateId('14bb4618', 'id'))}">\`
elements+=\`Indicator\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7d937287', 'id'))}">\`
elements+=\`Overflow arrows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ef8ac6d2', 'id'))}">\`
elements+=\`When a strip is too narrow for its tabs it scrolls. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ee45316', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` to the web component for pagination buttons (customizable with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38dfd262', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('433e5119', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`), and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aaa7eab8', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` to keep the selected tab scrolled to center. Arrows are a web-component enhancement; with plain CSS the strip simply scrolls.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2c3217bc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('7316d4f0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('ce06200d', 'id'))}">\`
elements+=\`January\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('021d0854', 'id'))}">\`
elements+=\`February\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('e3448d00', 'id'))}">\`
elements+=\`March\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('09c4e61f', 'id'))}">\`
elements+=\`April\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('5ff61abb', 'id'))}">\`
elements+=\`May\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('86672ed4', 'id'))}">\`
elements+=\`June\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('5463d886', 'id'))}">\`
elements+=\`July\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('81225c0d', 'id'))}">\`
elements+=\`August\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('df5d2f07', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="apr" show-arrows="" center-active="" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('025e9911', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="jan" id="\${ty_escapeAttr(ty_generateId('d73281b9', 'id'))}">\`
elements+=\`January\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="feb" id="\${ty_escapeAttr(ty_generateId('81e664fd', 'id'))}">\`
elements+=\`February\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="mar" id="\${ty_escapeAttr(ty_generateId('a78e3f79', 'id'))}">\`
elements+=\`March\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="apr" id="\${ty_escapeAttr(ty_generateId('10b9d796', 'id'))}">\`
elements+=\`April\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="may" id="\${ty_escapeAttr(ty_generateId('44c1f923', 'id'))}">\`
elements+=\`May\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jun" id="\${ty_escapeAttr(ty_generateId('8b401717', 'id'))}">\`
elements+=\`June\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jul" id="\${ty_escapeAttr(ty_generateId('4452b87c', 'id'))}">\`
elements+=\`July\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="aug" id="\${ty_escapeAttr(ty_generateId('767df81b', 'id'))}">\`
elements+=\`August\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('92a2ad14', 'id'))}">\`
elements+=\`Link tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('99a0bd42', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01b4d29c', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7af82b29', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\` to render a real anchor that participates in navigation. With CSS classes, use an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3636c7d6', 'id'))}">\`
elements+=\`&lt;a class="w-tab"&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('772f6977', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('bb25b6a9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-tab active" href="#docs" id="\${ty_escapeAttr(ty_generateId('57cd8592', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#api" id="\${ty_escapeAttr(ty_generateId('c914f98e', 'id'))}">\`
elements+=\`API\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#guides" id="\${ty_escapeAttr(ty_generateId('77a98832', 'id'))}">\`
elements+=\`Guides\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('88f04525', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="docs" id="\${ty_escapeAttr(ty_generateId('bb7345d5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="docs" href="#docs" id="\${ty_escapeAttr(ty_generateId('900a1fac', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="api" href="#api" id="\${ty_escapeAttr(ty_generateId('8814ff47', 'id'))}">\`
elements+=\`API\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="guides" href="#guides" id="\${ty_escapeAttr(ty_generateId('12f4a94e', 'id'))}">\`
elements+=\`Guides\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e4a5436c', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fee2a1e6', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d1ce66af', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3a5c30ae', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` to skip it during pointer and keyboard navigation, or to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('85322b71', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to disable the whole strip.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a275f3ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('75e3207c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('9feba0bb', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('f8c00747', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" disabled="" id="\${ty_escapeAttr(ty_generateId('5b099918', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('50a26ec1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="inbox" id="\${ty_escapeAttr(ty_generateId('c99737e2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="inbox" id="\${ty_escapeAttr(ty_generateId('88b77a05', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="drafts" id="\${ty_escapeAttr(ty_generateId('b1986092', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archive" disabled="" id="\${ty_escapeAttr(ty_generateId('5637e808', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e239d4bf', 'id'))}">\`
elements+=\`Pills\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('50bca5a9', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5784fc8', 'id'))}">\`
elements+=\`variant="pills"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('424f786e', 'id'))}">\`
elements+=\`w-tabs-pills\`
elements+=\`</code>\`
elements+=\`) for a rounded, background-highlighted style. The sliding indicator is suppressed in favor of the pill background.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('69c8eb8b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs-pills" id="\${ty_escapeAttr(ty_generateId('82a25196', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('9af46a57', 'id'))}">\`
elements+=\`All\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('7e66372c', 'id'))}">\`
elements+=\`Active\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('4aa31c30', 'id'))}">\`
elements+=\`Archived\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6861524b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="all" variant="pills" id="\${ty_escapeAttr(ty_generateId('85d852f4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="all" id="\${ty_escapeAttr(ty_generateId('81cb8801', 'id'))}">\`
elements+=\`All\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="active" id="\${ty_escapeAttr(ty_generateId('4ffc17c0', 'id'))}">\`
elements+=\`Active\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archived" id="\${ty_escapeAttr(ty_generateId('100a64b9', 'id'))}">\`
elements+=\`Archived\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9f32bcfe', 'id'))}">\`
elements+=\`Keyboard\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e6940b99', 'id'))}">\`
elements+=\`Tabs are a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad5e7102', 'id'))}">\`
elements+=\`role="tablist"\`
elements+=\`</code>\`
elements+=\`. Arrow keys move between tabs (Left/Right when horizontal, Up/Down when vertical) and skip disabled tabs, wrapping at the ends. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6489ba81', 'id'))}">\`
elements+=\`Home\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('78eea501', 'id'))}">\`
elements+=\`End\`
elements+=\`</code>\`
elements+=\` jump to the first and last tab. Every tab has a visible \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86d8b5fc', 'id'))}">\`
elements+=\`:focus-visible\`
elements+=\`</code>\`
elements+=\` ring and a 44px touch target by default.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a269d0f7', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fa8f6703', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb231e1d', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0fd90e8e', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3557bcfd', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6a4d2ce8', 'id'))}">\`
elements+=\`&lt;w-tabs-window-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8a146084', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('377bb2f3', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('117b882f', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0778230f', 'id'))}">\`
elements+=\`variant="pills"\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1481cfd', 'id'))}">\`
elements+=\`align-tabs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69f9d4e5', 'id'))}">\`
elements+=\`fixed-tabs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('971715a8', 'id'))}">\`
elements+=\`grow\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa4aade6', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('801a0847', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98de0583', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c501f13f', 'id'))}">\`
elements+=\`hide-slider\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('831df508', 'id'))}">\`
elements+=\`slider-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aea501a1', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6953b40d', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e601e30', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6834ae7e', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03e4b3c8', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14e881dd', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ec25ada', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`. Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('53e52dc8', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1286f6e', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('864de89d', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d9c46501', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('2740a487', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ae50c8e5', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f110d0c2', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c162816f', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb089408', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('370de2af', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tabs/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
