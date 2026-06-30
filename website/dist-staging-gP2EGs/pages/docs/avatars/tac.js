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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('abe8efd7', 'id'))}">\`
elements+=\`Avatars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('97d07ca4', 'id'))}">\`
elements+=\`User profile images, icons, initials, and badge indicators.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('340e4033', 'id'))}">\`
elements+=\`Content\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3805320', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('94b3587c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('5fe2ebe4', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=1" alt="Ari Lane" id="\${ty_escapeAttr(ty_generateId('4dd91a95', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" data-w-initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('a585e6ab', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('9af2c41c', 'id'))}">\`
elements+=\`<span class="w-avatar-icon" id="\${ty_escapeAttr(ty_generateId('b205ef8a', 'id'))}">\`
elements+=\`person\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('42a69403', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('e6c4556b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=1" alt="Ari Lane" id="\${ty_escapeAttr(ty_generateId('a56d952f', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DUVAY" alt="DuVay initials" id="\${ty_escapeAttr(ty_generateId('47131533', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar icon="person" alt="Person icon" id="\${ty_escapeAttr(ty_generateId('cf7f3fcd', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6e71fe64', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('30e9d45c', 'id'))}">\`
elements+=\`Use Vuetify-style sizes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('888c2e2b', 'id'))}">\`
elements+=\`x-small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86ab5c43', 'id'))}">\`
elements+=\`small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd03cc29', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5be4cde2', 'id'))}">\`
elements+=\`large\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7c566139', 'id'))}">\`
elements+=\`x-large\`
elements+=\`</code>\`
elements+=\`. DuVay aliases like \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ff318db', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('05361651', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` still work.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7028ddae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('eb969a3f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--x-small" data-w-initials="XS" id="\${ty_escapeAttr(ty_generateId('6f3a3827', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--small" data-w-initials="SM" id="\${ty_escapeAttr(ty_generateId('d8c52020', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" data-w-initials="MD" id="\${ty_escapeAttr(ty_generateId('611a5221', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--large" data-w-initials="LG" id="\${ty_escapeAttr(ty_generateId('fbf29533', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--x-large" data-w-initials="XL" id="\${ty_escapeAttr(ty_generateId('12193290', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9056aa3e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('77b96624', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="XS" size="x-small" id="\${ty_escapeAttr(ty_generateId('ee4c6152', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="SM" size="small" id="\${ty_escapeAttr(ty_generateId('890133ea', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="MD" id="\${ty_escapeAttr(ty_generateId('33f3f9d4', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="LG" size="large" id="\${ty_escapeAttr(ty_generateId('86980675', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="XL" size="x-large" id="\${ty_escapeAttr(ty_generateId('18d08652', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fc2dea97', 'id'))}">\`
elements+=\`Variants and Color\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d011cb06', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('03bc1229', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-primary w-avatar--variant-flat" data-w-initials="FL" id="\${ty_escapeAttr(ty_generateId('90ebeff2', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-success w-avatar--variant-tonal" data-w-initials="TO" id="\${ty_escapeAttr(ty_generateId('3141a707', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-warning w-avatar--variant-outlined" data-w-initials="OU" id="\${ty_escapeAttr(ty_generateId('6d2c2fc9', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-error w-avatar--variant-elevated" data-w-initials="EV" id="\${ty_escapeAttr(ty_generateId('e5365164', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('79ea83eb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('e21c39c9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="FL" color="primary" variant="flat" id="\${ty_escapeAttr(ty_generateId('d55e2b4c', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="TO" color="success" variant="tonal" id="\${ty_escapeAttr(ty_generateId('53389628', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="OU" color="warning" variant="outlined" id="\${ty_escapeAttr(ty_generateId('4dc2371b', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="EV" color="error" variant="elevated" id="\${ty_escapeAttr(ty_generateId('83e25754', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1f1b026a', 'id'))}">\`
elements+=\`Rounded, Border, and Density\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5da33520', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('515d0986', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--rounded w-avatar--border" data-w-initials="RO" id="\${ty_escapeAttr(ty_generateId('2280e1d2', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--tile w-avatar--color-secondary" data-w-initials="TI" id="\${ty_escapeAttr(ty_generateId('da65a4db', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--density-compact w-avatar--color-tertiary" data-w-initials="DE" id="\${ty_escapeAttr(ty_generateId('0603a541', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3441d1ce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('c15ed29e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="RO" rounded="" border="" id="\${ty_escapeAttr(ty_generateId('4c742f36', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="TI" tile="" color="secondary" id="\${ty_escapeAttr(ty_generateId('1fc9342d', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DE" density="compact" color="tertiary" id="\${ty_escapeAttr(ty_generateId('d686fa6b', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('375ce9e1', 'id'))}">\`
elements+=\`Badges\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('91eef720', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-5 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('2e4d9fc3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap" id="\${ty_escapeAttr(ty_generateId('c89e4dcd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('8298dcfe', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=2" alt="User" id="\${ty_escapeAttr(ty_generateId('cf70a78c', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--success w-avatar-badge--dot w-avatar-badge--top-end" id="\${ty_escapeAttr(ty_generateId('65653435', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap w-avatar-wrap--floating" id="\${ty_escapeAttr(ty_generateId('88924931', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('5a6cfd9a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--warning w-avatar-badge--bottom-start" id="\${ty_escapeAttr(ty_generateId('c8841bc7', 'id'))}">\`
elements+=\`4\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap" id="\${ty_escapeAttr(ty_generateId('ae4022a9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="VIP" id="\${ty_escapeAttr(ty_generateId('d12d7627', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--primary w-avatar-badge--top-end" id="\${ty_escapeAttr(ty_generateId('8e2bcb99', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('86904586', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-5 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('432203e3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=2" alt="User" badge="success" id="\${ty_escapeAttr(ty_generateId('5cd1aaae', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DUVAY" badge-color="warning" badge-content="4" badge-location="bottom start" badge-floating="" id="\${ty_escapeAttr(ty_generateId('1a1c91d6', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="VIP" badge="primary" id="\${ty_escapeAttr(ty_generateId('f909c351', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="badge" id="\${ty_escapeAttr(ty_generateId('eb46c2a6', 'id'))}">\`
elements+=\`new\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5605760a', 'id'))}">\`
elements+=\`Status Indicator\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5e4c3818', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('30ff9832', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-online" id="\${ty_escapeAttr(ty_generateId('13732420', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=3" alt="User" id="\${ty_escapeAttr(ty_generateId('b2dee352', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-away" id="\${ty_escapeAttr(ty_generateId('6639b596', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=4" alt="User" id="\${ty_escapeAttr(ty_generateId('bd5b41d9', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-busy" id="\${ty_escapeAttr(ty_generateId('2d2f5744', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=5" alt="User" id="\${ty_escapeAttr(ty_generateId('98cd220a', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7f4dbdc6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('eba5ee14', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=3" status="online" id="\${ty_escapeAttr(ty_generateId('78283e85', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=4" status="away" id="\${ty_escapeAttr(ty_generateId('411412d6', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=5" status="busy" id="\${ty_escapeAttr(ty_generateId('61ff3903', 'id'))}">\`
elements+=\`</w-avatar>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/avatars/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
