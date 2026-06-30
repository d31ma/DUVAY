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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7c4ad886', 'id'))}">\`
elements+=\`Calendars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f5e37cab', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0c0132a0', 'id'))}">\`
elements+=\`w-calendar\`
elements+=\`</code>\`
elements+=\` is a responsive scheduling surface for month, week, day, four-day, custom, and category views. It accepts event and category arrays, renders all-day and timed events, and exposes a vanilla JavaScript API with native event names.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cf9f0d53', 'id'))}">\`
elements+=\`Month\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5c983d96', 'id'))}">\`
elements+=\`The month view displays all-day and timed events across a complete calendar grid. Select a date, use the header controls, or call \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e094e929', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d11acbc', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6edbdd2f', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f2c60f38', 'id'))}">\`
elements+=\`
    \`
elements+=\`<section class="w-calendar w-calendar--month" id="\${ty_escapeAttr(ty_generateId('89a9a7e1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('6b02111b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-header__nav" id="\${ty_escapeAttr(ty_generateId('ccbb52fb', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Previous period" id="\${ty_escapeAttr(ty_generateId('d34070d6', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-today" type="button" id="\${ty_escapeAttr(ty_generateId('328345c3', 'id'))}">\`
elements+=\`Today\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-calendar-nav" type="button" aria-label="Next period" id="\${ty_escapeAttr(ty_generateId('e7737246', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('bbe99288', 'id'))}">\`
elements+=\`June 2026\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-month" role="grid" id="\${ty_escapeAttr(ty_generateId('c64f90c5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-weekdays" role="row" id="\${ty_escapeAttr(ty_generateId('6a12b49d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('b6d9f452', 'id'))}">\`
elements+=\`Sun\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('9cc298a0', 'id'))}">\`
elements+=\`Mon\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('0d75732b', 'id'))}">\`
elements+=\`Tue\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('a6e03a12', 'id'))}">\`
elements+=\`Wed\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('a818d195', 'id'))}">\`
elements+=\`Thu\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('bf60c51d', 'id'))}">\`
elements+=\`Fri\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('a9368c42', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-week" role="row" id="\${ty_escapeAttr(ty_generateId('5749db99', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day outside" id="\${ty_escapeAttr(ty_generateId('6ae364c9', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('c053dd8e', 'id'))}">\`
elements+=\`31\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('2ac0cf80', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('daceef72', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('bb300307', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('4893c61f', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('bcafdeb0', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('a21ef452', 'id'))}">\`
elements+=\`3\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('1c7344d1', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('eca3df64', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('aee4b041', 'id'))}">\`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-primary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('67fe6d7f', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('01ef3a82', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('bd9d3108', 'id'))}">\`
elements+=\`5\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('60620cfc', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('ffa8e785', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c16b1a43', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" now="2026-06-27 10:30" event-color="color" events="[{&quot;name&quot;:&quot;Design review&quot;,&quot;start&quot;:&quot;2026-06-04 09:00&quot;,&quot;end&quot;:&quot;2026-06-04 10:30&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Release window&quot;,&quot;start&quot;:&quot;2026-06-13&quot;,&quot;end&quot;:&quot;2026-06-13&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Conference&quot;,&quot;start&quot;:&quot;2026-06-18&quot;,&quot;end&quot;:&quot;2026-06-20&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('590f2f22', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('09ce07dd', 'id'))}">\`
elements+=\`Week\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b4b33243', 'id'))}">\`
elements+=\`Week views combine an all-day row with a scrollable interval grid. Timed events are positioned from their start and end values.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('084404ec', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--week" id="\${ty_escapeAttr(ty_generateId('de5a6a69', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:3;--w-calendar-interval-height:3rem;--w-calendar-interval-width:3.75rem" id="\${ty_escapeAttr(ty_generateId('dc3f5274', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('378e8379', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('9323a158', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('8f04515d', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('0ae72b45', 'id'))}">\`
elements+=\`Mon \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('de79aa94', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('5b678d9b', 'id'))}">\`
elements+=\`Tue \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('8b92600d', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('6a7c9a69', 'id'))}">\`
elements+=\`Wed \`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('fa9224b2', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('34659f04', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('baaa48bf', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('0654539d', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('f5b8e6e2', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('ad6ba384', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('3e6fa286', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('e96a15b4', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('56a804fc', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('e20aef2f', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('011341eb', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('4e5ab5ab', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6012f124', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="week" value="2026-06-10" first-interval="8" interval-count="11" interval-highlight="" event-color="color" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-08 09:00&quot;,&quot;end&quot;:&quot;2026-06-08 10:00&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Lunch&quot;,&quot;start&quot;:&quot;2026-06-10 12:00&quot;,&quot;end&quot;:&quot;2026-06-10 13:00&quot;,&quot;color&quot;:&quot;success&quot;},{&quot;name&quot;:&quot;Launch&quot;,&quot;start&quot;:&quot;2026-06-11&quot;,&quot;end&quot;:&quot;2026-06-11&quot;,&quot;color&quot;:&quot;tertiary&quot;}]" id="\${ty_escapeAttr(ty_generateId('73390c3d', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4083e8e4', 'id'))}">\`
elements+=\`Day and Four-day\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('389b2905', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a071b4f', 'id'))}">\`
elements+=\`day\`
elements+=\`</code>\`
elements+=\` for a focused agenda or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fcef6534', 'id'))}">\`
elements+=\`4day\`
elements+=\`</code>\`
elements+=\` for a compact multi-day planner. The same interval and event attributes apply to both.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fb7c24e2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid" id="\${ty_escapeAttr(ty_generateId('3b495669', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b6bb67d7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('3f1e61e0', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('7e7fcbaf', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('3e1eed6c', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('f04ba433', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('5d597345', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day" id="\${ty_escapeAttr(ty_generateId('3e07751f', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-label" id="\${ty_escapeAttr(ty_generateId('7a95ee37', 'id'))}">\`
elements+=\`All day\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-all-day-cells" id="\${ty_escapeAttr(ty_generateId('3cf88bdb', 'id'))}">\`
elements+=\`<div class="w-calendar-all-day-cell" id="\${ty_escapeAttr(ty_generateId('b583af3f', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('7ab2fb03', 'id'))}">\`
elements+=\`<div class="w-calendar w-calendar--4day" id="\${ty_escapeAttr(ty_generateId('0f6649f1', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('4e920393', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('6c7effe8', 'id'))}">\`
elements+=\`Jun 13–16, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-schedule" id="\${ty_escapeAttr(ty_generateId('b4d1b71a', 'id'))}">\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('707bc03e', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('1269bc8c', 'id'))}">\`
elements+=\`Sat 13\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('90ac2337', 'id'))}">\`
elements+=\`Sun 14\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('7c3eb529', 'id'))}">\`
elements+=\`Mon 15\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('dfaa671d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('df10cf72', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('42ecdf95', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="8" interval-count="10" format="24hr" interval-highlight="" id="\${ty_escapeAttr(ty_generateId('b2d1b1ef', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="4day" value="2026-06-13" first-interval="8" interval-count="10" interval-height="40" id="\${ty_escapeAttr(ty_generateId('f3b3c5bf', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1edb67d6', 'id'))}">\`
elements+=\`Weekdays, Locale, and Week Numbers\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3ab16049', 'id'))}">\`
elements+=\`Choose visible days with a JSON \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('079d5867', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\` array, rotate them with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef26b512', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`, localize labels, and add ISO-style week numbers.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6a7a5977', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--month w-calendar--show-week" id="\${ty_escapeAttr(ty_generateId('8304e12e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-weekdays" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('4e6f7858', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('e192a527', 'id'))}">\`
elements+=\`#\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('18a30980', 'id'))}">\`
elements+=\`Monday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('0eb7af13', 'id'))}">\`
elements+=\`Tuesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('90256bca', 'id'))}">\`
elements+=\`Wednesday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('7e31ee6e', 'id'))}">\`
elements+=\`Thursday\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-weekday" id="\${ty_escapeAttr(ty_generateId('2b3f9bfc', 'id'))}">\`
elements+=\`Friday\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-week" style="--w-calendar-columns:6" id="\${ty_escapeAttr(ty_generateId('e9d27ce4', 'id'))}">\`
elements+=\`<div class="w-calendar-week-number" id="\${ty_escapeAttr(ty_generateId('1314c54a', 'id'))}">\`
elements+=\`24\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('ad9a25dd', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('69f34e60', 'id'))}">\`
elements+=\`8\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('715949ed', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('3ebbc970', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('6d115195', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('c0113b8b', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('d2e46af4', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('3bd60fb3', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day" id="\${ty_escapeAttr(ty_generateId('fdfa0340', 'id'))}">\`
elements+=\`<button class="w-calendar-day-button" id="\${ty_escapeAttr(ty_generateId('a59ce1ec', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f586ad5f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" weekdays="[1,2,3,4,5]" first-day-of-week="1" first-day-of-year="4" short-weekdays="false" show-week="" locale="en-CA" id="\${ty_escapeAttr(ty_generateId('06dcb67b', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b6df7918', 'id'))}">\`
elements+=\`Intervals and Clock Format\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('55d002d2', 'id'))}">\`
elements+=\`Control the visible schedule with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f5a6a7b', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66391f56', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90561ec5', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f9108731', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2599443d', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8043122d', 'id'))}">\`
elements+=\`format\`
elements+=\`</code>\`
elements+=\`. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b6d451a3', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\` overrides \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4353d03a', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0960815d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('7c54ffa7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1;--w-calendar-interval-height:2.5rem;--w-calendar-interval-width:4.5rem" id="\${ty_escapeAttr(ty_generateId('01b25a56', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('5d94ffbd', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('b32e679f', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('a31963b7', 'id'))}">\`
elements+=\`08:30\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('6498c4fe', 'id'))}">\`
elements+=\`09:00\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('f8b2fe4e', 'id'))}">\`
elements+=\`09:30\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('9f99348b', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('05060518', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('fa43743c', 'id'))}">\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('4d0b7161', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('4b0bd2fd', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval w-calendar-interval--highlight" id="\${ty_escapeAttr(ty_generateId('53999f96', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('46ae0c18', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-time="08:30" interval-count="12" interval-minutes="30" interval-height="40" interval-width="72" format="24hr" interval-highlight="" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 09:30&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('f6552c73', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e8d33f91', 'id'))}">\`
elements+=\`Categories\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4fb304df', 'id'))}">\`
elements+=\`The category view compares schedules side by side. Categories accept a JSON string or a JavaScript array; events map through \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a03aba3b', 'id'))}">\`
elements+=\`event-category\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('381015d9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--category" id="\${ty_escapeAttr(ty_generateId('9c69f716', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule w-calendar-category" style="--w-calendar-days:2" id="\${ty_escapeAttr(ty_generateId('a6347aaf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('ef51e7e1', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('0bfa3807', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-headers" id="\${ty_escapeAttr(ty_generateId('b2380dcb', 'id'))}">\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('e49eed95', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('a3195698', 'id'))}">\`
elements+=\`Design\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-header" id="\${ty_escapeAttr(ty_generateId('5d2ca52e', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('83510b71', 'id'))}">\`
elements+=\`Operations\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-category-columns" id="\${ty_escapeAttr(ty_generateId('5b986b14', 'id'))}">\`
elements+=\`<div class="w-calendar-category-column" data-category="Design" id="\${ty_escapeAttr(ty_generateId('8af57f61', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-category-column" data-category="Operations" id="\${ty_escapeAttr(ty_generateId('8ecbce45', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3b767fe9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="category" value="2026-06-13" categories="[&quot;Design&quot;,&quot;Operations&quot;]" category-show-all="" first-interval="8" interval-count="11" event-color="color" events="[{&quot;name&quot;:&quot;Wireframes&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:30&quot;,&quot;category&quot;:&quot;Design&quot;,&quot;color&quot;:&quot;primary&quot;},{&quot;name&quot;:&quot;Deploy&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;,&quot;category&quot;:&quot;Operations&quot;,&quot;color&quot;:&quot;success&quot;}]" id="\${ty_escapeAttr(ty_generateId('a9c1c8c8', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ee32acf6', 'id'))}">\`
elements+=\`Custom Ranges\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0d65940a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('208877ec', 'id'))}">\`
elements+=\`custom-weekly\`
elements+=\`</code>\`
elements+=\` renders week rows between explicit dates; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2f47599', 'id'))}">\`
elements+=\`custom-daily\`
elements+=\`</code>\`
elements+=\` renders interval columns. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8bc94772', 'id'))}">\`
elements+=\`max-days\`
elements+=\`</code>\`
elements+=\` caps open-ended daily ranges.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('de9d3424', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f44c3dcd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-weekly" id="\${ty_escapeAttr(ty_generateId('6218e282', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('0ed65819', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('4cfcb052', 'id'))}">\`
elements+=\`Jun 8 – Jun 19, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('2e06d34f', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-week" id="\${ty_escapeAttr(ty_generateId('6439ae21', 'id'))}">\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar w-calendar--custom-daily" id="\${ty_escapeAttr(ty_generateId('c9954d94', 'id'))}">\`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('41271f2a', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('db265978', 'id'))}">\`
elements+=\`Jun 8–10, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" style="--w-calendar-days:3" id="\${ty_escapeAttr(ty_generateId('a8c07361', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('2898ef8b', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('12cf6749', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('662d8816', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('843e1f4c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('3449b91f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-weekly" value="2026-06-08" start="2026-06-08" end="2026-06-19" first-day-of-week="1" id="\${ty_escapeAttr(ty_generateId('1bb760b2', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
      \`
elements+=\`<w-calendar type="custom-daily" value="2026-06-08" start="2026-06-08" end="2026-06-10" first-interval="8" interval-count="8" id="\${ty_escapeAttr(ty_generateId('c16aa850', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cc1a2cb2', 'id'))}">\`
elements+=\`Event Mapping and Overflow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5ccf01a3', 'id'))}">\`
elements+=\`Map alternative event fields with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d33c60ba', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3b73303', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a53d92eb', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24878f63', 'id'))}">\`
elements+=\`event-timed\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1e31022a', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`. Month cells show three events before a configurable “more” action.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('66eaee7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar-day selected" id="\${ty_escapeAttr(ty_generateId('cd8b17cd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-calendar-day-button" type="button" id="\${ty_escapeAttr(ty_generateId('6d355dcf', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-day-events" id="\${ty_escapeAttr(ty_generateId('28a01574', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:#155e75;--w-calendar-event-text:#fff" id="\${ty_escapeAttr(ty_generateId('e252db3e', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-success);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('14398167', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-event" style="--w-calendar-event-color:var(--w-tertiary);--w-calendar-event-text:var(--w-on-primary)" id="\${ty_escapeAttr(ty_generateId('ef08e481', 'id'))}">\`
elements+=\`Retrospective\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-calendar-more" type="button" id="\${ty_escapeAttr(ty_generateId('2b731fc6', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('aa5454ed', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar value="2026-06-13" event-name="title" event-start="begins" event-end="finishes" event-color="tone" event-more-text="&#123;count&#125; additional" events="[{&quot;title&quot;:&quot;Design review&quot;,&quot;begins&quot;:&quot;2026-06-13 09:00&quot;,&quot;finishes&quot;:&quot;2026-06-13 10:00&quot;,&quot;tone&quot;:&quot;#155e75&quot;},{&quot;title&quot;:&quot;Launch&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;success&quot;},{&quot;title&quot;:&quot;Retrospective&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;tertiary&quot;},{&quot;title&quot;:&quot;Planning&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;primary&quot;},{&quot;title&quot;:&quot;Handoff&quot;,&quot;begins&quot;:&quot;2026-06-13&quot;,&quot;tone&quot;:&quot;secondary&quot;}]" id="\${ty_escapeAttr(ty_generateId('b514b958', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('68dc2577', 'id'))}">\`
elements+=\`Custom Content\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e8819036', 'id'))}">\`
elements+=\`Vue slots become framework-neutral rendering callbacks in DuVay. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3aca5feb', 'id'))}">\`
elements+=\`dayContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9e402c9', 'id'))}">\`
elements+=\`dayHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32a3b486', 'id'))}">\`
elements+=\`dayBodyContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f30be095', 'id'))}">\`
elements+=\`intervalContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a0dab81', 'id'))}">\`
elements+=\`intervalHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('219d5ff9', 'id'))}">\`
elements+=\`eventContent\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('283db249', 'id'))}">\`
elements+=\`categoryContent\`
elements+=\`</code>\`
elements+=\` to return application-owned markup.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('61934d7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('a537295c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-header" id="\${ty_escapeAttr(ty_generateId('28b409b3', 'id'))}">\`
elements+=\`<strong class="w-calendar-title" id="\${ty_escapeAttr(ty_generateId('8014e83a', 'id'))}">\`
elements+=\`June 13, 2026\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('4cf8fa86', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-head" id="\${ty_escapeAttr(ty_generateId('c75c6d63', 'id'))}">\`
elements+=\`<div class="w-calendar-gutter-head" id="\${ty_escapeAttr(ty_generateId('bb9806e5', 'id'))}">\`
elements+=\`Time\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-headers" id="\${ty_escapeAttr(ty_generateId('4e0eeafe', 'id'))}">\`
elements+=\`<div class="w-calendar-day-header" id="\${ty_escapeAttr(ty_generateId('b7ce6a40', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('0a83d49e', 'id'))}">\`
elements+=\`Sat\`
elements+=\`</span>\`
elements+=\`<button type="button" id="\${ty_escapeAttr(ty_generateId('5df5fb87', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-header-content" id="\${ty_escapeAttr(ty_generateId('ac278161', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('01ae9c05', 'id'))}">\`
elements+=\`Focus day\`
elements+=\`</strong>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('8606c9b9', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('5ccbd886', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('34444083', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('123c8658', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('41fdb4a9', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('60be9706', 'id'))}">\`
elements+=\`<span class="w-calendar-interval-content" id="\${ty_escapeAttr(ty_generateId('545b0116', 'id'))}">\`
elements+=\`9 o'clock\`
elements+=\`</span>\`
elements+=\`</button>\`
elements+=\`<div class="w-calendar-day-body-content" id="\${ty_escapeAttr(ty_generateId('df4afa40', 'id'))}">\`
elements+=\`<span class="w-calendar-current-time" style="top:24px" id="\${ty_escapeAttr(ty_generateId('90ef78ba', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cb819bd3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar data-calendar-custom-content="" type="day" value="2026-06-13" now="2026-06-13 09:30" first-interval="9" interval-count="4" events="[{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 10:00&quot;,&quot;end&quot;:&quot;2026-06-13 11:00&quot;}]" id="\${ty_escapeAttr(ty_generateId('aa84b137', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('058cd4cf', 'id'))}">\`
elements+=\`Native Drag and Drop\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('aee69441', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1556da4a', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\` makes event controls draggable. Dropping a timed event onto an interval preserves its duration, updates the source event, and emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('71694978', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('057eb75c', 'id'))}">\`
elements+=\`reason: "event-drop"\`
elements+=\`</code>\`
elements+=\`. Native drag events continue to bubble for application-specific behavior.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2dd7501c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-calendar w-calendar--day" id="\${ty_escapeAttr(ty_generateId('a2911f9b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-calendar-schedule" style="--w-calendar-days:1" id="\${ty_escapeAttr(ty_generateId('14a1f220', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-calendar-schedule-scroll" id="\${ty_escapeAttr(ty_generateId('8b3aba6a', 'id'))}">\`
elements+=\`<div class="w-calendar-time-axis" id="\${ty_escapeAttr(ty_generateId('bf67ed85', 'id'))}">\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('c3732654', 'id'))}">\`
elements+=\`9 AM\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-time-label" id="\${ty_escapeAttr(ty_generateId('d1392644', 'id'))}">\`
elements+=\`10 AM\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-day-columns" id="\${ty_escapeAttr(ty_generateId('5beca88b', 'id'))}">\`
elements+=\`<div class="w-calendar-day-column" id="\${ty_escapeAttr(ty_generateId('d3bd12f9', 'id'))}">\`
elements+=\`<div class="w-calendar-intervals" id="\${ty_escapeAttr(ty_generateId('97ad6d2e', 'id'))}">\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('0d30a403', 'id'))}">\`
elements+=\`</button>\`
elements+=\`<button class="w-calendar-interval" id="\${ty_escapeAttr(ty_generateId('5e6265d7', 'id'))}">\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`<div class="w-calendar-timed-events" id="\${ty_escapeAttr(ty_generateId('eab3523a', 'id'))}">\`
elements+=\`<button class="w-calendar-event w-calendar-event--timed" draggable="true" style="top:0;height:48px" id="\${ty_escapeAttr(ty_generateId('6ac6c61b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3643c254', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-calendar type="day" value="2026-06-13" first-interval="9" interval-count="6" interval-highlight="" event-draggable="" events="[{&quot;name&quot;:&quot;Planning&quot;,&quot;start&quot;:&quot;2026-06-13 09:00&quot;,&quot;end&quot;:&quot;2026-06-13 10:00&quot;},{&quot;name&quot;:&quot;Review&quot;,&quot;start&quot;:&quot;2026-06-13 11:00&quot;,&quot;end&quot;:&quot;2026-06-13 12:30&quot;}]" id="\${ty_escapeAttr(ty_generateId('06a5461b', 'id'))}">\`
elements+=\`</w-calendar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('648fa99d', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('eb6bf990', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('e03d88bf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('28899f91', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e4e39d97', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('e2495d1e', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('990a4938', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3b24fd04', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a5f44a6a', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('b5f01fa6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c71c4fe4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('223d6b48', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb5ee19c', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4aa4c1b8', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d99103a1', 'id'))}">\`
elements+=\`today\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fe242298', 'id'))}">\`
elements+=\`Active date and navigation anchor.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bbc44456', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4f7fe9d4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69cee0ce', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('317b0917', 'id'))}">\`
elements+=\`month | week | day | 4day | custom-weekly | custom-daily | category\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd882631', 'id'))}">\`
elements+=\`month\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f187f5e', 'id'))}">\`
elements+=\`Calendar view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('af1a94b7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('89f8e01e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a76b4eae', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('285724b7', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abe1e38b', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0b7b71e0', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f085ebdd', 'id'))}">\`
elements+=\`Inclusive range for custom views.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bb8c8632', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e08d925a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8725f64c', 'id'))}">\`
elements+=\`month\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('21619a82', 'id'))}">\`
elements+=\`year\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f69adfaf', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a6b53014', 'id'))}">\`
elements+=\`from value\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7af575eb', 'id'))}">\`
elements+=\`Legacy displayed-month overrides.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f831be6a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('26d9a566', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3646c2a3', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73799ec6', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b0c1117', 'id'))}">\`
elements+=\`YYYY-MM-DD\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b825e0f', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fea767e5', 'id'))}">\`
elements+=\`Selectable date bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('99075bc7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('717b047d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e578798', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('55fbcfdf', 'id'))}">\`
elements+=\`JSON array&lt;0–6&gt;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53204c72', 'id'))}">\`
elements+=\`[0,1,2,3,4,5,6]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a89c38df', 'id'))}">\`
elements+=\`Visible weekdays; Sunday is 0.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3d0fc26c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06d1cf77', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6cd0daa3', 'id'))}">\`
elements+=\`first-day-of-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2246499b', 'id'))}">\`
elements+=\`0–6\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3309cf4e', 'id'))}">\`
elements+=\`0\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2105f2c', 'id'))}">\`
elements+=\`First weekday column.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bcb3c995', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('92955607', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('549c0098', 'id'))}">\`
elements+=\`first-day-of-year\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3533088f', 'id'))}">\`
elements+=\`1–7\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0bf71287', 'id'))}">\`
elements+=\`4\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('299e9757', 'id'))}">\`
elements+=\`Week-number rule.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c88531e2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0a412943', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b9e3f93', 'id'))}">\`
elements+=\`locale\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cea623b5', 'id'))}">\`
elements+=\`BCP 47 locale\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5655c18d', 'id'))}">\`
elements+=\`document language\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8cb4c912', 'id'))}">\`
elements+=\`Labels and times.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9d6b8d15', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5fe004ce', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb81b6bb', 'id'))}">\`
elements+=\`now\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('184fba44', 'id'))}">\`
elements+=\`date or datetime\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fd3a97f9', 'id'))}">\`
elements+=\`system now\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ba6bf5c0', 'id'))}">\`
elements+=\`Overrides today/current-time styling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0ae9499c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('75d0a293', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('52c47154', 'id'))}">\`
elements+=\`format\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('724f3799', 'id'))}">\`
elements+=\`ampm | 24hr\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e6317766', 'id'))}">\`
elements+=\`locale\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e6992a6f', 'id'))}">\`
elements+=\`Clock convention.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('33804e31', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('972184a2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4bd972be', 'id'))}">\`
elements+=\`short-weekdays\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64215a9e', 'id'))}">\`
elements+=\`short-months\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('98492abb', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('94262720', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b8da185', 'id'))}">\`
elements+=\`Use abbreviated labels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('98cc17a9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cfe219dd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59ded76e', 'id'))}">\`
elements+=\`show-month-on-first\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('97a9da42', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d6128272', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4e3a78e8', 'id'))}">\`
elements+=\`Prefix the first day with its month.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cb8e398e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('24e86a0b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8290b82c', 'id'))}">\`
elements+=\`show-week\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('97c45b1e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b37d2863', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7da8206a', 'id'))}">\`
elements+=\`Show week numbers in month/custom-weekly views.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c331b9f7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a88a8f2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('206a5274', 'id'))}">\`
elements+=\`hide-header\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3707f1c5', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b4500ca1', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c71313fd', 'id'))}">\`
elements+=\`Hide title and navigation controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2f9c7cfe', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d27f2c5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('feedf61a', 'id'))}">\`
elements+=\`min-weeks\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f73213c6', 'id'))}">\`
elements+=\`max-days\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f95c5a9', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9792eeba', 'id'))}">\`
elements+=\`1 / 7\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('12b1a2eb', 'id'))}">\`
elements+=\`Minimum month rows and custom-daily cap.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('00213021', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('617ba2b9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc1fd58d', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10c74603', 'id'))}">\`
elements+=\`JSON array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2aa70cc2', 'id'))}">\`
elements+=\`[]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ebcdf3db', 'id'))}">\`
elements+=\`Event records; JavaScript arrays can also be assigned to the property.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1a0f3484', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b506c939', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c660ef89', 'id'))}">\`
elements+=\`event-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c24d7a65', 'id'))}">\`
elements+=\`event-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa9446fb', 'id'))}">\`
elements+=\`event-name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('58a1a895', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('09d3afe3', 'id'))}">\`
elements+=\`start / end / name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('05f06400', 'id'))}">\`
elements+=\`Event field mappings.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('79237642', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('60a3eb53', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b4378c4', 'id'))}">\`
elements+=\`event-timed\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ba9a16d', 'id'))}">\`
elements+=\`event-category\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('047c2ad2', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33fea3c6', 'id'))}">\`
elements+=\`timed / category\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('903f275e', 'id'))}">\`
elements+=\`Timed and category field mappings.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('661396cd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('386ca43d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b7ace2fa', 'id'))}">\`
elements+=\`event-color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4e9f189', 'id'))}">\`
elements+=\`event-text-color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0ad22f40', 'id'))}">\`
elements+=\`token, CSS color, or field name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c9ba0d64', 'id'))}">\`
elements+=\`primary / on-primary\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5985be24', 'id'))}">\`
elements+=\`Event colors.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('16b49f6b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e486c80', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b530db7', 'id'))}">\`
elements+=\`event-height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d4a77308', 'id'))}">\`
elements+=\`event-margin-bottom\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9c13e027', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('398d7d68', 'id'))}">\`
elements+=\`20 / 1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('56996f0a', 'id'))}">\`
elements+=\`Event geometry in pixels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('74bccf02', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ad289ab9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88a10e7f', 'id'))}">\`
elements+=\`event-overlap-mode\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ade98708', 'id'))}">\`
elements+=\`stack | column\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29a6448d', 'id'))}">\`
elements+=\`stack\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('77802b8c', 'id'))}">\`
elements+=\`Timed event overlap layout; assign a function through the matching property for custom geometry.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0485dcc5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b66f93b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e18b7335', 'id'))}">\`
elements+=\`event-overlap-threshold\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d871f21f', 'id'))}">\`
elements+=\`minutes\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f657dfb5', 'id'))}">\`
elements+=\`60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('81b18e1a', 'id'))}">\`
elements+=\`Overlap grouping threshold.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f6b2e52a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('48dbf663', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c56d2944', 'id'))}">\`
elements+=\`event-more\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d4506950', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7fb7980c', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40ae1f07', 'id'))}">\`
elements+=\`Collapse crowded month cells.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('57bfaedd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ce040f83', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1546d067', 'id'))}">\`
elements+=\`event-more-text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('625b3038', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5aa13320', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abf6c018', 'id'))}">\`
elements+=\`&#123;count&#125; more\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('540c3ff2', 'id'))}">\`
elements+=\`Overflow label template.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7afe6315', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e98a6655', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e47785d', 'id'))}">\`
elements+=\`event-ripple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('700dae47', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a6652bc', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3f3374b5', 'id'))}">\`
elements+=\`Add ripple styling to event controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('355b3402', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2386ca0e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c791e333', 'id'))}">\`
elements+=\`event-draggable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('80c3c5eb', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('454e0831', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1096db7c', 'id'))}">\`
elements+=\`Enable native drag-and-drop rescheduling for timed events.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('51f7a343', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8d1254bb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c08be974', 'id'))}">\`
elements+=\`first-interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e143ad1', 'id'))}">\`
elements+=\`first-time\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9399c02d', 'id'))}">\`
elements+=\`number / HH:mm\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c48fa7b5', 'id'))}">\`
elements+=\`0 / &#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8083acbd', 'id'))}">\`
elements+=\`Schedule start; first-time takes precedence.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('55dc3921', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91e3a393', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8485350', 'id'))}">\`
elements+=\`interval-count\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4718a51', 'id'))}">\`
elements+=\`interval-minutes\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61b5f640', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c43f2cd3', 'id'))}">\`
elements+=\`24 / 60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4eca84b8', 'id'))}">\`
elements+=\`Visible interval count and duration.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('71a3e143', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ba610e4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09cc1140', 'id'))}">\`
elements+=\`interval-height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8cf0ca3', 'id'))}">\`
elements+=\`interval-width\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b7e795da', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('63f3b209', 'id'))}">\`
elements+=\`48 / 60\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3019aa3e', 'id'))}">\`
elements+=\`Interval row and gutter geometry in pixels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b6acdc1d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b6a8a8b2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('80c535d5', 'id'))}">\`
elements+=\`short-intervals\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e5b6f6e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('44bfd155', 'id'))}">\`
elements+=\`true\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1d81e794', 'id'))}">\`
elements+=\`Omit zero minutes from concise interval labels.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a285978a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('84ec61bf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c257fb49', 'id'))}">\`
elements+=\`interval-highlight\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e22969c', 'id'))}">\`
elements+=\`boolean | color\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ecc1720e', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('970655a2', 'id'))}">\`
elements+=\`Highlight interval rows on hover, optionally with a theme token or CSS color.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('694253b9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('71f87a10', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d87d27a', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7c38936f', 'id'))}">\`
elements+=\`JSON array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f9b96947', 'id'))}">\`
elements+=\`[]\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f66553df', 'id'))}">\`
elements+=\`Category strings or objects.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1a49d553', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7eb90d9f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28365d53', 'id'))}">\`
elements+=\`category-days\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eaad292f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9e4d810', 'id'))}">\`
elements+=\`1\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('efd30bea', 'id'))}">\`
elements+=\`Days shown in category view.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('31d7ac3b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4009c247', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2690bc43', 'id'))}">\`
elements+=\`category-text\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6ec10dc0', 'id'))}">\`
elements+=\`field name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1f90277e', 'id'))}">\`
elements+=\`name\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2987f086', 'id'))}">\`
elements+=\`Category object label field.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cb5624a6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cce2e27f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58ccd873', 'id'))}">\`
elements+=\`category-hide-dynamic\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53f2093f', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c9d77022', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4eae5b9a', 'id'))}">\`
elements+=\`Exclude event-defined categories.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('14afe89b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7de473ea', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9f3d395a', 'id'))}">\`
elements+=\`category-show-all\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7994a15a', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0f45c850', 'id'))}">\`
elements+=\`false\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('54a5d30d', 'id'))}">\`
elements+=\`Show categories with no events.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e221d383', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('07061d10', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d76132f0', 'id'))}">\`
elements+=\`category-for-invalid\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d415dd20', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cbb74a09', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b2f6950', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0ac82acb', 'id'))}">\`
elements+=\`JavaScript Properties\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('78c5947f', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('cf84296a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2431d37d', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c05bd47f', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cd904561', 'id'))}">\`
elements+=\`Property\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('71ed89af', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5c5ce3e7', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('d4ae9a2e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e2873f36', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e1d0f4fe', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d651db69', 'id'))}">\`
elements+=\`events\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f91390cd', 'id'))}">\`
elements+=\`categories\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67df059d', 'id'))}">\`
elements+=\`weekdays\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('51626ee8', 'id'))}">\`
elements+=\`array\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f9b96b63', 'id'))}">\`
elements+=\`Assign arrays directly without serializing them.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('79e9f2aa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3269948d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('410355fc', 'id'))}">\`
elements+=\`dayFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5a150c53', 'id'))}">\`
elements+=\`weekdayFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('338081eb', 'id'))}">\`
elements+=\`monthFormat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dbea8bd1', 'id'))}">\`
elements+=\`intervalFormat\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bdf18b6c', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df56cf70', 'id'))}">\`
elements+=\`Custom label formatters.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('03f7aee0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7283f848', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37800e99', 'id'))}">\`
elements+=\`showIntervalLabel\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('349a5a28', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed5d2c13', 'id'))}">\`
elements+=\`Returns whether an interval label is visible.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dff20039', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fdbf9f41', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('643de4e0', 'id'))}">\`
elements+=\`intervalStyle\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40f21873', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0955b8cb', 'id'))}">\`
elements+=\`Returns inline styles for an interval cell.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('07f59658', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7c7cdd22', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('088dbb50', 'id'))}">\`
elements+=\`eventName\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d137640', 'id'))}">\`
elements+=\`eventColor\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f0e4581', 'id'))}">\`
elements+=\`eventTextColor\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ffdf9386', 'id'))}">\`
elements+=\`eventTimed\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('370f9fc2', 'id'))}">\`
elements+=\`eventCategory\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('25723b4b', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('963beb3d', 'id'))}">\`
elements+=\`Event accessors; functions receive the source record.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ae209c90', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b1c8054', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('56eaf1ad', 'id'))}">\`
elements+=\`eventOverlapMode\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d10a1832', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('408cb947', 'id'))}">\`
elements+=\`Accepts \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06512041', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e55cfb6', 'id'))}">\`
elements+=\`column\`
elements+=\`</code>\`
elements+=\`, or a Vuetify-compatible visual layout factory.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('48526f1d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('20d5a3d7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c22ea6a2', 'id'))}">\`
elements+=\`eventRipple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('081db0d8', 'id'))}">\`
elements+=\`boolean | object\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c3599f41', 'id'))}">\`
elements+=\`Enables ripple styling; object values can carry application-specific ripple configuration.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cd833588', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f6715faf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('91187504', 'id'))}">\`
elements+=\`categoryText\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('950b10fd', 'id'))}">\`
elements+=\`string | function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('35da27b5', 'id'))}">\`
elements+=\`Category label accessor.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dddc51ea', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('641b7db2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('818fcfbd', 'id'))}">\`
elements+=\`dayContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f57f1a19', 'id'))}">\`
elements+=\`dayHeaderContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d12f1997', 'id'))}">\`
elements+=\`dayBodyContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('448c47d0', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('692307ca', 'id'))}">\`
elements+=\`Framework-neutral counterparts to Vuetify day slots.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a9c5f1cc', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3a8649de', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('62527774', 'id'))}">\`
elements+=\`intervalContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca0d7d58', 'id'))}">\`
elements+=\`intervalHeaderContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6afa6973', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13f6ada9', 'id'))}">\`
elements+=\`Render custom interval and gutter content.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('648b425b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1a42243c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('209da6f9', 'id'))}">\`
elements+=\`eventContent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43f0c6a0', 'id'))}">\`
elements+=\`categoryContent\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7cd4c02c', 'id'))}">\`
elements+=\`function\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('00761b1a', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c6bcc472', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('382574a4', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('a15ef7e4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('438487e2', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('42c1587d', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('1c53ae23', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5d1b8f65', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4cbad2f1', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('c0c080b3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d2c1814f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('95ce2fa3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67852f84', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('44d03b64', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e9960e03', 'id'))}">\`
elements+=\`&#123; value, date, kind &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d4cb7a7', 'id'))}">\`
elements+=\`Fired when a date is selected.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ac895b44', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f1d6ec83', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a3dd32e', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bc668756', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b00c1cdd', 'id'))}">\`
elements+=\`&#123; reason, value, start, end, type &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b46a5f96', 'id'))}">\`
elements+=\`Fired when selection or visible range changes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5ed1a0e7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a142c2fb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('865af7b8', 'id'))}">\`
elements+=\`moved\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d28f131b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37f43294', 'id'))}">\`
elements+=\`&#123; reason, value, start, end, type &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10d97f23', 'id'))}">\`
elements+=\`Fired after \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8185b2a4', 'id'))}">\`
elements+=\`next()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('539a2023', 'id'))}">\`
elements+=\`prev()\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60e5548d', 'id'))}">\`
elements+=\`move()\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d01e9f72', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('87faeb02', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ddfe101', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d248442d', 'id'))}">\`
elements+=\`click\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('107eecb0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0aeb8c3f', 'id'))}">\`
elements+=\`&#123; kind, date, time?, category?, event? &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ace83d6a', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bdb3dba1', 'id'))}">\`
elements+=\`Methods\`
elements+=\`</h2>\`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('3ab1ec71', 'id'))}">\`
elements+=\`
  \`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('a01e1d65', 'id'))}">\`
elements+=\`
    \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('b19f766b', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('70891b10', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d2e40d47', 'id'))}">\`
elements+=\`Method\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('387ede69', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
    \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('7413b9ee', 'id'))}">\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f4b0bb13', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c3130a63', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb52ace3', 'id'))}">\`
elements+=\`next(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dcd4f1f7', 'id'))}">\`
elements+=\`Move forward by the current view span.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7665b66a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('98babe74', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3489b38', 'id'))}">\`
elements+=\`prev(amount = 1)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('413ca952', 'id'))}">\`
elements+=\`Move backward by the current view span.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('18df669d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af07b50d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc8b9a41', 'id'))}">\`
elements+=\`move(amount)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aaeb03c6', 'id'))}">\`
elements+=\`Move in either direction.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('10bbfdb2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e974f140', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c9881d1b', 'id'))}">\`
elements+=\`today()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2fb93fc9', 'id'))}">\`
elements+=\`Move to the current or overridden \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('71962b5f', 'id'))}">\`
elements+=\`now\`
elements+=\`</code>\`
elements+=\` date.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d0d65682', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f73ba277', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e69f9606', 'id'))}">\`
elements+=\`scrollToTime(value)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('edb8156e', 'id'))}">\`
elements+=\`Scroll interval views to minutes since midnight or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e464aa02', 'id'))}">\`
elements+=\`HH:mm\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a1fc09ce', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fa87487d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9967a888', 'id'))}">\`
elements+=\`minutesToPixels(minutes)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('43897c37', 'id'))}">\`
elements+=\`Convert a duration to pixels using the active interval scale.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2ea7984e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('11e9d4dd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5df423e3', 'id'))}">\`
elements+=\`timeDelta(value)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8b8d7ef', 'id'))}">\`
elements+=\`Return a time's fractional position in the visible interval range.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('961ce6ee', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('badeda59', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('479ecf64', 'id'))}">\`
elements+=\`timeToY(value, clamp = false)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('590d1ed6', 'id'))}">\`
elements+=\`Return a time's vertical pixel position for custom day-body treatments.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9164d6ca', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61e28769', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30062461', 'id'))}">\`
elements+=\`checkChange()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64d6c85c', 'id'))}">\`
elements+=\`Emit and return the current visible range metadata.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ce54af99', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6ab9e6c7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fec00801', 'id'))}">\`
elements+=\`updateTimes()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cc43adf6', 'id'))}">\`
elements+=\`Refresh relative date state and return the current time metadata.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
      \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c7770a76', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2b32c51d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7ebcd05e', 'id'))}">\`
elements+=\`getVisibleRange()\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10e96cd9', 'id'))}">\`
elements+=\`Return \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8932878', 'id'))}">\`
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
