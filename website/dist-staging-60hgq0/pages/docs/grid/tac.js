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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('5e97dda8', 'id'))}">\`
elements+=\`Grid\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bb73b53f', 'id'))}">\`
elements+=\`A 12-column flexbox grid for responsive layouts. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a0409dd', 'id'))}">\`
elements+=\`w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1b9a0f52', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb5afd8a', 'id'))}">\`
elements+=\`w-col\`
elements+=\`</code>\`
elements+=\` for component layouts, or the equivalent \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2d717688', 'id'))}">\`
elements+=\`.w-container\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f6bbad9', 'id'))}">\`
elements+=\`.w-grid-row\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9fa51f63', 'id'))}">\`
elements+=\`.w-grid-col-*\`
elements+=\`</code>\`
elements+=\` classes.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('277fc3f4', 'id'))}">\`
elements+=\`Container\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('9e77fecf', 'id'))}">\`
elements+=\`Centers content and applies a max width. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5d547995', 'id'))}">\`
elements+=\`--fluid\`
elements+=\`</code>\`
elements+=\` for full width, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ddd2e0a', 'id'))}">\`
elements+=\`--sm\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f6cc7116', 'id'))}">\`
elements+=\`--md\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4c2d24dd', 'id'))}">\`
elements+=\`--lg\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5ac7d7ba', 'id'))}">\`
elements+=\`--xl\`
elements+=\`</code>\`
elements+=\` for a fixed maximum.\`
elements+=\`</p>\`
elements+=\`<div class="code-block" id="\${ty_escapeAttr(ty_generateId('085aecd8', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3ddac062', 'id'))}">\`
elements+=\`&lt;div class="w-container"&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/div&gt;

&lt;w-container&gt;
  &lt;!-- centered, max 1200px --&gt;
&lt;/w-container&gt;\`
elements+=\`</code>\`
elements+=\`</div>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5b37d20a', 'id'))}">\`
elements+=\`Basic columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dea37723', 'id'))}">\`
elements+=\`Each row has 12 units. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9a3f4661', 'id'))}">\`
elements+=\`.w-grid-col-6\`
elements+=\`</code>\`
elements+=\` spans half, two of them fill the row.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cafe2d1f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('247acc2a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('9be58005', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7fe63e99', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-6" id="\${ty_escapeAttr(ty_generateId('c259a959', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('07acbef6', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" id="\${ty_escapeAttr(ty_generateId('99c2580c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('c8edd0f9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('391fe7ff', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('58fd3192', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('23a1d861', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('eff80a80', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('e8dadb48', 'id'))}">\`
elements+=\`col-4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('86874ac0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('66564bb0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('6f67c203', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('9842236d', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('a1a07caf', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="6" id="\${ty_escapeAttr(ty_generateId('6627f826', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('44f63e02', 'id'))}">\`
elements+=\`col-6\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('5f884cde', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('af907877', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('637185c1', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('a27adb6a', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2c1b6154', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('35655397', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('04f253a2', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('5deb9212', 'id'))}">\`
elements+=\`Auto / equal width\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6053b900', 'id'))}">\`
elements+=\`Columns without a number share the remaining space equally.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6fd86af7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('b1ef53d4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('6fe33630', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2a6df374', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('bf87baf4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('6bcc988e', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col" id="\${ty_escapeAttr(ty_generateId('11723468', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('37a44bc8', 'id'))}">\`
elements+=\`auto\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('106d942f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('2885c934', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('d7ea232c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('b837c4a9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('cadf95da', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('3cfafdf9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('4ec2bf07', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col id="\${ty_escapeAttr(ty_generateId('0b265409', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9ce225ab', 'id'))}">\`
elements+=\`auto\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('03cdd20e', 'id'))}">\`
elements+=\`Responsive columns\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('5c5ba405', 'id'))}">\`
elements+=\`Stack on mobile, two-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d35db7ea', 'id'))}">\`
elements+=\`md\`
elements+=\`</code>\`
elements+=\` (≥960px), four-up from \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dec4dc6a', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` (≥1280px). Resize the window to see it adapt.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('13e55e49', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('a8b42663', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('1f6947fa', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('4eb5bf2c', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('b386a047', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9f33f2d3', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('08abc2a4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('ccb1f666', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-12 w-grid-col-md-6 w-grid-col-lg-3" id="\${ty_escapeAttr(ty_generateId('9e5bb1fa', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5ae8c66f', 'id'))}">\`
elements+=\`4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5d7a0265', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('a30502d2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('f8f8af5b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('f27df348', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f4cc9cfa', 'id'))}">\`
elements+=\`1\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('c1ff6050', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('68003952', 'id'))}">\`
elements+=\`2\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('dc8c6dfe', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5f5e110d', 'id'))}">\`
elements+=\`3\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="12" md="6" lg="3" id="\${ty_escapeAttr(ty_generateId('2cb0e6ee', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('2b3ab323', 'id'))}">\`
elements+=\`4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('98ccf6bd', 'id'))}">\`
elements+=\`Offsets\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('7d3198da', 'id'))}">\`
elements+=\`Push a column to the right with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7df727fd', 'id'))}">\`
elements+=\`.w-grid-offset-*\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c026465f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row" id="\${ty_escapeAttr(ty_generateId('d36f5f62', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('b4e0479f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('4868d724', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4 w-grid-offset-4" id="\${ty_escapeAttr(ty_generateId('bb4b749f', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('f5c80d83', 'id'))}">\`
elements+=\`col-4 · offset-4\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6a57b9cc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('67a88c14', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row id="\${ty_escapeAttr(ty_generateId('9b7dcab9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('fee11b8c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('7859296b', 'id'))}">\`
elements+=\`col-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" offset="4" id="\${ty_escapeAttr(ty_generateId('29f3f1eb', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('22feb5ed', 'id'))}">\`
elements+=\`col-4 · offset-4\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('32f1f382', 'id'))}">\`
elements+=\`Gutters & alignment\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d13f0888', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f877c333', 'id'))}">\`
elements+=\`--tight\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef2cb31a', 'id'))}">\`
elements+=\`--flush\`
elements+=\`</code>\`
elements+=\` to the row for smaller / no gutters, set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('c7acf849', 'id'))}">\`
elements+=\`gutter\`
elements+=\`</code>\`
elements+=\` on \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e020df0a', 'id'))}">\`
elements+=\`w-row\`
elements+=\`</code>\`
elements+=\` for named or custom spacing, and use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9024bd79', 'id'))}">\`
elements+=\`--center\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('785aef80', 'id'))}">\`
elements+=\`--between\`
elements+=\`</code>\`
elements+=\`, or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('508c90fa', 'id'))}">\`
elements+=\`--middle\`
elements+=\`</code>\`
elements+=\` to align columns.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c463b42a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-grid-row--flush" id="\${ty_escapeAttr(ty_generateId('51e8cd60', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('19ec1f87', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('aba26c85', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('fd898ec4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('6e9c47fa', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('af4d43ca', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('c880ddda', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-3" id="\${ty_escapeAttr(ty_generateId('04ba3db4', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5a83162c', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-grid-row w-mt-3" style="--w-grid-gutter: var(--w-space-8)" id="\${ty_escapeAttr(ty_generateId('367d7138', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('8e5b2117', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('070617aa', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('3dad2adc', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('d8686951', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-grid-col-4" id="\${ty_escapeAttr(ty_generateId('53ae82f0', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9957af34', 'id'))}">\`
elements+=\`xl gutter\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('de7cf0a9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-container fluid="" id="\${ty_escapeAttr(ty_generateId('501a662e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-row no-gutters="" id="\${ty_escapeAttr(ty_generateId('8ad5d9d4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('c8892850', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9f522e66', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('5b57a9f1', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('1661b087', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('aae918fb', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('9637df71', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="3" id="\${ty_escapeAttr(ty_generateId('bf5fc7d9', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('776456a4', 'id'))}">\`
elements+=\`flush\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
      \`
elements+=\`<w-row gutter="xl" class="w-mt-3" id="\${ty_escapeAttr(ty_generateId('a0adbf1f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('84670cb8', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('fb397e5f', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('8c78275c', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('5d76465a', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
        \`
elements+=\`<w-col cols="4" id="\${ty_escapeAttr(ty_generateId('e92bb675', 'id'))}">\`
elements+=\`<div class="grid-demo-cell" id="\${ty_escapeAttr(ty_generateId('8dfaba5c', 'id'))}">\`
elements+=\`xl gutter\`
elements+=\`</div>\`
elements+=\`</w-col>\`
elements+=\`
      \`
elements+=\`</w-row>\`
elements+=\`
    \`
elements+=\`</w-container>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/grid/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
