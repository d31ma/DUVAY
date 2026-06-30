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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('c383d61e', 'id'))}">\`
elements+=\`Grid\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a893c000', 'id'))}">\`
elements+=\`A 12-column flexbox grid for responsive layouts. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2e87b92', 'id'))}">\`
elements+=\`w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69a28a49', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a99737b6', 'id'))}">\`
elements+=\`w-col\`
elements+=\`</code>\`
elements+=\` for component layouts, or the equivalent \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7107a09c', 'id'))}">\`
elements+=\`.w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b6511741', 'id'))}">\`
elements+=\`.w-grid-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('500461bd', 'id'))}">\`
elements+=\`.w-grid-col-*\`
elements+=\`</code>\`
elements+=\` classes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a6556b6f', 'id'))}">\`
elements+=\`Container\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f96fe258', 'id'))}">\`
elements+=\`Centers content and applies a max width. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('097ccd44', 'id'))}">\`
elements+=\`--fluid\`
elements+=\`</code>\`
elements+=\` for full width, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('55a6f6a1', 'id'))}">\`
elements+=\`--sm\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a97254be', 'id'))}">\`
elements+=\`--md\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db9e3a8a', 'id'))}">\`
elements+=\`--lg\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e68890fe', 'id'))}">\`
elements+=\`--xl\`
elements+=\`</code>\`
elements+=\` for a fixed maximum.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('9a49f6f4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54386d6c', 'id'))}">\`
elements+=\`&lt;div class="w-container"&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/div&gt;

&lt;w-container&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/w-container&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c12c1150', 'id'))}">\`
elements+=\`Basic columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e064c37b', 'id'))}">\`
elements+=\`Each row has 12 units. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a4b14d32', 'id'))}">\`
elements+=\`.w-grid-col-6\`
elements+=\`</code>\`
elements+=\` spans half, two of them fill the row.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c48a9f9f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('f78f5b67', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('1d1470c9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9f8a194d', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('1bc6e5c7', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('bc4f28c6', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" id="\${ty_escapeAttr(ty_generateId('5e9064c0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('cf73795c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('cc0a3812', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('3c213dfc', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('205cfa52', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('14b66a97', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2f812691', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8bc09ede', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('48d89fbe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('c7e4e244', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('e5230ba3', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('b32305d2', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('39146859', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c785556a', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('f3c4ce0e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('2626be59', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a207bdd4', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('3fdcfa6c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('00363ed6', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('6f6eccea', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a0638e49', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7f05a621', 'id'))}">\`
elements+=\`Auto / equal width\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('06a5ff0c', 'id'))}">\`
elements+=\`Columns without a number share the remaining space equally.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c8d1ebe2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('980fbf5d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('857a3ed2', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('71bca313', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('70b5e087', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('97b9d9dc', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('9697c2b4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('eab1a85c', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ad95ff12', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('14f00147', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('3103887c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('8a28cf5f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('6a4b293f', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('705aa93e', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7ba46aea', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('cdb4d2a4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('35779841', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('63856476', 'id'))}">\`
elements+=\`Responsive columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8073502b', 'id'))}">\`
elements+=\`Stack on mobile, two-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2be1721', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\` (≥960px), four-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b6db8af', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` (≥1280px). Resize the window to see it adapt.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('34d0cdee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('576c24a7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('7c722433', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('cf86bfe7', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('1d06a42b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('96b3dba2', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('65ff3a34', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('315713a3', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('1e8c0e69', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a63a88f8', 'id'))}">\`
elements+=\`4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c0997c39', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('7f7bb64c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('ab40cd51', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('f16cc549', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a15255c5', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('7e845a81', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('fdfcf260', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('f446c3a6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('3ecee002', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('f8020f61', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a52d5b45', 'id'))}">\`
elements+=\`4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ab3bf57a', 'id'))}">\`
elements+=\`Offsets\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bdbeb4c2', 'id'))}">\`
elements+=\`Push a column to the right with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43e91898', 'id'))}">\`
elements+=\`.w-grid-offset-*\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c4c30910', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('9eade7c5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('db480890', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f753d74b', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-offset-4" id="\${ty_escapeAttr(ty_generateId('fdc14c67', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c2f1f83c', 'id'))}">\`
elements+=\`col-4 · offset-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('555aa0d2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('210b00b5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('98bd9bc1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('849b5cf5', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7f396d67', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" offset="4" id="\${ty_escapeAttr(ty_generateId('c89dcfb1', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7c58c48f', 'id'))}">\`
elements+=\`col-4 · offset-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('54e4e43c', 'id'))}">\`
elements+=\`Gutters & alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5f8f52fc', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('34518544', 'id'))}">\`
elements+=\`--tight\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0bca0f7c', 'id'))}">\`
elements+=\`--flush\`
elements+=\`</code>\`
elements+=\` to the row for smaller / no gutters, set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a4102c2e', 'id'))}">\`
elements+=\`gutter\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24fef528', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\` for named or custom spacing, and use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('53c3eb54', 'id'))}">\`
elements+=\`--center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b42af7d9', 'id'))}">\`
elements+=\`--between\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f66220ff', 'id'))}">\`
elements+=\`--middle\`
elements+=\`</code>\`
elements+=\` to align columns.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('40978362', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--flush" id="\${ty_escapeAttr(ty_generateId('71d0b9a3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('c5ff0e9b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8162b8db', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('083f572a', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c4b1aac2', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('51be5894', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e3d9a30c', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('a1265d57', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('059af60a', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" style="--w-grid-gutter: var(--w-space-8)" id="\${ty_escapeAttr(ty_generateId('1da42cab', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('133ba5f5', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('4f56b4c5', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('6ffbb686', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('285a3525', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a4dd173f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e38f19f3', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b01201e0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('a3bdd7c5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row no-gutters="" id="\${ty_escapeAttr(ty_generateId('9da0920b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('12c6d5ab', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e99dfc42', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('6f5cad74', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('36033a79', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('98f2835b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('71eacab8', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('28e8102f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('0bbb8eaa', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row gutter="xl" class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('2096cb97', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('ca6c1e15', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('22aecdcc', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('627a1f78', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('05484d48', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('890e97db', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('b417e942', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c8eab2a4', 'id'))}">\`
elements+=\`Justify content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1e8af59a', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3718e31c', 'id'))}">\`
elements+=\`justify\`
elements+=\`</code>\`
elements+=\` on the row to distribute columns along the main axis: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1aff38d5', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0cd7564', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a67c8a78', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('187e6b1e', 'id'))}">\`
elements+=\`space-between\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cccdfc9e', 'id'))}">\`
elements+=\`space-around\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7c1b229d', 'id'))}">\`
elements+=\`space-evenly\`
elements+=\`</code>\`
elements+=\`. Each maps to a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c87eea41', 'id'))}">\`
elements+=\`.w-grid-row--justify-*\`
elements+=\`</code>\`
elements+=\` class.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f76cf5a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--justify-center" id="\${ty_escapeAttr(ty_generateId('b0b408b9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('ca50416c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('cfe62efa', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('0222d421', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('dde228d9', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--justify-space-between w-mt-3" id="\${ty_escapeAttr(ty_generateId('9e263c17', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('a60805f2', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('d6a4bfef', 'id'))}">\`
elements+=\`between\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4c3618cf', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('1fb3d0a0', 'id'))}">\`
elements+=\`between\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2ae09645', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('841ff53e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row justify="center" id="\${ty_escapeAttr(ty_generateId('8b6a88ce', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('249b2723', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('90b2397a', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('bdfd9456', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('83d6238a', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row justify="space-between" class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('f2a99b1c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('c332f4a6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('b6d25197', 'id'))}">\`
elements+=\`between\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('b68d2149', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('92819d27', 'id'))}">\`
elements+=\`between\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6986fda9', 'id'))}">\`
elements+=\`Align items\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a8da132a', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0425b39a', 'id'))}">\`
elements+=\`align\`
elements+=\`</code>\`
elements+=\` on the row to align columns of differing heights along the cross axis: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25c04452', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a6ad912', 'id'))}">\`
elements+=\`center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0604d77f', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fde1823d', 'id'))}">\`
elements+=\`baseline\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf8c9d8e', 'id'))}">\`
elements+=\`stretch\`
elements+=\`</code>\`
elements+=\`. Responsive variants (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec4d5f3a', 'id'))}">\`
elements+=\`align-md\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('361db528', 'id'))}">\`
elements+=\`justify-lg\`
elements+=\`</code>\`
elements+=\`, &hellip;) apply from a breakpoint up.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d4816a13', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--align-center" style="min-height:90px" id="\${ty_escapeAttr(ty_generateId('6805e2bf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5d470029', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('410504a1', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('31c2bc76', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" style="padding-block:1.5rem" id="\${ty_escapeAttr(ty_generateId('e1f16f3f', 'id'))}">\`
elements+=\`tall\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('daa98787', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('19fa8c4e', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6dbb2646', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('d49c2835', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row align="center" style="min-height:90px" id="\${ty_escapeAttr(ty_generateId('4884f668', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('56f7f197', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('20e43865', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('af4f484f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" style="padding-block:1.5rem" id="\${ty_escapeAttr(ty_generateId('18396912', 'id'))}">\`
elements+=\`tall\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('6a129971', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c783452d', 'id'))}">\`
elements+=\`center\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3e6991aa', 'id'))}">\`
elements+=\`Order\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('75e26cb6', 'id'))}">\`
elements+=\`Change the visual order without touching source order with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a46b68fa', 'id'))}">\`
elements+=\`order\`
elements+=\`</code>\`
elements+=\` on a column (a number \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d379a06', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\`–\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7133bd37', 'id'))}">\`
elements+=\`12\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b3ba152f', 'id'))}">\`
elements+=\`first\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('75a73958', 'id'))}">\`
elements+=\`last\`
elements+=\`</code>\`
elements+=\`). Responsive variants like \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('174559b1', 'id'))}">\`
elements+=\`order-md\`
elements+=\`</code>\`
elements+=\` reorder from a breakpoint up.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a1170526', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('db228945', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-order-3" id="\${ty_escapeAttr(ty_generateId('b3b0261e', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('bf538810', 'id'))}">\`
elements+=\`source 1 · order 3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-order-1" id="\${ty_escapeAttr(ty_generateId('bc3b2570', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8c02541a', 'id'))}">\`
elements+=\`source 2 · order 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-order-2" id="\${ty_escapeAttr(ty_generateId('8c27a644', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('ba5ea8fa', 'id'))}">\`
elements+=\`source 3 · order 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('50f65332', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('8a9cdede', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('0725579e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" order="3" id="\${ty_escapeAttr(ty_generateId('f2207300', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('12fd5925', 'id'))}">\`
elements+=\`source 1 · order 3\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" order="1" id="\${ty_escapeAttr(ty_generateId('e7896db5', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8059799c', 'id'))}">\`
elements+=\`source 2 · order 1\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" order="2" id="\${ty_escapeAttr(ty_generateId('85c992db', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('b4ceca7b', 'id'))}">\`
elements+=\`source 3 · order 2\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bb58efcb', 'id'))}">\`
elements+=\`Fill height\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c2bcc495', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ccdbee66', 'id'))}">\`
elements+=\`fill-height\`
elements+=\`</code>\`
elements+=\` to a container to stretch it to the parent height and vertically center its rows — handy for hero sections.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('d7f02149', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12033ad9', 'id'))}">\`
elements+=\`&lt;w-container fill-height&gt;
  &lt;w-row&gt;&hellip;&lt;/w-row&gt;
&lt;/w-container&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c5f63700', 'id'))}">\`
elements+=\`Breakpoints: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66243acc', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` (&lt;600px), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('580e45cd', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\` (≥600px), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5649a2f', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\` (≥960px), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('167ae109', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` (≥1280px), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69632c1e', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\` (≥1920px), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ffaa3a0', 'id'))}">\`
elements+=\`xxl\`
elements+=\`</code>\`
elements+=\` (≥2560px). The full attribute reference for each component is below.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/grid/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
