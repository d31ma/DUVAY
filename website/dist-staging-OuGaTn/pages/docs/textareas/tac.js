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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('514ac887', 'id'))}">\`
elements+=\`Textareas\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0044fda9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bf510c89', 'id'))}">\`
elements+=\`w-textarea\`
elements+=\`</code>\`
elements+=\` is the multi-line counterpart to the \`
elements+=\`<a href="/docs/text-fields" id="\${ty_escapeAttr(ty_generateId('bbc916b2', 'id'))}">\`
elements+=\`text field\`
elements+=\`</a>\`
elements+=\` &#8212; same variants, density, labels, counter, clearable, and inner content, plus \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1ff2bc6', 'id'))}">\`
elements+=\`rows\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3110fe5e', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f8210b2', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e077eeb3', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\`. For a bare styled control use the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fde7e41d', 'id'))}">\`
elements+=\`.w-textarea\`
elements+=\`</code>\`
elements+=\` class on a native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6007556b', 'id'))}">\`
elements+=\`&lt;textarea&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('52aa5757', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e5b2464d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<textarea class="w-textarea" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('5edc56f1', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4e8c8360', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Bio" rows="3" placeholder="Tell us about yourself…" id="\${ty_escapeAttr(ty_generateId('27a69630', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('52b50492', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3204441f', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f91ba195', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f31c035', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\` (default), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('04b4bf42', 'id'))}">\`
elements+=\`filled\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2bd7b820', 'id'))}">\`
elements+=\`underlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f6729122', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9493e8b6', 'id'))}">\`
elements+=\`solo\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('34fd893a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('57a8c793', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('44e4f4a3', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('bf97a4c9', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('bd01a631', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('781ad2e3', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0429ad01', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--filled w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('cfcdeeac', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('33c323c1', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('b11afa38', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('a3b36aee', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('df29b1ae', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--underlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('cda5263a', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('6fcc9583', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('f11206b0', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('0d050022', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('0ef82776', 'id'))}">\`
elements+=\`Underlined\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--plain w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('59200152', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('28949f28', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('6ec3c687', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" id="\${ty_escapeAttr(ty_generateId('ca4c1af5', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('3810f7be', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--solo w-text-field--floating" id="\${ty_escapeAttr(ty_generateId('8670a975', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('385e0b0e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('debcb88a', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder=" " id="\${ty_escapeAttr(ty_generateId('b0e4d156', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('6cab749e', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('1fa168f7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0ad07dee', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea variant="outlined" label="Outlined" rows="2" value="Outlined" id="\${ty_escapeAttr(ty_generateId('e2f61558', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="filled" label="Filled" rows="2" value="Filled" id="\${ty_escapeAttr(ty_generateId('8216038e', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="underlined" label="Underlined" rows="2" value="Underlined" id="\${ty_escapeAttr(ty_generateId('083296d5', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="plain" label="Plain" rows="2" value="Plain" id="\${ty_escapeAttr(ty_generateId('d07cb28a', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea variant="solo" label="Solo" rows="2" id="\${ty_escapeAttr(ty_generateId('c1b61d28', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f81c8eb5', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6e6cadb1', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb90b6e9', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\` so the field expands with its content; cap it with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4be19c55', 'id'))}">\`
elements+=\`max-rows\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2ad8b9a7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ff33e9e4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('e227dac7', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('ec92519e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('90fff51d', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Type several lines…" style="field-sizing: content" id="\${ty_escapeAttr(ty_generateId('eb94b85e', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('4d63921a', 'id'))}">\`
elements+=\`Auto-grow\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('e52bd5e2', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('5a42cd46', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('a7126830', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" placeholder="Scrolls after 4 rows…" style="field-sizing: content; max-height: calc(4lh + 1.2rem); overflow-y: auto" id="\${ty_escapeAttr(ty_generateId('fdfa3d46', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('12ed6c8c', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('798d6651', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c8fcc4b6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow" auto-grow="" rows="2" placeholder="Type several lines…" id="\${ty_escapeAttr(ty_generateId('bf17087d', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Auto-grow (max 4 rows)" auto-grow="" max-rows="4" rows="2" placeholder="Scrolls after 4 rows…" id="\${ty_escapeAttr(ty_generateId('b09d66fb', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cf2e83db', 'id'))}">\`
elements+=\`No resize\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dda163eb', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cec83980', 'id'))}">\`
elements+=\`no-resize\`
elements+=\`</code>\`
elements+=\` to remove the drag handle (implied by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8b51eb44', 'id'))}">\`
elements+=\`auto-grow\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ad44daf3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--no-resize" id="\${ty_escapeAttr(ty_generateId('42394193', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('a78ebb24', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('bcfd57d9', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" placeholder=" " id="\${ty_escapeAttr(ty_generateId('8d16dc47', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('4d32876a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('34b3b251', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-textarea label="Fixed size" no-resize="" rows="3" id="\${ty_escapeAttr(ty_generateId('2d82af73', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0ea97918', 'id'))}">\`
elements+=\`Counter &amp; clearable\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8c9dadcf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('14294246', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('80e18513', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('742ce84f', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('a3d95352', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" maxlength="120" id="\${ty_escapeAttr(ty_generateId('383901ad', 'id'))}">\`
elements+=\`Hello there\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('bdc7f7a1', 'id'))}">\`
elements+=\`Message\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('f5a0d2c6', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('f6f03e37', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-text-field-counter" id="\${ty_escapeAttr(ty_generateId('adcc4934', 'id'))}">\`
elements+=\`11 / 120\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value" id="\${ty_escapeAttr(ty_generateId('cd1d4a6c', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('c7430a7e', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('085f0433', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="3" id="\${ty_escapeAttr(ty_generateId('2d656791', 'id'))}">\`
elements+=\`Clear me\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('36362541', 'id'))}">\`
elements+=\`Notes\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`<button type="button" class="w-text-field-clear" aria-label="Clear" onclick="this.previousElementSibling.querySelector('textarea').value = ''" id="\${ty_escapeAttr(ty_generateId('88e806f0', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6c360316', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('9b872a70', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Message" counter="" maxlength="120" rows="3" value="Hello there" id="\${ty_escapeAttr(ty_generateId('20166236', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Notes" clearable="" rows="3" value="Clear me" id="\${ty_escapeAttr(ty_generateId('6f25174c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a7fcafa1', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('228187df', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('88b0c018', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--disabled" id="\${ty_escapeAttr(ty_generateId('f777012f', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('800076f4', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('206adf4f', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" disabled="" id="\${ty_escapeAttr(ty_generateId('591b2fa5', 'id'))}">\`
elements+=\`Can't edit\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('c14b65a2', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--has-value w-text-field--readonly" id="\${ty_escapeAttr(ty_generateId('78ba0478', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('02b34c4b', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('9194b1d5', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" readonly="" id="\${ty_escapeAttr(ty_generateId('9312e721', 'id'))}">\`
elements+=\`Locked\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('83e838ec', 'id'))}">\`
elements+=\`Read-only\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-text-field w-text-field--textarea w-text-field--outlined w-text-field--floating w-text-field--error" id="\${ty_escapeAttr(ty_generateId('bd12a485', 'id'))}">\`
elements+=\`<div class="w-text-field-control" id="\${ty_escapeAttr(ty_generateId('e8145e91', 'id'))}">\`
elements+=\`<span class="w-text-field-field" id="\${ty_escapeAttr(ty_generateId('bc8e8fff', 'id'))}">\`
elements+=\`<textarea class="w-text-field-input w-text-field-textarea" rows="2" aria-invalid="true" id="\${ty_escapeAttr(ty_generateId('e6bea5ef', 'id'))}">\`
elements+=\`</textarea>\`
elements+=\`<label class="w-text-field-label" id="\${ty_escapeAttr(ty_generateId('ab4f3f8a', 'id'))}">\`
elements+=\`Feedback\`
elements+=\`</label>\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`<div class="w-text-field-details" id="\${ty_escapeAttr(ty_generateId('eb45a6b4', 'id'))}">\`
elements+=\`<span class="w-text-field-messages" id="\${ty_escapeAttr(ty_generateId('52b25de2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('67cf1f50', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('c22d83e8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-textarea label="Disabled" rows="2" value="Can't edit" disabled="" id="\${ty_escapeAttr(ty_generateId('7bc58dd5', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Read-only" rows="2" value="Locked" readonly="" id="\${ty_escapeAttr(ty_generateId('a2dc9816', 'id'))}">\`
elements+=\`</w-textarea>\`
elements+=\`
      \`
elements+=\`<w-textarea label="Feedback" rows="2" value="" error="This field is required." id="\${ty_escapeAttr(ty_generateId('3dc6999d', 'id'))}">\`
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

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/textareas/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
