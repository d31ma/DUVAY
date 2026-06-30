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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('a903db82', 'id'))}">\`
elements+=\`Download\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b615903f', 'id'))}">\`
elements+=\`DuVay ships in two flavours that share one design system: \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('baefbb76', 'id'))}">\`
elements+=\`CSS classes\`
elements+=\`</strong>\`
elements+=\` (style with utility and component classes) and optional \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('0dab1d19', 'id'))}">\`
elements+=\`web components\`
elements+=\`</strong>\`
elements+=\` (drop-in custom elements). Both are zero-dependency. Use the hosted URLs from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9e0ba99', 'id'))}">\`
elements+=\`https://duvay.del.ma\`
elements+=\`</code>\`
elements+=\`, download the files, or pin to a specific CalVer release.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9ccb2f1d', 'id'))}">\`
elements+=\`Quick start (hosted)\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8b1ffdf1', 'id'))}">\`
elements+=\`Paste into your \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4dd1f5f4', 'id'))}">\`
elements+=\`&lt;head&gt;\`
elements+=\`</code>\`
elements+=\`. The minified builds are served from this site and updated with every release.\`
elements+=\`</p>\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('fb5f6937', 'id'))}">\`
elements+=\`CSS classes\`
elements+=\`</h3>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('d145b60f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08c3b7a0', 'id'))}">\`
elements+=\`&lt;link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.css"&gt;
&lt;script src="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.js" defer&gt;&lt;/script&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('f6790c4b', 'id'))}">\`
elements+=\`Selective CSS\`
elements+=\`</h3>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('e2911c5b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b4d144aa', 'id'))}">\`
elements+=\`@import "duvay-css/core.css";
@import "duvay-css/components/buttons.css";
@import "duvay-css/components/tooltips.css";\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('541f8975', 'id'))}">\`
elements+=\`Web components\`
elements+=\`</h3>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('6a7b399b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('72f0fc75', 'id'))}">\`
elements+=\`&lt;link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.css"&gt;
&lt;script type="module" src="https://duvay.del.ma/shared/assets/duvay/dist/duvay-wc.min.js"&gt;&lt;/script&gt;

&lt;w-btn variant="filled"&gt;Click me&lt;/w-btn&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e40a09f0', 'id'))}">\`
elements+=\`Pin to a CalVer release\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b38102ab', 'id'))}">\`
elements+=\`Every release is kept at a permanent URL. Swap \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a9baec7a', 'id'))}">\`
elements+=\`VERSION\`
elements+=\`</code>\`
elements+=\` for the CalVer you want (for example \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3699cee6', 'id'))}">\`
elements+=\`26.24.12\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('b4e24079', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5865799d', 'id'))}">\`
elements+=\`&lt;link rel="stylesheet" href="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay.min.css"&gt;
&lt;script src="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay.min.js" defer&gt;&lt;/script&gt;

&lt;!-- optional web components -->
&lt;script type="module" src="https://duvay.del.ma/shared/assets/duvay/versions/VERSION/dist/duvay-wc.min.js"&gt;&lt;/script&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<p class="w-text-subtle" id="\${ty_escapeAttr(ty_generateId('b5374c13', 'id'))}">\`
elements+=\`Versioned URLs never change, so you can upgrade on your own schedule by updating the version segment.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bd24b08e', 'id'))}">\`
elements+=\`Direct download\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('39513bcd', 'id'))}">\`
elements+=\`Self-hosted builds — full (readable) and minified (production). Right-click → Save, or click to download.\`
elements+=\`</p>\`
elements+=\`<div class="api-table-wrap" id="\${ty_escapeAttr(ty_generateId('def82c8d', 'id'))}">\`
elements+=\`<table class="api-table" id="\${ty_escapeAttr(ty_generateId('9d8422ae', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('209f4ef9', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2924d0f5', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('c31a3736', 'id'))}">\`
elements+=\`Asset\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('c993f667', 'id'))}">\`
elements+=\`Full\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('90c6a202', 'id'))}">\`
elements+=\`Minified\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('24f3abd4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2a6c598f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e958046b', 'id'))}">\`
elements+=\`CSS framework\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7bdcb01d', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.css" download="" id="\${ty_escapeAttr(ty_generateId('da099a75', 'id'))}">\`
elements+=\`duvay.css · ~307 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f254684b', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.css" download="" id="\${ty_escapeAttr(ty_generateId('d513487b', 'id'))}">\`
elements+=\`duvay.min.css · ~231 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4609667f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0600f019', 'id'))}">\`
elements+=\`CSS core\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b06d86bb', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/core.css" download="" id="\${ty_escapeAttr(ty_generateId('5b664fa1', 'id'))}">\`
elements+=\`core.css · ~70 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b773aedf', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/core.min.css" download="" id="\${ty_escapeAttr(ty_generateId('945edca8', 'id'))}">\`
elements+=\`core.min.css · ~50 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4b4832c1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('23f6077f', 'id'))}">\`
elements+=\`Component CSS\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ba756b8', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/components/buttons.css" download="" id="\${ty_escapeAttr(ty_generateId('a7399875', 'id'))}">\`
elements+=\`components/buttons.css\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4eb1a734', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/components/tooltips.css" download="" id="\${ty_escapeAttr(ty_generateId('a8f92cd3', 'id'))}">\`
elements+=\`components/tooltips.css\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2d8a2787', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c00d9b2', 'id'))}">\`
elements+=\`Behaviour layer (duvay.js)\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('74ce5251', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.js" download="" id="\${ty_escapeAttr(ty_generateId('c2cd6072', 'id'))}">\`
elements+=\`duvay.js · ~13 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4c2080f8', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay.min.js" download="" id="\${ty_escapeAttr(ty_generateId('50dfeb3a', 'id'))}">\`
elements+=\`duvay.min.js · ~6.8 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('76c55811', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('514c55e2', 'id'))}">\`
elements+=\`Motion add-on\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2c2fa0fb', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay-motion.js" download="" id="\${ty_escapeAttr(ty_generateId('679b3c9c', 'id'))}">\`
elements+=\`duvay-motion.js · ~18 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5c4ed7ae', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay-motion.min.js" download="" id="\${ty_escapeAttr(ty_generateId('ee2d78b6', 'id'))}">\`
elements+=\`duvay-motion.min.js · ~10 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('19bd2415', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c34fd641', 'id'))}">\`
elements+=\`Web components (bundled)\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4605b4ed', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay-wc.js" download="" id="\${ty_escapeAttr(ty_generateId('a417483c', 'id'))}">\`
elements+=\`duvay-wc.js · ~417 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9ca6dd6e', 'id'))}">\`
elements+=\`<a href="https://duvay.del.ma/shared/assets/duvay/dist/duvay-wc.min.js" download="" id="\${ty_escapeAttr(ty_generateId('e0469af9', 'id'))}">\`
elements+=\`duvay-wc.min.js · ~291 KB\`
elements+=\`</a>\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`</div>\`
elements+=\`<p class="w-text-subtle" id="\${ty_escapeAttr(ty_generateId('a966d4ef', 'id'))}">\`
elements+=\`The behaviour layer (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f82488cb', 'id'))}">\`
elements+=\`duvay.js\`
elements+=\`</code>\`
elements+=\`) wires CSS-class interactions — dialogs, dropdowns, toasts, theme cycling — through \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a60799e4', 'id'))}">\`
elements+=\`data-w-*\`
elements+=\`</code>\`
elements+=\` attributes. The web-component bundle is self-contained and does not require it.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e50e8d77', 'id'))}">\`
elements+=\`Versions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3e6d7744', 'id'))}">\`
elements+=\`Releases follow CalVer (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73c2d6e1', 'id'))}">\`
elements+=\`YY.WW.DD\`
elements+=\`</code>\`
elements+=\`). Replace \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a81f2be', 'id'))}">\`
elements+=\`VERSION\`
elements+=\`</code>\`
elements+=\` with the CalVer release you want; every release is permanently available at \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a24800f', 'id'))}">\`
elements+=\`/shared/assets/duvay/versions/VERSION/dist/\`
elements+=\`</code>\`
elements+=\`. Always test an upgrade against your app before moving the version pin.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/download/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
