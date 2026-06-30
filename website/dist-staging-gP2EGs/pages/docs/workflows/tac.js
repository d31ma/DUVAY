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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('e8008b85', 'id'))}">\`
elements+=\`Workflows\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4ed47149', 'id'))}">\`
elements+=\`Steppers and timelines for process-heavy interfaces.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5ba2a76b', 'id'))}">\`
elements+=\`Stepper\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dce3d39b', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('654132bd', 'id'))}">\`
elements+=\`w-stepper-item\`
elements+=\`</code>\`
elements+=\` is an alias for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('61253df1', 'id'))}">\`
elements+=\`w-step\`
elements+=\`</code>\`
elements+=\`. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('77f94388', 'id'))}">\`
elements+=\`w-stepper-window\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38af63ea', 'id'))}">\`
elements+=\`w-stepper-window-item\`
elements+=\`</code>\`
elements+=\` as Vuetify-named window aliases when panels are needed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ab1059c6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper" id="\${ty_escapeAttr(ty_generateId('34045339', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-step done" id="\${ty_escapeAttr(ty_generateId('cc56a237', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('c38aedef', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('a407ddab', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('e219a2eb', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('8fb223f7', 'id'))}">\`
elements+=\`Account\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('2272cc71', 'id'))}">\`
elements+=\`Verified\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step active" id="\${ty_escapeAttr(ty_generateId('927cbf05', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('fa95c91f', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('08662945', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('582f984e', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('56a0f039', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('745926bf', 'id'))}">\`
elements+=\`In progress\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('818f05ab', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('489b1bcd', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('339e4451', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('a9d3648b', 'id'))}">\`
elements+=\`Confirm\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('fe0957d3', 'id'))}">\`
elements+=\`Ready next\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('7003a282', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper id="\${ty_escapeAttr(ty_generateId('e8811375', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-step value="1" label="Account" caption="Verified" state="done" id="\${ty_escapeAttr(ty_generateId('8e199447', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="2" label="Profile" caption="In progress" state="active" id="\${ty_escapeAttr(ty_generateId('8ab879de', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="3" label="Confirm" caption="Ready next" id="\${ty_escapeAttr(ty_generateId('1503ea51', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ae9aacd0', 'id'))}">\`
elements+=\`Vertical Stepper\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('30ae49b0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper w-stepper--vertical" id="\${ty_escapeAttr(ty_generateId('6165dfa0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-step done" id="\${ty_escapeAttr(ty_generateId('ccd6bf0e', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('4363a7d9', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('f2681954', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('6e15cf19', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('474f3056', 'id'))}">\`
elements+=\`Create order\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('4f2a5e6e', 'id'))}">\`
elements+=\`Cart and customer details captured.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step active" id="\${ty_escapeAttr(ty_generateId('cc3158e9', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('5ed6e5bb', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('cd360d25', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('10969745', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('6f3eadf8', 'id'))}">\`
elements+=\`Review payment\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('80fc86f5', 'id'))}">\`
elements+=\`Waiting on authorization.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('5d982183', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('3576b828', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('ae7c75f7', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('fd6c7830', 'id'))}">\`
elements+=\`Ship\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('0d6ca4b8', 'id'))}">\`
elements+=\`Fulfillment starts after confirmation.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('07538eb3', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper vertical="" id="\${ty_escapeAttr(ty_generateId('b32ff1af', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-step value="1" label="Create order" caption="Cart and customer details captured." state="done" id="\${ty_escapeAttr(ty_generateId('f163b367', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="2" label="Review payment" caption="Waiting on authorization." state="active" id="\${ty_escapeAttr(ty_generateId('5571c31d', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="3" label="Ship" caption="Fulfillment starts after confirmation." id="\${ty_escapeAttr(ty_generateId('aec4d299', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
    \`
elements+=\`</w-stepper>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('85133792', 'id'))}">\`
elements+=\`Vertical stepper\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('50e80618', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2cadc256', 'id'))}">\`
elements+=\`w-stepper-vertical\`
elements+=\`</code>\`
elements+=\` renders the same vertical layout as \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('90b96a7b', 'id'))}">\`
elements+=\`w-stepper vertical\`
elements+=\`</code>\`
elements+=\` without needing the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1dd1048c', 'id'))}">\`
elements+=\`vertical\`
elements+=\`</code>\`
elements+=\` attribute.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c0fe2423', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stepper w-stepper--vertical" id="\${ty_escapeAttr(ty_generateId('e50be976', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-step done" id="\${ty_escapeAttr(ty_generateId('318d8c80', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('1cada25a', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('7453fc10', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('4e8aed84', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('5d510cd2', 'id'))}">\`
elements+=\`Create order\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('74e468f9', 'id'))}">\`
elements+=\`Cart and customer details captured.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step active" id="\${ty_escapeAttr(ty_generateId('982a30dc', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('a5997109', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`<div class="w-step-connector" id="\${ty_escapeAttr(ty_generateId('470cbf88', 'id'))}">\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('2487a4ad', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('f844787d', 'id'))}">\`
elements+=\`Review payment\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('f965a22a', 'id'))}">\`
elements+=\`Waiting on authorization.\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-step" id="\${ty_escapeAttr(ty_generateId('13e0d22f', 'id'))}">\`
elements+=\`<div class="w-step-indicator" id="\${ty_escapeAttr(ty_generateId('18cc1e18', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`<div class="w-step-content" id="\${ty_escapeAttr(ty_generateId('8ec7eaec', 'id'))}">\`
elements+=\`<div class="w-step-label" id="\${ty_escapeAttr(ty_generateId('e97db9a7', 'id'))}">\`
elements+=\`Ship\`
elements+=\`</div>\`
elements+=\`<div class="w-step-caption" id="\${ty_escapeAttr(ty_generateId('d6909cb9', 'id'))}">\`
elements+=\`Fulfillment starts after confirmation.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('60d85da7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-stepper-vertical id="\${ty_escapeAttr(ty_generateId('d94f8c89', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-step value="1" label="Create order" caption="Cart and customer details captured." state="done" id="\${ty_escapeAttr(ty_generateId('db10ad7f', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="2" label="Review payment" caption="Waiting on authorization." state="active" id="\${ty_escapeAttr(ty_generateId('eae48fad', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
      \`
elements+=\`<w-step value="3" label="Ship" caption="Fulfillment starts after confirmation." id="\${ty_escapeAttr(ty_generateId('26796b69', 'id'))}">\`
elements+=\`</w-step>\`
elements+=\`
    \`
elements+=\`</w-stepper-vertical>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0723a1be', 'id'))}">\`
elements+=\`Timeline\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f49b4f78', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-timeline" id="\${ty_escapeAttr(ty_generateId('d1d3f6d3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-timeline-item" id="\${ty_escapeAttr(ty_generateId('88ead477', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-dot w-timeline-dot--filled" id="\${ty_escapeAttr(ty_generateId('a8513c55', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-time" id="\${ty_escapeAttr(ty_generateId('d2652c6c', 'id'))}">\`
elements+=\`09:00\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-title" id="\${ty_escapeAttr(ty_generateId('6e30a4f1', 'id'))}">\`
elements+=\`Kickoff\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-body" id="\${ty_escapeAttr(ty_generateId('9aa4b549', 'id'))}">\`
elements+=\`Reviewed scope, owners, and release dependencies.\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-timeline-item" id="\${ty_escapeAttr(ty_generateId('877c5ac2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-dot w-timeline-dot--outlined" id="\${ty_escapeAttr(ty_generateId('2a3f9fb8', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-time" id="\${ty_escapeAttr(ty_generateId('0e7430f0', 'id'))}">\`
elements+=\`11:30\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-title" id="\${ty_escapeAttr(ty_generateId('f401146a', 'id'))}">\`
elements+=\`Design pass\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-body" id="\${ty_escapeAttr(ty_generateId('5c979e56', 'id'))}">\`
elements+=\`Aligned components with the docs surface and interaction states.\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-timeline-item" id="\${ty_escapeAttr(ty_generateId('93513b10', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-dot w-timeline-dot--filled" id="\${ty_escapeAttr(ty_generateId('74f6bd62', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-time" id="\${ty_escapeAttr(ty_generateId('8a4dd949', 'id'))}">\`
elements+=\`14:00\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-title" id="\${ty_escapeAttr(ty_generateId('34d0d837', 'id'))}">\`
elements+=\`Validation\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-timeline-body" id="\${ty_escapeAttr(ty_generateId('4f53da7b', 'id'))}">\`
elements+=\`Checked keyboard flow and responsive spacing.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('521d89ea', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-timeline id="\${ty_escapeAttr(ty_generateId('7ed7de2c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-timeline-item time="09:00" title="Kickoff" id="\${ty_escapeAttr(ty_generateId('e3e2f641', 'id'))}">\`
elements+=\`Reviewed scope, owners, and release dependencies.\`
elements+=\`</w-timeline-item>\`
elements+=\`
      \`
elements+=\`<w-timeline-item time="11:30" title="Design pass" dot="outlined" id="\${ty_escapeAttr(ty_generateId('1b131411', 'id'))}">\`
elements+=\`Aligned components with the docs surface and interaction states.\`
elements+=\`</w-timeline-item>\`
elements+=\`
      \`
elements+=\`<w-timeline-item time="14:00" title="Validation" id="\${ty_escapeAttr(ty_generateId('08c7a2d3', 'id'))}">\`
elements+=\`Checked keyboard flow and responsive spacing.\`
elements+=\`</w-timeline-item>\`
elements+=\`
    \`
elements+=\`</w-timeline>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/workflows/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
