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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('8d534f39', 'id'))}">\`
elements+=\`Infinite Scroller\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a8fdbc1b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c6e4c8b1', 'id'))}">\`
elements+=\`w-infinite-scroll\`
elements+=\`</code>\`
elements+=\` emits a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f45f12e6', 'id'))}">\`
elements+=\`load\`
elements+=\`</code>\`
elements+=\` event as the user reaches an edge of a scrollable area. Fetch the next batch, then call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('85b29160', 'id'))}">\`
elements+=\`done(status)\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8dc98cb', 'id'))}">\`
elements+=\`"ok"\`
elements+=\`</code>\`
elements+=\` (more available), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ccd20ea', 'id'))}">\`
elements+=\`"empty"\`
elements+=\`</code>\`
elements+=\` (stop), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98135e55', 'id'))}">\`
elements+=\`"error"\`
elements+=\`</code>\`
elements+=\` (show a retry). It supports automatic (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c46655f5', 'id'))}">\`
elements+=\`intersect\`
elements+=\`</code>\`
elements+=\`) and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3380a33b', 'id'))}">\`
elements+=\`manual\`
elements+=\`</code>\`
elements+=\` modes, loading from the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('85aba007', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a409b56', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('795fa236', 'id'))}">\`
elements+=\`both\`
elements+=\`</code>\`
elements+=\` edges, and a horizontal \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9819b3c6', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cfc15f4f', 'id'))}">\`
elements+=\`Wiring it up\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('653f09ac', 'id'))}">\`
elements+=\`Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ce38b69', 'id'))}">\`
elements+=\`load\`
elements+=\`</code>\`
elements+=\`, append your data, then settle with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6801cf28', 'id'))}">\`
elements+=\`done\`
elements+=\`</code>\`
elements+=\`:\`
elements+=\`</p>\`
elements+=\`<pre class="code-block" id="\${ty_escapeAttr(ty_generateId('cec99931', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de04195a', 'id'))}">\`
elements+=\`const scroller = document.querySelector('w-infinite-scroll');
let page = 0;

scroller.addEventListener('load', async (e) =&gt; &#123;
  try &#123;
    const rows = await fetchPage(++page);     // your fetch
    appendRows(scroller, rows);               // add to the slot content
    e.detail.done(rows.length ? 'ok' : 'empty');
  &#125; catch &#123;
    e.detail.done('error');                   // shows a Retry button
  &#125;
&#125;);\`
elements+=\`</code>\`
elements+=\`</pre>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2531d0f2', 'id'))}">\`
elements+=\`Intersect (default)\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d1e5cb59', 'id'))}">\`
elements+=\`In \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e6d1017', 'id'))}">\`
elements+=\`intersect\`
elements+=\`</code>\`
elements+=\` mode the bottom sentinel auto-loads when it scrolls into view; a spinner shows while the fetch is in flight.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aff4e0f4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-infinite-scroll" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('4ed7ed77', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-content" id="\${ty_escapeAttr(ty_generateId('f4522bae', 'id'))}">\`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('dce30c50', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('fd0a4599', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('07d485fd', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('a0ed20cc', 'id'))}">\`
elements+=\`Item 3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-trigger" role="status" id="\${ty_escapeAttr(ty_generateId('02bec5cd', 'id'))}">\`
elements+=\`<span class="w-infinite-scroll-spinner" id="\${ty_escapeAttr(ty_generateId('cad25beb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('9e21d82d', 'id'))}">\`
elements+=\`Loading…\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('95727de5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-infinite-scroll height="180px" onload="var l=this.querySelector('.w-list'),n=l.children.length;l.insertAdjacentHTML('beforeend','<div class=w-list-item>Item '+(n+1)+'</div><div class=w-list-item>Item '+(n+2)+'</div>');event.detail.done(l.children.length>=18?'empty':'ok')" id="\${ty_escapeAttr(ty_generateId('38cf83ea', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('44832da4', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('ba306136', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('92caf188', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('7841b2f6', 'id'))}">\`
elements+=\`Item 3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-infinite-scroll>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('08ada293', 'id'))}">\`
elements+=\`Manual\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e75fd455', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('76fbf2be', 'id'))}">\`
elements+=\`mode="manual"\`
elements+=\`</code>\`
elements+=\` to load on a button press instead of automatically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2b704751', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-infinite-scroll" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('02b0e8ea', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-content" id="\${ty_escapeAttr(ty_generateId('2737eb9f', 'id'))}">\`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('b725b702', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('212fab4f', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('38e554c3', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-trigger" role="status" id="\${ty_escapeAttr(ty_generateId('0cffc566', 'id'))}">\`
elements+=\`<button type="button" class="w-btn w-btn-tonal" id="\${ty_escapeAttr(ty_generateId('33c23cab', 'id'))}">\`
elements+=\`Load more\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2b313d26', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-infinite-scroll mode="manual" height="180px" onload="var l=this.querySelector('.w-list'),n=l.children.length;l.insertAdjacentHTML('beforeend','<div class=w-list-item>Item '+(n+1)+'</div><div class=w-list-item>Item '+(n+2)+'</div>');event.detail.done(l.children.length>=12?'empty':'ok')" id="\${ty_escapeAttr(ty_generateId('921c311e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('0179224c', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('1c288375', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('7194a6b7', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-infinite-scroll>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bd771dbf', 'id'))}">\`
elements+=\`Empty &amp; error states\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('eadbc17d', 'id'))}">\`
elements+=\`When you call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('75f276c6', 'id'))}">\`
elements+=\`done("empty")\`
elements+=\`</code>\`
elements+=\` the exhausted message shows; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('81fd759f', 'id'))}">\`
elements+=\`done("error")\`
elements+=\`</code>\`
elements+=\` shows the error with a Retry button.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a2b5ccc9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('defc610f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll" style="max-height:140px" id="\${ty_escapeAttr(ty_generateId('19bb326a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-infinite-scroll-content" id="\${ty_escapeAttr(ty_generateId('a39d9225', 'id'))}">\`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('c9e3c780', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('34f4cd8a', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-infinite-scroll-trigger" role="status" id="\${ty_escapeAttr(ty_generateId('4b7ffe77', 'id'))}">\`
elements+=\`<span class="w-infinite-scroll-empty" id="\${ty_escapeAttr(ty_generateId('6a56f75d', 'id'))}">\`
elements+=\`No more items\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll" style="max-height:140px" id="\${ty_escapeAttr(ty_generateId('127634d1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-infinite-scroll-content" id="\${ty_escapeAttr(ty_generateId('bc4182b7', 'id'))}">\`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('a9709c2b', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('45b75b1a', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-infinite-scroll-trigger" role="status" id="\${ty_escapeAttr(ty_generateId('48f1376f', 'id'))}">\`
elements+=\`<span class="w-infinite-scroll-error" id="\${ty_escapeAttr(ty_generateId('a2b33b5f', 'id'))}">\`
elements+=\`Something went wrong\`
elements+=\`</span>\`
elements+=\` \`
elements+=\`<button type="button" class="w-btn w-btn-text" id="\${ty_escapeAttr(ty_generateId('79547709', 'id'))}">\`
elements+=\`Retry\`
elements+=\`</button>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4070a5dd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('949df1c4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-infinite-scroll mode="manual" height="140px" status="empty" empty-text="You've reached the end" disabled="" id="\${ty_escapeAttr(ty_generateId('36433273', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('7f5d3ac3', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('d32b0318', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</w-infinite-scroll>\`
elements+=\`
      \`
elements+=\`<w-infinite-scroll mode="manual" height="140px" onload="this.dataset.n=(+this.dataset.n||0)+1;if(this.dataset.n=='1')return event.detail.done('error');var l=this.querySelector('.w-list');l.insertAdjacentHTML('beforeend','<div class=w-list-item>Loaded after retry</div>');event.detail.done('empty')" id="\${ty_escapeAttr(ty_generateId('209bea0c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('486cdf92', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('6386e8e9', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</w-infinite-scroll>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7e717e35', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('280c8932', 'id'))}">\`
elements+=\`Tint the spinner with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('602a65e9', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` (token name or CSS color).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7cb5e09f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-infinite-scroll" style="max-height:140px;--w-infinite-color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('81694b50', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-content" id="\${ty_escapeAttr(ty_generateId('aeb9abeb', 'id'))}">\`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('90bc532c', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('770c7f46', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-infinite-scroll-trigger" role="status" id="\${ty_escapeAttr(ty_generateId('33d27262', 'id'))}">\`
elements+=\`<span class="w-infinite-scroll-spinner" id="\${ty_escapeAttr(ty_generateId('587e88ce', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('47bc1a8b', 'id'))}">\`
elements+=\`Loading…\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('de9f23e5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-infinite-scroll height="140px" color="success" onload="var l=this.querySelector('.w-list'),n=l.children.length;l.insertAdjacentHTML('beforeend','<div class=w-list-item>Item '+(n+1)+'</div>');event.detail.done(l.children.length>=8?'empty':'ok')" id="\${ty_escapeAttr(ty_generateId('7ba48962', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('8454b204', 'id'))}">\`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('1cc681fc', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-infinite-scroll>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6f24c3bd', 'id'))}">\`
elements+=\`Sides &amp; direction\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e5427ad6', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3c88d0c5', 'id'))}">\`
elements+=\`side="start"\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28cff2c7', 'id'))}">\`
elements+=\`"end"\`
elements+=\`</code>\`
elements+=\` (default), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d761c0ef', 'id'))}">\`
elements+=\`"both"\`
elements+=\`</code>\`
elements+=\` to choose which edge loads, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7b1fd09d', 'id'))}">\`
elements+=\`direction="horizontal"\`
elements+=\`</code>\`
elements+=\` for horizontal carousels. Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3bf6e741', 'id'))}">\`
elements+=\`margin\`
elements+=\`</code>\`
elements+=\` to start loading earlier (px before the edge).\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0aa2603d', 'id'))}">\`
elements+=\`Sentinel\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bb7caab7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e576eb60', 'id'))}">\`
elements+=\`&lt;w-infinite-scroll-intersect&gt;\`
elements+=\`</code>\`
elements+=\` mirrors Vuetify&#8217;s internal sentinel as a standalone subcomponent for custom scroll containers &#8212; place it inside your own scroller and listen for its \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1240ea7b', 'id'))}">\`
elements+=\`load\`
elements+=\`</code>\`
elements+=\` event.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/infinite-scroller/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
