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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('3eb883a6', 'id'))}">\`
elements+=\`Grid\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ab63ae36', 'id'))}">\`
elements+=\`A 12-column flexbox grid for responsive layouts. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40d9458a', 'id'))}">\`
elements+=\`w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86aaa867', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b48f7490', 'id'))}">\`
elements+=\`w-col\`
elements+=\`</code>\`
elements+=\` for component layouts, or the equivalent \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eba2a91e', 'id'))}">\`
elements+=\`.w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de108634', 'id'))}">\`
elements+=\`.w-grid-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb8d36ce', 'id'))}">\`
elements+=\`.w-grid-col-*\`
elements+=\`</code>\`
elements+=\` classes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('19f383e1', 'id'))}">\`
elements+=\`Container\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3fa29d61', 'id'))}">\`
elements+=\`Centers content and applies a max width. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('384813b0', 'id'))}">\`
elements+=\`--fluid\`
elements+=\`</code>\`
elements+=\` for full width, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60a47a7c', 'id'))}">\`
elements+=\`--sm\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1bd3606f', 'id'))}">\`
elements+=\`--md\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0aefba0a', 'id'))}">\`
elements+=\`--lg\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2e4fd52', 'id'))}">\`
elements+=\`--xl\`
elements+=\`</code>\`
elements+=\` for a fixed maximum.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('cd9d7c7f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fa16e0c', 'id'))}">\`
elements+=\`&lt;div class="w-container"&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/div&gt;

&lt;w-container&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/w-container&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('93754869', 'id'))}">\`
elements+=\`Basic columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d670c86f', 'id'))}">\`
elements+=\`Each row has 12 units. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a8e5908', 'id'))}">\`
elements+=\`.w-grid-col-6\`
elements+=\`</code>\`
elements+=\` spans half, two of them fill the row.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7c72b2fa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('14cc32c0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('6ce995f9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f84e2de2', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('83bd4331', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('bbdb8537', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" id="\${ty_escapeAttr(ty_generateId('ea8af3bb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('ec8c97de', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f5a7077c', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('6bad18e8', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('d68af7ca', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('020949e1', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('35b2bcb8', 'id'))}">\`
elements+=\`col-4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e25576f9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('d7d5ef9f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('cd2acbd2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('d6d71d70', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('cb1143d1', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('c8a23335', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('aeb6078c', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('167badbc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('33bc22f2', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('639d832a', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('f0f652d6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c50048bc', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('2d56688b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('1f195e88', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ccdbf281', 'id'))}">\`
elements+=\`Auto / equal width\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('643a6372', 'id'))}">\`
elements+=\`Columns without a number share the remaining space equally.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('46c57fb2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('da38b4fe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('45b9c7db', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('3e17c0f3', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('54c97161', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f1691b19', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('ff956d85', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('4c46f987', 'id'))}">\`
elements+=\`auto\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fb72bb7e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('bed51ab9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('6cd49075', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('777d5503', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('98415e6b', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('8671496a', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5960e34c', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('2c480126', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('1cbb539e', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('08b77c47', 'id'))}">\`
elements+=\`Responsive columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e3dc90af', 'id'))}">\`
elements+=\`Stack on mobile, two-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f32b7fd1', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\` (≥960px), four-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cef15ada', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` (≥1280px). Resize the window to see it adapt.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4bf0ff3a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a549dacf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('9bacd0c2', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('84b7f40d', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('abba233b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e54f9563', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('5530da64', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('6dc3b334', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('eb4312e6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('83efc85d', 'id'))}">\`
elements+=\`4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('01a819f7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('71fa0bae', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('85232b0a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('4fcbd4c8', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('0b788170', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('7cd8d795', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e93b7255', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('f1f98643', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('187bf39b', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('1d7d3341', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2314d09d', 'id'))}">\`
elements+=\`4\`
elements+=\`</div>\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e86c65a9', 'id'))}">\`
elements+=\`Offsets\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fcd3b10e', 'id'))}">\`
elements+=\`Push a column to the right with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b3cf7d6f', 'id'))}">\`
elements+=\`.w-grid-offset-*\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c8ba0ed7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('7be7337c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('31e8042b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('011920a7', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-offset-4" id="\${ty_escapeAttr(ty_generateId('02695f85', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('6469604e', 'id'))}">\`
elements+=\`col-4 · offset-4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('46cf50dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('5c915dcd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('f8922fea', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('1b8ed17b', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('60da6e82', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" offset="4" id="\${ty_escapeAttr(ty_generateId('4955830c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e70d2ba4', 'id'))}">\`
elements+=\`col-4 · offset-4\`
elements+=\`</div>\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6ca53dd6', 'id'))}">\`
elements+=\`Gutters & alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3657ef96', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('389148b3', 'id'))}">\`
elements+=\`--tight\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('157f3bc6', 'id'))}">\`
elements+=\`--flush\`
elements+=\`</code>\`
elements+=\` to the row for smaller / no gutters, set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d722a8a', 'id'))}">\`
elements+=\`gutter\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ddcd39f', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\` for named or custom spacing, and use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8852e26f', 'id'))}">\`
elements+=\`--center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('35c31ddf', 'id'))}">\`
elements+=\`--between\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90a62d9c', 'id'))}">\`
elements+=\`--middle\`
elements+=\`</code>\`
elements+=\` to align columns.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6cdf91e1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--flush" id="\${ty_escapeAttr(ty_generateId('b3314434', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('5b1b51a6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2f797840', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('e05e6abb', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('78069283', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('4aead337', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8d3f717d', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('7284f0f5', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('fc9e44d8', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" style="--w-grid-gutter: var(--w-space-8)" id="\${ty_escapeAttr(ty_generateId('204f567a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('f3326b69', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5b133e5d', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('beaaddcc', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('308c60ec', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('c8536505', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('39b0cbc4', 'id'))}">\`
elements+=\`xl gutter\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e8e25ba0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('66ddf878', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row no-gutters="" id="\${ty_escapeAttr(ty_generateId('829c50d6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('b2e8d013', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8863feee', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('fc6e0cb6', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('52597e34', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('da869d9c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7cc5f531', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('465a76a3', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('577fcb68', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row gutter="xl" class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('56d0f70b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('3581dee8', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2891140a', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('7a99f48e', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('0d870456', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('4f5b7eaf', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a66cc1b5', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/grid/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
