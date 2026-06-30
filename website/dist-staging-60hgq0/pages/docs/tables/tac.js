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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('6fbfde70', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('039aced9', 'id'))}">\`
elements+=\`Structured data grids for compact comparison and scanning workflows. DuVay tables use the same row and column primitives as the layout grid.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d8ea29d0', 'id'))}">\`
elements+=\`Basic Table\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('934b1d25', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('5e3f36d8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('c2d059d0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('9942d3ef', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-auto" id="\${ty_escapeAttr(ty_generateId('a0668085', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--responsive-auto" id="\${ty_escapeAttr(ty_generateId('d9e87099', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('06a71546', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('de85ab1c', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('3bec02a1', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('2f339cd9', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('2c7b01c5', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('a19c3f0e', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('f4d3ba64', 'id'))}">\`
elements+=\`159\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('b5dfe107', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b2ac139a', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('384560c2', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('fe57a7d6', 'id'))}">\`
elements+=\`237\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('b68f4f93', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('50aeef9d', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('645a780d', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('06d7dbf7', 'id'))}">\`
elements+=\`262\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('c1cf8f1b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('01f8b4e0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('239b56f9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('14a30518', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('a6969b3b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" hover="" id="\${ty_escapeAttr(ty_generateId('0293ec7a', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('684fffb7', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('a1a71c03', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('a4f259d6', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('ca36d267', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('f792bdbc', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('679d29f7', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('bcfb99a2', 'id'))}">\`
elements+=\`159\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('9d1405cf', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('cde8496c', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('ee6b10d1', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('025595ef', 'id'))}">\`
elements+=\`237\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('1df45725', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('5f532a87', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('c5681fc2', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('eac0d935', 'id'))}">\`
elements+=\`262\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('27b9b888', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('eb17d5f0', 'id'))}">\`
elements+=\`Responsive Modes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c77345de', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03fa4f6a', 'id'))}">\`
elements+=\`responsive="auto"\`
elements+=\`</code>\`
elements+=\` uses container queries to preserve the table on wide surfaces and stack labeled cells on narrow ones. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d761395', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\` to force records or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a8404b8', 'id'))}">\`
elements+=\`scroll\`
elements+=\`</code>\`
elements+=\` when horizontal comparison is essential. CSS-class tables use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fccca69a', 'id'))}">\`
elements+=\`w-table-wrap--responsive-auto\`
elements+=\`</code>\`
elements+=\`, a matching grid modifier, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('35dc55c3', 'id'))}">\`
elements+=\`data-label\`
elements+=\`</code>\`
elements+=\` on each data cell.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d9465469', 'id'))}">\`
elements+=\`Data Table Subcomponents\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f7443b7b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef2cac6e', 'id'))}">\`
elements+=\`w-data-table-headers\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0345f6d', 'id'))}">\`
elements+=\`w-data-table-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ed10775', 'id'))}">\`
elements+=\`w-data-table-row\`
elements+=\`</code>\`
elements+=\` expose Vuetify-named table internals while still rendering with DuVay row and column primitives.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('57da35bc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('fe0a6f78', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('c8d5f8f3', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('7a9bb2b3', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('71878508', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('878f87e8', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('489b6ce0', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('4a8b4676', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('56957e2a', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7ba25772', 'id'))}">\`
elements+=\`Live\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('907092a0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b2684803', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('f0ddc3a0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('91737c10', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-data-table-headers headers="[Name,Status,Owner]" id="\${ty_escapeAttr(ty_generateId('ce5c8a6c', 'id'))}">\`
elements+=\`</w-data-table-headers>\`
elements+=\`
        \`
elements+=\`<w-data-table-rows headers="[Name,Status,Owner]" items="[Design system|Live|Avery; Billing flow|Review|Nora]" id="\${ty_escapeAttr(ty_generateId('8a7bc948', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('29a40fb2', 'id'))}">\`
elements+=\`Density and Stripes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('89bfe31c', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('58e6c9e0', 'id'))}">\`
elements+=\`w-data-table-footer\`
elements+=\`</code>\`
elements+=\` for a Vuetify-named footer subcomponent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('88791437', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('630bf41f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('cc70d168', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('dadcf9f8', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('730fc3fa', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense w-table-grid--striped" id="\${ty_escapeAttr(ty_generateId('8b0b2ca9', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('aaacc08b', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('3401fd9d', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('ed798893', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('00fe81eb', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('012b13ed', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('f6e04976', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b5732ee6', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-success" id="\${ty_escapeAttr(ty_generateId('e134da94', 'id'))}">\`
elements+=\`Live\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('58d9d8e8', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('d385d453', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('2acd059f', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b6ceea3f', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-warning" id="\${ty_escapeAttr(ty_generateId('50aeb558', 'id'))}">\`
elements+=\`Review\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('64abe75b', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('fa42ceb7', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('173f3a6d', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('107196ff', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-info" id="\${ty_escapeAttr(ty_generateId('3ad72bca', 'id'))}">\`
elements+=\`Draft\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('d99faccc', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('10791a32', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('94f4a917', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('5645272d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('5178dc3a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" striped="" hover="" id="\${ty_escapeAttr(ty_generateId('3b80aa76', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('a5b284c4', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('5f8d9892', 'id'))}">\`
elements+=\`Name\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('81c9f309', 'id'))}">\`
elements+=\`Status\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('bfb4fc73', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('0394d2a3', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('753ff1d5', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('6993c779', 'id'))}">\`
elements+=\`<w-badge inline="" content="Live" color="success" id="\${ty_escapeAttr(ty_generateId('cb6a364b', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('1330812c', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('89570166', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('3afca72d', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('3f0ed495', 'id'))}">\`
elements+=\`<w-badge inline="" content="Review" color="warning" id="\${ty_escapeAttr(ty_generateId('651d34a9', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('188fe00e', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('303a7106', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('a5aab84b', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('37847290', 'id'))}">\`
elements+=\`<w-badge inline="" content="Draft" color="info" id="\${ty_escapeAttr(ty_generateId('3b7bc1d1', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('d3cdbf9a', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('874b9470', 'id'))}">\`
elements+=\`Fixed Header\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('87a28345', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('3f0283b5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('92f5a428', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('0334b709', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--fixed-header" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('7004272a', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense" id="\${ty_escapeAttr(ty_generateId('4b439147', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('39126ff3', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('458878bc', 'id'))}">\`
elements+=\`Component\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('4029fbdf', 'id'))}">\`
elements+=\`Area\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('d8d50a38', 'id'))}">\`
elements+=\`State\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('37a2a01a', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('92e79aea', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a45925c0', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('c461e1e9', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('0494da4d', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('1e8b9c93', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f7aab9f8', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('2daee935', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b1e8cda0', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('9c9508f8', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('616d88a6', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('b28dc688', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('8fe86b93', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('4462353f', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('0494ec12', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('50531c84', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('d2b82c98', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('43fa1f7c', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('72d6c4bd', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('a97e7804', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('e8845de3', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('7d79ee36', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('9c5fe111', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('cf93c8ce', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8ed98e94', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('8b30b930', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('c7dbce4e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('d57446bd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" fixed-header="" height="180px" hover="" id="\${ty_escapeAttr(ty_generateId('e30dfaf5', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('df68d9b9', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('cd5d03cc', 'id'))}">\`
elements+=\`Component\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('c66b52c2', 'id'))}">\`
elements+=\`Area\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('119d1284', 'id'))}">\`
elements+=\`State\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('8738f995', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('e6c87907', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('fd851378', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('dff88aaf', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('a739bd81', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('570bb7f3', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('4e1eee7c', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('735b4e1f', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('c4ea8c17', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('30100f55', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('e7519532', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('bc430730', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('fbb3c90e', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('0d33410e', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('700e104c', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('d3f31f77', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('0c5d5d53', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('1c0240cd', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('8cfdc981', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5ae0104b', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('c9bc26a8', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('80fe9523', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('0e557f77', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('cff84633', 'id'))}">\`
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
