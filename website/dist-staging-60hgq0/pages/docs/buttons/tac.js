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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('0f7ec07b', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7c1d0558', 'id'))}">\`
elements+=\`DuVay buttons come in multiple variants and sizes. All buttons are accessible with proper focus states.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('244cf0e6', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5fae0796', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('a495f6aa', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('e77f5b49', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('72451798', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-ghost" id="\${ty_escapeAttr(ty_generateId('2630770b', 'id'))}">\`
elements+=\`Ghost\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-text" id="\${ty_escapeAttr(ty_generateId('11050a8f', 'id'))}">\`
elements+=\`Text\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('428e8ed0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('3cd9cde7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" id="\${ty_escapeAttr(ty_generateId('e4565da7', 'id'))}">\`
elements+=\`Filled\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('70f9a9e2', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="ghost" id="\${ty_escapeAttr(ty_generateId('e162fe86', 'id'))}">\`
elements+=\`Ghost\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="text" id="\${ty_escapeAttr(ty_generateId('4f1b5277', 'id'))}">\`
elements+=\`Text\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('6304396b', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1b91fe2a', 'id'))}">\`
elements+=\`Five sizes from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('731aed8d', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d5e3c40c', 'id'))}">\`
elements+=\`xl\`
elements+=\`</code>\`
elements+=\`; omit for the 40px default.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b2dd734b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('7153cc5b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-xs" id="\${ty_escapeAttr(ty_generateId('0a9414dd', 'id'))}">\`
elements+=\`XS\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-sm" id="\${ty_escapeAttr(ty_generateId('31c68ad7', 'id'))}">\`
elements+=\`Small\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('ec929543', 'id'))}">\`
elements+=\`Default\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-lg" id="\${ty_escapeAttr(ty_generateId('172fb443', 'id'))}">\`
elements+=\`Large\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-xl" id="\${ty_escapeAttr(ty_generateId('2f448bcf', 'id'))}">\`
elements+=\`XL\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('92c7dde6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('9244ce6e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" size="xs" id="\${ty_escapeAttr(ty_generateId('23367e3c', 'id'))}">\`
elements+=\`XS\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" size="sm" id="\${ty_escapeAttr(ty_generateId('20c81b91', 'id'))}">\`
elements+=\`Small\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" id="\${ty_escapeAttr(ty_generateId('3f8231f4', 'id'))}">\`
elements+=\`Default\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" size="lg" id="\${ty_escapeAttr(ty_generateId('5ab1d351', 'id'))}">\`
elements+=\`Large\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" size="xl" id="\${ty_escapeAttr(ty_generateId('0490878a', 'id'))}">\`
elements+=\`XL\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('109b1334', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('477567d8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('e26ea76f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-primary" id="\${ty_escapeAttr(ty_generateId('405afa13', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-success" id="\${ty_escapeAttr(ty_generateId('50cd7ac9', 'id'))}">\`
elements+=\`Success\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-danger" id="\${ty_escapeAttr(ty_generateId('43669d9b', 'id'))}">\`
elements+=\`Danger\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-btn-warning" id="\${ty_escapeAttr(ty_generateId('21cffb62', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('dfb6ab73', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('bc251388', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" color="primary" id="\${ty_escapeAttr(ty_generateId('04120ccd', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" color="success" id="\${ty_escapeAttr(ty_generateId('1a2b33d3', 'id'))}">\`
elements+=\`Success\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" color="danger" id="\${ty_escapeAttr(ty_generateId('56068299', 'id'))}">\`
elements+=\`Danger\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" color="warning" id="\${ty_escapeAttr(ty_generateId('8054dc7d', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('883655f4', 'id'))}">\`
elements+=\`States\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e19a38f2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('48adb2d2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" disabled="" id="\${ty_escapeAttr(ty_generateId('8f29a510', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-loading" id="\${ty_escapeAttr(ty_generateId('e6c8a89b', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('50dc2a7e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-btn-leading-icon" id="\${ty_escapeAttr(ty_generateId('b66b4049', 'id'))}">\`
elements+=\`+\`
elements+=\`</span>\`
elements+=\`
        With Icon
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('009d229a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('276f1438', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" disabled="" id="\${ty_escapeAttr(ty_generateId('60fffa75', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" loading="" id="\${ty_escapeAttr(ty_generateId('9c53ef07', 'id'))}">\`
elements+=\`Loading\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" icon="+" id="\${ty_escapeAttr(ty_generateId('271dfd12', 'id'))}">\`
elements+=\`With Icon\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1ca82c6d', 'id'))}">\`
elements+=\`Button group\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f30572db', 'id'))}">\`
elements+=\`Join related buttons into a single segmented control with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c136e421', 'id'))}">\`
elements+=\`.w-btn-group\`
elements+=\`</code>\`
elements+=\`. Mark the chosen one with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('65925e9e', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\`. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('292620b2', 'id'))}">\`
elements+=\`.w-btn-group--vertical\`
elements+=\`</code>\`
elements+=\` to stack.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3531f15', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-btn-group" id="\${ty_escapeAttr(ty_generateId('99b2011d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn active" id="\${ty_escapeAttr(ty_generateId('d5b1add8', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn" id="\${ty_escapeAttr(ty_generateId('f5270bec', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn" id="\${ty_escapeAttr(ty_generateId('68e69899', 'id'))}">\`
elements+=\`Month\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('362d320e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-btn-group" id="\${ty_escapeAttr(ty_generateId('9c45efad', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn active="" id="\${ty_escapeAttr(ty_generateId('5cded091', 'id'))}">\`
elements+=\`Day\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn id="\${ty_escapeAttr(ty_generateId('4c029945', 'id'))}">\`
elements+=\`Week\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn id="\${ty_escapeAttr(ty_generateId('1486f655', 'id'))}">\`
elements+=\`Month\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a3b727b9', 'id'))}">\`
elements+=\`Block buttons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d82ec618', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2fc2feab', 'id'))}">\`
elements+=\`block\`
elements+=\`</code>\`
elements+=\` to make a button span the full width of its container.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('31dfb822', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-filled w-btn-block" id="\${ty_escapeAttr(ty_generateId('c13ea068', 'id'))}">\`
elements+=\`Block button\`
elements+=\`</button>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a6ed39fe', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="filled" block="" id="\${ty_escapeAttr(ty_generateId('4dd48e07', 'id'))}">\`
elements+=\`Block button\`
elements+=\`</w-btn>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('12ea0a5c', 'id'))}">\`
elements+=\`Stacked buttons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('82df600e', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ce5783fb', 'id'))}">\`
elements+=\`stacked\`
elements+=\`</code>\`
elements+=\` to place the icon above the label.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('572306c4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-text w-btn-stacked" id="\${ty_escapeAttr(ty_generateId('dfbeb88d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-btn-leading-icon" id="\${ty_escapeAttr(ty_generateId('e3a615be', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      Star
    \`
elements+=\`</button>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3034580c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="text" stacked="" prepend-icon="★" id="\${ty_escapeAttr(ty_generateId('df180222', 'id'))}">\`
elements+=\`Star\`
elements+=\`</w-btn>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('127e887a', 'id'))}">\`
elements+=\`Prepend and append icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0342a517', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b9ca82be', 'id'))}">\`
elements+=\`prepend-icon\`
elements+=\`</code>\`
elements+=\` for a leading icon and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61ba4f3e', 'id'))}">\`
elements+=\`append-icon\`
elements+=\`</code>\`
elements+=\` for a trailing icon.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('5642cda4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('0f2f1513', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('fb80e348', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-btn-leading-icon" id="\${ty_escapeAttr(ty_generateId('4e2311ed', 'id'))}">\`
elements+=\`←\`
elements+=\`</span>\`
elements+=\`
        Back
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('ae959d19', 'id'))}">\`
elements+=\`
        Next
        \`
elements+=\`<span class="w-btn-append-icon" id="\${ty_escapeAttr(ty_generateId('55a1279b', 'id'))}">\`
elements+=\`→\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7141b8db', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('e0df03b1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" prepend-icon="←" id="\${ty_escapeAttr(ty_generateId('2e535799', 'id'))}">\`
elements+=\`Back\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" append-icon="→" id="\${ty_escapeAttr(ty_generateId('7e57e52f', 'id'))}">\`
elements+=\`Next\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fa144d45', 'id'))}">\`
elements+=\`Plain and elevated variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7db79a96', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9c18f4bb', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\` is a subtle action with no hover background. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('42dacaae', 'id'))}">\`
elements+=\`elevated\`
elements+=\`</code>\`
elements+=\` is a filled button with a shadow.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2216058e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('bda80cab', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-plain" id="\${ty_escapeAttr(ty_generateId('2df6a478', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-elevated" id="\${ty_escapeAttr(ty_generateId('3b9857d2', 'id'))}">\`
elements+=\`Elevated\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f39aa813', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('a40097dd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="plain" id="\${ty_escapeAttr(ty_generateId('9ff33f5c', 'id'))}">\`
elements+=\`Plain\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="elevated" id="\${ty_escapeAttr(ty_generateId('a1c78fc5', 'id'))}">\`
elements+=\`Elevated\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5926af3b', 'id'))}">\`
elements+=\`Active state\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d02bdd87', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aeb45752', 'id'))}">\`
elements+=\`active\`
elements+=\`</code>\`
elements+=\` to mark a button as selected.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d8090d5b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('3c7538af', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled active" id="\${ty_escapeAttr(ty_generateId('ad97c3b7', 'id'))}">\`
elements+=\`Active\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined active" id="\${ty_escapeAttr(ty_generateId('6828c610', 'id'))}">\`
elements+=\`Active outlined\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e2d69403', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap" id="\${ty_escapeAttr(ty_generateId('4b329f3c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn variant="filled" active="" id="\${ty_escapeAttr(ty_generateId('13bf1d99', 'id'))}">\`
elements+=\`Active\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<w-btn variant="outlined" active="" id="\${ty_escapeAttr(ty_generateId('a6be88c0', 'id'))}">\`
elements+=\`Active outlined\`
elements+=\`</w-btn>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/buttons/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
