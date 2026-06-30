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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('2c4d9d12', 'id'))}">\`
elements+=\`Expansion Panels\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bffbe0da', 'id'))}">\`
elements+=\`Collapsible sections for progressive disclosure of content. Panels support grouped selection, mandatory state, and Vuetify-style visual variants.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('401a0b8c', 'id'))}">\`
elements+=\`Basic Panel\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6ef15e70', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-accordion w-expansion-panels w-accordion--variant-default" id="\${ty_escapeAttr(ty_generateId('53903e37', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-expand open" id="\${ty_escapeAttr(ty_generateId('1d7efa21', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" data-w-expand-toggle="" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('8f128deb', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('8934f29a', 'id'))}">\`
elements+=\`What is DuVay?\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-expansion-panel-title__icon" id="\${ty_escapeAttr(ty_generateId('976951f4', 'id'))}">\`
elements+=\`
            \`
elements+=\`<svg class="w-expand-chevron" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" id="\${ty_escapeAttr(ty_generateId('6aa48718', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('01f49969', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('bd6ae4a9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('e2b0bfa0', 'id'))}">\`
elements+=\`
            \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('43ca124a', 'id'))}">\`
elements+=\`DuVay is a zero-dependency CSS framework for building polished interfaces with tokens, utilities, and Light-DOM web components.\`
elements+=\`</p>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c0f7e2f4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels value="intro" id="\${ty_escapeAttr(ty_generateId('d54ea1b3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="intro" title="What is DuVay?" text="DuVay is a zero-dependency CSS framework for building polished interfaces with tokens, utilities, and Light-DOM web components." id="\${ty_escapeAttr(ty_generateId('2aa5e06b', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8704241b', 'id'))}">\`
elements+=\`Grouped Panels\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('449a8b0e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-accordion w-expansion-panels w-accordion--variant-accordion" id="\${ty_escapeAttr(ty_generateId('df464f0c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-expand open" id="\${ty_escapeAttr(ty_generateId('e0a9797d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" data-w-expand-toggle="" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('9bc95084', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('b60f283d', 'id'))}">\`
elements+=\`Installation\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-expansion-panel-title__icon" id="\${ty_escapeAttr(ty_generateId('96566a13', 'id'))}">\`
elements+=\`<svg class="w-expand-chevron" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" id="\${ty_escapeAttr(ty_generateId('f53f1ae5', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('5b682901', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('fe98a5c9', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('9d03be0b', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('082040a2', 'id'))}">\`
elements+=\`Include duvay.css and optionally duvay-wc.js for the custom elements.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-expand" id="\${ty_escapeAttr(ty_generateId('97ed0cec', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" data-w-expand-toggle="" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('9c208f63', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('adf138a2', 'id'))}">\`
elements+=\`Customization\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-expansion-panel-title__icon" id="\${ty_escapeAttr(ty_generateId('53bda2d4', 'id'))}">\`
elements+=\`<svg class="w-expand-chevron" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" id="\${ty_escapeAttr(ty_generateId('d2ad3e16', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('366de52f', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('627d00dd', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('3f1930eb', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('59e841eb', 'id'))}">\`
elements+=\`Override CSS variables or theme attributes to tune color, density, radius, and elevation.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-expand" id="\${ty_escapeAttr(ty_generateId('20933573', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" data-w-expand-toggle="" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('d64bc526', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('1e226d6f', 'id'))}">\`
elements+=\`Accessibility\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-expansion-panel-title__icon" id="\${ty_escapeAttr(ty_generateId('12924c0c', 'id'))}">\`
elements+=\`<svg class="w-expand-chevron" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" id="\${ty_escapeAttr(ty_generateId('f353e161', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('5fc62c77', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('f433a955', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('28e51ebd', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('400ef9a6', 'id'))}">\`
elements+=\`Headers are buttons with visible focus states and expanded state communicated through ARIA.\`
elements+=\`</p>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9bced168', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels variant="accordion" value="install" id="\${ty_escapeAttr(ty_generateId('b7960a8d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="install" title="Installation" text="Include duvay.css and optionally duvay-wc.js for the custom elements." id="\${ty_escapeAttr(ty_generateId('c32179d7', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="customize" title="Customization" text="Override CSS variables or theme attributes to tune color, density, radius, and elevation." id="\${ty_escapeAttr(ty_generateId('c913dbe6', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="a11y" title="Accessibility" text="Headers are buttons with visible focus states and expanded state communicated through ARIA." id="\${ty_escapeAttr(ty_generateId('1eb87e0b', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('35fbe4cf', 'id'))}">\`
elements+=\`Multiple Selection\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('07a1e03b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-accordion w-expansion-panels w-accordion--variant-default" id="\${ty_escapeAttr(ty_generateId('cd699217', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-expand open" id="\${ty_escapeAttr(ty_generateId('d160b4fc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('1b0cefd2', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('9ea9e0c0', 'id'))}">\`
elements+=\`Planning\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('afb60bb2', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('87d9bdec', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dd9f2093', 'id'))}">\`
elements+=\`Multiple panels can stay open together.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-expand open" id="\${ty_escapeAttr(ty_generateId('1f46e59a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('32e00673', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('8cad4abf', 'id'))}">\`
elements+=\`Delivery\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('df11b273', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('3fc3ecb2', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5ab052db', 'id'))}">\`
elements+=\`Omit mandatory when every panel should be allowed to close.\`
elements+=\`</p>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('19cffdaf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels multiple="" value="planning,delivery" id="\${ty_escapeAttr(ty_generateId('9b527993', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="planning" title="Planning" text="Multiple panels can stay open together." id="\${ty_escapeAttr(ty_generateId('fe6a9591', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="delivery" title="Delivery" text="Omit mandatory when every panel should be allowed to close." id="\${ty_escapeAttr(ty_generateId('448d280c', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="handoff" title="Handoff" text="Use value attributes to synchronize selection state." id="\${ty_escapeAttr(ty_generateId('135a747d', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('672dd978', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('88cf8f1b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-accordion w-expansion-panels w-accordion--variant-popout" style="--w-expansion-gap:12px" id="\${ty_escapeAttr(ty_generateId('61ebb6b7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-expand open" id="\${ty_escapeAttr(ty_generateId('ded2fb33', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('31a34e74', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('26bd3f3d', 'id'))}">\`
elements+=\`Popout panel\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('f53a91ae', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('08b15c0a', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('93e704cd', 'id'))}">\`
elements+=\`Active popout panels expand to the full row width.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-expand" id="\${ty_escapeAttr(ty_generateId('fda9fcaf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('9caa7329', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('b85c1540', 'id'))}">\`
elements+=\`Inset panel\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('2d61fce6', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('f24951df', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4371579e', 'id'))}">\`
elements+=\`Use inset when the open item should tuck inward.\`
elements+=\`</p>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0d896e7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels variant="popout" gap="12" value="popout" id="\${ty_escapeAttr(ty_generateId('a5b78393', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="popout" title="Popout panel" text="Active popout panels expand to the full row width." id="\${ty_escapeAttr(ty_generateId('deea846d', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel value="inset" title="Inset panel" text="Use inset when the open item should tuck inward." id="\${ty_escapeAttr(ty_generateId('3f922423', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fa52ff1a', 'id'))}">\`
elements+=\`Readonly and Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2bc179a6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-accordion w-expansion-panels w-accordion--variant-default" id="\${ty_escapeAttr(ty_generateId('5b8738eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-expand open w-expand--readonly w-expand--hide-actions" id="\${ty_escapeAttr(ty_generateId('14a06caa', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" aria-expanded="true" aria-readonly="true" id="\${ty_escapeAttr(ty_generateId('c71cfe45', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('ea81dedf', 'id'))}">\`
elements+=\`Readonly open panel\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('16320c8b', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('e5813482', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c128ec30', 'id'))}">\`
elements+=\`Readonly panels communicate state without allowing toggles.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-expand w-expand--disabled" id="\${ty_escapeAttr(ty_generateId('db84bf05', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-expand-header" disabled="" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('3126674e', 'id'))}">\`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('e41b760e', 'id'))}">\`
elements+=\`Disabled panel\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('7c8675f9', 'id'))}">\`
elements+=\`<div class="w-expansion-panel-text__wrapper" id="\${ty_escapeAttr(ty_generateId('6b85f06d', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cf3779cc', 'id'))}">\`
elements+=\`Disabled titles are unavailable to interaction.\`
elements+=\`</p>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('76c757c9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels id="\${ty_escapeAttr(ty_generateId('065b7f22', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel title="Readonly open panel" text="Readonly panels communicate state without allowing toggles." open="" readonly="" hide-actions="" id="\${ty_escapeAttr(ty_generateId('986f6aa4', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
      \`
elements+=\`<w-expansion-panel title="Disabled panel" text="Disabled titles are unavailable to interaction." disabled="" id="\${ty_escapeAttr(ty_generateId('0f8955d3', 'id'))}">\`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/expand/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
