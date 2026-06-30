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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('d8804448', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('25685cff', 'id'))}">\`
elements+=\`Structured data grids for compact comparison and scanning workflows. DuVay tables use the same row and column primitives as the layout grid.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('af2e8b3f', 'id'))}">\`
elements+=\`Basic Table\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ea0b6d86', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('a23819d8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b022767f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('12146c1c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-auto" id="\${ty_escapeAttr(ty_generateId('61334a41', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--responsive-auto" id="\${ty_escapeAttr(ty_generateId('cf1d669e', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('356a9d2c', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('22ba662c', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('43627a5e', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('d92e8453', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a04c6f2e', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('61da6dde', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('5167c018', 'id'))}">\`
elements+=\`159\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('1716c353', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b5c8accc', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('62f7ef9d', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('d18934a8', 'id'))}">\`
elements+=\`237\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('e82965e5', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('eeb28c10', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('e79e4ad7', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('f4ae6090', 'id'))}">\`
elements+=\`262\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('bd3c8cbc', 'id'))}">\`
elements+=\`16 g\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5f3f6be7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('a3e269ff', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('8cb026fb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('cd28d513', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" hover="" id="\${ty_escapeAttr(ty_generateId('b5af308d', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('9e8d91d2', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('c09d34ec', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('3548b033', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('316a81a2', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('0451e7e6', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('d3905f5d', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('6de5bec4', 'id'))}">\`
elements+=\`159\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('3722992a', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('fe79318b', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('1e8a1460', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('471ac108', 'id'))}">\`
elements+=\`237\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('0cf31ca9', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('917651f3', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('bec770e2', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5d67bab0', 'id'))}">\`
elements+=\`262\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('359cbcb7', 'id'))}">\`
elements+=\`16 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('07a8d03c', 'id'))}">\`
elements+=\`Responsive Modes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6febcc9c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c141943f', 'id'))}">\`
elements+=\`responsive="auto"\`
elements+=\`</code>\`
elements+=\` uses container queries to preserve the table on wide surfaces and stack labeled cells on narrow ones. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('171b3cc7', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\` to force records or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2de5cb4c', 'id'))}">\`
elements+=\`scroll\`
elements+=\`</code>\`
elements+=\` when horizontal comparison is essential. CSS-class tables use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7d47095d', 'id'))}">\`
elements+=\`w-table-wrap--responsive-auto\`
elements+=\`</code>\`
elements+=\`, a matching grid modifier, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fdca1d0', 'id'))}">\`
elements+=\`data-label\`
elements+=\`</code>\`
elements+=\` on each data cell.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a4bcab17', 'id'))}">\`
elements+=\`Gridlines\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d6a3b98c', 'id'))}">\`
elements+=\`Native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('deda832b', 'id'))}">\`
elements+=\`&lt;table&gt;\`
elements+=\`</code>\`
elements+=\` children accept \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a06cf0c6', 'id'))}">\`
elements+=\`gridlines="horizontal"\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('44f4fb58', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c4f45d48', 'id'))}">\`
elements+=\`all\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('017b6d38', 'id'))}">\`
elements+=\`none\`
elements+=\`</code>\`
elements+=\` — matching Vuetify's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0fd84ae', 'id'))}">\`
elements+=\`v-table\`
elements+=\`</code>\`
elements+=\`. CSS-class tables add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c299024', 'id'))}">\`
elements+=\`w-table--gridlines-*\`
elements+=\`</code>\`
elements+=\` to the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4f0649c', 'id'))}">\`
elements+=\`&lt;table&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('53f8c410', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-scroll" id="\${ty_escapeAttr(ty_generateId('cdc04bc3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table w-table--gridlines-all" id="\${ty_escapeAttr(ty_generateId('bd86245e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('c2102735', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0c2c6bd7', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('24ca1701', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('ef4488c1', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fdfd40b4', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('c30309bc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d692a2de', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('184126d0', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6b146bb2', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('82d6e485', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('40004b2d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4ff04ef4', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('86bef924', 'id'))}">\`
elements+=\`237\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7fd22870', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('60936422', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('692a80c1', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd41d832', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e81cd28', 'id'))}">\`
elements+=\`16 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2c9ab787', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-table gridlines="all" responsive="scroll" id="\${ty_escapeAttr(ty_generateId('666c0633', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table id="\${ty_escapeAttr(ty_generateId('13c51951', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('66bf2af4', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('025e7f0b', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('2312c789', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('27a25ac2', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7a53f5e8', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('b3c359a4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2d1646b8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f94ae48', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d0c06bf7', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9055f46f', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d6fea4b5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40d4a2c6', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e7e010d', 'id'))}">\`
elements+=\`237\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7addc8e6', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('4bd7cbef', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('62d7e600', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('78b5062a', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5b20f2ff', 'id'))}">\`
elements+=\`16 g\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</w-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('91012a08', 'id'))}">\`
elements+=\`Striped Rows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('07830f61', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a5ee5d37', 'id'))}">\`
elements+=\`striped="odd"\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed93ce99', 'id'))}">\`
elements+=\`striped="even"\`
elements+=\`</code>\`
elements+=\` (a bare \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('203a1021', 'id'))}">\`
elements+=\`striped\`
elements+=\`</code>\`
elements+=\` attribute defaults to even).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('81c1cb82', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-scroll" id="\${ty_escapeAttr(ty_generateId('48a84f03', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table w-table--striped-odd" id="\${ty_escapeAttr(ty_generateId('7d80ac42', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('84b50904', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('37327de7', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('99ce1107', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('10c915dd', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('9034a095', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fe3a48e5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d6f4dd8', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('afc56c6b', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('977fb311', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e088549c', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6c89ecd2', 'id'))}">\`
elements+=\`237\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bdf4e3bf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c3642f4e', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e0c6b26', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1adb801c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed85ae25', 'id'))}">\`
elements+=\`Cupcake\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eb27b179', 'id'))}">\`
elements+=\`305\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('21c7c83b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-table striped="odd" responsive="scroll" id="\${ty_escapeAttr(ty_generateId('02c2787e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table id="\${ty_escapeAttr(ty_generateId('57a8be08', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('6ce3d56c', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('844c9bcf', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7e9d482a', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('bebd4198', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('fc59771b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('af5d27b9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9aefa6f0', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('59294c6e', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c245aeb3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ae4015c', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2c51ebee', 'id'))}">\`
elements+=\`237\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ce5fbe25', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bbda16c1', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cdcaa069', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('894c0ec3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4d211fc2', 'id'))}">\`
elements+=\`Cupcake\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5ae4d2c0', 'id'))}">\`
elements+=\`305\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</w-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c3b2d53b', 'id'))}">\`
elements+=\`Top and Bottom Slots\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('86ddfa39', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d22aa2b', 'id'))}">\`
elements+=\`top\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4f130df', 'id'))}">\`
elements+=\`bottom\`
elements+=\`</code>\`
elements+=\` slots render toolbars, filters, or footers attached to the table — DuVay's equivalent of Vuetify's \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7d1498ca', 'id'))}">\`
elements+=\`top\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e78c988', 'id'))}">\`
elements+=\`bottom\`
elements+=\`</code>\`
elements+=\` slots.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0edb74b9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-top" id="\${ty_escapeAttr(ty_generateId('2eab2553', 'id'))}">\`
elements+=\`Nutrition\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-scroll" id="\${ty_escapeAttr(ty_generateId('7ff54102', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('c8b7ff37', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2db98a62', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('260763a7', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('0ec62f75', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('bbaee024', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('6542d245', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b91603d2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d323900', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42f7f18b', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dd5a5a65', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('76f92c8d', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a33269dd', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-table-bottom" id="\${ty_escapeAttr(ty_generateId('a2d3ed98', 'id'))}">\`
elements+=\`2 desserts\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ab3d5a75', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-table responsive="scroll" id="\${ty_escapeAttr(ty_generateId('58117549', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div slot="top" id="\${ty_escapeAttr(ty_generateId('c4ccb69c', 'id'))}">\`
elements+=\`Nutrition\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<table id="\${ty_escapeAttr(ty_generateId('08331036', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('7020acd9', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a8abd52e', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3d91cea8', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('270d4c89', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('ab144a7e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a93e4973', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ce410eee', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e7e71330', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('eb5efd4a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('982c9eda', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6729fe54', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
      \`
elements+=\`<div slot="bottom" id="\${ty_escapeAttr(ty_generateId('9cc787d7', 'id'))}">\`
elements+=\`2 desserts\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5b727e1e', 'id'))}">\`
elements+=\`Fixed Footer\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('120b981d', 'id'))}">\`
elements+=\`Pair \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a73e2956', 'id'))}">\`
elements+=\`fixed-footer\`
elements+=\`</code>\`
elements+=\` with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('48bf7feb', 'id'))}">\`
elements+=\`height\`
elements+=\`</code>\`
elements+=\` to keep a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f9d2c453', 'id'))}">\`
elements+=\`&lt;tfoot&gt;\`
elements+=\`</code>\`
elements+=\` pinned while the body scrolls. Combine with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b24f1778', 'id'))}">\`
elements+=\`fixed-header\`
elements+=\`</code>\`
elements+=\` for both ends.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c3e94b73', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap w-table-wrap--fixed-header w-table-wrap--fixed-footer" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('fbe2647e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('71d54126', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('bd70340b', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('cb617ecc', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('eb44b58b', 'id'))}">\`
elements+=\`Component\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b6951680', 'id'))}">\`
elements+=\`Area\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('c21c272c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('de4ea821', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f57e973', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e91543da', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e1c14fe8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0cc12a4d', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7fca876e', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a3cc0ef4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1763b99b', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da794b2a', 'id'))}">\`
elements+=\`Content\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('970dea8d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5b0d4802', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5cf1bf72', 'id'))}">\`
elements+=\`Content\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('18923fdf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dba8376f', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f8c26468', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('8220218b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('adc65507', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('001f3fad', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
        \`
elements+=\`<tfoot id="\${ty_escapeAttr(ty_generateId('183d39c6', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dc81e778', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dd6d242e', 'id'))}">\`
elements+=\`6 components\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c7e9450', 'id'))}">\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tfoot>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('50fde287', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-table fixed-header="" fixed-footer="" height="180px" id="\${ty_escapeAttr(ty_generateId('73d51af5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table id="\${ty_escapeAttr(ty_generateId('cf5421d0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('51b14409', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('61d7d6ad', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6e04e598', 'id'))}">\`
elements+=\`Component\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fbbfa202', 'id'))}">\`
elements+=\`Area\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('adc1328b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0ee2ee1b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f064bbb2', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f1d6319a', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('438be2ad', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1b0ebe7d', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('231ebadb', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('db64686d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e5e19a4a', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d07c2afb', 'id'))}">\`
elements+=\`Content\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('838781ad', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6997a90b', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('572d53e7', 'id'))}">\`
elements+=\`Content\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('340b737a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3115d9b9', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3fef95ab', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('599dce73', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6cfa3c85', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9fa4079c', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
        \`
elements+=\`<tfoot id="\${ty_escapeAttr(ty_generateId('84a0edd8', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('77d49271', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('63493e80', 'id'))}">\`
elements+=\`6 components\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e01f2b2', 'id'))}">\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tfoot>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</w-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6ca95c5c', 'id'))}">\`
elements+=\`Data Table Subcomponents\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5a13a73e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ea024f4', 'id'))}">\`
elements+=\`w-data-table-headers\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de12b617', 'id'))}">\`
elements+=\`w-data-table-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbdf9e8c', 'id'))}">\`
elements+=\`w-data-table-row\`
elements+=\`</code>\`
elements+=\` expose Vuetify-named table internals while still rendering with DuVay row and column primitives.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('57a3ba76', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('366ed852', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('fc431fbb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('41a84fe5', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('868910ed', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('ce5cafed', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('62f360ff', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('08ab2ecb', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8b592335', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('e84115d1', 'id'))}">\`
elements+=\`Live\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8d34820e', 'id'))}">\`
elements+=\`Avery\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f06d3acc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('c9242e9e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('62579c0b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-data-table-headers headers="[Name,Status,Owner]" id="\${ty_escapeAttr(ty_generateId('029684dd', 'id'))}">\`
elements+=\`</w-data-table-headers>\`
elements+=\`
        \`
elements+=\`<w-data-table-rows headers="[Name,Status,Owner]" items="[Design system|Live|Avery; Billing flow|Review|Nora]" id="\${ty_escapeAttr(ty_generateId('23779114', 'id'))}">\`
elements+=\`</w-data-table-rows>\`
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
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f5a394f1', 'id'))}">\`
elements+=\`Density and Stripes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4713777a', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7529f9c', 'id'))}">\`
elements+=\`w-data-table-footer\`
elements+=\`</code>\`
elements+=\` for a Vuetify-named footer subcomponent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9639ce34', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('be4a187b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('c390b23a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('eb131a42', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('14d2ef97', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense w-table-grid--striped" id="\${ty_escapeAttr(ty_generateId('0a9ec313', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('08d5091e', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('36fc0d49', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5d9c2295', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('8e4fd325', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('25f2ecba', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('43e3e1d2', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('c0ac2d0d', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-success" id="\${ty_escapeAttr(ty_generateId('a4a1771d', 'id'))}">\`
elements+=\`Live\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('321bc735', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('3dd7abcd', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('906851a8', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('0aedcdfb', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-warning" id="\${ty_escapeAttr(ty_generateId('f0706b45', 'id'))}">\`
elements+=\`Review\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('431f6601', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('6de9c40b', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('feafc450', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('2ddd22a7', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-info" id="\${ty_escapeAttr(ty_generateId('c5badb21', 'id'))}">\`
elements+=\`Draft\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('80360544', 'id'))}">\`
elements+=\`Mika\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6925bcd2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('dac30799', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('fa25eca6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('f1405583', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" striped="" hover="" id="\${ty_escapeAttr(ty_generateId('861ac72a', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('74694893', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('b8a8e8f0', 'id'))}">\`
elements+=\`Name\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('30d9dd60', 'id'))}">\`
elements+=\`Status\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('2c8d0ee7', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('8aabe154', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('80f3e20a', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('a33722e4', 'id'))}">\`
elements+=\`<w-badge inline="" content="Live" color="success" id="\${ty_escapeAttr(ty_generateId('89947356', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('48e23f6b', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('cef0183a', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('dbceb2a8', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('4f7360ed', 'id'))}">\`
elements+=\`<w-badge inline="" content="Review" color="warning" id="\${ty_escapeAttr(ty_generateId('2bdff245', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('be674c2e', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('31878c5f', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('c807169f', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('d9cca186', 'id'))}">\`
elements+=\`<w-badge inline="" content="Draft" color="info" id="\${ty_escapeAttr(ty_generateId('9af1e412', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5d6fcee7', 'id'))}">\`
elements+=\`Mika\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0ce5f0f6', 'id'))}">\`
elements+=\`Fixed Header\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bb427fb3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('5869658b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('d7560f80', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('59860d97', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--fixed-header" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('38f6aecf', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense" id="\${ty_escapeAttr(ty_generateId('e07c850e', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('8819e86f', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('b17ce140', 'id'))}">\`
elements+=\`Component\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8e413e84', 'id'))}">\`
elements+=\`Area\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('920180d3', 'id'))}">\`
elements+=\`State\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b5e6b01c', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('018aaa03', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('d7098e0d', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('faf52116', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('361a0dc0', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('db6783a2', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b911a050', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('a0e73fb8', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('310d30af', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('9ce1b112', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f28857bb', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('82dd47f7', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('2f3153c4', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('93307fbb', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('72d427ab', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('8ff3e0df', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('779e9000', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('37a38b28', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8cd99c5d', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4a4508e4', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('c44dadea', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('0fcc5dc9', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('4f2110dd', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('e4129406', 'id'))}">\`
elements+=\`Stable\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ac885392', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('17d2b7e1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('cf2de737', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('dea31b4e', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" fixed-header="" height="180px" hover="" id="\${ty_escapeAttr(ty_generateId('05c1beee', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('93627d99', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('23a1d737', 'id'))}">\`
elements+=\`Component\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('55fb3ca4', 'id'))}">\`
elements+=\`Area\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('deeed3a9', 'id'))}">\`
elements+=\`State\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('7693787e', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('31aa2a6f', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('6d5fc384', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('9c842440', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('e8198b37', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('0dcb909f', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('9595a472', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5f1d9264', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('a8f0616b', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('791bc973', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('edcec373', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('233bc695', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('9e662314', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('c65ba3c3', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('f56520ae', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('09dc7b21', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('cc1f26db', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('767cdd52', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('7fa7463d', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('6d685be4', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('f93a9e11', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('c42d40ab', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('ed115fa4', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('835948ac', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
          \`
elements+=\`</w-table>\`
elements+=\`
        \`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tables/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
