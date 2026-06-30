var __defProp=Object.defineProperty;var __returnValue=(v)=>v;function __exportSetter(name,newValue){this[name]=__returnValue.bind(null,newValue)}var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0,configurable:!0,set:__exportSetter.bind(all,name)})};var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var exports_tac={};__export(exports_tac,{default:()=>tac_default});class Tac{props;tac;constructor(props={},tac=__ty_noopHelpers__){this.props=props,this.tac=tac}}var __ty_noopHelpers__,tac_default;var init_tac=__esm(()=>{__ty_noopHelpers__={isBrowser:!1,isServer:!0,bindPersistentFields:()=>{},env:(_,f)=>f,props:{},emit:()=>!1,fetch:(i,n)=>fetch(i,n),inject:(_,f)=>f,onMount:()=>{},provide:()=>{},rerender:()=>{}};tac_default=class tac_default extends Tac{onMount(){document.title="Command — DuVay Documentation",document.addEventListener("click",function(event){let btn=event.target.closest&&event.target.closest("[data-open-command]");if(!btn)return;let el=document.getElementById(btn.getAttribute("data-open-command"));if(el&&typeof el.show==="function")el.show()})}}});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
const __ty_props__ = __ty_helpers__.decodeProps(props);
const { __ty_companion_import__ } = __ty_module_imports__;

