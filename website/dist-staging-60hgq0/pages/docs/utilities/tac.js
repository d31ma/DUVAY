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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('5d2b2f05', 'id'))}">\`
elements+=\`Utilities\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9eecf6ee', 'id'))}">\`
elements+=\`Single-purpose classes for spacing, layout, sizing, and more — compose them to build UI without writing CSS. Spacing uses a numeric scale where \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c8275fd4', 'id'))}">\`
elements+=\`1\`
elements+=\`</code>\`
elements+=\` = 4px, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a4af503c', 'id'))}">\`
elements+=\`2\`
elements+=\`</code>\`
elements+=\` = 8px, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e4a13b62', 'id'))}">\`
elements+=\`4\`
elements+=\`</code>\`
elements+=\` = 16px, up to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('33dbe0df', 'id'))}">\`
elements+=\`16\`
elements+=\`</code>\`
elements+=\` = 64px.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3fe2672a', 'id'))}">\`
elements+=\`Spacing\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8b64e866', 'id'))}">\`
elements+=\`Margin (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a53be85c', 'id'))}">\`
elements+=\`m\`
elements+=\`</code>\`
elements+=\`) and padding (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7492fef6', 'id'))}">\`
elements+=\`p\`
elements+=\`</code>\`
elements+=\`) on any side: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ccd1a3c9', 'id'))}">\`
elements+=\`a\`
elements+=\`</code>\`
elements+=\` (all), \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8bc69a3e', 'id'))}">\`
elements+=\`x\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('edd43584', 'id'))}">\`
elements+=\`y\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b3b7fc5', 'id'))}">\`
elements+=\`t\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6904e3c5', 'id'))}">\`
elements+=\`r\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11793f66', 'id'))}">\`
elements+=\`b\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('23efb357', 'id'))}">\`
elements+=\`l\`
elements+=\`</code>\`
elements+=\`. For example \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('adeffb10', 'id'))}">\`
elements+=\`.w-pa-4\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2aac2516', 'id'))}">\`
elements+=\`.w-mx-auto\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77f1df5c', 'id'))}">\`
elements+=\`.w-mt-2\`
elements+=\`</code>\`
elements+=\`. Margins also accept \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('70b358e9', 'id'))}">\`
elements+=\`auto\`
elements+=\`</code>\`
elements+=\` and negatives (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a9f4f726', 'id'))}">\`
elements+=\`.w-ma-n2\`
elements+=\`</code>\`
elements+=\`).\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('bcd0781e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block" id="\${ty_escapeAttr(ty_generateId('9174f827', 'id'))}">\`
elements+=\`<span class="util-demo-box w-pa-2" id="\${ty_escapeAttr(ty_generateId('02cce799', 'id'))}">\`
elements+=\`pa-2\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block w-ml-3" id="\${ty_escapeAttr(ty_generateId('e13fe497', 'id'))}">\`
elements+=\`<span class="util-demo-box w-pa-4" id="\${ty_escapeAttr(ty_generateId('73e80099', 'id'))}">\`
elements+=\`pa-4\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block w-ml-3" id="\${ty_escapeAttr(ty_generateId('c13fe2ff', 'id'))}">\`
elements+=\`<span class="util-demo-box w-pa-6" id="\${ty_escapeAttr(ty_generateId('6c93a21f', 'id'))}">\`
elements+=\`pa-6\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('523a8db1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block" id="\${ty_escapeAttr(ty_generateId('1a410a75', 'id'))}">\`
elements+=\`<span class="util-demo-box w-ma-2" id="\${ty_escapeAttr(ty_generateId('747d4375', 'id'))}">\`
elements+=\`ma-2\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block w-ml-3" id="\${ty_escapeAttr(ty_generateId('b7eab78e', 'id'))}">\`
elements+=\`<span class="util-demo-box w-ma-4" id="\${ty_escapeAttr(ty_generateId('4edc0d5b', 'id'))}">\`
elements+=\`ma-4\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`<span class="util-demo-frame w-inline-block w-ml-3" id="\${ty_escapeAttr(ty_generateId('60187d0f', 'id'))}">\`
elements+=\`<span class="util-demo-box w-ma-6" id="\${ty_escapeAttr(ty_generateId('9ff12b07', 'id'))}">\`
elements+=\`ma-6\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('42c8d6ed', 'id'))}">\`
elements+=\`Flexbox\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ec6a2003', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b04353c0', 'id'))}">\`
elements+=\`.w-flex\`
elements+=\`</code>\`
elements+=\` plus alignment helpers — justify: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d7f6d78', 'id'))}">\`
elements+=\`.w-justify-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('11051017', 'id'))}">\`
elements+=\`.w-justify-center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('916f8614', 'id'))}">\`
elements+=\`.w-justify-between\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ecec93d', 'id'))}">\`
elements+=\`.w-justify-around\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cc3f7f07', 'id'))}">\`
elements+=\`.w-justify-evenly\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('68aa496e', 'id'))}">\`
elements+=\`.w-justify-end\`
elements+=\`</code>\`
elements+=\`; align: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('508a33ca', 'id'))}">\`
elements+=\`.w-items-start\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9cbf0a7c', 'id'))}">\`
elements+=\`.w-items-center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0493863d', 'id'))}">\`
elements+=\`.w-items-end\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b8c7f566', 'id'))}">\`
elements+=\`.w-items-stretch\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('de77cffa', 'id'))}">\`
elements+=\`.w-items-baseline\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1675592b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-flex w-justify-between w-items-center w-pa-3 w-border w-rounded-md" id="\${ty_escapeAttr(ty_generateId('52417272', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('475efeb1', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('27b08c1d', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('a6e94338', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-flex w-justify-center w-gap-2 w-pa-3 w-mt-3 w-border w-rounded-md" id="\${ty_escapeAttr(ty_generateId('ef151a16', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('1274979f', 'id'))}">\`
elements+=\`A\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('68756d69', 'id'))}">\`
elements+=\`B\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box" id="\${ty_escapeAttr(ty_generateId('a95a1353', 'id'))}">\`
elements+=\`C\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ed4d1297', 'id'))}">\`
elements+=\`Display\`
elements+=\`</h2>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('ae7ee99d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2f2bd2ea', 'id'))}">\`
elements+=\`.w-block      .w-inline       .w-inline-block
.w-flex       .w-inline-flex  .w-grid
.w-hidden     .w-contents

&lt;!-- Responsive visibility --&gt;
.w-hide-mobile   .w-show-mobile
.w-hide-tablet   .w-hide-desktop\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3624c600', 'id'))}">\`
elements+=\`Sizing\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('050abffe', 'id'))}">\`
elements+=\`Width helpers \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('107b6ddf', 'id'))}">\`
elements+=\`.w-w-25\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ba48ad4b', 'id'))}">\`
elements+=\`.w-w-50\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c948dfa', 'id'))}">\`
elements+=\`.w-w-75\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('32362caa', 'id'))}">\`
elements+=\`.w-w-100\`
elements+=\`</code>\`
elements+=\`, plus \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3bcaf65f', 'id'))}">\`
elements+=\`.w-mw-full\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d034f4c9', 'id'))}">\`
elements+=\`.w-mw-prose\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7bae3391', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-w-25" id="\${ty_escapeAttr(ty_generateId('4de90200', 'id'))}">\`
elements+=\`<div class="grid-demo-cell w-mb-2" id="\${ty_escapeAttr(ty_generateId('120d7a8a', 'id'))}">\`
elements+=\`w-25\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-w-50" id="\${ty_escapeAttr(ty_generateId('4a082109', 'id'))}">\`
elements+=\`<div class="grid-demo-cell w-mb-2" id="\${ty_escapeAttr(ty_generateId('c9adf756', 'id'))}">\`
elements+=\`w-50\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-w-75" id="\${ty_escapeAttr(ty_generateId('80fbdc59', 'id'))}">\`
elements+=\`<div class="grid-demo-cell w-mb-2" id="\${ty_escapeAttr(ty_generateId('f3d61317', 'id'))}">\`
elements+=\`w-75\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-w-100" id="\${ty_escapeAttr(ty_generateId('aaae7efd', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('b0844836', 'id'))}">\`
elements+=\`w-100\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a14b3235', 'id'))}">\`
elements+=\`Text\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('764ced98', 'id'))}">\`
elements+=\`Alignment, weight, colour, and wrapping.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f5348f3d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<p class="w-text-center w-font-semibold w-mb-2" id="\${ty_escapeAttr(ty_generateId('60de776b', 'id'))}">\`
elements+=\`Centered &amp; semibold\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`<p class="w-text-right w-text-subtle w-mb-2" id="\${ty_escapeAttr(ty_generateId('da32427c', 'id'))}">\`
elements+=\`Right-aligned, subtle\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`<p class="w-text-primary w-uppercase w-tracking-wide" id="\${ty_escapeAttr(ty_generateId('9228dda0', 'id'))}">\`
elements+=\`Primary uppercase\`
elements+=\`</p>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('09e14e27', 'id'))}">\`
elements+=\`Borders, radius &amp; elevation\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('aa2fc061', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-flex w-gap-4 w-items-center w-flex-wrap" id="\${ty_escapeAttr(ty_generateId('0c2cd2d0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box w-pa-6 w-border w-rounded-sm" id="\${ty_escapeAttr(ty_generateId('c4974759', 'id'))}">\`
elements+=\`sm\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box w-pa-6 w-border w-rounded-lg" id="\${ty_escapeAttr(ty_generateId('18c29ab9', 'id'))}">\`
elements+=\`lg\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box w-pa-6 w-rounded-circle" id="\${ty_escapeAttr(ty_generateId('46e99567', 'id'))}">\`
elements+=\`●\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="util-demo-box w-pa-6 w-rounded-lg w-shadow-md" id="\${ty_escapeAttr(ty_generateId('0ae76c98', 'id'))}">\`
elements+=\`shadow\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0aa1fea5', 'id'))}">\`
elements+=\`Text truncation\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6537ca67', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9d95c476', 'id'))}">\`
elements+=\`.w-truncate\`
elements+=\`</code>\`
elements+=\` for a single-line ellipsis, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c92378e5', 'id'))}">\`
elements+=\`.w-line-clamp-*\`
elements+=\`</code>\`
elements+=\` for multi-line clamping.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0a1398b3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<p class="w-truncate w-border w-rounded-md w-pa-3" style="max-width: 320px;" id="\${ty_escapeAttr(ty_generateId('12246cf3', 'id'))}">\`
elements+=\`
      This sentence is far too long to fit on one line, so it will be truncated with an ellipsis.
    \`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`<p class="w-line-clamp-2 w-border w-rounded-md w-pa-3 w-mt-3" style="max-width: 320px;" id="\${ty_escapeAttr(ty_generateId('84ce2962', 'id'))}">\`
elements+=\`
      This paragraph spans multiple lines but is clamped to exactly two lines. Anything beyond that point is hidden and an ellipsis is shown at the end of the second line.
    \`
elements+=\`</p>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/utilities/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
