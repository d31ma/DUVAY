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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('97eb26b9', 'id'))}">\`
elements+=\`Carousels\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2c5c4b38', 'id'))}">\`
elements+=\`Carousels display one slide from a sequence at a time, with arrows, delimiters, keyboard navigation, optional cycling, and a progress bar. They support touch and pointer swipe, custom icons, color theming, side delimiters, and a fade transition.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ad8f5054', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('668de7bd', 'id'))}">\`
elements+=\`Arrow buttons, delimiters, the ←/→/Home/End keys, and horizontal swipe all change the active slide. Set a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fedc328', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` on the carousel. Disable swipe with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38b9b2b2', 'id'))}">\`
elements+=\`touch="false"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('84d37f4e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('e3812a47', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('baa7a755', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('8ece0d8c', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('86adb08e', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('3de6b7ac', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('446f73c3', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('8bb1348d', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('4323e6cb', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('13ba4954', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('40dded3e', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('f2a98ebd', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3f50a1dd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" id="\${ty_escapeAttr(ty_generateId('50218aa7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9c6239b1', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('77cf1091', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8315d056', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('2e922960', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('4f13689e', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8dda23d4', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('0b32c7e4', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('203220cf', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('5f1f3e4e', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f6d8bbda', 'id'))}">\`
elements+=\`Cycle and progress\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d22bfcf2', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0511dbd4', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\` to auto-advance (every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('36fcc1b4', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\` ms, default 6000), pausing on hover and focus. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5283e627', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\` shows a linear progress bar.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5d2b9021', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('d95142b1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('fc9abe83', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('183fcccc', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('72f85523', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('cb9e188b', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('317e4b5b', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8d8f90ec', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('87905812', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f7ed8051', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" cycle="" interval="3000" progress="" id="\${ty_escapeAttr(ty_generateId('393f7222', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('2d609a19', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('16c16629', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('0373b844', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('a4361aff', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('acc8a194', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6b466b34', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('f6edc640', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('cf53c58f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('8f61ddf6', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('17521bba', 'id'))}">\`
elements+=\`Arrows on hover\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7b914cb9', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('458e8a87', 'id'))}">\`
elements+=\`show-arrows="hover"\`
elements+=\`</code>\`
elements+=\` to reveal the arrows only on hover or focus. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe326fd9', 'id'))}">\`
elements+=\`w-carousel--arrows-hover\`
elements+=\`</code>\`
elements+=\`. Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cd369f9c', 'id'))}">\`
elements+=\`show-arrows="false"\`
elements+=\`</code>\`
elements+=\` to hide them entirely.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e1d4a878', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--arrows-hover" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('0261eb4d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('a0cfc9fd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('19b418bb', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('c8517ea1', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('0c76e802', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('c7e3f324', 'id'))}">\`
elements+=\`Arrows appear\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('912d7db7', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('eedd4a2e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3fe442de', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" show-arrows="hover" id="\${ty_escapeAttr(ty_generateId('6d73a46a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d22ff91d', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('2daa7768', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('4ed7b5f0', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('e5f39a02', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('e2d87118', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('aebcd964', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3b1f26e0', 'id'))}">\`
elements+=\`Custom icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ea69782a', 'id'))}">\`
elements+=\`Replace the arrow glyphs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('609027fe', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('713b0fbd', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, and the delimiter dots with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('433d03b1', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a79dbe39', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('6ff4f113', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('c8bc1c51', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('8966f387', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6c409342', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('90e5ddfd', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e100d9c2', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('f8afcbbf', 'id'))}">\`
elements+=\`←\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('3f63f352', 'id'))}">\`
elements+=\`→\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('c4a947a3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('0570a470', 'id'))}">\`
elements+=\`■\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('9224af11', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('847cbc19', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" prev-icon="←" next-icon="→" delimiter-icon="■" id="\${ty_escapeAttr(ty_generateId('005dee8a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9ba4d786', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('449b61ac', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('de3fad89', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('e63cc9de', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('ca6f6f0d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('a16b09dd', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('9f9b6e01', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('78940809', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('64abe8bf', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('afcdfdcf', 'id'))}">\`
elements+=\`Delimiter placement\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c69f0b2f', 'id'))}">\`
elements+=\`Drop the delimiter backdrop with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e524a71', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, or move the delimiters to a side rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('753ca05d', 'id'))}">\`
elements+=\`vertical-delimiters="left"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1982508e', 'id'))}">\`
elements+=\`vertical-delimiters="right"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('19c6ccd9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--vdelim-left" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('a9e33dcc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('2d6cd7d4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('296d95d3', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('733aa4f5', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('52e51ba6', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('2766a19a', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('b2469abf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('420c08b2', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('6a9c5160', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e5d81e88', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" vertical-delimiters="left" id="\${ty_escapeAttr(ty_generateId('39cd0add', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('5970c0ec', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('b107d04e', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('1c74ae43', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('7bd640e2', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('29ac7cb3', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dddb05f5', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('73cbe318', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('9fcef38c', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('efd1eaf1', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cb83fb0b', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('73e9c2a7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('437a3314', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` tints the active delimiter and the progress bar with a DuVay palette token. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8e0c1b71', 'id'))}">\`
elements+=\`--w-carousel-color\`
elements+=\`</code>\`
elements+=\` custom property.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5d39335e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px; --w-carousel-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('0306bea9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('fe2baf1c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('211a967f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('1f595783', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('acf71018', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e794ab79', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('38b529d2', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('409ac905', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('e3060e50', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('17a336e7', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('27583641', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('71cd073e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" color="success" progress="" id="\${ty_escapeAttr(ty_generateId('1c5a8562', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('7d66d256', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('57bf93f8', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('a1e621f8', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('be6b7f43', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('17604c94', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f2063223', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d1b9fc22', 'id'))}">\`
elements+=\`Fade transition\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a1bfec0e', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bcc97a70', 'id'))}">\`
elements+=\`transition="fade"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b14fe274', 'id'))}">\`
elements+=\`w-carousel--fade\`
elements+=\`</code>\`
elements+=\`) to crossfade between slides instead of sliding. Fade carousels need an explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('62fba063', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` since the slides are stacked.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1905509d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--fade" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('c49e4185', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('e6519cd7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item active w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('1fa39636', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('d7949e66', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('5485239b', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6a578e83', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('b3b4a782', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('a8b48a17', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('4444d3a8', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ac4b07eb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" transition="fade" id="\${ty_escapeAttr(ty_generateId('da9be8d5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('75ab7ec4', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('08b1c5c2', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('adbcbe17', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('a366d2a0', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('fe9dd45a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f3f32748', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('cb6d0c8e', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('fb09835f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('7468d7fe', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('06a3c896', 'id'))}">\`
elements+=\`Image slides\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ce9a1e6d', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff6d6758', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\` a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67a49277', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('728c2a16', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`) to render a slide image. Images use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32c7eda3', 'id'))}">\`
elements+=\`object-fit: cover\`
elements+=\`</code>\`
elements+=\` by default; add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('31587969', 'id'))}">\`
elements+=\`cover="false"\`
elements+=\`</code>\`
elements+=\` to contain instead.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('13ce2a53', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 220px" id="\${ty_escapeAttr(ty_generateId('5006bf24', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('3ccb215e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('9c1d738c', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('8d2531b4', 'id'))}" />\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('8f59b586', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('87b293e9', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d6104904', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="220px" id="\${ty_escapeAttr(ty_generateId('9d4824eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('f4f95c30', 'id'))}">\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('104367c9', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4f64f525', 'id'))}">\`
elements+=\`Window\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b32f91bd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5a60313', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` is the lower-level primitive used for carousel-like selection flows.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8711e3ae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-window" id="\${ty_escapeAttr(ty_generateId('88e32e3e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-window-track" id="\${ty_escapeAttr(ty_generateId('6115281d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('239997a6', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('2b846b0e', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-window-controls" id="\${ty_escapeAttr(ty_generateId('30bdfb70', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot active" type="button" aria-label="Show item 1" id="\${ty_escapeAttr(ty_generateId('a7983cd2', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot" type="button" aria-label="Show item 2" id="\${ty_escapeAttr(ty_generateId('3587743c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0c9d8c52', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-window show-arrows="" continuous="" height="200px" id="\${ty_escapeAttr(ty_generateId('4e6d063f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('4f12056a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('4984a6a3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('7c5ce16f', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('86f59f3a', 'id'))}">\`
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
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('451c7e4c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('9c9bb2fd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('76344081', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('f90b19df', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ed40d229', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6e89970a', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('847034a6', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ae3e7d44', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1610b88b', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7e11606', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('651cb4f5', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('9d147bda', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('307e025d', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e738be2d', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0b69d3e', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6a66b8c1', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6353d267', 'id'))}">\`
elements+=\`continuous\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('343917c6', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0fe028c5', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24df3602', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('da6c5376', 'id'))}">\`
elements+=\`hover\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a204fec', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19ee1cc3', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('67bf1a7d', 'id'))}">\`
elements+=\`hide-delimiters\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9708d08f', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0167572f', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('39042eec', 'id'))}">\`
elements+=\`vertical-delimiters\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24988ae3', 'id'))}">\`
elements+=\`left\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdcc73b1', 'id'))}">\`
elements+=\`right\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38c2ee56', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8b3ae9f', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('491acbd5', 'id'))}">\`
elements+=\`touch\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('00c08b57', 'id'))}">\`
elements+=\`transition\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaa7e474', 'id'))}">\`
elements+=\`slide\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a0fa30b', 'id'))}">\`
elements+=\`fade\`
elements+=\`</code>\`
elements+=\`). Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3cc58391', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the new index in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('712ede94', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('861b0cc5', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('3f2853e1', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f3fbeaaf', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed14d7a7', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1c65e439', 'id'))}">\`
elements+=\`cover\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/carousels/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
