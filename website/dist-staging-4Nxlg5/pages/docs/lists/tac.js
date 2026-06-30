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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('f41ac0fe', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('65e694ff', 'id'))}">\`
elements+=\`Vertical collections for navigation, settings rows, messages, and selectable options.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('e6292aed', 'id'))}">\`
elements+=\`Basic List\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('deb13aaa', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9076e7fa', 'id'))}">\`
elements+=\`w-list-item-title\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fdea0479', 'id'))}">\`
elements+=\`w-list-item-subtitle\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('98544a5f', 'id'))}">\`
elements+=\`w-list-subheader\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f18b1cb2', 'id'))}">\`
elements+=\`w-list-children\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e3f7f6e8', 'id'))}">\`
elements+=\`w-list-img\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('fb65b87f', 'id'))}">\`
elements+=\`w-list-item-action\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('25defe13', 'id'))}">\`
elements+=\`w-list-item-media\`
elements+=\`</code>\`
elements+=\` are available as Vuetify-named subcomponents.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f2a0fd94', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('1c410d90', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('0a6113f4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('0ac73081', 'id'))}">\`
elements+=\`\uD83C\uDFE0\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('f6df4aed', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('a54a05c8', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('2c88de61', 'id'))}">\`
elements+=\`›\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item active" id="\${ty_escapeAttr(ty_generateId('3a1f6f1d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('0bac59c1', 'id'))}">\`
elements+=\`\uD83D\uDCE5\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('28607817', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('5e01d6ea', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('0b34c40f', 'id'))}">\`
elements+=\`12 unread messages\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('bc52177f', 'id'))}">\`
elements+=\`12\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('d755a080', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('56bfb991', 'id'))}">\`
elements+=\`⚙\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('ed526292', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('9b76a16a', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ca52fa32', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list selectable="" id="\${ty_escapeAttr(ty_generateId('6668545e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Dashboard" value="dashboard" prepend-icon="\uD83C\uDFE0" append-icon="›" id="\${ty_escapeAttr(ty_generateId('878de71e', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Inbox" subtitle="12 unread messages" value="inbox" prepend-icon="\uD83D\uDCE5" append-icon="12" active="" id="\${ty_escapeAttr(ty_generateId('196ac7db', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Settings" value="settings" prepend-icon="⚙" id="\${ty_escapeAttr(ty_generateId('b1f8bc84', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b7f4b595', 'id'))}">\`
elements+=\`Items API\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('649881a9', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('dc6c5933', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` accepts a JSON array with item, divider, subheader, and nested children entries. Selection attributes also accept JSON arrays for multi-value state.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('756b7537', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--nav" id="\${ty_escapeAttr(ty_generateId('44650117', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('a2f12b88', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item active" id="\${ty_escapeAttr(ty_generateId('0594241f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('ebbf794e', 'id'))}">\`
elements+=\`@\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('07582468', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('673cce83', 'id'))}">\`
elements+=\`Inbox\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('41c95a81', 'id'))}">\`
elements+=\`12 unread\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('bd2e6fee', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-list-group open" id="\${ty_escapeAttr(ty_generateId('58cc468d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-list-group-activator w-list-item" type="button" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('c2fb2227', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('d2f6bd01', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('4b2ef62b', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('55512762', 'id'))}">\`
elements+=\`⌃\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-list-group-items" id="\${ty_escapeAttr(ty_generateId('c31e8fd4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('97b0435d', 'id'))}">\`
elements+=\`Profile\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('0fa5c257', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ed4b7fd8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" selectable="" selected="[&#39;inbox&#39;]" opened="[&#39;settings&#39;]" items="[{&#39;type&#39;:&#39;subheader&#39;,&#39;title&#39;:&#39;Workspace&#39;},{&#39;title&#39;:&#39;Inbox&#39;,&#39;value&#39;:&#39;inbox&#39;,&#39;subtitle&#39;:&#39;12 unread&#39;,&#39;prependIcon&#39;:&#39;@&#39;},{&#39;type&#39;:&#39;divider&#39;},{&#39;title&#39;:&#39;Settings&#39;,&#39;value&#39;:&#39;settings&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Profile&#39;,&#39;value&#39;:&#39;profile&#39;},{&#39;title&#39;:&#39;Billing&#39;,&#39;value&#39;:&#39;billing&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('35daf133', 'id'))}">\`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('40e74236', 'id'))}">\`
elements+=\`Media and Variants\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('7dc2053f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--two-line" id="\${ty_escapeAttr(ty_generateId('105efd8c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item w-list-item--variant-tonal active" id="\${ty_escapeAttr(ty_generateId('a6fd1b34', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('d3216c25', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" id="\${ty_escapeAttr(ty_generateId('7831ef92', 'id'))}">\`
elements+=\`<span class="w-avatar-text" id="\${ty_escapeAttr(ty_generateId('2cc63e61', 'id'))}">\`
elements+=\`AM\`
elements+=\`</span>\`
elements+=\`<span class="w-avatar-underlay" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('23aec5ef', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('7214e838', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('d24df9ef', 'id'))}">\`
elements+=\`Avery Morgan\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('6dc6334a', 'id'))}">\`
elements+=\`Shared the revised roadmap.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('a59040e5', 'id'))}">\`
elements+=\`9:42\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item w-list-item--variant-outlined" id="\${ty_escapeAttr(ty_generateId('f94325fb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('4008b7c3', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" id="\${ty_escapeAttr(ty_generateId('f88ada26', 'id'))}">\`
elements+=\`<span class="w-avatar-text" id="\${ty_escapeAttr(ty_generateId('c96a8355', 'id'))}">\`
elements+=\`NS\`
elements+=\`</span>\`
elements+=\`<span class="w-avatar-underlay" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('f99f0652', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('921f41a6', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('4dec4616', 'id'))}">\`
elements+=\`Nora Singh\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('6a28ba78', 'id'))}">\`
elements+=\`Left a launch checklist note.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('03a1fd52', 'id'))}">\`
elements+=\`8:15\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('363a3dcf', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list lines="two" selectable="" selected="avery" id="\${ty_escapeAttr(ty_generateId('bcf27608', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Avery Morgan" subtitle="Shared the revised roadmap." value="avery" prepend-avatar="AM" append-icon="9:42" variant="tonal" id="\${ty_escapeAttr(ty_generateId('aa98a15a', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Nora Singh" subtitle="Left a launch checklist note." value="nora" prepend-avatar="NS" append-icon="8:15" variant="outlined" id="\${ty_escapeAttr(ty_generateId('a99c5c63', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('c015695a', 'id'))}">\`
elements+=\`List Groups\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('4c59d293', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f1df80e8', 'id'))}">\`
elements+=\`w-list-group\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8e4441aa', 'id'))}">\`
elements+=\`w-list-group-activator\`
elements+=\`</code>\`
elements+=\` provide expandable nested list sections.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a2b37ad1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list" id="\${ty_escapeAttr(ty_generateId('6b9363b1', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-group open" id="\${ty_escapeAttr(ty_generateId('122b1ca7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-list-group-activator w-list-item" type="button" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('1332a335', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('f5e93a36', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('7f373798', 'id'))}">\`
elements+=\`Components\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('8acc5266', 'id'))}">\`
elements+=\`⌃\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-list-group-items" id="\${ty_escapeAttr(ty_generateId('88a1994c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('8a2059cc', 'id'))}">\`
elements+=\`Lists\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('d32fd0f2', 'id'))}">\`
elements+=\`Tables\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('dd9227b0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" id="\${ty_escapeAttr(ty_generateId('8db2bf50', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-group title="Components" open="" id="\${ty_escapeAttr(ty_generateId('814dcd9c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-list-item title="Lists" id="\${ty_escapeAttr(ty_generateId('13a51cf3', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
        \`
elements+=\`<w-list-item title="Tables" id="\${ty_escapeAttr(ty_generateId('899b5adc', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`</w-list-group>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('fdfe2b28', 'id'))}">\`
elements+=\`Navigation Density\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d0a8865c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--nav w-list--compact" id="\${ty_escapeAttr(ty_generateId('897a9204', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('752cd630', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item active" href="#" id="\${ty_escapeAttr(ty_generateId('47544e7b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('d46ecd0d', 'id'))}">\`
elements+=\`\uD83D\uDCCC\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('fa01d74b', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('8f4f4004', 'id'))}">\`
elements+=\`Pinned\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item" href="#" id="\${ty_escapeAttr(ty_generateId('7f87756e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('f1ac84f2', 'id'))}">\`
elements+=\`\uD83D\uDDC2\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('94261379', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('4b8b4033', 'id'))}">\`
elements+=\`Projects\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('fb4545be', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<a class="w-list-item" href="#" id="\${ty_escapeAttr(ty_generateId('1e86796e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('ffe24a97', 'id'))}">\`
elements+=\`\uD83D\uDD58\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('384c3ad6', 'id'))}">\`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('7cfc5af0', 'id'))}">\`
elements+=\`Recent\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</a>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('dc1cc159', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list nav="" density="compact" selectable="" id="\${ty_escapeAttr(ty_generateId('b4cf2f35', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-list-subheader" id="\${ty_escapeAttr(ty_generateId('7ce663b5', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Pinned" value="pinned" prepend-icon="\uD83D\uDCCC" active="" id="\${ty_escapeAttr(ty_generateId('17b5c209', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Projects" value="projects" prepend-icon="\uD83D\uDDC2" id="\${ty_escapeAttr(ty_generateId('8f3dbb34', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<div class="w-list-divider" id="\${ty_escapeAttr(ty_generateId('306dee2d', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-list-item href="#" title="Recent" value="recent" prepend-icon="\uD83D\uDD58" id="\${ty_escapeAttr(ty_generateId('216aad71', 'id'))}">\`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('369c6efe', 'id'))}">\`
elements+=\`Multi-line Items\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('e625d480', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-list w-list--two-line" id="\${ty_escapeAttr(ty_generateId('4aaa66a2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('5d54fe1b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('a2215c0b', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" data-w-initials="AM" id="\${ty_escapeAttr(ty_generateId('d21384dc', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('8f48a373', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('e0aa2388', 'id'))}">\`
elements+=\`Avery Morgan\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('808ae89c', 'id'))}">\`
elements+=\`Shared the revised roadmap.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('979b31c7', 'id'))}">\`
elements+=\`9:42\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<button class="w-list-item" id="\${ty_escapeAttr(ty_generateId('73639c20', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-prepend" id="\${ty_escapeAttr(ty_generateId('2a12044b', 'id'))}">\`
elements+=\`<span class="w-avatar w-avatar-sm" data-w-initials="NS" id="\${ty_escapeAttr(ty_generateId('b38915d0', 'id'))}">\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-content" id="\${ty_escapeAttr(ty_generateId('f9496d2c', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-title" id="\${ty_escapeAttr(ty_generateId('7b4ec107', 'id'))}">\`
elements+=\`Nora Singh\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-list-item-subtitle" id="\${ty_escapeAttr(ty_generateId('3bd316bb', 'id'))}">\`
elements+=\`Left a comment on the launch checklist.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-list-item-append" id="\${ty_escapeAttr(ty_generateId('063278b1', 'id'))}">\`
elements+=\`8:15\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('89954f1b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-list lines="two" id="\${ty_escapeAttr(ty_generateId('a2164cac', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-list-item title="Avery Morgan" subtitle="Shared the revised roadmap." append-icon="9:42" id="\${ty_escapeAttr(ty_generateId('17809092', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" class="w-avatar w-avatar-sm" data-w-initials="AM" id="\${ty_escapeAttr(ty_generateId('2bd0033a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-list-item>\`
elements+=\`
      \`
elements+=\`<w-list-item title="Nora Singh" subtitle="Left a comment on the launch checklist." append-icon="8:15" id="\${ty_escapeAttr(ty_generateId('048a4a52', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span slot="prepend" class="w-avatar w-avatar-sm" data-w-initials="NS" id="\${ty_escapeAttr(ty_generateId('a3aecf56', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</w-list-item>\`
elements+=\`
    \`
elements+=\`</w-list>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('ada79934', 'id'))}">\`
elements+=\`Tree view\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('753c5149', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a1bfde72', 'id'))}">\`
elements+=\`w-treeview\`
elements+=\`</code>\`
elements+=\` renders hierarchical, collapsible data. Pass a flat \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ef7c4bf2', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4ce88f3a', 'id'))}">\`
elements+=\`&gt;\`
elements+=\`</code>\`
elements+=\`-delimited paths and DuVay builds the tree, or compose \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('310b946a', 'id'))}">\`
elements+=\`w-treeview-item\`
elements+=\`</code>\`
elements+=\` children directly. Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9a895a31', 'id'))}">\`
elements+=\`open-all\`
elements+=\`</code>\`
elements+=\` to expand every branch; toggle buttons are keyboard-focusable and report \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('42a7afd5', 'id'))}">\`
elements+=\`aria-expanded\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('1c785c4b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview" role="tree" id="\${ty_escapeAttr(ty_generateId('fdf95878', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('808c3752', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node open" role="treeitem" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('cec9fbcc', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('34e63c13', 'id'))}">\`
elements+=\`
            \`
elements+=\`<button class="w-treevietoggle" type="button" aria-expanded="true" aria-label="Toggle Components" id="\${ty_escapeAttr(ty_generateId('b94ef7c0', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`
            \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('64015835', 'id'))}">\`
elements+=\`Components\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('eed89acb', 'id'))}">\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node open" role="treeitem" id="\${ty_escapeAttr(ty_generateId('b548132a', 'id'))}">\`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('e9b6cdc1', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('d81888b8', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('77d73900', 'id'))}">\`
elements+=\`Buttons\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</li>\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node open" role="treeitem" id="\${ty_escapeAttr(ty_generateId('919c47bd', 'id'))}">\`
elements+=\`<span class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('78b42ef4', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('01cd3c01', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('9022ce5c', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`</li>\`
elements+=\`
          \`
elements+=\`</ul>\`
elements+=\`
        \`
elements+=\`</li>\`
elements+=\`
      \`
elements+=\`</ul>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('fb17cf6f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview open-all="" items="[Components > Buttons; Components > Inputs > Text field; Components > Inputs > Select; Layout > Grid; Layout > Utilities]" id="\${ty_escapeAttr(ty_generateId('7b78edb1', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/lists/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
