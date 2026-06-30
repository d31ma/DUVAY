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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('d3ccccf7', 'id'))}">\`
elements+=\`App Bars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dd07cae2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('342eb383', 'id'))}">\`
elements+=\`w-app-bar\`
elements+=\`</code>\`
elements+=\` provides a top or bottom application bar with Vuetify parity: density, elevation, scroll behavior, image backgrounds, extension slots, and full theming support.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('457058f1', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('976badc4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar" id="\${ty_escapeAttr(ty_generateId('d6a8c121', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('905cb5ae', 'id'))}">\`
elements+=\`DuVay\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<button class="w-btn" id="\${ty_escapeAttr(ty_generateId('c2c049b6', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('78322d46', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="DuVay" id="\${ty_escapeAttr(ty_generateId('2ccc265b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn id="\${ty_escapeAttr(ty_generateId('16110739', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('71fd453e', 'id'))}">\`
elements+=\`Sticky with scroll behavior\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5d72c4aa', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('006a8d86', 'id'))}">\`
elements+=\`sticky\`
elements+=\`</code>\`
elements+=\` to pin the bar. Combine with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d8292a2', 'id'))}">\`
elements+=\`scroll-behavior\`
elements+=\`</code>\`
elements+=\` for hide, elevate, collapse, or fade-image effects.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('728cf88a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar w-app-bar--sticky" id="\${ty_escapeAttr(ty_generateId('e4ac1f1b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('11552c3e', 'id'))}">\`
elements+=\`Sticky\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<button class="w-btn" id="\${ty_escapeAttr(ty_generateId('9610d856', 'id'))}">\`
elements+=\`Action\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2245d8dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar sticky="" title="Sticky" scroll-behavior="elevate" id="\${ty_escapeAttr(ty_generateId('456155cb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn id="\${ty_escapeAttr(ty_generateId('4af89a24', 'id'))}">\`
elements+=\`Action\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bacb0f64', 'id'))}">\`
elements+=\`Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('661d0ee9', 'id'))}">\`
elements+=\`Choose \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ed4b134', 'id'))}">\`
elements+=\`prominent\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ee2387fb', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d87e540b', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\` density.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4321a250', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack w-gap-2" id="\${ty_escapeAttr(ty_generateId('67866214', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar w-app-bar--prominent" id="\${ty_escapeAttr(ty_generateId('ee75cedc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('e64b57b2', 'id'))}">\`
elements+=\`Prominent\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar w-app-bar--comfortable" id="\${ty_escapeAttr(ty_generateId('cd54c08b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('673ef4c9', 'id'))}">\`
elements+=\`Comfortable\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar w-app-bar--compact" id="\${ty_escapeAttr(ty_generateId('aab2c405', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('ad0e071a', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d882080a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack w-gap-2" id="\${ty_escapeAttr(ty_generateId('f65f7aef', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-app-bar density="prominent" title="Prominent" id="\${ty_escapeAttr(ty_generateId('d837ede9', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
      \`
elements+=\`<w-app-bar density="comfortable" title="Comfortable" id="\${ty_escapeAttr(ty_generateId('5a3394ad', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
      \`
elements+=\`<w-app-bar density="compact" title="Compact" id="\${ty_escapeAttr(ty_generateId('d3a3e26c', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('69fe6b08', 'id'))}">\`
elements+=\`Color and background\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d39be3eb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar" style="--w-app-bar-color:var(--w-primary);--w-app-bar-bg:var(--w-surface-container-low)" id="\${ty_escapeAttr(ty_generateId('26afdad6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('0620a4eb', 'id'))}">\`
elements+=\`Themed\`
elements+=\`</strong>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7b06edba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Themed" color="primary" bg-color="surface-container-low" id="\${ty_escapeAttr(ty_generateId('470b8dec', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c19cdcad', 'id'))}">\`
elements+=\`Flat and elevation\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('40589fb0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack w-gap-2" id="\${ty_escapeAttr(ty_generateId('6bdcc45e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar w-app-bar--flat" id="\${ty_escapeAttr(ty_generateId('c666cbfe', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('74689f48', 'id'))}">\`
elements+=\`Flat\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar w-elevation-4" id="\${ty_escapeAttr(ty_generateId('536e1468', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('4b2f4bd7', 'id'))}">\`
elements+=\`Elevated\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e50dd71b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack w-gap-2" id="\${ty_escapeAttr(ty_generateId('28c44241', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-app-bar title="Flat" flat="" id="\${ty_escapeAttr(ty_generateId('6bdea72d', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
      \`
elements+=\`<w-app-bar title="Elevated" elevation="4" id="\${ty_escapeAttr(ty_generateId('08bd8639', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1676996a', 'id'))}">\`
elements+=\`Image background\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3a6c12f3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar w-app-bar--image" style="--w-app-bar-image:url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800)" id="\${ty_escapeAttr(ty_generateId('11bb22ef', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('2a00dcff', 'id'))}">\`
elements+=\`Image\`
elements+=\`</strong>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7d25eb60', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Image" image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800" id="\${ty_escapeAttr(ty_generateId('4be79a40', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d0730d6c', 'id'))}">\`
elements+=\`Extended with extension slot\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7e70702c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div id="\${ty_escapeAttr(ty_generateId('a333aaef', 'id'))}">\`
elements+=\`
      \`
elements+=\`<header class="w-app-bar" id="\${ty_escapeAttr(ty_generateId('fffb0628', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('e8ffcbab', 'id'))}">\`
elements+=\`Extended\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</header>\`
elements+=\`
      \`
elements+=\`<div class="w-app-bar-extension" style="--w-app-bar-extension-height:48px" id="\${ty_escapeAttr(ty_generateId('238dba6e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('d7364ba4', 'id'))}">\`
elements+=\`Extension content\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bef20561', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Extended" extended="" id="\${ty_escapeAttr(ty_generateId('687ee62c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span slot="extension" id="\${ty_escapeAttr(ty_generateId('74658aed', 'id'))}">\`
elements+=\`Extension content\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e60c8909', 'id'))}">\`
elements+=\`Bottom location\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d1bae39d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar w-app-bar--bottom" id="\${ty_escapeAttr(ty_generateId('92d89a23', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('20436a14', 'id'))}">\`
elements+=\`Bottom\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<button class="w-btn" id="\${ty_escapeAttr(ty_generateId('1b2eb86e', 'id'))}">\`
elements+=\`Action\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4917b7ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Bottom" location="bottom" id="\${ty_escapeAttr(ty_generateId('e8cdad2f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn id="\${ty_escapeAttr(ty_generateId('9df37e1b', 'id'))}">\`
elements+=\`Action\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6fa8ac34', 'id'))}">\`
elements+=\`Border and rounded\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d1319f54', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar w-app-bar--border w-rounded-lg" id="\${ty_escapeAttr(ty_generateId('563722ac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('6f7dddd8', 'id'))}">\`
elements+=\`Styled\`
elements+=\`</strong>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a05b3b30', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Styled" border="" rounded="lg" id="\${ty_escapeAttr(ty_generateId('611d076c', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c29a654c', 'id'))}">\`
elements+=\`Custom height\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c49c2559', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar" style="--w-app-bar-height:80px" id="\${ty_escapeAttr(ty_generateId('41ee8626', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('c677c811', 'id'))}">\`
elements+=\`Tall\`
elements+=\`</strong>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1ea6e73a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="Tall" height="80" id="\${ty_escapeAttr(ty_generateId('a3338155', 'id'))}">\`
elements+=\`</w-app-bar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('72791511', 'id'))}">\`
elements+=\`With nav icon\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3cd53f28', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd4bd9be', 'id'))}">\`
elements+=\`w-app-bar-nav-icon\`
elements+=\`</code>\`
elements+=\` toggles a target \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5692b593', 'id'))}">\`
elements+=\`w-navigation-drawer\`
elements+=\`</code>\`
elements+=\` and updates its own \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b18f3aa', 'id'))}">\`
elements+=\`aria-expanded\`
elements+=\`</code>\`
elements+=\` state.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('359514a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<header class="w-app-bar" id="\${ty_escapeAttr(ty_generateId('87eec6db', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-app-bar-nav-icon w-btn w-btn-icon" type="button" aria-label="Open navigation" id="\${ty_escapeAttr(ty_generateId('e9e1d28a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<svg viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" id="\${ty_escapeAttr(ty_generateId('6d76d92a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<line x1="4" y1="6" x2="20" y2="6" id="\${ty_escapeAttr(ty_generateId('e4044481', 'id'))}" />\`
elements+=\`<line x1="4" y1="12" x2="20" y2="12" id="\${ty_escapeAttr(ty_generateId('89621db4', 'id'))}" />\`
elements+=\`<line x1="4" y1="18" x2="20" y2="18" id="\${ty_escapeAttr(ty_generateId('a836b7e2', 'id'))}" />\`
elements+=\`
        \`
elements+=\`</svg>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<strong class="w-app-bar-title" id="\${ty_escapeAttr(ty_generateId('f2a93177', 'id'))}">\`
elements+=\`With Nav\`
elements+=\`</strong>\`
elements+=\`
    \`
elements+=\`</header>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6991c855', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-app-bar title="With Nav" id="\${ty_escapeAttr(ty_generateId('9f89b4ed', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-app-bar-nav-icon for="drawer-demo" id="\${ty_escapeAttr(ty_generateId('ed253cd1', 'id'))}">\`
elements+=\`</w-app-bar-nav-icon>\`
elements+=\`
    \`
elements+=\`</w-app-bar>\`
elements+=\`
    \`
elements+=\`<w-navigation-drawer id="drawer-demo" temporary="">\`
elements+=\`
      \`
elements+=\`<a href="#item1" id="\${ty_escapeAttr(ty_generateId('1db21426', 'id'))}">\`
elements+=\`Item 1\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a href="#item2" id="\${ty_escapeAttr(ty_generateId('38cf1569', 'id'))}">\`
elements+=\`Item 2\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</w-navigation-drawer>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/app-bars/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
