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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('8565e004', 'id'))}">\`
elements+=\`Radio buttons\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('93975b00', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9ec6d332', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\` wraps a set of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f26445e8', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` options for a single choice. The group manages the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c5eeb9ae', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`, selected \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e899fca1', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`, and keyboard navigation. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3636311a', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\` to lay the options out in a row.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3a48964c', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('39942366', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-selection-control-group w-radio-group" role="radiogroup" aria-label="Delivery speed" id="\${ty_escapeAttr(ty_generateId('cc3b26cf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-label" id="\${ty_escapeAttr(ty_generateId('fa5e035b', 'id'))}">\`
elements+=\`Delivery speed\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('1e669dc2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="standard" checked="" id="\${ty_escapeAttr(ty_generateId('8bafc654', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('2a8de5df', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('82f561a1', 'id'))}">\`
elements+=\`Standard\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('11ed02a1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="express" id="\${ty_escapeAttr(ty_generateId('1d6735f7', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('036eb9f1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('8eb88658', 'id'))}">\`
elements+=\`Express\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-radio" id="\${ty_escapeAttr(ty_generateId('54fb23a8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="radio" name="delivery-css" value="scheduled" id="\${ty_escapeAttr(ty_generateId('1f9d49ab', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('1c1467e9', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('ed2b5ca7', 'id'))}">\`
elements+=\`Scheduled\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f2b7e356', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Delivery speed" name="delivery-wc" value="standard" id="\${ty_escapeAttr(ty_generateId('8ee13ab2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="standard" label="Standard" id="\${ty_escapeAttr(ty_generateId('c37d0d27', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="express" label="Express" id="\${ty_escapeAttr(ty_generateId('2df6dbb9', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="scheduled" label="Scheduled" id="\${ty_escapeAttr(ty_generateId('23a0256a', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('42ff162b', 'id'))}">\`
elements+=\`Inline\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b57318e0', 'id'))}">\`
elements+=\`The \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c583a3c4', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\` attribute arranges the options horizontally, wrapping as needed.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('02516592', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Contact method" name="contact-wc" value="email" inline="" id="\${ty_escapeAttr(ty_generateId('d2d9e4b4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="email" label="Email" id="\${ty_escapeAttr(ty_generateId('97ba31a6', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="phone" label="Phone" id="\${ty_escapeAttr(ty_generateId('a9e6c479', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="sms" label="SMS" id="\${ty_escapeAttr(ty_generateId('fdb571d6', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0bab9927', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('1c302948', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f02edcf6', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` on a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b7ac97a', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` to change its accent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a5cde91b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Priority" name="priority-wc" value="low" inline="" id="\${ty_escapeAttr(ty_generateId('95cad872', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="low" label="Low" color="success" id="\${ty_escapeAttr(ty_generateId('9d155e7e', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="medium" label="Medium" color="warning" id="\${ty_escapeAttr(ty_generateId('a57cb382', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="high" label="High" color="error" id="\${ty_escapeAttr(ty_generateId('21c672ec', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('afc9fbc9', 'id'))}">\`
elements+=\`Disabled\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f2d8adbf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-radio-group label="Plan" name="plan-wc" value="free" disabled="" id="\${ty_escapeAttr(ty_generateId('ecb4fbf9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-radio value="free" label="Free" id="\${ty_escapeAttr(ty_generateId('8777a402', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
      \`
elements+=\`<w-radio value="pro" label="Pro" id="\${ty_escapeAttr(ty_generateId('3eef1cb1', 'id'))}">\`
elements+=\`</w-radio>\`
elements+=\`
    \`
elements+=\`</w-radio-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('d35afb20', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('865aeedd', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\` attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('edafe79d', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('1af34cf0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e919ae92', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('413d350c', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('2eca2991', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f74cc280', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('9ccc309d', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('9a271086', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('26b8194f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d18bbf07', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d0ccfb16', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('5d0a7374', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1d1f9c3b', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('163d570a', 'id'))}">\`
elements+=\`Selected option value.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7f9e52db', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f719fe51', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('218cdead', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3283b2b9', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fbd41edb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0199819f', 'id'))}">\`
elements+=\`w-radio-group\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d88bc57b', 'id'))}">\`
elements+=\`Shared form field name for the options.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('789b32d7', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac2b4034', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3130d8a7', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('b67caf1c', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e10a14db', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('42bbd92b', 'id'))}">\`
elements+=\`Group label.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('ba98b42a', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('fc82fcc8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b6869ef', 'id'))}">\`
elements+=\`inline\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('609d0e3a', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2edc5308', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c103d091', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('08a8f749', 'id'))}">\`
elements+=\`Lay the options out in a row.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1fb308d0', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a92ba909', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1baa0f5', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2b84f897', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('64f80463', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('68c849eb', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('998a50b8', 'id'))}">\`
elements+=\`Disable every option.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b9d03bf2', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f8718d05', 'id'))}">\`
elements+=\`w-radio\`
elements+=\`</code>\`
elements+=\` attributes\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('5440a45e', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('8ff4294b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('52e5c276', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('ea79b593', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('fc46ac6b', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('feb0e31e', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d6336c4d', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('58c2744d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('13835e15', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('25cd3514', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1a2d06ea', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('277f3a4e', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('72096559', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1efcba7d', 'id'))}">\`
elements+=\`on\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1d13eeaf', 'id'))}">\`
elements+=\`Value reported when selected.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e3d65e80', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6e7dfa7d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f974043', 'id'))}">\`
elements+=\`label\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('02c2d3fe', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('91b71c8c', 'id'))}">\`
elements+=\`&#8212;\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c1b7e77a', 'id'))}">\`
elements+=\`Label text (or use the default slot).\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('16b42713', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('73a4d6d7', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c3083cab', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('7d7a0285', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('282a3d34', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5fa355d8', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ec9e081c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6e7d4099', 'id'))}">\`
elements+=\`primary\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('571086be', 'id'))}">\`
elements+=\`error\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aefd09d6', 'id'))}">\`
elements+=\`success\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c133f82', 'id'))}">\`
elements+=\`warning\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('5be3336c', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('40d98f06', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5bd8786', 'id'))}">\`
elements+=\`size\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a7816452', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('371d7a9f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('257a1f76', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d1451991', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('349adb3c', 'id'))}">\`
elements+=\`xs\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('075eb7c0', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8459434a', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ee84bda6', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('459ab232', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f0e00ca1', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('91fcb8ba', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2325c465', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('d2b246e0', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('be90e0cf', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('97939761', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f2035c21', 'id'))}">\`
elements+=\`Selected / disabled state.\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('061a053a', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h2>\`
elements+=\`<table class="w-table api-table" id="\${ty_escapeAttr(ty_generateId('5e02e823', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('28838818', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('68ff96ca', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('e15e4566', 'id'))}">\`
elements+=\`Event\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('8ec7349a', 'id'))}">\`
elements+=\`Detail\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('d5158110', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('f8180c30', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('1fa352cf', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('26f467bb', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ccae1a73', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3d9bb13e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1164c968', 'id'))}">\`
elements+=\`&#123; value, name &#125;\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c1ab4e02', 'id'))}">\`
elements+=\`Fired by the group when the selection changes.\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/radio-buttons/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
