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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('8e90a3bd', 'id'))}">\`
elements+=\`Alerts\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1ae3d270', 'id'))}">\`
elements+=\`Contextual messages for feedback, warnings, and errors.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('79f81d2f', 'id'))}">\`
elements+=\`Types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('51b85df4', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c01984e4', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\` for contextual color and icon. Legacy \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e804fc5a', 'id'))}">\`
elements+=\`variant="success"\`
elements+=\`</code>\`
elements+=\` style syntax still works, but new alerts should prefer \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff81983a', 'id'))}">\`
elements+=\`type\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('11370d11', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('38f339bb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-info" id="\${ty_escapeAttr(ty_generateId('f4021387', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('480f4b3b', 'id'))}">\`
elements+=\`i\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('22061520', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('b51cfcd6', 'id'))}">\`
elements+=\`Information\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('f7331a62', 'id'))}">\`
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
elements+=\`<div class="w-alert w-alert-success" id="\${ty_escapeAttr(ty_generateId('fd9ea99b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('28657dfa', 'id'))}">\`
elements+=\`OK\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('9ad6c6d4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('4ca8ae8b', 'id'))}">\`
elements+=\`Success\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('de41cd4b', 'id'))}">\`
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
elements+=\`<div class="w-alert w-alert-warning" id="\${ty_escapeAttr(ty_generateId('49c307da', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('8d70959b', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('9840b3f3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('0a661be1', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('f5715872', 'id'))}">\`
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
elements+=\`<div class="w-alert w-alert-error" id="\${ty_escapeAttr(ty_generateId('35e7a64a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('ab138eaf', 'id'))}">\`
elements+=\`x\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('d27ece05', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('60732313', 'id'))}">\`
elements+=\`Error\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('40e4c42b', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('57db4b48', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('6e751b16', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" title="Information" text="Something you should know about." id="\${ty_escapeAttr(ty_generateId('0ce42a41', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" title="Success" text="Your changes have been saved." id="\${ty_escapeAttr(ty_generateId('3bd412b9', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="warning" title="Warning" text="Please review before continuing." id="\${ty_escapeAttr(ty_generateId('9172e487', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="error" title="Error" text="Something went wrong. Please try again." id="\${ty_escapeAttr(ty_generateId('24cc9a7b', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b58c928c', 'id'))}">\`
elements+=\`Variants\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f59489bc', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9b3f5a10', 'id'))}">\`
elements+=\`variant\`
elements+=\`</code>\`
elements+=\` for visual treatment: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec6cde54', 'id'))}">\`
elements+=\`flat\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ff96678e', 'id'))}">\`
elements+=\`tonal\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6728c9c2', 'id'))}">\`
elements+=\`outlined\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('83097913', 'id'))}">\`
elements+=\`text\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d092fad', 'id'))}">\`
elements+=\`plain\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('495a489c', 'id'))}">\`
elements+=\`elevated\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8e67ef00', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('54864e1e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-flat" id="\${ty_escapeAttr(ty_generateId('b429c23f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('c3c66c48', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('d4e27e4d', 'id'))}">\`
elements+=\`Flat\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('e6f171bf', 'id'))}">\`
elements+=\`Default filled treatment.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-tonal" id="\${ty_escapeAttr(ty_generateId('dc0f6123', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('54b0ad47', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('4e3a6238', 'id'))}">\`
elements+=\`Tonal\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('762ad8f3', 'id'))}">\`
elements+=\`Subtler filled treatment.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-outlined" id="\${ty_escapeAttr(ty_generateId('47d02d87', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('6fa37d6c', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('eb93a470', 'id'))}">\`
elements+=\`Outlined\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('0caa1f09', 'id'))}">\`
elements+=\`Transparent surface with accent border.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-success w-alert--variant-elevated" id="\${ty_escapeAttr(ty_generateId('713e9ca0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('64982c75', 'id'))}">\`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('c728da71', 'id'))}">\`
elements+=\`Elevated\`
elements+=\`</div>\`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('52669bc2', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5d521b3a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('f7dcc31d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="flat" title="Flat" text="Default filled treatment." id="\${ty_escapeAttr(ty_generateId('d8795327', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="tonal" title="Tonal" text="Subtler filled treatment." id="\${ty_escapeAttr(ty_generateId('0a485774', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="outlined" title="Outlined" text="Transparent surface with accent border." id="\${ty_escapeAttr(ty_generateId('092e7369', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" variant="elevated" title="Elevated" text="Raised with the DuVay shadow token." id="\${ty_escapeAttr(ty_generateId('0b4ab75f', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('bcd3d2a8', 'id'))}">\`
elements+=\`Density, Borders, and Icons\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bf33b6e2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('b00de06b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert w-alert-info w-alert--border w-alert--border-start w-alert--border-color-warning" id="\${ty_escapeAttr(ty_generateId('91513f39', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-border" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3bf99edb', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('b5447efe', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('8d55e1e4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('1b6158c8', 'id'))}">\`
elements+=\`Border color\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('a476702a', 'id'))}">\`
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
elements+=\`<div class="w-alert w-alert-warning w-alert--prominent" id="\${ty_escapeAttr(ty_generateId('321a4f23', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('ce98b082', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('5371c0ae', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('c95f2990', 'id'))}">\`
elements+=\`Prominent\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('14c54b39', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a484cb91', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('68e43c74', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" border="start" border-color="warning" icon="!" title="Border color" text="Use a directional accent border." id="\${ty_escapeAttr(ty_generateId('c75d7590', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="warning" prominent="" title="Prominent" text="Larger icon and roomier vertical rhythm." id="\${ty_escapeAttr(ty_generateId('946cd225', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="info" density="compact" icon="false" text="Compact alert without an icon." id="\${ty_escapeAttr(ty_generateId('2f0637ad', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('97db3843', 'id'))}">\`
elements+=\`Closable and Slots\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('794f8f90', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-alert w-alert-info" id="\${ty_escapeAttr(ty_generateId('9ac14cca', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-alert-prepend w-alert-icon" id="\${ty_escapeAttr(ty_generateId('71b5e026', 'id'))}">\`
elements+=\`i\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-alert-body" id="\${ty_escapeAttr(ty_generateId('a4cf6644', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-alert-title" id="\${ty_escapeAttr(ty_generateId('0b6b62c8', 'id'))}">\`
elements+=\`Closable\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-alert-text" id="\${ty_escapeAttr(ty_generateId('ec65f0ed', 'id'))}">\`
elements+=\`Click the close button to hide this alert.\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-alert-close" data-w-alert-dismiss="" aria-label="Close alert" id="\${ty_escapeAttr(ty_generateId('2528dfec', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3042b5c4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-col w-gap-3" id="\${ty_escapeAttr(ty_generateId('5a2dbd59', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-alert type="info" title="Closable" text="Click the close button to hide this alert." closable="" id="\${ty_escapeAttr(ty_generateId('08cc1ef4', 'id'))}">\`
elements+=\`</w-alert>\`
elements+=\`
      \`
elements+=\`<w-alert type="success" closable="" close-label="Close upload alert" id="\${ty_escapeAttr(ty_generateId('55e90543', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" id="\${ty_escapeAttr(ty_generateId('cdb86cb2', 'id'))}">\`
elements+=\`OK\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span slot="title" id="\${ty_escapeAttr(ty_generateId('bf71ba96', 'id'))}">\`
elements+=\`Upload complete\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span slot="text" id="\${ty_escapeAttr(ty_generateId('06e998fb', 'id'))}">\`
elements+=\`All files are now available.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<w-btn slot="append" variant="text" size="sm" id="\${ty_escapeAttr(ty_generateId('37cc0e0c', 'id'))}">\`
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
