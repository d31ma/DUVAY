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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('2d391784', 'id'))}">\`
elements+=\`Menus\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c8f2b75c', 'id'))}">\`
elements+=\`Menu primitives cover dropdown actions, context menus, menubars, and horizontal navigation menus.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f72080da', 'id'))}">\`
elements+=\`Menu\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-menu-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9c51095b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('eb9c9fac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-menu open w-menu--bottom-start" id="\${ty_escapeAttr(ty_generateId('7ed6550f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined w-menu-activator" aria-haspopup="menu" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('d0d0906e', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-menu-content" role="menu" id="\${ty_escapeAttr(ty_generateId('d9216ff7', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('7f7446a5', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('9088ef6d', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<div class="w-menu-separator" id="\${ty_escapeAttr(ty_generateId('3267073e', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('e6fe88a6', 'id'))}">\`
elements+=\`Sign out\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8972679f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('e59f0827', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-menu label="Workspace" open="" location="bottom-start" id="\${ty_escapeAttr(ty_generateId('7dd98967', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('ee77b571', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('8b5b15d7', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-menu-separator" id="\${ty_escapeAttr(ty_generateId('8827f7ca', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('b0ca3c8b', 'id'))}">\`
elements+=\`Sign out\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-menu>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5faef0e5', 'id'))}">\`
elements+=\`Activator and Delays\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-menu-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d00c6dc8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('10d41039', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-menu open w-menu--bottom-start" id="\${ty_escapeAttr(ty_generateId('486ca450', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined w-menu-activator" aria-haspopup="menu" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('82b98f71', 'id'))}">\`
elements+=\`Deploy\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-menu-content" role="menu" id="\${ty_escapeAttr(ty_generateId('b1094bfe', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('325e1556', 'id'))}">\`
elements+=\`Preview build\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('de5d18f2', 'id'))}">\`
elements+=\`Production\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('83608867', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('afbe0219', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-menu label="Deploy" location="bottom-start" open="" open-delay="150" close-delay="120" id="\${ty_escapeAttr(ty_generateId('3d807139', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('5821d9be', 'id'))}">\`
elements+=\`Preview build\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('0f06d4ea', 'id'))}">\`
elements+=\`Production\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-menu>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ae63dbb6', 'id'))}">\`
elements+=\`Dropdown Menu Alias\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ff08cd54', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('0d711a5f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-dropdown-menu open" id="\${ty_escapeAttr(ty_generateId('5bbc5d55', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined w-dropdown-menu-trigger" aria-haspopup="menu" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('19f2d585', 'id'))}">\`
elements+=\`More\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-menu-content w-dropdown-menu-content" role="menu" id="\${ty_escapeAttr(ty_generateId('8a9b002d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('3d685d7b', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('6175606b', 'id'))}">\`
elements+=\`Duplicate\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('17fecb6d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="docs-menu-stage" id="\${ty_escapeAttr(ty_generateId('a848b069', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-dropdown-menu label="More" open="" close-on-content-click="false" id="\${ty_escapeAttr(ty_generateId('aef08c3e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('af611394', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('b5ee2f11', 'id'))}">\`
elements+=\`Duplicate\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-dropdown-menu>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('caa3ec00', 'id'))}">\`
elements+=\`Context Menu\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e59ed57b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-context-menu" id="\${ty_escapeAttr(ty_generateId('03e687af', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body" id="\${ty_escapeAttr(ty_generateId('5162eb39', 'id'))}">\`
elements+=\`Right-click target\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-menu-content w-context-menu-content open" role="menu" style="--w-menu-x: 0px; --w-menu-y: 0px;" id="\${ty_escapeAttr(ty_generateId('4bf9b780', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('6bf869e3', 'id'))}">\`
elements+=\`Back\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('b70ce6de', 'id'))}">\`
elements+=\`Reload\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('f90122d5', 'id'))}">\`
elements+=\`Inspect\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('519da752', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-context-menu label="Page actions" id="\${ty_escapeAttr(ty_generateId('ed56c2e4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body" id="\${ty_escapeAttr(ty_generateId('b532d57a', 'id'))}">\`
elements+=\`Right-click this card\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button slot="content" class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('89987963', 'id'))}">\`
elements+=\`Back\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button slot="content" class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('8c1a22e4', 'id'))}">\`
elements+=\`Reload\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button slot="content" class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('31717ffa', 'id'))}">\`
elements+=\`Inspect\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-context-menu>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1ee6e2f6', 'id'))}">\`
elements+=\`Menubar\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-menubar-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aee5a887', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-menubar" role="menubar" id="\${ty_escapeAttr(ty_generateId('06f0c50e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-menubar-item open" id="\${ty_escapeAttr(ty_generateId('9b23a5a2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menubar-trigger" role="menuitem" aria-haspopup="menu" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('09d2ecb6', 'id'))}">\`
elements+=\`File\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-menu-content w-menubar-content" role="menu" id="\${ty_escapeAttr(ty_generateId('f6fc554f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('302c5a30', 'id'))}">\`
elements+=\`New\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('dc327d5a', 'id'))}">\`
elements+=\`Save\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-menubar-trigger" role="menuitem" id="\${ty_escapeAttr(ty_generateId('65371309', 'id'))}">\`
elements+=\`Edit\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-menubar-trigger" role="menuitem" id="\${ty_escapeAttr(ty_generateId('51d57136', 'id'))}">\`
elements+=\`View\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2f92f16f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-menubar id="\${ty_escapeAttr(ty_generateId('0efad519', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-menubar-item label="File" open="" id="\${ty_escapeAttr(ty_generateId('faf54a34', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('958d8b10', 'id'))}">\`
elements+=\`New\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('8e8be75f', 'id'))}">\`
elements+=\`Save\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-menubar-item>\`
elements+=\`
      \`
elements+=\`<w-menubar-item label="Edit" id="\${ty_escapeAttr(ty_generateId('7c5b3ee5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('fe552e5e', 'id'))}">\`
elements+=\`Undo\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('1b743677', 'id'))}">\`
elements+=\`Redo\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-menubar-item>\`
elements+=\`
      \`
elements+=\`<w-menubar-item label="View" id="\${ty_escapeAttr(ty_generateId('6c26eb6b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-menu-item" role="menuitem" id="\${ty_escapeAttr(ty_generateId('ced94d26', 'id'))}">\`
elements+=\`Command palette\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</w-menubar-item>\`
elements+=\`
    \`
elements+=\`</w-menubar>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('916d211e', 'id'))}">\`
elements+=\`Navigation Menu\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bc145a6d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<nav class="w-navigation-menu" aria-label="Primary" id="\${ty_escapeAttr(ty_generateId('e2c5ac94', 'id'))}">\`
elements+=\`
      \`
elements+=\`<a class="w-navigation-menu-item active" href="/docs/menus" aria-current="page" id="\${ty_escapeAttr(ty_generateId('6ce67c3a', 'id'))}">\`
elements+=\`Docs\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-navigation-menu-item" href="/docs/components" id="\${ty_escapeAttr(ty_generateId('fcb4a56c', 'id'))}">\`
elements+=\`Components\`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-navigation-menu-item" href="/docs/resources" id="\${ty_escapeAttr(ty_generateId('f8b69d80', 'id'))}">\`
elements+=\`Resources\`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</nav>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ac379b1b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-navigation-menu id="\${ty_escapeAttr(ty_generateId('fc492b98', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-navigation-menu-item href="/docs/menus" label="Docs" active="" id="\${ty_escapeAttr(ty_generateId('98fc9cb5', 'id'))}">\`
elements+=\`</w-navigation-menu-item>\`
elements+=\`
      \`
elements+=\`<w-navigation-menu-item href="/docs/components" label="Components" id="\${ty_escapeAttr(ty_generateId('9aaf7cb7', 'id'))}">\`
elements+=\`</w-navigation-menu-item>\`
elements+=\`
      \`
elements+=\`<w-navigation-menu-item href="/docs/resources" label="Resources" id="\${ty_escapeAttr(ty_generateId('b8ac1b44', 'id'))}">\`
elements+=\`</w-navigation-menu-item>\`
elements+=\`
    \`
elements+=\`</w-navigation-menu>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/menus/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
