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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('91aabea7', 'id'))}">\`
elements+=\`Textareas\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3f4aef89', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d216d8e', 'id'))}">\`
elements+=\`w-textarea\`
elements+=\`</code>\`
elements+=\` is the multi-line counterpart to the \`
elements+=\`<a href="/docs/text-fields" id="\${ty_escapeAttr(ty_generateId('f7e8d67d', 'id'))}">\`
elements+=\`text field\`
elements+=\`</a>\`
elements+=\` &#8212; same variants, density, labels, counter, clearable, and inner content, plus \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('675b1584', 'id'))}">\`
elements+=\`rows\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('152dd34a', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17b0810e', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d2ec0bb8', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\`. For a bare styled control use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9660bd77', 'id'))}">\`
elements+=\`.w-textarea\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7e257836', 'id'))}">\`
elements+=\`&lt;textarea&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('20e7a8c0', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6bf2dd65', 'id'))}">\`
elements+=\`
    \`
elements+=\`<textarea class="w-textarea" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('138d7de5', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4e24e97e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Bio" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('83b3b543', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('adb95ee2', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fc4ecf24', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c04bcd6d', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8a8cf96', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f626219f', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea3580bf', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61c94271', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a8666cd6', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aab195c9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ef6e02b7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('6718a794', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('b98dd6c0', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('da963faa', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('c2ab8c50', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('db6b4840', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('245d4b8c', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('d6aacbb3', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b97720ee', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('49906b43', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c4e3f747', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('74620d9b', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('b0028776', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('5181b7e9', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('d30fb380', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('ed662c72', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('88e1cc2e', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('e627edf1', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('db36f30a', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('10464596', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('061f5d60', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--solo w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('427f36fb', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('c1ce451d', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('eaa954b2', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder=" " id="\${ty_escapeAttr(ty_generateId('5f0b7732', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('3383fd79', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5203fcdf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('1bdcbca6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea variant="outlined" label="Outlined" rows="2" value="Outlined" id="\${ty_escapeAttr(ty_generateId('ab1225a0', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="filled" label="Filled" rows="2" value="Filled" id="\${ty_escapeAttr(ty_generateId('f2b71fbd', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="underlined" label="Underlined" rows="2" value="Underlined" id="\${ty_escapeAttr(ty_generateId('a7b8d421', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="plain" label="Plain" rows="2" value="Plain" id="\${ty_escapeAttr(ty_generateId('5f65fa9c', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="solo" label="Solo" rows="2" id="\${ty_escapeAttr(ty_generateId('500455ec', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('924fbd80', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5a0c419c', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d9a904a9', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\` so the field expands with its content; cap it with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('def707aa', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('67790b43', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('295cde3a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('b1d4323f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('2bbf7b2b', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('98133365', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Type several lines…" style="field-sizing: content" id="\${ty_escapeAttr(ty_generateId('31e24c81', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('09bf563f', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('a692f113', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('35d48f7d', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b8465862', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Scrolls after 4 rows…" style="field-sizing: content; max-height: calc(4lh + 1.2rem); overflow-y: auto" id="\${ty_escapeAttr(ty_generateId('b467ce94', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('9ec01c38', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4f443bd9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ce8b1c8c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow" auto-grow="" rows="2" placeholder="Type several lines…" id="\${ty_escapeAttr(ty_generateId('62a974de', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow (max 4 rows)" auto-grow="" max-rows="4" rows="2" placeholder="Scrolls after 4 rows…" id="\${ty_escapeAttr(ty_generateId('6167d84f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8ef3d8ee', 'id'))}">\`
elements+=\`No resize\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2bd131de', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('deb9bd2b', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\` to remove the drag handle (implied by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('88b30dfb', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('39c55132', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('b1598657', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('032d9984', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('8dfe6c95', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" placeholder=" " id="\${ty_escapeAttr(ty_generateId('63e6d67d', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('932ee7d8', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0d2b2790', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Fixed size" no-resize="" rows="3" id="\${ty_escapeAttr(ty_generateId('0f28044d', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('02434343', 'id'))}">\`
elements+=\`Counter &amp; clearable\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('84395fb7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('8c78aeb2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('2614036b', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('48d473c8', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('2db5fb6c', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" maxlength="120" id="\${ty_escapeAttr(ty_generateId('16aa1035', 'id'))}">\`
elements+=\`Hello there\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('918fae28', 'id'))}">\`
elements+=\`Message\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('f6d0ee02', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('884ff2a0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('f7da8576', 'id'))}">\`
elements+=\`11 / 120\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('b796c9db', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('fe7e1a00', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('9795facd', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" id="\${ty_escapeAttr(ty_generateId('008d7cdf', 'id'))}">\`
elements+=\`Clear me\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('71d7e154', 'id'))}">\`
elements+=\`Notes\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" aria-label="Clear" onclick="this.previousElementSibling.querySelector('textarea').value = ''" id="\${ty_escapeAttr(ty_generateId('554342e8', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a4b9794e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('b64607ce', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Message" counter="" maxlength="120" rows="3" value="Hello there" id="\${ty_escapeAttr(ty_generateId('9abb6f03', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Notes" clearable="" rows="3" value="Clear me" id="\${ty_escapeAttr(ty_generateId('ed0424cf', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('57fbec81', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('efedd758', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('42be053e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--disabled" id="\${ty_escapeAttr(ty_generateId('963fec5f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('d5e3fa60', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('2ab1f14c', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" disabled="" id="\${ty_escapeAttr(ty_generateId('02c76bee', 'id'))}">\`
elements+=\`Can't edit\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('15b0f3e3', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--readonly" id="\${ty_escapeAttr(ty_generateId('fb4a1ecc', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('22fc1dc1', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('e7f0578e', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" readonly="" id="\${ty_escapeAttr(ty_generateId('6e699a71', 'id'))}">\`
elements+=\`Locked\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('73bb8522', 'id'))}">\`
elements+=\`Read-only\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--error" id="\${ty_escapeAttr(ty_generateId('69e5a0e3', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('5398822d', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('12f94827', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('aa9d3300', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('22e8dc72', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('dc98570f', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('c25d5c4a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a3169360', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('cf2ebc28', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Disabled" rows="2" value="Can't edit" disabled="" id="\${ty_escapeAttr(ty_generateId('dffbec44', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Read-only" rows="2" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('8004a38f', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Feedback" rows="2" value="" error="This field is required." id="\${ty_escapeAttr(ty_generateId('44812294', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a2acc9eb', 'id'))}">\`
elements+=\`Attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('e33d115d', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('f4dc5061', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b058c3bc', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('aa62be9a', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6c5b03d0', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('99fbf940', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8c417965', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('32851e83', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d1abaffe', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d64eec84', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16cdb839', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7fe4a117', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5bf0dfcb', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1c0b6251', 'id'))}">\`
elements+=\`Current value (reflected; also a property).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2e4c030e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b9ddddab', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6896d6d9', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d9f64891', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d3c1ce50', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('63dd28ba', 'id'))}">\`
elements+=\`Floating label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('c75c5389', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8493d603', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('31d7375e', 'id'))}">\`
elements+=\`placeholder\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4fae778a', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3267ea86', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8a8f1f36', 'id'))}">\`
elements+=\`Placeholder text.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3aecf947', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('460c0afb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea424631', 'id'))}">\`
elements+=\`rows\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6efe3085', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('801a1b06', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c074b83a', 'id'))}">\`
elements+=\`4\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('167c67c4', 'id'))}">\`
elements+=\`Initial visible rows.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3c56c603', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e085e548', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f4644c41', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('49d7a07f', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('58bd211e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2d4d54c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64a36be2', 'id'))}">\`
elements+=\`Grow to fit content instead of scrolling.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('eff928cd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ecb94add', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('15e08df2', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('72b70277', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1b209d0a', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ef38bdce', 'id'))}">\`
elements+=\`Cap \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('df57aaf2', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\` at this many rows.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('12078c44', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1232866b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2a88037', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a5a5e1be', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('85452968', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e56d3e4', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('57cac3d0', 'id'))}">\`
elements+=\`Disable the manual resize handle.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('42b2f07a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b490f38', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('405e45db', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1aea7072', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c3280bb7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('94e61cde', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7ccd2d3f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8cac158f', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3d62b3d1', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0a31e3db', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('03c355b0', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ed58eaf', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('d627723d', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d0cdccf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5cda20dc', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('81ee1953', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4b40f499', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('87394d06', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('44734fa8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f60f8f2', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('01de5026', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('16e791b9', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bd0f6bec', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9ea58fe', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d7cd4929', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2771f909', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1b9b0e53', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d951c43c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('44e53479', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09870abb', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('978cb486', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4b78e942', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6ba48ae4', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('887e1d73', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6024caa6', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a6ad87f9', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b82375a3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3c8b0987', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0b9964fc', 'id'))}">\`
elements+=\`Token color for the focus accent.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2d15e9fd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3f51bc25', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2180a456', 'id'))}">\`
elements+=\`prefix\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2a619a2b', 'id'))}">\`
elements+=\`suffix\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2f302eca', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d976c6df', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d952adc2', 'id'))}">\`
elements+=\`Static text inside the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('291b5d8e', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3dab545d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2bb587c6', 'id'))}">\`
elements+=\`prepend-inner-icon\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a9b2b01', 'id'))}">\`
elements+=\`append-inner-icon\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('4497c999', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('cd68300d', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c6889c16', 'id'))}">\`
elements+=\`Icon names resolved through the icon registry.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('acad3a34', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9f94d65', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea1da200', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('463c9374', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1046548b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5af9743a', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e8bbf13', 'id'))}">\`
elements+=\`Show a clear (×) button when non-empty.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('705ce623', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('59e17892', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4224c72b', 'id'))}">\`
elements+=\`counter\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('dae1aec1', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fd007359', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32c81095', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f2443ad0', 'id'))}">\`
elements+=\`Show a character counter; pairs with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e870f700', 'id'))}">\`
elements+=\`maxlength\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('6fdf08c5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e1d071f4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac67f1a7', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6ea2e41d', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('70c43aa3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4338ccaa', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d78ce02e', 'id'))}">\`
elements+=\`Show an indeterminate bar along the bottom edge.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('888cd9c6', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('06ca68c3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('47d649fe', 'id'))}">\`
elements+=\`hint\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d806d44f', 'id'))}">\`
elements+=\`persistent-hint\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b86aeffd', 'id'))}">\`
elements+=\`string / boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('49d9fb96', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac586683', 'id'))}">\`
elements+=\`Helper text below the control.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bd89faa2', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b8d2bf0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f821bd0', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('323e39f2', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b0f0b33b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7824f363', 'id'))}">\`
elements+=\`Error text; tints the control and replaces the hint.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('28fe3fb0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('872d3688', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dff380d5', 'id'))}">\`
elements+=\`hide-details\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b7491a96', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('beed8dc1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('227c698d', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('54fd7c34', 'id'))}">\`
elements+=\`Suppress the details row (hint / error / counter).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('fe642d43', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('245549f5', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dea01768', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a97e9987', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3e639e2b', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2fe0752c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e8176156', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d8f6221f', 'id'))}">\`
elements+=\`State flags.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e71a03cd', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('32d7c2aa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bbbc3ea9', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('531aa310', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ffc0ebac', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('da22449e', 'id'))}">\`
elements+=\`Form field name.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f468ef4f', 'id'))}">\`
elements+=\`Slots\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('b0c17062', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('781f91b4', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9ffd1dcb', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('96e15e3e', 'id'))}">\`
elements+=\`Slot\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('26d81b47', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('b963d0e4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('df4341a3', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6330d1db', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('903d3ea8', 'id'))}">\`
elements+=\`prepend-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7618f73b', 'id'))}">\`
elements+=\`Content (e.g. an icon) inside the control, leading.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('516b87f9', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a9cc81d3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('72a2bfbc', 'id'))}">\`
elements+=\`append-inner\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e15c321d', 'id'))}">\`
elements+=\`Content inside the control, trailing.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6891cb9b', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('1f30d494', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('e3ccc275', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('b51ee346', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d7d50efa', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('117e6b95', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('a1311665', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('d2131c19', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e5d5ed54', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a1dc09b4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98d3bd1c', 'id'))}">\`
elements+=\`input\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('20d33c5a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1ad3b075', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('174a8dc2', 'id'))}">\`
elements+=\`Fired on every keystroke.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('dcd11e38', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('51bad9ee', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0d7e6f4d', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c4c19ddb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cafcf850', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3dc8e9af', 'id'))}">\`
elements+=\`Fired when the value is committed.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('09e3fab5', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3c6e1be6', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1d4d9123', 'id'))}">\`
elements+=\`clear\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('adf7fe7b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e64171f9', 'id'))}">\`
elements+=\`&#123; name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b06ad161', 'id'))}">\`
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
