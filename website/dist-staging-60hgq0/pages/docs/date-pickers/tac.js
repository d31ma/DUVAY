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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('b56b594a', 'id'))}">\`
elements+=\`Date Pickers\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bb836857', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed14afb8', 'id'))}">\`
elements+=\`w-date-picker\`
elements+=\`</code>\`
elements+=\` is a standalone calendar picker with title header, date/month/year views, min/max constraints, adjacent month days, and single, multiple, or range selection. For a text field that opens a picker, see \`
elements+=\`<a href="/docs/date-inputs" id="\${ty_escapeAttr(ty_generateId('ebc79e99', 'id'))}">\`
elements+=\`date inputs\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3161a86e', 'id'))}">\`
elements+=\`Date Picker\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4e255040', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-date-picker" id="\${ty_escapeAttr(ty_generateId('377bdc27', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-picker-title" id="\${ty_escapeAttr(ty_generateId('f4f13458', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('7da048f2', 'id'))}">\`
elements+=\`Select date\`
elements+=\`</span>\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('d8d8cf6c', 'id'))}">\`
elements+=\`Fri, Jun 12\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-header" id="\${ty_escapeAttr(ty_generateId('e52f635d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" aria-label="Previous month" id="\${ty_escapeAttr(ty_generateId('d0946b19', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-title" type="button" id="\${ty_escapeAttr(ty_generateId('d14cac61', 'id'))}">\`
elements+=\`June 2026\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" aria-label="Next month" id="\${ty_escapeAttr(ty_generateId('0249a0c7', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-grid" id="\${ty_escapeAttr(ty_generateId('5ca02506', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('e3acd0c4', 'id'))}">\`
elements+=\`Sun\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('04e18ece', 'id'))}">\`
elements+=\`Mon\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('357683f1', 'id'))}">\`
elements+=\`Tue\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('9be6ab75', 'id'))}">\`
elements+=\`Wed\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('ec32dada', 'id'))}">\`
elements+=\`Thu\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('0a3ac913', 'id'))}">\`
elements+=\`Fri\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('24d4a2ab', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day" type="button" id="\${ty_escapeAttr(ty_generateId('1020381d', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day selected" type="button" id="\${ty_escapeAttr(ty_generateId('5db2e249', 'id'))}">\`
elements+=\`12\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day today" type="button" id="\${ty_escapeAttr(ty_generateId('09bcea37', 'id'))}">\`
elements+=\`26\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1be9a1ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-date-picker year="2026" month="6" value="2026-06-12" min="2026-06-01" max="2026-06-30" show-adjacent-months="" id="\${ty_escapeAttr(ty_generateId('87cbe289', 'id'))}">\`
elements+=\`</w-date-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fab9cca3', 'id'))}">\`
elements+=\`Month and Year Views\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b0e1a1d8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-date-picker w-date-picker--view-months" id="\${ty_escapeAttr(ty_generateId('b41676b7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-picker-title" id="\${ty_escapeAttr(ty_generateId('fb1302d2', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('321bbdbd', 'id'))}">\`
elements+=\`Select month\`
elements+=\`</span>\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('fce4e3eb', 'id'))}">\`
elements+=\`2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-header" id="\${ty_escapeAttr(ty_generateId('0b2b48bf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" id="\${ty_escapeAttr(ty_generateId('3d369f2e', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-title" type="button" id="\${ty_escapeAttr(ty_generateId('40cffe6e', 'id'))}">\`
elements+=\`2026\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" id="\${ty_escapeAttr(ty_generateId('6bbabade', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-months" id="\${ty_escapeAttr(ty_generateId('b0f083d4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('dcd6a536', 'id'))}">\`
elements+=\`Jan\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('437da6ab', 'id'))}">\`
elements+=\`Feb\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('b5f67c80', 'id'))}">\`
elements+=\`Mar\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('d366ad1e', 'id'))}">\`
elements+=\`Apr\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('30190978', 'id'))}">\`
elements+=\`May\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month selected" id="\${ty_escapeAttr(ty_generateId('c9bfbc25', 'id'))}">\`
elements+=\`Jun\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('d0c494f0', 'id'))}">\`
elements+=\`Jul\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('cc0f4d69', 'id'))}">\`
elements+=\`Aug\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('3822c5d3', 'id'))}">\`
elements+=\`Sep\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('350f6ece', 'id'))}">\`
elements+=\`Oct\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('bf5c583d', 'id'))}">\`
elements+=\`Nov\`
elements+=\`</button>\`
elements+=\`<button class="w-date-picker-month" id="\${ty_escapeAttr(ty_generateId('ecc81133', 'id'))}">\`
elements+=\`Dec\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ae0ff313', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-date-picker year="2026" month="6" view="months" id="\${ty_escapeAttr(ty_generateId('c860dd75', 'id'))}">\`
elements+=\`</w-date-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('93871b19', 'id'))}">\`
elements+=\`Range\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1e41695f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-date-picker" id="\${ty_escapeAttr(ty_generateId('3b174353', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-picker-title" id="\${ty_escapeAttr(ty_generateId('b7ee6585', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('ad788a41', 'id'))}">\`
elements+=\`Select range\`
elements+=\`</span>\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('835f1d13', 'id'))}">\`
elements+=\`Jun 10 – Jun 14\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-header" id="\${ty_escapeAttr(ty_generateId('e469569f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" id="\${ty_escapeAttr(ty_generateId('1518c6c7', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-title" type="button" id="\${ty_escapeAttr(ty_generateId('afd8f20c', 'id'))}">\`
elements+=\`June 2026\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-nav" type="button" id="\${ty_escapeAttr(ty_generateId('8e0fb354', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-date-picker-grid" id="\${ty_escapeAttr(ty_generateId('de24457b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('1d7fcec6', 'id'))}">\`
elements+=\`Sun\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('2256a78e', 'id'))}">\`
elements+=\`Mon\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('8ff5e575', 'id'))}">\`
elements+=\`Tue\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('ab08971a', 'id'))}">\`
elements+=\`Wed\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('5e4f03ac', 'id'))}">\`
elements+=\`Thu\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('7d1f369a', 'id'))}">\`
elements+=\`Fri\`
elements+=\`</div>\`
elements+=\`<div class="w-date-picker-weekday" id="\${ty_escapeAttr(ty_generateId('118d8477', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day range-start" type="button" id="\${ty_escapeAttr(ty_generateId('e414a61c', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day in-range" type="button" id="\${ty_escapeAttr(ty_generateId('e27c70d3', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day in-range" type="button" id="\${ty_escapeAttr(ty_generateId('917dd8b3', 'id'))}">\`
elements+=\`12\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day in-range" type="button" id="\${ty_escapeAttr(ty_generateId('1d908952', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-date-picker-day range-end" type="button" id="\${ty_escapeAttr(ty_generateId('935ce941', 'id'))}">\`
elements+=\`14\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bbcc32e2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-date-picker year="2026" month="6" mode="range" value="2026-06-10,2026-06-14" id="\${ty_escapeAttr(ty_generateId('3450b9cc', 'id'))}">\`
elements+=\`</w-date-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/date-pickers/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
