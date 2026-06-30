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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('655a6007', 'id'))}">\`
elements+=\`Breadcrumbs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0ce640dc', 'id'))}">\`
elements+=\`Breadcrumbs show the user's location within a hierarchy and provide a path back to parent pages. DuVay breadcrumbs support a declarative items array, custom dividers, leading and per-item icons, color theming, density, and rounded containers.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7059a962', 'id'))}">\`
elements+=\`The separator between crumbs is drawn by CSS, so plain markup, the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9f38a1aa', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array, and composed children all get automatic dividers. An explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a014d4bc', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\` between two crumbs overrides the automatic one.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('848aed9a', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2d8ebef8', 'id'))}">\`
elements+=\`Mark the current page with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0d44eef3', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` class (or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ce4c308', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` attribute), which renders a non-link crumb with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('885e4d74', 'id'))}">\`
elements+=\`aria-current="page"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('87dc683d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('af49e233', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs" id="\${ty_escapeAttr(ty_generateId('76288711', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs/components" id="\${ty_escapeAttr(ty_generateId('fcc09645', 'id'))}">\`
elements+=\`Components\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('9c3bd87a', 'id'))}">\`
elements+=\`Breadcrumbs\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('89388e9a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('280739b3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/docs" id="\${ty_escapeAttr(ty_generateId('24ccee43', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/docs/components" id="\${ty_escapeAttr(ty_generateId('8af1227a', 'id'))}">\`
elements+=\`Components\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('73a7e6a9', 'id'))}">\`
elements+=\`Breadcrumbs\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6a17d8e5', 'id'))}">\`
elements+=\`Declarative items\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ef2e1dbc', 'id'))}">\`
elements+=\`For data-driven breadcrumbs, set an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b0271dd', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4557a87c', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` from JavaScript instead of composing children. Each entry is an object with a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de806d8b', 'id'))}">\`
elements+=\`title\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('829f2f5e', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`), an optional \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e4730845', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`, and optional \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2505a490', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b90d0b88', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` values; the last entry becomes the current page automatically. The example below shows the equivalent written as composed children.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('17998b73', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('97275ff5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('f7cfa666', 'id'))}">\`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('00388031', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/catalog" id="\${ty_escapeAttr(ty_generateId('98c28f7b', 'id'))}">\`
elements+=\`Catalog\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('17ff6ed4', 'id'))}">\`
elements+=\`Phones\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('f1529d70', 'id'))}">\`
elements+=\`iPhone\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('87fbf2b4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('461482f0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" icon="\uD83C\uDFE0" id="\${ty_escapeAttr(ty_generateId('482ce7cc', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/catalog" id="\${ty_escapeAttr(ty_generateId('bed96922', 'id'))}">\`
elements+=\`Catalog\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/catalog/phones" disabled="" id="\${ty_escapeAttr(ty_generateId('4772333c', 'id'))}">\`
elements+=\`Phones\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('6e6d4c93', 'id'))}">\`
elements+=\`iPhone\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cbb5f069', 'id'))}">\`
elements+=\`Custom divider\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f6b36e6e', 'id'))}">\`
elements+=\`Set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('02df46e4', 'id'))}">\`
elements+=\`divider\`
elements+=\`</code>\`
elements+=\` attribute to any string. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4f12554b', 'id'))}">\`
elements+=\`--w-breadcrumb-divider\`
elements+=\`</code>\`
elements+=\` custom property on the wrapper.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('07a0717c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" style="--w-breadcrumb-divider: '›'" id="\${ty_escapeAttr(ty_generateId('efb29665', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('7f2ad368', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/reports" id="\${ty_escapeAttr(ty_generateId('5566da8c', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('f99846bc', 'id'))}">\`
elements+=\`Q2\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c0b92129', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs divider="›" id="\${ty_escapeAttr(ty_generateId('ec3ce739', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('d01b5a31', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/reports" id="\${ty_escapeAttr(ty_generateId('40090ce9', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('5e61d31f', 'id'))}">\`
elements+=\`Q2\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6a34f5bb', 'id'))}">\`
elements+=\`Icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e87fa2aa', 'id'))}">\`
elements+=\`Add a leading icon with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a563f206', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` attribute on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6fc57014', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\`, or a per-crumb icon with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ddcd5d31', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14345141', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d272f528', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('f4d84335', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('e2831cdc', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/photos" id="\${ty_escapeAttr(ty_generateId('d12cd2cb', 'id'))}">\`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('f9a2fa3f', 'id'))}">\`
elements+=\`\uD83D\uDCF7\`
elements+=\`</span>\`
elements+=\`Photos\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('372edeeb', 'id'))}">\`
elements+=\`2024\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d56999f7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs icon="\uD83C\uDFE0" id="\${ty_escapeAttr(ty_generateId('d7c2a6b6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/photos" icon="\uD83D\uDCF7" id="\${ty_escapeAttr(ty_generateId('0e462628', 'id'))}">\`
elements+=\`Photos\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('77ab6386', 'id'))}">\`
elements+=\`2024\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('750c5beb', 'id'))}">\`
elements+=\`Color and active color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4ca04cf6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1723bf4', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the link color and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d5b5b01e', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\` the current-page color, using DuVay palette tokens. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f391e6d8', 'id'))}">\`
elements+=\`--w-breadcrumb-color\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e789f9a9', 'id'))}">\`
elements+=\`--w-breadcrumb-active-color\`
elements+=\`</code>\`
elements+=\` custom properties.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('37f233fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" style="--w-breadcrumb-color: var(--w-primary); --w-breadcrumb-active-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('92fdc382', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('1f7ce6bf', 'id'))}">\`
elements+=\`Build\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/deploy" id="\${ty_escapeAttr(ty_generateId('d5d966fe', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('697b68bd', 'id'))}">\`
elements+=\`Live\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9ad72d91', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs color="primary" active-color="success" id="\${ty_escapeAttr(ty_generateId('57e77792', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('e78e6c64', 'id'))}">\`
elements+=\`Build\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/deploy" id="\${ty_escapeAttr(ty_generateId('7d790c94', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('feec0658', 'id'))}">\`
elements+=\`Live\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ce4efc41', 'id'))}">\`
elements+=\`Background and rounded\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('aaea35cc', 'id'))}">\`
elements+=\`Give the strip a tinted, rounded container with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de530ad3', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\` (a palette token) and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('000c0602', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c16d697c', 'id'))}">\`
elements+=\`w-breadcrumbs--rounded\`
elements+=\`</code>\`
elements+=\` and set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d223aee0', 'id'))}">\`
elements+=\`--w-breadcrumb-bg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d041cfb9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs w-breadcrumbs--rounded" aria-label="Breadcrumb" style="--w-breadcrumb-bg: var(--w-surface-container-high)" id="\${ty_escapeAttr(ty_generateId('10573a40', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('e6abe6e4', 'id'))}">\`
elements+=\`Root\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/settings" id="\${ty_escapeAttr(ty_generateId('42d02982', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('1adedeeb', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d472a51e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs bg-color="surface-container-high" rounded="" id="\${ty_escapeAttr(ty_generateId('60162e6b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('006433a4', 'id'))}">\`
elements+=\`Root\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/settings" id="\${ty_escapeAttr(ty_generateId('5c2e11f9', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('5c1bf95a', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b363bc41', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b4bba954', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d055c5f1', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fc19148', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f72c0c6', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`) to adjust the vertical padding. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d9f7008', 'id'))}">\`
elements+=\`w-breadcrumbs--comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0870d86c', 'id'))}">\`
elements+=\`w-breadcrumbs--compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('19be97a8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs w-breadcrumbs--compact" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('76292145', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('80276a91', 'id'))}">\`
elements+=\`One\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/two" id="\${ty_escapeAttr(ty_generateId('94ab2db5', 'id'))}">\`
elements+=\`Two\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('60487808', 'id'))}">\`
elements+=\`Three\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('54bded0c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs density="compact" id="\${ty_escapeAttr(ty_generateId('fea6d0df', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('a92a883e', 'id'))}">\`
elements+=\`One\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/two" id="\${ty_escapeAttr(ty_generateId('9e31b9d3', 'id'))}">\`
elements+=\`Two\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('4a56d3f2', 'id'))}">\`
elements+=\`Three\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f4c5f4f7', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b70e3538', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b7cdf02d', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to a single \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a9f2c88b', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\` to make it non-interactive, or to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27956fbc', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` to disable the whole strip.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c79782d2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('3c45950d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('2b915393', 'id'))}">\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('2dbf3f69', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('60812d56', 'id'))}">\`
elements+=\`Q2\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a14ea4e1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('01d56573', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('af920734', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/reports" disabled="" id="\${ty_escapeAttr(ty_generateId('6b5eed57', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('03bbaa9b', 'id'))}">\`
elements+=\`Q2\`
elements+=\`</w-breadcrumb>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('663b0d30', 'id'))}">\`
elements+=\`Custom divider element\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('62f165fb', 'id'))}">\`
elements+=\`For a one-off divider — an icon, a different glyph per position — place \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac22e928', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\` between crumbs. It overrides the automatic separator for that gap; provide the divider content as its child.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3712ce5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('b1c86cb9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('8653bc8b', 'id'))}">\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-sep" id="\${ty_escapeAttr(ty_generateId('72a259e7', 'id'))}">\`
elements+=\`»\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs" id="\${ty_escapeAttr(ty_generateId('2eefd081', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-sep" id="\${ty_escapeAttr(ty_generateId('5b5595d4', 'id'))}">\`
elements+=\`»\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('89fcecca', 'id'))}">\`
elements+=\`API\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b7a05312', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('2903994f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item href="/" id="\${ty_escapeAttr(ty_generateId('3526c2f9', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumbs-item>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-divider id="\${ty_escapeAttr(ty_generateId('1626dc35', 'id'))}">\`
elements+=\`»\`
elements+=\`</w-breadcrumbs-divider>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item href="/docs" id="\${ty_escapeAttr(ty_generateId('e69459cc', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-breadcrumbs-item>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-divider id="\${ty_escapeAttr(ty_generateId('4031f08a', 'id'))}">\`
elements+=\`»\`
elements+=\`</w-breadcrumbs-divider>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item active="" id="\${ty_escapeAttr(ty_generateId('8a9a5149', 'id'))}">\`
elements+=\`API\`
elements+=\`</w-breadcrumbs-item>\`
elements+=\`
    \`
elements+=\`</w-breadcrumbs>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6e48c386', 'id'))}">\`
elements+=\`Accessibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b0351988', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69be5ead', 'id'))}">\`
elements+=\`aria-label="Breadcrumb"\`
elements+=\`</code>\`
elements+=\` on the wrapper and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('82049849', 'id'))}">\`
elements+=\`aria-current="page"\`
elements+=\`</code>\`
elements+=\` on the current item. The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61a14509', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` component adds both automatically, marks disabled crumbs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('043e7e2d', 'id'))}">\`
elements+=\`aria-disabled\`
elements+=\`</code>\`
elements+=\`, and renders icons as \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('061388e9', 'id'))}">\`
elements+=\`aria-hidden\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6347b371', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a5330067', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de9411ae', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d6806fd', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('97f277d5', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-item&gt;\`
elements+=\`</code>\`
elements+=\` (alias of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7340d69', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa3d337c', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4a66bcf6', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('55544bf0', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12162d29', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd579e25', 'id'))}">\`
elements+=\`divider\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ae2d5f6f', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('189e7d99', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9decd3d4', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fcc16870', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('914f16d9', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0dd6eaea', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('42a5c2e3', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7064bace', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('7c17a5e8', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('127abede', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66e74b3c', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('151fd54c', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc553c50', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/breadcrumbs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
