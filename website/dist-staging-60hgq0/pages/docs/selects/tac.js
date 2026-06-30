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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('ae7b21bb', 'id'))}">\`
elements+=\`Selects\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('57529f58', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a3a7c65', 'id'))}">\`
elements+=\`w-select\`
elements+=\`</code>\`
elements+=\` is a custom dropdown that opens an overlay listbox of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b8a20e2', 'id'))}">\`
elements+=\`w-option\`
elements+=\`</code>\`
elements+=\` children, mirroring Vuetify&#8217;s \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3dcb4388', 'id'))}">\`
elements+=\`v-select\`
elements+=\`</code>\`
elements+=\`. It supports single and multiple selection (shown as chips), a clear button, and keyboard navigation. For a plain, zero-JS native control, use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0248bccb', 'id'))}">\`
elements+=\`w-native-select\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0fe73237', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2659999b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-field" style="max-width:320px" id="\${ty_escapeAttr(ty_generateId('f1c4cb6f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-field-label" id="\${ty_escapeAttr(ty_generateId('8e2cb724', 'id'))}">\`
elements+=\`Plan\`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<div class="w-select-wrap" id="\${ty_escapeAttr(ty_generateId('4c37c6c4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-select w-select-field" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('e58498c4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-select-selection" id="\${ty_escapeAttr(ty_generateId('09277aee', 'id'))}">\`
elements+=\`<span class="w-select-value" id="\${ty_escapeAttr(ty_generateId('8b2e3c87', 'id'))}">\`
elements+=\`Pro\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-select-chevron" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('ba77fa6b', 'id'))}">\`
elements+=\`
            \`
elements+=\`<svg viewbox="0 0 24 24" width="20" height="20" id="\${ty_escapeAttr(ty_generateId('7f9156fa', 'id'))}">\`
elements+=\`<path fill="currentColor" d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" id="\${ty_escapeAttr(ty_generateId('48bf82ee', 'id'))}" />\`
elements+=\`</svg>\`
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
elements+=\`<span class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('c2692698', 'id'))}">\`
elements+=\`Click to open the option list.\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3a4aba50', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-select label="Plan" value="pro" hint="Click to open the option list." id="\${ty_escapeAttr(ty_generateId('bffc56b2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-option value="starter" id="\${ty_escapeAttr(ty_generateId('ab0367b6', 'id'))}">\`
elements+=\`Starter\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="pro" id="\${ty_escapeAttr(ty_generateId('f6f4d8ea', 'id'))}">\`
elements+=\`Pro\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="enterprise" id="\${ty_escapeAttr(ty_generateId('bf738242', 'id'))}">\`
elements+=\`Enterprise\`
elements+=\`</w-option>\`
elements+=\`
    \`
elements+=\`</w-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b686d3f8', 'id'))}">\`
elements+=\`Multiple with chips\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d8512b7c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea4b8fe0', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to select several values; they render as chips in the field. Combine with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f0688ece', 'id'))}">\`
elements+=\`closable-chips\`
elements+=\`</code>\`
elements+=\` to remove them inline.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f1cabc03', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-select label="Regions" multiple="" closable-chips="" value="us,eu" id="\${ty_escapeAttr(ty_generateId('ced31fe9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-option value="us" id="\${ty_escapeAttr(ty_generateId('f8c2bbf8', 'id'))}">\`
elements+=\`United States\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="eu" id="\${ty_escapeAttr(ty_generateId('54f29c60', 'id'))}">\`
elements+=\`Europe\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="apac" id="\${ty_escapeAttr(ty_generateId('97d8ad85', 'id'))}">\`
elements+=\`Asia Pacific\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="latam" id="\${ty_escapeAttr(ty_generateId('3ca62a71', 'id'))}">\`
elements+=\`Latin America\`
elements+=\`</w-option>\`
elements+=\`
    \`
elements+=\`</w-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0d57aa45', 'id'))}">\`
elements+=\`Clearable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('41a21954', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2388be48', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\` for a clear (&#215;) button that resets the selection.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9b7da3cf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-select label="Priority" clearable="" value="high" placeholder="Select a priority" id="\${ty_escapeAttr(ty_generateId('ba872864', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-option value="low" id="\${ty_escapeAttr(ty_generateId('f96e9b00', 'id'))}">\`
elements+=\`Low\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="medium" id="\${ty_escapeAttr(ty_generateId('142bfde1', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="high" id="\${ty_escapeAttr(ty_generateId('fd21c63b', 'id'))}">\`
elements+=\`High\`
elements+=\`</w-option>\`
elements+=\`
    \`
elements+=\`</w-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('185d564b', 'id'))}">\`
elements+=\`Placeholder\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fded0544', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-select label="Country" placeholder="Choose a country" id="\${ty_escapeAttr(ty_generateId('23ba138e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-option value="ca" id="\${ty_escapeAttr(ty_generateId('78e30f59', 'id'))}">\`
elements+=\`Canada\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="mx" id="\${ty_escapeAttr(ty_generateId('6eba056b', 'id'))}">\`
elements+=\`Mexico\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="us" id="\${ty_escapeAttr(ty_generateId('62f030b2', 'id'))}">\`
elements+=\`United States\`
elements+=\`</w-option>\`
elements+=\`
    \`
elements+=\`</w-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c960646b', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e27bc3be', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-select label="Plan" value="pro" disabled="" id="\${ty_escapeAttr(ty_generateId('5f5cea73', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-option value="starter" id="\${ty_escapeAttr(ty_generateId('7ccbe6e6', 'id'))}">\`
elements+=\`Starter\`
elements+=\`</w-option>\`
elements+=\`
      \`
elements+=\`<w-option value="pro" id="\${ty_escapeAttr(ty_generateId('1b7eb68c', 'id'))}">\`
elements+=\`Pro\`
elements+=\`</w-option>\`
elements+=\`
    \`
elements+=\`</w-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('db2de96c', 'id'))}">\`
elements+=\`Native select\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('47255c08', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('36ae0f37', 'id'))}">\`
elements+=\`w-native-select\`
elements+=\`</code>\`
elements+=\` renders a real \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('44806b10', 'id'))}">\`
elements+=\`&lt;select&gt;\`
elements+=\`</code>\`
elements+=\` with plain \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe07e260', 'id'))}">\`
elements+=\`&lt;option&gt;\`
elements+=\`</code>\`
elements+=\` children — accessible and zero-JavaScript.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('476a90c4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-field" id="\${ty_escapeAttr(ty_generateId('417a02b4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-field-label" id="\${ty_escapeAttr(ty_generateId('2d63b46b', 'id'))}">\`
elements+=\`Density\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<select class="w-select" id="\${ty_escapeAttr(ty_generateId('eb53d92c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<option id="\${ty_escapeAttr(ty_generateId('3e78a7d9', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</option>\`
elements+=\`
        \`
elements+=\`<option selected="" id="\${ty_escapeAttr(ty_generateId('ad738459', 'id'))}">\`
elements+=\`Comfortable\`
elements+=\`</option>\`
elements+=\`
        \`
elements+=\`<option id="\${ty_escapeAttr(ty_generateId('8e5cf43a', 'id'))}">\`
elements+=\`Spacious\`
elements+=\`</option>\`
elements+=\`
      \`
elements+=\`</select>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('00876e34', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-native-select label="Density" value="comfortable" id="\${ty_escapeAttr(ty_generateId('93445071', 'id'))}">\`
elements+=\`
      \`
elements+=\`<option value="compact" id="\${ty_escapeAttr(ty_generateId('5ff27b15', 'id'))}">\`
elements+=\`Compact\`
elements+=\`</option>\`
elements+=\`
      \`
elements+=\`<option value="comfortable" id="\${ty_escapeAttr(ty_generateId('6a41f80e', 'id'))}">\`
elements+=\`Comfortable\`
elements+=\`</option>\`
elements+=\`
      \`
elements+=\`<option value="spacious" id="\${ty_escapeAttr(ty_generateId('7f175aba', 'id'))}">\`
elements+=\`Spacious\`
elements+=\`</option>\`
elements+=\`
    \`
elements+=\`</w-native-select>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('47e74876', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('e4781879', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('9dc59269', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('08151aa0', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8a4c8a77', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a225b789', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3fb1df0d', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d8940c52', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('19b34a14', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7313c122', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8d125db8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ee1e2e61', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc0c513a', 'id'))}">\`
elements+=\`model-value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2dbbff2d', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('14b3a562', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7e39f9f1', 'id'))}">\`
elements+=\`Selected value (comma-joined when \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('336a2b78', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('842b6016', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('440bf985', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38b83249', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('587a0197', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('46c45901', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d15c49b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8a2a9e78', 'id'))}">\`
elements+=\`Allow multiple selections, shown as chips.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b6e831c3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29e6c51b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88578ddb', 'id'))}">\`
elements+=\`chips\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8b2edb0c', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8c80ed50', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f9602af4', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('32b8cacb', 'id'))}">\`
elements+=\`Render selections as chips (implied by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('83ee1711', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('54fda709', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab9001de', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f29ef7c7', 'id'))}">\`
elements+=\`closable-chips\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29ac9ffb', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f341ae7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5143d80b', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f60a2b53', 'id'))}">\`
elements+=\`Chips show a remove button.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a556e4eb', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('503f1ad1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d015a60', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1dfd95cf', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1aeb077f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3da101cf', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e04f972f', 'id'))}">\`
elements+=\`Show a clear (&#215;) button.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ecc0f414', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5f1320e9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6cd8615c', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42ae3529', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f8083671', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('178cb9bb', 'id'))}">\`
elements+=\`Text shown when nothing is selected.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a90dbd84', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('472c25f6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7aeaecb', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac6ccbdc', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('65420b9d', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8f4e7883', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('29e4fe50', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8348f4b1', 'id'))}">\`
elements+=\`Field label / helper / error text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f30c70d1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('30011916', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2f98f62', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6223614', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e5ff3e01', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a95c7bd', 'id'))}">\`
elements+=\`Form field name (renders a hidden input).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7d437dc1', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('436f0e98', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea3f000c', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ee0c2af5', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('53b7d6e3', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('13944965', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f78f08f', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19ac8186', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4129a6fe', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f94e54b', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('727cfc04', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('788205d0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdf2625a', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('252da639', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5effbc6d', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e2a1fdf8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7bb17bf2', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('45ded4b1', 'id'))}">\`
elements+=\`Non-interactive states.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5ff10408', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('024f2665', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('abfc2c9e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5e093499', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('e2b54416', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('1402bb1c', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('1f6f8304', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('6f401453', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1e7e0991', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2996978d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9125bf3c', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('197d1adf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6d818a58', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cf9bac6b', 'id'))}">\`
elements+=\`Fired when the selection changes.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d077a2c9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('09ae93d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('192031d7', 'id'))}">\`
elements+=\`update:model-value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4a3a9736', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fd8239d7', 'id'))}">\`
elements+=\`&#123; value &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8901d903', 'id'))}">\`
elements+=\`Mirror of the value change.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/selects/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
