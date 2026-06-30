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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('7be4fe64', 'id'))}">\`
elements+=\`Steppers\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8ff1534e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('21582298', 'id'))}">\`
elements+=\`w-stepper\`
elements+=\`</code>\`
elements+=\` guides a user through an ordered sequence of steps. It tracks an active step (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3463b005', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`), marks earlier steps complete, optionally drives a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('465893df', 'id'))}">\`
elements+=\`w-stepper-window\`
elements+=\`</code>\`
elements+=\`'s panels, and wires \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('59013b96', 'id'))}">\`
elements+=\`w-stepper-actions\`
elements+=\`</code>\`
elements+=\` (Back / Next).\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('dbe3eae7', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('81877533', 'id'))}">\`
elements+=\`Headers go in a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c98fe2fa', 'id'))}">\`
elements+=\`w-stepper-header\`
elements+=\`</code>\`
elements+=\`, panels in a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('13e23b30', 'id'))}">\`
elements+=\`w-stepper-window\`
elements+=\`</code>\`
elements+=\`, and navigation in \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdc084c3', 'id'))}">\`
elements+=\`w-stepper-actions\`
elements+=\`</code>\`
elements+=\`. The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a259f27', 'id'))}">\`
elements+=\`Next\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6a090167', 'id'))}">\`
elements+=\`Back\`
elements+=\`</code>\`
elements+=\` buttons move the active step.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7e26071d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper" id="\${ty_escapeAttr(ty_generateId('0befdefb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stepper-header" id="\${ty_escapeAttr(ty_generateId('20ae0af0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-step active" id="\${ty_escapeAttr(ty_generateId('30e8792c', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('3b7ec5c4', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('8d448b63', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('344d12c9', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('a1ac03ac', 'id'))}">\`
elements+=\`Account\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('da4f2905', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('9dd90497', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('e86342ba', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('21f88929', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('06684022', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('f5d3ddaf', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('20a19859', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('0966bc27', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('2f9689c7', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('fb68ca52', 'id'))}">\`
elements+=\`Confirm\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('180e4079', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper value="1" id="\${ty_escapeAttr(ty_generateId('930ca518', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-stepper-header id="\${ty_escapeAttr(ty_generateId('0aa5e1cf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-step value="1" label="Account" id="\${ty_escapeAttr(ty_generateId('7115027c', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="2" label="Billing" id="\${ty_escapeAttr(ty_generateId('740b203b', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="3" label="Confirm" id="\${ty_escapeAttr(ty_generateId('717f7946', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`</w-stepper-header>\`
elements+=\`
      \`
elements+=\`<w-stepper-window id="\${ty_escapeAttr(ty_generateId('b9598842', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="1" id="\${ty_escapeAttr(ty_generateId('b59a7955', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('e3ba6ed8', 'id'))}">\`
elements+=\`Create your account.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="2" id="\${ty_escapeAttr(ty_generateId('d2f9549f', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('d369f201', 'id'))}">\`
elements+=\`Enter billing details.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="3" id="\${ty_escapeAttr(ty_generateId('af837a57', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('9edf7961', 'id'))}">\`
elements+=\`Review and confirm.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
      \`
elements+=\`</w-stepper-window>\`
elements+=\`
      \`
elements+=\`<w-stepper-actions id="\${ty_escapeAttr(ty_generateId('b171ce5c', 'id'))}">\`
elements+=\`</w-stepper-actions>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cea4c6c3', 'id'))}">\`
elements+=\`Editable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('92d2b9e6', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8d9c06d4', 'id'))}">\`
elements+=\`editable\`
elements+=\`</code>\`
elements+=\` so any step header can be clicked to jump to it; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b018be45', 'id'))}">\`
elements+=\`non-linear\`
elements+=\`</code>\`
elements+=\` allows visiting steps in any order.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9c150555', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper w-stepper--clickable" id="\${ty_escapeAttr(ty_generateId('86789d01', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stepper-header" id="\${ty_escapeAttr(ty_generateId('78246dd8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-step done editable" id="\${ty_escapeAttr(ty_generateId('a9520301', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('22ced809', 'id'))}">\`
elements+=\`✓\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('19b6cf9d', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('0354e711', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('7fd8e315', 'id'))}">\`
elements+=\`Cart\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step active editable" id="\${ty_escapeAttr(ty_generateId('a8745b3a', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('69874200', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('547823fc', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('df3c79f2', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('98d95b4f', 'id'))}">\`
elements+=\`Shipping\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step editable" id="\${ty_escapeAttr(ty_generateId('abb5a2e0', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('77b0c8c6', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('545caa3c', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('c4d7fbc5', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('729c0f51', 'id'))}">\`
elements+=\`Payment\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ccae59fc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper editable="" value="2" id="\${ty_escapeAttr(ty_generateId('9eb74fbb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-stepper-header id="\${ty_escapeAttr(ty_generateId('a2e2ea94', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-step value="1" label="Cart" id="\${ty_escapeAttr(ty_generateId('4d7abb5d', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="2" label="Shipping" id="\${ty_escapeAttr(ty_generateId('6bcab281', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="3" label="Payment" id="\${ty_escapeAttr(ty_generateId('4f2fc688', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`</w-stepper-header>\`
elements+=\`
      \`
elements+=\`<w-stepper-window id="\${ty_escapeAttr(ty_generateId('44e61866', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="1" id="\${ty_escapeAttr(ty_generateId('94c07798', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('8a118e41', 'id'))}">\`
elements+=\`Your cart.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="2" id="\${ty_escapeAttr(ty_generateId('89ada237', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('bd3e7f20', 'id'))}">\`
elements+=\`Shipping address.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
        \`
elements+=\`<w-stepper-window-item value="3" id="\${ty_escapeAttr(ty_generateId('dd816a94', 'id'))}">\`
elements+=\`<div class="w-pa-4" id="\${ty_escapeAttr(ty_generateId('2964b349', 'id'))}">\`
elements+=\`Payment method.\`
elements+=\`</div>\`
elements+=\`</w-stepper-window-item>\`
elements+=\`
      \`
elements+=\`</w-stepper-window>\`
elements+=\`
      \`
elements+=\`<w-stepper-actions id="\${ty_escapeAttr(ty_generateId('4001eea0', 'id'))}">\`
elements+=\`</w-stepper-actions>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1eede32d', 'id'))}">\`
elements+=\`Complete &amp; error states\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c5102142', 'id'))}">\`
elements+=\`Steps before the active one are marked complete (✓) automatically. Mark a step with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('14eabecd', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\` to flag a problem.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9bc150b0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper" id="\${ty_escapeAttr(ty_generateId('85991434', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stepper-header" id="\${ty_escapeAttr(ty_generateId('0a155a98', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-step done" id="\${ty_escapeAttr(ty_generateId('62633d41', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('de467434', 'id'))}">\`
elements+=\`✓\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('892d6e22', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('a8bd7af3', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('370cc112', 'id'))}">\`
elements+=\`Details\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step error" id="\${ty_escapeAttr(ty_generateId('d1c70717', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('9dca128c', 'id'))}">\`
elements+=\`!\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('af594550', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('150a5363', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('82ea20cc', 'id'))}">\`
elements+=\`Payment\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('2f0dc403', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('e9bf759b', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('5d784bad', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('1369cb2e', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('1c72ffb0', 'id'))}">\`
elements+=\`Done\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('86eae626', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper value="2" id="\${ty_escapeAttr(ty_generateId('a5ddd60e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-stepper-header id="\${ty_escapeAttr(ty_generateId('e80eda38', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-step value="1" label="Details" id="\${ty_escapeAttr(ty_generateId('194b205e', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="2" label="Payment" error="" id="\${ty_escapeAttr(ty_generateId('5c0c6aa7', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="3" label="Done" id="\${ty_escapeAttr(ty_generateId('87278019', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`</w-stepper-header>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d1fd1335', 'id'))}">\`
elements+=\`Alt labels &amp; captions\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2ed8915f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fe0b9969', 'id'))}">\`
elements+=\`alt-labels\`
elements+=\`</code>\`
elements+=\` spaces the labels beneath the indicators; \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2ee03abe', 'id'))}">\`
elements+=\`caption\`
elements+=\`</code>\`
elements+=\` adds secondary helper text.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f2edadd5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper w-stepper--alt-labels" id="\${ty_escapeAttr(ty_generateId('5276499a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-stepper-header" id="\${ty_escapeAttr(ty_generateId('80ebfd8c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-step active" id="\${ty_escapeAttr(ty_generateId('d1c42b03', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('42ac8d8c', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('61dda61b', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('dc4b2fae', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('ef333194', 'id'))}">\`
elements+=\`Plan\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('57c4257c', 'id'))}">\`
elements+=\`Choose a tier\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('6098d5f7', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('78bd513f', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('9f456121', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('0c9a49f9', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('4a67a4eb', 'id'))}">\`
elements+=\`Team\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('37d18664', 'id'))}">\`
elements+=\`Invite people\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d2bc6dad', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper alt-labels="" value="1" id="\${ty_escapeAttr(ty_generateId('e3e8dd8b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-stepper-header id="\${ty_escapeAttr(ty_generateId('c9337e02', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-step value="1" label="Plan" caption="Choose a tier" id="\${ty_escapeAttr(ty_generateId('cdf0b2f7', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
        \`
elements+=\`<w-step value="2" label="Team" caption="Invite people" id="\${ty_escapeAttr(ty_generateId('c67a0704', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`</w-stepper-header>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/steppers/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
