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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('bc5fc1e4', 'id'))}">\`
elements+=\`Slide Groups\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b372d76c', 'id'))}">\`
elements+=\`Slide groups are scrollable, selectable item sets with overflow arrows and keyboard navigation. Arrows appear only when the content overflows and disable at the reached end; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eea3d3eb', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` keeps the selected item in view.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fb3d873a', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3f5463b6', 'id'))}">\`
elements+=\`Select an item by click or keyboard (arrow keys, Home/End). With CSS classes, the JS toggles \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a88f5ac5', 'id'))}">\`
elements+=\`w-slide-group-shell--overflow\`
elements+=\`</code>\`
elements+=\` when the content overflows; mark the overflowing state yourself for a static example.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('390757b1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('5b089867', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('912fe145', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('d5c90a1b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('7bbb6a1a', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b5d5f38f', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('299d97c8', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b0832a42', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('406ed1d4', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('565d1fb0', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('4544f4dc', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('0b69ec85', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('e34d1d78', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('af274381', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="alpha" show-arrows="" center-active="" mandatory="" id="\${ty_escapeAttr(ty_generateId('98f2b4b2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="alpha" id="\${ty_escapeAttr(ty_generateId('b8da55f7', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a382b692', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="beta" id="\${ty_escapeAttr(ty_generateId('e918f570', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('118a500f', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="gamma" id="\${ty_escapeAttr(ty_generateId('e0e33cca', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('4d872a09', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="delta" id="\${ty_escapeAttr(ty_generateId('b12c3851', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('65429cdd', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="epsilon" id="\${ty_escapeAttr(ty_generateId('1032aaa2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('033990d8', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="zeta" id="\${ty_escapeAttr(ty_generateId('a5e39515', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('bc0abe80', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eta" id="\${ty_escapeAttr(ty_generateId('4271fb09', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c2c04fc4', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="theta" id="\${ty_escapeAttr(ty_generateId('df0ed73c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f5044b59', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="iota" id="\${ty_escapeAttr(ty_generateId('6b0969b2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('118a1df2', 'id'))}">\`
elements+=\`Iota\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="kappa" id="\${ty_escapeAttr(ty_generateId('6d2a0750', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('74abbb79', 'id'))}">\`
elements+=\`Kappa\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="lambda" id="\${ty_escapeAttr(ty_generateId('43da7874', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('5f006f8c', 'id'))}">\`
elements+=\`Lambda\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="omega" id="\${ty_escapeAttr(ty_generateId('5f82b3e5', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a2db8d8e', 'id'))}">\`
elements+=\`Omega\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
    \`
elements+=\`</w-slide-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a2eb6049', 'id'))}">\`
elements+=\`Arrow visibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c4b50894', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f6e592a', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` takes \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2ac12c8', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\` (default — arrows show only on overflow), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9945f178', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` (always visible, disabled at the ends), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e6d47b7', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\` (never). With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d1e8b7f', 'id'))}">\`
elements+=\`w-slide-group-shell--arrows-always\`
elements+=\`</code>\`
elements+=\` to keep them visible without overflow.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5022545b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--arrows-always" id="\${ty_escapeAttr(ty_generateId('63367d2f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('dee7dd0d', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('e39ce165', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('03e3093b', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('a4ca9577', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('055d3c51', 'id'))}">\`
elements+=\`Three\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" disabled="" id="\${ty_escapeAttr(ty_generateId('2cac0d79', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c6ee1809', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="one" show-arrows="always" mandatory="" id="\${ty_escapeAttr(ty_generateId('0db54f59', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="one" id="\${ty_escapeAttr(ty_generateId('a4b182a1', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c9c9fadd', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="two" id="\${ty_escapeAttr(ty_generateId('3dcebba2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('65327a14', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="three" id="\${ty_escapeAttr(ty_generateId('91946c5c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('0971b595', 'id'))}">\`
elements+=\`Three\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
    \`
elements+=\`</w-slide-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('841ffdc0', 'id'))}">\`
elements+=\`Custom arrow icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8c5a9d31', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26d9746a', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('46bbc09f', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\` to any glyph (defaults \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86a1416a', 'id'))}">\`
elements+=\`‹\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98b2096a', 'id'))}">\`
elements+=\`›\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6f63fc34', 'id'))}">\`
elements+=\`↑\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a8ddbf62', 'id'))}">\`
elements+=\`↓\`
elements+=\`</code>\`
elements+=\` when vertical).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('240c8429', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('5ce3be4b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('c6ffaefe', 'id'))}">\`
elements+=\`−\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('7878a079', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('241d0979', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('f8fd6c65', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('08ff6b61', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('e122e239', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('191094ff', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('ddfabf9e', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('5f0eff49', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('012d1128', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="1" prev-icon="−" next-icon="+" id="\${ty_escapeAttr(ty_generateId('aff73a3e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('495a30d3', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('fae5cdb7', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('baf3509a', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('95aeb8a8', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('bd76ae5e', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f429165e', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('a072d2d0', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('ece95f6b', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('35e29e7a', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('20501631', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('9eebcedf', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c367fe92', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('8d89db97', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('abe171fe', 'id'))}">\`
elements+=\`Tag seven\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('ec5c688a', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('b7bc3491', 'id'))}">\`
elements+=\`Tag eight\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
    \`
elements+=\`</w-slide-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bfefbfc9', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ede133cd', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('806440d2', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` with a fixed height to stack items into a scrollable column.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8a3dd2ac', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--vertical w-slide-group-shell--overflow" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('aee1f5e5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('f7f6b50c', 'id'))}">\`
elements+=\`↑\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('d438f8de', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('b1b32efc', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('58cdc8ec', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('a29af5a1', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('f4d4430e', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('66664a5d', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('28306702', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('14b119e1', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('55bd6631', 'id'))}">\`
elements+=\`Row 8\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('d2170058', 'id'))}">\`
elements+=\`↓\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('aacc1d8f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group direction="vertical" show-arrows="" value="1" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('2b7f8d06', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('32fddb8c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2b1211d9', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('c525ce09', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('d10f6142', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('ad0259db', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('515058c5', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('e3a9bae7', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('00946929', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('16ffb707', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('b6619b1c', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('278fc5b2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('cd880c6d', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('c7962d49', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('6cc8c5a6', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('0c27a60f', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('ec67936f', 'id'))}">\`
elements+=\`Row 8\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
    \`
elements+=\`</w-slide-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('117d7b02', 'id'))}">\`
elements+=\`Multiple selection\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dbe8b183', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b920b592', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to allow more than one selection, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('177e6d73', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\` to require at least one. Selecting emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23cc0371', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the chosen value(s).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bbb56119', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell" id="\${ty_escapeAttr(ty_generateId('5dc9dcaa', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('83bbc711', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('f672afff', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('5ed55b4a', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('1e6e157e', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('76eeee5d', 'id'))}">\`
elements+=\`Support\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('033d34c3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group multiple="" value="design,eng" id="\${ty_escapeAttr(ty_generateId('92c8dc55', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="design" id="\${ty_escapeAttr(ty_generateId('1b7bc7c7', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('46622231', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eng" id="\${ty_escapeAttr(ty_generateId('5b2a00a1', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('10011919', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="sales" id="\${ty_escapeAttr(ty_generateId('76d999d3', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('664f8954', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="support" id="\${ty_escapeAttr(ty_generateId('431a031d', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a3555e98', 'id'))}">\`
elements+=\`Support\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
    \`
elements+=\`</w-slide-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('14d1c36d', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7241af48', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc2e0841', 'id'))}">\`
elements+=\`&lt;w-slide-group&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca93dac2', 'id'))}">\`
elements+=\`&lt;w-slide-group-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1e50507f', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('835ea2af', 'id'))}">\`
elements+=\`&lt;w-slide-group&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('892c883a', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4f13c235', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('999462b0', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0cf6afe', 'id'))}">\`
elements+=\`selected-class\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('477ca621', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('39e682be', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c6a5e6f5', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\` (horizontal · vertical), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('65955d33', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` (true · always · false), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('800de5be', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4eb14a14', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`. Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e38ebf65', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the selected value(s).\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/slide-groups/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
