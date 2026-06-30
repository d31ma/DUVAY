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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('2061ea62', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('67e38efc', 'id'))}">\`
elements+=\`Structured data grids for compact comparison and scanning workflows. DuVay tables use the same row and column primitives as the layout grid.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9c5076fe', 'id'))}">\`
elements+=\`Basic Table\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('60204bbe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('764761eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('f856b6f7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('1f0d9d49', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--responsive-auto" id="\${ty_escapeAttr(ty_generateId('ba2c1a83', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--responsive-auto" id="\${ty_escapeAttr(ty_generateId('5443e092', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('704d4df2', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('cf8ba5fc', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('f7a6d22d', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('3f44bd8b', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a7d3b680', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('664edb19', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('b0bb5aa4', 'id'))}">\`
elements+=\`159\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('51f3847b', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('f89eaa56', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('55a9f24f', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('dd66f614', 'id'))}">\`
elements+=\`237\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('983ae17d', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('54eea69b', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-6" data-label="Dessert" id="\${ty_escapeAttr(ty_generateId('a7bc55e1', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Calories" id="\${ty_escapeAttr(ty_generateId('a4b6b40a', 'id'))}">\`
elements+=\`262\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" data-label="Fat" id="\${ty_escapeAttr(ty_generateId('cab3576c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('58c79983', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('79bd728d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('bc27842c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('5fd22a2c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" hover="" id="\${ty_escapeAttr(ty_generateId('81196ec6', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('ecc1c748', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('a23f3bf9', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('2a0d3a33', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('3bc6f91b', 'id'))}">\`
elements+=\`Fat\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('42129f03', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('1a1bfd86', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('e9def11c', 'id'))}">\`
elements+=\`159\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('66f4ba72', 'id'))}">\`
elements+=\`6 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('03aba0d0', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('04450872', 'id'))}">\`
elements+=\`Ice cream sandwich\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('933ac73b', 'id'))}">\`
elements+=\`237\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5398b1a2', 'id'))}">\`
elements+=\`9 g\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('134c0e38', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('9214e4ab', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('f7064627', 'id'))}">\`
elements+=\`262\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('6a5d3278', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('247c9c2d', 'id'))}">\`
elements+=\`Responsive Modes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('60eefce8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ea09db9', 'id'))}">\`
elements+=\`responsive="auto"\`
elements+=\`</code>\`
elements+=\` uses container queries to preserve the table on wide surfaces and stack labeled cells on narrow ones. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d05ebfb5', 'id'))}">\`
elements+=\`stack\`
elements+=\`</code>\`
elements+=\` to force records or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3ed3f65', 'id'))}">\`
elements+=\`scroll\`
elements+=\`</code>\`
elements+=\` when horizontal comparison is essential. CSS-class tables use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('66d50e97', 'id'))}">\`
elements+=\`w-table-wrap--responsive-auto\`
elements+=\`</code>\`
elements+=\`, a matching grid modifier, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('85f8ca0b', 'id'))}">\`
elements+=\`data-label\`
elements+=\`</code>\`
elements+=\` on each data cell.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ad71817f', 'id'))}">\`
elements+=\`Data Table Subcomponents\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c9aa4103', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b5909a07', 'id'))}">\`
elements+=\`w-data-table-headers\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de861e45', 'id'))}">\`
elements+=\`w-data-table-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('074a2e66', 'id'))}">\`
elements+=\`w-data-table-row\`
elements+=\`</code>\`
elements+=\` expose Vuetify-named table internals while still rendering with DuVay row and column primitives.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0d706861', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('75236516', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('02b2efa6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('23ab010f', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7b488a3b', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('504a5413', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('52a83a93', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('cfccd35d', 'id'))}">\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5eabf051', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b6ea88b8', 'id'))}">\`
elements+=\`Live\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('897d8802', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('13c1a103', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('d99427fe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-table-grid" id="\${ty_escapeAttr(ty_generateId('7477d223', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-data-table-headers headers="[Name,Status,Owner]" id="\${ty_escapeAttr(ty_generateId('dcc37c9c', 'id'))}">\`
elements+=\`</w-data-table-headers>\`
elements+=\`
        \`
elements+=\`<w-data-table-rows headers="[Name,Status,Owner]" items="[Design system|Live|Avery; Billing flow|Review|Nora]" id="\${ty_escapeAttr(ty_generateId('08ebd331', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('dc864cb6', 'id'))}">\`
elements+=\`Density and Stripes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3e7c4168', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9684bda9', 'id'))}">\`
elements+=\`w-data-table-footer\`
elements+=\`</code>\`
elements+=\` for a Vuetify-named footer subcomponent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('13a25a34', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('774c7735', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b077ce6c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('0f3fba6f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('632104d7', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense w-table-grid--striped" id="\${ty_escapeAttr(ty_generateId('a35812c4', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('352d4702', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('05af9712', 'id'))}">\`
elements+=\`Name\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f2f52d0c', 'id'))}">\`
elements+=\`Status\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4c1a5ddc', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('fbb09c49', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('f2dff3ff', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8d616221', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-success" id="\${ty_escapeAttr(ty_generateId('2dc402d9', 'id'))}">\`
elements+=\`Live\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('462165cf', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('ae8a76ab', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('af3befea', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f7ca2087', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-warning" id="\${ty_escapeAttr(ty_generateId('bfd28ed0', 'id'))}">\`
elements+=\`Review\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('d2effba8', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('f54cce52', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('a8cadce8', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('5689c945', 'id'))}">\`
elements+=\`<span class="w-badge w-badge-info" id="\${ty_escapeAttr(ty_generateId('71192afe', 'id'))}">\`
elements+=\`Draft\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('cd1deb85', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f892aef4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('4f68379d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('bc16c3ab', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('8a0cb96b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" striped="" hover="" id="\${ty_escapeAttr(ty_generateId('dc55b88c', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('e5c43c5a', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('454ee8f8', 'id'))}">\`
elements+=\`Name\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('b820019b', 'id'))}">\`
elements+=\`Status\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('12e8de80', 'id'))}">\`
elements+=\`Owner\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('167e9f97', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('26de0df5', 'id'))}">\`
elements+=\`Design system\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('e773f7a7', 'id'))}">\`
elements+=\`<w-badge inline="" content="Live" color="success" id="\${ty_escapeAttr(ty_generateId('9b289645', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('ec105ef3', 'id'))}">\`
elements+=\`Avery\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('534ed80f', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('da9b8cd8', 'id'))}">\`
elements+=\`Billing flow\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('ede69d89', 'id'))}">\`
elements+=\`<w-badge inline="" content="Review" color="warning" id="\${ty_escapeAttr(ty_generateId('c76e9f3b', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('9f2e662c', 'id'))}">\`
elements+=\`Nora\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('259d8f41', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('4921ccae', 'id'))}">\`
elements+=\`Mobile shell\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('0e007ee3', 'id'))}">\`
elements+=\`<w-badge inline="" content="Draft" color="info" id="\${ty_escapeAttr(ty_generateId('ef0f0f7d', 'id'))}">\`
elements+=\`</w-badge>\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('98d62eed', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9b8beafb', 'id'))}">\`
elements+=\`Fixed Header\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('41a28452', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-container w-container--fluid" id="\${ty_escapeAttr(ty_generateId('1125f66c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('70742805', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-grid-col-12" id="\${ty_escapeAttr(ty_generateId('714cb8a5', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-table-wrap w-table-wrap--fixed-header" style="max-height:180px" id="\${ty_escapeAttr(ty_generateId('f2ea32aa', 'id'))}">\`
elements+=\`
            \`
elements+=\`<div class="w-table-grid w-table-grid--dense" id="\${ty_escapeAttr(ty_generateId('6b22ad89', 'id'))}">\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row w-table-header" id="\${ty_escapeAttr(ty_generateId('f2f88fa3', 'id'))}">\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('e127f51f', 'id'))}">\`
elements+=\`Component\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('a24398c6', 'id'))}">\`
elements+=\`Area\`
elements+=\`</div>\`
elements+=\`
                \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('723b8056', 'id'))}">\`
elements+=\`State\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('2b349a58', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('50f5bb96', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('cbe0ddbc', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('19d0d124', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a687cf44', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('a5307506', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('815b5f93', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('46431ca5', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('0c540447', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('b8679c41', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7fe8d139', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4feb1181', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('bcdaa377', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('cdf80cdf', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('dbd25ec6', 'id'))}">\`
elements+=\`Content\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('1d16fd20', 'id'))}">\`
elements+=\`New\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('704cc0e5', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('96cf2fad', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('7d8d5b42', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('48740e98', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
              \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('d94cec47', 'id'))}">\`
elements+=\`<div class="w-grid-col-5" id="\${ty_escapeAttr(ty_generateId('b8fcbca9', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('1e83cb28', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</div>\`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('69d3e238', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e478ba19', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('da432a61', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('e35b4919', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" id="\${ty_escapeAttr(ty_generateId('4fc56400', 'id'))}">\`
elements+=\`
          \`
elements+=\`<w-table grid="" density="compact" fixed-header="" height="180px" hover="" id="\${ty_escapeAttr(ty_generateId('2ac6f2c8', 'id'))}">\`
elements+=\`
            \`
elements+=\`<w-row header="" gutter="0" id="\${ty_escapeAttr(ty_generateId('63fbe060', 'id'))}">\`
elements+=\`
              \`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('4ae20f02', 'id'))}">\`
elements+=\`Component\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('cd6386a7', 'id'))}">\`
elements+=\`Area\`
elements+=\`</w-col>\`
elements+=\`
              \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('2008d782', 'id'))}">\`
elements+=\`State\`
elements+=\`</w-col>\`
elements+=\`
            \`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('16b3f784', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('c9498883', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('7e420b78', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('e68dab9a', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('b38f4857', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('5a91f3ee', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('531e78fe', 'id'))}">\`
elements+=\`Forms\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('547c13a8', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('51522272', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('1cd750b0', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('f526d252', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('2bfad4d4', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('e3bdefa7', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('7c2edbea', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('a60c2b0c', 'id'))}">\`
elements+=\`Content\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('1058a6b1', 'id'))}">\`
elements+=\`New\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('7b11adfe', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('8771bb95', 'id'))}">\`
elements+=\`Dialogs\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('11eb9642', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('3bd455e6', 'id'))}">\`
elements+=\`Stable\`
elements+=\`</w-col>\`
elements+=\`</w-row>\`
elements+=\`
            \`
elements+=\`<w-row gutter="0" id="\${ty_escapeAttr(ty_generateId('211499ee', 'id'))}">\`
elements+=\`<w-col cols="5" id="\${ty_escapeAttr(ty_generateId('c8cccd39', 'id'))}">\`
elements+=\`Snackbars\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('5a5670a2', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</w-col>\`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('9a42b5ea', 'id'))}">\`
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
