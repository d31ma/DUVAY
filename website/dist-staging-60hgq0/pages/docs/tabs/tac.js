var __defProp=Object.defineProperty;var __returnValue=(v)=>v;function __exportSetter(name,newValue){this[name]=__returnValue.bind(null,newValue)}var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0,configurable:!0,set:__exportSetter.bind(all,name)})};var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var exports_tac={};__export(exports_tac,{default:()=>tac_default});class Tac{props;tac;constructor(props={},tac=__ty_noopHelpers__){this.props=props,this.tac=tac}}var __ty_noopHelpers__,tac_default;var init_tac=__esm(()=>{__ty_noopHelpers__={isBrowser:!1,isServer:!0,bindPersistentFields:()=>{},env:(_,f)=>f,props:{},emit:()=>!1,fetch:(i,n)=>fetch(i,n),inject:(_,f)=>f,onMount:()=>{},provide:()=>{},rerender:()=>{}};tac_default=class tac_default extends Tac{onMount(){document.title="Tabs — DuVay Documentation",document.addEventListener("w-change",function(event){let tabs=event.target.closest&&event.target.closest("w-tabs[data-window]");if(!tabs)return;let win=document.getElementById(tabs.getAttribute("data-window"));if(!win)return;let index=Array.from(tabs.querySelectorAll("w-tab")).map(function(tab){return tab.getAttribute("value")}).indexOf(event.detail.value);if(index>=0)win.value=index})}}});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('d1b0deeb', 'id'))}">\`
elements+=\`Tabs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e79828f2', 'id'))}">\`
elements+=\`Organize content into switchable panels. DuVay tabs support alignment, equal-width layouts, vertical orientation, stacked icons, overflow pagination, theming, and an animated selection indicator that glides between tabs.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('31b03c51', 'id'))}">\`
elements+=\`The indicator is progressively enhanced: hand-authored markup shows a static underline, while the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27a8cfb3', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` web component renders an animated slider (and falls back to the underline when JavaScript is absent). Pair tabs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40efbb75', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` for the matching content panes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bc185d06', 'id'))}">\`
elements+=\`Basic tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a15f5116', 'id'))}">\`
elements+=\`Mark the selected tab with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0b06e9a', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` class, or set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b4b6aa7b', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ec34044', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to the active tab's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('230225a7', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`. The component emits a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b3507661', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` event carrying the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38992236', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('75ad6636', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\` when the selection changes.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fd8c7acd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('14395867', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('2c107a67', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('ad959f21', 'id'))}">\`
elements+=\`Security\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('5945bbc0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('123bc35f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="account" id="\${ty_escapeAttr(ty_generateId('185a22d1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('f7855055', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="security" id="\${ty_escapeAttr(ty_generateId('7873baca', 'id'))}">\`
elements+=\`Security\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="notifications" id="\${ty_escapeAttr(ty_generateId('14b48413', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('95d2b487', 'id'))}">\`
elements+=\`Tabs with content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cac749fa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('edc1ea33', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('855c5204', 'id'))}">\`
elements+=\`&lt;w-tabs-window-item&gt;\`
elements+=\`</code>\`
elements+=\` are Vuetify-named aliases for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8715425e', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('710966e9', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`. Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd31b5de', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` on the tabs and set the window's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dab83d11', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` to the active index to keep them in sync.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('88a87707', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('6f7783a4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('765f227a', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d6cea332', 'id'))}">\`
elements+=\`Details\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('0d0f68a5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9b6563ef', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('76cabc21', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" data-window="demo-window-basic" id="\${ty_escapeAttr(ty_generateId('5731e628', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('712d7437', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="details" id="\${ty_escapeAttr(ty_generateId('f9573a8a', 'id'))}">\`
elements+=\`Details\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('d42cec33', 'id'))}">\`
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
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('559d138b', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('9ee13e7a', 'id'))}">\`
elements+=\`Overview — the big picture at a glance.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('7de1e454', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('580e4c48', 'id'))}">\`
elements+=\`Details — every field, spelled out.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('978e6f2e', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('326a254d', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('019a2adb', 'id'))}">\`
elements+=\`Alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3baff6a8', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8486d3c', 'id'))}">\`
elements+=\`align-tabs\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f954143a', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c69a3559', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('388e078d', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`) to position the strip. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2e7b4154', 'id'))}">\`
elements+=\`w-tabs--align-center\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64a3858a', 'id'))}">\`
elements+=\`w-tabs--align-end\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('18444415', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--align-center" id="\${ty_escapeAttr(ty_generateId('a83b1d14', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('9b131334', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('cc2499db', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('4d889b89', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a57440ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" align-tabs="center" id="\${ty_escapeAttr(ty_generateId('9309eeb7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('877172ef', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('79780c47', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="settings" id="\${ty_escapeAttr(ty_generateId('bb822fa6', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ff126e31', 'id'))}">\`
elements+=\`Fixed and grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b4eaaab5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('192b90f6', 'id'))}">\`
elements+=\`fixed-tabs\`
elements+=\`</code>\`
elements+=\` gives every tab an equal share of the width, capped at \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2be82564', 'id'))}">\`
elements+=\`--w-tab-max-width\`
elements+=\`</code>\`
elements+=\` (18rem) and centered. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11112242', 'id'))}">\`
elements+=\`grow\`
elements+=\`</code>\`
elements+=\` spreads the tabs to fill the whole strip with no cap.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a410db43', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--grow" id="\${ty_escapeAttr(ty_generateId('ca039741', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('e83394b6', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('c41612cd', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('c7fdf28c', 'id'))}">\`
elements+=\`Month\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('72a1474b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('299c6880', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="week" grow="" id="\${ty_escapeAttr(ty_generateId('392d5a97', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="day" id="\${ty_escapeAttr(ty_generateId('d47b9e80', 'id'))}">\`
elements+=\`Day\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="week" id="\${ty_escapeAttr(ty_generateId('c07fbc5f', 'id'))}">\`
elements+=\`Week\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="month" id="\${ty_escapeAttr(ty_generateId('8bac7278', 'id'))}">\`
elements+=\`Month\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="year" id="\${ty_escapeAttr(ty_generateId('c2488fbd', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f5011f7a', 'id'))}">\`
elements+=\`Stacked\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d29b48ac', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2635924d', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` to place an icon above the label. Slot an icon element followed by the text.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3bc944ec', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--stacked" id="\${ty_escapeAttr(ty_generateId('77f1caaf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('a072a838', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('61e25270', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('a1c1f1da', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('10640e0d', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('8fae47ff', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('dee4a707', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('209cdd12', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="recent" stacked="" id="\${ty_escapeAttr(ty_generateId('c1811694', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="recent" id="\${ty_escapeAttr(ty_generateId('fe96a759', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('54093294', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="favorites" id="\${ty_escapeAttr(ty_generateId('7b2ccf53', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('01bf6ab2', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="nearby" id="\${ty_escapeAttr(ty_generateId('b471d4c6', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('40889a43', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f90c5ddc', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5efec6e6', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dac1c1df', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f70f8c46', 'id'))}">\`
elements+=\`w-tabs--vertical\`
elements+=\`</code>\`
elements+=\`) for a side rail with an inline-start indicator. It pairs naturally with a content window.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c4ca7f38', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('a3b91b1a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-tabs w-tabs--vertical" id="\${ty_escapeAttr(ty_generateId('77d7053c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('e25ba8a0', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('eaac6c5f', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('0d0c475f', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('2bd5554b', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4d17af6b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e64eb279', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('200ecbaf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tabs value="profile" direction="vertical" data-window="demo-window-vertical" id="\${ty_escapeAttr(ty_generateId('0deb52a1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-tab value="profile" id="\${ty_escapeAttr(ty_generateId('da22327d', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('904480bb', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="billing" id="\${ty_escapeAttr(ty_generateId('4a2206e3', 'id'))}">\`
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
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('c810b7de', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('ef171023', 'id'))}">\`
elements+=\`Profile — your name and avatar.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('71667c8f', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('83fbc688', 'id'))}">\`
elements+=\`Account — email and password.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('55c9fc2e', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('02995e13', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('97e71c30', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3bc58b79', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f3bbafc', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f62a09bf', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('70f04636', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`) to tighten the tab height. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('628cc2c0', 'id'))}">\`
elements+=\`w-tabs--comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('79ffbdd9', 'id'))}">\`
elements+=\`w-tabs--compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8820762a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--compact" id="\${ty_escapeAttr(ty_generateId('aed5f9ed', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('44ecccb3', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('aedc5242', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a82bc0d3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="compact" density="compact" id="\${ty_escapeAttr(ty_generateId('2aad4c17', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="compact" id="\${ty_escapeAttr(ty_generateId('fe189421', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="strip" id="\${ty_escapeAttr(ty_generateId('580c5acf', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b6348f88', 'id'))}">\`
elements+=\`Color and slider color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8b07bd9f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7116485d', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the active tab's text and the default indicator color; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3318e988', 'id'))}">\`
elements+=\`slider-color\`
elements+=\`</code>\`
elements+=\` overrides just the indicator; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('900fe026', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\` tints the strip. Values are DuVay palette tokens (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4bbeb1d', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a3d643d', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e504150b', 'id'))}">\`
elements+=\`tertiary\`
elements+=\`</code>\`
elements+=\`). With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('347232e8', 'id'))}">\`
elements+=\`--w-tabs-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27d52a44', 'id'))}">\`
elements+=\`--w-tabs-slider-color\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5e1846f', 'id'))}">\`
elements+=\`--w-tabs-bg\`
elements+=\`</code>\`
elements+=\` custom properties.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0f476d5f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="--w-tabs-color: var(--w-success); --w-tabs-slider-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('42d3bac5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('04aa524f', 'id'))}">\`
elements+=\`Build\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('ee460c1c', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('8c273122', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-mt-2" style="--w-tabs-bg: var(--w-surface-container-high); --w-tabs-slider-color: var(--w-tertiary)" id="\${ty_escapeAttr(ty_generateId('85286a06', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('57d46d35', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('de0d46e3', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8750ea95', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="build" color="success" slider-color="success" id="\${ty_escapeAttr(ty_generateId('afd1afa1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="build" id="\${ty_escapeAttr(ty_generateId('de9b60ad', 'id'))}">\`
elements+=\`Build\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="deploy" id="\${ty_escapeAttr(ty_generateId('66b9e4d2', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="monitor" id="\${ty_escapeAttr(ty_generateId('3c6a08bf', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
    \`
elements+=\`<w-tabs value="alpha" bg-color="surface-container-high" slider-color="tertiary" class="w-mt-2" id="\${ty_escapeAttr(ty_generateId('037c1f6e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="alpha" id="\${ty_escapeAttr(ty_generateId('8355cb48', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="beta" id="\${ty_escapeAttr(ty_generateId('32e3680e', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f442175', 'id'))}">\`
elements+=\`Hide slider\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('17d01ba1', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59333ea3', 'id'))}">\`
elements+=\`hide-slider\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('07aec262', 'id'))}">\`
elements+=\`w-tabs--no-slider\`
elements+=\`</code>\`
elements+=\`) to remove the indicator entirely — the active tab is shown by color alone.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('75f3dd30', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--no-slider" id="\${ty_escapeAttr(ty_generateId('463d53e9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('dece4de3', 'id'))}">\`
elements+=\`No\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('fe033d38', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9425dda2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="no" hide-slider="" id="\${ty_escapeAttr(ty_generateId('7d91b975', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="no" id="\${ty_escapeAttr(ty_generateId('25364817', 'id'))}">\`
elements+=\`No\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="indicator" id="\${ty_escapeAttr(ty_generateId('e1c87bdc', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('61c67fc0', 'id'))}">\`
elements+=\`Overflow arrows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e46b6d7c', 'id'))}">\`
elements+=\`When a strip is too narrow for its tabs it scrolls. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c05a05b', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` to the web component for pagination buttons (customizable with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4664c355', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b08d8cb', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`), and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d1931303', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` to keep the selected tab scrolled to center. Arrows are a web-component enhancement; with plain CSS the strip simply scrolls.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('181bc1e8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('3c70db97', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('93df93fa', 'id'))}">\`
elements+=\`January\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('908cc6df', 'id'))}">\`
elements+=\`February\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('ebade3c0', 'id'))}">\`
elements+=\`March\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('250995bd', 'id'))}">\`
elements+=\`April\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('eeddb174', 'id'))}">\`
elements+=\`May\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('8e290fec', 'id'))}">\`
elements+=\`June\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('04876b4e', 'id'))}">\`
elements+=\`July\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('65d5825b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5eccac63', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="apr" show-arrows="" center-active="" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('6ab3ddac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="jan" id="\${ty_escapeAttr(ty_generateId('79058941', 'id'))}">\`
elements+=\`January\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="feb" id="\${ty_escapeAttr(ty_generateId('4f056133', 'id'))}">\`
elements+=\`February\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="mar" id="\${ty_escapeAttr(ty_generateId('2a022628', 'id'))}">\`
elements+=\`March\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="apr" id="\${ty_escapeAttr(ty_generateId('2be69a95', 'id'))}">\`
elements+=\`April\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="may" id="\${ty_escapeAttr(ty_generateId('53e49a9b', 'id'))}">\`
elements+=\`May\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jun" id="\${ty_escapeAttr(ty_generateId('8c19fbd2', 'id'))}">\`
elements+=\`June\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jul" id="\${ty_escapeAttr(ty_generateId('26c51af3', 'id'))}">\`
elements+=\`July\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="aug" id="\${ty_escapeAttr(ty_generateId('732818bc', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('33b339c6', 'id'))}">\`
elements+=\`Link tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f64669e6', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7aee6f8f', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('310cc8bc', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\` to render a real anchor that participates in navigation. With CSS classes, use an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d269251', 'id'))}">\`
elements+=\`&lt;a class="w-tab"&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f08251d6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('4ff8d7c3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-tab active" href="#docs" id="\${ty_escapeAttr(ty_generateId('4274ce94', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#api" id="\${ty_escapeAttr(ty_generateId('44b01ea4', 'id'))}">\`
elements+=\`API\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#guides" id="\${ty_escapeAttr(ty_generateId('58776a65', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('94dc15c8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="docs" id="\${ty_escapeAttr(ty_generateId('fb459c96', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="docs" href="#docs" id="\${ty_escapeAttr(ty_generateId('137c869c', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="api" href="#api" id="\${ty_escapeAttr(ty_generateId('fb725d97', 'id'))}">\`
elements+=\`API\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="guides" href="#guides" id="\${ty_escapeAttr(ty_generateId('e5d6b894', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('761c2eb1', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6b6af26c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0399315', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2e5c209', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` to skip it during pointer and keyboard navigation, or to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77ab6bf6', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to disable the whole strip.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c7bf8967', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('0680b605', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('2b9f3cb8', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('183e641e', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" disabled="" id="\${ty_escapeAttr(ty_generateId('f683f5a1', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5cda5f9c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="inbox" id="\${ty_escapeAttr(ty_generateId('93c4af19', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="inbox" id="\${ty_escapeAttr(ty_generateId('15b8f8b6', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="drafts" id="\${ty_escapeAttr(ty_generateId('4a75ed1f', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archive" disabled="" id="\${ty_escapeAttr(ty_generateId('c425e2a4', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1d23465f', 'id'))}">\`
elements+=\`Pills\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fac7c5ec', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9e5d460', 'id'))}">\`
elements+=\`variant="pills"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23b7d2ef', 'id'))}">\`
elements+=\`w-tabs-pills\`
elements+=\`</code>\`
elements+=\`) for a rounded, background-highlighted style. The sliding indicator is suppressed in favor of the pill background.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2fc58a6d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs-pills" id="\${ty_escapeAttr(ty_generateId('55921254', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('245bf386', 'id'))}">\`
elements+=\`All\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('6d4918b9', 'id'))}">\`
elements+=\`Active\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d885cd59', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('69dabd06', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="all" variant="pills" id="\${ty_escapeAttr(ty_generateId('a02350aa', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="all" id="\${ty_escapeAttr(ty_generateId('4895d141', 'id'))}">\`
elements+=\`All\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="active" id="\${ty_escapeAttr(ty_generateId('05eaa4a7', 'id'))}">\`
elements+=\`Active\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archived" id="\${ty_escapeAttr(ty_generateId('c865919b', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3b5dc58d', 'id'))}">\`
elements+=\`Keyboard\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6ae98f67', 'id'))}">\`
elements+=\`Tabs are a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa1a6183', 'id'))}">\`
elements+=\`role="tablist"\`
elements+=\`</code>\`
elements+=\`. Arrow keys move between tabs (Left/Right when horizontal, Up/Down when vertical) and skip disabled tabs, wrapping at the ends. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('106f7abf', 'id'))}">\`
elements+=\`Home\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('41854531', 'id'))}">\`
elements+=\`End\`
elements+=\`</code>\`
elements+=\` jump to the first and last tab. Every tab has a visible \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2cb218c5', 'id'))}">\`
elements+=\`:focus-visible\`
elements+=\`</code>\`
elements+=\` ring and a 44px touch target by default.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2f04c2ce', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('577a773c', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e6ca6c3', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8bee1830', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef271b38', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('034ab42c', 'id'))}">\`
elements+=\`&lt;w-tabs-window-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4588e0fd', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('b1e40121', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8152b73', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a88b2af', 'id'))}">\`
elements+=\`variant="pills"\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb512698', 'id'))}">\`
elements+=\`align-tabs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2917ab32', 'id'))}">\`
elements+=\`fixed-tabs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9352e090', 'id'))}">\`
elements+=\`grow\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cbcf58aa', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c8f3a50', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('658d2d46', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce342579', 'id'))}">\`
elements+=\`hide-slider\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86137a51', 'id'))}">\`
elements+=\`slider-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0659d209', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6166b739', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8814f915', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('759e7db8', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f7a1069e', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db3ffd18', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b18a4f3', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`. Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c47cfa45', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` with the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ab4f7e3c', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('71470083', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6a9dff6d', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('a9d06615', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('357b8c11', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f3afaa0', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('acb33a1b', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d948a82', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d66fe5ad', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tabs/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
