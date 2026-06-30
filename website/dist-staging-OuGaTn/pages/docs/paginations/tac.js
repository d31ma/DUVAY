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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('10f42e6d', 'id'))}">\`
elements+=\`Pagination\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('507adf81', 'id'))}">\`
elements+=\`Navigate large data sets with page controls, truncation, and accessible navigation.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0070c9a3', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('57fef1ed', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('ecd0fb48', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" disabled="" id="\${ty_escapeAttr(ty_generateId('3a79221c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('054e672c', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('5d106871', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('df381b83', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 4" id="\${ty_escapeAttr(ty_generateId('0704a102', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 5" id="\${ty_escapeAttr(ty_generateId('aa41e42b', 'id'))}">\`
elements+=\`5\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('affea741', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d49f9d13', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-pagination length="5" page="1" id="\${ty_escapeAttr(ty_generateId('65d944bf', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5b106dd8', 'id'))}">\`
elements+=\`Truncation with total-visible\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b0f941fc', 'id'))}">\`
elements+=\`When \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c543b509', 'id'))}">\`
elements+=\`length\`
elements+=\`</code>\`
elements+=\` exceeds \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a60e244a', 'id'))}">\`
elements+=\`total-visible\`
elements+=\`</code>\`
elements+=\`, the middle is collapsed with an ellipsis.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('abe40f8e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('fb405fa7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('b9e8257f', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 1" id="\${ty_escapeAttr(ty_generateId('7d38d3aa', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<span class="w-page-ellipsis" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ffac1751', 'id'))}">\`
elements+=\`…\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 9" id="\${ty_escapeAttr(ty_generateId('09faf684', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item active" type="button" aria-current="page" aria-label="Current page, page 10" id="\${ty_escapeAttr(ty_generateId('59ceedc1', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 11" id="\${ty_escapeAttr(ty_generateId('bb153261', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<span class="w-page-ellipsis" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c13f4e9d', 'id'))}">\`
elements+=\`…\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 20" id="\${ty_escapeAttr(ty_generateId('9f640446', 'id'))}">\`
elements+=\`20\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('037a36be', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d50fc26b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-pagination length="20" page="10" total-visible="5" id="\${ty_escapeAttr(ty_generateId('79c6e6ea', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0c6e0e79', 'id'))}">\`
elements+=\`First and last buttons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bee8794c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9d942fa', 'id'))}">\`
elements+=\`show-first-last-page\`
elements+=\`</code>\`
elements+=\` to render first («) and last (») navigation buttons.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('be9e9f9f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('f7ceda28', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="First page" disabled="" id="\${ty_escapeAttr(ty_generateId('9024c8d1', 'id'))}">\`
elements+=\`«\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" disabled="" id="\${ty_escapeAttr(ty_generateId('259fa0a8', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('7208d7f7', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('523c7392', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('37546e69', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 4" id="\${ty_escapeAttr(ty_generateId('e2a3925f', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 5" id="\${ty_escapeAttr(ty_generateId('d20a1865', 'id'))}">\`
elements+=\`5\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('27d04216', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Last page" id="\${ty_escapeAttr(ty_generateId('7f2966a4', 'id'))}">\`
elements+=\`»\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('71ef1910', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-pagination length="5" page="1" show-first-last-page="" id="\${ty_escapeAttr(ty_generateId('7ed57bc6', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('42a3de7e', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ecbe52ae', 'id'))}">\`
elements+=\`Choose from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e033a1a', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2cd2820', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d2fcd6b', 'id'))}">\`
elements+=\`tonal\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('94d80d68', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('679bbb79', 'id'))}">\`
elements+=\`elevated\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('47d72719', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('805c021c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('8260fff6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('9e0090e8', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('62d40d7b', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('b031be06', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('52e6d5ee', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('e99ae9cc', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('5a6188e4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--flat w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('5537d571', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--flat active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('f7a66e42', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--flat" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('9b906e4b', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--flat" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('2ea1fa6e', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--flat w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('e883872d', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('a5b3a960', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--tonal w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('4ea13dd2', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--tonal active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('ed845dc1', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--tonal" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('c75bf6c0', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--tonal" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('99bd227d', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--tonal w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('4898f52a', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('5c680fa0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--outlined w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('83c4fedd', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--outlined active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('730a1925', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--outlined" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('f8475340', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--outlined" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('14a352a5', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--outlined w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('7b271ba9', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('f3671e0f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--elevated w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('fdaca195', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--elevated active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('b6ad4816', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--elevated" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('6dce9ed3', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--elevated" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('36b56a3c', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--elevated w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('d1fb5eca', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d20f8b3a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('0b3b5b73', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-pagination length="3" page="1" variant="text" id="\${ty_escapeAttr(ty_generateId('da8a6f25', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="3" page="1" variant="flat" id="\${ty_escapeAttr(ty_generateId('e345880c', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="3" page="1" variant="tonal" id="\${ty_escapeAttr(ty_generateId('510e0542', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="3" page="1" variant="outlined" id="\${ty_escapeAttr(ty_generateId('3d79a19f', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="3" page="1" variant="elevated" id="\${ty_escapeAttr(ty_generateId('826e4e80', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6aa55abb', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5d4d90a9', 'id'))}">\`
elements+=\`Vuetify-style sizes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1fb4973', 'id'))}">\`
elements+=\`x-small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d4d97fda', 'id'))}">\`
elements+=\`small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a1f2c90', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b24a8a14', 'id'))}">\`
elements+=\`large\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c723f26f', 'id'))}">\`
elements+=\`x-large\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ad0dda3f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('e93e130b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination w-pagination--x-small" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('3e4509e1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-small w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('8e59fe8c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-small active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('fe12e698', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-small" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('a03b7e03', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-small w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('0cf0f440', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination w-pagination--small" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('17d1798d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--small w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('4af0b790', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--small active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('e86e58bd', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--small" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('c6540201', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--small w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('cdb75258', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('78d2cb59', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('4be9324c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('2a5791e3', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('00bcc524', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('0838f9a9', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination w-pagination--large" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('8b55d644', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--large w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('9bdc8421', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--large active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('4d0b2cd3', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--large" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('d8f283ac', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--large w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('67543d43', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
      \`
elements+=\`<nav class="w-pagination w-pagination--x-large" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('b3535dd0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-large w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('ef00e350', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-large active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('15cf211d', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-large" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('362d04be', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-page-item w-page-item--x-large w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('9d896c10', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</nav>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('03fee72d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('a82211b9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-pagination length="2" page="1" size="x-small" id="\${ty_escapeAttr(ty_generateId('ca358eaa', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="2" page="1" size="small" id="\${ty_escapeAttr(ty_generateId('0de980cc', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="2" page="1" size="default" id="\${ty_escapeAttr(ty_generateId('1728b875', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="2" page="1" size="large" id="\${ty_escapeAttr(ty_generateId('e915e3ed', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
      \`
elements+=\`<w-pagination length="2" page="1" size="x-large" id="\${ty_escapeAttr(ty_generateId('d86e3308', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('18691e89', 'id'))}">\`
elements+=\`Rounded\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6b674894', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('437ed07b', 'id'))}">\`
elements+=\`rounded="circle"\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('84d737ea', 'id'))}">\`
elements+=\`rounded="pill"\`
elements+=\`</code>\`
elements+=\`) for fully rounded page buttons.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0c9316ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('81690d2b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--pill w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('65c6d1c4', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--pill active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('f4d16b1a', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--pill" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('47125676', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--pill" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('26c78d73', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--pill w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('e92c72e3', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5dcb3cc1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-pagination length="3" page="1" rounded="circle" id="\${ty_escapeAttr(ty_generateId('6ca5f3ab', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a1d910a3', 'id'))}">\`
elements+=\`Color and active-color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('88b5509b', 'id'))}">\`
elements+=\`Override the active page color with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('79f0d2a2', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0bd96e6', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e6f17f64', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-pagination" aria-label="Pagination" id="\${ty_escapeAttr(ty_generateId('583b6baf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Previous page" id="\${ty_escapeAttr(ty_generateId('2090b543', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--color-success w-page-item--active-color-error active" type="button" aria-current="page" aria-label="Current page, page 1" id="\${ty_escapeAttr(ty_generateId('f432a6db', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--color-success" type="button" aria-label="Go to page 2" id="\${ty_escapeAttr(ty_generateId('3b94a90c', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-item--color-success" type="button" aria-label="Go to page 3" id="\${ty_escapeAttr(ty_generateId('2dc9f678', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-page-item w-page-nav" type="button" aria-label="Next page" id="\${ty_escapeAttr(ty_generateId('ed90eeac', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d21a1d70', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-pagination length="3" page="1" color="success" active-color="error" id="\${ty_escapeAttr(ty_generateId('36a66354', 'id'))}">\`
elements+=\`</w-pagination>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/paginations/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
