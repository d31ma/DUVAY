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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('55c82adc', 'id'))}">\`
elements+=\`Carousels\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('37a00f6d', 'id'))}">\`
elements+=\`Carousels display one slide from a sequence at a time, with arrows, delimiters, keyboard navigation, optional cycling, and a progress bar. They support touch and pointer swipe, custom icons, color theming, side delimiters, and a fade transition.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('81819723', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e088b5d9', 'id'))}">\`
elements+=\`Arrow buttons, delimiters, the ←/→/Home/End keys, and horizontal swipe all change the active slide. Set a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('33dbd82b', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` on the carousel. Disable swipe with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2adb9f4f', 'id'))}">\`
elements+=\`touch="false"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a1516f64', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('9f89dcc6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('b1da4692', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('98433153', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('7ceeb70a', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('06d7d5e5', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('811237ba', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('e1f45983', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('941215e2', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('484e5cc4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('1d7a5536', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('c4127853', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('29c6cfd0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" id="\${ty_escapeAttr(ty_generateId('621baa33', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('f0401ca3', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('74c1a882', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('54b7f281', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('2fbe90ef', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('41cdf8f7', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e8ff2556', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9f3f3ef8', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('5a8ca789', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6e7eebff', 'id'))}">\`
elements+=\`Validate\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2ee46ba0', 'id'))}">\`
elements+=\`Cycle and progress\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b946ac2e', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8edec340', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\` to auto-advance (every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('984a5cf5', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\` ms, default 6000), pausing on hover and focus. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('209a8483', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\` shows a linear progress bar.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('38f86c2c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('e8fb0ebf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('b58643f8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('78810cd7', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d3d4d007', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('88b6a904', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6f479d8b', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('fe3eaba5', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('cc55efc1', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3e6eaa05', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" cycle="" interval="3000" progress="" id="\${ty_escapeAttr(ty_generateId('9ef2b0e6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b2f09b10', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('8c40ec85', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('9420119d', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('ea7cc94b', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('bc629f57', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('42839a1b', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('8441a761', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('a1e34685', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('3a84f2cc', 'id'))}">\`
elements+=\`Auto 3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7e0621ab', 'id'))}">\`
elements+=\`Arrows on hover\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fe34e551', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1c899abd', 'id'))}">\`
elements+=\`show-arrows="hover"\`
elements+=\`</code>\`
elements+=\` to reveal the arrows only on hover or focus. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('53281c97', 'id'))}">\`
elements+=\`w-carousel--arrows-hover\`
elements+=\`</code>\`
elements+=\`. Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('12ca11b7', 'id'))}">\`
elements+=\`show-arrows="false"\`
elements+=\`</code>\`
elements+=\` to hide them entirely.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7a7c8772', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--arrows-hover" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('c19a06e4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('ffbd2bc1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('2b9d0f60', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('226075ef', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('9a1e4464', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('29efd6f5', 'id'))}">\`
elements+=\`Arrows appear\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('fd816769', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('5a40d0da', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ea218f72', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" show-arrows="hover" id="\${ty_escapeAttr(ty_generateId('9ef162c1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9e891788', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('e0fc9cdf', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8a62c3a1', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('5d97e26d', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('0bae8493', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('54f4f721', 'id'))}">\`
elements+=\`Arrows appear\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('155dae74', 'id'))}">\`
elements+=\`Custom icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9c64ef3d', 'id'))}">\`
elements+=\`Replace the arrow glyphs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d49a40e', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc1de2b9', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, and the delimiter dots with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26c569f7', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2a191bab', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('7939ad56', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('42cb9d82', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('1ec67692', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('2557d16d', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('4079282a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5d9b8ea9', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('1c6bf4fc', 'id'))}">\`
elements+=\`←\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('53d3242b', 'id'))}">\`
elements+=\`→\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('656c726b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('79133b92', 'id'))}">\`
elements+=\`■\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('53d20576', 'id'))}">\`
elements+=\`■\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2e6aa2de', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" prev-icon="←" next-icon="→" delimiter-icon="■" id="\${ty_escapeAttr(ty_generateId('4148d719', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('cb516222', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('714e28a8', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('601b0280', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('8e72a012', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('15f950a1', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('76d062b5', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('bf85227f', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('6443d0bd', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('2515a028', 'id'))}">\`
elements+=\`Gamma\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3f1e1388', 'id'))}">\`
elements+=\`Delimiter placement\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('864b0282', 'id'))}">\`
elements+=\`Drop the delimiter backdrop with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4178fa89', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, or move the delimiters to a side rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('894d46e6', 'id'))}">\`
elements+=\`vertical-delimiters="left"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('483313e2', 'id'))}">\`
elements+=\`vertical-delimiters="right"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('32dcf912', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--vdelim-left" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('215b2490', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('cd6c17c1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('ae6429dc', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f0b16de2', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('ab4fc01b', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8b9b3a59', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('a6df664c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('76e7dd08', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('e154e0d6', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a720a125', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" vertical-delimiters="left" id="\${ty_escapeAttr(ty_generateId('c2de389a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('a34c35bd', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('5384f85f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5230d050', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('14dcc5f3', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('41ad2fa4', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dbdcb9e9', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('7d187e16', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('0a69d5bf', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e9bdad63', 'id'))}">\`
elements+=\`Slide 3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bacc263e', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8488a89c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc8c6f91', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` tints the active delimiter and the progress bar with a DuVay palette token. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69d02616', 'id'))}">\`
elements+=\`--w-carousel-color\`
elements+=\`</code>\`
elements+=\` custom property.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('919e51d5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px; --w-carousel-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('be69d071', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('a0a523b4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('6bec97c4', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('af624f0f', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('b80a09f7', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('75e64130', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('10d45a6c', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('bed2c5cb', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('9f90b0dd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('34f43e26', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('7d667607', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('62341231', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" color="success" progress="" id="\${ty_escapeAttr(ty_generateId('9f5e9094', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('c9cc1f70', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('40fa47ba', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('bdcffe2a', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('e6c45faf', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('44265c57', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d5462ec5', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d268c213', 'id'))}">\`
elements+=\`Fade transition\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0a2dd183', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e020ada7', 'id'))}">\`
elements+=\`transition="fade"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7101920', 'id'))}">\`
elements+=\`w-carousel--fade\`
elements+=\`</code>\`
elements+=\`) to crossfade between slides instead of sliding. Fade carousels need an explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('69f2fe78', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` since the slides are stacked.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('22f352eb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--fade" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('83af93b0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('63a68bfc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item active w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('f3880c3f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('1e6050b0', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('12c57577', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6e06b909', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('b1b9135d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('600162dd', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('05c2a124', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('366e6202', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" transition="fade" id="\${ty_escapeAttr(ty_generateId('c7453bba', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('ebb7da53', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('703af516', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dc3f4960', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('526af2f4', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('06164e08', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5f35705f', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b185e88f', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('b3e103d5', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8a5fa2f9', 'id'))}">\`
elements+=\`Fade C\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d33a367c', 'id'))}">\`
elements+=\`Image slides\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bebfd7ac', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c17d4bfe', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\` a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7575894c', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b470d90', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`) to render a slide image. Images use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd99c2ce', 'id'))}">\`
elements+=\`object-fit: cover\`
elements+=\`</code>\`
elements+=\` by default; add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d649f4d8', 'id'))}">\`
elements+=\`cover="false"\`
elements+=\`</code>\`
elements+=\` to contain instead.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d07379a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 220px" id="\${ty_escapeAttr(ty_generateId('179d32d0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('4f6c451d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('d2767c78', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('763c6f66', 'id'))}" />\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('87eedeaa', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('87bd6631', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b024ca8f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="220px" id="\${ty_escapeAttr(ty_generateId('29b23a56', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('ee19278c', 'id'))}">\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('78bd744a', 'id'))}">\`
elements+=\`</w-carousel-item>\`
elements+=\`
    \`
elements+=\`</w-carousel>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f690c0a8', 'id'))}">\`
elements+=\`Window\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2f84a6c4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b3deda2', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` is the lower-level primitive used for carousel-like selection flows.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3f355dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-window" id="\${ty_escapeAttr(ty_generateId('58812eb9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-window-track" id="\${ty_escapeAttr(ty_generateId('cffcdd16', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('01a073a9', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('3c552a87', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-window-controls" id="\${ty_escapeAttr(ty_generateId('a61ad71b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot active" type="button" aria-label="Show item 1" id="\${ty_escapeAttr(ty_generateId('97b296eb', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot" type="button" aria-label="Show item 2" id="\${ty_escapeAttr(ty_generateId('fab6dba0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('88d2da5d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-window show-arrows="" continuous="" height="200px" id="\${ty_escapeAttr(ty_generateId('054ddd79', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('74347b19', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('70f7bc32', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('542c4be7', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('c4c4368e', 'id'))}">\`
elements+=\`Use arrows, dots, Home, End, and arrow keys.\`
elements+=\`</p>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</w-window-item>\`
elements+=\`
      \`
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('4cf36c03', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('c4299ff0', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d3d80b50', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('ef348479', 'id'))}">\`
elements+=\`The active item receives selected state and aria-hidden sync.\`
elements+=\`</p>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</w-window-item>\`
elements+=\`
    \`
elements+=\`</w-window>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6084a5ee', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('133f4a9c', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e63de722', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f3934a78', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99b76050', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('800115c8', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4d715901', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('5d727c94', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb48ec1f', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('908d3492', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8018187b', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8c6bd088', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8689a0f', 'id'))}">\`
elements+=\`continuous\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('68058385', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ddce225f', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb47e670', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb933d48', 'id'))}">\`
elements+=\`hover\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f43e2ae6', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09dd9500', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4f5e0c35', 'id'))}">\`
elements+=\`hide-delimiters\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d604ba40', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5b319dad', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a6f4c35', 'id'))}">\`
elements+=\`vertical-delimiters\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a163e5ce', 'id'))}">\`
elements+=\`left\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('195e949e', 'id'))}">\`
elements+=\`right\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e66cd93a', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e11dd2a', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7ab71bda', 'id'))}">\`
elements+=\`touch\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('54f22a79', 'id'))}">\`
elements+=\`transition\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8a254a89', 'id'))}">\`
elements+=\`slide\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('96860329', 'id'))}">\`
elements+=\`fade\`
elements+=\`</code>\`
elements+=\`). Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5a8e7b80', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\` with the new index in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbeb2473', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2db17875', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('db482976', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a9dcebb', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d3d2ecc', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7bfba4c7', 'id'))}">\`
elements+=\`cover\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/carousels/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
