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

        elements+=\`<aside id="docs-sidebar" class="docs-sidebar" data-docs-sidebar="" aria-label="Documentation navigation">\`
elements+=\`
  \`
elements+=\`<nav class="docs-sidebar-nav" aria-label="Docs" id="\${ty_escapeAttr(ty_generateId('8dd275ee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<a href="/docs" class="docs-sidebar-home" id="\${ty_escapeAttr(ty_generateId('7ecee31a', 'id'))}">\`
elements+=\`Documentation home\`
elements+=\`</a>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('562b2010', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('9ff88ec0', 'id'))}">\`
elements+=\`Getting started\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('1c49f3aa', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('d6e59b18', 'id'))}">\`
elements+=\`<a href="/docs/introduction" id="\${ty_escapeAttr(ty_generateId('70bf461d', 'id'))}">\`
elements+=\`Introduction\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('d2f235b9', 'id'))}">\`
elements+=\`<a href="/docs/install" id="\${ty_escapeAttr(ty_generateId('5c444bd6', 'id'))}">\`
elements+=\`Install\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('8926a03b', 'id'))}">\`
elements+=\`<a href="/docs/getting-started" id="\${ty_escapeAttr(ty_generateId('9d0cc913', 'id'))}">\`
elements+=\`Getting started\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('951cf5bc', 'id'))}">\`
elements+=\`<a href="/docs/download" id="\${ty_escapeAttr(ty_generateId('88dd649c', 'id'))}">\`
elements+=\`Download\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('fa907599', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('926792a5', 'id'))}">\`
elements+=\`Concepts\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('319d4f94', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('aa64781e', 'id'))}">\`
elements+=\`<a href="/docs/common-concepts" id="\${ty_escapeAttr(ty_generateId('e4707084', 'id'))}">\`
elements+=\`Common concepts\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('4bce4ad2', 'id'))}">\`
elements+=\`<a href="/docs/features" id="\${ty_escapeAttr(ty_generateId('ee7eb778', 'id'))}">\`
elements+=\`Features\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('667435c9', 'id'))}">\`
elements+=\`<a href="/docs/features/icon-fonts" id="\${ty_escapeAttr(ty_generateId('6751e5ad', 'id'))}">\`
elements+=\`Icons\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('369c816b', 'id'))}">\`
elements+=\`<a href="/docs/grid" id="\${ty_escapeAttr(ty_generateId('46b3bbc5', 'id'))}">\`
elements+=\`Grid\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('0cb8bc10', 'id'))}">\`
elements+=\`<a href="/docs/navigation" id="\${ty_escapeAttr(ty_generateId('b032562d', 'id'))}">\`
elements+=\`Navigation\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('1ac4d322', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('f0fd9cd0', 'id'))}">\`
elements+=\`Components\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('b14a2ce2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('272d54f8', 'id'))}">\`
elements+=\`<a href="/docs/components" id="\${ty_escapeAttr(ty_generateId('f9cfedc9', 'id'))}">\`
elements+=\`Components overview\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('12551f4c', 'id'))}">\`
elements+=\`<a href="/docs/alerts" id="\${ty_escapeAttr(ty_generateId('c0cf9bca', 'id'))}">\`
elements+=\`Alerts\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('d69bf29f', 'id'))}">\`
elements+=\`<a href="/docs/avatars" id="\${ty_escapeAttr(ty_generateId('3bcbcf4f', 'id'))}">\`
elements+=\`Avatars\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('7838b9e9', 'id'))}">\`
elements+=\`<a href="/docs/badges" id="\${ty_escapeAttr(ty_generateId('468f1386', 'id'))}">\`
elements+=\`Badges\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('5e3231dc', 'id'))}">\`
elements+=\`<a href="/docs/breadcrumbs" id="\${ty_escapeAttr(ty_generateId('9ece91e6', 'id'))}">\`
elements+=\`Breadcrumbs\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('fba5e810', 'id'))}">\`
elements+=\`<a href="/docs/buttons" id="\${ty_escapeAttr(ty_generateId('4fd40b34', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('04f1a00b', 'id'))}">\`
elements+=\`<a href="/docs/cards" id="\${ty_escapeAttr(ty_generateId('7fa63777', 'id'))}">\`
elements+=\`Cards\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('b5ca386a', 'id'))}">\`
elements+=\`<a href="/docs/chips" id="\${ty_escapeAttr(ty_generateId('4d80b3cc', 'id'))}">\`
elements+=\`Chips\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('8df0d545', 'id'))}">\`
elements+=\`<a href="/docs/command" id="\${ty_escapeAttr(ty_generateId('39ae8bfa', 'id'))}">\`
elements+=\`Command palette\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('73660605', 'id'))}">\`
elements+=\`<a href="/docs/dialog" id="\${ty_escapeAttr(ty_generateId('103b0f64', 'id'))}">\`
elements+=\`Dialog\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('88f9c40f', 'id'))}">\`
elements+=\`<a href="/docs/expand" id="\${ty_escapeAttr(ty_generateId('50ff222d', 'id'))}">\`
elements+=\`Expand\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('a95c72f0', 'id'))}">\`
elements+=\`<a href="/docs/feedback" id="\${ty_escapeAttr(ty_generateId('aedaea22', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('9d1520a0', 'id'))}">\`
elements+=\`<a href="/docs/inputs" id="\${ty_escapeAttr(ty_generateId('653ad017', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('8d80146c', 'id'))}">\`
elements+=\`<a href="/docs/layout-primitives" id="\${ty_escapeAttr(ty_generateId('50b1e149', 'id'))}">\`
elements+=\`Layout primitives\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('2d7f6fde', 'id'))}">\`
elements+=\`<a href="/docs/lists" id="\${ty_escapeAttr(ty_generateId('02286895', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('5490c418', 'id'))}">\`
elements+=\`<a href="/docs/menus" id="\${ty_escapeAttr(ty_generateId('e0724c17', 'id'))}">\`
elements+=\`Menus\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('e966f3db', 'id'))}">\`
elements+=\`<a href="/docs/overlays" id="\${ty_escapeAttr(ty_generateId('283a909c', 'id'))}">\`
elements+=\`Overlays\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('d9391628', 'id'))}">\`
elements+=\`<a href="/docs/color-pickers" id="\${ty_escapeAttr(ty_generateId('4f11eebf', 'id'))}">\`
elements+=\`Color Pickers\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('89f6677a', 'id'))}">\`
elements+=\`<a href="/docs/date-pickers" id="\${ty_escapeAttr(ty_generateId('444b6bfc', 'id'))}">\`
elements+=\`Date Pickers\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('b35a167e', 'id'))}">\`
elements+=\`<a href="/docs/time-pickers" id="\${ty_escapeAttr(ty_generateId('a24ba0ca', 'id'))}">\`
elements+=\`Time Pickers\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('c53dfda4', 'id'))}">\`
elements+=\`<a href="/docs/slider" id="\${ty_escapeAttr(ty_generateId('eecddc38', 'id'))}">\`
elements+=\`Slider\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('4063aca6', 'id'))}">\`
elements+=\`<a href="/docs/snackbar" id="\${ty_escapeAttr(ty_generateId('2c394c8d', 'id'))}">\`
elements+=\`Snackbar\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('f025ae78', 'id'))}">\`
elements+=\`<a href="/docs/surfaces" id="\${ty_escapeAttr(ty_generateId('3974f99b', 'id'))}">\`
elements+=\`Surfaces\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('c8e1c1fd', 'id'))}">\`
elements+=\`<a href="/docs/tables" id="\${ty_escapeAttr(ty_generateId('5e30b5a9', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('a29c1cde', 'id'))}">\`
elements+=\`<a href="/docs/tabs" id="\${ty_escapeAttr(ty_generateId('ada4458e', 'id'))}">\`
elements+=\`Tabs\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('408dc100', 'id'))}">\`
elements+=\`<a href="/docs/tooltips" id="\${ty_escapeAttr(ty_generateId('dc097be4', 'id'))}">\`
elements+=\`Tooltips\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('799590e2', 'id'))}">\`
elements+=\`<a href="/docs/workflows" id="\${ty_escapeAttr(ty_generateId('c8299208', 'id'))}">\`
elements+=\`Workflows\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('ab848550', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('629f195f', 'id'))}">\`
elements+=\`Styles &amp; motion\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('7800264e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('dd69446b', 'id'))}">\`
elements+=\`<a href="/docs/themes" id="\${ty_escapeAttr(ty_generateId('31b16c38', 'id'))}">\`
elements+=\`Themes\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('758b007b', 'id'))}">\`
elements+=\`<a href="/docs/utilities" id="\${ty_escapeAttr(ty_generateId('9581b67a', 'id'))}">\`
elements+=\`Utilities\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('0d797f1d', 'id'))}">\`
elements+=\`<a href="/docs/styles-and-animations" id="\${ty_escapeAttr(ty_generateId('36f92405', 'id'))}">\`
elements+=\`Styles and animations\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('351a4a4e', 'id'))}">\`
elements+=\`<a href="/docs/animations" id="\${ty_escapeAttr(ty_generateId('da706df4', 'id'))}">\`
elements+=\`Animations\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('ae1239b0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('7a95dd38', 'id'))}">\`
elements+=\`Reference\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('79b1f469', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('dd38f503', 'id'))}">\`
elements+=\`<a href="/docs/api" id="\${ty_escapeAttr(ty_generateId('fc42ab8b', 'id'))}">\`
elements+=\`API\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('538daca0', 'id'))}">\`
elements+=\`<a href="/docs/directives" id="\${ty_escapeAttr(ty_generateId('2b15a390', 'id'))}">\`
elements+=\`Directives\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('3f949783', 'id'))}">\`
elements+=\`<a href="/docs/labs" id="\${ty_escapeAttr(ty_generateId('2ae678f3', 'id'))}">\`
elements+=\`Labs\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('fddaf8f5', 'id'))}">\`
elements+=\`<a href="/docs/resources" id="\${ty_escapeAttr(ty_generateId('d8ca39ee', 'id'))}">\`
elements+=\`Resources\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('7bd4be57', 'id'))}">\`
elements+=\`<a href="/docs/roadmap" id="\${ty_escapeAttr(ty_generateId('fc933cfa', 'id'))}">\`
elements+=\`Roadmap\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`

    \`
elements+=\`<section class="docs-sidebar-section" id="\${ty_escapeAttr(ty_generateId('e32d0df3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 class="docs-sidebar-subhead" id="\${ty_escapeAttr(ty_generateId('702fe864', 'id'))}">\`
elements+=\`About\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<ul class="docs-sidebar-list" id="\${ty_escapeAttr(ty_generateId('a73a5156', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('dc1e8c5c', 'id'))}">\`
elements+=\`<a href="/docs/about" id="\${ty_escapeAttr(ty_generateId('58cb06f4', 'id'))}">\`
elements+=\`About DuVay\`
elements+=\`</a>\`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</section>\`
elements+=\`
  \`
elements+=\`</nav>\`
elements+=\`
\`
elements+=\`</aside>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/components/doc/sidebar/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
