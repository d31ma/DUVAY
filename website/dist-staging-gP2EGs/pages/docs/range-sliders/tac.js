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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('97db5a38', 'id'))}">\`
elements+=\`Range sliders\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('182a4fbf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8c4d6d28', 'id'))}">\`
elements+=\`w-range-slider\`
elements+=\`</code>\`
elements+=\` selects a range between two values with a pair of thumbs on a single track; the selected segment is highlighted. Bind the ends with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('171fe146', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99c1463d', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`, and constrain with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c97a12a', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9bfbaab2', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('878ae0c4', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`. For a single value, use the \`
elements+=\`<a href="/docs/sliders" id="\${ty_escapeAttr(ty_generateId('f7986729', 'id'))}">\`
elements+=\`slider\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0082cf42', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f2f2bcd6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('be7fc70f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('2231deba', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('8dc9b934', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7db3fcd1', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:20%;width:60%" id="\${ty_escapeAttr(ty_generateId('3362f340', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('4b3a6cd9', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('06c8d207', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('3a1fa23f', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b12b7fb4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" id="\${ty_escapeAttr(ty_generateId('21bcbba3', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('150cdd17', 'id'))}">\`
elements+=\`Min, max, and step\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9bb06cb8', 'id'))}">\`
elements+=\`Constrain the range with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('be8fcaf8', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ad109175', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` and snap to increments with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef66982b', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4bb703a5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('b295208c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('29ba60d4', 'id'))}">\`
elements+=\`Temperature (°C)\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('c8d6c583', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0b1e4b66', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:33.33%;width:33.33%" id="\${ty_escapeAttr(ty_generateId('ee7a188f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="0" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('aadbe669', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="-20" max="40" step="5" value="20" aria-label="End" id="\${ty_escapeAttr(ty_generateId('2b77c6f2', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('668f5d2a', 'id'))}">\`
elements+=\`0 – 20\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('805a3419', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Temperature (°C)" min="-20" max="40" step="5" start="0" end="20" id="\${ty_escapeAttr(ty_generateId('1b6d448f', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d82da8c2', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5befb5de', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--disabled" id="\${ty_escapeAttr(ty_generateId('e42e1e37', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('bd2e9e70', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" id="\${ty_escapeAttr(ty_generateId('c234b44a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('711c9494', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" style="left:30%;width:40%" id="\${ty_escapeAttr(ty_generateId('c6508cf7', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="30" aria-label="Start" disabled="" id="\${ty_escapeAttr(ty_generateId('dde116e5', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="70" aria-label="End" disabled="" id="\${ty_escapeAttr(ty_generateId('11911a18', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('2daf9495', 'id'))}">\`
elements+=\`30 – 70\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0ce47439', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="30" end="70" disabled="" id="\${ty_escapeAttr(ty_generateId('19bdb9ef', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9dc386f6', 'id'))}">\`
elements+=\`Thumb labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('822d8b56', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e7e8ab33', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\` to show each thumb&#8217;s value on hover or focus, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f029ffb6', 'id'))}">\`
elements+=\`thumb-label="always"\`
elements+=\`</code>\`
elements+=\` to keep the bubbles visible.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('de5b38be', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('4c3d1ea1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('0df1f0e5', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('faa28e10', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('827bdbbe', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('d58c12b9', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('68299468', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('6579984d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('f34b14a2', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('7923a57d', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('218456fc', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b03f271e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('5de54ec5', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('91d43839', 'id'))}">\`
elements+=\`Ticks\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('80a5f176', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c49a317a', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\` to mark each \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54efa644', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\` along the track.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aa17f7bc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider" id="\${ty_escapeAttr(ty_generateId('8f637884', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('07899067', 'id'))}">\`
elements+=\`Rating\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:30%;--end:70%" id="\${ty_escapeAttr(ty_generateId('30169856', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9c335420', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('bc1089b4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-ticks" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('5326499e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:0%" id="\${ty_escapeAttr(ty_generateId('4605013c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:10%" id="\${ty_escapeAttr(ty_generateId('38b167fa', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('aa847013', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:30%" id="\${ty_escapeAttr(ty_generateId('5ecd714d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:40%" id="\${ty_escapeAttr(ty_generateId('f01daa0b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:50%" id="\${ty_escapeAttr(ty_generateId('02aeb1dd', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:60%" id="\${ty_escapeAttr(ty_generateId('50bf4464', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:70%" id="\${ty_escapeAttr(ty_generateId('5cecd6c4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('de314c7b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:90%" id="\${ty_escapeAttr(ty_generateId('ba23b67a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-tick" style="--pos:100%" id="\${ty_escapeAttr(ty_generateId('fc502ddc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="3" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('35b695df', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" min="0" max="10" step="1" value="7" aria-label="End" id="\${ty_escapeAttr(ty_generateId('b1244b9c', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('0f49efda', 'id'))}">\`
elements+=\`3 – 7\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('74be0e94', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Rating" min="0" max="10" step="1" start="3" end="7" ticks="" id="\${ty_escapeAttr(ty_generateId('a7e307ad', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8b142d6d', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c2e64049', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f34cb83f', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` to orient the slider vertically.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('67b39a57', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field w-range-slider w-range-slider--vertical w-range-slider--thumb-label w-range-slider--thumb-label-always" id="\${ty_escapeAttr(ty_generateId('6d1140f4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('08b69d8d', 'id'))}">\`
elements+=\`Budget\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-range-slider-control" style="--start:20%;--end:80%" id="\${ty_escapeAttr(ty_generateId('a25e9fd6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-track" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b598af40', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-range-slider-fill" id="\${ty_escapeAttr(ty_generateId('f75196ff', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="20" aria-label="Start" id="\${ty_escapeAttr(ty_generateId('de1a2cfe', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<input class="w-range-slider-input" type="range" value="80" aria-label="End" id="\${ty_escapeAttr(ty_generateId('34f08722', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="start" style="--pos:20%" id="\${ty_escapeAttr(ty_generateId('2ff983fa', 'id'))}">\`
elements+=\`20\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-range-slider-thumb-label" data-thumb="end" style="--pos:80%" id="\${ty_escapeAttr(ty_generateId('3b6c926d', 'id'))}">\`
elements+=\`80\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-messages" id="\${ty_escapeAttr(ty_generateId('2015b288', 'id'))}">\`
elements+=\`20 – 80\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c61cf9d5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-range-slider label="Budget" start="20" end="80" direction="vertical" thumb-label="always" id="\${ty_escapeAttr(ty_generateId('ba086349', 'id'))}">\`
elements+=\`</w-range-slider>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eebabf8d', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('b8c3ec4a', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2eb7d27b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('56a75041', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('45874459', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('28ce9c71', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b63069a3', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('74caf3a9', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('96aa935f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6de54d4c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06561d68', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f63c9c22', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b6d6e95', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6289c888', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ea56319b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d1dbf4c', 'id'))}">\`
elements+=\`0\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8dea17b6', 'id'))}">\`
elements+=\`100\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('75f15c9d', 'id'))}">\`
elements+=\`Range bounds.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('35e1cb6b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f02f5ade', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95226572', 'id'))}">\`
elements+=\`start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9cec4a3', 'id'))}">\`
elements+=\`end\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3013c97f', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('340adf14', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a595f8f', 'id'))}">\`
elements+=\`min\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23b6cb65', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('14d67a4d', 'id'))}">\`
elements+=\`Current range ends.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('01aba29a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('559db044', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd1097f1', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42039804', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fd9b4312', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e5bac4b', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('801eb85c', 'id'))}">\`
elements+=\`Increment between values.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4fb1ccd6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('490ad7ee', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('56dab198', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d10f865f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed32a00c', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0fe680ef', 'id'))}">\`
elements+=\`Field label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3d75982f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('98d1c947', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f2251d3', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7a382d1e', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3873d7fc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0c04c1a3', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9555627', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bcbe6115', 'id'))}">\`
elements+=\`horizontal\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da2d32be', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6da7bd51', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6ef0424', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d009653', 'id'))}">\`
elements+=\`thumb-label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('30ee86cf', 'id'))}">\`
elements+=\`boolean | \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1cb819b4', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('98dab033', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2b3d2a0', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e48eb8ff', 'id'))}">\`
elements+=\`Show a value bubble over each thumb (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d09caabd', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` keeps it visible).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('84870443', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bd003881', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cdf66054', 'id'))}">\`
elements+=\`ticks\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d94d5c19', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b42284c5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4efbcfd0', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ae0f8a55', 'id'))}">\`
elements+=\`Draw a tick at every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e4e5ff3', 'id'))}">\`
elements+=\`step\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('662d47d0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7afc3542', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('793930ec', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c8054714', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ec5aa728', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5b49c18', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f5f076b2', 'id'))}">\`
elements+=\`Disable both thumbs.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e069a05f', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('42661d0b', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('d8d3debe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3a533d97', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6b7d8ca6', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0f541030', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('05a2f2cb', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('162815d8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5949668c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('18430458', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6eba3bfd', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5ce654f6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('89e6f2fb', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b33d8473', 'id'))}">\`
elements+=\`Fired while dragging either thumb.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d1f660c0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d4804982', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef38bbf8', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1301b20e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da11a66f', 'id'))}">\`
elements+=\`&#123; start, end &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7863a7d3', 'id'))}">\`
elements+=\`Fired when a thumb is released.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/range-sliders/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