const __ty_companion__ = await (async () => {
    const __ty_companion_module__ = await __ty_companion_import__();
    const __ty_Companion__ = __ty_companion_module__?.default;
    if (typeof __ty_Companion__ !== 'function') return null;
    const __ty_runtime_bindings__ = __ty_helpers__.createTacHelpers(__ty_props__);
    const __ty_instance__ = new __ty_Companion__(__ty_props__, __ty_runtime_bindings__);
    if (__ty_instance__) {
        if (__ty_instance__.__tac_wasm_ready__ && typeof __ty_instance__.__tac_wasm_ready__.then === 'function') {
            await __ty_instance__.__tac_wasm_ready__;
        }
        __ty_helpers__.bindCompanion(__ty_instance__, __ty_props__, __ty_runtime_bindings__);
    }
    return __ty_instance__;
})();
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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('08a6ea83', 'id'))}">\`
elements+=\`Command\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('0808f5cd', 'id'))}">\`
elements+=\`Command, item, and collapsible primitives help build fast search surfaces and compact action lists.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a3d83217', 'id'))}">\`
elements+=\`Command palette\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('81eeaab1', 'id'))}">\`
elements+=\`A search input over a list of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('19bcfdbf', 'id'))}">\`
elements+=\`&lt;w-command-item&gt;\`
elements+=\`</code>\`
elements+=\`s. Type to filter; use \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('104636c6', 'id'))}">\`
elements+=\`↑\`
elements+=\`</kbd>\`
elements+=\` \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('7b49cb21', 'id'))}">\`
elements+=\`↓\`
elements+=\`</kbd>\`
elements+=\` to move, \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('4205f4e0', 'id'))}">\`
elements+=\`Enter\`
elements+=\`</kbd>\`
elements+=\` to select, and \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('c325a2ac', 'id'))}">\`
elements+=\`Home\`
elements+=\`</kbd>\`
elements+=\` / \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('43948003', 'id'))}">\`
elements+=\`End\`
elements+=\`</kbd>\`
elements+=\` to jump. Items can carry a leading \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ca70d5a1', 'id'))}">\`
elements+=\`icon\`
elements+=\`</code>\`
elements+=\`, a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('78fde76d', 'id'))}">\`
elements+=\`subtitle\`
elements+=\`</code>\`
elements+=\`, and a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6460f5ae', 'id'))}">\`
elements+=\`shortcut\`
elements+=\`</code>\`
elements+=\`; selecting one emits \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('35d76c6a', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f8c2690f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-command" role="combobox" aria-label="Command menu" id="\${ty_escapeAttr(ty_generateId('fbf0bb3c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-command-input-wrap" id="\${ty_escapeAttr(ty_generateId('1e4c9eff', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-command-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('0bca9cce', 'id'))}">\`
elements+=\`⌕\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-command-input" type="search" placeholder="Search commands..." id="\${ty_escapeAttr(ty_generateId('9bac74b5', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-command-list" role="listbox" id="\${ty_escapeAttr(ty_generateId('534d09c1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<button class="w-command-item active" role="option" id="\${ty_escapeAttr(ty_generateId('055fd1c3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('588a48f9', 'id'))}">\`
elements+=\`\uD83D\uDCC4\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('dba26b27', 'id'))}">\`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('646b34ca', 'id'))}">\`
elements+=\`New File\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('ac6c4a5d', 'id'))}">\`
elements+=\`⌘N\`
elements+=\`</kbd>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item" role="option" id="\${ty_escapeAttr(ty_generateId('1ccdcca7', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('a60550d5', 'id'))}">\`
elements+=\`\uD83D\uDCC2\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('6148bc43', 'id'))}">\`
elements+=\`
            \`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('30dbd466', 'id'))}">\`
elements+=\`Open Project\`
elements+=\`</span>\`
elements+=\`
            \`
elements+=\`<span class="w-command-item-subtitle" id="\${ty_escapeAttr(ty_generateId('75ab4f13', 'id'))}">\`
elements+=\`Open an existing project\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('b5565671', 'id'))}">\`
elements+=\`⌘O\`
elements+=\`</kbd>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item" role="option" id="\${ty_escapeAttr(ty_generateId('08b93a6b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('6a5bf187', 'id'))}">\`
elements+=\`\uD83D\uDCBE\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('358dc6c0', 'id'))}">\`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('b82efdc0', 'id'))}">\`
elements+=\`Save\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('b9283f53', 'id'))}">\`
elements+=\`⌘S\`
elements+=\`</kbd>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('59f71a2c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-command placeholder="Search commands..." id="\${ty_escapeAttr(ty_generateId('19798a0c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-command-item value="new" icon="\uD83D\uDCC4" shortcut="⌘N" id="\${ty_escapeAttr(ty_generateId('1614ee85', 'id'))}">\`
elements+=\`New File\`
elements+=\`</w-command-item>\`
elements+=\`
      \`
elements+=\`<w-command-item value="open" icon="\uD83D\uDCC2" subtitle="Open an existing project" shortcut="⌘O" id="\${ty_escapeAttr(ty_generateId('8977ff58', 'id'))}">\`
elements+=\`Open Project\`
elements+=\`</w-command-item>\`
elements+=\`
      \`
elements+=\`<w-command-item value="save" icon="\uD83D\uDCBE" shortcut="⌘S" id="\${ty_escapeAttr(ty_generateId('f13d53d2', 'id'))}">\`
elements+=\`Save\`
elements+=\`</w-command-item>\`
elements+=\`
    \`
elements+=\`</w-command>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('b2200f2f', 'id'))}">\`
elements+=\`Grouped items\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('91381501', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('a74b2450', 'id'))}">\`
elements+=\`&lt;div class="w-command-subheader"&gt;\`
elements+=\`</code>\`
elements+=\` labels and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d36aee8d', 'id'))}">\`
elements+=\`&lt;div class="w-command-divider"&gt;\`
elements+=\`</code>\`
elements+=\` rules between items to organize the list. The same structure can be produced declaratively with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('915ec264', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` array — an array of item objects (title, subtitle, icon, shortcut, value, disabled) plus subheader and divider rows.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('fefe81f6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-command" role="combobox" aria-label="Command menu" id="\${ty_escapeAttr(ty_generateId('ce8efea4', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-command-input-wrap" id="\${ty_escapeAttr(ty_generateId('2aa36727', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-command-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('db18132c', 'id'))}">\`
elements+=\`⌕\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<input class="w-command-input" type="search" placeholder="Search..." id="\${ty_escapeAttr(ty_generateId('a1f46ea3', 'id'))}" />\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-command-list" role="listbox" id="\${ty_escapeAttr(ty_generateId('438075a6', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-command-subheader" id="\${ty_escapeAttr(ty_generateId('14ea29c0', 'id'))}">\`
elements+=\`Files\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item active" role="option" id="\${ty_escapeAttr(ty_generateId('4afd32d3', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('757791cf', 'id'))}">\`
elements+=\`\uD83D\uDD0E\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('123780ff', 'id'))}">\`
elements+=\`
            \`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('5f9c32c6', 'id'))}">\`
elements+=\`Find File\`
elements+=\`</span>\`
elements+=\`
            \`
elements+=\`<span class="w-command-item-subtitle" id="\${ty_escapeAttr(ty_generateId('38420bcf', 'id'))}">\`
elements+=\`Search by name\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('04a20ca2', 'id'))}">\`
elements+=\`⌘P\`
elements+=\`</kbd>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item" role="option" id="\${ty_escapeAttr(ty_generateId('6d5854a8', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('3e16dff6', 'id'))}">\`
elements+=\`\uD83D\uDCC1\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('d48ef1ec', 'id'))}">\`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('577c53c3', 'id'))}">\`
elements+=\`New Folder\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<div class="w-command-divider" role="separator" id="\${ty_escapeAttr(ty_generateId('359e601a', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-command-subheader" id="\${ty_escapeAttr(ty_generateId('f23325df', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item" role="option" id="\${ty_escapeAttr(ty_generateId('6c0dd2a4', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e2a637d7', 'id'))}">\`
elements+=\`\uD83C\uDFA8\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('c236e447', 'id'))}">\`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('43e4e745', 'id'))}">\`
elements+=\`Appearance\`
elements+=\`</span>\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`<button class="w-command-item" role="option" disabled="" aria-disabled="true" id="\${ty_escapeAttr(ty_generateId('5926ffb2', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('8e8489f0', 'id'))}">\`
elements+=\`⌨️\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-command-item-content" id="\${ty_escapeAttr(ty_generateId('adb9724c', 'id'))}">\`
elements+=\`<span class="w-command-item-title" id="\${ty_escapeAttr(ty_generateId('1a14b06e', 'id'))}">\`
elements+=\`Keyboard\`
elements+=\`</span>\`
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
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('c9523686', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-command placeholder="Search..." id="\${ty_escapeAttr(ty_generateId('0c030b4c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-command-subheader" id="\${ty_escapeAttr(ty_generateId('cc825d52', 'id'))}">\`
elements+=\`Files\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-command-item value="find" icon="\uD83D\uDD0E" subtitle="Search by name" shortcut="⌘P" id="\${ty_escapeAttr(ty_generateId('5824c262', 'id'))}">\`
elements+=\`Find File\`
elements+=\`</w-command-item>\`
elements+=\`
      \`
elements+=\`<w-command-item value="newfolder" icon="\uD83D\uDCC1" id="\${ty_escapeAttr(ty_generateId('6ee09c1e', 'id'))}">\`
elements+=\`New Folder\`
elements+=\`</w-command-item>\`
elements+=\`
      \`
elements+=\`<div class="w-command-divider" role="separator" id="\${ty_escapeAttr(ty_generateId('61413724', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-command-subheader" id="\${ty_escapeAttr(ty_generateId('b2b14921', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<w-command-item value="appearance" icon="\uD83C\uDFA8" id="\${ty_escapeAttr(ty_generateId('2da53756', 'id'))}">\`
elements+=\`Appearance\`
elements+=\`</w-command-item>\`
elements+=\`
      \`
elements+=\`<w-command-item value="keyboard" icon="⌨️" disabled="" id="\${ty_escapeAttr(ty_generateId('4f6c79aa', 'id'))}">\`
elements+=\`Keyboard\`
elements+=\`</w-command-item>\`
elements+=\`
    \`
elements+=\`</w-command>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('170df005', 'id'))}">\`
elements+=\`Overlay &amp; hotkey\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('de67d955', 'id'))}">\`
elements+=\`Give \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0bfb84a4', 'id'))}">\`
elements+=\`&lt;w-command&gt;\`
elements+=\`</code>\`
elements+=\` a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4bbbdd86', 'id'))}">\`
elements+=\`hotkey\`
elements+=\`</code>\`
elements+=\` (for example \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('574ad27e', 'id'))}">\`
elements+=\`mod+k\`
elements+=\`</code>\`
elements+=\` — ⌘ on macOS, Ctrl elsewhere) to open it as a centered overlay from anywhere. Press \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('50146ce1', 'id'))}">\`
elements+=\`⌘K\`
elements+=\`</kbd>\`
elements+=\` / \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('98f78e48', 'id'))}">\`
elements+=\`Ctrl K\`
elements+=\`</kbd>\`
elements+=\` now, or use the button. \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('46c137d3', 'id'))}">\`
elements+=\`Esc\`
elements+=\`</kbd>\`
elements+=\` or a backdrop click closes it; open it programmatically with the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('9dccf60a', 'id'))}">\`
elements+=\`open\`
elements+=\`</code>\`
elements+=\` attribute or the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2b8aeb34', 'id'))}">\`
elements+=\`show()\`
elements+=\`</code>\`
elements+=\` / \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('616b9d7c', 'id'))}">\`
elements+=\`hide()\`
elements+=\`</code>\`
elements+=\` methods.\`
elements+=\`</p>\`
elements+=\`<button class="w-btn w-btn-filled" type="button" data-open-command="demo-overlay-palette" id="\${ty_escapeAttr(ty_generateId('116dec98', 'id'))}">\`
elements+=\`Open command palette\`
elements+=\`</button>\`
elements+=\`<w-command id="demo-overlay-palette" hotkey="mod+k" placeholder="Search commands…">\`
elements+=\`
  \`
elements+=\`<w-command-item value="profile" icon="\uD83D\uDC64" id="\${ty_escapeAttr(ty_generateId('34f91792', 'id'))}">\`
elements+=\`Go to Profile\`
elements+=\`</w-command-item>\`
elements+=\`
  \`
elements+=\`<w-command-item value="billing" icon="\uD83D\uDCB3" subtitle="Manage your subscription" id="\${ty_escapeAttr(ty_generateId('ba57db39', 'id'))}">\`
elements+=\`Billing\`
elements+=\`</w-command-item>\`
elements+=\`
  \`
elements+=\`<w-command-item value="logout" icon="\uD83D\uDEAA" shortcut="⌘⇧Q" id="\${ty_escapeAttr(ty_generateId('09536b87', 'id'))}">\`
elements+=\`Log out\`
elements+=\`</w-command-item>\`
elements+=\`
\`
elements+=\`</w-command>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('622bdc37', 'id'))}">\`
elements+=\`Item\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('f6374aae', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-item" id="\${ty_escapeAttr(ty_generateId('1eb59de2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<span class="w-item-icon" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('b2c77553', 'id'))}">\`
elements+=\`↗\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-item-content" id="\${ty_escapeAttr(ty_generateId('b6b53038', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span class="w-item-title" id="\${ty_escapeAttr(ty_generateId('853d9297', 'id'))}">\`
elements+=\`Open deployment\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-item-description" id="\${ty_escapeAttr(ty_generateId('2ff5240a', 'id'))}">\`
elements+=\`Production environment\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<kbd class="w-kbd" id="\${ty_escapeAttr(ty_generateId('2af4ffa9', 'id'))}">\`
elements+=\`D\`
elements+=\`</kbd>\`
elements+=\`
    \`
elements+=\`</button>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('019d72af', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-item icon="↗" title="Open deployment" description="Production environment" shortcut="D" id="\${ty_escapeAttr(ty_generateId('6cc2c2b0', 'id'))}">\`
elements+=\`</w-item>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('96d577b5', 'id'))}">\`
elements+=\`Collapsible\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('922f8db8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-collapsible open" id="\${ty_escapeAttr(ty_generateId('6c2e2a6a', 'id'))}">\`
elements+=\`
      \`
elements+=\`<button class="w-collapsible-trigger" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('72515a9c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<span id="\${ty_escapeAttr(ty_generateId('c69e0ee2', 'id'))}">\`
elements+=\`Advanced filters\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<svg class="w-collapsible-icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true" id="\${ty_escapeAttr(ty_generateId('e3925ac5', 'id'))}">\`
elements+=\`<polyline points="6 9 12 15 18 9" id="\${ty_escapeAttr(ty_generateId('6a818306', 'id'))}" />\`
elements+=\`</svg>\`
elements+=\`
      \`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`<div class="w-collapsible-content" id="\${ty_escapeAttr(ty_generateId('2e8d5a6e', 'id'))}">\`
elements+=\`
        \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d6398f16', 'id'))}">\`
elements+=\`Saved views, owners, tags, and status filters.\`
elements+=\`</p>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('929e7514', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-collapsible header="Advanced filters" open="" id="\${ty_escapeAttr(ty_generateId('5df37529', 'id'))}">\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d2a4a5ef', 'id'))}">\`
elements+=\`Saved views, owners, tags, and status filters.\`
elements+=\`</p>\`
elements+=\`
    \`
elements+=\`</w-collapsible>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/command/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
