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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('9e6afeea', 'id'))}">\`
elements+=\`Ratings\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9ee71b1e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fec71887', 'id'))}">\`
elements+=\`w-rating\`
elements+=\`</code>\`
elements+=\` captures whole or half-step scores with keyboard navigation, hover previews, custom icons, labels, form values, and controlled \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('adb6c313', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` state.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f4d1b65', 'id'))}">\`
elements+=\`Usage\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4e5e3afd', 'id'))}">\`
elements+=\`Use the class structure for a static score or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b688ff6', 'id'))}">\`
elements+=\`w-rating\`
elements+=\`</code>\`
elements+=\` for an interactive form control.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0a984444', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-rating" role="img" aria-label="4 out of 5" id="\${ty_escapeAttr(ty_generateId('95517063', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-rating__items" id="\${ty_escapeAttr(ty_generateId('759ee8db', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-rating__wrapper" data-state="full" style="--w-rating-fill:100%" id="\${ty_escapeAttr(ty_generateId('0bb8e936', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-rating__item" id="\${ty_escapeAttr(ty_generateId('654f2de7', 'id'))}">\`
elements+=\`<span class="w-rating__visual" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e26b919b', 'id'))}">\`
elements+=\`<span class="w-rating__icon w-rating__icon--empty" id="\${ty_escapeAttr(ty_generateId('793fb9e3', 'id'))}">\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`<span class="w-rating__icon w-rating__icon--filled" id="\${ty_escapeAttr(ty_generateId('37fb8769', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-rating__wrapper" data-state="full" style="--w-rating-fill:100%" id="\${ty_escapeAttr(ty_generateId('490c2bac', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-rating__item" id="\${ty_escapeAttr(ty_generateId('ac386356', 'id'))}">\`
elements+=\`<span class="w-rating__visual" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('933724e5', 'id'))}">\`
elements+=\`<span class="w-rating__icon w-rating__icon--empty" id="\${ty_escapeAttr(ty_generateId('d2afbe87', 'id'))}">\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`<span class="w-rating__icon w-rating__icon--filled" id="\${ty_escapeAttr(ty_generateId('09e260ed', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-rating__wrapper" data-state="full" style="--w-rating-fill:100%" id="\${ty_escapeAttr(ty_generateId('37b9face', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-rating__item" id="\${ty_escapeAttr(ty_generateId('bcdf0ab1', 'id'))}">\`
elements+=\`<span class="w-rating__visual" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('561bd147', 'id'))}">\`
elements+=\`<span class="w-rating__icon w-rating__icon--empty" id="\${ty_escapeAttr(ty_generateId('6224b016', 'id'))}">\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`<span class="w-rating__icon w-rating__icon--filled" id="\${ty_escapeAttr(ty_generateId('c7d9d8fb', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-rating__wrapper" data-state="full" style="--w-rating-fill:100%" id="\${ty_escapeAttr(ty_generateId('edbe3db3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-rating__item" id="\${ty_escapeAttr(ty_generateId('8be5d70d', 'id'))}">\`
elements+=\`<span class="w-rating__visual" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('929f6f03', 'id'))}">\`
elements+=\`<span class="w-rating__icon w-rating__icon--empty" id="\${ty_escapeAttr(ty_generateId('30c132f9', 'id'))}">\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`<span class="w-rating__icon w-rating__icon--filled" id="\${ty_escapeAttr(ty_generateId('f17183bd', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-rating__wrapper" data-state="empty" style="--w-rating-fill:0%" id="\${ty_escapeAttr(ty_generateId('6cb34992', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-rating__item" id="\${ty_escapeAttr(ty_generateId('9da82da7', 'id'))}">\`
elements+=\`<span class="w-rating__visual" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('25c964e7', 'id'))}">\`
elements+=\`<span class="w-rating__icon w-rating__icon--empty" id="\${ty_escapeAttr(ty_generateId('123e022f', 'id'))}">\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`<span class="w-rating__icon w-rating__icon--filled" id="\${ty_escapeAttr(ty_generateId('2ef114a3', 'id'))}">\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d24ff10f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-rating value="4" label="Product rating" ripple="" id="\${ty_escapeAttr(ty_generateId('7bfacf89', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5f914515', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bc4e9ab0', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('60327712', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` controls empty items and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3064258b', 'id'))}">\`
elements+=\`active-color\`
elements+=\`</code>\`
elements+=\` controls the selected value.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('551d235a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('7b205b9a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-row w-gap-1 w-items-center" style="color:var(--w-primary)" id="\${ty_escapeAttr(ty_generateId('90d019e9', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('422056b6', 'id'))}">\`
elements+=\`★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('f13b73d2', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-row w-gap-1 w-items-center" style="color:var(--w-success)" id="\${ty_escapeAttr(ty_generateId('6f7a97e4', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('889355ff', 'id'))}">\`
elements+=\`★ ★ ★ ☆ ☆\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('5074820b', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-row w-gap-1 w-items-center" style="color:var(--w-warning)" id="\${ty_escapeAttr(ty_generateId('e1c2b7f0', 'id'))}">\`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e4a25ea9', 'id'))}">\`
elements+=\`★ ★ ★ ★ ★\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('503a89f2', 'id'))}">\`
elements+=\`Warning\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('0507ec0e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('4aaedf40', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="4" active-color="primary" label="Primary rating" id="\${ty_escapeAttr(ty_generateId('dd6c73a0', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="3" active-color="success" label="Success rating" id="\${ty_escapeAttr(ty_generateId('83aceb94', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="5" active-color="warning" label="Warning rating" id="\${ty_escapeAttr(ty_generateId('9efbb473', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b7518498', 'id'))}">\`
elements+=\`Half Increments\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7cdf474d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b215268', 'id'))}">\`
elements+=\`half-increments\`
elements+=\`</code>\`
elements+=\` exposes two selectable zones per item. Arrow keys move by one half step.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c367bdbd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-rating" role="img" aria-label="3.5 out of 5" style="--w-rating-active-color:var(--w-warning)" id="\${ty_escapeAttr(ty_generateId('9eee1a79', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3751058a', 'id'))}">\`
elements+=\`★ ★ ★ ◐ ☆\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f44114ac', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-rating value="3.5" half-increments="" label="Half-step rating" ripple="" id="\${ty_escapeAttr(ty_generateId('9fd77660', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fc359c1a', 'id'))}">\`
elements+=\`Hover and Clearable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('85a9d6f4', 'id'))}">\`
elements+=\`Hover previews a prospective value. With \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8eb0cd9f', 'id'))}">\`
elements+=\`clearable\`
elements+=\`</code>\`
elements+=\`, selecting the current value resets the score to zero.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('05c1a2ee', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('08748cbd', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('b7323561', 'id'))}">\`
elements+=\`Hover states preview the active color.\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('4a0bf28b', 'id'))}">\`
elements+=\`Select the same value again to clear it.\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b5fd28b4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-rating value="3" hover="" clearable="" ripple="" label="Hover and clear rating" id="\${ty_escapeAttr(ty_generateId('398e2b31', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('0e3ef822', 'id'))}">\`
elements+=\`Length\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f30e582a', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('af7f362a', 'id'))}">\`
elements+=\`length\`
elements+=\`</code>\`
elements+=\` for short sentiment scales or more granular scores.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e67c6f7c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('738138ac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span aria-label="2 out of 3" id="\${ty_escapeAttr(ty_generateId('9b211dfa', 'id'))}">\`
elements+=\`★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span aria-label="7 out of 10" id="\${ty_escapeAttr(ty_generateId('34883136', 'id'))}">\`
elements+=\`★ ★ ★ ★ ★ ★ ★ ☆ ☆ ☆\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('144e4821', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('38408701', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="2" length="3" label="Three point score" id="\${ty_escapeAttr(ty_generateId('a1f79ae5', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="7" length="10" size="small" label="Ten point score" id="\${ty_escapeAttr(ty_generateId('624d253c', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1943ad6a', 'id'))}">\`
elements+=\`Size and Density\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bb0d8991', 'id'))}">\`
elements+=\`Named sizes follow the component scale. Density adjusts the space between items without shrinking accessible hit targets.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('abfc3308', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('f44de025', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span style="font-size:1rem" id="\${ty_escapeAttr(ty_generateId('85cbefde', 'id'))}">\`
elements+=\`★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span style="font-size:1.5rem" id="\${ty_escapeAttr(ty_generateId('ef19eee7', 'id'))}">\`
elements+=\`★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span style="font-size:2.5rem" id="\${ty_escapeAttr(ty_generateId('ea2e70a8', 'id'))}">\`
elements+=\`★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b16bf45a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('0e3a7b4c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="4" size="x-small" density="compact" label="Extra-small compact rating" id="\${ty_escapeAttr(ty_generateId('4a657693', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="4" size="default" label="Default rating" id="\${ty_escapeAttr(ty_generateId('19360b8c', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="4" size="x-large" density="comfortable" label="Extra-large comfortable rating" id="\${ty_escapeAttr(ty_generateId('34d58a6d', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('dfb71fcb', 'id'))}">\`
elements+=\`Readonly and Disabled\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('43c8ad90', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5eec4de8', 'id'))}">\`
elements+=\`readonly\`
elements+=\`</code>\`
elements+=\` keeps the score legible without allowing changes. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c181ad25', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\` also removes the control from interaction and applies disabled emphasis.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d81a8370', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('89878813', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('25b31be3', 'id'))}">\`
elements+=\`Readonly: ★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span style="opacity:.5" id="\${ty_escapeAttr(ty_generateId('be73e269', 'id'))}">\`
elements+=\`Disabled: ★ ★ ☆ ☆ ☆\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('50de56d7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('916b3d9e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="4" readonly="" label="Readonly rating" id="\${ty_escapeAttr(ty_generateId('27c116a2', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="2" disabled="" label="Disabled rating" id="\${ty_escapeAttr(ty_generateId('29842815', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1517c7e1', 'id'))}">\`
elements+=\`Icons\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('f4dbfb2d', 'id'))}">\`
elements+=\`Replace the empty and full symbols through the icon registry or provide a custom \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a7f7a23e', 'id'))}">\`
elements+=\`item\`
elements+=\`</code>\`
elements+=\` slot.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f69f048a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('1331ad8b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span aria-label="3 out of 5" id="\${ty_escapeAttr(ty_generateId('d5af65dc', 'id'))}">\`
elements+=\`♥ ♥ ♥ ♡ ♡\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span aria-label="4 out of 5" id="\${ty_escapeAttr(ty_generateId('27e54b88', 'id'))}">\`
elements+=\`◆ ◆ ◆ ◆ ◇\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c086a6c7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('8903ebf9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="3" empty-icon="♡" full-icon="♥" active-color="danger" label="Heart rating" id="\${ty_escapeAttr(ty_generateId('6d7066fe', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="4" active-color="primary" label="Diamond rating" id="\${ty_escapeAttr(ty_generateId('9c390991', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="item" id="\${ty_escapeAttr(ty_generateId('2970923a', 'id'))}">\`
elements+=\`◆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('86939c21', 'id'))}">\`
elements+=\`Item Labels\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0aa085fa', 'id'))}">\`
elements+=\`Pass labels as a JSON array. Labels can sit above or below items and can be formatted through the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bdf23ed1', 'id'))}">\`
elements+=\`item-label\`
elements+=\`</code>\`
elements+=\` slot.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('91ddf1e6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-3" id="\${ty_escapeAttr(ty_generateId('00764193', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('2d901148', 'id'))}">\`
elements+=\`Low\`
elements+=\`<br id="\${ty_escapeAttr(ty_generateId('bc5873eb', 'id'))}" />\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('08ecf508', 'id'))}">\`
elements+=\`Medium\`
elements+=\`<br id="\${ty_escapeAttr(ty_generateId('c38afed5', 'id'))}" />\`
elements+=\`★\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('35b364d8', 'id'))}">\`
elements+=\`High\`
elements+=\`<br id="\${ty_escapeAttr(ty_generateId('75920f08', 'id'))}" />\`
elements+=\`☆\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('dd2c4a8d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-column w-gap-4" id="\${ty_escapeAttr(ty_generateId('719b21c8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="2" length="3" item-labels="["Low","Medium","High"]" label="Priority" id="\${ty_escapeAttr(ty_generateId('290388c8', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`<w-rating value="3" length="5" item-label-position="bottom" item-labels="["1","2","3","4","5"]" label="Score" id="\${ty_escapeAttr(ty_generateId('25a76c85', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong slot="item-label" id="\${ty_escapeAttr(ty_generateId('f1263b62', 'id'))}">\`
elements+=\`Score\`
elements+=\`</strong>\`
elements+=\`
      \`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8f72d81b', 'id'))}">\`
elements+=\`Form and Accessibility\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0ecf33dd', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f5589bd7', 'id'))}">\`
elements+=\`name\`
elements+=\`</code>\`
elements+=\` adds a synchronized hidden form value. Customize spoken item labels with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37d32673', 'id'))}">\`
elements+=\`item-aria-label\`
elements+=\`</code>\`
elements+=\`, using value and length placeholders in the label template.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('79cac903', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label for="static-rating-value" id="\${ty_escapeAttr(ty_generateId('63c29cee', 'id'))}">\`
elements+=\`Service quality\`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`<input id="static-rating-value" class="w-input" name="service-quality" value="4.5" readonly="" />\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('35b198e7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<form class="w-column w-gap-2" id="\${ty_escapeAttr(ty_generateId('a8a417c2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-rating value="4.5" half-increments="" name="service-quality" label="Service quality" item-aria-label="{value} stars out of {length}" id="\${ty_escapeAttr(ty_generateId('9f24b30c', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
    \`
elements+=\`</form>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('105343f7', 'id'))}">\`
elements+=\`Card Rating\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('824f5fde', 'id'))}">\`
elements+=\`Ratings can compose with DuVay surfaces without requiring a specialized wrapper.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f0888d7f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<article class="w-card" id="\${ty_escapeAttr(ty_generateId('230cf419', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card-body" id="\${ty_escapeAttr(ty_generateId('3b7224e5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('bb159227', 'id'))}">\`
elements+=\`Field Notes\`
elements+=\`</strong>\`
elements+=\`
        \`
elements+=\`<p class="w-text-muted" id="\${ty_escapeAttr(ty_generateId('dc7980e7', 'id'))}">\`
elements+=\`A compact, thoughtful release.\`
elements+=\`</p>\`
elements+=\`
        \`
elements+=\`<span aria-label="4 out of 5" id="\${ty_escapeAttr(ty_generateId('845d35d5', 'id'))}">\`
elements+=\`★ ★ ★ ★ ☆\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</article>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ab52fcbd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-card id="\${ty_escapeAttr(ty_generateId('0105714a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-card-title id="\${ty_escapeAttr(ty_generateId('ae0c80fc', 'id'))}">\`
elements+=\`Field Notes\`
elements+=\`</w-card-title>\`
elements+=\`
      \`
elements+=\`<w-card-text id="\${ty_escapeAttr(ty_generateId('8335ab97', 'id'))}">\`
elements+=\`A compact, thoughtful release.\`
elements+=\`</w-card-text>\`
elements+=\`
      \`
elements+=\`<w-card-actions id="\${ty_escapeAttr(ty_generateId('de601883', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-rating value="4" hover="" clearable="" size="small" label="Rate Field Notes" id="\${ty_escapeAttr(ty_generateId('841ec997', 'id'))}">\`
elements+=\`</w-rating>\`
elements+=\`
      \`
elements+=\`</w-card-actions>\`
elements+=\`
    \`
elements+=\`</w-card>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/ratings/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
