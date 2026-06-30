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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7c18a2e7', 'id'))}">\`
elements+=\`Sparklines\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8c27ade0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cf89bdd', 'id'))}">\`
elements+=\`w-sparkline\`
elements+=\`</code>\`
elements+=\` draws a small inline trend line or bar chart from a list of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0bb809d4', 'id'))}">\`
elements+=\`values\`
elements+=\`</code>\`
elements+=\`. It supports fills, smoothing, gradients, custom line width, labels, min/max clamping, and an auto-draw animation. Pass numbers via \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54b15433', 'id'))}">\`
elements+=\`values\`
elements+=\`</code>\`
elements+=\` (comma list or JSON array).\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ea28d98a', 'id'))}">\`
elements+=\`Trend &amp; bar\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('29ce20f4', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea4b09a2', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('802b789b', 'id'))}">\`
elements+=\`trend\`
elements+=\`</code>\`
elements+=\` (default line) or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('948b304b', 'id'))}">\`
elements+=\`bar\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ebc8797c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend" viewbox="0 0 100 40" id="\${ty_escapeAttr(ty_generateId('bc7924e5', 'id'))}">\`
elements+=\`<path class="w-sparkline-line" d="M4,28 L23,10 L42,20 L61,6 L80,16 L96,9" id="\${ty_escapeAttr(ty_generateId('a7ad3057', 'id'))}">\`
elements+=\`</path>\`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2daa8daa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f2552d19', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" id="\${ty_escapeAttr(ty_generateId('bbbf8a4c', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
      \`
elements+=\`<w-sparkline type="bar" values="[4,7,2,9,5,8]" id="\${ty_escapeAttr(ty_generateId('bcd8da32', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('df56fc64', 'id'))}">\`
elements+=\`Fill &amp; smooth\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d89afe4e', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('02032f21', 'id'))}">\`
elements+=\`fill\`
elements+=\`</code>\`
elements+=\` to shade the area under a trend, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61b65c1f', 'id'))}">\`
elements+=\`smooth\`
elements+=\`</code>\`
elements+=\` to round the corners.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9c9fe48e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend w-sparkline--fill" viewbox="0 0 100 40" id="\${ty_escapeAttr(ty_generateId('b59fbf9f', 'id'))}">\`
elements+=\`<path class="w-sparkline-fill" d="M4,28 C20,10 30,10 50,18 C70,26 80,6 96,12 L96,40 L4,40 Z" id="\${ty_escapeAttr(ty_generateId('279e3981', 'id'))}">\`
elements+=\`</path>\`
elements+=\`<path class="w-sparkline-line" d="M4,28 C20,10 30,10 50,18 C70,26 80,6 96,12" id="\${ty_escapeAttr(ty_generateId('1d9987b9', 'id'))}">\`
elements+=\`</path>\`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('315e74ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('a70cbee2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" fill="" id="\${ty_escapeAttr(ty_generateId('d9606ef7', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" smooth="" fill="" id="\${ty_escapeAttr(ty_generateId('376b59a6', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('083c3042', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6eec493d', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bc8366b0', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` to a token name (e.g. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7aa2fbff', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`) or any CSS color.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b76a3026', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend" viewbox="0 0 100 40" style="--w-sparkline-color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('a01062f9', 'id'))}">\`
elements+=\`<path class="w-sparkline-line" d="M4,28 L23,10 L42,20 L61,6 L80,16 L96,9" id="\${ty_escapeAttr(ty_generateId('07c089e0', 'id'))}">\`
elements+=\`</path>\`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('efc2dd6b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('f2e23c8f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" color="success" id="\${ty_escapeAttr(ty_generateId('7afb5db0', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
      \`
elements+=\`<w-sparkline type="bar" values="[4,7,2,9,5,8]" color="warning" id="\${ty_escapeAttr(ty_generateId('1eb72dea', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('663552af', 'id'))}">\`
elements+=\`Gradient\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('620ab350', 'id'))}">\`
elements+=\`Pass a comma list of colors to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b9f9bac', 'id'))}">\`
elements+=\`gradient\`
elements+=\`</code>\`
elements+=\` (with optional \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f076340', 'id'))}">\`
elements+=\`gradient-direction\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bd1c98d8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend" viewbox="0 0 100 40" style="--w-sparkline-color:url(#demo-grad)" id="\${ty_escapeAttr(ty_generateId('53cdb2e2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<defs id="\${ty_escapeAttr(ty_generateId('560e4c1b', 'id'))}">\`
elements+=\`<lineargradient id="demo-grad" x1="0" y1="0" x2="1" y2="0">\`
elements+=\`<stop offset="0%" stop-color="#f72047" id="\${ty_escapeAttr(ty_generateId('0fa4ac3f', 'id'))}">\`
elements+=\`</stop>\`
elements+=\`<stop offset="50%" stop-color="#ffd200" id="\${ty_escapeAttr(ty_generateId('7423e764', 'id'))}">\`
elements+=\`</stop>\`
elements+=\`<stop offset="100%" stop-color="#1feaea" id="\${ty_escapeAttr(ty_generateId('03b6e391', 'id'))}">\`
elements+=\`</stop>\`
elements+=\`</lineargradient>\`
elements+=\`</defs>\`
elements+=\`
      \`
elements+=\`<path class="w-sparkline-line" d="M4,30 L23,12 L42,22 L61,8 L80,18 L96,6" id="\${ty_escapeAttr(ty_generateId('72359edc', 'id'))}">\`
elements+=\`</path>\`
elements+=\`
    \`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fab8981d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-sparkline values="[2,9,4,11,6,14]" gradient="#f72047,#ffd200,#1feaea" gradient-direction="right" line-width="3" id="\${ty_escapeAttr(ty_generateId('66b5c037', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('48755624', 'id'))}">\`
elements+=\`Line width\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3d10e0c6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend" viewbox="0 0 100 40" style="--w-sparkline-width:1.5" id="\${ty_escapeAttr(ty_generateId('27a00f24', 'id'))}">\`
elements+=\`<path class="w-sparkline-line" d="M4,28 L23,10 L42,20 L61,6 L80,16 L96,9" id="\${ty_escapeAttr(ty_generateId('69b45130', 'id'))}">\`
elements+=\`</path>\`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f65e6bec', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('285de99f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" line-width="1.5" id="\${ty_escapeAttr(ty_generateId('897064cf', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12]" line-width="6" id="\${ty_escapeAttr(ty_generateId('0177aa01', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('46619612', 'id'))}">\`
elements+=\`Labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6170b38d', 'id'))}">\`
elements+=\`Provide \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e54f439b', 'id'))}">\`
elements+=\`labels\`
elements+=\`</code>\`
elements+=\` for custom captions, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1095f6c4', 'id'))}">\`
elements+=\`show-labels\`
elements+=\`</code>\`
elements+=\` to print the values themselves.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0183c46b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--bar" viewbox="0 0 100 50" id="\${ty_escapeAttr(ty_generateId('53a37757', 'id'))}">\`
elements+=\`
      \`
elements+=\`<rect class="w-sparkline-bar" x="6" y="20" width="20" height="20" rx="1.5" id="\${ty_escapeAttr(ty_generateId('23aa0426', 'id'))}">\`
elements+=\`</rect>\`
elements+=\`
      \`
elements+=\`<rect class="w-sparkline-bar" x="40" y="8" width="20" height="32" rx="1.5" id="\${ty_escapeAttr(ty_generateId('431b38fc', 'id'))}">\`
elements+=\`</rect>\`
elements+=\`
      \`
elements+=\`<rect class="w-sparkline-bar" x="74" y="26" width="20" height="14" rx="1.5" id="\${ty_escapeAttr(ty_generateId('4a90e4c4', 'id'))}">\`
elements+=\`</rect>\`
elements+=\`
      \`
elements+=\`<g class="w-sparkline-labels" font-size="6" id="\${ty_escapeAttr(ty_generateId('15b0f505', 'id'))}">\`
elements+=\`<text x="16" y="49" text-anchor="middle" id="\${ty_escapeAttr(ty_generateId('20f48585', 'id'))}">\`
elements+=\`Jan\`
elements+=\`</text>\`
elements+=\`<text x="50" y="49" text-anchor="middle" id="\${ty_escapeAttr(ty_generateId('25777d95', 'id'))}">\`
elements+=\`Feb\`
elements+=\`</text>\`
elements+=\`<text x="84" y="49" text-anchor="middle" id="\${ty_escapeAttr(ty_generateId('d962e5dc', 'id'))}">\`
elements+=\`Mar\`
elements+=\`</text>\`
elements+=\`</g>\`
elements+=\`
    \`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2db8ba61', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('4f6f430d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-sparkline type="bar" values="[5,12,7]" labels="Jan,Feb,Mar" id="\${ty_escapeAttr(ty_generateId('a674913d', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
      \`
elements+=\`<w-sparkline values="[10,20,15,30,25]" show-labels="" id="\${ty_escapeAttr(ty_generateId('80c38225', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('69a85085', 'id'))}">\`
elements+=\`Auto-draw\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d57720d6', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('762324d9', 'id'))}">\`
elements+=\`auto-draw\`
elements+=\`</code>\`
elements+=\` to animate the trend line on load; tune with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8c543902', 'id'))}">\`
elements+=\`auto-draw-duration\`
elements+=\`</code>\`
elements+=\` (ms).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1658e312', 'id'))}">\`
elements+=\`
    \`
elements+=\`<svg class="w-sparkline w-sparkline--trend w-sparkline--auto-draw" viewbox="0 0 100 40" style="--w-sparkline-draw-duration:1500ms" id="\${ty_escapeAttr(ty_generateId('803dfd10', 'id'))}">\`
elements+=\`<path class="w-sparkline-line" d="M4,28 L23,10 L42,20 L61,6 L80,16 L96,9" pathlength="1" id="\${ty_escapeAttr(ty_generateId('1d9373cd', 'id'))}">\`
elements+=\`</path>\`
elements+=\`</svg>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('521b56ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-sparkline values="[3,8,5,10,6,12,7,13]" auto-draw="" auto-draw-duration="1500" fill="" id="\${ty_escapeAttr(ty_generateId('72a85ee2', 'id'))}">\`
elements+=\`</w-sparkline>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/sparklines/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
