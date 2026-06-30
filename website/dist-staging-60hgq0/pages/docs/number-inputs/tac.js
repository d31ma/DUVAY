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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('3cd0cc04', 'id'))}">\`
elements+=\`Number inputs\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2fed4f59', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7c53455', 'id'))}">\`
elements+=\`w-number-input\`
elements+=\`</code>\`
elements+=\` is a numeric field with stepper controls, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa4df0fe', 'id'))}">\`
elements+=\`v-number-input\`
elements+=\`</code>\`
elements+=\`. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c6cff0f1', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaaacc0c', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0cdd37c3', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` to constrain the value, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad1c1738', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('899531b4', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\` to format it, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a9828719', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\` to change the stepper layout. It emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('050f65c4', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f31dc255', 'id'))}">\`
elements+=\`update:model-value\`
elements+=\`</code>\`
elements+=\`) as the number updates.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ea48db36', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('690928c0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-number-input w-number-input--default" id="\${ty_escapeAttr(ty_generateId('9394d06e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('7406f448', 'id'))}">\`
elements+=\`Quantity\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('c409699a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="4" id="\${ty_escapeAttr(ty_generateId('cd4717ce', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('cbf47b0a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('6d534164', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('c11e99ff', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('19e47d16', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('d09e63b5', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('073a6d8d', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('4d9d933a', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4c1bc2a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-number-input label="Quantity" value="4" min="0" max="99" id="\${ty_escapeAttr(ty_generateId('5dc82287', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a7af510c', 'id'))}">\`
elements+=\`Control variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0824676d', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c74267b3', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\` attribute sets the stepper layout: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e545c7e6', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\` (buttons grouped at the end), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0012010', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` (vertical spinner), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8263144', 'id'))}">\`
elements+=\`split\`
elements+=\`</code>\`
elements+=\` (− and + on opposite ends), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3534479d', 'id'))}">\`
elements+=\`hidden\`
elements+=\`</code>\`
elements+=\` (no buttons).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5c61b9c8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('37e523a4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field w-number-input w-number-input--stacked" id="\${ty_escapeAttr(ty_generateId('0a2df15c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('0d13716d', 'id'))}">\`
elements+=\`Stacked\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('2269ed87', 'id'))}">\`
elements+=\`
          \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1" id="\${ty_escapeAttr(ty_generateId('cdcfa622', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('a377cc77', 'id'))}">\`
elements+=\`
            \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('7d15f1c4', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a7262e1f', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('f3973c9a', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
            \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('16be6011', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('212f861d', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('93f2c239', 'id'))}" />\`
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
elements+=\`<label class="w-field w-number-input w-number-input--split" id="\${ty_escapeAttr(ty_generateId('7ce2d0ae', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('ea08f632', 'id'))}">\`
elements+=\`Split\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('a144d876', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('485c1276', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('35eb451a', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M19 13H5v-2h14v2z" id="\${ty_escapeAttr(ty_generateId('be1e30c2', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1" id="\${ty_escapeAttr(ty_generateId('73a7c89f', 'id'))}" />\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('af3ee272', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7698f20c', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" id="\${ty_escapeAttr(ty_generateId('9a0e04ad', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2c41ae92', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('955e4fe5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-number-input label="Stacked" value="1" control-variant="stacked" id="\${ty_escapeAttr(ty_generateId('a6648fc7', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
      \`
elements+=\`<w-number-input label="Split" value="1" control-variant="split" id="\${ty_escapeAttr(ty_generateId('5c00d2ba', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
      \`
elements+=\`<w-number-input label="Hidden" value="1" control-variant="hidden" id="\${ty_escapeAttr(ty_generateId('fc73d1b3', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1b0a4c8e', 'id'))}">\`
elements+=\`Formatting\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ef73c836', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa34f3dd', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\` for a fixed number of decimal places, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7d3dae1b', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\` for thousands separators, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('461594ee', 'id'))}">\`
elements+=\`decimal-separator\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a412a8c6', 'id'))}">\`
elements+=\`group-separator\`
elements+=\`</code>\`
elements+=\` to localize them. The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df7f0245', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` attribute always stays canonical (plain number); formatting applies only to what is shown.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7fd8a7a5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-number-input w-number-input--default" id="\${ty_escapeAttr(ty_generateId('908e01a6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('cba4646d', 'id'))}">\`
elements+=\`Price\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-number-input-field" id="\${ty_escapeAttr(ty_generateId('d72dec91', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-input" type="text" inputmode="decimal" value="1,234.50" id="\${ty_escapeAttr(ty_generateId('8a5d6dd9', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-number-input-control" id="\${ty_escapeAttr(ty_generateId('8e30f987', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="-1" tabindex="-1" aria-label="Decrease" id="\${ty_escapeAttr(ty_generateId('5804fdd5', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('03e6a7e0', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('48b5adbd', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button type="button" class="w-number-input-btn" data-step="1" tabindex="-1" aria-label="Increase" id="\${ty_escapeAttr(ty_generateId('23cd0d04', 'id'))}">\`
elements+=\`<svg viewbox="0 0 24 24" width="18" height="18" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('4dfb67be', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" id="\${ty_escapeAttr(ty_generateId('2a9385bf', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3240b819', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-number-input label="Price" value="1234.5" precision="2" grouping="" step="0.5" id="\${ty_escapeAttr(ty_generateId('635c0842', 'id'))}">\`
elements+=\`</w-number-input>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7c528cba', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('7883b461', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('28b4b3c3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7a02b560', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b097faa4', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0aa04983', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('ebc7e9fb', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8ef0b4da', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('fc392582', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f1d53b6e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('01f0738c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1ccee2f9', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08e3cd78', 'id'))}">\`
elements+=\`model-value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('981e1137', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('66dbdcae', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e7da0b7c', 'id'))}">\`
elements+=\`Current value, clamped to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5fd6d469', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7966fa20', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('63203b42', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('04f245ef', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('64e207f7', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('044109d0', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('debe3ab0', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('150b13d7', 'id'))}">\`
elements+=\`safe-int range\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d27fa7b', 'id'))}">\`
elements+=\`Value bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5c41612e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2da8f2f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fd0e10f', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('14bb9c3f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5ee19331', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('72ae35e2', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('80d24251', 'id'))}">\`
elements+=\`Increment / decrement amount.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4182d130', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10ac1af0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('83336f66', 'id'))}">\`
elements+=\`control-variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d98ae15', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('83ac42a1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7d31588', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1f02466c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25a43dbe', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fdd727f5', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2182f73', 'id'))}">\`
elements+=\`split\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5dc3c410', 'id'))}">\`
elements+=\`hidden\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('adee916d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2a3ba738', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9a627a7', 'id'))}">\`
elements+=\`inset\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('494da189', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5218db22', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('72aa7c05', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3b4aa53', 'id'))}">\`
elements+=\`Tuck the controls inside the field with no divider.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('12ba3c49', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70256c60', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08c1a186', 'id'))}">\`
elements+=\`hide-input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ab0f1c2', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8d68d8f6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0aa6a233', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c76f48f', 'id'))}">\`
elements+=\`Show only the stepper (implies \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b205b0e', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bab41e9b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b2be8e40', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('35b46cff', 'id'))}">\`
elements+=\`reverse\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8be38a7', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2199eaa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('83df7579', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29752bf3', 'id'))}">\`
elements+=\`Place the controls before the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8764bb95', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e02c053a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b4fcf7b8', 'id'))}">\`
elements+=\`precision\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ae89d119', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8295f0d4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e40d8cd6', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2ad5b896', 'id'))}">\`
elements+=\`Decimal places to display; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d861b94', 'id'))}">\`
elements+=\`null\`
elements+=\`</code>\`
elements+=\` disables rounding.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c7a29729', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('169ee758', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5d41553', 'id'))}">\`
elements+=\`min-fraction-digits\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('142e5211', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06b37706', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('21e7c1c8', 'id'))}">\`
elements+=\`Minimum decimals to keep.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ee943ebf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a100832', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('06dec917', 'id'))}">\`
elements+=\`grouping\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1df175e7', 'id'))}">\`
elements+=\`boolean | string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f54bd59', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a03202b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d389c973', 'id'))}">\`
elements+=\`Thousands separators: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b1fcf8e', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb89efe6', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6f29f856', 'id'))}">\`
elements+=\`auto\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7169052a', 'id'))}">\`
elements+=\`min2\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4a69b059', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('054e18f9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09d5e69b', 'id'))}">\`
elements+=\`decimal-separator\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5177b4d', 'id'))}">\`
elements+=\`group-separator\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3ddd960', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ee8bdf64', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90306afe', 'id'))}">\`
elements+=\`.\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ba3622a3', 'id'))}">\`
elements+=\`,\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('56624b5b', 'id'))}">\`
elements+=\`Single-character separator overrides.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('44b3e166', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4fd142f1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('057ae185', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cbc0b8d5', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4b50aa9', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c19941fc', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1df97f61', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5df7cf29', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9d1e995b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('456634e1', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('343c1f9b', 'id'))}">\`
elements+=\`Text-field props forwarded to the input.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e8dd6488', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dce97eb6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ba18649', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1afada53', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed65544c', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e1835217', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('45264c4e', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a415131b', 'id'))}">\`
elements+=\`Disable the field and its controls.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f452c9b3', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('cc6781f2', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('0298a52a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('760bf41d', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('c7757b8d', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4c87101f', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('cd27a3d8', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('4200b527', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('79074d10', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('18bd50c2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('caa0a569', 'id'))}">\`
elements+=\`w-input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('68d56ba4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2e381ff4', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aab558df', 'id'))}">\`
elements+=\`Fired on each keystroke with the parsed number.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5fc59e85', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('32c41bfd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d98fdaa', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9f5aed77', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d930f7d', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7c46cf3a', 'id'))}">\`
elements+=\`Fired on commit or step with the clamped number (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9a3045dd', 'id'))}">\`
elements+=\`null\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d65e0063', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f88d31c0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('be7413e0', 'id'))}">\`
elements+=\`update:model-value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('81386da2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25eb83c4', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('afa05fd7', 'id'))}">\`
elements+=\`Mirror of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e52743f', 'id'))}">\`
elements+=\`w-change\`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/number-inputs/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
