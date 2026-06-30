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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('affc03b3', 'id'))}">\`
elements+=\`Tooltips\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('08900300', 'id'))}">\`
elements+=\`Tooltips identify or describe an activator on hover, focus, click, or controlled state.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9a65debb', 'id'))}">\`
elements+=\`Usage\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6e8f43e0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('6c7b229b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined w-tooltip" data-w-tooltip="Archive this project" id="\${ty_escapeAttr(ty_generateId('26531e4c', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-ghost w-tooltip" data-w-tooltip="Pin to sidebar" data-w-tooltip-position="bottom" id="\${ty_escapeAttr(ty_generateId('63649882', 'id'))}">\`
elements+=\`Pin\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bf45067d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1d1c7640', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Archive this project" id="\${ty_escapeAttr(ty_generateId('8f0dcdf0', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('2b5923f0', 'id'))}">\`
elements+=\`Archive\`
elements+=\`</w-btn>\`
elements+=\`</w-tooltip>\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Pin to sidebar" location="bottom" id="\${ty_escapeAttr(ty_generateId('2b87f3f9', 'id'))}">\`
elements+=\`<w-btn variant="ghost" id="\${ty_escapeAttr(ty_generateId('2beccf67', 'id'))}">\`
elements+=\`Pin\`
elements+=\`</w-btn>\`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('212b0985', 'id'))}">\`
elements+=\`Location\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('2c15d696', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('3c9d6cd6', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-tooltip" data-w-tooltip="Top tooltip" data-w-tooltip-position="top" id="\${ty_escapeAttr(ty_generateId('659b2ab6', 'id'))}">\`
elements+=\`Top\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-tooltip" data-w-tooltip="Right tooltip" data-w-tooltip-position="right" id="\${ty_escapeAttr(ty_generateId('03d3ce06', 'id'))}">\`
elements+=\`Right\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-tooltip" data-w-tooltip="Bottom tooltip" data-w-tooltip-position="bottom" id="\${ty_escapeAttr(ty_generateId('9898c00d', 'id'))}">\`
elements+=\`Bottom\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-tooltip" data-w-tooltip="Left tooltip" data-w-tooltip-position="left" id="\${ty_escapeAttr(ty_generateId('1a6b94f6', 'id'))}">\`
elements+=\`Left\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f5122a95', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-4 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('9c662b63', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Top tooltip" location="top" id="\${ty_escapeAttr(ty_generateId('d9a8bdf0', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('4d0d14a6', 'id'))}">\`
elements+=\`Top\`
elements+=\`</span>\`
elements+=\`</w-tooltip>\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Right tooltip" location="right" id="\${ty_escapeAttr(ty_generateId('b1b0c01e', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('5e1b0e53', 'id'))}">\`
elements+=\`Right\`
elements+=\`</span>\`
elements+=\`</w-tooltip>\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Bottom tooltip" location="bottom" id="\${ty_escapeAttr(ty_generateId('54d5ec5e', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('66b28bd5', 'id'))}">\`
elements+=\`Bottom\`
elements+=\`</span>\`
elements+=\`</w-tooltip>\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Left tooltip" location="left" id="\${ty_escapeAttr(ty_generateId('fe100f3b', 'id'))}">\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('dcf408e9', 'id'))}">\`
elements+=\`Left\`
elements+=\`</span>\`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('58911571', 'id'))}">\`
elements+=\`Color\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e3133795', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('39d37911', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-filled w-tooltip" style="--w-tooltip-bg: var(--w-primary); --w-tooltip-fg: var(--w-on-primary);" data-w-tooltip="Primary tooltip" id="\${ty_escapeAttr(ty_generateId('06940048', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined w-tooltip" style="--w-tooltip-bg: var(--w-success); --w-tooltip-fg: var(--w-on-success);" data-w-tooltip="Success tooltip" id="\${ty_escapeAttr(ty_generateId('78facc79', 'id'))}">\`
elements+=\`Success\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f392fdee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('8f56bba5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Primary tooltip" color="primary" id="\${ty_escapeAttr(ty_generateId('bff4402d', 'id'))}">\`
elements+=\`<w-btn variant="filled" id="\${ty_escapeAttr(ty_generateId('31ec895b', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</w-btn>\`
elements+=\`</w-tooltip>\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Success tooltip" color="success" id="\${ty_escapeAttr(ty_generateId('81554328', 'id'))}">\`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('14f174dd', 'id'))}">\`
elements+=\`Success\`
elements+=\`</w-btn>\`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('4b88e22f', 'id'))}">\`
elements+=\`Open on Click\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f308cad1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('868a9cdc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined w-tooltip" data-w-tooltip="Click-triggered tooltip" id="\${ty_escapeAttr(ty_generateId('2c53dcf4', 'id'))}">\`
elements+=\`Click target\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('739582a1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('bd033019', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Click-triggered tooltip" open-on-click="" open-on-hover="false" id="\${ty_escapeAttr(ty_generateId('3d400515', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="outlined" id="\${ty_escapeAttr(ty_generateId('01051d6c', 'id'))}">\`
elements+=\`Click target\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e01f965a', 'id'))}">\`
elements+=\`Visibility\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1f5ee472', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('e8f9198f', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-tooltip" data-w-tooltip="Always shown through component state" id="\${ty_escapeAttr(ty_generateId('3ff8aaa0', 'id'))}">\`
elements+=\`Controlled state\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('bd2bf55c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center w-justify-center" id="\${ty_escapeAttr(ty_generateId('28ef1a4c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Always shown through component state" location="bottom" open="" id="\${ty_escapeAttr(ty_generateId('3cb432fd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-chip" id="\${ty_escapeAttr(ty_generateId('b101cc01', 'id'))}">\`
elements+=\`Controlled state\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d0aa83f0', 'id'))}">\`
elements+=\`Interactive\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('01e29b98', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1e2819fc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined w-tooltip" data-w-tooltip="Copyable helper text" id="\${ty_escapeAttr(ty_generateId('346d25f1', 'id'))}">\`
elements+=\`Hover details\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f2eb3338', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('54d27362', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip interactive="" open-on-click="" open-on-hover="false" location="bottom" id="\${ty_escapeAttr(ty_generateId('434ce37c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn slot="activator" variant="outlined" id="\${ty_escapeAttr(ty_generateId('f5ef36e9', 'id'))}">\`
elements+=\`Hover details\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<span slot="content" id="\${ty_escapeAttr(ty_generateId('88ce6a09', 'id'))}">\`
elements+=\`Copyable helper text\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-tooltip>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('84683c30', 'id'))}">\`
elements+=\`Tooltip at Cursor\`
elements+=\`</h2>\`
elements+=\`<demo-compare class="docs-tooltip-demo docs-tooltip-demo--cursor">\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a5db538c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('fdb5485d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-ghost w-tooltip" data-w-tooltip="Cursor placement is component-only" id="\${ty_escapeAttr(ty_generateId('b88d43a3', 'id'))}">\`
elements+=\`Cursor target\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('be2d709e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('b97d9d39', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-tooltip text="Appears near the click position" open-on-click="" open-on-hover="false" target="cursor" id="\${ty_escapeAttr(ty_generateId('7bfa65c8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="ghost" id="\${ty_escapeAttr(ty_generateId('0ca763c9', 'id'))}">\`
elements+=\`Cursor target\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</w-tooltip>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/tooltips/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
