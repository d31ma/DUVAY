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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('4f080a48', 'id'))}">\`
elements+=\`Alerts\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7ec38b59', 'id'))}">\`
elements+=\`Contextual messages for feedback, warnings, and errors.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fba149f1', 'id'))}">\`
elements+=\`Types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5d0acda8', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('379bab7f', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` for contextual color and icon. Legacy \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ea796ca2', 'id'))}">\`
elements+=\`variant="success"\`
elements+=\`</code>\`
elements+=\` style syntax still works, but new alerts should prefer \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('47e68360', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('03900d35', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('f430394a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-info" id="\${ty_escapeAttr(ty_generateId('9892d630', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('48dc0247', 'id'))}">\`
elements+=\`i\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('43b39874', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('fddc438c', 'id'))}">\`
elements+=\`Information\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('15265de6', 'id'))}">\`
elements+=\`Something you should know about.\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success" id="\${ty_escapeAttr(ty_generateId('115b3729', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('8f070aba', 'id'))}">\`
elements+=\`OK\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('28cfdb59', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('1e4e1661', 'id'))}">\`
elements+=\`Success\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('2f3ae677', 'id'))}">\`
elements+=\`Your changes have been saved.\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-warning" id="\${ty_escapeAttr(ty_generateId('9c74702d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('22ec4991', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('5fd063a0', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('aa9152bd', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('2daffa08', 'id'))}">\`
elements+=\`Please review before continuing.\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-error" id="\${ty_escapeAttr(ty_generateId('0226402b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('be00def7', 'id'))}">\`
elements+=\`x\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('250ca805', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('15466718', 'id'))}">\`
elements+=\`Error\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('b17ecd42', 'id'))}">\`
elements+=\`Something went wrong. Please try again.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fe46b9ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('228da363', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" title="Information" text="Something you should know about." id="\${ty_escapeAttr(ty_generateId('39cf41ff', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" title="Success" text="Your changes have been saved." id="\${ty_escapeAttr(ty_generateId('499e66c2', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="warning" title="Warning" text="Please review before continuing." id="\${ty_escapeAttr(ty_generateId('5090fff5', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="error" title="Error" text="Something went wrong. Please try again." id="\${ty_escapeAttr(ty_generateId('9ef1b8bb', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d937b15b', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d56b6a2e', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('140f0940', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` for visual treatment: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('65b7f67e', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d2d0237', 'id'))}">\`
elements+=\`tonal\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60d0d061', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2852b37d', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d6a90a85', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c415a52', 'id'))}">\`
elements+=\`elevated\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2cde514e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('72375604', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-flat" id="\${ty_escapeAttr(ty_generateId('ef93b241', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('8dbc7beb', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('f986a8bf', 'id'))}">\`
elements+=\`Flat\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('0e5e057f', 'id'))}">\`
elements+=\`Default filled treatment.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-tonal" id="\${ty_escapeAttr(ty_generateId('01929f5c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('9a0af774', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('1ae88b3c', 'id'))}">\`
elements+=\`Tonal\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('90ab7bee', 'id'))}">\`
elements+=\`Subtler filled treatment.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-outlined" id="\${ty_escapeAttr(ty_generateId('54c7bdae', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('d16e0043', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('ffd6bd5f', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('9b90a1ac', 'id'))}">\`
elements+=\`Transparent surface with accent border.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-elevated" id="\${ty_escapeAttr(ty_generateId('7a93f21c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('252c25bb', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('1b296d47', 'id'))}">\`
elements+=\`Elevated\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('0cc988dd', 'id'))}">\`
elements+=\`Raised with the DuVay shadow token.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6fcbb10b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('b1f92d8c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="flat" title="Flat" text="Default filled treatment." id="\${ty_escapeAttr(ty_generateId('2aabeeba', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="tonal" title="Tonal" text="Subtler filled treatment." id="\${ty_escapeAttr(ty_generateId('d0edd5b9', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="outlined" title="Outlined" text="Transparent surface with accent border." id="\${ty_escapeAttr(ty_generateId('238ed4ec', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="elevated" title="Elevated" text="Raised with the DuVay shadow token." id="\${ty_escapeAttr(ty_generateId('034d24de', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3755bda0', 'id'))}">\`
elements+=\`Density, Borders, and Icons\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7e743283', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('d273a91a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-info w-alert--border w-alert--border-start w-alert--border-color-warning" id="\${ty_escapeAttr(ty_generateId('361d776b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-border" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d866af48', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('9f1ef735', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('71b58497', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('81423c87', 'id'))}">\`
elements+=\`Border color\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('5ba9824f', 'id'))}">\`
elements+=\`Use a directional accent border.\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-warning w-alert--prominent" id="\${ty_escapeAttr(ty_generateId('7bc43b7b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('99a73f5d', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('ecbc14a9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('4d5743b0', 'id'))}">\`
elements+=\`Prominent\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('c45873c9', 'id'))}">\`
elements+=\`Larger icon and roomier vertical rhythm.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6e83f61d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('a21c83b9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" border="start" border-color="warning" icon="!" title="Border color" text="Use a directional accent border." id="\${ty_escapeAttr(ty_generateId('a0ab8bfc', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="warning" prominent="" title="Prominent" text="Larger icon and roomier vertical rhythm." id="\${ty_escapeAttr(ty_generateId('79d036a0', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="info" density="compact" icon="false" text="Compact alert without an icon." id="\${ty_escapeAttr(ty_generateId('f0627574', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('64da5ac5', 'id'))}">\`
elements+=\`Closable and Slots\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aa7a0582', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-alert w-alert-info" id="\${ty_escapeAttr(ty_generateId('c2366647', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('0c126f30', 'id'))}">\`
elements+=\`i\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('a45f470b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('9d9fb1fd', 'id'))}">\`
elements+=\`Closable\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('47fd7381', 'id'))}">\`
elements+=\`Click the close button to hide this alert.\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-alert-close" data-w-alert-dismiss="" aria-label="Close alert" id="\${ty_escapeAttr(ty_generateId('4ff12814', 'id'))}">\`
elements+=\`x\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7258f51f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('eee4644e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" title="Closable" text="Click the close button to hide this alert." closable="" id="\${ty_escapeAttr(ty_generateId('fb2bd2e7', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" closable="" close-label="Close upload alert" id="\${ty_escapeAttr(ty_generateId('2fbb167f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" id="\${ty_escapeAttr(ty_generateId('dc47ddd1', 'id'))}">\`
elements+=\`OK\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span slot="title" id="\${ty_escapeAttr(ty_generateId('1860ea71', 'id'))}">\`
elements+=\`Upload complete\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span slot="text" id="\${ty_escapeAttr(ty_generateId('7cfa0325', 'id'))}">\`
elements+=\`All files are now available.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<w-btn slot="append" variant="text" size="sm" id="\${ty_escapeAttr(ty_generateId('b431a81d', 'id'))}">\`
elements+=\`View\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-alert>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/alerts/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
