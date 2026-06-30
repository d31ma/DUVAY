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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('abc6b6a1', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e7581dac', 'id'))}">\`
elements+=\`Structured data grids for compact comparison and scanning workflows. DuVay tables use the same row and column primitives as the layout grid.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2f536003', 'id'))}">\`
elements+=\`Basic Table\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2382fa20', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('bc31256d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b5deb882', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('bf053d48', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-auto" id="\${ty_escapeAttr(ty_generateId('c9871f39', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--responsive-auto" id="\${ty_escapeAttr(ty_generateId('27d955fd', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('e6ffe633', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('d56154e8', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('857a7375', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('24c0d1b5', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('e7d56ae5', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('151c262c', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('3454c3bb', 'id'))}">\`
elements+=\`159\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('fb932fe9', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('8b6510f7', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('776503fb', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('69f5588d', 'id'))}">\`
elements+=\`237\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('7a878f3a', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('9edca94b', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('b26a7061', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('620771dc', 'id'))}">\`
elements+=\`262\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('ea3de740', 'id'))}">\`
elements+=\`16 g\`
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
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c5b5a57d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('67b134b8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('d293adb2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('887a2acd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" hover="" id="\${ty_escapeAttr(ty_generateId('6cc377a8', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('ad4a85d4', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('5b74a30d', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('e926a0e2', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('f84e8152', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('0f6db8f4', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('4974e235', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('d2f4130f', 'id'))}">\`
elements+=\`159\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('c4d6c7ca', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('bd1a4c83', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('2f9fdcc4', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('8ddaf136', 'id'))}">\`
elements+=\`237\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('8e0f8e62', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('a950e1bf', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('f7e3fcc5', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('499b606a', 'id'))}">\`
elements+=\`262\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('dca2a4b7', 'id'))}">\`
elements+=\`16 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('11e36a0a', 'id'))}">\`
elements+=\`Responsive Modes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7c5ef948', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4affc802', 'id'))}">\`
elements+=\`responsive="auto"\`
elements+=\`</code>\`
elements+=\` uses container queries to preserve the table on wide surfaces and stack labeled cells on narrow ones. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9028035b', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\` to force records or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e54e456', 'id'))}">\`
elements+=\`scroll\`
elements+=\`</code>\`
elements+=\` when horizontal comparison is essential. CSS-class tables use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61e6b2f5', 'id'))}">\`
elements+=\`w-table-wrap--responsive-auto\`
elements+=\`</code>\`
elements+=\`, a matching grid modifier, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a13abdc', 'id'))}">\`
elements+=\`data-label\`
elements+=\`</code>\`
elements+=\` on each data cell.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ecd7c5f5', 'id'))}">\`
elements+=\`Data Table Subcomponents\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('75533d73', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf29c3ea', 'id'))}">\`
elements+=\`w-data-table-headers\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1dfc931f', 'id'))}">\`
elements+=\`w-data-table-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db26e5e5', 'id'))}">\`
elements+=\`w-data-table-row\`
elements+=\`</code>\`
elements+=\` expose Vuetify-named table internals while still rendering with DuVay row and column primitives.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0a3b1e71', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('bf72fd54', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('77032ebc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('83d5cf81', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5b96db68', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5ffe9dab', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a96a60bf', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b43c2e93', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('cb8fc808', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('fa63a3a4', 'id'))}">\`
elements+=\`Live\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('43e9a37c', 'id'))}">\`
elements+=\`Avery\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b566e45e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('fa57c635', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('40fd3178', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-data-table-headers headers="[Name,Status,Owner]" id="\${ty_escapeAttr(ty_generateId('ffb3a1a4', 'id'))}">\`
elements+=\`</w-data-table-headers>\`
elements+=\`
        \`
elements+=\`<w-data-table-rows headers="[Name,Status,Owner]" items="[Design system|Live|Avery; Billing flow|Review|Nora]" id="\${ty_escapeAttr(ty_generateId('99b33fa1', 'id'))}">\`
elements+=\`</w-data-table-rows>\`
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
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eb2cddfd', 'id'))}">\`
elements+=\`Density and Stripes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('cfc3a5d7', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('adb46cd7', 'id'))}">\`
elements+=\`w-data-table-footer\`
elements+=\`</code>\`
elements+=\` for a Vuetify-named footer subcomponent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aa56943b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('63e03ea8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a85113d8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('4cd53cb6', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('511b371d', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense w-table-grid--striped" id="\${ty_escapeAttr(ty_generateId('6d79c99f', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('a74fe051', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('195f7cb2', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('528201f5', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('c055fdbd', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('43f347c5', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('2cf257ec', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('2a34e997', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-success" id="\${ty_escapeAttr(ty_generateId('bb517107', 'id'))}">\`
elements+=\`Live\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('0f040fe5', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('9c636f29', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('70e52521', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('793765d1', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-warning" id="\${ty_escapeAttr(ty_generateId('dcdf24e4', 'id'))}">\`
elements+=\`Review\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('b36ae499', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('0dcca3c9', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('6dc4a490', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('961063d2', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-info" id="\${ty_escapeAttr(ty_generateId('0af73cc0', 'id'))}">\`
elements+=\`Draft\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('91708bef', 'id'))}">\`
elements+=\`Mika\`
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
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8c6f53f5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('700c1e24', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('5da41c02', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('7b9c94dc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" striped="" hover="" id="\${ty_escapeAttr(ty_generateId('624dfcb0', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('0d8815b5', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('13f77f58', 'id'))}">\`
elements+=\`Name\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('80052a0d', 'id'))}">\`
elements+=\`Status\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('7edaaf07', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('6279c305', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('ae1acfc1', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('488ee0f0', 'id'))}">\`
elements+=\`<w-badge inline="" content="Live" color="success" id="\${ty_escapeAttr(ty_generateId('63c70af3', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('472cbb17', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('5724a563', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('03d7b1dd', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('8960d43e', 'id'))}">\`
elements+=\`<w-badge inline="" content="Review" color="warning" id="\${ty_escapeAttr(ty_generateId('e624f9a8', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('3b1d90bf', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('2bacac05', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('655185fd', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('03aa838b', 'id'))}">\`
elements+=\`<w-badge inline="" content="Draft" color="info" id="\${ty_escapeAttr(ty_generateId('e21bfc39', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('ce70bc0c', 'id'))}">\`
elements+=\`Mika\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4345e2c4', 'id'))}">\`
elements+=\`Fixed Header\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('34644708', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('304e2667', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('438cffc7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('897a6350', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--fixed-header" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('e233f40a', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense" id="\${ty_escapeAttr(ty_generateId('401a3995', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('b6f8fff8', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('bd3e694f', 'id'))}">\`
elements+=\`Component\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('4d9258e1', 'id'))}">\`
elements+=\`Area\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('31f7cb22', 'id'))}">\`
elements+=\`State\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a3ad9364', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('4f87860a', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7f7bc28d', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('bc3710d0', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('15948c5e', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('3335e2ed', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('3b4bf9ce', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('7b4014d8', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('3be752d4', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('f60b336d', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('96981fea', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4fa699c4', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('fb689b72', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('ab807fab', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('20e24745', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('56e13bfd', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('05a2eb45', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('7da8a230', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('670b09a5', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('25bf7f4c', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('ff4e4981', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('0e48d792', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('af7f037e', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('b4125a19', 'id'))}">\`
elements+=\`Stable\`
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
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('538b40df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('99c88859', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('2f2bce63', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('3f11d0d2', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" fixed-header="" height="180px" hover="" id="\${ty_escapeAttr(ty_generateId('ec4f7e14', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('943cd961', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('0cd6c9db', 'id'))}">\`
elements+=\`Component\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('3ac60c4f', 'id'))}">\`
elements+=\`Area\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('324e3f55', 'id'))}">\`
elements+=\`State\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('90e1375e', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('523bb1da', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('a245e709', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('d2d53476', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('42eb2df1', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('5aaacb25', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('958d8530', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('6153c334', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('f439793c', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('aa4a4557', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('5f1087df', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('8318420b', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('e86774ba', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('5bf49ffc', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('bb53f829', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('10def935', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('f3eb2b3a', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('a901566d', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('c757098a', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('28ed305d', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('b8eeaa49', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('57af4b21', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('4bb23dcc', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('dfdb430a', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tables/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
