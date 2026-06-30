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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('5b498b7a', 'id'))}">\`
elements+=\`Floating Action Buttons\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('671df8f6', 'id'))}">\`
elements+=\`Prominent circular buttons for the primary action on a screen. DuVay FABs support Vuetify-style sizes, variants, colors, positioning, and extended labels.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('16a6bf2d', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('075d331f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('a70e212a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab" type="button" aria-label="Add" id="\${ty_escapeAttr(ty_generateId('4cafd302', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b7857707', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--extended" type="button" aria-label="Compose" id="\${ty_escapeAttr(ty_generateId('126f9c08', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('7853ca79', 'id'))}">\`
elements+=\`✎\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-fab__label" id="\${ty_escapeAttr(ty_generateId('616d8b54', 'id'))}">\`
elements+=\`Compose\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('98e7a690', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('9e29eada', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" aria-label="Add" id="\${ty_escapeAttr(ty_generateId('357d8d62', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="✎" label="Compose" id="\${ty_escapeAttr(ty_generateId('e9015766', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('14e7cac0', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6cc42329', 'id'))}">\`
elements+=\`Use Vuetify-style sizes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f3a72dd', 'id'))}">\`
elements+=\`x-small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca642d36', 'id'))}">\`
elements+=\`small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('68e8f6b9', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cb688652', 'id'))}">\`
elements+=\`large\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('81e56a38', 'id'))}">\`
elements+=\`x-large\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('94bc0eb9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('55bedd11', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--x-small" type="button" aria-label="XS" id="\${ty_escapeAttr(ty_generateId('ba1f0ce9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b1ce6e75', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--small" type="button" aria-label="SM" id="\${ty_escapeAttr(ty_generateId('36cea71d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('cf7e523e', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab" type="button" aria-label="MD" id="\${ty_escapeAttr(ty_generateId('f4ca0e75', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('861b8279', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--large" type="button" aria-label="LG" id="\${ty_escapeAttr(ty_generateId('189e1fac', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8bf79875', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--x-large" type="button" aria-label="XL" id="\${ty_escapeAttr(ty_generateId('2494d463', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('9c56e87d', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c79f4cbf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('50e842ab', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" size="x-small" id="\${ty_escapeAttr(ty_generateId('dd43a3bd', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" size="small" id="\${ty_escapeAttr(ty_generateId('237af446', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" id="\${ty_escapeAttr(ty_generateId('16e89877', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" size="large" id="\${ty_escapeAttr(ty_generateId('869b6d69', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" size="x-large" id="\${ty_escapeAttr(ty_generateId('939c5c5f', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2767de1e', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('79f087cf', 'id'))}">\`
elements+=\`Vuetify variant names: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa56fd59', 'id'))}">\`
elements+=\`elevated\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c9aa708b', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fcd01d24', 'id'))}">\`
elements+=\`tonal\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ebf3c96f', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e0b3ff5b', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f277de92', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0fee8d8c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('07be50e4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab" type="button" aria-label="Elevated" id="\${ty_escapeAttr(ty_generateId('89d5d779', 'id'))}">\`
elements+=\`E\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--variant-flat" type="button" aria-label="Flat" id="\${ty_escapeAttr(ty_generateId('5f89158d', 'id'))}">\`
elements+=\`F\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--variant-tonal" type="button" aria-label="Tonal" id="\${ty_escapeAttr(ty_generateId('90cac3a9', 'id'))}">\`
elements+=\`T\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--variant-outlined" type="button" aria-label="Outlined" id="\${ty_escapeAttr(ty_generateId('690b01b4', 'id'))}">\`
elements+=\`O\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--variant-text" type="button" aria-label="Text" id="\${ty_escapeAttr(ty_generateId('80e5dfba', 'id'))}">\`
elements+=\`X\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--variant-plain" type="button" aria-label="Plain" id="\${ty_escapeAttr(ty_generateId('a9ab4976', 'id'))}">\`
elements+=\`P\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fb80919c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('4b34ab80', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="elevated" id="\${ty_escapeAttr(ty_generateId('8873743b', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="flat" id="\${ty_escapeAttr(ty_generateId('32b0978c', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="tonal" id="\${ty_escapeAttr(ty_generateId('2d1d6fb1', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="outlined" id="\${ty_escapeAttr(ty_generateId('e22a7624', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="text" id="\${ty_escapeAttr(ty_generateId('c92d79e1', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" variant="plain" id="\${ty_escapeAttr(ty_generateId('03a8716b', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0fc79252', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('321e6e69', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('4df15d7b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--color-primary" type="button" aria-label="Primary" id="\${ty_escapeAttr(ty_generateId('0c591d8d', 'id'))}">\`
elements+=\`P\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--color-secondary" type="button" aria-label="Secondary" id="\${ty_escapeAttr(ty_generateId('8efc6ca3', 'id'))}">\`
elements+=\`S\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--color-success" type="button" aria-label="Success" id="\${ty_escapeAttr(ty_generateId('48edfe42', 'id'))}">\`
elements+=\`+\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--color-warning" type="button" aria-label="Warning" id="\${ty_escapeAttr(ty_generateId('78826ba6', 'id'))}">\`
elements+=\`!\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--color-error" type="button" aria-label="Error" id="\${ty_escapeAttr(ty_generateId('5d45d2c8', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1ab9a561', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1af7cdd5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" color="primary" id="\${ty_escapeAttr(ty_generateId('317cea8c', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" color="secondary" id="\${ty_escapeAttr(ty_generateId('6a101d8d', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" color="success" id="\${ty_escapeAttr(ty_generateId('28d83b72', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" color="warning" id="\${ty_escapeAttr(ty_generateId('dfb6f3de', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" color="error" id="\${ty_escapeAttr(ty_generateId('1bf944fa', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('42fe21fa', 'id'))}">\`
elements+=\`Positioning\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('43ed7794', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1f4de0b0', 'id'))}">\`
elements+=\`fixed\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d1338131', 'id'))}">\`
elements+=\`absolute\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d8cf4159', 'id'))}">\`
elements+=\`location\`
elements+=\`</code>\`
elements+=\` (or legacy \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d7fb421f', 'id'))}">\`
elements+=\`position\`
elements+=\`</code>\`
elements+=\`) to place the FAB in a corner.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4715c87e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div style="position:relative;height:8rem;background:var(--w-surface-container);border:1px solid var(--w-border);overflow:hidden;" id="\${ty_escapeAttr(ty_generateId('101fb3d6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--absolute w-fab--top w-fab--end" type="button" aria-label="Top end" id="\${ty_escapeAttr(ty_generateId('96331bc0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0e22a51e', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--absolute w-fab--bottom w-fab--start" type="button" aria-label="Bottom start" id="\${ty_escapeAttr(ty_generateId('4ab48483', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3c66d81f', 'id'))}">\`
elements+=\`✎\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('02db842c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div style="position:relative;height:8rem;background:var(--w-surface-container);border:1px solid var(--w-border);overflow:hidden;" id="\${ty_escapeAttr(ty_generateId('ba1b12d4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" absolute="" location="top end" id="\${ty_escapeAttr(ty_generateId('1135dc71', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="✎" absolute="" location="bottom start" id="\${ty_escapeAttr(ty_generateId('ca162854', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c26479d8', 'id'))}">\`
elements+=\`Rounded\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5de40235', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('0e7bb80b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--rounded-0" type="button" aria-label="Square" id="\${ty_escapeAttr(ty_generateId('85b35838', 'id'))}">\`
elements+=\`0\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--rounded-sm" type="button" aria-label="Small radius" id="\${ty_escapeAttr(ty_generateId('491b7475', 'id'))}">\`
elements+=\`SM\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--rounded" type="button" aria-label="Pill" id="\${ty_escapeAttr(ty_generateId('61ca4ed8', 'id'))}">\`
elements+=\`Pill\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bfea7381', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('f60652ae', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" rounded="0" id="\${ty_escapeAttr(ty_generateId('5da8b275', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" rounded="sm" id="\${ty_escapeAttr(ty_generateId('34f7c05f', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" rounded="" id="\${ty_escapeAttr(ty_generateId('2d88a5cb', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0e16b9b9', 'id'))}">\`
elements+=\`Active\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c6d8056a', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('41d04130', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` attribute toggles the selected state styling.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('dda23b08', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('ca05dfae', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-fab w-fab--active" type="button" aria-label="Active" id="\${ty_escapeAttr(ty_generateId('897c8181', 'id'))}">\`
elements+=\`A\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-fab" type="button" aria-label="Inactive" id="\${ty_escapeAttr(ty_generateId('c027c2ed', 'id'))}">\`
elements+=\`I\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0d59bc40', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('92f3e031', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" active="" id="\${ty_escapeAttr(ty_generateId('8d155d92', 'id'))}">\`
elements+=\`</w-fab>\`
elements+=\`
      \`
elements+=\`<w-fab icon="+" id="\${ty_escapeAttr(ty_generateId('7dc00654', 'id'))}">\`
elements+=\`</w-fab>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/floating-action-buttons/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
