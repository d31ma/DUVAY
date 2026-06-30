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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('50e8b145', 'id'))}">\`
elements+=\`Breadcrumbs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9758e848', 'id'))}">\`
elements+=\`Breadcrumbs show the user's location within a hierarchy and provide a path back to parent pages. DuVay breadcrumbs support a declarative items array, custom dividers, leading and per-item icons, color theming, density, and rounded containers.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('341d0191', 'id'))}">\`
elements+=\`The separator between crumbs is drawn by CSS, so plain markup, the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('620f64c9', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array, and composed children all get automatic dividers. An explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4113e0aa', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\` between two crumbs overrides the automatic one.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3c86ec38', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8a1390d1', 'id'))}">\`
elements+=\`Mark the current page with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b59a814', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` class (or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('431b98f4', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` attribute), which renders a non-link crumb with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7d799101', 'id'))}">\`
elements+=\`aria-current="page"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('566adf71', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('5bb2c8b7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs" id="\${ty_escapeAttr(ty_generateId('336d22cf', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs/components" id="\${ty_escapeAttr(ty_generateId('8ceb6e18', 'id'))}">\`
elements+=\`Components\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('da7319f0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('85c1e6b6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('0f1c5c48', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/docs" id="\${ty_escapeAttr(ty_generateId('ae545d15', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/docs/components" id="\${ty_escapeAttr(ty_generateId('cfbd8117', 'id'))}">\`
elements+=\`Components\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('9ced9cf5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ae80c006', 'id'))}">\`
elements+=\`Declarative items\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b999b614', 'id'))}">\`
elements+=\`For data-driven breadcrumbs, set an \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('85ef5acd', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1f6d2e3b', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` from JavaScript instead of composing children. Each entry is an object with a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95dfefd7', 'id'))}">\`
elements+=\`title\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4230be5a', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`), an optional \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ffdc5b47', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`, and optional \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('636a9ef6', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('96cad376', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` values; the last entry becomes the current page automatically. The example below shows the equivalent written as composed children.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('11ec37e2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('36322ef1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('f49746c9', 'id'))}">\`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('e2138516', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/catalog" id="\${ty_escapeAttr(ty_generateId('e817293d', 'id'))}">\`
elements+=\`Catalog\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('5912cb2a', 'id'))}">\`
elements+=\`Phones\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('e3e97dc9', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7d9a6072', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('baa9cb3a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" icon="\uD83C\uDFE0" id="\${ty_escapeAttr(ty_generateId('68c358c8', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/catalog" id="\${ty_escapeAttr(ty_generateId('5ebb0079', 'id'))}">\`
elements+=\`Catalog\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/catalog/phones" disabled="" id="\${ty_escapeAttr(ty_generateId('bcca1a68', 'id'))}">\`
elements+=\`Phones\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('c3db881c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4d5aa13a', 'id'))}">\`
elements+=\`Custom divider\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fdfd440b', 'id'))}">\`
elements+=\`Set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27d1ca32', 'id'))}">\`
elements+=\`divider\`
elements+=\`</code>\`
elements+=\` attribute to any string. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc58d44c', 'id'))}">\`
elements+=\`--w-breadcrumb-divider\`
elements+=\`</code>\`
elements+=\` custom property on the wrapper.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5e360ad7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" style="--w-breadcrumb-divider: '›'" id="\${ty_escapeAttr(ty_generateId('30aa515d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('95573864', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/reports" id="\${ty_escapeAttr(ty_generateId('d586f136', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('abe30917', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c87c1f56', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs divider="›" id="\${ty_escapeAttr(ty_generateId('817afb4f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('6177c2d5', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/reports" id="\${ty_escapeAttr(ty_generateId('056f9fe3', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('4d941c06', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d85ae940', 'id'))}">\`
elements+=\`Icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9113df1a', 'id'))}">\`
elements+=\`Add a leading icon with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ab5dbeb', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` attribute on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d1d03d3', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\`, or a per-crumb icon with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e6b5e063', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5cc4d173', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a3d9f3bc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('f11153a1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('777da27f', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/photos" id="\${ty_escapeAttr(ty_generateId('b053ed5e', 'id'))}">\`
elements+=\`<span class="w-breadcrumb-icon" id="\${ty_escapeAttr(ty_generateId('ce980653', 'id'))}">\`
elements+=\`\uD83D\uDCF7\`
elements+=\`</span>\`
elements+=\`Photos\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('17ba7020', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8d21919e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs icon="\uD83C\uDFE0" id="\${ty_escapeAttr(ty_generateId('17e53a11', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/photos" icon="\uD83D\uDCF7" id="\${ty_escapeAttr(ty_generateId('f67ca001', 'id'))}">\`
elements+=\`Photos\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('cba6495c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2e7979fe', 'id'))}">\`
elements+=\`Color and active color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c812c873', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e1ca709', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the link color and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1f3ce016', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\` the current-page color, using DuVay palette tokens. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3928bd22', 'id'))}">\`
elements+=\`--w-breadcrumb-color\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d266d0fd', 'id'))}">\`
elements+=\`--w-breadcrumb-active-color\`
elements+=\`</code>\`
elements+=\` custom properties.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a95be91a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" style="--w-breadcrumb-color: var(--w-primary); --w-breadcrumb-active-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('284bbc65', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('da94b174', 'id'))}">\`
elements+=\`Build\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/deploy" id="\${ty_escapeAttr(ty_generateId('a3dc7879', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('3d1fe995', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f0b42677', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs color="primary" active-color="success" id="\${ty_escapeAttr(ty_generateId('07051d80', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('04bb5a3b', 'id'))}">\`
elements+=\`Build\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/deploy" id="\${ty_escapeAttr(ty_generateId('2faeae05', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('21fee46f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('765342f7', 'id'))}">\`
elements+=\`Background and rounded\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c3d435b7', 'id'))}">\`
elements+=\`Give the strip a tinted, rounded container with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4dd01e8e', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\` (a palette token) and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a8ae421', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc017a9d', 'id'))}">\`
elements+=\`w-breadcrumbs--rounded\`
elements+=\`</code>\`
elements+=\` and set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('74295fff', 'id'))}">\`
elements+=\`--w-breadcrumb-bg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3d6f5a26', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs w-breadcrumbs--rounded" aria-label="Breadcrumb" style="--w-breadcrumb-bg: var(--w-surface-container-high)" id="\${ty_escapeAttr(ty_generateId('753f541e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('95ec6b0a', 'id'))}">\`
elements+=\`Root\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/settings" id="\${ty_escapeAttr(ty_generateId('8eec6c7c', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('b93d7004', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('98b63784', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs bg-color="surface-container-high" rounded="" id="\${ty_escapeAttr(ty_generateId('8f3f2d86', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('ba8bec98', 'id'))}">\`
elements+=\`Root\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/settings" id="\${ty_escapeAttr(ty_generateId('dd88dba8', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('73793565', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('613cfe37', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('75218231', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f681f413', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('409c7806', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73232847', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`) to adjust the vertical padding. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9604bcf8', 'id'))}">\`
elements+=\`w-breadcrumbs--comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66f82930', 'id'))}">\`
elements+=\`w-breadcrumbs--compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('98e20b19', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs w-breadcrumbs--compact" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('3d725f37', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('10da2e12', 'id'))}">\`
elements+=\`One\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/two" id="\${ty_escapeAttr(ty_generateId('f919689a', 'id'))}">\`
elements+=\`Two\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('f9d91632', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('33d45c51', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs density="compact" id="\${ty_escapeAttr(ty_generateId('84c50c55', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('c5707f30', 'id'))}">\`
elements+=\`One\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/two" id="\${ty_escapeAttr(ty_generateId('a948cda6', 'id'))}">\`
elements+=\`Two\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('ffa63b8b', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('98f2228f', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d36d9e5b', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eccc843a', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` to a single \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a3cf9e35', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\` to make it non-interactive, or to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('291cbdcf', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` to disable the whole strip.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f5cc1aa0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('d1a66885', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('050f37d8', 'id'))}">\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('38a02f7d', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('9aa1a6fc', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a0712fa3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('fee99b41', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/" id="\${ty_escapeAttr(ty_generateId('8557904a', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb href="/reports" disabled="" id="\${ty_escapeAttr(ty_generateId('9b92fa45', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</w-breadcrumb>\`
elements+=\`
      \`
elements+=\`<w-breadcrumb active="" id="\${ty_escapeAttr(ty_generateId('580f92e3', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e39c8341', 'id'))}">\`
elements+=\`Custom divider element\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0735735b', 'id'))}">\`
elements+=\`For a one-off divider — an icon, a different glyph per position — place \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cad2d953', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\` between crumbs. It overrides the automatic separator for that gap; provide the divider content as its child.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('000af122', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-breadcrumbs" aria-label="Breadcrumb" id="\${ty_escapeAttr(ty_generateId('677a67e0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/" id="\${ty_escapeAttr(ty_generateId('75626b05', 'id'))}">\`
elements+=\`Home\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-sep" id="\${ty_escapeAttr(ty_generateId('0ee627e2', 'id'))}">\`
elements+=\`»\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<a class="w-breadcrumb" href="/docs" id="\${ty_escapeAttr(ty_generateId('2b8ca207', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb-sep" id="\${ty_escapeAttr(ty_generateId('04563321', 'id'))}">\`
elements+=\`»\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-breadcrumb active" aria-current="page" id="\${ty_escapeAttr(ty_generateId('fac39ec5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('44a40565', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-breadcrumbs id="\${ty_escapeAttr(ty_generateId('4b9bfb56', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item href="/" id="\${ty_escapeAttr(ty_generateId('8d708f95', 'id'))}">\`
elements+=\`Home\`
elements+=\`</w-breadcrumbs-item>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-divider id="\${ty_escapeAttr(ty_generateId('b119eee2', 'id'))}">\`
elements+=\`»\`
elements+=\`</w-breadcrumbs-divider>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item href="/docs" id="\${ty_escapeAttr(ty_generateId('547f3a49', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-breadcrumbs-item>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-divider id="\${ty_escapeAttr(ty_generateId('e021c8c1', 'id'))}">\`
elements+=\`»\`
elements+=\`</w-breadcrumbs-divider>\`
elements+=\`
      \`
elements+=\`<w-breadcrumbs-item active="" id="\${ty_escapeAttr(ty_generateId('b8695fca', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8ae52ec1', 'id'))}">\`
elements+=\`Accessibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fd880b8c', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('882313d4', 'id'))}">\`
elements+=\`aria-label="Breadcrumb"\`
elements+=\`</code>\`
elements+=\` on the wrapper and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2c87576', 'id'))}">\`
elements+=\`aria-current="page"\`
elements+=\`</code>\`
elements+=\` on the current item. The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a46bf1d', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\` component adds both automatically, marks disabled crumbs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b3bc0d9', 'id'))}">\`
elements+=\`aria-disabled\`
elements+=\`</code>\`
elements+=\`, and renders icons as \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fbf973bd', 'id'))}">\`
elements+=\`aria-hidden\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7ee63af3', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d8618650', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37b97cf2', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf9101bb', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('625a5c86', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-item&gt;\`
elements+=\`</code>\`
elements+=\` (alias of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7181c7f4', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26c6a4ee', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs-divider&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fe869852', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('f4149981', 'id'))}">\`
elements+=\`&lt;w-breadcrumbs&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc3d1ae5', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e973e258', 'id'))}">\`
elements+=\`divider\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb846fae', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3ddcce6', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b794779', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73ebf780', 'id'))}">\`
elements+=\`bg-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5162a0b0', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7586ca08', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e870d497', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('88a73fc7', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('343a1251', 'id'))}">\`
elements+=\`&lt;w-breadcrumb&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e23b60d0', 'id'))}">\`
elements+=\`href\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('41ace2be', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b926453c', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c02d85f', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/breadcrumbs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
