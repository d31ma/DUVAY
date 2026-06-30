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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('1ef1c3c0', 'id'))}">\`
elements+=\`Badges\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7986ca5b', 'id'))}">\`
elements+=\`Small status descriptors for counts, presence, icons, and short labels.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('79297c46', 'id'))}">\`
elements+=\`Content\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b6b24db7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1fcb2c7c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('aaa0d93c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-icon" type="button" aria-label="Messages" id="\${ty_escapeAttr(ty_generateId('1521e8a0', 'id'))}">\`
elements+=\`M\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-primary" id="\${ty_escapeAttr(ty_generateId('2d718e05', 'id'))}">\`
elements+=\`4\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('7e124030', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('d26b01ca', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-error" id="\${ty_escapeAttr(ty_generateId('15795957', 'id'))}">\`
elements+=\`99+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('563be01e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="AB" id="\${ty_escapeAttr(ty_generateId('f58b3672', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-success w-badge-dot" aria-label="Online" id="\${ty_escapeAttr(ty_generateId('f5064dd5', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e919d64f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('838f3aa5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-badge content="4" color="primary" id="\${ty_escapeAttr(ty_generateId('9db2f47a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="icon" aria-label="Messages" id="\${ty_escapeAttr(ty_generateId('80c07799', 'id'))}">\`
elements+=\`M\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge content="128" max="99" id="\${ty_escapeAttr(ty_generateId('710ce632', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('81ee269f', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge dot="" color="success" label="Online" id="\${ty_escapeAttr(ty_generateId('488aef65', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-avatar initials="AB" id="\${ty_escapeAttr(ty_generateId('38ee029b', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('37156512', 'id'))}">\`
elements+=\`Locations and Offsets\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('78643f5c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('effc1ec8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap w-badge-wrap--top-start" id="\${ty_escapeAttr(ty_generateId('9ae18e79', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('0ac96584', 'id'))}">\`
elements+=\`Top start\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content" id="\${ty_escapeAttr(ty_generateId('fae1cac9', 'id'))}">\`
elements+=\`1\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('7e0547e0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('3a979971', 'id'))}">\`
elements+=\`Top end\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content" id="\${ty_escapeAttr(ty_generateId('566b0c1b', 'id'))}">\`
elements+=\`2\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap w-badge-wrap--bottom-start" id="\${ty_escapeAttr(ty_generateId('b5e0d405', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('1ee34510', 'id'))}">\`
elements+=\`Bottom start\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content" id="\${ty_escapeAttr(ty_generateId('3929aeaf', 'id'))}">\`
elements+=\`3\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap w-badge-wrap--bottom-end w-badge-wrap--floating" id="\${ty_escapeAttr(ty_generateId('dddef07a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('f7bfc4d7', 'id'))}">\`
elements+=\`Floating\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content" id="\${ty_escapeAttr(ty_generateId('1a854069', 'id'))}">\`
elements+=\`4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('964b8a2d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('86df3215', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-badge content="1" location="top-start" id="\${ty_escapeAttr(ty_generateId('34210cfb', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('6347a041', 'id'))}">\`
elements+=\`Top start\`
elements+=\`</w-btn>\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge content="2" location="top end" id="\${ty_escapeAttr(ty_generateId('85abdd7d', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('2a274d41', 'id'))}">\`
elements+=\`Top end\`
elements+=\`</w-btn>\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge content="3" location="bottom-start" id="\${ty_escapeAttr(ty_generateId('cbe0c969', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('a4d983b5', 'id'))}">\`
elements+=\`Bottom start\`
elements+=\`</w-btn>\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge content="4" location="bottom-end" floating="" offset-x="4" offset-y="4" id="\${ty_escapeAttr(ty_generateId('78802460', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('df9d7f77', 'id'))}">\`
elements+=\`Floating\`
elements+=\`</w-btn>\`
elements+=\`</w-badge>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('891210fe', 'id'))}">\`
elements+=\`Dot, Border, and Icon\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('221d0343', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('f0888544', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('6d4d3681', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('b860e5d5', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-success w-badge-dot w-badge-bordered" aria-label="Active" id="\${ty_escapeAttr(ty_generateId('00dbfbd0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('8c62a85e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('4d1b4ea4', 'id'))}">\`
elements+=\`Upload\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-warning w-badge-bordered" id="\${ty_escapeAttr(ty_generateId('07d1de16', 'id'))}">\`
elements+=\`!\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0d0f64bf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('ac1520c0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-badge dot="" dot-size="14" color="success" bordered="" label="Active" id="\${ty_escapeAttr(ty_generateId('aede6918', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-avatar initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('8090e9fa', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge icon="!" color="warning" bordered="" id="\${ty_escapeAttr(ty_generateId('6b7d4325', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('d1b07cc2', 'id'))}">\`
elements+=\`Upload\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3a8ba470', 'id'))}">\`
elements+=\`Inline Labels\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f225b1dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('55e80e88', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-primary" id="\${ty_escapeAttr(ty_generateId('3a7b2742', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-success" id="\${ty_escapeAttr(ty_generateId('8d2c32f9', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-warning" id="\${ty_escapeAttr(ty_generateId('79e43847', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-error" id="\${ty_escapeAttr(ty_generateId('0ddc8b9d', 'id'))}">\`
elements+=\`Error\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-outlined" id="\${ty_escapeAttr(ty_generateId('e81d436d', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge w-badge-tonal w-badge-success" id="\${ty_escapeAttr(ty_generateId('cfda47d2', 'id'))}">\`
elements+=\`Tonal\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ba5e79a2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('53f4df47', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Primary" color="primary" id="\${ty_escapeAttr(ty_generateId('2a6ac180', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Success" color="success" id="\${ty_escapeAttr(ty_generateId('cada3da6', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Warning" color="warning" id="\${ty_escapeAttr(ty_generateId('e7acc802', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Error" color="error" id="\${ty_escapeAttr(ty_generateId('8c6bd7af', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Outlined" variant="outlined" id="\${ty_escapeAttr(ty_generateId('be95bd02', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge inline="" content="Tonal" variant="tonal" color="success" id="\${ty_escapeAttr(ty_generateId('f0914e88', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cd3af83c', 'id'))}">\`
elements+=\`Model and Badge Slot\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9432ab0a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('66a95189', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('fad7b036', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('d58cc795', 'id'))}">\`
elements+=\`Hidden badge\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-badge-wrap" id="\${ty_escapeAttr(ty_generateId('5112a1ea', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-outlined" type="button" id="\${ty_escapeAttr(ty_generateId('0018d6fb', 'id'))}">\`
elements+=\`Custom\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<span class="w-badge w-badge-content w-badge-primary" id="\${ty_escapeAttr(ty_generateId('546a22e1', 'id'))}">\`
elements+=\`new\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('629c698e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('50037c96', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-badge content="5" active="false" id="\${ty_escapeAttr(ty_generateId('499faa9b', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('f22d6f30', 'id'))}">\`
elements+=\`Hidden badge\`
elements+=\`</w-btn>\`
elements+=\`</w-badge>\`
elements+=\`
      \`
elements+=\`<w-badge color="primary" id="\${ty_escapeAttr(ty_generateId('676c0cb6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('3d44c18a', 'id'))}">\`
elements+=\`Custom\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<span slot="badge" id="\${ty_escapeAttr(ty_generateId('18194a51', 'id'))}">\`
elements+=\`new\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-badge>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/badges/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
