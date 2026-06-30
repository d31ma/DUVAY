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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('2816d8aa', 'id'))}">\`
elements+=\`Animations\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d5b2f475', 'id'))}">\`
elements+=\`DuVay motion combines named transition helpers with Svelte-inspired FLIP, crossfade, tween, and spring helpers. Every helper respects \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('222a31ff', 'id'))}">\`
elements+=\`prefers-reduced-motion\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8832845d', 'id'))}">\`
elements+=\`Named Transitions\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4b012676', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-filled" type="button" data-w-transition-toggle="motion-css-card" data-w-transition-name="scale" id="\${ty_escapeAttr(ty_generateId('fee5dea6', 'id'))}">\`
elements+=\`Toggle scale\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div id="motion-css-card" class="w-card w-card-body w-mt-3 w-scale-transition" data-w-transition="scale">\`
elements+=\`
      \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('8ae68d2e', 'id'))}">\`
elements+=\`Scale transition\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<p class="w-text-muted" id="\${ty_escapeAttr(ty_generateId('ee34514f', 'id'))}">\`
elements+=\`Named helpers mirror Vuetify patterns such as fade, scale, slide, and scroll.\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('88fd299a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="filled" data-w-transition-toggle="motion-wc-card" data-w-transition-name="slide-y" id="\${ty_escapeAttr(ty_generateId('22fba0df', 'id'))}">\`
elements+=\`Toggle slide\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`<w-card id="motion-wc-card" data-w-transition="slide-y">\`
elements+=\`
      \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('4a09216b', 'id'))}">\`
elements+=\`Slide transition\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<p class="w-text-muted" id="\${ty_escapeAttr(ty_generateId('55e7cb5a', 'id'))}">\`
elements+=\`The same data hook works on web components and class-only markup.\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`</w-card>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('76d7abae', 'id'))}">\`
elements+=\`Expansion Height\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bdc3cfbe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-expand" id="\${ty_escapeAttr(ty_generateId('93c1a53b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-expand-header" type="button" data-w-expand-toggle="" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('39d13907', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-expand-title" id="\${ty_escapeAttr(ty_generateId('10242808', 'id'))}">\`
elements+=\`Animated disclosure\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<svg class="w-expand-chevron" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" id="\${ty_escapeAttr(ty_generateId('5fb3a562', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('c04909e2', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-expand-body" id="\${ty_escapeAttr(ty_generateId('0bd6dc00', 'id'))}">\`
elements+=\`
        \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('490cf2dd', 'id'))}">\`
elements+=\`Height now animates from measured content instead of snapping between hidden and visible states.\`
elements+=\`</p>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('89dedc30', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-expansion-panels id="\${ty_escapeAttr(ty_generateId('b0794c26', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-expansion-panel header="Animated item" id="\${ty_escapeAttr(ty_generateId('02d0296e', 'id'))}">\`
elements+=\`
        Expansion panels use the same measured expansion helper internally.
      \`
elements+=\`</w-expansion-panel>\`
elements+=\`
    \`
elements+=\`</w-expansion-panels>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f991302', 'id'))}">\`
elements+=\`FLIP Reorder\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6f26febc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" data-w-flip-reorder="motion-css-flip" data-w-flip-mode="rotate" id="\${ty_escapeAttr(ty_generateId('8c04b959', 'id'))}">\`
elements+=\`Rotate list\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div id="motion-css-flip" class="w-list w-motion-flip w-mt-3" data-w-flip="">\`
elements+=\`
      \`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('0941978f', 'id'))}">\`
elements+=\`<div class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('4a00e6c5', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('bcab9fa1', 'id'))}">\`
elements+=\`Design review\`
elements+=\`</span>\`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('ef63d0d4', 'id'))}">\`
elements+=\`Motion polish\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('7d96e896', 'id'))}">\`
elements+=\`<div class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('529a2b9d', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('755b5ef6', 'id'))}">\`
elements+=\`Implementation\`
elements+=\`</span>\`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('fa842c2c', 'id'))}">\`
elements+=\`Runtime helpers\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-list-item" id="\${ty_escapeAttr(ty_generateId('fc705a17', 'id'))}">\`
elements+=\`<div class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('47a904a4', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('0f52d835', 'id'))}">\`
elements+=\`QA pass\`
elements+=\`</span>\`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('093294bb', 'id'))}">\`
elements+=\`Preview browser\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('66721e2f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="outlined" data-w-flip-reorder="motion-wc-flip" data-w-flip-mode="rotate" id="\${ty_escapeAttr(ty_generateId('c8f7f75e', 'id'))}">\`
elements+=\`Rotate list\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`<w-list id="motion-wc-flip" data-w-flip="" data-w-flip-items="w-list-item">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Design review" subtitle="Motion polish" id="\${ty_escapeAttr(ty_generateId('1b219378', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Implementation" subtitle="Runtime helpers" id="\${ty_escapeAttr(ty_generateId('841e1a80', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="QA pass" subtitle="Preview browser" id="\${ty_escapeAttr(ty_generateId('d0db4079', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c2c56201', 'id'))}">\`
elements+=\`Crossfade\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dfdfd88b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" data-w-crossfade="motion-css-a motion-css-b" data-w-crossfade-toggle="" id="\${ty_escapeAttr(ty_generateId('ba6637fa', 'id'))}">\`
elements+=\`Swap avatar\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-items-center w-mt-3" id="\${ty_escapeAttr(ty_generateId('3319a398', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body" data-w-crossfade-key="motion-css-a" id="\${ty_escapeAttr(ty_generateId('727bc945', 'id'))}">\`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('ad83af45', 'id'))}">\`
elements+=\`DuVay\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body w-transition-hidden" data-w-crossfade-key="motion-css-b" hidden="" id="\${ty_escapeAttr(ty_generateId('f9eb65aa', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-lg" id="\${ty_escapeAttr(ty_generateId('b1b13347', 'id'))}">\`
elements+=\`UI\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c5ea6a76', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="outlined" data-w-crossfade="motion-wc-a motion-wc-b" data-w-crossfade-toggle="" id="\${ty_escapeAttr(ty_generateId('30111ff0', 'id'))}">\`
elements+=\`Swap avatar\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-items-center w-mt-3" id="\${ty_escapeAttr(ty_generateId('2eec13d6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-card data-w-crossfade-key="motion-wc-a" id="\${ty_escapeAttr(ty_generateId('3ecc9b01', 'id'))}">\`
elements+=\`<w-avatar initials="DuVay" id="\${ty_escapeAttr(ty_generateId('39bc5b38', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`</w-card>\`
elements+=\`
      \`
elements+=\`<w-card data-w-crossfade-key="motion-wc-b" hidden="" id="\${ty_escapeAttr(ty_generateId('f152e251', 'id'))}">\`
elements+=\`<w-avatar initials="UI" size="lg" id="\${ty_escapeAttr(ty_generateId('d146c21f', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`</w-card>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('33af3fa3', 'id'))}">\`
elements+=\`Tweened Values\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e7a9a534', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" data-w-tween-start="motion-css-count" id="\${ty_escapeAttr(ty_generateId('c2e6578d', 'id'))}">\`
elements+=\`Replay\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-card w-card-body w-mt-3" id="\${ty_escapeAttr(ty_generateId('5aba0ee9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<strong id="motion-css-count" data-w-tween="" data-w-tween-from="0" data-w-tween-to="84" data-w-tween-suffix="%">\`
elements+=\`0%\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`<div class="w-progress w-mt-3" id="\${ty_escapeAttr(ty_generateId('211f2f7d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-progress-bar" style="width:0" data-w-tween="" data-w-tween-property="width" data-w-tween-from="0" data-w-tween-to="84" id="\${ty_escapeAttr(ty_generateId('47169ec5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('039d99ba', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-card w-card-body" id="\${ty_escapeAttr(ty_generateId('29dc6a39', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-counter value="84" max="100" tween="" id="\${ty_escapeAttr(ty_generateId('a2b3ccf5', 'id'))}">\`
elements+=\`</w-counter>\`
elements+=\`
      \`
elements+=\`<w-progress-linear value="84" tween="" id="\${ty_escapeAttr(ty_generateId('f2eea599', 'id'))}">\`
elements+=\`</w-progress-linear>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('70043887', 'id'))}">\`
elements+=\`Spring Motion\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('16470250', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" data-w-spring-start="motion-css-spring" id="\${ty_escapeAttr(ty_generateId('2ea1e6fe', 'id'))}">\`
elements+=\`Replay spring\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-row w-items-center w-gap-3 w-mt-3" id="\${ty_escapeAttr(ty_generateId('235a4e3a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span id="motion-css-spring" class="w-avatar w-motion-spring" data-w-spring="" data-w-spring-auto="false" data-w-spring-from="0.72" data-w-spring-to="1" data-w-spring-property="scale">\`
elements+=\`S\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-text-muted" id="\${ty_escapeAttr(ty_generateId('2ca182b6', 'id'))}">\`
elements+=\`A small spring helper is useful for counters, chips, and state changes.\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0ab03573', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="outlined" data-w-spring-start="motion-wc-spring" id="\${ty_escapeAttr(ty_generateId('1870e53e', 'id'))}">\`
elements+=\`Replay spring\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`<div class="w-row w-items-center w-gap-3 w-mt-3" id="\${ty_escapeAttr(ty_generateId('e90b6e3c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar id="motion-wc-spring" initials="S" data-w-spring="" data-w-spring-auto="false" data-w-spring-from="0.72" data-w-spring-to="1" data-w-spring-property="scale">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<span class="w-text-muted" id="\${ty_escapeAttr(ty_generateId('405fa047', 'id'))}">\`
elements+=\`The data hook can target any element.\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1aa5b168', 'id'))}">\`
elements+=\`API Reference\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('1c4f4f86', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('fa9c54f8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('05a1f675', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7056f5d9', 'id'))}">\`
elements+=\`Helper\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3c98a484', 'id'))}">\`
elements+=\`Purpose\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('17188a22', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0cb15986', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e055826f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f85af57', 'id'))}">\`
elements+=\`WMotion.enter(el, name)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dd366884', 'id'))}">\`
elements+=\`Shows an element with a named transition.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ea4edd56', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('acd20828', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('04d51674', 'id'))}">\`
elements+=\`WMotion.leave(el, name)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('50f1fa7b', 'id'))}">\`
elements+=\`Hides an element with a named transition.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5e435518', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f8f10146', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6949620', 'id'))}">\`
elements+=\`WMotion.toggle(el, open, name)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8aa477aa', 'id'))}">\`
elements+=\`Switches between enter and leave.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('82f277dc', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4e1ca155', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16c6f60b', 'id'))}">\`
elements+=\`WMotion.setExpand(panel, open)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64adf515', 'id'))}">\`
elements+=\`Measures and animates expansion-panel height.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1368d081', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a4766434', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09b491e0', 'id'))}">\`
elements+=\`WMotion.flip(container, mutate)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7837ee4f', 'id'))}">\`
elements+=\`Runs FLIP animation around a DOM mutation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('72e54c9c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('791764fd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0f3bf93', 'id'))}">\`
elements+=\`WMotion.crossfade(from, to)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('07100449', 'id'))}">\`
elements+=\`Animates a cloned shared element between two targets.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('03eaa594', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4955811c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5c383679', 'id'))}">\`
elements+=\`WMotion.tween(el, options)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cf144903', 'id'))}">\`
elements+=\`Interpolates text, dimensions, transforms, attributes, or CSS variables.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('84a67e1a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('33cf2e1c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c0fea49', 'id'))}">\`
elements+=\`WMotion.spring(el, options)\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('759a7de7', 'id'))}">\`
elements+=\`Applies a damped spring-style value animation.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/animations/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
