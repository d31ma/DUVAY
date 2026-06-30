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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('9ad6f8ea', 'id'))}">\`
elements+=\`Chips\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('31a01fbc', 'id'))}">\`
elements+=\`Compact actions, filters, labels, and selections with Vuetify-style media, close, and group states.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8c2a5275', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ad799c33', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('a599340e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('e7b0e4c4', 'id'))}">\`
elements+=\`Tonal\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-filled" id="\${ty_escapeAttr(ty_generateId('c7cb419c', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-outlined" id="\${ty_escapeAttr(ty_generateId('0dc5da18', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-text" id="\${ty_escapeAttr(ty_generateId('bcb341bf', 'id'))}">\`
elements+=\`Text\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-plain" id="\${ty_escapeAttr(ty_generateId('1ea45643', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3030a24c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('cb6dd6e7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip id="\${ty_escapeAttr(ty_generateId('806e7daf', 'id'))}">\`
elements+=\`Tonal\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip variant="filled" id="\${ty_escapeAttr(ty_generateId('978dab69', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip variant="outlined" id="\${ty_escapeAttr(ty_generateId('612ad239', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip variant="text" id="\${ty_escapeAttr(ty_generateId('b47ede68', 'id'))}">\`
elements+=\`Text\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip variant="plain" id="\${ty_escapeAttr(ty_generateId('6e353310', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c198b7c1', 'id'))}">\`
elements+=\`Colors and Shape\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0d49c210', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('b05270b2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-filled w-chip-primary" id="\${ty_escapeAttr(ty_generateId('891827a7', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal w-chip-success" id="\${ty_escapeAttr(ty_generateId('8928d80c', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-outlined w-chip-warning w-chip--label" id="\${ty_escapeAttr(ty_generateId('39334fce', 'id'))}">\`
elements+=\`Label\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal w-chip-danger w-chip--pill" id="\${ty_escapeAttr(ty_generateId('f3a123e8', 'id'))}">\`
elements+=\`Danger\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ff67bc2c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('9953890f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip variant="filled" color="primary" id="\${ty_escapeAttr(ty_generateId('80120f7c', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip color="success" id="\${ty_escapeAttr(ty_generateId('e31f5f59', 'id'))}">\`
elements+=\`Success\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip variant="outlined" color="warning" label="" id="\${ty_escapeAttr(ty_generateId('1559b5fc', 'id'))}">\`
elements+=\`Label\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip color="danger" pill="" id="\${ty_escapeAttr(ty_generateId('1113d6af', 'id'))}">\`
elements+=\`Danger\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f1729c76', 'id'))}">\`
elements+=\`Media\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5f855586', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('b0bbcf15', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('76eee671', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip__prepend" id="\${ty_escapeAttr(ty_generateId('09fb5481', 'id'))}">\`
elements+=\`<span class="w-chip__icon" id="\${ty_escapeAttr(ty_generateId('b8b8a580', 'id'))}">\`
elements+=\`#\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-chip__content" id="\${ty_escapeAttr(ty_generateId('f4600114', 'id'))}">\`
elements+=\`Tagged\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('06cbc786', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip__prepend" id="\${ty_escapeAttr(ty_generateId('7995fa92', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar--x-small" id="\${ty_escapeAttr(ty_generateId('5322cce0', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/64?img=7" alt="" id="\${ty_escapeAttr(ty_generateId('f337c4e6', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-chip__content" id="\${ty_escapeAttr(ty_generateId('992555bd', 'id'))}">\`
elements+=\`Ari Lane\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('1f82a79c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip__content" id="\${ty_escapeAttr(ty_generateId('d30520eb', 'id'))}">\`
elements+=\`Synced\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-chip__append" id="\${ty_escapeAttr(ty_generateId('bae1f18c', 'id'))}">\`
elements+=\`<span class="w-chip__icon" id="\${ty_escapeAttr(ty_generateId('46cc555f', 'id'))}">\`
elements+=\`✓\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8c169e4b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('dc72327a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip prepend-icon="#" id="\${ty_escapeAttr(ty_generateId('d221f895', 'id'))}">\`
elements+=\`Tagged\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip prepend-avatar="https://i.pravatar.cc/64?img=7" id="\${ty_escapeAttr(ty_generateId('bbfa2031', 'id'))}">\`
elements+=\`Ari Lane\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip append-icon="✓" id="\${ty_escapeAttr(ty_generateId('0c0732e3', 'id'))}">\`
elements+=\`Synced\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('684d4865', 'id'))}">\`
elements+=\`Filter and Close\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0cd08b6b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('ff022a73', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal w-chip--filter selected" id="\${ty_escapeAttr(ty_generateId('20ce39ed', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip__filter" id="\${ty_escapeAttr(ty_generateId('21a8af15', 'id'))}">\`
elements+=\`✓\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-chip__content" id="\${ty_escapeAttr(ty_generateId('cd36c67f', 'id'))}">\`
elements+=\`Selected\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal w-chip-removable" id="\${ty_escapeAttr(ty_generateId('6111a999', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip__content" id="\${ty_escapeAttr(ty_generateId('cc2dc63f', 'id'))}">\`
elements+=\`Closable\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-chip__close w-chip-close" role="button" aria-label="Close" id="\${ty_escapeAttr(ty_generateId('945bf204', 'id'))}">\`
elements+=\`×\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal w-chip--disabled" id="\${ty_escapeAttr(ty_generateId('881beeeb', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bba2f902', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('d31ecc8a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip filter="" selected="" value="selected" id="\${ty_escapeAttr(ty_generateId('900566bf', 'id'))}">\`
elements+=\`Selected\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip closable="" value="closable" id="\${ty_escapeAttr(ty_generateId('a57c6492', 'id'))}">\`
elements+=\`Closable\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip disabled="" id="\${ty_escapeAttr(ty_generateId('f34ac722', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6fa081e0', 'id'))}">\`
elements+=\`Sizes and Density\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a1322ce7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('faf0bf8b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip--x-small" id="\${ty_escapeAttr(ty_generateId('a71991ba', 'id'))}">\`
elements+=\`X-small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip--small" id="\${ty_escapeAttr(ty_generateId('ccf4ec17', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip" id="\${ty_escapeAttr(ty_generateId('80eb3b91', 'id'))}">\`
elements+=\`Default\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip--large" id="\${ty_escapeAttr(ty_generateId('5f7a5611', 'id'))}">\`
elements+=\`Large\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip--x-large" id="\${ty_escapeAttr(ty_generateId('a5f557e8', 'id'))}">\`
elements+=\`X-large\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip--density-compact" id="\${ty_escapeAttr(ty_generateId('e99c15b1', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8a7c6fd9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('e5b7a1de', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip size="x-small" id="\${ty_escapeAttr(ty_generateId('48abe0eb', 'id'))}">\`
elements+=\`X-small\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip size="small" id="\${ty_escapeAttr(ty_generateId('4a21ea9e', 'id'))}">\`
elements+=\`Small\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip id="\${ty_escapeAttr(ty_generateId('64a9e203', 'id'))}">\`
elements+=\`Default\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip size="large" id="\${ty_escapeAttr(ty_generateId('c1575e71', 'id'))}">\`
elements+=\`Large\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip size="x-large" id="\${ty_escapeAttr(ty_generateId('e39b28b1', 'id'))}">\`
elements+=\`X-large\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip density="compact" id="\${ty_escapeAttr(ty_generateId('5b88e62d', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('429f3211', 'id'))}">\`
elements+=\`Chip Group\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3c8a597f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-chip-group" role="group" id="\${ty_escapeAttr(ty_generateId('f3fd8072', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal selected" id="\${ty_escapeAttr(ty_generateId('8dfc1965', 'id'))}">\`
elements+=\`Design\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('7ec3b0ec', 'id'))}">\`
elements+=\`Code\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-chip w-chip-tonal" id="\${ty_escapeAttr(ty_generateId('d290cc81', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('64bdef54', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-chip-group value="design" id="\${ty_escapeAttr(ty_generateId('17112fb2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-chip value="design" id="\${ty_escapeAttr(ty_generateId('92742af0', 'id'))}">\`
elements+=\`Design\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip value="code" id="\${ty_escapeAttr(ty_generateId('9a2b29e8', 'id'))}">\`
elements+=\`Code\`
elements+=\`</w-chip>\`
elements+=\`
      \`
elements+=\`<w-chip value="docs" id="\${ty_escapeAttr(ty_generateId('6de4460a', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</w-chip>\`
elements+=\`
    \`
elements+=\`</w-chip-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/chips/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
