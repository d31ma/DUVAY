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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('c598b938', 'id'))}">\`
elements+=\`Time Pickers\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9559d7bd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('887f9235', 'id'))}">\`
elements+=\`w-time-picker\`
elements+=\`</code>\`
elements+=\` is a standalone clock picker inspired by Vuetify's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cc75717', 'id'))}">\`
elements+=\`v-time-picker\`
elements+=\`</code>\`
elements+=\`. It supports AM/PM and 24-hour display, seconds, allowed time windows, scroll-wheel editing, input fields, color, elevation, density, and compact headers while keeping the canonical value in 24-hour \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e6115518', 'id'))}">\`
elements+=\`HH:MM\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5334a174', 'id'))}">\`
elements+=\`HH:MM:SS\`
elements+=\`</code>\`
elements+=\` format.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b594f1cb', 'id'))}">\`
elements+=\`Clock\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-time-picker-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0d5f3480', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-time-picker" id="\${ty_escapeAttr(ty_generateId('5bb13eac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-title" id="\${ty_escapeAttr(ty_generateId('60cd9d81', 'id'))}">\`
elements+=\`Select time\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-label" id="\${ty_escapeAttr(ty_generateId('586221f6', 'id'))}">\`
elements+=\`Time\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('f1f44c20', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display active" type="button" id="\${ty_escapeAttr(ty_generateId('71407ac1', 'id'))}">\`
elements+=\`09\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('71266117', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display" type="button" id="\${ty_escapeAttr(ty_generateId('ecc575ba', 'id'))}">\`
elements+=\`30\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-time-picker-period" id="\${ty_escapeAttr(ty_generateId('6037dc62', 'id'))}">\`
elements+=\`<button class="active" id="\${ty_escapeAttr(ty_generateId('9377269c', 'id'))}">\`
elements+=\`AM\`
elements+=\`</button>\`
elements+=\`<button id="\${ty_escapeAttr(ty_generateId('1c105433', 'id'))}">\`
elements+=\`PM\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('9a11d339', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item" style="left:71%;top:14%" id="\${ty_escapeAttr(ty_generateId('95db2666', 'id'))}">\`
elements+=\`1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item" style="left:86%;top:29%" id="\${ty_escapeAttr(ty_generateId('2fa0a6ee', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:8%;top:50%" id="\${ty_escapeAttr(ty_generateId('7180bd91', 'id'))}">\`
elements+=\`9\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:270deg" id="\${ty_escapeAttr(ty_generateId('9c815fb1', 'id'))}">\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a668deca', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-time-picker label="Time" value="09:30" id="\${ty_escapeAttr(ty_generateId('c9293705', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b3870bcb', 'id'))}">\`
elements+=\`Allowed Times\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2237023d', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de334534', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f11b56ca', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ee90e64', 'id'))}">\`
elements+=\`allowed-hours\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a9c2012', 'id'))}">\`
elements+=\`allowed-minutes\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2a33955', 'id'))}">\`
elements+=\`allowed-seconds\`
elements+=\`</code>\`
elements+=\` to constrain choices. Pass allowed values as JSON arrays.\`
elements+=\`</p>\`
elements+=\`<demo-compare class="docs-time-picker-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6f4de85d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-time-picker w-time-picker--format-24hr" id="\${ty_escapeAttr(ty_generateId('57983d9c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-title" id="\${ty_escapeAttr(ty_generateId('ff358a57', 'id'))}">\`
elements+=\`Allowed window\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('e88bc775', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display active" type="button" id="\${ty_escapeAttr(ty_generateId('ee2b889e', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('268635ce', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`<button class="w-time-picker-display" type="button" id="\${ty_escapeAttr(ty_generateId('2ed32dd2', 'id'))}">\`
elements+=\`15\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('7e698f35', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item disabled" style="left:75%;top:7%" disabled="" id="\${ty_escapeAttr(ty_generateId('9be3d37e', 'id'))}">\`
elements+=\`10\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:63%;top:23%" id="\${ty_escapeAttr(ty_generateId('4c17808a', 'id'))}">\`
elements+=\`11\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item" style="left:71%;top:86%" id="\${ty_escapeAttr(ty_generateId('9e1703ee', 'id'))}">\`
elements+=\`13\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:165deg" id="\${ty_escapeAttr(ty_generateId('b62121c7', 'id'))}">\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5a8be4e6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-time-picker value="11:15" format="24hr" min="09:30" max="22:15" allowed-hours="[9,11,13,15,17,19,21]" allowed-minutes="10,15,20,25,30,35,40,45,50" scrollable="" id="\${ty_escapeAttr(ty_generateId('577b2d64', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('267c1164', 'id'))}">\`
elements+=\`Color and Elevation\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-time-picker-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b13132b9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-time-picker w-time-picker--color-success w-time-picker--elevation-4" style="width:320px" id="\${ty_escapeAttr(ty_generateId('b28dd49f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-title" id="\${ty_escapeAttr(ty_generateId('9e1c347c', 'id'))}">\`
elements+=\`Release window\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-label" id="\${ty_escapeAttr(ty_generateId('ee680a66', 'id'))}">\`
elements+=\`Success color\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('c2bfb63b', 'id'))}">\`
elements+=\`<button class="w-time-picker-display active" id="\${ty_escapeAttr(ty_generateId('3d58aafb', 'id'))}">\`
elements+=\`02\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('6f7a4b3b', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`<button class="w-time-picker-display" id="\${ty_escapeAttr(ty_generateId('5971002e', 'id'))}">\`
elements+=\`45\`
elements+=\`</button>\`
elements+=\`<div class="w-time-picker-period" id="\${ty_escapeAttr(ty_generateId('3b359e5f', 'id'))}">\`
elements+=\`<button id="\${ty_escapeAttr(ty_generateId('5a03e3c8', 'id'))}">\`
elements+=\`AM\`
elements+=\`</button>\`
elements+=\`<button class="active" id="\${ty_escapeAttr(ty_generateId('20d573b7', 'id'))}">\`
elements+=\`PM\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('b70bce75', 'id'))}">\`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:86%;top:29%" id="\${ty_escapeAttr(ty_generateId('eadc647a', 'id'))}">\`
elements+=\`2\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:60deg" id="\${ty_escapeAttr(ty_generateId('12e1e64d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('517cd7b9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-time-picker value="14:45" color="success" elevation="4" width="320px" title="Release window" label="Success color" id="\${ty_escapeAttr(ty_generateId('6afe7ed6', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('847852dc', 'id'))}">\`
elements+=\`24-hour and Seconds\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-time-picker-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1535fa9a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-time-picker w-time-picker--format-24hr" id="\${ty_escapeAttr(ty_generateId('5625f337', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-title" id="\${ty_escapeAttr(ty_generateId('169c9765', 'id'))}">\`
elements+=\`Deployment window\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-label" id="\${ty_escapeAttr(ty_generateId('3aa52019', 'id'))}">\`
elements+=\`Time\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('6e23c9ee', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display" type="button" id="\${ty_escapeAttr(ty_generateId('73ffbd94', 'id'))}">\`
elements+=\`18\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('ae1efb06', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display active" type="button" id="\${ty_escapeAttr(ty_generateId('9beec738', 'id'))}">\`
elements+=\`45\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('a3456e8a', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-display" type="button" id="\${ty_escapeAttr(ty_generateId('760fb5d5', 'id'))}">\`
elements+=\`00\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('7b2e6484', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item" style="left:50%;top:8%" id="\${ty_escapeAttr(ty_generateId('3b774f10', 'id'))}">\`
elements+=\`00\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:8%;top:50%" id="\${ty_escapeAttr(ty_generateId('ffdd9394', 'id'))}">\`
elements+=\`45\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-time-picker-clock-item" style="left:29%;top:14%" id="\${ty_escapeAttr(ty_generateId('cb5f378c', 'id'))}">\`
elements+=\`55\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:270deg" id="\${ty_escapeAttr(ty_generateId('110956fd', 'id'))}">\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('439afe86', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-time-picker label="Time" title="Deployment window" value="18:45:00" format="24hr" use-seconds="" view="minutes" id="\${ty_escapeAttr(ty_generateId('8f78d075', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e8dd98e8', 'id'))}">\`
elements+=\`No Header, Readonly, and Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-time-picker-demo docs-time-picker-demo--states">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fca682f0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-cluster" id="\${ty_escapeAttr(ty_generateId('55186f9e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker w-time-picker--density-compact" style="width:260px" id="\${ty_escapeAttr(ty_generateId('e64b6421', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('3989aeb3', 'id'))}">\`
elements+=\`<button class="w-time-picker-display active" id="\${ty_escapeAttr(ty_generateId('5a8dd282', 'id'))}">\`
elements+=\`08\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('fbb05ac8', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`<button class="w-time-picker-display" id="\${ty_escapeAttr(ty_generateId('84d75c72', 'id'))}">\`
elements+=\`00\`
elements+=\`</button>\`
elements+=\`<div class="w-time-picker-period" id="\${ty_escapeAttr(ty_generateId('22dbb70e', 'id'))}">\`
elements+=\`<button class="active" id="\${ty_escapeAttr(ty_generateId('e782f5de', 'id'))}">\`
elements+=\`AM\`
elements+=\`</button>\`
elements+=\`<button id="\${ty_escapeAttr(ty_generateId('9641845e', 'id'))}">\`
elements+=\`PM\`
elements+=\`</button>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('57284c33', 'id'))}">\`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:86%;top:71%" id="\${ty_escapeAttr(ty_generateId('79b8b433', 'id'))}">\`
elements+=\`4\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:120deg" id="\${ty_escapeAttr(ty_generateId('c5e3f3fe', 'id'))}">\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('94af6564', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-time-picker-grid" id="\${ty_escapeAttr(ty_generateId('83a6ca42', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-time-picker value="08:00" hide-header="" density="compact" width="100%" id="\${ty_escapeAttr(ty_generateId('f9bab574', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
      \`
elements+=\`<w-time-picker value="09:15" readonly="" ampm-in-title="" title="Readonly" width="100%" density="compact" id="\${ty_escapeAttr(ty_generateId('b16cec00', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
      \`
elements+=\`<w-time-picker value="09:15" disabled="" title="Disabled" width="100%" density="compact" id="\${ty_escapeAttr(ty_generateId('827861c8', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f108e79', 'id'))}">\`
elements+=\`Input Variant\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c5d398cc', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30719d1b', 'id'))}">\`
elements+=\`variant="input"\`
elements+=\`</code>\`
elements+=\` mode exposes numeric fields for hour, minute, and optional seconds while retaining the clock face for quick selection.\`
elements+=\`</p>\`
elements+=\`<demo-compare class="docs-time-picker-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2041e5fe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-time-picker w-time-picker--variant-input w-time-picker--format-24hr" id="\${ty_escapeAttr(ty_generateId('c1582508', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-title" id="\${ty_escapeAttr(ty_generateId('b150ab08', 'id'))}">\`
elements+=\`Manual entry\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-header" id="\${ty_escapeAttr(ty_generateId('e0c93775', 'id'))}">\`
elements+=\`
        \`
elements+=\`<label class="w-time-picker-field active" id="\${ty_escapeAttr(ty_generateId('6b6172aa', 'id'))}">\`
elements+=\`<input value="18" id="\${ty_escapeAttr(ty_generateId('15fd26ff', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('17f62bdf', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<label class="w-time-picker-field" id="\${ty_escapeAttr(ty_generateId('be8e138c', 'id'))}">\`
elements+=\`<input value="45" id="\${ty_escapeAttr(ty_generateId('71dee5e5', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
        \`
elements+=\`<span class="w-time-picker-separator" id="\${ty_escapeAttr(ty_generateId('eff4fe9f', 'id'))}">\`
elements+=\`:\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<label class="w-time-picker-field" id="\${ty_escapeAttr(ty_generateId('c4cc1351', 'id'))}">\`
elements+=\`<input value="30" id="\${ty_escapeAttr(ty_generateId('a68445b7', 'id'))}" />\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-time-picker-clock" id="\${ty_escapeAttr(ty_generateId('9f00a141', 'id'))}">\`
elements+=\`<button class="w-time-picker-clock-item selected" style="left:8%;top:50%" id="\${ty_escapeAttr(ty_generateId('8de62f35', 'id'))}">\`
elements+=\`45\`
elements+=\`</button>\`
elements+=\`<span class="w-time-picker-hand" style="--w-time-picker-angle:270deg" id="\${ty_escapeAttr(ty_generateId('27b4dd4f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e310036d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-time-picker value="18:45:30" format="24hr" use-seconds="" variant="input" title="Manual entry" id="\${ty_escapeAttr(ty_generateId('313f2ffc', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('588ea37d', 'id'))}">\`
elements+=\`Range\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e7376711', 'id'))}">\`
elements+=\`Pair two pickers with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64c3201e', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a98dd693', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` to keep a start/end range valid.\`
elements+=\`</p>\`
elements+=\`<demo-compare class="docs-time-picker-demo docs-time-picker-demo--range">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1b082708', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" style="--w-grid-gutter:var(--w-space-4)" id="\${ty_escapeAttr(ty_generateId('2232ff15', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-col-12 w-col-md-6" id="\${ty_escapeAttr(ty_generateId('a488169c', 'id'))}">\`
elements+=\`<div class="w-card w-card-body" id="\${ty_escapeAttr(ty_generateId('81934d47', 'id'))}">\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('38fc4a23', 'id'))}">\`
elements+=\`Start\`
elements+=\`</h3>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c8eb0136', 'id'))}">\`
elements+=\`Uses \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03f27f39', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` from the end picker.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-col-12 w-col-md-6" id="\${ty_escapeAttr(ty_generateId('fe244324', 'id'))}">\`
elements+=\`<div class="w-card w-card-body" id="\${ty_escapeAttr(ty_generateId('60ef5593', 'id'))}">\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('264c03ce', 'id'))}">\`
elements+=\`End\`
elements+=\`</h3>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dd02dfcf', 'id'))}">\`
elements+=\`Uses \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9e4e9fb3', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` from the start picker.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('99736854', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-time-picker-grid" id="\${ty_escapeAttr(ty_generateId('5bf81ea2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-time-picker title="Start" value="09:30" max="17:00" width="100%" density="compact" id="\${ty_escapeAttr(ty_generateId('79803d58', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
      \`
elements+=\`<w-time-picker title="End" value="17:00" min="09:30" width="100%" density="compact" id="\${ty_escapeAttr(ty_generateId('c0c83c25', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3a179662', 'id'))}">\`
elements+=\`Dialog and Menu Composition\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5f904c57', 'id'))}">\`
elements+=\`Time pickers are standalone, so they can sit inside menus, dialogs, cards, and custom popovers.\`
elements+=\`</p>\`
elements+=\`<demo-compare class="docs-time-picker-demo docs-time-picker-demo--composition">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('83f1f84a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-card w-card-body" style="max-width:420px" id="\${ty_escapeAttr(ty_generateId('9f6c51c2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('4d65b93d', 'id'))}">\`
elements+=\`Picker in overlay\`
elements+=\`</h3>\`
elements+=\`
      \`
elements+=\`<p class="w-text-subtle" id="\${ty_escapeAttr(ty_generateId('c1506a06', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2622063', 'id'))}">\`
elements+=\`w-menu\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe0c1bed', 'id'))}">\`
elements+=\`w-dialog\`
elements+=\`</code>\`
elements+=\` as the container.\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('56c3be4b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-time-picker-actions" id="\${ty_escapeAttr(ty_generateId('1990557b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-menu location="bottom" id="\${ty_escapeAttr(ty_generateId('09ab1388', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn slot="activator" variant="outlined" id="\${ty_escapeAttr(ty_generateId('6f9ad6c3', 'id'))}">\`
elements+=\`Picker in menu\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<w-time-picker value="10:30" hide-header="" id="\${ty_escapeAttr(ty_generateId('0d9a3f7d', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
      \`
elements+=\`</w-menu>\`
elements+=\`
      \`
elements+=\`<w-dialog aria-label="Picker dialog" id="\${ty_escapeAttr(ty_generateId('52393431', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn slot="activator" variant="filled" id="\${ty_escapeAttr(ty_generateId('7975c906', 'id'))}">\`
elements+=\`Open dialog picker\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<w-time-picker value="14:45" hide-header="" id="\${ty_escapeAttr(ty_generateId('043f5aa4', 'id'))}">\`
elements+=\`</w-time-picker>\`
elements+=\`
      \`
elements+=\`</w-dialog>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/time-pickers/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
