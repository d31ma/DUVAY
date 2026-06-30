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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('ba94db6b', 'id'))}">\`
elements+=\`Calendars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4978d403', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ebe1938', 'id'))}">\`
elements+=\`w-calendar\`
elements+=\`</code>\`
elements+=\` is a responsive scheduling surface for month, week, day, four-day, custom, and category views. It accepts event and category arrays, renders all-day and timed events, and exposes a vanilla JavaScript API with native event names.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2e773080', 'id'))}">\`
elements+=\`Month\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('af990dc2', 'id'))}">\`
elements+=\`The month view displays all-day and timed events across a complete calendar grid. Select a date, use the header controls, or call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40b33954', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('968763dd', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('302ee1c8', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f1d94a4a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<section class="w-calendar w-calendar--month" id="\${ty_escapeAttr(ty_generateId('a75f34fb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('0a22fa7f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-header__nav" id="\${ty_escapeAttr(ty_generateId('ab6792d4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Previous period" id="\${ty_escapeAttr(ty_generateId('310b9d0c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-today" type="button" id="\${ty_escapeAttr(ty_generateId('56844ffe', 'id'))}">\`
elements+=\`Today\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Next period" id="\${ty_escapeAttr(ty_generateId('50785a4a', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('f64de9e8', 'id'))}">\`
elements+=\`June 2026\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-month" role="grid" id="\${ty_escapeAttr(ty_generateId('21aec590', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-weekdays" role="row" id="\${ty_escapeAttr(ty_generateId('e4f61251', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('c9b5b0f9', 'id'))}">\`
elements+=\`Sun\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('a288d431', 'id'))}">\`
elements+=\`Mon\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('f7b59a9f', 'id'))}">\`
elements+=\`Tue\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('0adbf411', 'id'))}">\`
elements+=\`Wed\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('b2ccc66c', 'id'))}">\`
elements+=\`Thu\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('eef5377e', 'id'))}">\`
elements+=\`Fri\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('02747194', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-week" role="row" id="\${ty_escapeAttr(ty_generateId('2de9598d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day outside" id="\${ty_escapeAttr(ty_generateId('836e777a', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('0fbdd71a', 'id'))}">\`
elements+=\`31\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('c4194c6a', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('85729a3a', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('ec4ca87c', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('f9b64200', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('92c3f5c5', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('1a408b6e', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('11b08c9e', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('1ce6188e', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('7558fdfc', 'id'))}">\`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-primary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('787913e2', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('d9bd2559', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('b94c2be7', 'id'))}">\`
elements+=\`5\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('d1863f19', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('d4a38ebb', 'id'))}">\`
elements+=\`6\`
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
elements+=\`</section>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e21c7582', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" now="2026-06-27 10:30" event-color="color" events="[{&quot;name&quot;:&quot;Design review&quot;,&quot;start&quot;:&quot;2026-06-04 09:00&quot;,&quot;end&quot;:&quot;2026-06-04 10:30&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Release window&quot;,&quot;start&quot;:&quot;2026-06-13&quot;,&quot;end&quot;:&quot;2026-06-13&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Conference&quot;,&quot;start&quot;:&quot;2026-06-18&quot;,&quot;end&quot;:&quot;2026-06-20&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('bbdcb692', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c9258c58', 'id'))}">\`
elements+=\`Week\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0e449fbf', 'id'))}">\`
elements+=\`Week views combine an all-day row with a scrollable interval grid. Timed events are positioned from their start and end values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('af0f3f3d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--week" id="\${ty_escapeAttr(ty_generateId('ad02f903', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:3;--w-calendar-interval-height:3rem;--w-calendar-interval-width:3.75rem" id="\${ty_escapeAttr(ty_generateId('e2255186', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('ccdb2804', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('80126beb', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('1c1a4bb7', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('55d5fdc9', 'id'))}">\`
elements+=\`Mon \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('aa0e632e', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('c7889d84', 'id'))}">\`
elements+=\`Tue \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('0ec7f6f9', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('84ce9f8e', 'id'))}">\`
elements+=\`Wed \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('61c5a6c7', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('02b08936', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('bf8dafc1', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('c959128b', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('21ada3a4', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('0f0d3780', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('50ac6c92', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('e933c28d', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('79561e2f', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('e8d61535', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('b49ce9a6', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('938b6e00', 'id'))}">\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d392d830', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="week" value="2026-06-10" first-interval="8" interval-count="11" interval-highlight="" event-color="color" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-08 09:00&quot;,&quot;end&quot;:&quot;2026-06-08 10:00&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Lunch&quot;,&quot;start&quot;:&quot;2026-06-10 12:00&quot;,&quot;end&quot;:&quot;2026-06-10 13:00&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Launch&quot;,&quot;start&quot;:&quot;2026-06-11&quot;,&quot;end&quot;:&quot;2026-06-11&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('befe08b7', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('585ef01d', 'id'))}">\`
elements+=\`Day and Four-day\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('db099d23', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2576d8ca', 'id'))}">\`
elements+=\`day\`
elements+=\`</code>\`
elements+=\` for a focused agenda or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ddefe4fa', 'id'))}">\`
elements+=\`4day\`
elements+=\`</code>\`
elements+=\` for a compact multi-day planner. The same interval and event attributes apply to both.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f93fefc5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid" id="\${ty_escapeAttr(ty_generateId('02a22931', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b3ae76c0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('7fd96ca6', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('2f46f74f', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('df4ca8e4', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('51809242', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('e16f2b03', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day" id="\${ty_escapeAttr(ty_generateId('d0a6346c', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-label" id="\${ty_escapeAttr(ty_generateId('7ef6c391', 'id'))}">\`
elements+=\`All day\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-all-day-cells" id="\${ty_escapeAttr(ty_generateId('ae8e6b36', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-cell" id="\${ty_escapeAttr(ty_generateId('0bad48e7', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('ec397aa6', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--4day" id="\${ty_escapeAttr(ty_generateId('67023ba7', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('d1ae0f0a', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('8f11df8d', 'id'))}">\`
elements+=\`Jun 13–16, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('60b82d8a', 'id'))}">\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('e756ccd2', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('9d0caf10', 'id'))}">\`
elements+=\`Sat 13\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('0f0fb32c', 'id'))}">\`
elements+=\`Sun 14\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('3df89ac2', 'id'))}">\`
elements+=\`Mon 15\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('b22fdea2', 'id'))}">\`
elements+=\`Tue 16\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b17f11dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a4c615ce', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="8" interval-count="10" format="24hr" interval-highlight="" id="\${ty_escapeAttr(ty_generateId('9cf4732c', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="4day" value="2026-06-13" first-interval="8" interval-count="10" interval-height="40" id="\${ty_escapeAttr(ty_generateId('f5a40216', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2b7864aa', 'id'))}">\`
elements+=\`Weekdays, Locale, and Week Numbers\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('798cbb31', 'id'))}">\`
elements+=\`Choose visible days with a JSON \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d7963b67', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\` array, rotate them with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fd28780', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`, localize labels, and add ISO-style week numbers.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3d90827', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--month w-calendar--show-week" id="\${ty_escapeAttr(ty_generateId('71e4e2d4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-weekdays" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('a8cf1518', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('ba5a1e33', 'id'))}">\`
elements+=\`#\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('e70f5780', 'id'))}">\`
elements+=\`Monday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('dd880d6e', 'id'))}">\`
elements+=\`Tuesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('f7d69ad6', 'id'))}">\`
elements+=\`Wednesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('2e5eb7c3', 'id'))}">\`
elements+=\`Thursday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('2c07de7a', 'id'))}">\`
elements+=\`Friday\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-week" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('f3dc16a2', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('e9278b81', 'id'))}">\`
elements+=\`24\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('84f7a6dd', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('1a5c0bb0', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('f41e33ea', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('20d54d93', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('8c9d539c', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('8835da79', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('abaf5e24', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('2e5bed09', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('59aafc47', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('591806c3', 'id'))}">\`
elements+=\`12\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0ffc50e1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" weekdays="[1,2,3,4,5]" first-day-of-week="1" first-day-of-year="4" short-weekdays="false" show-week="" locale="en-CA" id="\${ty_escapeAttr(ty_generateId('5f979adf', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('19db343d', 'id'))}">\`
elements+=\`Intervals and Clock Format\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9dfcb6ce', 'id'))}">\`
elements+=\`Control the visible schedule with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0eab1eb7', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa2fff7c', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d7ce473', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6193dac7', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8745484', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e63362ca', 'id'))}">\`
elements+=\`format\`
elements+=\`</code>\`
elements+=\`. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c444e3ff', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\` overrides \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a8e392c', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a4abc3c6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('c1e1441b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1;--w-calendar-interval-height:2.5rem;--w-calendar-interval-width:4.5rem" id="\${ty_escapeAttr(ty_generateId('1120114e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('8fdffa45', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('b6f8149d', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('da25acde', 'id'))}">\`
elements+=\`08:30\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('935c3c60', 'id'))}">\`
elements+=\`09:00\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('dc95116a', 'id'))}">\`
elements+=\`09:30\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('9d6f039b', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('22f97249', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('ef9d986e', 'id'))}">\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('303ba800', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('782077bc', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('378917f3', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('641bd1d3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-time="08:30" interval-count="12" interval-minutes="30" interval-height="40" interval-width="72" format="24hr" interval-highlight="" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 09:30&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('10557d91', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('24764341', 'id'))}">\`
elements+=\`Categories\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('29a1ba58', 'id'))}">\`
elements+=\`The category view compares schedules side by side. Categories accept a JSON string or a JavaScript array; events map through \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3df0a0e', 'id'))}">\`
elements+=\`event-category\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('352efb0f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--category" id="\${ty_escapeAttr(ty_generateId('b0755ffe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule w-calendar-category" style="--w-calendar-days:2" id="\${ty_escapeAttr(ty_generateId('35b281a5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('4b200c0e', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('0094df8f', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-headers" id="\${ty_escapeAttr(ty_generateId('efded546', 'id'))}">\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('3110b842', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('b5ae957c', 'id'))}">\`
elements+=\`Design\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('88e16f7b', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('90a71363', 'id'))}">\`
elements+=\`Operations\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-category-columns" id="\${ty_escapeAttr(ty_generateId('f419fb90', 'id'))}">\`
elements+=\`<div class="w-calendar-category-column" data-category="Design" id="\${ty_escapeAttr(ty_generateId('5da5755a', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-column" data-category="Operations" id="\${ty_escapeAttr(ty_generateId('be32dde2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ef8101f7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="category" value="2026-06-13" categories="[&quot;Design&quot;,&quot;Operations&quot;]" category-show-all="" first-interval="8" interval-count="11" event-color="color" events="[{&quot;name&quot;:&quot;Wireframes&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:30&quot;,&quot;category&quot;:&quot;Design&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Deploy&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;,&quot;category&quot;:&quot;Operations&quot;,&quot;color&quot;:&quot;success&quot;}]" id="\${ty_escapeAttr(ty_generateId('851a878c', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7a31d5f2', 'id'))}">\`
elements+=\`Custom Ranges\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('be44bb0c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('04e349df', 'id'))}">\`
elements+=\`custom-weekly\`
elements+=\`</code>\`
elements+=\` renders week rows between explicit dates; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0056399a', 'id'))}">\`
elements+=\`custom-daily\`
elements+=\`</code>\`
elements+=\` renders interval columns. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fe5b7ee', 'id'))}">\`
elements+=\`max-days\`
elements+=\`</code>\`
elements+=\` caps open-ended daily ranges.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d086aff1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('29e32247', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-weekly" id="\${ty_escapeAttr(ty_generateId('feb37606', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('e988d257', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('4113e0fa', 'id'))}">\`
elements+=\`Jun 8 – Jun 19, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('5fe63cab', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('3526d856', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-daily" id="\${ty_escapeAttr(ty_generateId('ed837f7b', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('553d547f', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('a012b636', 'id'))}">\`
elements+=\`Jun 8–10, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" style="--w-calendar-days:3" id="\${ty_escapeAttr(ty_generateId('af8b494e', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('8f5ab196', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('ff531332', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('61239a02', 'id'))}">\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7c6f0124', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('54a243ad', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-weekly" value="2026-06-08" start="2026-06-08" end="2026-06-19" first-day-of-week="1" id="\${ty_escapeAttr(ty_generateId('51718a1a', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-daily" value="2026-06-08" start="2026-06-08" end="2026-06-10" first-interval="8" interval-count="8" id="\${ty_escapeAttr(ty_generateId('69e3c575', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a803dd11', 'id'))}">\`
elements+=\`Event Mapping and Overflow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('395c1d13', 'id'))}">\`
elements+=\`Map alternative event fields with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b7b520d6', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('83aa55a1', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('faf2a20f', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ddd60ee', 'id'))}">\`
elements+=\`event-timed\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77bded52', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`. Month cells show three events before a configurable “more” action.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('81909bff', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar-day selected" id="\${ty_escapeAttr(ty_generateId('e7ee994a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('8caa9a9f', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('c657b726', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:#155e75;--w-calendar-event-text:#fff" id="\${ty_escapeAttr(ty_generateId('4f334a33', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-success);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('f826fc8f', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-tertiary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('16365278', 'id'))}">\`
elements+=\`Retrospective\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-more" type="button" id="\${ty_escapeAttr(ty_generateId('6a96e9be', 'id'))}">\`
elements+=\`2 additional\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('66dd9a4c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" event-name="title" event-start="begins" event-end="finishes" event-color="tone" event-more-text="&#123;count&#125; additional" events="[{&quot;title&quot;:&quot;Design review&quot;,&quot;begins&quot;:&quot;2026-06-13 09:00&quot;,&quot;finishes&quot;:&quot;2026-06-13 10:00&quot;,&quot;tone&quot;:&quot;#155e75&quot;},{&quot;title&quot;:&quot;Launch&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;success&quot;},{&quot;title&quot;:&quot;Retrospective&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;tertiary&quot;},{&quot;title&quot;:&quot;Planning&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;primary&quot;},{&quot;title&quot;:&quot;Handoff&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;secondary&quot;}]" id="\${ty_escapeAttr(ty_generateId('21ba7c54', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('adadd101', 'id'))}">\`
elements+=\`Custom Content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dc6bfb6b', 'id'))}">\`
elements+=\`Vue slots become framework-neutral rendering callbacks in DuVay. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2aa9dd27', 'id'))}">\`
elements+=\`dayContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca2d188f', 'id'))}">\`
elements+=\`dayHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2dd48a7e', 'id'))}">\`
elements+=\`dayBodyContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6448408', 'id'))}">\`
elements+=\`intervalContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dfa43fc8', 'id'))}">\`
elements+=\`intervalHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c787b0f', 'id'))}">\`
elements+=\`eventContent\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95a0bad0', 'id'))}">\`
elements+=\`categoryContent\`
elements+=\`</code>\`
elements+=\` to return application-owned markup.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('23ade242', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('c08daeed', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('1afb9c97', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('3c0d3228', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('5a6bb059', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('69206630', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('89d8f95e', 'id'))}">\`
elements+=\`Time\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('5d6ee439', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('83f03301', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('d4d4bd42', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</span>\`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('7182869b', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-header-content" id="\${ty_escapeAttr(ty_generateId('3075ede1', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('75a35ecd', 'id'))}">\`
elements+=\`Focus day\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('42b1fe5a', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('8edd1e6b', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('daa33436', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('2ff67205', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('5082703e', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('27ab9eaf', 'id'))}">\`
elements+=\`<span class="w-calendar-interval-content" id="\${ty_escapeAttr(ty_generateId('e9212db8', 'id'))}">\`
elements+=\`9 o'clock\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-body-content" id="\${ty_escapeAttr(ty_generateId('18e8028d', 'id'))}">\`
elements+=\`<span class="w-calendar-current-time" style="top:24px" id="\${ty_escapeAttr(ty_generateId('c7abc74b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3593ec7d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar data-calendar-custom-content="" type="day" value="2026-06-13" now="2026-06-13 09:30" first-interval="9" interval-count="4" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('76cb5683', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5e97ad73', 'id'))}">\`
elements+=\`Native Drag and Drop\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('93fb1909', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('683860cf', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\` makes event controls draggable. Dropping a timed event onto an interval preserves its duration, updates the source event, and emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f3cc21c2', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b68d5e9', 'id'))}">\`
elements+=\`reason: "event-drop"\`
elements+=\`</code>\`
elements+=\`. Native drag events continue to bubble for application-specific behavior.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f6be0653', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('13d6e99a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('66bc8075', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('f0844a12', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('e9cf4223', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('12be955d', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('c7f2634b', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('3297ba6e', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('e828423b', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('d5ffad12', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('4bee9be4', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('1932b5d3', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-timed-events" id="\${ty_escapeAttr(ty_generateId('f0188830', 'id'))}">\`
elements+=\`<button class="w-calendar-event w-calendar-event--timed" draggable="true" style="top:0;height:48px" id="\${ty_escapeAttr(ty_generateId('be298c4d', 'id'))}">\`
elements+=\`9 AM Planning\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ae71b1dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="9" interval-count="6" interval-highlight="" event-draggable="" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:00&quot;},{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 11:00&quot;,&quot;end&quot;:&quot;2026-06-13 12:30&quot;}]" id="\${ty_escapeAttr(ty_generateId('b09312a4', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('38e0114d', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('de21a1c8', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('295b0163', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('86b82df7', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('102989fc', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a0e5e78d', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8ee298d2', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('736ddb13', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('87211851', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('b81094df', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8f2f0f81', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('143ceda1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c4b9ee1', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ce4944f2', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('802cda8d', 'id'))}">\`
elements+=\`today\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7b6a8a36', 'id'))}">\`
elements+=\`Active date and navigation anchor.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('de8e8bc0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9654fa04', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c86e2180', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('35cf79ce', 'id'))}">\`
elements+=\`month | week | day | 4day | custom-weekly | custom-daily | category\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('51eed6a8', 'id'))}">\`
elements+=\`month\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5f66b542', 'id'))}">\`
elements+=\`Calendar view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('31e54f87', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('784f5cca', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('74a4bf47', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd4df133', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('99f406f2', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('529553ff', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('393e035e', 'id'))}">\`
elements+=\`Inclusive range for custom views.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dfce4092', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('77a5e50d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ce626e7', 'id'))}">\`
elements+=\`month\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e9fd393', 'id'))}">\`
elements+=\`year\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4ee356c8', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e52863c', 'id'))}">\`
elements+=\`from value\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('48762ecc', 'id'))}">\`
elements+=\`Legacy displayed-month overrides.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f951de1d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a0df6f42', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ca79a1f', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd194d72', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('adeeccf0', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f9f88791', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eea5ad5a', 'id'))}">\`
elements+=\`Selectable date bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4e36d19a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d7280c4d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc351e1d', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3295289b', 'id'))}">\`
elements+=\`JSON array&lt;0–6&gt;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0497618d', 'id'))}">\`
elements+=\`[0,1,2,3,4,5,6]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70158ecc', 'id'))}">\`
elements+=\`Visible weekdays; Sunday is 0.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c3ee296d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e42007a3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a864f307', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3363b07', 'id'))}">\`
elements+=\`0–6\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('43e433d6', 'id'))}">\`
elements+=\`0\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fed59f7a', 'id'))}">\`
elements+=\`First weekday column.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('096c2c1b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0bb8feb9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('13e79077', 'id'))}">\`
elements+=\`first-day-of-year\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fc960051', 'id'))}">\`
elements+=\`1–7\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2595cc1', 'id'))}">\`
elements+=\`4\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c49820ee', 'id'))}">\`
elements+=\`Week-number rule.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('53f09f08', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9e1a108', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1cd482c5', 'id'))}">\`
elements+=\`locale\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7535859c', 'id'))}">\`
elements+=\`BCP 47 locale\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06e1ac25', 'id'))}">\`
elements+=\`document language\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cb05b45f', 'id'))}">\`
elements+=\`Labels and times.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5af5bc97', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('73440800', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1c098c3', 'id'))}">\`
elements+=\`now\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3868632e', 'id'))}">\`
elements+=\`date or datetime\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('341fb68d', 'id'))}">\`
elements+=\`system now\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('15c4155b', 'id'))}">\`
elements+=\`Overrides today/current-time styling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('08bbec4e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0d4b4635', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('638f96c0', 'id'))}">\`
elements+=\`format\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f59c510', 'id'))}">\`
elements+=\`ampm | 24hr\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1424f853', 'id'))}">\`
elements+=\`locale\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e3bb1a6', 'id'))}">\`
elements+=\`Clock convention.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2c75925b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8232187c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e1f94c9e', 'id'))}">\`
elements+=\`short-weekdays\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c6ad572', 'id'))}">\`
elements+=\`short-months\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5d9f8bfd', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ae7ea9ac', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abf72eff', 'id'))}">\`
elements+=\`Use abbreviated labels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('04afbd96', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b951bbd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7ed756d4', 'id'))}">\`
elements+=\`show-month-on-first\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('763e1b90', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('01551437', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e35c9e58', 'id'))}">\`
elements+=\`Prefix the first day with its month.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2478d4f5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c9954dd2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d6fbdc28', 'id'))}">\`
elements+=\`show-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a051edd8', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('978918b5', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('368bcd82', 'id'))}">\`
elements+=\`Show week numbers in month/custom-weekly views.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4cc6437c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('746410d5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd5b4b4f', 'id'))}">\`
elements+=\`hide-header\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61fb6506', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('47cc296e', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1a26722a', 'id'))}">\`
elements+=\`Hide title and navigation controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e98c33c8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b33b1a2a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c88fcfe4', 'id'))}">\`
elements+=\`min-weeks\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59c59d99', 'id'))}">\`
elements+=\`max-days\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4820d531', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0f8acd11', 'id'))}">\`
elements+=\`1 / 7\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abeed798', 'id'))}">\`
elements+=\`Minimum month rows and custom-daily cap.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c92e89fa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9283b50e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cadf03dd', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2cb00665', 'id'))}">\`
elements+=\`JSON array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('95bdcd0a', 'id'))}">\`
elements+=\`[]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('124d091c', 'id'))}">\`
elements+=\`Event records; JavaScript arrays can also be assigned to the property.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9bb50f1b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('39fcc173', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3edf8075', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b72df09', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('478a0ad2', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d87733e4', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3ea73de', 'id'))}">\`
elements+=\`start / end / name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('876b4de4', 'id'))}">\`
elements+=\`Event field mappings.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('64499479', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b5ff8b49', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90f474d9', 'id'))}">\`
elements+=\`event-timed\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8edc2918', 'id'))}">\`
elements+=\`event-category\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('056ed19d', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ccecba55', 'id'))}">\`
elements+=\`timed / category\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61aeca53', 'id'))}">\`
elements+=\`Timed and category field mappings.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('45ecd6ce', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13eb2e50', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3621b06', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2180d071', 'id'))}">\`
elements+=\`event-text-color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('97b2497a', 'id'))}">\`
elements+=\`token, CSS color, or field name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('32224243', 'id'))}">\`
elements+=\`primary / on-primary\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9354b7e6', 'id'))}">\`
elements+=\`Event colors.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('631f83cd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6eb648f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('460525a1', 'id'))}">\`
elements+=\`event-height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2a6b666', 'id'))}">\`
elements+=\`event-margin-bottom\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('22194b48', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('65334005', 'id'))}">\`
elements+=\`20 / 1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b9109786', 'id'))}">\`
elements+=\`Event geometry in pixels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c6d2cad1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('71e5153a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dfe9b0d7', 'id'))}">\`
elements+=\`event-overlap-mode\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f1c98257', 'id'))}">\`
elements+=\`stack | column\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2228339c', 'id'))}">\`
elements+=\`stack\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('beeb5d29', 'id'))}">\`
elements+=\`Timed event overlap layout; assign a function through the matching property for custom geometry.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e69bcb7f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f33f6197', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f970f56b', 'id'))}">\`
elements+=\`event-overlap-threshold\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42af2db1', 'id'))}">\`
elements+=\`minutes\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('451c818d', 'id'))}">\`
elements+=\`60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2ed60e59', 'id'))}">\`
elements+=\`Overlap grouping threshold.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f15f5b66', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5ceaa8d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd6a53c1', 'id'))}">\`
elements+=\`event-more\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6941273c', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('26958430', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('633e022b', 'id'))}">\`
elements+=\`Collapse crowded month cells.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fb1245d4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('58347674', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01c3e136', 'id'))}">\`
elements+=\`event-more-text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df3abff5', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('348e3ff1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2e995d51', 'id'))}">\`
elements+=\`&#123;count&#125; more\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b2a5f4f', 'id'))}">\`
elements+=\`Overflow label template.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('51db7168', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('194346ab', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f6317ff', 'id'))}">\`
elements+=\`event-ripple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2c7b57ef', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('92e49124', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0cac9596', 'id'))}">\`
elements+=\`Add ripple styling to event controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('39491b10', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1fd11992', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa37c155', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d8a308e5', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('65112219', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a546e653', 'id'))}">\`
elements+=\`Enable native drag-and-drop rescheduling for timed events.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('86f78ce2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2d68ea59', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c18f121', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('740d57b2', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1a5b13c2', 'id'))}">\`
elements+=\`number / HH:mm\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('762a5436', 'id'))}">\`
elements+=\`0 / &#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7291c58e', 'id'))}">\`
elements+=\`Schedule start; first-time takes precedence.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('83c7d98c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e2321596', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6f78d157', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('229012fe', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c7f6f475', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9104db63', 'id'))}">\`
elements+=\`24 / 60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('34a2a6cb', 'id'))}">\`
elements+=\`Visible interval count and duration.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('993a0d99', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('47bedaf8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0307f9e', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b37f8266', 'id'))}">\`
elements+=\`interval-width\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('849e70b7', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5d691bd7', 'id'))}">\`
elements+=\`48 / 60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a613986', 'id'))}">\`
elements+=\`Interval row and gutter geometry in pixels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('34c9a0c3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('39c62b05', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ca3fa12', 'id'))}">\`
elements+=\`short-intervals\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('78391e18', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2881623', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('09817849', 'id'))}">\`
elements+=\`Omit zero minutes from concise interval labels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('409982aa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b79c9e29', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0572af60', 'id'))}">\`
elements+=\`interval-highlight\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bfc9632a', 'id'))}">\`
elements+=\`boolean | color\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85702404', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a4a230e', 'id'))}">\`
elements+=\`Highlight interval rows on hover, optionally with a theme token or CSS color.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('88b4df7c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('589bf97f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0b22e9b', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f081f569', 'id'))}">\`
elements+=\`JSON array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f6f41a3', 'id'))}">\`
elements+=\`[]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e2034648', 'id'))}">\`
elements+=\`Category strings or objects.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2b3ab0f3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('60097e1a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d22ae51', 'id'))}">\`
elements+=\`category-days\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('515cf0b5', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('792873c8', 'id'))}">\`
elements+=\`1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('81193cb5', 'id'))}">\`
elements+=\`Days shown in category view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7e7767fe', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('89e7ffba', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d68cb3b4', 'id'))}">\`
elements+=\`category-text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b5c6eb1', 'id'))}">\`
elements+=\`field name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('38d766d5', 'id'))}">\`
elements+=\`name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('633a31d1', 'id'))}">\`
elements+=\`Category object label field.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1c469365', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a2dc098a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a35feda', 'id'))}">\`
elements+=\`category-hide-dynamic\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('409cdded', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13d0d034', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df661500', 'id'))}">\`
elements+=\`Exclude event-defined categories.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fdbc0101', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d838bc1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f1f97be', 'id'))}">\`
elements+=\`category-show-all\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9cc7913', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2dc9cc83', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6808600e', 'id'))}">\`
elements+=\`Show categories with no events.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('26553d93', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c79b8ee8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('022997b3', 'id'))}">\`
elements+=\`category-for-invalid\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af5d7b1c', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a3cafc3f', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d76457f5', 'id'))}">\`
elements+=\`Fallback category for invalid records.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`</tbody>\`
elements+=\`
  \`
elements+=\`</table>\`
elements+=\`
\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cef487d2', 'id'))}">\`
elements+=\`JavaScript Properties\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('7e96d178', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('fbee4eda', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('d4728b5c', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8aed87da', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('009feb29', 'id'))}">\`
elements+=\`Property\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('403cb92b', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3ce0a56d', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('09a0f905', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9dffc5a9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f091cbd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3a0be3b', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7864b6e1', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1c47354b', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0522a6c7', 'id'))}">\`
elements+=\`array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1954d752', 'id'))}">\`
elements+=\`Assign arrays directly without serializing them.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('170e72e8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8a7c7747', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca04b760', 'id'))}">\`
elements+=\`dayFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b01bfc0c', 'id'))}">\`
elements+=\`weekdayFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8479256f', 'id'))}">\`
elements+=\`monthFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f017659', 'id'))}">\`
elements+=\`intervalFormat\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('720bef4c', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b5ca69b8', 'id'))}">\`
elements+=\`Custom label formatters.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5c784b7b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('622058eb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc21babf', 'id'))}">\`
elements+=\`showIntervalLabel\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5241ee02', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6f81f8d3', 'id'))}">\`
elements+=\`Returns whether an interval label is visible.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a0f7327f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8a4c147a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('377d2f14', 'id'))}">\`
elements+=\`intervalStyle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9500e099', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42f63199', 'id'))}">\`
elements+=\`Returns inline styles for an interval cell.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cfeb0f96', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29857d9e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14a422a7', 'id'))}">\`
elements+=\`eventName\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b61edeb4', 'id'))}">\`
elements+=\`eventColor\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b4b876f', 'id'))}">\`
elements+=\`eventTextColor\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe026ac1', 'id'))}">\`
elements+=\`eventTimed\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a4813e1b', 'id'))}">\`
elements+=\`eventCategory\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e11e4787', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c4bfa7d8', 'id'))}">\`
elements+=\`Event accessors; functions receive the source record.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('aeaf9f9d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f63a93c8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14d606a3', 'id'))}">\`
elements+=\`eventOverlapMode\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('936b361a', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f285628', 'id'))}">\`
elements+=\`Accepts \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('340285e9', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca3680b8', 'id'))}">\`
elements+=\`column\`
elements+=\`</code>\`
elements+=\`, or a Vuetify-compatible visual layout factory.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bc512666', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a5e22e7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b942bfb0', 'id'))}">\`
elements+=\`eventRipple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1575ab4e', 'id'))}">\`
elements+=\`boolean | object\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a221353', 'id'))}">\`
elements+=\`Enables ripple styling; object values can carry application-specific ripple configuration.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8fc211b3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2a78ad62', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8029b7cf', 'id'))}">\`
elements+=\`categoryText\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ad4d394c', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1d415e66', 'id'))}">\`
elements+=\`Category label accessor.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3a26bf28', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('93fb20fb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc36be2b', 'id'))}">\`
elements+=\`dayContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43e36ae4', 'id'))}">\`
elements+=\`dayHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('881bce52', 'id'))}">\`
elements+=\`dayBodyContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('929c2390', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bf51052f', 'id'))}">\`
elements+=\`Framework-neutral counterparts to Vuetify day slots.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4c1a2d55', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('106806e9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b4fe1f8f', 'id'))}">\`
elements+=\`intervalContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('515e2cb6', 'id'))}">\`
elements+=\`intervalHeaderContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d0fa4ce3', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7dc49940', 'id'))}">\`
elements+=\`Render custom interval and gutter content.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0b885198', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('60f629eb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32223b98', 'id'))}">\`
elements+=\`eventContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d59d55e2', 'id'))}">\`
elements+=\`categoryContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8fd85f30', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('080ac971', 'id'))}">\`
elements+=\`Render custom event and category markup.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`</tbody>\`
elements+=\`
  \`
elements+=\`</table>\`
elements+=\`
\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cb713a09', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('f44c0c3d', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('ed529e55', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('0b6afb3b', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e49b8bde', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('963460cf', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('e28d3848', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('abe16a9b', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('ff700cd6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('677c3eb7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aeb43705', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09f8c2f3', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('34f7e577', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cf4b5a67', 'id'))}">\`
elements+=\`&#123; value, date, kind &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df29f9d4', 'id'))}">\`
elements+=\`Fired when a date is selected.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('510dcac9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('08be1843', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('983a5e23', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('885c6121', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c7b7f92', 'id'))}">\`
elements+=\`&#123; reason, value, start, end, type &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac27ac54', 'id'))}">\`
elements+=\`Fired when selection or visible range changes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9df75523', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f5b407e6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc6e6ca2', 'id'))}">\`
elements+=\`moved\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d8ec023', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b05a170b', 'id'))}">\`
elements+=\`&#123; reason, value, start, end, type &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9693140', 'id'))}">\`
elements+=\`Fired after \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11971292', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f0b2953', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('74c10145', 'id'))}">\`
elements+=\`move()\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cf3a68dd', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f1ea363f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9355d27a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1579db5b', 'id'))}">\`
elements+=\`click\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffba0a8f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b333a3d1', 'id'))}">\`
elements+=\`&#123; kind, date, time?, category?, event? &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed108a3c', 'id'))}">\`
elements+=\`Fired for date, event, overflow, and interval interactions.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`</tbody>\`
elements+=\`
  \`
elements+=\`</table>\`
elements+=\`
\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6433b5e3', 'id'))}">\`
elements+=\`Methods\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('d1f64198', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('f45a874c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e75347cd', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('989336f4', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('9be92436', 'id'))}">\`
elements+=\`Method\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4a4d5b58', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('034f9777', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2e57992a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f93ad68', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7436b48', 'id'))}">\`
elements+=\`next(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c79856a', 'id'))}">\`
elements+=\`Move forward by the current view span.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d1c7ac08', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9714c27c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77db56b8', 'id'))}">\`
elements+=\`prev(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0abc9809', 'id'))}">\`
elements+=\`Move backward by the current view span.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0154aac0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('45f650aa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3c024fb5', 'id'))}">\`
elements+=\`move(amount)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d99c3a22', 'id'))}">\`
elements+=\`Move in either direction.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1618260d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2afc68e6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01fd5107', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e973347b', 'id'))}">\`
elements+=\`Move to the current or overridden \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce9ab437', 'id'))}">\`
elements+=\`now\`
elements+=\`</code>\`
elements+=\` date.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('96781d4c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('47e7c321', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6889d649', 'id'))}">\`
elements+=\`scrollToTime(value)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e99ef41', 'id'))}">\`
elements+=\`Scroll interval views to minutes since midnight or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25d82b01', 'id'))}">\`
elements+=\`HH:mm\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c7758c9f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5ea469f8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb9e5628', 'id'))}">\`
elements+=\`minutesToPixels(minutes)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ef56a4e4', 'id'))}">\`
elements+=\`Convert a duration to pixels using the active interval scale.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9f4dee02', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b8a1bfac', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6727223f', 'id'))}">\`
elements+=\`timeDelta(value)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53edab7f', 'id'))}">\`
elements+=\`Return a time's fractional position in the visible interval range.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1d340279', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6153047f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d7772567', 'id'))}">\`
elements+=\`timeToY(value, clamp = false)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cccfee91', 'id'))}">\`
elements+=\`Return a time's vertical pixel position for custom day-body treatments.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('20ba8ca7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c1cfd16d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60b79e9f', 'id'))}">\`
elements+=\`checkChange()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af996ac8', 'id'))}">\`
elements+=\`Emit and return the current visible range metadata.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8a6b9eec', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2de5828d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('880326c5', 'id'))}">\`
elements+=\`updateTimes()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d8e8694f', 'id'))}">\`
elements+=\`Refresh relative date state and return the current time metadata.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('654de4a2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('22350edf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12fff8aa', 'id'))}">\`
elements+=\`getVisibleRange()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('338a083a', 'id'))}">\`
elements+=\`Return \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('57ec08b8', 'id'))}">\`
elements+=\`&#123; start, end, type &#125;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`</tbody>\`
elements+=\`
  \`
elements+=\`</table>\`
elements+=\`
\`
elements+=\`</div>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/calendars/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
