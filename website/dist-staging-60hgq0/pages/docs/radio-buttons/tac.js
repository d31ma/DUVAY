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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('62d0ef6f', 'id'))}">\`
elements+=\`Radio buttons\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4a27c931', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a088293f', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\` wraps a set of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3a41e249', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` options for a single choice. The group manages the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9be43706', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, selected \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2138e548', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, and keyboard navigation. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('079d6216', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\` to lay the options out in a row.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('256e39d0', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e5a00d54', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-selection-control-group w-radio-group" role="radiogroup" aria-label="Delivery speed" id="\${ty_escapeAttr(ty_generateId('2600c0eb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('9c6e67da', 'id'))}">\`
elements+=\`Delivery speed\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('9c606721', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="standard" checked="" id="\${ty_escapeAttr(ty_generateId('aa2ea5c9', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('3a078703', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('3c702ca3', 'id'))}">\`
elements+=\`Standard\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('9081c8eb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="express" id="\${ty_escapeAttr(ty_generateId('8d09d0f8', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('495cd354', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('03fa6a19', 'id'))}">\`
elements+=\`Express\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('ab4fcc20', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="scheduled" id="\${ty_escapeAttr(ty_generateId('99205b2b', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('735c76ca', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('22c0138c', 'id'))}">\`
elements+=\`Scheduled\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0236625f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Delivery speed" name="delivery-wc" value="standard" id="\${ty_escapeAttr(ty_generateId('1f341d9e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="standard" label="Standard" id="\${ty_escapeAttr(ty_generateId('27106d8e', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="express" label="Express" id="\${ty_escapeAttr(ty_generateId('214f0fca', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="scheduled" label="Scheduled" id="\${ty_escapeAttr(ty_generateId('fa7d4cc5', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4c8ef397', 'id'))}">\`
elements+=\`Inline\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a5150457', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23a0c22e', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\` attribute arranges the options horizontally, wrapping as needed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f539eb4f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Contact method" name="contact-wc" value="email" inline="" id="\${ty_escapeAttr(ty_generateId('1d5a538f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="email" label="Email" id="\${ty_escapeAttr(ty_generateId('db0b721a', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="phone" label="Phone" id="\${ty_escapeAttr(ty_generateId('182bfc25', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="sms" label="SMS" id="\${ty_escapeAttr(ty_generateId('4cc0e042', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b1d1455c', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a7b38d82', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0bf78a4c', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` on a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a90e2c00', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` to change its accent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('396d1c32', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Priority" name="priority-wc" value="low" inline="" id="\${ty_escapeAttr(ty_generateId('b4af401e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="low" label="Low" color="success" id="\${ty_escapeAttr(ty_generateId('0d9d9970', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="medium" label="Medium" color="warning" id="\${ty_escapeAttr(ty_generateId('75de9c5b', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="high" label="High" color="error" id="\${ty_escapeAttr(ty_generateId('b5687067', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('665402cb', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5888787e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Plan" name="plan-wc" value="free" disabled="" id="\${ty_escapeAttr(ty_generateId('ed9fb7c7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="free" label="Free" id="\${ty_escapeAttr(ty_generateId('85fc0d1c', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="pro" label="Pro" id="\${ty_escapeAttr(ty_generateId('a2c17853', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9df9144f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25a97ebe', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\` attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('2608d15c', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('351bd860', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c8d59604', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7fcdc585', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('71d0ae56', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('5578f67e', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('9f32b5b9', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('220a0d82', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9268594b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af26b92c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8495b877', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b5244cd7', 'id'))}">\`
elements+=\`model-value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('67adb4e9', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9a480b36', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1b049653', 'id'))}">\`
elements+=\`Selected option value.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f96c6597', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b657a35f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ac43916', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7682231f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1ab959c6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a31e6c14', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4182c620', 'id'))}">\`
elements+=\`Shared form field name for the options.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('20098f2d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d875d9a3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb3c5cab', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4241569f', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cba544a4', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('abcf0af2', 'id'))}">\`
elements+=\`Group label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a13dbaee', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dbc23ee7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('563e6a05', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4ebe93e0', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5905b15', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd83171a', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f6872491', 'id'))}">\`
elements+=\`Lay the options out in a row.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ebfdd1a8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4cb8fd0a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9148c0a1', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('83d9fe46', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2698510d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16865f4e', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('69cbd19f', 'id'))}">\`
elements+=\`Disable every option.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8bcab11a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec8415a4', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('484ba624', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('3efe0600', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e080f47a', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b0c2ca20', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('3191e4d6', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('968b22f7', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d83f58fc', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('4eca4d6f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0b20d1ff', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4bf64ad5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('af990aa7', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('803575e6', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7bae328e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('00c426f4', 'id'))}">\`
elements+=\`on\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7de736a2', 'id'))}">\`
elements+=\`Value reported when selected.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2015ac0e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('21cc48da', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c400b2f', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e6ea1d7', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b5eabeb1', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('aa775eb7', 'id'))}">\`
elements+=\`Label text (or use the default slot).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('851c63ab', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9eaad1e7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eaf04eaf', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dc338b48', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('eb296d8f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8172cf99', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6876041e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37ff5c51', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c90512f6', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1105abb2', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('335d13fb', 'id'))}">\`
elements+=\`warning\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fe0a9520', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('afb64550', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d49f6b4c', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3341db68', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('609692f6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0e1ddfb9', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c14da003', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fdffc132', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e0253f5', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4d28032e', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b6cf413e', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2cacaa83', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e39dde56', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4eb87dce', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('46a7e3aa', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4cc2c6d8', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('57a63ce3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ceb0262', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('00bb222b', 'id'))}">\`
elements+=\`Selected / disabled state.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ac40b0e3', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('1d5fd88a', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('5d4451fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('17ed2e46', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d06c47dd', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('820e75a4', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f8182227', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('5083553d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1bf6ea4f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6ae575b8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ebdb850', 'id'))}">\`
elements+=\`w-change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a6d5eb31', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7755824c', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('742663fd', 'id'))}">\`
elements+=\`Fired by the group when the selection changes.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/radio-buttons/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
