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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('0ff509ff', 'id'))}">\`
elements+=\`Slide Groups\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c86762a2', 'id'))}">\`
elements+=\`Slide groups are scrollable, selectable item sets with overflow arrows and keyboard navigation. Arrows appear only when the content overflows and disable at the reached end; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2db8890b', 'id'))}">\`
elements+=\`center-active\`
elements+=\`</code>\`
elements+=\` keeps the selected item in view.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0272ee75', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('007247a5', 'id'))}">\`
elements+=\`Select an item by click or keyboard (arrow keys, Home/End). With CSS classes, the JS toggles \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea9d81c2', 'id'))}">\`
elements+=\`w-slide-group-shell--overflow\`
elements+=\`</code>\`
elements+=\` when the content overflows; mark the overflowing state yourself for a static example.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5e07479a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('02b7f176', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('3de7e72a', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('bdcc9308', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('e20fc3af', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('0248eb30', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('54a386f0', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('7f890151', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('02060c7d', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('9f605335', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('0d4b635b', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('9a863735', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('21a0a19c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2533b82a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="alpha" show-arrows="" center-active="" mandatory="" id="\${ty_escapeAttr(ty_generateId('5ecb6770', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="alpha" id="\${ty_escapeAttr(ty_generateId('8c99ae85', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('e45e286f', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="beta" id="\${ty_escapeAttr(ty_generateId('074609ed', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('5f186bcd', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="gamma" id="\${ty_escapeAttr(ty_generateId('c8e951e4', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('70b0aafc', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="delta" id="\${ty_escapeAttr(ty_generateId('c42f77cf', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('740ee91a', 'id'))}">\`
elements+=\`Delta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="epsilon" id="\${ty_escapeAttr(ty_generateId('3f254878', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a73764f0', 'id'))}">\`
elements+=\`Epsilon\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="zeta" id="\${ty_escapeAttr(ty_generateId('430a7364', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9328f136', 'id'))}">\`
elements+=\`Zeta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eta" id="\${ty_escapeAttr(ty_generateId('f86363cd', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('305facf6', 'id'))}">\`
elements+=\`Eta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="theta" id="\${ty_escapeAttr(ty_generateId('82d49faf', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a2522ecd', 'id'))}">\`
elements+=\`Theta\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="iota" id="\${ty_escapeAttr(ty_generateId('787d4b47', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2db26e16', 'id'))}">\`
elements+=\`Iota\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="kappa" id="\${ty_escapeAttr(ty_generateId('c7ae1481', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('f5cf4f0b', 'id'))}">\`
elements+=\`Kappa\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="lambda" id="\${ty_escapeAttr(ty_generateId('32b2122b', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('da689727', 'id'))}">\`
elements+=\`Lambda\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="omega" id="\${ty_escapeAttr(ty_generateId('6acf1a06', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('8c899a92', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('209cc596', 'id'))}">\`
elements+=\`Arrow visibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c5d85161', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('903c0217', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` takes \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fa4f715', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\` (default — arrows show only on overflow), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b7937cf', 'id'))}">\`
elements+=\`always\`
elements+=\`</code>\`
elements+=\` (always visible, disabled at the ends), or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17aaa0b6', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\` (never). With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1919ada7', 'id'))}">\`
elements+=\`w-slide-group-shell--arrows-always\`
elements+=\`</code>\`
elements+=\` to keep them visible without overflow.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('06955c08', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--arrows-always" id="\${ty_escapeAttr(ty_generateId('0db931c0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('e02052ae', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('56ae491b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('6fa2c8a5', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b66abb79', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('0489f793', 'id'))}">\`
elements+=\`Three\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" disabled="" id="\${ty_escapeAttr(ty_generateId('ad51b5c6', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2956838f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="one" show-arrows="always" mandatory="" id="\${ty_escapeAttr(ty_generateId('26e4ecb3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="one" id="\${ty_escapeAttr(ty_generateId('139ad2ce', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('8ebde3c0', 'id'))}">\`
elements+=\`One\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="two" id="\${ty_escapeAttr(ty_generateId('711b00b6', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2d5170bc', 'id'))}">\`
elements+=\`Two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="three" id="\${ty_escapeAttr(ty_generateId('8712328e', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('79c766b7', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3b36b53d', 'id'))}">\`
elements+=\`Custom arrow icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d5e3dd32', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a606c0a7', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b6b22fd2', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\` to any glyph (defaults \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d5dc231', 'id'))}">\`
elements+=\`‹\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4cd12e60', 'id'))}">\`
elements+=\`›\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b4b157f', 'id'))}">\`
elements+=\`↑\`
elements+=\`</code>\`
elements+=\`/\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7129d784', 'id'))}">\`
elements+=\`↓\`
elements+=\`</code>\`
elements+=\` when vertical).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dab09efe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--overflow" id="\${ty_escapeAttr(ty_generateId('f438d35d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('3d093c93', 'id'))}">\`
elements+=\`−\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('d1fa4470', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('4de274f2', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('1ef73704', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('d2464fdf', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('13942299', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('26402940', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('69100aa2', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('fb757cb8', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('32d8e28d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group value="1" prev-icon="−" next-icon="+" id="\${ty_escapeAttr(ty_generateId('5a329ffe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('47184757', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9fc549be', 'id'))}">\`
elements+=\`Tag one\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('03d1e8e2', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('88ca51ad', 'id'))}">\`
elements+=\`Tag two\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('ed58553c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('ead58902', 'id'))}">\`
elements+=\`Tag three\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('5815ffba', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('bf5fecd7', 'id'))}">\`
elements+=\`Tag four\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('03bb76fb', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('d18bf14f', 'id'))}">\`
elements+=\`Tag five\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('d4f2163d', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('8d570ddb', 'id'))}">\`
elements+=\`Tag six\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('4ff4a8c4', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('7d687b29', 'id'))}">\`
elements+=\`Tag seven\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('c62ef4c6', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('d344547e', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('88030f1a', 'id'))}">\`
elements+=\`Vertical\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('462e9e01', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa1e6a1b', 'id'))}">\`
elements+=\`direction="vertical"\`
elements+=\`</code>\`
elements+=\` with a fixed height to stack items into a scrollable column.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4d320a70', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell w-slide-group-shell--vertical w-slide-group-shell--overflow" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('ac493612', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--prev" type="button" aria-label="Previous items" disabled="" id="\${ty_escapeAttr(ty_generateId('d88aac2c', 'id'))}">\`
elements+=\`↑\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('9d678ce7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('3844b5b6', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('9c01ed93', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('7eb42246', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b3c9b8a0', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('29b807fa', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('174f83b7', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('edd565d9', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('9f73b103', 'id'))}">\`
elements+=\`Row 8\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-slide-group-arrow w-slide-group-arrow--next" type="button" aria-label="Next items" id="\${ty_escapeAttr(ty_generateId('e896fd5f', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9377d018', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group direction="vertical" show-arrows="" value="1" style="height: 16rem" id="\${ty_escapeAttr(ty_generateId('ece7bf29', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="1" id="\${ty_escapeAttr(ty_generateId('ff4cffd7', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('02897f81', 'id'))}">\`
elements+=\`Row 1\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="2" id="\${ty_escapeAttr(ty_generateId('392b9d7b', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9732ddb3', 'id'))}">\`
elements+=\`Row 2\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="3" id="\${ty_escapeAttr(ty_generateId('9c8417c3', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('a3e3b485', 'id'))}">\`
elements+=\`Row 3\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="4" id="\${ty_escapeAttr(ty_generateId('159fae4b', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('394cb13f', 'id'))}">\`
elements+=\`Row 4\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="5" id="\${ty_escapeAttr(ty_generateId('e5d5c66c', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('e8056ea6', 'id'))}">\`
elements+=\`Row 5\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="6" id="\${ty_escapeAttr(ty_generateId('e7bd8299', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('d6a4392d', 'id'))}">\`
elements+=\`Row 6\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="7" id="\${ty_escapeAttr(ty_generateId('be4a0ad0', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2b81fc6e', 'id'))}">\`
elements+=\`Row 7\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="8" id="\${ty_escapeAttr(ty_generateId('87da6206', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9b6c1899', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1a8cf5d5', 'id'))}">\`
elements+=\`Multiple selection\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a4ccf365', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ee7a1c17', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to allow more than one selection, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e99147c0', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\` to require at least one. Selecting emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd15e6bb', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the chosen value(s).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a13e0050', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-slide-group-shell" id="\${ty_escapeAttr(ty_generateId('0131cdae', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-slide-group" id="\${ty_escapeAttr(ty_generateId('a10555c1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('c2fece6d', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item active" id="\${ty_escapeAttr(ty_generateId('6f9420d1', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('6f53d43f', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-slide-group-item" id="\${ty_escapeAttr(ty_generateId('b335afec', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('83b8fa3b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-slide-group multiple="" value="design,eng" id="\${ty_escapeAttr(ty_generateId('ef2b63be', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="design" id="\${ty_escapeAttr(ty_generateId('6629aba3', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('87d923c4', 'id'))}">\`
elements+=\`Design\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="eng" id="\${ty_escapeAttr(ty_generateId('6c778760', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('6dcb1703', 'id'))}">\`
elements+=\`Engineering\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="sales" id="\${ty_escapeAttr(ty_generateId('048790e3', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('2965bfb4', 'id'))}">\`
elements+=\`Sales\`
elements+=\`</button>\`
elements+=\`</w-slide-group-item>\`
elements+=\`
      \`
elements+=\`<w-slide-group-item value="support" id="\${ty_escapeAttr(ty_generateId('6cc1d836', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('44b4bb0a', 'id'))}">\`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/slide-groups/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
