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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('371d70d8', 'id'))}">\`
elements+=\`Avatars\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dfc5c2e9', 'id'))}">\`
elements+=\`User profile images, icons, initials, and badge indicators.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7a809fb6', 'id'))}">\`
elements+=\`Content\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('feed3f79', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1232ff33', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('3c648fd3', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=1" alt="Ari Lane" id="\${ty_escapeAttr(ty_generateId('5e26ad53', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" data-w-initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('c8762d49', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('8b103e51', 'id'))}">\`
elements+=\`<span class="w-avatar-icon" id="\${ty_escapeAttr(ty_generateId('af1c9908', 'id'))}">\`
elements+=\`person\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('51add23f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('a9c08bd8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=1" alt="Ari Lane" id="\${ty_escapeAttr(ty_generateId('d66629d8', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DUVAY" alt="DuVay initials" id="\${ty_escapeAttr(ty_generateId('6b61c5d3', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar icon="person" alt="Person icon" id="\${ty_escapeAttr(ty_generateId('288d59c7', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9637b4c1', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('8abcbdaf', 'id'))}">\`
elements+=\`Use Vuetify-style sizes: \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('37e1086d', 'id'))}">\`
elements+=\`x-small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('5dc35779', 'id'))}">\`
elements+=\`small\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19370742', 'id'))}">\`
elements+=\`default\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('319f8bb1', 'id'))}">\`
elements+=\`large\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a2b3e802', 'id'))}">\`
elements+=\`x-large\`
elements+=\`</code>\`
elements+=\`. DuVay aliases like \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('45f5eaf9', 'id'))}">\`
elements+=\`sm\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c48a053', 'id'))}">\`
elements+=\`lg\`
elements+=\`</code>\`
elements+=\` still work.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('33813af4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('8176c195', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--x-small" data-w-initials="XS" id="\${ty_escapeAttr(ty_generateId('d7dcbe07', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--small" data-w-initials="SM" id="\${ty_escapeAttr(ty_generateId('cbda6f70', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar" data-w-initials="MD" id="\${ty_escapeAttr(ty_generateId('b48161b4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--large" data-w-initials="LG" id="\${ty_escapeAttr(ty_generateId('150c8664', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--x-large" data-w-initials="XL" id="\${ty_escapeAttr(ty_generateId('d94299f6', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('e588d20a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('da12a4d7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="XS" size="x-small" id="\${ty_escapeAttr(ty_generateId('e5c411ad', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="SM" size="small" id="\${ty_escapeAttr(ty_generateId('509e0ef6', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="MD" id="\${ty_escapeAttr(ty_generateId('10070492', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="LG" size="large" id="\${ty_escapeAttr(ty_generateId('6ccbd3f0', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="XL" size="x-large" id="\${ty_escapeAttr(ty_generateId('8ef865b2', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('18d80864', 'id'))}">\`
elements+=\`Variants and Color\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d84583c0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('7e2d6723', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-primary w-avatar--variant-flat" data-w-initials="FL" id="\${ty_escapeAttr(ty_generateId('a62fdf07', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-success w-avatar--variant-tonal" data-w-initials="TO" id="\${ty_escapeAttr(ty_generateId('3dface1f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-warning w-avatar--variant-outlined" data-w-initials="OU" id="\${ty_escapeAttr(ty_generateId('a6acfb09', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--color-error w-avatar--variant-elevated" data-w-initials="EV" id="\${ty_escapeAttr(ty_generateId('6efbd290', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('4d5c9c99', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('032db1d0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="FL" color="primary" variant="flat" id="\${ty_escapeAttr(ty_generateId('f2a31c8e', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="TO" color="success" variant="tonal" id="\${ty_escapeAttr(ty_generateId('9198ed3e', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="OU" color="warning" variant="outlined" id="\${ty_escapeAttr(ty_generateId('e58583b3', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="EV" color="error" variant="elevated" id="\${ty_escapeAttr(ty_generateId('0d91eafb', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ee8b1adc', 'id'))}">\`
elements+=\`Rounded, Border, and Density\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('4858da6f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('ede6c224', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--rounded w-avatar--border" data-w-initials="RO" id="\${ty_escapeAttr(ty_generateId('af3d9ee2', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--tile w-avatar--color-secondary" data-w-initials="TI" id="\${ty_escapeAttr(ty_generateId('f11afde8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar--density-compact w-avatar--color-tertiary" data-w-initials="DE" id="\${ty_escapeAttr(ty_generateId('418800d1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('93216aaa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('70afc3fb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar text="RO" rounded="" border="" id="\${ty_escapeAttr(ty_generateId('a5e0ba56', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="TI" tile="" color="secondary" id="\${ty_escapeAttr(ty_generateId('6b60b255', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DE" density="compact" color="tertiary" id="\${ty_escapeAttr(ty_generateId('b5386782', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fa0fe96d', 'id'))}">\`
elements+=\`Badges\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('781213cc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-5 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('a00b1e49', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap" id="\${ty_escapeAttr(ty_generateId('5e86f045', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" id="\${ty_escapeAttr(ty_generateId('9e186b65', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=2" alt="User" id="\${ty_escapeAttr(ty_generateId('e3783e0e', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--success w-avatar-badge--dot w-avatar-badge--top-end" id="\${ty_escapeAttr(ty_generateId('50e447a8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap w-avatar-wrap--floating" id="\${ty_escapeAttr(ty_generateId('8f0a2b87', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="DUVAY" id="\${ty_escapeAttr(ty_generateId('7bae7d43', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--warning w-avatar-badge--bottom-start" id="\${ty_escapeAttr(ty_generateId('1cb3017b', 'id'))}">\`
elements+=\`4\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar-wrap" id="\${ty_escapeAttr(ty_generateId('bd88129a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-avatar" data-w-initials="VIP" id="\${ty_escapeAttr(ty_generateId('579580bf', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-avatar-badge w-avatar-badge--primary w-avatar-badge--top-end" id="\${ty_escapeAttr(ty_generateId('2018c711', 'id'))}">\`
elements+=\`new\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('d4294277', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-5 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('370cb0ec', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=2" alt="User" badge="success" id="\${ty_escapeAttr(ty_generateId('2199b4f2', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="DUVAY" badge-color="warning" badge-content="4" badge-location="bottom start" badge-floating="" id="\${ty_escapeAttr(ty_generateId('cf67dd15', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar text="VIP" badge="primary" id="\${ty_escapeAttr(ty_generateId('5b015848', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="badge" id="\${ty_escapeAttr(ty_generateId('9c45d3dd', 'id'))}">\`
elements+=\`new\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-avatar>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('2b202e70', 'id'))}">\`
elements+=\`Status Indicator\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e4bcc448', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('1d56b712', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-online" id="\${ty_escapeAttr(ty_generateId('00d94db7', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=3" alt="User" id="\${ty_escapeAttr(ty_generateId('bf2b6dd5', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-away" id="\${ty_escapeAttr(ty_generateId('ad969e50', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=4" alt="User" id="\${ty_escapeAttr(ty_generateId('090c23e4', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-avatar w-avatar-status w-avatar-status-busy" id="\${ty_escapeAttr(ty_generateId('6011ee5b', 'id'))}">\`
elements+=\`<img src="https://i.pravatar.cc/150?img=5" alt="User" id="\${ty_escapeAttr(ty_generateId('c768abce', 'id'))}" />\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f772220d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-row w-gap-2 w-wrap w-items-center" id="\${ty_escapeAttr(ty_generateId('d6f3e215', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=3" status="online" id="\${ty_escapeAttr(ty_generateId('f28bd333', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=4" status="away" id="\${ty_escapeAttr(ty_generateId('7ae8f004', 'id'))}">\`
elements+=\`</w-avatar>\`
elements+=\`
      \`
elements+=\`<w-avatar image="https://i.pravatar.cc/150?img=5" status="busy" id="\${ty_escapeAttr(ty_generateId('81d3e8f6', 'id'))}">\`
elements+=\`</w-avatar>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/avatars/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
