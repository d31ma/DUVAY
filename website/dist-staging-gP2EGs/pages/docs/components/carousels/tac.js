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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('dc488e4c', 'id'))}">\`
elements+=\`Carousels\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('85fd6bd6', 'id'))}">\`
elements+=\`Carousels display one slide from a sequence at a time, with arrows, delimiters, keyboard navigation, optional cycling, and a progress bar. They support touch and pointer swipe, custom icons, color theming, side delimiters, and a fade transition.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('533ed7c6', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('80c33995', 'id'))}">\`
elements+=\`Arrow buttons, delimiters, the ←/→/Home/End keys, and horizontal swipe all change the active slide. Set a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('10eb0627', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` on the carousel. Disable swipe with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('00e65422', 'id'))}">\`
elements+=\`touch="false"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4106ac83', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('39baa9da', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('f76d72cd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('0d01ab6a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('cfdd9d3e', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('02bc9773', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('c9c71dda', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('3cc486b2', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('d208aeb4', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('91f942ff', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('6f69cca8', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('eb39be6e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('229c07ce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" id="\${ty_escapeAttr(ty_generateId('290312b4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('f911e062', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('aa81bb7a', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('ca871f02', 'id'))}">\`
elements+=\`Launch\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b1aea135', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('893ccd75', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('4c104881', 'id'))}">\`
elements+=\`Review\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('2f79903a', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('7db915e2', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('83de2160', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bc96066c', 'id'))}">\`
elements+=\`Cycle and progress\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('63d6988a', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0cf6b600', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\` to auto-advance (every \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f38b801a', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\` ms, default 6000), pausing on hover and focus. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2cd51225', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\` shows a linear progress bar.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dfffdc60', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('d7f83b84', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('ee856ac9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('e2c5b8bf', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e210691b', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('dc0adf8d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('a6fa68fc', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6e284594', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('c6dd733f', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('740ac1fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" cycle="" interval="3000" progress="" id="\${ty_escapeAttr(ty_generateId('e441ea4d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d5f0896d', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('eb03ad9d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('2715a093', 'id'))}">\`
elements+=\`Auto 1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('fed8e0d5', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('29eb1dd5', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('b6f4bad7', 'id'))}">\`
elements+=\`Auto 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('c3c1157f', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('8921fb9c', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('84e29549', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e2f4e768', 'id'))}">\`
elements+=\`Arrows on hover\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('81f73fbf', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0022073', 'id'))}">\`
elements+=\`show-arrows="hover"\`
elements+=\`</code>\`
elements+=\` to reveal the arrows only on hover or focus. With CSS classes, add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9de512bc', 'id'))}">\`
elements+=\`w-carousel--arrows-hover\`
elements+=\`</code>\`
elements+=\`. Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('224efa95', 'id'))}">\`
elements+=\`show-arrows="false"\`
elements+=\`</code>\`
elements+=\` to hide them entirely.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0c2c48a0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--arrows-hover" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('8c2209ff', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('52cbf330', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('12e1defd', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dad6ecf0', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('2376fb20', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dcdac067', 'id'))}">\`
elements+=\`Arrows appear\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('4affa792', 'id'))}">\`
elements+=\`‹\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('0f5ba4b9', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b90277fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" show-arrows="hover" id="\${ty_escapeAttr(ty_generateId('c5a477ff', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('a8ddb8d5', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('4160b363', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('3a1bc7d0', 'id'))}">\`
elements+=\`Hover me\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b2800709', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('21f6d9bb', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('6c70fd22', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5bdac932', 'id'))}">\`
elements+=\`Custom icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('780466db', 'id'))}">\`
elements+=\`Replace the arrow glyphs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fba50b78', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bee48588', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, and the delimiter dots with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60d36939', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4f602c31', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('50f7ccaf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('1071efc6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('a00b62c1', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('0d30b116', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('f553da4d', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('299f2106', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control prev" type="button" aria-label="Previous slide" id="\${ty_escapeAttr(ty_generateId('df19754f', 'id'))}">\`
elements+=\`←\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-carousel-control next" type="button" aria-label="Next slide" id="\${ty_escapeAttr(ty_generateId('e78802d7', 'id'))}">\`
elements+=\`→\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('1363eb47', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('2299ab87', 'id'))}">\`
elements+=\`■\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter w-carousel-delimiter--icon" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('ec25bf7d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('568a734b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" prev-icon="←" next-icon="→" delimiter-icon="■" id="\${ty_escapeAttr(ty_generateId('e90deb31', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('4cf4e69d', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('d1e14b4f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('eba4a586', 'id'))}">\`
elements+=\`Alpha\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('d6a18e42', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('99ab58ff', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('57487e2b', 'id'))}">\`
elements+=\`Beta\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('637c3794', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('b94ae980', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('cd05f5ee', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c9c4d94d', 'id'))}">\`
elements+=\`Delimiter placement\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c130f928', 'id'))}">\`
elements+=\`Drop the delimiter backdrop with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b1f2d47', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, or move the delimiters to a side rail with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25730006', 'id'))}">\`
elements+=\`vertical-delimiters="left"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d644ee4', 'id'))}">\`
elements+=\`vertical-delimiters="right"\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ca480bd2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--vdelim-left" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('de3cb1de', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('933f66b3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('ef911194', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('471e88ed', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('a6f8a36f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('68ddbbfa', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('06023e0a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('aec02b29', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('deb29f60', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c44dcfb3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" vertical-delimiters="left" id="\${ty_escapeAttr(ty_generateId('2e42a60a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('5e7725f9', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('304b046f', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('64e2e871', 'id'))}">\`
elements+=\`Left rail\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('b3f18ee2', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('f925e567', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('db5d4cbd', 'id'))}">\`
elements+=\`Slide 2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('af30ee60', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('13c37bab', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('de3cd881', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bb427d7c', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b0acadd8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('633e1e34', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` tints the active delimiter and the progress bar with a DuVay palette token. With CSS classes, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('68b6f3ae', 'id'))}">\`
elements+=\`--w-carousel-color\`
elements+=\`</code>\`
elements+=\` custom property.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0c6a59dd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 200px; --w-carousel-color: var(--w-success)" id="\${ty_escapeAttr(ty_generateId('e9d15926', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('0176cb4e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('24c12646', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('ed544ff0', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('59a4e3ac', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('e65e98e7', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-progress" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9de003ec', 'id'))}">\`
elements+=\`<span style="width: 50%" id="\${ty_escapeAttr(ty_generateId('73fa540e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('253cabee', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('b3e05ec7', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('02525672', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('923d3770', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" color="success" progress="" id="\${ty_escapeAttr(ty_generateId('400cc371', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('7db64e79', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('7ed148ad', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('c4cad522', 'id'))}">\`
elements+=\`Build\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('581b4144', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('d2f3a75b', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('dd7b8a76', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('51af5107', 'id'))}">\`
elements+=\`Fade transition\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('05b76635', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('24efd7b2', 'id'))}">\`
elements+=\`transition="fade"\`
elements+=\`</code>\`
elements+=\` (or add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1989b83e', 'id'))}">\`
elements+=\`w-carousel--fade\`
elements+=\`</code>\`
elements+=\`) to crossfade between slides instead of sliding. Fade carousels need an explicit \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b0b3a2cf', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` since the slides are stacked.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('efc9847e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel w-carousel--fade" style="height: 200px" id="\${ty_escapeAttr(ty_generateId('82e2cecc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('12efd8f4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item active w-bg-primary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('cf981d88', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('623f7691', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item w-bg-secondary-container w-pa-8" id="\${ty_escapeAttr(ty_generateId('9701f226', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('3a35e7b9', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-delimiters" role="tablist" id="\${ty_escapeAttr(ty_generateId('122a256f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter active" type="button" role="tab" aria-selected="true" id="\${ty_escapeAttr(ty_generateId('a4ec5e2e', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-carousel-delimiter" type="button" role="tab" aria-selected="false" id="\${ty_escapeAttr(ty_generateId('e571c7d6', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2128a099', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="200px" transition="fade" id="\${ty_escapeAttr(ty_generateId('bf6facd3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('3a7c6e25', 'id'))}">\`
elements+=\`<div class="w-bg-primary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('d4ae7ee9', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('3929875a', 'id'))}">\`
elements+=\`Fade A\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('a8fd21ba', 'id'))}">\`
elements+=\`<div class="w-bg-secondary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('313620db', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('1a9b42b3', 'id'))}">\`
elements+=\`Fade B\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item id="\${ty_escapeAttr(ty_generateId('4d3e8377', 'id'))}">\`
elements+=\`<div class="w-bg-tertiary-container w-pa-8 w-h-100" id="\${ty_escapeAttr(ty_generateId('fdb078be', 'id'))}">\`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('415edc5f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3f2709b5', 'id'))}">\`
elements+=\`Image slides\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c9aab798', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('71707ffd', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\` a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d848be7b', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1918f3b6', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`) to render a slide image. Images use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0324d3ab', 'id'))}">\`
elements+=\`object-fit: cover\`
elements+=\`</code>\`
elements+=\` by default; add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e39eba7b', 'id'))}">\`
elements+=\`cover="false"\`
elements+=\`</code>\`
elements+=\` to contain instead.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('01065557', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-carousel" style="height: 220px" id="\${ty_escapeAttr(ty_generateId('59522bec', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-carousel-track" id="\${ty_escapeAttr(ty_generateId('0c151456', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('cba2c267', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('d84fc5f0', 'id'))}" />\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-carousel-item" id="\${ty_escapeAttr(ty_generateId('0a0e6420', 'id'))}">\`
elements+=\`<img class="w-carousel-img w-carousel-img--cover" src="https://picsum.photos/seed/hecss2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('af4e7661', 'id'))}" />\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('41aa10e4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-carousel height="220px" id="\${ty_escapeAttr(ty_generateId('87ef3ec6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc/800/300" alt="Example one" id="\${ty_escapeAttr(ty_generateId('42435572', 'id'))}">\`
elements+=\`</w-carousel-item>\`
elements+=\`
      \`
elements+=\`<w-carousel-item src="https://picsum.photos/seed/hewc2/800/300" alt="Example two" id="\${ty_escapeAttr(ty_generateId('024a2a92', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4e1215b7', 'id'))}">\`
elements+=\`Window\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('699771a9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e7ae9fd4', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\` is the lower-level primitive used for carousel-like selection flows.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7921660f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-window" id="\${ty_escapeAttr(ty_generateId('30fe8611', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-window-track" id="\${ty_escapeAttr(ty_generateId('c80883a0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('c754fd0a', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-window-item w-pa-6" id="\${ty_escapeAttr(ty_generateId('e9a0c44e', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-window-controls" id="\${ty_escapeAttr(ty_generateId('d84a16e5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot active" type="button" aria-label="Show item 1" id="\${ty_escapeAttr(ty_generateId('ec07edd6', 'id'))}">\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-window-dot" type="button" aria-label="Show item 2" id="\${ty_escapeAttr(ty_generateId('e02cb5a5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1d125b66', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-window show-arrows="" continuous="" height="200px" id="\${ty_escapeAttr(ty_generateId('3f4b2486', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('b8c1743c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('510ccfaf', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('f17181ad', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('dc7399cf', 'id'))}">\`
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
elements+=\`<w-window-item id="\${ty_escapeAttr(ty_generateId('9c0397b1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-pa-6" id="\${ty_escapeAttr(ty_generateId('f9033653', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-text-xl w-font-bold" id="\${ty_escapeAttr(ty_generateId('ddf236cf', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<p class="w-text-body-small" id="\${ty_escapeAttr(ty_generateId('4eaf27ea', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7edc63c7', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d00fefe0', 'id'))}">\`
elements+=\`Components: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('96811e44', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3dc00abc', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('393f7987', 'id'))}">\`
elements+=\`&lt;w-window&gt;\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3af47cf3', 'id'))}">\`
elements+=\`&lt;w-window-item&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ab0f227d', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('29d69830', 'id'))}">\`
elements+=\`&lt;w-carousel&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('246a6992', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('05e2a29f', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('65dba228', 'id'))}">\`
elements+=\`cycle\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37b462f4', 'id'))}">\`
elements+=\`interval\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58fb4cc6', 'id'))}">\`
elements+=\`continuous\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d696079', 'id'))}">\`
elements+=\`show-arrows\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0145aa6e', 'id'))}">\`
elements+=\`true\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f827b79', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9485e567', 'id'))}">\`
elements+=\`hover\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa1b08fa', 'id'))}">\`
elements+=\`prev-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb37789d', 'id'))}">\`
elements+=\`next-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bed997e2', 'id'))}">\`
elements+=\`hide-delimiters\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('05921780', 'id'))}">\`
elements+=\`delimiter-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3a99271', 'id'))}">\`
elements+=\`hide-delimiter-background\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb1d0c82', 'id'))}">\`
elements+=\`vertical-delimiters\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4e3b53be', 'id'))}">\`
elements+=\`left\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3c7128f5', 'id'))}">\`
elements+=\`right\`
elements+=\`</code>\`
elements+=\`), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c2ce0b4e', 'id'))}">\`
elements+=\`progress\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb7c0360', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d84d64d', 'id'))}">\`
elements+=\`touch\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98f5c4b3', 'id'))}">\`
elements+=\`transition\`
elements+=\`</code>\`
elements+=\` (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cde6656c', 'id'))}">\`
elements+=\`slide\`
elements+=\`</code>\`
elements+=\`·\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6f3b1a70', 'id'))}">\`
elements+=\`fade\`
elements+=\`</code>\`
elements+=\`). Emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e71ec10', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` with the new index in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6df7896', 'id'))}">\`
elements+=\`event.detail\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('38a2cda5', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('78b7177d', 'id'))}">\`
elements+=\`&lt;w-carousel-item&gt;\`
elements+=\`</strong>\`
elements+=\` attributes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8f4b046', 'id'))}">\`
elements+=\`src\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d62c934', 'id'))}">\`
elements+=\`alt\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dd4b802d', 'id'))}">\`
elements+=\`cover\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/carousels/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
