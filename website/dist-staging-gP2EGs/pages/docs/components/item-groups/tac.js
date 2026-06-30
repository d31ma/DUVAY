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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('425128d1', 'id'))}">\`
elements+=\`Item Groups\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7682b4e0', 'id'))}">\`
elements+=\`Item groups coordinate selected state across arbitrary children. They support single or multiple selection, a selection cap, custom active classes, and full keyboard navigation.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b87e1645', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-item-group" id="\${ty_escapeAttr(ty_generateId('5ae3fc76', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined selected" id="\${ty_escapeAttr(ty_generateId('46339aa8', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('0fceaa35', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fd527082', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-item-group value="day" mandatory="" id="\${ty_escapeAttr(ty_generateId('eb46e5da', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="day" id="\${ty_escapeAttr(ty_generateId('6e39ad68', 'id'))}">\`
elements+=\`Day\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="week" id="\${ty_escapeAttr(ty_generateId('79c3c2ac', 'id'))}">\`
elements+=\`Week\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="month" id="\${ty_escapeAttr(ty_generateId('b07a471d', 'id'))}">\`
elements+=\`Month\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-item-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('46a96fc5', 'id'))}">\`
elements+=\`Multiple selection with max\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3dde5a12', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ac4fc367', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` to allow more than one selection and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6fc0e939', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\` to cap how many items can be selected at once.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('45043500', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-item-group" id="\${ty_escapeAttr(ty_generateId('10050fd5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined selected" id="\${ty_escapeAttr(ty_generateId('5e508d8b', 'id'))}">\`
elements+=\`Red\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined selected" id="\${ty_escapeAttr(ty_generateId('f684cb8f', 'id'))}">\`
elements+=\`Green\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('76959bd4', 'id'))}">\`
elements+=\`Blue\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('16961e0f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-item-group multiple="" max="2" value="["red","green"]" id="\${ty_escapeAttr(ty_generateId('30c3333d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="red" id="\${ty_escapeAttr(ty_generateId('6cc11b49', 'id'))}">\`
elements+=\`Red\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="green" id="\${ty_escapeAttr(ty_generateId('cd25817f', 'id'))}">\`
elements+=\`Green\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="blue" id="\${ty_escapeAttr(ty_generateId('37ece25d', 'id'))}">\`
elements+=\`Blue\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-item-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7ee84dfa', 'id'))}">\`
elements+=\`Custom active class\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d218547a', 'id'))}">\`
elements+=\`Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('41b05380', 'id'))}">\`
elements+=\`active-class\`
elements+=\`</code>\`
elements+=\` (or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('be19834c', 'id'))}">\`
elements+=\`selected-class\`
elements+=\`</code>\`
elements+=\`) to apply your own CSS class to selected items.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('b5f6ec1f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-item-group" id="\${ty_escapeAttr(ty_generateId('2da791a0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined w-btn-primary" id="\${ty_escapeAttr(ty_generateId('9728f80e', 'id'))}">\`
elements+=\`S\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('336ff564', 'id'))}">\`
elements+=\`M\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('9801aeef', 'id'))}">\`
elements+=\`L\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('25f4a211', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-item-group value="m" active-class="w-btn-primary" id="\${ty_escapeAttr(ty_generateId('16082e7e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="s" id="\${ty_escapeAttr(ty_generateId('bc03cb35', 'id'))}">\`
elements+=\`S\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="m" id="\${ty_escapeAttr(ty_generateId('e61fed54', 'id'))}">\`
elements+=\`M\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-btn w-btn-outlined" value="l" id="\${ty_escapeAttr(ty_generateId('fa328265', 'id'))}">\`
elements+=\`L\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</w-item-group>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('3232f941', 'id'))}">\`
elements+=\`Keyboard navigation\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3716c2e1', 'id'))}">\`
elements+=\`Item groups implement roving \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5f1f19fb', 'id'))}">\`
elements+=\`tabindex\`
elements+=\`</code>\`
elements+=\` and arrow-key navigation. Tab into the group, then use \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('7dfdc8ac', 'id'))}">\`
elements+=\`←\`
elements+=\`</kbd>\`
elements+=\` \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('9551634d', 'id'))}">\`
elements+=\`→\`
elements+=\`</kbd>\`
elements+=\` \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('f79c0c43', 'id'))}">\`
elements+=\`↑\`
elements+=\`</kbd>\`
elements+=\` \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('6d1d9d80', 'id'))}">\`
elements+=\`↓\`
elements+=\`</kbd>\`
elements+=\` to move focus, \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('aeecbb35', 'id'))}">\`
elements+=\`Home\`
elements+=\`</kbd>\`
elements+=\` and \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('a81cb849', 'id'))}">\`
elements+=\`End\`
elements+=\`</kbd>\`
elements+=\` to jump to the first or last item, and \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('7f844fcf', 'id'))}">\`
elements+=\`Space\`
elements+=\`</kbd>\`
elements+=\` or \`
elements+=\`<kbd id="\${ty_escapeAttr(ty_generateId('c397d15b', 'id'))}">\`
elements+=\`Enter\`
elements+=\`</kbd>\`
elements+=\` to toggle the focused item.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c60f76e9', 'id'))}">\`
elements+=\`API reference\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('15222501', 'id'))}">\`
elements+=\`Relevant web component: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb62c680', 'id'))}">\`
elements+=\`&lt;w-item-group&gt;\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('102df456', 'id'))}">\`
elements+=\`
  \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('1f33b9dc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('477ee3d3', 'id'))}">\`
elements+=\`
      \`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('7ac2c0ba', 'id'))}">\`
elements+=\`Attribute\`
elements+=\`</th>\`
elements+=\`
      \`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('b237088a', 'id'))}">\`
elements+=\`Type\`
elements+=\`</th>\`
elements+=\`
      \`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f062f52e', 'id'))}">\`
elements+=\`Default\`
elements+=\`</th>\`
elements+=\`
      \`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('ccaa3c7d', 'id'))}">\`
elements+=\`Description\`
elements+=\`</th>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</thead>\`
elements+=\`
  \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('eab00878', 'id'))}">\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9af9426b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('3de711d3', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cf4d8839', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bd17c70a', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('02a88a92', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('28a91cd9', 'id'))}">\`
elements+=\`""\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('a4c139ba', 'id'))}">\`
elements+=\`Selected value(s). For \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3e13d40d', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`, use a JSON array like \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1ed60e94', 'id'))}">\`
elements+=\`[&quot;a&quot;,&quot;b&quot;]\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2d7a371d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('17ffef26', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a0e565e7', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('30041a3e', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('898261b4', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b2f6b3c', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6d844b26', 'id'))}">\`
elements+=\`Allow more than one item to be selected.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('7d7c95c0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('9b6f99d9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19ac28c6', 'id'))}">\`
elements+=\`mandatory\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('edeec5e3', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('af7fe484', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('db2e8951', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ac6f9fd7', 'id'))}">\`
elements+=\`At least one item must always be selected.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('bf9c8d4d', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f80c3a0d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c9b9df9d', 'id'))}">\`
elements+=\`max\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c90b84f7', 'id'))}">\`
elements+=\`number\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f883f1c7', 'id'))}">\`
elements+=\`unlimited\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e90c0e13', 'id'))}">\`
elements+=\`Maximum number of selectable items when \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f2e4f6e6', 'id'))}">\`
elements+=\`multiple\`
elements+=\`</code>\`
elements+=\` is set.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('e40c3200', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8e7f7a84', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6bf2b900', 'id'))}">\`
elements+=\`active-class\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('79dab436', 'id'))}">\`
elements+=\`selected-class\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('c5ec116b', 'id'))}">\`
elements+=\`string\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('03f15900', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c925203a', 'id'))}">\`
elements+=\`"active"\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2da45ae5', 'id'))}">\`
elements+=\`CSS class applied to selected items. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('eb83dc67', 'id'))}">\`
elements+=\`active-class\`
elements+=\`</code>\`
elements+=\` takes precedence.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
    \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('aa7baed7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('75895f3d', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('635ff98f', 'id'))}">\`
elements+=\`disabled\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('f00909e9', 'id'))}">\`
elements+=\`boolean\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('1ac2183a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('600424d6', 'id'))}">\`
elements+=\`false\`
elements+=\`</code>\`
elements+=\`</td>\`
elements+=\`
      \`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e5e06497', 'id'))}">\`
elements+=\`Disable the entire group.\`
elements+=\`</td>\`
elements+=\`
    \`
elements+=\`</tr>\`
elements+=\`
  \`
elements+=\`</tbody>\`
elements+=\`
\`
elements+=\`</table>\`
elements+=\`<h3 id="\${ty_escapeAttr(ty_generateId('19c62304', 'id'))}">\`
elements+=\`Events\`
elements+=\`</h3>\`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('bf3c487a', 'id'))}">\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('1195b705', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ffcd00c', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` — fired when the selection changes. The event detail has a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0b0e02c1', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` property. In multiple mode, that property is an array.\`
elements+=\`</li>\`
elements+=\`
\`
elements+=\`</ul>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/item-groups/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
