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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('c22d3c34', 'id'))}">\`
elements+=\`Calendars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2b354ca9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('904dba19', 'id'))}">\`
elements+=\`w-calendar\`
elements+=\`</code>\`
elements+=\` is a responsive scheduling surface for month, week, day, four-day, custom, and category views. It accepts event and category arrays, renders all-day and timed events, and exposes a vanilla JavaScript API with native event names.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cd9b25b6', 'id'))}">\`
elements+=\`Month\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1ee62f2a', 'id'))}">\`
elements+=\`The month view displays all-day and timed events across a complete calendar grid. Select a date, use the header controls, or call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0f67add', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd10536e', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86f06695', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5d68169b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<section class="w-calendar w-calendar--month" id="\${ty_escapeAttr(ty_generateId('ce4d6951', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('5bd115b8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-header__nav" id="\${ty_escapeAttr(ty_generateId('98b2dcc3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Previous period" id="\${ty_escapeAttr(ty_generateId('57d62c3b', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-today" type="button" id="\${ty_escapeAttr(ty_generateId('a3d432f8', 'id'))}">\`
elements+=\`Today\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Next period" id="\${ty_escapeAttr(ty_generateId('3163878b', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('c4227abf', 'id'))}">\`
elements+=\`June 2026\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-month" role="grid" id="\${ty_escapeAttr(ty_generateId('39aaf2c9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-weekdays" role="row" id="\${ty_escapeAttr(ty_generateId('56e1d095', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('fed424d1', 'id'))}">\`
elements+=\`Sun\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('50d25c13', 'id'))}">\`
elements+=\`Mon\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('7ed37f2d', 'id'))}">\`
elements+=\`Tue\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('1150bad4', 'id'))}">\`
elements+=\`Wed\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('1268ec93', 'id'))}">\`
elements+=\`Thu\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('c227d353', 'id'))}">\`
elements+=\`Fri\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('2c2efb32', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-week" role="row" id="\${ty_escapeAttr(ty_generateId('907df18a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day outside" id="\${ty_escapeAttr(ty_generateId('b153695f', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('6e4e583b', 'id'))}">\`
elements+=\`31\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('e776ce4e', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('1afbd3af', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('6abca39b', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('2c0a2682', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('29a122e7', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('632d94f8', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('7dc04572', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('f2f7815b', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('37b6e5d7', 'id'))}">\`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-primary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('192f9a99', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('158e96aa', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('00f99e7d', 'id'))}">\`
elements+=\`5\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('4a1497fb', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('d2147fe0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6fd96b85', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" now="2026-06-27 10:30" event-color="color" events="[{&quot;name&quot;:&quot;Design review&quot;,&quot;start&quot;:&quot;2026-06-04 09:00&quot;,&quot;end&quot;:&quot;2026-06-04 10:30&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Release window&quot;,&quot;start&quot;:&quot;2026-06-13&quot;,&quot;end&quot;:&quot;2026-06-13&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Conference&quot;,&quot;start&quot;:&quot;2026-06-18&quot;,&quot;end&quot;:&quot;2026-06-20&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('8a698312', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6937e6cd', 'id'))}">\`
elements+=\`Week\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9757ef2d', 'id'))}">\`
elements+=\`Week views combine an all-day row with a scrollable interval grid. Timed events are positioned from their start and end values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('99dd0ca8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--week" id="\${ty_escapeAttr(ty_generateId('05d9a327', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:3;--w-calendar-interval-height:3rem;--w-calendar-interval-width:3.75rem" id="\${ty_escapeAttr(ty_generateId('3cc7534f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('e0923462', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('4bb0c0cb', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('e79f16ad', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('edf48480', 'id'))}">\`
elements+=\`Mon \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('be59c91e', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('94fb3a2d', 'id'))}">\`
elements+=\`Tue \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('4a9c5169', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('3275e42f', 'id'))}">\`
elements+=\`Wed \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('25bc4d32', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('e1894ba4', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('9f6b3f92', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('66556d73', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('3a7c5ea6', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('6582a208', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('84d7fb81', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('9f94b9ac', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('d79c82f9', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('50334cd7', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('e9492523', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('766696c2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fd2b5746', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="week" value="2026-06-10" first-interval="8" interval-count="11" interval-highlight="" event-color="color" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-08 09:00&quot;,&quot;end&quot;:&quot;2026-06-08 10:00&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Lunch&quot;,&quot;start&quot;:&quot;2026-06-10 12:00&quot;,&quot;end&quot;:&quot;2026-06-10 13:00&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Launch&quot;,&quot;start&quot;:&quot;2026-06-11&quot;,&quot;end&quot;:&quot;2026-06-11&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('397b1c94', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('63ff39b4', 'id'))}">\`
elements+=\`Day and Four-day\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d915d765', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4185f2d9', 'id'))}">\`
elements+=\`day\`
elements+=\`</code>\`
elements+=\` for a focused agenda or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6c495f8b', 'id'))}">\`
elements+=\`4day\`
elements+=\`</code>\`
elements+=\` for a compact multi-day planner. The same interval and event attributes apply to both.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eedea4ec', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid" id="\${ty_escapeAttr(ty_generateId('6171c747', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('65f698f0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('1ddcc019', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('9a33450c', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('659db465', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('02adf1c1', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('a07662b0', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day" id="\${ty_escapeAttr(ty_generateId('d741cc3d', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-label" id="\${ty_escapeAttr(ty_generateId('464263d6', 'id'))}">\`
elements+=\`All day\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-all-day-cells" id="\${ty_escapeAttr(ty_generateId('5d5a67e4', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-cell" id="\${ty_escapeAttr(ty_generateId('daf69c8e', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('01c36f49', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--4day" id="\${ty_escapeAttr(ty_generateId('28bba71f', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('b53190f3', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('8213b4d5', 'id'))}">\`
elements+=\`Jun 13–16, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('dd761f5d', 'id'))}">\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('607d0e7e', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('ba426cfc', 'id'))}">\`
elements+=\`Sat 13\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('994dff9e', 'id'))}">\`
elements+=\`Sun 14\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('46deaa94', 'id'))}">\`
elements+=\`Mon 15\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('56267441', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('608f5ace', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('29984d01', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="8" interval-count="10" format="24hr" interval-highlight="" id="\${ty_escapeAttr(ty_generateId('ee2f7e9e', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="4day" value="2026-06-13" first-interval="8" interval-count="10" interval-height="40" id="\${ty_escapeAttr(ty_generateId('bbe2376c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('60dad3b8', 'id'))}">\`
elements+=\`Weekdays, Locale, and Week Numbers\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('af18556e', 'id'))}">\`
elements+=\`Choose visible days with a JSON \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df56af06', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\` array, rotate them with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28b6f05a', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`, localize labels, and add ISO-style week numbers.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7476fac5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--month w-calendar--show-week" id="\${ty_escapeAttr(ty_generateId('d44ef5dc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-weekdays" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('b3085fe7', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('e1277b85', 'id'))}">\`
elements+=\`#\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('55f11c23', 'id'))}">\`
elements+=\`Monday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('6076b97c', 'id'))}">\`
elements+=\`Tuesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('c52f32ca', 'id'))}">\`
elements+=\`Wednesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('922001de', 'id'))}">\`
elements+=\`Thursday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('1a47e8be', 'id'))}">\`
elements+=\`Friday\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-week" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('125b41b2', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('9094996a', 'id'))}">\`
elements+=\`24\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('602a66b3', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('7ba71361', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('3468f0c0', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('12841d68', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('f4a2d23f', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('604f5344', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('a8a7f19a', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('395b3d55', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('f3b31101', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('6efc68b4', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('380ce66d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" weekdays="[1,2,3,4,5]" first-day-of-week="1" first-day-of-year="4" short-weekdays="false" show-week="" locale="en-CA" id="\${ty_escapeAttr(ty_generateId('29556537', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9a44971c', 'id'))}">\`
elements+=\`Intervals and Clock Format\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('932a0f22', 'id'))}">\`
elements+=\`Control the visible schedule with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ceff438', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03e25a91', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd99374d', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('79cb9bfa', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3be8b7f', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('438662f6', 'id'))}">\`
elements+=\`format\`
elements+=\`</code>\`
elements+=\`. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('853b28db', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\` overrides \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('29ba80ed', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f565b886', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('d7b60e49', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1;--w-calendar-interval-height:2.5rem;--w-calendar-interval-width:4.5rem" id="\${ty_escapeAttr(ty_generateId('97477157', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('285e0012', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('3179a97b', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('3558b22f', 'id'))}">\`
elements+=\`08:30\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('cb20d835', 'id'))}">\`
elements+=\`09:00\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('b95b047f', 'id'))}">\`
elements+=\`09:30\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('a86df1d8', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('1154d70d', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('4a100964', 'id'))}">\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('9299f36e', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('15b82794', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('1e433e03', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1c22f470', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-time="08:30" interval-count="12" interval-minutes="30" interval-height="40" interval-width="72" format="24hr" interval-highlight="" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 09:30&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('618268fa', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('00e0bd00', 'id'))}">\`
elements+=\`Categories\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('729ad415', 'id'))}">\`
elements+=\`The category view compares schedules side by side. Categories accept a JSON string or a JavaScript array; events map through \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f464661f', 'id'))}">\`
elements+=\`event-category\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('00498eb4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--category" id="\${ty_escapeAttr(ty_generateId('759a55a4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule w-calendar-category" style="--w-calendar-days:2" id="\${ty_escapeAttr(ty_generateId('bd47430a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('0494af64', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('2d70ff65', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-headers" id="\${ty_escapeAttr(ty_generateId('a01d6f41', 'id'))}">\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('32db933a', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('18d92535', 'id'))}">\`
elements+=\`Design\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('f49e711b', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('ecd1b5ad', 'id'))}">\`
elements+=\`Operations\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-category-columns" id="\${ty_escapeAttr(ty_generateId('c08ffb33', 'id'))}">\`
elements+=\`<div class="w-calendar-category-column" data-category="Design" id="\${ty_escapeAttr(ty_generateId('f13181fe', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-column" data-category="Operations" id="\${ty_escapeAttr(ty_generateId('eca7f47b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5539b08c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="category" value="2026-06-13" categories="[&quot;Design&quot;,&quot;Operations&quot;]" category-show-all="" first-interval="8" interval-count="11" event-color="color" events="[{&quot;name&quot;:&quot;Wireframes&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:30&quot;,&quot;category&quot;:&quot;Design&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Deploy&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;,&quot;category&quot;:&quot;Operations&quot;,&quot;color&quot;:&quot;success&quot;}]" id="\${ty_escapeAttr(ty_generateId('80756d3a', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c3ba692c', 'id'))}">\`
elements+=\`Custom Ranges\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7691d34d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5ac206e', 'id'))}">\`
elements+=\`custom-weekly\`
elements+=\`</code>\`
elements+=\` renders week rows between explicit dates; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('204d7e84', 'id'))}">\`
elements+=\`custom-daily\`
elements+=\`</code>\`
elements+=\` renders interval columns. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ef51698', 'id'))}">\`
elements+=\`max-days\`
elements+=\`</code>\`
elements+=\` caps open-ended daily ranges.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d681ae72', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('970e5689', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-weekly" id="\${ty_escapeAttr(ty_generateId('98881eb1', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('88f62edd', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('2ce3b85c', 'id'))}">\`
elements+=\`Jun 8 – Jun 19, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('4071516d', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('42c462b6', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-daily" id="\${ty_escapeAttr(ty_generateId('33092546', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('330e8251', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('539cc4e7', 'id'))}">\`
elements+=\`Jun 8–10, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" style="--w-calendar-days:3" id="\${ty_escapeAttr(ty_generateId('976385f0', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('92aec730', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('86351193', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('651bc52b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('672911bd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f617c677', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-weekly" value="2026-06-08" start="2026-06-08" end="2026-06-19" first-day-of-week="1" id="\${ty_escapeAttr(ty_generateId('fd56bd76', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-daily" value="2026-06-08" start="2026-06-08" end="2026-06-10" first-interval="8" interval-count="8" id="\${ty_escapeAttr(ty_generateId('0db81ba5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('10920e27', 'id'))}">\`
elements+=\`Event Mapping and Overflow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d615eacb', 'id'))}">\`
elements+=\`Map alternative event fields with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b8b9548', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9103ee2', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('534b1ed6', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38128973', 'id'))}">\`
elements+=\`event-timed\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f2c35e7', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`. Month cells show three events before a configurable “more” action.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0cc697ee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar-day selected" id="\${ty_escapeAttr(ty_generateId('52878b0b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('430454ed', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('53c6ebf6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:#155e75;--w-calendar-event-text:#fff" id="\${ty_escapeAttr(ty_generateId('a05f2ffc', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-success);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('189af7cb', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-tertiary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('2ec5782e', 'id'))}">\`
elements+=\`Retrospective\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-more" type="button" id="\${ty_escapeAttr(ty_generateId('5b2dc37e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('476853fb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" event-name="title" event-start="begins" event-end="finishes" event-color="tone" event-more-text="&#123;count&#125; additional" events="[{&quot;title&quot;:&quot;Design review&quot;,&quot;begins&quot;:&quot;2026-06-13 09:00&quot;,&quot;finishes&quot;:&quot;2026-06-13 10:00&quot;,&quot;tone&quot;:&quot;#155e75&quot;},{&quot;title&quot;:&quot;Launch&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;success&quot;},{&quot;title&quot;:&quot;Retrospective&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;tertiary&quot;},{&quot;title&quot;:&quot;Planning&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;primary&quot;},{&quot;title&quot;:&quot;Handoff&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;secondary&quot;}]" id="\${ty_escapeAttr(ty_generateId('5a7c4bd3', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8f4313f4', 'id'))}">\`
elements+=\`Custom Content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('38de6b94', 'id'))}">\`
elements+=\`Vue slots become framework-neutral rendering callbacks in DuVay. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ef0bade', 'id'))}">\`
elements+=\`dayContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff33d6ad', 'id'))}">\`
elements+=\`dayHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0bd98c05', 'id'))}">\`
elements+=\`dayBodyContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b288fe41', 'id'))}">\`
elements+=\`intervalContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ac3eb12', 'id'))}">\`
elements+=\`intervalHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ab8ca7c6', 'id'))}">\`
elements+=\`eventContent\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ac71217', 'id'))}">\`
elements+=\`categoryContent\`
elements+=\`</code>\`
elements+=\` to return application-owned markup.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5451254e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('5b43a165', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('8df5964d', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('6bc87d65', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('38afc706', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('636c2e02', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('5066e571', 'id'))}">\`
elements+=\`Time\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('a1cdd3a8', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('4579b203', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('4c4b0f75', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</span>\`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('32349cde', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-header-content" id="\${ty_escapeAttr(ty_generateId('d0247251', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('3bebd237', 'id'))}">\`
elements+=\`Focus day\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('3a27a417', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('1e20026f', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('688e7515', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('3e0393ff', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('20c10cdd', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('6e1cf378', 'id'))}">\`
elements+=\`<span class="w-calendar-interval-content" id="\${ty_escapeAttr(ty_generateId('f101962f', 'id'))}">\`
elements+=\`9 o'clock\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-body-content" id="\${ty_escapeAttr(ty_generateId('f2b357f4', 'id'))}">\`
elements+=\`<span class="w-calendar-current-time" style="top:24px" id="\${ty_escapeAttr(ty_generateId('8ab1ddc8', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7929b80a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar data-calendar-custom-content="" type="day" value="2026-06-13" now="2026-06-13 09:30" first-interval="9" interval-count="4" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('8c8d2d9c', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a26c4e87', 'id'))}">\`
elements+=\`Native Drag and Drop\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0b9d1ffb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7446b17', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\` makes event controls draggable. Dropping a timed event onto an interval preserves its duration, updates the source event, and emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f34b18a9', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25e49366', 'id'))}">\`
elements+=\`reason: "event-drop"\`
elements+=\`</code>\`
elements+=\`. Native drag events continue to bubble for application-specific behavior.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f83b6c3f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('d8ddb79d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('86c4df16', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('ae48da6f', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('b805d606', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('a861cbad', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('b7e755ab', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('1642b3df', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('bf5e00fd', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('5b70f99c', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('9102e733', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('db8585ab', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-timed-events" id="\${ty_escapeAttr(ty_generateId('6eda771b', 'id'))}">\`
elements+=\`<button class="w-calendar-event w-calendar-event--timed" draggable="true" style="top:0;height:48px" id="\${ty_escapeAttr(ty_generateId('7ab8e057', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2154839', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="9" interval-count="6" interval-highlight="" event-draggable="" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:00&quot;},{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 11:00&quot;,&quot;end&quot;:&quot;2026-06-13 12:30&quot;}]" id="\${ty_escapeAttr(ty_generateId('24e100e8', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7bc60f16', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c0f14629', 'id'))}">\`
elements+=\`All attributes are reflected and reactive. JSON-valued attributes (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('74043cf2', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1584f74c', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a94dfe3', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`) also accept arrays via the matching JavaScript properties.\`
elements+=\`</p>\`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('9f5b52a4', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('914279c6', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2912e352', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('00c021f2', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d8be5eb2', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5254fbde', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('1d528b7c', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('1d6e831c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c60ed17f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('94db6555', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d4f3b51', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a070c552', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6bc4eca0', 'id'))}">\`
elements+=\`month | week | day | 4day | custom-weekly | custom-daily | category\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('78b33a08', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac89abf1', 'id'))}">\`
elements+=\`month\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f851556', 'id'))}">\`
elements+=\`Active calendar view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0b1a513f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a44dc367', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f934069', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('50e6e0bd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7edde505', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('90959037', 'id'))}">\`
elements+=\`—\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('069417cd', 'id'))}">\`
elements+=\`Anchor date (ISO \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('31064e3f', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</code>\`
elements+=\`) the view is built around.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('51dfdf24', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6ce5436e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dcdb0157', 'id'))}">\`
elements+=\`now\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('963f67a5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbe06b4a', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3da6fc65', 'id'))}">\`
elements+=\`—\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('28e717e1', 'id'))}">\`
elements+=\`Overrides "today" for the current-time indicator and highlight.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c908e1cb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dba865df', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb5f66b5', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7c325dcf', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b0219b0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e9aa03d', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c7c9c773', 'id'))}">\`
elements+=\`—\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8d525d7b', 'id'))}">\`
elements+=\`Bounds for navigation and selection.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c54ccb98', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f185c9eb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6d6534db', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eff9e630', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6742d56a', 'id'))}">\`
elements+=\`Array | String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('97be2789', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('979e096d', 'id'))}">\`
elements+=\`0,1,2,3,4,5,6\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e0f43712', 'id'))}">\`
elements+=\`Which weekdays to display and their order.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('79e56b1c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cdd749d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b1ea886e', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13eeb3ac', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0d5eed9', 'id'))}">\`
elements+=\`Number\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('41b68874', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5b473067', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3147114d', 'id'))}">\`
elements+=\`Starting weekday (0 = Sunday).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ae072366', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5eb3670', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c00860d5', 'id'))}">\`
elements+=\`locale\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('12fba5af', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa71f62f', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('497379f1', 'id'))}">\`
elements+=\`document locale\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('25d09225', 'id'))}">\`
elements+=\`Locale for day, month, and interval labels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1ea4fc23', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('903295d7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e2fdd47f', 'id'))}">\`
elements+=\`show-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e3c76d7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abf5eb16', 'id'))}">\`
elements+=\`Boolean\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('18075d67', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('673abb89', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a3f6de6', 'id'))}">\`
elements+=\`Show ISO week numbers in month view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e234bde7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c4666c50', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7c0d6453', 'id'))}">\`
elements+=\`hide-header\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c89fa854', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2e14ae3', 'id'))}">\`
elements+=\`Boolean\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bb217719', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('02ea251b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ecd701e', 'id'))}">\`
elements+=\`Hide the built-in navigation header.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fd47f9f6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5fbe0bb2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('785fc025', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2f3d1099', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('63d621f6', 'id'))}">\`
elements+=\`Array&lt;Object&gt; | JSON\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ebe2637', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c5eb699', 'id'))}">\`
elements+=\`[]\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('05bd2bfa', 'id'))}">\`
elements+=\`Event objects rendered on the calendar.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a5a4d1eb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('21ec9580', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2698497', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d80d1f8a', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('63b1a129', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('213d8b5e', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d0764329', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ae0d1e3', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5165ccf1', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('27d2612c', 'id'))}">\`
elements+=\`Property names mapping to each event's start/end.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f9361a9c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('01545fc0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6bdb6dfb', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40e45d70', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8043e9c4', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e43e021c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16b80a78', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d0a4d57', 'id'))}">\`
elements+=\`Property name for the event label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('47674d36', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2852ad87', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdccd5af', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1344c754', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66df1453', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c46e8d94', 'id'))}">\`
elements+=\`—\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6661d862', 'id'))}">\`
elements+=\`Property name (or token/color) for an event's color.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e8ce94bf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('73b947e0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90d6e6fd', 'id'))}">\`
elements+=\`event-more\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5b81d77a', 'id'))}">\`
elements+=\`event-more-text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('21ca9327', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e6b0c14', 'id'))}">\`
elements+=\`Boolean\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8cd26214', 'id'))}">\`
elements+=\`String\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3e03990', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54417cc9', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca2956c8', 'id'))}">\`
elements+=\`&#123;count&#125; more\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('38733a47', 'id'))}">\`
elements+=\`Show an overflow "more" affordance and its label template.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9f8ae200', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('32abe147', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9da53874', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('84eba248', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ea22aa5', 'id'))}">\`
elements+=\`Boolean\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('37530c45', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec623ad3', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1febea92', 'id'))}">\`
elements+=\`Allow timed events to be dragged onto intervals.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7dade54d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42419038', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('774fc849', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7459468', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('268699b5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9e13580f', 'id'))}">\`
elements+=\`Number\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d6f4a537', 'id'))}">\`
elements+=\`—\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffb58a17', 'id'))}">\`
elements+=\`First interval and number of intervals in timed views.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7bcd9e9d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8b97360', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9f90d92d', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('15c2baa0', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06473446', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fda7e5ba', 'id'))}">\`
elements+=\`Number\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('313833fd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b73f9cd', 'id'))}">\`
elements+=\`60\`
elements+=\`</code>\`
elements+=\` / —\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c264b4c', 'id'))}">\`
elements+=\`Minutes per interval and the row height.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1aac85b1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9018c629', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c167c4d0', 'id'))}">\`
elements+=\`interval-highlight\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1d4e8ce6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('45dfa768', 'id'))}">\`
elements+=\`Boolean\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('583fc8b9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df7f62e9', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9584d5d9', 'id'))}">\`
elements+=\`Highlight the current interval.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9686d1ff', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a318971', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('928319d8', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d0016e0a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0dc22ca', 'id'))}">\`
elements+=\`Array | String | JSON\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3009ab2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5bd64ec6', 'id'))}">\`
elements+=\`[]\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d0571c2', 'id'))}">\`
elements+=\`Category columns for the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0f530337', 'id'))}">\`
elements+=\`category\`
elements+=\`</code>\`
elements+=\` view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f56d5f8', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c8b3dd79', 'id'))}">\`
elements+=\`All events are native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('02c2b0b7', 'id'))}">\`
elements+=\`CustomEvent\`
elements+=\`</code>\`
elements+=\`s (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d1177d29', 'id'))}">\`
elements+=\`bubbles: true, composed: true\`
elements+=\`</code>\`
elements+=\`) carrying a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad759a5a', 'id'))}">\`
elements+=\`detail\`
elements+=\`</code>\`
elements+=\` object.\`
elements+=\`</p>\`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('22bfef50', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('cc6b4869', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ad793e2a', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3eb8b071', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('58a01c17', 'id'))}">\`
elements+=\`detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('52a13394', 'id'))}">\`
elements+=\`Fires when\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('10a48327', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('951ac7ff', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('088e47dc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c9cf38c', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b4def93', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e6b46a1c', 'id'))}">\`
elements+=\`&#123; reason, value, start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('392581ad', 'id'))}">\`
elements+=\`The visible range changes. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('896fc424', 'id'))}">\`
elements+=\`reason\`
elements+=\`</code>\`
elements+=\` is \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('119c3dc6', 'id'))}">\`
elements+=\`select\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('293e9a51', 'id'))}">\`
elements+=\`move\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('46ed1a73', 'id'))}">\`
elements+=\`today\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb975baf', 'id'))}">\`
elements+=\`check\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c6493ce0', 'id'))}">\`
elements+=\`event-drop\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('77b16fc1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d7eee6f4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f9e1417a', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1a908430', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28fa2f30', 'id'))}">\`
elements+=\`&#123; value, ... &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bee56cdb', 'id'))}">\`
elements+=\`A date is selected (model value updates).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c495e25c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a702276', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f5f23da', 'id'))}">\`
elements+=\`click\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('17417d80', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('528dfa9a', 'id'))}">\`
elements+=\`&#123; kind, date, event?, events?, hidden? &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('96ef16a8', 'id'))}">\`
elements+=\`A day, interval, event, or "more" affordance is clicked. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9708ac96', 'id'))}">\`
elements+=\`kind\`
elements+=\`</code>\`
elements+=\` is \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8dc9fc3', 'id'))}">\`
elements+=\`day\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6db64b79', 'id'))}">\`
elements+=\`time\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6503496', 'id'))}">\`
elements+=\`timeCategory\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef2551cc', 'id'))}">\`
elements+=\`event\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('07354607', 'id'))}">\`
elements+=\`more\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('635e8a3d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33b0d618', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('21de34a9', 'id'))}">\`
elements+=\`moved\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a3538c9c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f9cb569', 'id'))}">\`
elements+=\`&#123; reason, value, start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0253c1f3', 'id'))}">\`
elements+=\`Navigation moves the view via \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('50bdf4d7', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c221e205', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6c63abc4', 'id'))}">\`
elements+=\`today()\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3a4f9b2f', 'id'))}">\`
elements+=\`Methods\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e21a323f', 'id'))}">\`
elements+=\`Call these on the element instance (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b5089f49', 'id'))}">\`
elements+=\`document.querySelector('w-calendar').next()\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('d2b81449', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('8e025b18', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0a043de4', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b0d02432', 'id'))}">\`
elements+=\`Method\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('c8f24be3', 'id'))}">\`
elements+=\`Signature\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cac60343', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('6470f102', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('435403b6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b3a97e5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f063ed7c', 'id'))}">\`
elements+=\`next\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ef23add2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b9667a6', 'id'))}">\`
elements+=\`next(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4263e7b9', 'id'))}">\`
elements+=\`Advance the view by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b32dab81', 'id'))}">\`
elements+=\`amount\`
elements+=\`</code>\`
elements+=\` periods.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bed1aadd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64832c2a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dcf950e8', 'id'))}">\`
elements+=\`prev\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('458133e2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8665919d', 'id'))}">\`
elements+=\`prev(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('81e935ea', 'id'))}">\`
elements+=\`Move the view back by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a2d3204', 'id'))}">\`
elements+=\`amount\`
elements+=\`</code>\`
elements+=\` periods.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f2d67f43', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6a314d85', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6834543c', 'id'))}">\`
elements+=\`move\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e939bc3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e4cf9b91', 'id'))}">\`
elements+=\`move(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('971972dd', 'id'))}">\`
elements+=\`Move by a signed number of periods (negative moves back).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('679ba51a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1347d338', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d7c95ee3', 'id'))}">\`
elements+=\`today\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('462c2049', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a70c9aee', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10a57420', 'id'))}">\`
elements+=\`Jump the view to the current date.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b910ff77', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fdeeb41e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01f25a5b', 'id'))}">\`
elements+=\`scrollToTime\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d7010bc5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7548e05a', 'id'))}">\`
elements+=\`scrollToTime(value)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('44a5cb78', 'id'))}">\`
elements+=\`Scroll a timed view to the given time (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8435839', 'id'))}">\`
elements+=\`"09:00"\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9438e1dd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('27454337', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73051496', 'id'))}">\`
elements+=\`checkChange\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('599e4c76', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66e17a69', 'id'))}">\`
elements+=\`checkChange()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dfc478dd', 'id'))}">\`
elements+=\`Re-emit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('81e6e830', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` for the current range (useful after async data loads).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/calendars/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
