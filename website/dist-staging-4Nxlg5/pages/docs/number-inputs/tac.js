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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('b001ff9a', 'id'))}">\`
elements+=\`Number inputs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dd07127f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d3ff05c2', 'id'))}">\`
elements+=\`w-number-input\`
elements+=\`</code>\`
elements+=\` is a numeric field with stepper controls, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90fe8bb8', 'id'))}">\`
elements+=\`v-number-input\`
elements+=\`</code>\`
elements+=\`. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b0718d86', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c95d65fb', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a8680721', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` to constrain the value, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('10cc4e86', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6f30958b', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\` to format it, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('668a1d45', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\` to change the stepper layout. It emits native-named \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f211fd59', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2da5e7cb', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` events as the number updates.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('795f774f', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5f8a80ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-number-input w-number-input--default" id="\${ty_escapeAttr(ty_generateId('dd611884', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('929304a8', 'id'))}">\`
elements+=\`Quantity\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('0b9183b5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="4" id="\${ty_escapeAttr(ty_generateId('759db197', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('2badf6c6', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('253eca87', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('25aaa258', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('63b34d4e', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('0939bf6e', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0c992bad', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('eea4d079', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0495ea9c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-number-input label="Quantity" value="4" min="0" max="99" id="\${ty_escapeAttr(ty_generateId('f0495dc0', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3f584828', 'id'))}">\`
elements+=\`Control variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d0b65327', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1fa9ae96', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\` attribute sets the stepper layout: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac361254', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\` (buttons grouped at the end), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6081cf35', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` (vertical spinner), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('110c0b0f', 'id'))}">\`
elements+=\`split\`
elements+=\`</code>\`
elements+=\` (− and + on opposite ends), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b012bf26', 'id'))}">\`
elements+=\`hidden\`
elements+=\`</code>\`
elements+=\` (no buttons).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e90bef9b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f07222cc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-number-input w-number-input--stacked" id="\${ty_escapeAttr(ty_generateId('e9af9d77', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('febe2099', 'id'))}">\`
elements+=\`Stacked\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('3df07624', 'id'))}">\`
elements+=\`
          \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1" id="\${ty_escapeAttr(ty_generateId('d0e71b5d', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('3edc60c9', 'id'))}">\`
elements+=\`
            \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('0e6bbd75', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7e36726f', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('db082a7c', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
            \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('a10456af', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('adb988cd', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('b83f73d6', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-field w-number-input w-number-input--split" id="\${ty_escapeAttr(ty_generateId('64805c86', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('0d2f5300', 'id'))}">\`
elements+=\`Split\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('f2c02a6b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('19de5517', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9ed696fe', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M19 13H5v-2h14v2z" id="\${ty_escapeAttr(ty_generateId('7f8bd5e9', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1" id="\${ty_escapeAttr(ty_generateId('6bffec98', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('2e8ec636', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('20fee6dc', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" id="\${ty_escapeAttr(ty_generateId('cf1aa6ed', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c32e3fca', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('7192f62e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-number-input label="Stacked" value="1" control-variant="stacked" id="\${ty_escapeAttr(ty_generateId('af9d58e1', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
      \`
elements+=\`<w-number-input label="Split" value="1" control-variant="split" id="\${ty_escapeAttr(ty_generateId('6393b09b', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
      \`
elements+=\`<w-number-input label="Hidden" value="1" control-variant="hidden" id="\${ty_escapeAttr(ty_generateId('260fd3da', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f4cd475e', 'id'))}">\`
elements+=\`Formatting\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5a093b0c', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9df55464', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\` for a fixed number of decimal places, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0fcb2f5b', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\` for thousands separators, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('05218753', 'id'))}">\`
elements+=\`decimal-separator\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff9c406d', 'id'))}">\`
elements+=\`group-separator\`
elements+=\`</code>\`
elements+=\` to localize them. The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b524097', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` attribute always stays canonical (plain number); formatting applies only to what is shown.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cbade9a2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-number-input w-number-input--default" id="\${ty_escapeAttr(ty_generateId('7e19f8df', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('4c9a1218', 'id'))}">\`
elements+=\`Price\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('653f8b2a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1,234.50" id="\${ty_escapeAttr(ty_generateId('786e9467', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('8b70411d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('52ec7fd5', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('bbb8f103', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('491e238d', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('0f409485', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6539821a', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('d5568dbc', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('55d499cc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-number-input label="Price" value="1234.5" precision="2" grouping="" step="0.5" id="\${ty_escapeAttr(ty_generateId('55c56745', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('11309484', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('624c1fb3', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('83d145df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dc3b7dfa', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('688d0193', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('ac776882', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('42994a83', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('971cce91', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('bcd348a1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d2d2896f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('498c9b4e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa45ea74', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('08e00b63', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('de160423', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8bc26075', 'id'))}">\`
elements+=\`Current value, clamped to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9061125', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('665931d1', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9677fba8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('672b4d8d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eada9759', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('72c1da8f', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('62c84a36', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('31c7f55e', 'id'))}">\`
elements+=\`safe-int range\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53bdbada', 'id'))}">\`
elements+=\`Value bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('03a07f60', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dcd61ae5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ccebc076', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e74816d8', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('422da01a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b572f607', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('65633724', 'id'))}">\`
elements+=\`Increment / decrement amount.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bb890161', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb98f0e1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4845a63', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('90ceb1db', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('20397fdd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbe2c622', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aa0194fd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('021fece5', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a1f5b17', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe2bf380', 'id'))}">\`
elements+=\`split\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61817ed9', 'id'))}">\`
elements+=\`hidden\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('39f1f7fa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e36ccdcf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03e3bb30', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5e67ca61', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0dc8dd17', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9815fee', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9daa8be2', 'id'))}">\`
elements+=\`Tuck the controls inside the field with no divider.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b6052a94', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('96e2995b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6b2adae', 'id'))}">\`
elements+=\`hide-input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ecec9adb', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('34595ef2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e763810a', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a0001308', 'id'))}">\`
elements+=\`Show only the stepper (implies \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9c801ec', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a09fa4d2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b4191d62', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e05065b5', 'id'))}">\`
elements+=\`reverse\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f6ba6771', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91dbcbb6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da2ad2a5', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a4732f21', 'id'))}">\`
elements+=\`Place the controls before the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6657c587', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5e069d1f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('192d980c', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('be1cf2ab', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ecbd8d6f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e72f5a79', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('24437712', 'id'))}">\`
elements+=\`Decimal places to display; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08e803be', 'id'))}">\`
elements+=\`null\`
elements+=\`</code>\`
elements+=\` disables rounding.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('019fa6da', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('03854804', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4fcee544', 'id'))}">\`
elements+=\`min-fraction-digits\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('77650a1e', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('20192994', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('36bab32a', 'id'))}">\`
elements+=\`Minimum decimals to keep.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2c80b6e2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a788a060', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a8e1f3a', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f5322e3d', 'id'))}">\`
elements+=\`boolean | string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f631ed82', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5df857f', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d67b45e7', 'id'))}">\`
elements+=\`Thousands separators: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('33669ff7', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ae446dba', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e2ad3214', 'id'))}">\`
elements+=\`auto\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c899d199', 'id'))}">\`
elements+=\`min2\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7b8b3fa1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da295bdc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2882c03b', 'id'))}">\`
elements+=\`decimal-separator\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('077c0478', 'id'))}">\`
elements+=\`group-separator\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c9be878f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('61dfb735', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe858dce', 'id'))}">\`
elements+=\`.\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4729710b', 'id'))}">\`
elements+=\`,\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e4b8d11', 'id'))}">\`
elements+=\`Single-character separator overrides.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3ba5e10a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fea8895b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('359f9404', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb8cfe7a', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('525924ad', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('151ce5fd', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('783c5244', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e6fe2d0a', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7151e565', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fc0124c9', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f927fbcf', 'id'))}">\`
elements+=\`Text-field props forwarded to the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('32577767', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dbfbf00a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43bb3226', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d897462c', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b663a565', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a32f6363', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9bcdd8ff', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('47fcfac8', 'id'))}">\`
elements+=\`Disable the field and its controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0228eb6c', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('78c9d630', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('1eef367a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('116618d3', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d8090dff', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('dd729548', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6cfc42cd', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('536a751d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4114d43c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e8c449ed', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea251938', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a57af386', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f8ca262', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('df48f4df', 'id'))}">\`
elements+=\`Fired on each keystroke with the parsed number.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c9f109c2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('56f9a390', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('987f15fa', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a19f93d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eba86d08', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a1aeb08', 'id'))}">\`
elements+=\`Fired on commit or step with the clamped number (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3c588fd', 'id'))}">\`
elements+=\`null\`
elements+=\`</code>\`
elements+=\`).\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/number-inputs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
