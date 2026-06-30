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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('02c2b3c3', 'id'))}">\`
elements+=\`Slide Groups\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('287a2914', 'id'))}">\`
elements+=\`Slide groups are scrollable, selectable item sets with overflow arrows and keyboard navigation. Arrows appear only when the content overflows and disable at the reached end; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25bfea83', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` keeps the selected item in view.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e9e36bf9', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('af45834d', 'id'))}">\`
elements+=\`Select an item by click or keyboard (arrow keys, Home/End). With CSS classes, the JS toggles \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1a7046c', 'id'))}">\`
elements+=\`w-slide-group-shell--overflow\`
elements+=\`</code>\`
elements+=\` when the content overflows; mark the overflowing state yourself for a static example.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eafed1d3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('2f32f650', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('d4108f0c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('62d17cea', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('d2e53550', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('def50a0a', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('a4f5f4ca', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('2c18ae73', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('79aedd7f', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('8a4fc9cf', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('04179b14', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('09a9ade3', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('048b402d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d031b56b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="alpha" show-arrows="" center-active="" mandatory="" id="\${ty_escapeAttr(ty_generateId('c1ef1241', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="alpha" id="\${ty_escapeAttr(ty_generateId('3e963976', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('1be5c767', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="beta" id="\${ty_escapeAttr(ty_generateId('2a522721', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c924a12f', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="gamma" id="\${ty_escapeAttr(ty_generateId('2d35a7ad', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f61ce72a', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="delta" id="\${ty_escapeAttr(ty_generateId('99eebc4e', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9b2723b7', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="epsilon" id="\${ty_escapeAttr(ty_generateId('5a44fd3f', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('cc1c86b0', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="zeta" id="\${ty_escapeAttr(ty_generateId('8f43050e', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2007ac67', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eta" id="\${ty_escapeAttr(ty_generateId('df538912', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c131b619', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="theta" id="\${ty_escapeAttr(ty_generateId('93f31e53', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c7dbc221', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="iota" id="\${ty_escapeAttr(ty_generateId('7f984971', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('24d96e5a', 'id'))}">\`
elements+=\`Iota\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="kappa" id="\${ty_escapeAttr(ty_generateId('964a1cdc', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('67702893', 'id'))}">\`
elements+=\`Kappa\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="lambda" id="\${ty_escapeAttr(ty_generateId('a0756a67', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('03cae4e1', 'id'))}">\`
elements+=\`Lambda\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="omega" id="\${ty_escapeAttr(ty_generateId('6eb99395', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('955bd7c5', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8600203b', 'id'))}">\`
elements+=\`Arrow visibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('636ff1a7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('214d827e', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` takes \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a07e78f', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\` (default — arrows show only on overflow), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3c52939c', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` (always visible, disabled at the ends), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eebeb222', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\` (never). With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5bc8fbb2', 'id'))}">\`
elements+=\`w-slide-group-shell--arrows-always\`
elements+=\`</code>\`
elements+=\` to keep them visible without overflow.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ced81904', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--arrows-always" id="\${ty_escapeAttr(ty_generateId('dc1f5373', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('ea0d246d', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('d8fd343d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('8f329f78', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('97ffa050', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('f6e48adf', 'id'))}">\`
elements+=\`Three\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" disabled="" id="\${ty_escapeAttr(ty_generateId('e0e926bd', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('200085c6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="one" show-arrows="always" mandatory="" id="\${ty_escapeAttr(ty_generateId('34a3c5bb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="one" id="\${ty_escapeAttr(ty_generateId('d64ae7a8', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('0775cb13', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="two" id="\${ty_escapeAttr(ty_generateId('a5cac687', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('bedfdb4a', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="three" id="\${ty_escapeAttr(ty_generateId('ca4ed9a8', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('350735fd', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e2e786b7', 'id'))}">\`
elements+=\`Custom arrow icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f3e2ff82', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aaa069da', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('36a3d4f8', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\` to any glyph (defaults \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9abe534c', 'id'))}">\`
elements+=\`‹\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3a104f73', 'id'))}">\`
elements+=\`›\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aa9cd8de', 'id'))}">\`
elements+=\`↑\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d6e31eaa', 'id'))}">\`
elements+=\`↓\`
elements+=\`</code>\`
elements+=\` when vertical).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7770b476', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('ed6396f9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('3c1ac4ca', 'id'))}">\`
elements+=\`−\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('5a1d68da', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('b02b5801', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('0007e0d7', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('a12562f3', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('ac73023b', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('f96b0add', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('ca3b2c83', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('d522b31c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3c53751c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="1" prev-icon="−" next-icon="+" id="\${ty_escapeAttr(ty_generateId('403e2342', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('706085da', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('45aa65f8', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('35c8e530', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f93a2a75', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('fadc7967', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('5aa19a1d', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('9cc9f710', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('13ed4b88', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('47025d91', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('74cdc2ed', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('d1676607', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f734fb57', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('f8931b8d', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('0137a6b7', 'id'))}">\`
elements+=\`Tag seven\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('ff89b6fc', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('7a9d5433', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b3697b8a', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('11604cb8', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eee7a0cf', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` with a fixed height to stack items into a scrollable column.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('eed59421', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--vertical w-slide-group-shell--overflow" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('463f1b2f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('ba0e0707', 'id'))}">\`
elements+=\`↑\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('1b2d78ec', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('bb3134e3', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('f34ee087', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('37e09412', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b0c24954', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('bc93bc77', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('409542da', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('6b40f316', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('857d8ef4', 'id'))}">\`
elements+=\`Row 8\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('b20afaa1', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1a12724e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group direction="vertical" show-arrows="" value="1" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('d16dc902', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('ac16f39f', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('cf37562f', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('584d7e44', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('15a1a56c', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('fe1ca2cc', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9556191b', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('18273cd6', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('0be8a329', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('0aee3d1c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('dd8f4971', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('66af18fa', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9400f661', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('59ba9972', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f4b7adea', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('a26e66f2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9f1bcf44', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c9231918', 'id'))}">\`
elements+=\`Multiple selection\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b1a42c40', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6f668f0', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to allow more than one selection, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6128fdc7', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\` to require at least one. Selecting emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('751a2389', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` with the chosen value(s).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('295bcdca', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell" id="\${ty_escapeAttr(ty_generateId('442ae9cb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('05e68d58', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('e9758964', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('2637849f', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('95501f03', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('13c20044', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3ebc9431', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group multiple="" value="design,eng" id="\${ty_escapeAttr(ty_generateId('84a00f12', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="design" id="\${ty_escapeAttr(ty_generateId('2f19aa2f', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('ecffb581', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eng" id="\${ty_escapeAttr(ty_generateId('561811ce', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('b98d090d', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="sales" id="\${ty_escapeAttr(ty_generateId('7385ff34', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('3a8592e9', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="support" id="\${ty_escapeAttr(ty_generateId('b2b99fb0', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a080cede', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e26bc205', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('65de1454', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8820963', 'id'))}">\`
elements+=\`&lt;w-slide-group&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('20dd27ce', 'id'))}">\`
elements+=\`&lt;w-slide-group-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('41a9a29f', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('b57e5c23', 'id'))}">\`
elements+=\`&lt;w-slide-group&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da161469', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f68b1a47', 'id'))}">\`
elements+=\`model-value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c0dc5a62', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('998e2c5e', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb9d9cb8', 'id'))}">\`
elements+=\`selected-class\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('faf8319e', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('927517e6', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('45edf519', 'id'))}">\`
elements+=\`direction\`
elements+=\`</code>\`
elements+=\` (horizontal · vertical), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a035eed', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` (true · always · false), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('232ed570', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a7f9c22', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`. Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c78b4315', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` with the selected value(s).\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/slide-groups/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
