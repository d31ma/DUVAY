var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
const __ty_props__ = __ty_helpers__.decodeProps(props);

const __ty_companion__ = null;
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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('189eedd0', 'id'))}">\`
elements+=\`Custom inputs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a37a6d74', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8baec5d2', 'id'))}">\`
elements+=\`w-field\`
elements+=\`</code>\`
elements+=\` class and the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0fd3a515', 'id'))}">\`
elements+=\`w-input-group\`
elements+=\`</code>\`
elements+=\` component are the foundation every DuVay form control is built on. They provide the label, hint, validation messages, prefix/suffix add-ons, and inline actions that wrap a raw \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dca941e7', 'id'))}">\`
elements+=\`w-input\`
elements+=\`</code>\`
elements+=\` &#8212; use them directly to compose a control that isn&#8217;t covered by a dedicated component.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('55b47e4b', 'id'))}">\`
elements+=\`Field anatomy\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c24c7987', 'id'))}">\`
elements+=\`A field is a label, a control, and an optional hint. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95a0a0c2', 'id'))}">\`
elements+=\`w-field-error\`
elements+=\`</code>\`
elements+=\` for the error state.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f0500dc6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('976ce7b4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-field" id="\${ty_escapeAttr(ty_generateId('ba70fe94', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field-label" for="demo-anatomy" id="\${ty_escapeAttr(ty_generateId('c0d9efa5', 'id'))}">\`
elements+=\`Display name\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<input class="w-input" id="demo-anatomy" value="duvay.css" />\`
elements+=\`
        \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('72b0dd4c', 'id'))}">\`
elements+=\`Shown on your public profile.\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-field w-field-error" id="\${ty_escapeAttr(ty_generateId('306364fc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-field-label" id="\${ty_escapeAttr(ty_generateId('f91a18c0', 'id'))}">\`
elements+=\`Email\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<input class="w-input" value="bad-email" id="\${ty_escapeAttr(ty_generateId('561a4a0d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('5449e2bb', 'id'))}">\`
elements+=\`Invalid email format.\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b46b0e5b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('df262608', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-input label="Display name" value="duvay.css" hint="Shown on your public profile." id="\${ty_escapeAttr(ty_generateId('a3354d75', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
      \`
elements+=\`<w-input label="Email" value="bad-email" error="Invalid email format." id="\${ty_escapeAttr(ty_generateId('7ddda677', 'id'))}">\`
elements+=\`</w-input>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ed654f4c', 'id'))}">\`
elements+=\`Add-ons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3f61b26d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66033ed0', 'id'))}">\`
elements+=\`w-input-group\`
elements+=\`</code>\`
elements+=\` places prefixes, suffixes, and inline actions alongside the control with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5a18ef5', 'id'))}">\`
elements+=\`w-input-group-addon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('187181f7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('b12a4263', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-field-label" id="\${ty_escapeAttr(ty_generateId('9f0610eb', 'id'))}">\`
elements+=\`Website\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-input-group" id="\${ty_escapeAttr(ty_generateId('f34de69b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-input-group-addon" id="\${ty_escapeAttr(ty_generateId('57abc981', 'id'))}">\`
elements+=\`https://\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-input" value="duvay.css" id="\${ty_escapeAttr(ty_generateId('d460bd66', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('c5c4b72b', 'id'))}">\`
elements+=\`Copy\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('bd0fd0ba', 'id'))}">\`
elements+=\`Use add-ons for prefixes, suffixes, and inline actions.\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('233452c0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-input-group label="Website" hint="Use add-ons for prefixes, suffixes, and inline actions." id="\${ty_escapeAttr(ty_generateId('2faffc42', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-input-group-addon" id="\${ty_escapeAttr(ty_generateId('37104576', 'id'))}">\`
elements+=\`https://\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<input class="w-input" value="duvay.css" id="\${ty_escapeAttr(ty_generateId('a00a3133', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-text" type="button" id="\${ty_escapeAttr(ty_generateId('715851bc', 'id'))}">\`
elements+=\`Copy\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-input-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e9803722', 'id'))}">\`
elements+=\`Form input components\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('79a05db1', 'id'))}">\`
elements+=\`For common controls, reach for the dedicated components rather than composing a field by hand.\`
elements+=\`</p>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('cd7770a4', 'id'))}">\`
elements+=\`
  \`
elements+=\`<div class="w-table-grid w-table-grid--dense" id="\${ty_escapeAttr(ty_generateId('477235af', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('dfc6ce71', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('4f8a6c46', 'id'))}">\`
elements+=\`Control\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('80cb7877', 'id'))}">\`
elements+=\`DuVay component\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a95aebb4', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('e8b21bab', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('15c76f63', 'id'))}">\`
elements+=\`Text field\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('68d11e95', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb547b32', 'id'))}">\`
elements+=\`w-text-field\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f9557d7', 'id'))}">\`
elements+=\`w-input\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b4576cdb', 'id'))}">\`
elements+=\`<a href="/docs/text-fields" id="\${ty_escapeAttr(ty_generateId('522dc874', 'id'))}">\`
elements+=\`Text fields\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('5d966939', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('138702b0', 'id'))}">\`
elements+=\`Textarea\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('821c420f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f8cc60d0', 'id'))}">\`
elements+=\`w-textarea\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a1369aa7', 'id'))}">\`
elements+=\`<a href="/docs/textareas" id="\${ty_escapeAttr(ty_generateId('6933808e', 'id'))}">\`
elements+=\`Textareas\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('58ee26f7', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('d1259c2b', 'id'))}">\`
elements+=\`Select\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8b99aae2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff3b4ed1', 'id'))}">\`
elements+=\`w-select\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d29e261f', 'id'))}">\`
elements+=\`w-native-select\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('c493ee52', 'id'))}">\`
elements+=\`<a href="/docs/selects" id="\${ty_escapeAttr(ty_generateId('3481d0b9', 'id'))}">\`
elements+=\`Selects\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('8de2aa6e', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('6152f7c7', 'id'))}">\`
elements+=\`Autocomplete\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('15c63d49', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2e111b4', 'id'))}">\`
elements+=\`w-autocomplete\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('142df0fb', 'id'))}">\`
elements+=\`<a href="/docs/autocompletes" id="\${ty_escapeAttr(ty_generateId('6c87e519', 'id'))}">\`
elements+=\`Autocompletes\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('66cc179d', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('18e68329', 'id'))}">\`
elements+=\`Combobox\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('16fd52d0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9163f84e', 'id'))}">\`
elements+=\`w-combobox\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('e7a67e2e', 'id'))}">\`
elements+=\`<a href="/docs/combobox" id="\${ty_escapeAttr(ty_generateId('d4a78e6e', 'id'))}">\`
elements+=\`Combobox\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('133f2706', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('c2cca1a7', 'id'))}">\`
elements+=\`Checkbox\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('0df88a8e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a46c4a76', 'id'))}">\`
elements+=\`w-checkbox\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('47bbc37c', 'id'))}">\`
elements+=\`<a href="/docs/checkboxes" id="\${ty_escapeAttr(ty_generateId('456e0cd2', 'id'))}">\`
elements+=\`Checkboxes\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('c814917a', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('277d0910', 'id'))}">\`
elements+=\`Radio\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('aa937e19', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3cdc2458', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2953229c', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('0f854314', 'id'))}">\`
elements+=\`<a href="/docs/radio-buttons" id="\${ty_escapeAttr(ty_generateId('ca7a12f2', 'id'))}">\`
elements+=\`Radio buttons\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b092fb54', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7c5ed2a8', 'id'))}">\`
elements+=\`Switch\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('ce4911b3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('545c71f4', 'id'))}">\`
elements+=\`w-switch\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a7e48b86', 'id'))}">\`
elements+=\`<a href="/docs/switches" id="\${ty_escapeAttr(ty_generateId('96d8d80f', 'id'))}">\`
elements+=\`Switches\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a77e5ef7', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('d8e84447', 'id'))}">\`
elements+=\`Slider / range\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('17db45a4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ba61686', 'id'))}">\`
elements+=\`w-slider\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d205d26e', 'id'))}">\`
elements+=\`w-range-slider\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('dec9ded9', 'id'))}">\`
elements+=\`<a href="/docs/slider" id="\${ty_escapeAttr(ty_generateId('b3bf7cb8', 'id'))}">\`
elements+=\`Sliders\`
elements+=\`</a>\`
elements+=\`, \`
elements+=\`<a href="/docs/range-sliders" id="\${ty_escapeAttr(ty_generateId('a64eaa6a', 'id'))}">\`
elements+=\`Range sliders\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('826b4e39', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('e3a99d6a', 'id'))}">\`
elements+=\`Number\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('0a7553a1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('024f9a4b', 'id'))}">\`
elements+=\`w-number-input\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('533546e4', 'id'))}">\`
elements+=\`<a href="/docs/number-inputs" id="\${ty_escapeAttr(ty_generateId('10ddcbbe', 'id'))}">\`
elements+=\`Number inputs\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('5bc0b872', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('04d046f3', 'id'))}">\`
elements+=\`File\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('bef342a9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c05b12e7', 'id'))}">\`
elements+=\`w-file-input\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('378ac444', 'id'))}">\`
elements+=\`w-file-upload\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5e5a7467', 'id'))}">\`
elements+=\`<a href="/docs/file-inputs" id="\${ty_escapeAttr(ty_generateId('e42f3cd3', 'id'))}">\`
elements+=\`File inputs\`
elements+=\`</a>\`
elements+=\`, \`
elements+=\`<a href="/docs/file-upload" id="\${ty_escapeAttr(ty_generateId('e3d53160', 'id'))}">\`
elements+=\`File upload\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('8620faff', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('9e9b2bc8', 'id'))}">\`
elements+=\`Date\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('3c791136', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb29c247', 'id'))}">\`
elements+=\`w-date-input\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('447cd2fd', 'id'))}">\`
elements+=\`<a href="/docs/date-inputs" id="\${ty_escapeAttr(ty_generateId('52cba887', 'id'))}">\`
elements+=\`Date inputs\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('245006cd', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('11239209', 'id'))}">\`
elements+=\`Color\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f473b855', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9441fa25', 'id'))}">\`
elements+=\`w-color-input\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('03aedaa8', 'id'))}">\`
elements+=\`<a href="/docs/color-inputs" id="\${ty_escapeAttr(ty_generateId('5e5f6b1a', 'id'))}">\`
elements+=\`Color inputs\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('c9b6d306', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('decbb071', 'id'))}">\`
elements+=\`OTP\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('e0c69310', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('499aaccc', 'id'))}">\`
elements+=\`w-otp\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('44c4b2c7', 'id'))}">\`
elements+=\`w-otp-input\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('40512b48', 'id'))}">\`
elements+=\`<a href="/docs/otp-input" id="\${ty_escapeAttr(ty_generateId('2737a440', 'id'))}">\`
elements+=\`OTP Input\`
elements+=\`</a>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</div>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/inputs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
