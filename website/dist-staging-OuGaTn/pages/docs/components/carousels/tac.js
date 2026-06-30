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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('03624319', 'id'))}">\`
elements+=\`Carousels\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0963e967', 'id'))}">\`
elements+=\`Carousels display one slide from a sequence at a time, with arrows, delimiters, keyboard navigation, optional cycling, and a progress bar. They support touch and pointer swipe, custom icons, color theming, side delimiters, and a fade transition.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9ef1e9dc', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d5cc5be9', 'id'))}">\`
elements+=\`Arrow buttons, delimiters, the ←/→/Home/End keys, and horizontal swipe all change the active slide. Set a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('422ddcff', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` on the carousel. Disable swipe with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('99dc100d', 'id'))}">\`
elements+=\`touch="false"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('279f84bf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('5121f36c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('2dafffbb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('3aa43073', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('18353c6a', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('a37d6b02', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('86ba7f5c', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('49def930', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('b1760d0e', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('406fe929', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('0b2277a0', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('47edb743', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('75e796b9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" id="\${ty_escapeAttr(ty_generateId('47446711', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('dd49ac93', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('5f9ac457', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6835cea6', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d5e16abf', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('3b595cd3', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('ac879ca4', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d1d83e69', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('8d97ea52', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d933d8d6', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('03581c21', 'id'))}">\`
elements+=\`Cycle and progress\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f339bea4', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('45d395bc', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\` to auto-advance (every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b38394f', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\` ms, default 6000), pausing on hover and focus. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('496d4aac', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\` shows a linear progress bar.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7dfdd1bb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('df291a97', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('4b80ceec', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('c2b72c90', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('2533a1b0', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('2f9e9618', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('102b0669', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('da50bf90', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('982785d3', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('820a4d64', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" cycle="" interval="3000" progress="" id="\${ty_escapeAttr(ty_generateId('81ddd3a4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9b61527b', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('a23a246d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('bfccdd89', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('02129eb0', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('d808f715', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f4242c08', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('0ec2db58', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('ee60b8a7', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dccab92d', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('48a07bbf', 'id'))}">\`
elements+=\`Arrows on hover\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4193fc0a', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0beaf3e', 'id'))}">\`
elements+=\`show-arrows="hover"\`
elements+=\`</code>\`
elements+=\` to reveal the arrows only on hover or focus. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('30e96752', 'id'))}">\`
elements+=\`w-carousel--arrows-hover\`
elements+=\`</code>\`
elements+=\`. Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('91d90cbe', 'id'))}">\`
elements+=\`show-arrows="false"\`
elements+=\`</code>\`
elements+=\` to hide them entirely.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7ed1ec51', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--arrows-hover" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('092e95a1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('03f6c5c7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('e30b2d77', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d5ea2076', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('923c8ab2', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5f024cc6', 'id'))}">\`
elements+=\`Arrows appear\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('80a44a77', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('875bfe54', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('516b2d1a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" show-arrows="hover" id="\${ty_escapeAttr(ty_generateId('db4fb794', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('ed76fcdd', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('c6e1ee35', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f5ffbb74', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b61d8525', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('e7d92b36', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('b1e1b2de', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('267d93b5', 'id'))}">\`
elements+=\`Custom icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9c6a7377', 'id'))}">\`
elements+=\`Replace the arrow glyphs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f6bf45d0', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0dd10aa7', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, and the delimiter dots with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cf5e989', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a2c4008f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('b7a7fa9c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('9dd55a36', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('c40c8f6a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5335fe57', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('5a607995', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('16475087', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('8083f510', 'id'))}">\`
elements+=\`←\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('20e25f43', 'id'))}">\`
elements+=\`→\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('89b6fd05', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('e610562e', 'id'))}">\`
elements+=\`■\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('5e9a2657', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d3aaa839', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" prev-icon="←" next-icon="→" delimiter-icon="■" id="\${ty_escapeAttr(ty_generateId('1db0790a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('1c00eff0', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('50a37955', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('3f94c25f', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('8b9633b0', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('cdd05cd3', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('875b9969', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('afc6799a', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('0c58c3c0', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d234635c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4e219674', 'id'))}">\`
elements+=\`Delimiter placement\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1623a91e', 'id'))}">\`
elements+=\`Drop the delimiter backdrop with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b407ed0', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, or move the delimiters to a side rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('072d5100', 'id'))}">\`
elements+=\`vertical-delimiters="left"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('27db5beb', 'id'))}">\`
elements+=\`vertical-delimiters="right"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e4c74a7f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--vdelim-left" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('0e3b8e54', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('b818d38c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('20d38564', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('b60a6de7', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('ea5da245', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('4c224e23', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('5abe2e6a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('a8ba1faf', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('8ed338ca', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('55ff153f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" vertical-delimiters="left" id="\${ty_escapeAttr(ty_generateId('6b16ff07', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('79736b5a', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('c06032cc', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('c0f4a593', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('67632cd4', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('5d6a2e22', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('00350a4f', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('e224bfbd', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('43574b72', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('53f3db6f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('40c52c11', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('919a8a84', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f685a038', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` tints the active delimiter and the progress bar with a DuVay palette token. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5a5d282e', 'id'))}">\`
elements+=\`--w-carousel-color\`
elements+=\`</code>\`
elements+=\` custom property.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('acbf45e9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px; --w-carousel-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('950fd591', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('52dc941c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('f55de294', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('42a55ff1', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('0e14c7e0', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8eb9a2ee', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3fc5a43b', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('cbbddc5d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('71d99c63', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('42998796', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('d1e8e01e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('51b8b066', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" color="success" progress="" id="\${ty_escapeAttr(ty_generateId('4c269007', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('14a5aa02', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('4fc8648b', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6605aeb2', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('95dff51c', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('25daca7d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('92333177', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('41d07466', 'id'))}">\`
elements+=\`Fade transition\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('16debac9', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('04987f49', 'id'))}">\`
elements+=\`transition="fade"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f2fba16', 'id'))}">\`
elements+=\`w-carousel--fade\`
elements+=\`</code>\`
elements+=\`) to crossfade between slides instead of sliding. Fade carousels need an explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf7c876c', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` since the slides are stacked.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('79e0b87f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--fade" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('bdf488b0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('171395aa', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item active w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('49aa24bf', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('165c1c92', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('1d5a7b1c', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('ef6e06f5', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('c59090f7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('74121880', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('ee31d3b5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f7a9d26f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" transition="fade" id="\${ty_escapeAttr(ty_generateId('fbae9898', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('06cd6884', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('005ccd1a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('7b6568fb', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d9ee8d7e', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('94bef7ff', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('77b0a625', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('3715a1bb', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('e86a4c4a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('4907b6f8', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0d30e55a', 'id'))}">\`
elements+=\`Image slides\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('693be2a5', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('627bbe0e', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\` a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8765bf15', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14aa53c9', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`) to render a slide image. Images use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c55a1757', 'id'))}">\`
elements+=\`object-fit: cover\`
elements+=\`</code>\`
elements+=\` by default; add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8893dc1', 'id'))}">\`
elements+=\`cover="false"\`
elements+=\`</code>\`
elements+=\` to contain instead.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a4e7a068', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 220px" id="\${ty_escapeAttr(ty_generateId('616f82d4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('8f371919', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('937e7af5', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('a7801aa7', 'id'))}" />\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('4dca9176', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('f8c0b336', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e486bbd3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="220px" id="\${ty_escapeAttr(ty_generateId('7e665e22', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('714e15f1', 'id'))}">\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('d4dc6ce8', 'id'))}">\`
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
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('246519bb', 'id'))}">\`
elements+=\`For the lower-level panel primitive behind carousels, see \`
elements+=\`<a href="/docs/windows" id="\${ty_escapeAttr(ty_generateId('5baba662', 'id'))}">\`
elements+=\`Windows\`
elements+=\`</a>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/carousels/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
