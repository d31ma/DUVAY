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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('2855f9ca', 'id'))}">\`
elements+=\`Tabs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('00a9a74a', 'id'))}">\`
elements+=\`Organize content into switchable panels. DuVay tabs support alignment, equal-width layouts, vertical orientation, stacked icons, overflow pagination, theming, and an animated selection indicator that glides between tabs.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('896028f0', 'id'))}">\`
elements+=\`The indicator is progressively enhanced: hand-authored markup shows a static underline, while the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d850e1db', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` web component renders an animated slider (and falls back to the underline when JavaScript is absent). Pair tabs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('29f9ad4b', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` for the matching content panes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c6aca520', 'id'))}">\`
elements+=\`Basic tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('36d88602', 'id'))}">\`
elements+=\`Mark the selected tab with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb402ed8', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` class, or set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de0c7803', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7ce1787', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to the active tab's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5115d386', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`. The component emits a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b49907ea', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` event carrying the new \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('476c932a', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0479466a', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\` when the selection changes.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('af9fac4c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('c76ac844', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('09444579', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('690aa7db', 'id'))}">\`
elements+=\`Security\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('2cefa791', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3232985d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="account" id="\${ty_escapeAttr(ty_generateId('b0dd12c4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('833d3dc2', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="security" id="\${ty_escapeAttr(ty_generateId('2d6d7aa9', 'id'))}">\`
elements+=\`Security\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="notifications" id="\${ty_escapeAttr(ty_generateId('d6710055', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1c5a8b37', 'id'))}">\`
elements+=\`Tabs with content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b32b9cfb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8ef9a138', 'id'))}">\`
elements+=\`&lt;w-tabs-window&gt;\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de93ab3c', 'id'))}">\`
elements+=\`&lt;w-tabs-window-item&gt;\`
elements+=\`</code>\`
elements+=\` are Vuetify-named aliases for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('52005d42', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9013f76e', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`. Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e7d7c9a', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` on the tabs and set the window's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0cf50d78', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` to the active index to keep them in sync.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('48356ff9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('f47bcab2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c42f5518', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('a39b208c', 'id'))}">\`
elements+=\`Details\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('5e2029ba', 'id'))}">\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5765d6a7', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('de04b29e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" data-window="demo-window-basic" id="\${ty_escapeAttr(ty_generateId('e8286abf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('71999c9f', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="details" id="\${ty_escapeAttr(ty_generateId('3a492b85', 'id'))}">\`
elements+=\`Details\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('86d8e1a5', 'id'))}">\`
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
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('ba91c801', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('8fcc19fe', 'id'))}">\`
elements+=\`Overview — the big picture at a glance.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('33cc55ca', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('afbb6d66', 'id'))}">\`
elements+=\`Details — every field, spelled out.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
      \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('0d27b9d6', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('a221470d', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1e2615aa', 'id'))}">\`
elements+=\`Alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1559fd64', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('82379178', 'id'))}">\`
elements+=\`align-tabs\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('483d4199', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5259d2a8', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\` · \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d1e6cec0', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`) to position the strip. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7039be8e', 'id'))}">\`
elements+=\`w-tabs--align-center\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de95ba97', 'id'))}">\`
elements+=\`w-tabs--align-end\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b66664aa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--align-center" id="\${ty_escapeAttr(ty_generateId('15968928', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('006369ee', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('476bf8e2', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('4699acc2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('85c6f647', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="overview" align-tabs="center" id="\${ty_escapeAttr(ty_generateId('dd772b1b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="overview" id="\${ty_escapeAttr(ty_generateId('c478be7e', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="activity" id="\${ty_escapeAttr(ty_generateId('de43e310', 'id'))}">\`
elements+=\`Activity\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="settings" id="\${ty_escapeAttr(ty_generateId('5eef2628', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eb21bb01', 'id'))}">\`
elements+=\`Fixed and grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('758fcb57', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('76f32a05', 'id'))}">\`
elements+=\`fixed-tabs\`
elements+=\`</code>\`
elements+=\` gives every tab an equal share of the width, capped at \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1da48a81', 'id'))}">\`
elements+=\`--w-tab-max-width\`
elements+=\`</code>\`
elements+=\` (18rem) and centered. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0f7b397', 'id'))}">\`
elements+=\`grow\`
elements+=\`</code>\`
elements+=\` spreads the tabs to fill the whole strip with no cap.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('99377494', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--grow" id="\${ty_escapeAttr(ty_generateId('30b6d403', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('fc11873f', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('1e8c17d2', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('af402dc1', 'id'))}">\`
elements+=\`Month\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('778a1f77', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2c07c6d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="week" grow="" id="\${ty_escapeAttr(ty_generateId('72397189', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="day" id="\${ty_escapeAttr(ty_generateId('bdc175c4', 'id'))}">\`
elements+=\`Day\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="week" id="\${ty_escapeAttr(ty_generateId('9bde6577', 'id'))}">\`
elements+=\`Week\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="month" id="\${ty_escapeAttr(ty_generateId('5f767ee2', 'id'))}">\`
elements+=\`Month\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="year" id="\${ty_escapeAttr(ty_generateId('5e315fea', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cdd13ca3', 'id'))}">\`
elements+=\`Stacked\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9e4acc62', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1c2b8a2', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` to place an icon above the label. Slot an icon element followed by the text.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e6b60b4c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--stacked" id="\${ty_escapeAttr(ty_generateId('3f35ca3f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c6e841b1', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('ad1814c9', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('10f5c7b6', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('5c6e2b9d', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('da72a616', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('3d1bb438', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('de56d467', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="recent" stacked="" id="\${ty_escapeAttr(ty_generateId('3607beb1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="recent" id="\${ty_escapeAttr(ty_generateId('241a9336', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('2332faae', 'id'))}">\`
elements+=\`\uD83D\uDD51\`
elements+=\`</span>\`
elements+=\`Recent\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="favorites" id="\${ty_escapeAttr(ty_generateId('920026e3', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('24441482', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`Favorites\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="nearby" id="\${ty_escapeAttr(ty_generateId('af630eb8', 'id'))}">\`
elements+=\`<span class="w-text-2xl" id="\${ty_escapeAttr(ty_generateId('d77d922c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9d2f6a8e', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9854b142', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('79399282', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f572dcdc', 'id'))}">\`
elements+=\`w-tabs--vertical\`
elements+=\`</code>\`
elements+=\`) for a side rail with an inline-start indicator. It pairs naturally with a content window.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1184cc18', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('a04c7545', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-tabs w-tabs--vertical" id="\${ty_escapeAttr(ty_generateId('f442075e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c9ae745e', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('93a38f48', 'id'))}">\`
elements+=\`Account\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('fe02952f', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-tab-panel" id="\${ty_escapeAttr(ty_generateId('8e7f322b', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('30a7236a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d584b15d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4" id="\${ty_escapeAttr(ty_generateId('287ca1d5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tabs value="profile" direction="vertical" data-window="demo-window-vertical" id="\${ty_escapeAttr(ty_generateId('e65ef44b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-tab value="profile" id="\${ty_escapeAttr(ty_generateId('923283b5', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="account" id="\${ty_escapeAttr(ty_generateId('38d44309', 'id'))}">\`
elements+=\`Account\`
elements+=\`</w-tab>\`
elements+=\`
        \`
elements+=\`<w-tab value="billing" id="\${ty_escapeAttr(ty_generateId('975bb05a', 'id'))}">\`
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
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('3f7cfc6c', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('b82cacee', 'id'))}">\`
elements+=\`Profile — your name and avatar.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('a4ed6a2a', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('a72ead75', 'id'))}">\`
elements+=\`Account — email and password.\`
elements+=\`</div>\`
elements+=\`</w-tabs-window-item>\`
elements+=\`
        \`
elements+=\`<w-tabs-window-item id="\${ty_escapeAttr(ty_generateId('ed66a49a', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('8b881475', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fc5b7a1c', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2e30b2c3', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('524a18bc', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1cdebd36', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ebd05b35', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`) to tighten the tab height. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60a3c2f3', 'id'))}">\`
elements+=\`w-tabs--comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87b37d6a', 'id'))}">\`
elements+=\`w-tabs--compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('823eb501', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--compact" id="\${ty_escapeAttr(ty_generateId('21c78766', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('21ae8e5a', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('1f6aaef7', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('34db4187', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="compact" density="compact" id="\${ty_escapeAttr(ty_generateId('cca315c7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="compact" id="\${ty_escapeAttr(ty_generateId('f9af0177', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="strip" id="\${ty_escapeAttr(ty_generateId('6a79c1ed', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6b3978e8', 'id'))}">\`
elements+=\`Color and slider color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('019e5f0c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdbef620', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the active tab's text and the default indicator color; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4526340d', 'id'))}">\`
elements+=\`slider-color\`
elements+=\`</code>\`
elements+=\` overrides just the indicator; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a51c00c', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\` tints the strip. Values are DuVay palette tokens (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cd3efa3', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4225b3e4', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd5520ba', 'id'))}">\`
elements+=\`tertiary\`
elements+=\`</code>\`
elements+=\`). With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b50451a', 'id'))}">\`
elements+=\`--w-tabs-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1544fd3', 'id'))}">\`
elements+=\`--w-tabs-slider-color\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9fcd1c3c', 'id'))}">\`
elements+=\`--w-tabs-bg\`
elements+=\`</code>\`
elements+=\` custom properties.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('683768a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="--w-tabs-color: var(--w-success); --w-tabs-slider-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('74b2b00c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c70d1b0d', 'id'))}">\`
elements+=\`Build\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('8b01a261', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('9bca20e0', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-mt-2" style="--w-tabs-bg: var(--w-surface-container-high); --w-tabs-slider-color: var(--w-tertiary)" id="\${ty_escapeAttr(ty_generateId('0077e361', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('6f0078ac', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('b927db87', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1f531e4b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="build" color="success" slider-color="success" id="\${ty_escapeAttr(ty_generateId('6769d960', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="build" id="\${ty_escapeAttr(ty_generateId('3eb4d5af', 'id'))}">\`
elements+=\`Build\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="deploy" id="\${ty_escapeAttr(ty_generateId('0bb72416', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="monitor" id="\${ty_escapeAttr(ty_generateId('99a34468', 'id'))}">\`
elements+=\`Monitor\`
elements+=\`</w-tab>\`
elements+=\`
    \`
elements+=\`</w-tabs>\`
elements+=\`
    \`
elements+=\`<w-tabs value="alpha" bg-color="surface-container-high" slider-color="tertiary" class="w-mt-2" id="\${ty_escapeAttr(ty_generateId('1de4988c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="alpha" id="\${ty_escapeAttr(ty_generateId('6d1f58f7', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="beta" id="\${ty_escapeAttr(ty_generateId('6c5bd313', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0adf291e', 'id'))}">\`
elements+=\`Hide slider\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2a6caf7a', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('55462de9', 'id'))}">\`
elements+=\`hide-slider\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f37e26a', 'id'))}">\`
elements+=\`w-tabs--no-slider\`
elements+=\`</code>\`
elements+=\`) to remove the indicator entirely — the active tab is shown by color alone.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9a74f10a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs--no-slider" id="\${ty_escapeAttr(ty_generateId('fd99206d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('7ccf04f6', 'id'))}">\`
elements+=\`No\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('6ee09a8f', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6418865d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="no" hide-slider="" id="\${ty_escapeAttr(ty_generateId('addea576', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="no" id="\${ty_escapeAttr(ty_generateId('eb2caad8', 'id'))}">\`
elements+=\`No\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="indicator" id="\${ty_escapeAttr(ty_generateId('821abbc5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4d098e0a', 'id'))}">\`
elements+=\`Overflow arrows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fd3344e0', 'id'))}">\`
elements+=\`When a strip is too narrow for its tabs it scrolls. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2517cf53', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` to the web component for pagination buttons (customizable with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc7fc5f6', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf1a4c08', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`), and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c62e3791', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` to keep the selected tab scrolled to center. Arrows are a web-component enhancement; with plain CSS the strip simply scrolls.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d48254e1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('7bfc253f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('bb292cec', 'id'))}">\`
elements+=\`January\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('23aa6d87', 'id'))}">\`
elements+=\`February\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('58a1c4e7', 'id'))}">\`
elements+=\`March\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('6faa1512', 'id'))}">\`
elements+=\`April\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('50aa02ed', 'id'))}">\`
elements+=\`May\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('32985585', 'id'))}">\`
elements+=\`June\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('d5fdd27b', 'id'))}">\`
elements+=\`July\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('a917139a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bd1fd0fa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="apr" show-arrows="" center-active="" style="max-width: 22rem" id="\${ty_escapeAttr(ty_generateId('d0776bfe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="jan" id="\${ty_escapeAttr(ty_generateId('1551d418', 'id'))}">\`
elements+=\`January\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="feb" id="\${ty_escapeAttr(ty_generateId('7ef1e473', 'id'))}">\`
elements+=\`February\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="mar" id="\${ty_escapeAttr(ty_generateId('e86aa30e', 'id'))}">\`
elements+=\`March\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="apr" id="\${ty_escapeAttr(ty_generateId('9689c023', 'id'))}">\`
elements+=\`April\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="may" id="\${ty_escapeAttr(ty_generateId('e9e73801', 'id'))}">\`
elements+=\`May\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jun" id="\${ty_escapeAttr(ty_generateId('9fcf351d', 'id'))}">\`
elements+=\`June\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="jul" id="\${ty_escapeAttr(ty_generateId('af7aa3df', 'id'))}">\`
elements+=\`July\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="aug" id="\${ty_escapeAttr(ty_generateId('51495fef', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ada4c417', 'id'))}">\`
elements+=\`Link tabs\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2a5aeb79', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d880f4f7', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7aefa817', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\` to render a real anchor that participates in navigation. With CSS classes, use an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd542492', 'id'))}">\`
elements+=\`&lt;a class="w-tab"&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ee769d8a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('58a13a14', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-tab active" href="#docs" id="\${ty_escapeAttr(ty_generateId('96966453', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#api" id="\${ty_escapeAttr(ty_generateId('f360d954', 'id'))}">\`
elements+=\`API\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-tab" href="#guides" id="\${ty_escapeAttr(ty_generateId('b13126f1', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('56d0b7bf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="docs" id="\${ty_escapeAttr(ty_generateId('11863460', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="docs" href="#docs" id="\${ty_escapeAttr(ty_generateId('e3b422f2', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="api" href="#api" id="\${ty_escapeAttr(ty_generateId('0cb0b3f6', 'id'))}">\`
elements+=\`API\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="guides" href="#guides" id="\${ty_escapeAttr(ty_generateId('971b98e1', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('865212d9', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7e039a5c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc4e2d87', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d53c659', 'id'))}">\`
elements+=\`&lt;w-tab&gt;\`
elements+=\`</code>\`
elements+=\` to skip it during pointer and keyboard navigation, or to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1429467b', 'id'))}">\`
elements+=\`&lt;w-tabs&gt;\`
elements+=\`</code>\`
elements+=\` to disable the whole strip.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4636ff90', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs" id="\${ty_escapeAttr(ty_generateId('c84ebd89', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('dfeac8a9', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('2d7e235d', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" disabled="" id="\${ty_escapeAttr(ty_generateId('9957f00a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('33c9eab2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="inbox" id="\${ty_escapeAttr(ty_generateId('9c639829', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="inbox" id="\${ty_escapeAttr(ty_generateId('8891e332', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="drafts" id="\${ty_escapeAttr(ty_generateId('9ff9ec86', 'id'))}">\`
elements+=\`Drafts\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archive" disabled="" id="\${ty_escapeAttr(ty_generateId('7377d415', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('36abac07', 'id'))}">\`
elements+=\`Pills\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c18270e9', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0d11551b', 'id'))}">\`
elements+=\`variant="pills"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77dec50a', 'id'))}">\`
elements+=\`w-tabs-pills\`
elements+=\`</code>\`
elements+=\`) for a rounded, background-highlighted style. The sliding indicator is suppressed in favor of the pill background.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('34cff0c7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-tabs w-tabs-pills" id="\${ty_escapeAttr(ty_generateId('6718276b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-tab active" id="\${ty_escapeAttr(ty_generateId('c97d4859', 'id'))}">\`
elements+=\`All\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('1cad6542', 'id'))}">\`
elements+=\`Active\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-tab" id="\${ty_escapeAttr(ty_generateId('6b5cd7f1', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fe20be3c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-tabs value="all" variant="pills" id="\${ty_escapeAttr(ty_generateId('abcbb4fb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tab value="all" id="\${ty_escapeAttr(ty_generateId('40dc87af', 'id'))}">\`
elements+=\`All\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="active" id="\${ty_escapeAttr(ty_generateId('5c720e68', 'id'))}">\`
elements+=\`Active\`
elements+=\`</w-tab>\`
elements+=\`
      \`
elements+=\`<w-tab value="archived" id="\${ty_escapeAttr(ty_generateId('085fa44f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('de86decc', 'id'))}">\`
elements+=\`Keyboard\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8272f2a7', 'id'))}">\`
elements+=\`Tabs are a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3db91b7d', 'id'))}">\`
elements+=\`role="tablist"\`
elements+=\`</code>\`
elements+=\`. Arrow keys move between tabs (Left/Right when horizontal, Up/Down when vertical) and skip disabled tabs, wrapping at the ends. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ab3d842', 'id'))}">\`
elements+=\`Home\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59d05dc2', 'id'))}">\`
elements+=\`End\`
elements+=\`</code>\`
elements+=\` jump to the first and last tab. Every tab has a visible \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9fc4cffc', 'id'))}">\`
elements+=\`:focus-visible\`
elements+=\`</code>\`
elements+=\` ring and a 44px touch target by default.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tabs/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
