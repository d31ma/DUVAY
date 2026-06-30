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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('5d31bcf8', 'id'))}">\`
elements+=\`Textareas\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6fa27c26', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('84fd4351', 'id'))}">\`
elements+=\`w-textarea\`
elements+=\`</code>\`
elements+=\` is the multi-line counterpart to the \`
elements+=\`<a href="/docs/text-fields" id="\${ty_escapeAttr(ty_generateId('cb2fc4e7', 'id'))}">\`
elements+=\`text field\`
elements+=\`</a>\`
elements+=\` &#8212; same variants, density, labels, counter, clearable, and inner content, plus \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb8ed58f', 'id'))}">\`
elements+=\`rows\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('43fa0274', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f95e87b3', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('254bad6c', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\`. For a bare styled control use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d5e643cd', 'id'))}">\`
elements+=\`.w-textarea\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26d1cd33', 'id'))}">\`
elements+=\`&lt;textarea&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ef14bf88', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('638c53df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<textarea class="w-textarea" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('7fccb7bf', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8200b00d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Bio" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('0c0b1818', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2fbbe105', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1cfde772', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8fe65eaf', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3797aad', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c41df4b9', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('899971fe', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7571fa40', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f8fb7b59', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('54c621e3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('4ebe93f7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('d813a858', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('be324f05', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('40a3daa3', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('9efae487', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('f6d967e1', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('ab4d5909', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('db15d273', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('c733f882', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('2c4d8d1f', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('e4d307e1', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('12f00a32', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('1fe0e387', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('eaa842e2', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('e0458c75', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('825c8030', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('1ca3a6be', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('62040019', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('0d1a6982', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('f7ef69bd', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('1df39e6e', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--solo w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('5c3a08be', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('d0daf1e4', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('c154d20d', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder=" " id="\${ty_escapeAttr(ty_generateId('edabe061', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('f1fc1b26', 'id'))}">\`
elements+=\`Solo\`
elements+=\`</label>\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('91c4ac55', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('539fa59c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea variant="outlined" label="Outlined" rows="2" value="Outlined" id="\${ty_escapeAttr(ty_generateId('5d3b78d8', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="filled" label="Filled" rows="2" value="Filled" id="\${ty_escapeAttr(ty_generateId('be1d114a', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="underlined" label="Underlined" rows="2" value="Underlined" id="\${ty_escapeAttr(ty_generateId('a1f8a849', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="plain" label="Plain" rows="2" value="Plain" id="\${ty_escapeAttr(ty_generateId('62df3d6d', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="solo" label="Solo" rows="2" id="\${ty_escapeAttr(ty_generateId('b798e68d', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('93e421b7', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('95d826ea', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d5b68d3', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\` so the field expands with its content; cap it with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a32c4af0', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0afcfcda', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('72686bca', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('30f52583', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('5b131358', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('39455540', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Type several lines…" style="field-sizing: content" id="\${ty_escapeAttr(ty_generateId('8a674fdf', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('9346b3b4', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('ccedc016', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('1295bd90', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('d0f5708a', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Scrolls after 4 rows…" style="field-sizing: content; max-height: calc(4lh + 1.2rem); overflow-y: auto" id="\${ty_escapeAttr(ty_generateId('0f15b38e', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('af22e6f7', 'id'))}">\`
elements+=\`Auto-grow (max 4 rows)\`
elements+=\`</label>\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8b1e5efc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('7ce63265', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow" auto-grow="" rows="2" placeholder="Type several lines…" id="\${ty_escapeAttr(ty_generateId('12f178e9', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow (max 4 rows)" auto-grow="" max-rows="4" rows="2" placeholder="Scrolls after 4 rows…" id="\${ty_escapeAttr(ty_generateId('5b173338', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f408e431', 'id'))}">\`
elements+=\`No resize\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7fa24fc9', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3532dbc7', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\` to remove the drag handle (implied by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('609cfcfe', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f3a14a5a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('6a716b75', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('14092c55', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('6b777e0c', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" placeholder=" " id="\${ty_escapeAttr(ty_generateId('732f0f7b', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('7a9c2fc0', 'id'))}">\`
elements+=\`Fixed size\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4fcc980b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Fixed size" no-resize="" rows="3" id="\${ty_escapeAttr(ty_generateId('5b2dd4bb', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f90ae9ca', 'id'))}">\`
elements+=\`Counter &amp; clearable\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3774703', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('353578d6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('e5771361', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('3265ac0e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('a4dfc0ef', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" maxlength="120" id="\${ty_escapeAttr(ty_generateId('09527385', 'id'))}">\`
elements+=\`Hello there\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0e87ba0f', 'id'))}">\`
elements+=\`Message\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('840b927e', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('e710db0e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('f6b0315b', 'id'))}">\`
elements+=\`11 / 120\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('4b78a823', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ab9ba6e0', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('3c17937b', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" id="\${ty_escapeAttr(ty_generateId('28e06182', 'id'))}">\`
elements+=\`Clear me\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('4d61c5e2', 'id'))}">\`
elements+=\`Notes\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" aria-label="Clear" onclick="this.previousElementSibling.querySelector('textarea').value = ''" id="\${ty_escapeAttr(ty_generateId('7a7d721c', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f7ae3735', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('6c4c7046', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Message" counter="" maxlength="120" rows="3" value="Hello there" id="\${ty_escapeAttr(ty_generateId('3e22d81c', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Notes" clearable="" rows="3" value="Clear me" id="\${ty_escapeAttr(ty_generateId('eda98645', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9207318f', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c15c8c6a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('603c154a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--disabled" id="\${ty_escapeAttr(ty_generateId('994014b8', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('7a94e6f9', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b19410b8', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" disabled="" id="\${ty_escapeAttr(ty_generateId('4d9a1175', 'id'))}">\`
elements+=\`Can't edit\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('06dd835c', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--readonly" id="\${ty_escapeAttr(ty_generateId('2979b944', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('b6dcbcca', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('4c486cf6', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" readonly="" id="\${ty_escapeAttr(ty_generateId('7cb9b3bb', 'id'))}">\`
elements+=\`Locked\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0ef74e79', 'id'))}">\`
elements+=\`Read-only\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--error" id="\${ty_escapeAttr(ty_generateId('d35b2809', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('413cffee', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('876d7a4e', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('f6c49cde', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('1b2cc20d', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('a1c33639', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('1b367103', 'id'))}">\`
elements+=\`This field is required.\`
elements+=\`</span>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('69f1194c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('016b3ece', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Disabled" rows="2" value="Can't edit" disabled="" id="\${ty_escapeAttr(ty_generateId('d740c4b1', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Read-only" rows="2" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('6f4a277e', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Feedback" rows="2" value="" error="This field is required." id="\${ty_escapeAttr(ty_generateId('059731db', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a449a57f', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('9275ba79', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('6668769c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6a5ab94a', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('530b06be', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('62c434ff', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('049513ea', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b046f520', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('05afa70b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a87eb491', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('889e3993', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ffbd1c1', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e56d9c5c', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c27faf6', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3f34a631', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fc9d9f1e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4c3bdbfb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aee225c1', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dea2251b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d89fe111', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7692565d', 'id'))}">\`
elements+=\`Floating label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('28065f88', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('23a01167', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('385b7a7e', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed300029', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('538edc2a', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2a8971cb', 'id'))}">\`
elements+=\`Placeholder text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('75f7e43f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1558ae04', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f3fe32fa', 'id'))}">\`
elements+=\`rows\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1661dba7', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91cc8a70', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('47274d52', 'id'))}">\`
elements+=\`4\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('881cac4c', 'id'))}">\`
elements+=\`Initial visible rows.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('73503012', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0e7d7b40', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1fbe4b0a', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('799ed8b4', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cb6a2008', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b2a1eb45', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bf672ddc', 'id'))}">\`
elements+=\`Grow to fit content instead of scrolling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d418ae00', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b29ef0a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('323537d5', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ca4da35', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64baa80e', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('68e7e220', 'id'))}">\`
elements+=\`Cap \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5d36d49', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\` at this many rows.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ccc32620', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7fcfd6c2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f0327c7', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0bcc0f86', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('16a2ee3f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0205aeb3', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f7a129a2', 'id'))}">\`
elements+=\`Disable the manual resize handle.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('946b13aa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('94bf5f94', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e362b7c', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ca35ec4', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85cac45e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0c859724', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c923d274', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('95128f93', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb5f8033', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('26bba67d', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6509a270', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90b09cb1', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a8955e0c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('28a9890c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3b4e0980', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fdcd3275', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10a91b66', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60f53c78', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('22054560', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b90ff921', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('50f04af8', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a22058c3', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('147e3df7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f057c8fd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('215feec8', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('461147ab', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('19e79d77', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('89709370', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d2d5083', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fab096dc', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('673f17ed', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2dbdca82', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ee1b855a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6f89d2d3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('954e561d', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ca9ab3df', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dad33ae1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5e2ee6f8', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('578d5686', 'id'))}">\`
elements+=\`Token color for the focus accent.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('694b1d4b', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f3421ff3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d31d4458', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('426a532f', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7f5bc5df', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85f421f9', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1cb973ce', 'id'))}">\`
elements+=\`Static text inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('68b980be', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('95ab831a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('36d0b01a', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5c790d6f', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bff6f84c', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('876b4d30', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('684f024d', 'id'))}">\`
elements+=\`Icon names resolved through the icon registry.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('234fb972', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b51c08f4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('51b5865f', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e40e0579', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('57bde7a7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('86255fe9', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70fe52f4', 'id'))}">\`
elements+=\`Show a clear (×) button when non-empty.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2dffea90', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('99bf3500', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a36a2c3', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('03a4ebb9', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('69b24708', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aef5bc12', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac13b09e', 'id'))}">\`
elements+=\`Show a character counter; pairs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('70ef65f4', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bdba3fac', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4e60a058', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28067356', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('089a8c9d', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3ccc9021', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b19b7e49', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('342ba9c0', 'id'))}">\`
elements+=\`Show an indeterminate bar along the bottom edge.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7aed1ddf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f8f00c5b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ba94db5', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f6baaea', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffc15368', 'id'))}">\`
elements+=\`string / boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('528c77b9', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0b8a1d9c', 'id'))}">\`
elements+=\`Helper text below the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3dde1069', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f9e86c2c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2877880', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5a553cf4', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e4977f0', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('be844002', 'id'))}">\`
elements+=\`Error text; tints the control and replaces the hint.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('efc8a3a8', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('db438a78', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d21951f', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3b5a1415', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c064704e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('484a98b7', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a889787e', 'id'))}">\`
elements+=\`Suppress the details row (hint / error / counter).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('77451ffa', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fb42eacc', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4294d046', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('08138307', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('955866e9', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a8a1e74b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c59af356', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ed53a90a', 'id'))}">\`
elements+=\`State flags.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6f9f2d32', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0740d42f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11b3b4d6', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ef4ce0bf', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d08b1eb2', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0cebc421', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('60d6bb4c', 'id'))}">\`
elements+=\`Slots\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('2bc5a28a', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('0a8ded62', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ac401676', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('77d91c5c', 'id'))}">\`
elements+=\`Slot\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8d9b4cc8', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('f9a1d437', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c241c747', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('71cb2562', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abaa81fc', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('921dff90', 'id'))}">\`
elements+=\`Content (e.g. an icon) inside the control, leading.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fa76d724', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9aa4141c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a6fffdc0', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7eab353e', 'id'))}">\`
elements+=\`Content inside the control, trailing.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0a574252', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('e86c3fdd', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('cac373e3', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2fcd6448', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('706b367d', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a822b31a', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b5b1ac67', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('bd894261', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b560a1bf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dd2a0b33', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2f46a9c', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2e835f24', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fa5c1a7a', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e88e0638', 'id'))}">\`
elements+=\`Fired on every keystroke.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('f9c33f50', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('24187079', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('593e285b', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('123195c2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0337805d', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('51c1a302', 'id'))}">\`
elements+=\`Fired when the value is committed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('499b0e5f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('195f1b22', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bd78b2c5', 'id'))}">\`
elements+=\`clear\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a668d293', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('36913e75', 'id'))}">\`
elements+=\`&#123; name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f2f1ff53', 'id'))}">\`
elements+=\`Fired when cleared via the clear button.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/textareas/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
