var __defProp=Object.defineProperty;var __returnValue=(v)=>v;function __exportSetter(name,newValue){this[name]=__returnValue.bind(null,newValue)}var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0,configurable:!0,set:__exportSetter.bind(all,name)})};var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var exports_tac={};__export(exports_tac,{default:()=>tac_default});class Tac{props;tac;constructor(props={},tac=__ty_noopHelpers__){this.props=props,this.tac=tac}}var __ty_noopHelpers__,tac_default;var init_tac=__esm(()=>{__ty_noopHelpers__={isBrowser:!1,isServer:!0,bindPersistentFields:()=>{},env:(_,f)=>f,props:{},emit:()=>!1,fetch:(i,n)=>fetch(i,n),inject:(_,f)=>f,onMount:()=>{},provide:()=>{},rerender:()=>{}};tac_default=class tac_default extends Tac{onMount(){document.title="Dialog & Overlay — DuVay Documentation";function openOverlay(target,overlay){if(target)target.classList.add("open"),target.setAttribute("aria-hidden","false");if(overlay)overlay.classList.add("open")}function closeOverlay(target,overlay){if(target)target.classList.remove("open"),target.setAttribute("aria-hidden","true");if(overlay)overlay.classList.remove("open")}let cssDialogOpener=document.querySelector('[data-w-dialog-open="demo-dialog"]'),cssDialog=document.getElementById("demo-dialog"),cssDialogOverlay=document.getElementById("demo-dialog-overlay");if(cssDialogOpener)cssDialogOpener.addEventListener("click",function(){openOverlay(cssDialog,cssDialogOverlay)});if(cssDialogOverlay)cssDialogOverlay.addEventListener("click",function(){closeOverlay(cssDialog,cssDialogOverlay)});document.querySelectorAll("#demo-dialog [data-w-dialog-close]").forEach(function(btn){btn.addEventListener("click",function(){closeOverlay(cssDialog,cssDialogOverlay)})}),document.addEventListener("click",function(event){let dialogOpen=event.target.closest("[data-demo-dialog-open]");if(dialogOpen){let name=dialogOpen.getAttribute("data-demo-dialog-open"),dialog=document.querySelector('[data-demo-dialog="'+name+'"]');if(dialog&&typeof dialog.show==="function")dialog.show()}let dialogClose=event.target.closest("[data-demo-dialog-close]");if(dialogClose){let name=dialogClose.getAttribute("data-demo-dialog-close"),dialog=document.querySelector('[data-demo-dialog="'+name+'"]');if(dialog&&typeof dialog.close==="function")dialog.close()}});let cssSheetOpener=document.querySelector('[data-w-sheet-open="demo-sheet"]'),cssSheet=document.getElementById("demo-sheet"),cssSheetOverlay=document.getElementById("demo-sheet-overlay");if(cssSheetOpener)cssSheetOpener.addEventListener("click",function(){openOverlay(cssSheet,cssSheetOverlay)});if(cssSheetOverlay)cssSheetOverlay.addEventListener("click",function(){closeOverlay(cssSheet,cssSheetOverlay)});document.querySelectorAll("#demo-sheet [data-w-sheet-close]").forEach(function(btn){btn.addEventListener("click",function(){closeOverlay(cssSheet,cssSheetOverlay)})}),document.addEventListener("click",function(event){let sheetOpen=event.target.closest("[data-demo-sheet-open]");if(sheetOpen){let name=sheetOpen.getAttribute("data-demo-sheet-open"),sheet=document.querySelector('[data-demo-sheet="'+name+'"]'),sheetOverlay2=document.querySelector('[data-demo-sheet-overlay="'+name+'"]');openOverlay(sheet,sheetOverlay2)}let sheetClose=event.target.closest("[data-demo-sheet-close]");if(sheetClose){let name=sheetClose.getAttribute("data-demo-sheet-close"),sheet=document.querySelector('[data-demo-sheet="'+name+'"]'),sheetOverlay2=document.querySelector('[data-demo-sheet-overlay="'+name+'"]');closeOverlay(sheet,sheetOverlay2)}let sheetOverlay=event.target.closest('[data-demo-sheet-overlay="wc-sheet"]');if(sheetOverlay){let sheet=document.querySelector('[data-demo-sheet="wc-sheet"]');closeOverlay(sheet,sheetOverlay)}})}}});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('87deda77', 'id'))}">\`
elements+=\`Dialog &amp; Overlay\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('fbca81fb', 'id'))}">\`
elements+=\`Modal dialogs, sheets, and overlays for focused interactions.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('7e95e053', 'id'))}">\`
elements+=\`Dialog\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('63c98c10', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-filled" data-w-dialog-open="demo-dialog" id="\${ty_escapeAttr(ty_generateId('4e358f84', 'id'))}">\`
elements+=\`Open Dialog\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-overlay w-overlay--scrim" id="demo-dialog-overlay">\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-dialog-wrapper" id="demo-dialog" data-w-overlay="demo-dialog-overlay" aria-hidden="true" role="dialog" aria-modal="true">\`
elements+=\`
      \`
elements+=\`<div class="w-dialog" id="\${ty_escapeAttr(ty_generateId('dc5e967d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-header" id="\${ty_escapeAttr(ty_generateId('f101a28f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<h3 class="w-dialog-title" id="\${ty_escapeAttr(ty_generateId('46f1599f', 'id'))}">\`
elements+=\`Confirm\`
elements+=\`</h3>\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-icon w-btn--sm" data-w-dialog-close="" aria-label="Close" id="\${ty_escapeAttr(ty_generateId('05c109ee', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-body" id="\${ty_escapeAttr(ty_generateId('bbe89964', 'id'))}">\`
elements+=\`
          \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('829bd61d', 'id'))}">\`
elements+=\`Are you sure you want to proceed?\`
elements+=\`</p>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-footer" id="\${ty_escapeAttr(ty_generateId('e1f805c9', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-text" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('aad181c8', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('e96fa2e9', 'id'))}">\`
elements+=\`Confirm\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6bfce83e', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-dialog title="Confirm" id="\${ty_escapeAttr(ty_generateId('51ab15f2', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn slot="activator" variant="filled" id="\${ty_escapeAttr(ty_generateId('64167cb7', 'id'))}">\`
elements+=\`Open Dialog\`
elements+=\`</w-btn>\`
elements+=\`
      Are you sure you want to proceed?
      \`
elements+=\`<div slot="footer" id="\${ty_escapeAttr(ty_generateId('f94b4ed2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="text" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('ca344784', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<w-btn variant="filled" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('5c4f899d', 'id'))}">\`
elements+=\`Confirm\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-dialog>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('292ce3d5', 'id'))}">\`
elements+=\`Persistent\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('02970560', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('56f24ded', 'id'))}">\`
elements+=\`Persistent dialog\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-dialog-wrapper open w-dialog-wrapper--persistent" aria-hidden="false" role="dialog" aria-modal="true" style="position:relative; inset:auto; z-index:1; padding:0; opacity:1; visibility:visible" id="\${ty_escapeAttr(ty_generateId('f4eadfdf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-dialog" id="\${ty_escapeAttr(ty_generateId('92f8dc53', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-header" id="\${ty_escapeAttr(ty_generateId('deec31b8', 'id'))}">\`
elements+=\`<h3 class="w-dialog-title" id="\${ty_escapeAttr(ty_generateId('0c9c2dd1', 'id'))}">\`
elements+=\`Unsaved changes\`
elements+=\`</h3>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-body" id="\${ty_escapeAttr(ty_generateId('0cb752ac', 'id'))}">\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('6d362544', 'id'))}">\`
elements+=\`Outside clicks keep this dialog open until the user chooses an action.\`
elements+=\`</p>\`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-footer" id="\${ty_escapeAttr(ty_generateId('eb80da5f', 'id'))}">\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-text" id="\${ty_escapeAttr(ty_generateId('1040113b', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</button>\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('4a69b531', 'id'))}">\`
elements+=\`Save\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('38b3d88b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-dialog title="Unsaved changes" persistent="" id="\${ty_escapeAttr(ty_generateId('da0c8841', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn slot="activator" variant="outlined" id="\${ty_escapeAttr(ty_generateId('1b4bf569', 'id'))}">\`
elements+=\`Persistent dialog\`
elements+=\`</w-btn>\`
elements+=\`
      Outside clicks keep this dialog open until the user chooses an action.
      \`
elements+=\`<div slot="footer" id="\${ty_escapeAttr(ty_generateId('3eafe9b4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<w-btn variant="text" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('45aee5af', 'id'))}">\`
elements+=\`Cancel\`
elements+=\`</w-btn>\`
elements+=\`
        \`
elements+=\`<w-btn variant="filled" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('07da019a', 'id'))}">\`
elements+=\`Save\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-dialog>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cc48a1d8', 'id'))}">\`
elements+=\`Fullscreen and Scrollable\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c4158bb8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" id="\${ty_escapeAttr(ty_generateId('c589e208', 'id'))}">\`
elements+=\`Open fullscreen\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-dialog-wrapper open w-dialog-wrapper--fullscreen w-dialog-wrapper--scrollable" aria-hidden="false" role="dialog" aria-modal="true" style="position:relative; inset:auto; z-index:1; padding:0; opacity:1; visibility:visible" id="\${ty_escapeAttr(ty_generateId('14b5460e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-dialog w-dialog--fullscreen w-dialog--scrollable" style="width:100%; max-width:100%; min-height:220px; max-height:220px" id="\${ty_escapeAttr(ty_generateId('b15ea4f8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-header" id="\${ty_escapeAttr(ty_generateId('c1658b23', 'id'))}">\`
elements+=\`
          \`
elements+=\`<h3 class="w-dialog-title" id="\${ty_escapeAttr(ty_generateId('d8afeec3', 'id'))}">\`
elements+=\`Review details\`
elements+=\`</h3>\`
elements+=\`
          \`
elements+=\`<button class="w-btn w-btn-icon w-btn--sm" aria-label="Close" id="\${ty_escapeAttr(ty_generateId('63c7e74b', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-body" id="\${ty_escapeAttr(ty_generateId('0a6410fd', 'id'))}">\`
elements+=\`
          \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2b30164d', 'id'))}">\`
elements+=\`Scrollable dialogs keep the header and footer in place while the body carries longer content.\`
elements+=\`</p>\`
elements+=\`
          \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('c409ed53', 'id'))}">\`
elements+=\`Use fullscreen dialogs for complex mobile flows or focused editing states.\`
elements+=\`</p>\`
elements+=\`
        \`
elements+=\`</div>\`
elements+=\`
        \`
elements+=\`<div class="w-dialog-footer" id="\${ty_escapeAttr(ty_generateId('a300f772', 'id'))}">\`
elements+=\`<button class="w-btn w-btn-filled" id="\${ty_escapeAttr(ty_generateId('9e0f7700', 'id'))}">\`
elements+=\`Done\`
elements+=\`</button>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('3eb13f80', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-dialog title="Review details" fullscreen="" scrollable="" id="\${ty_escapeAttr(ty_generateId('7ff44bc7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-btn slot="activator" variant="outlined" id="\${ty_escapeAttr(ty_generateId('5821ed08', 'id'))}">\`
elements+=\`Open fullscreen\`
elements+=\`</w-btn>\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3f414c65', 'id'))}">\`
elements+=\`Scrollable dialogs keep the header and footer in place while the body carries longer content.\`
elements+=\`</p>\`
elements+=\`
      \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('75de8ae5', 'id'))}">\`
elements+=\`Use fullscreen dialogs for complex mobile flows or focused editing states.\`
elements+=\`</p>\`
elements+=\`
      \`
elements+=\`<div slot="footer" id="\${ty_escapeAttr(ty_generateId('dd93809d', 'id'))}">\`
elements+=\`<w-btn variant="filled" data-w-dialog-close="" id="\${ty_escapeAttr(ty_generateId('bb1bed76', 'id'))}">\`
elements+=\`Done\`
elements+=\`</w-btn>\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-dialog>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f39a1468', 'id'))}">\`
elements+=\`Overlay\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d75969a6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-overlay w-overlay--scrim open" style="position:relative; min-height:160px; z-index:1" id="\${ty_escapeAttr(ty_generateId('9348ebf8', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body" style="max-width:320px" id="\${ty_escapeAttr(ty_generateId('3d0a65cb', 'id'))}">\`
elements+=\`Overlay content\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('b5f55a64', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-overlay open="" scrim="primary" opacity="0.42" contained="" style="display:block; position:relative; min-height:160px; overflow:hidden; border-radius:var(--w-radius)" id="\${ty_escapeAttr(ty_generateId('db286adf', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-card w-card-body" style="max-width:320px" id="\${ty_escapeAttr(ty_generateId('9f084398', 'id'))}">\`
elements+=\`Overlay content\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`</w-overlay>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f7253afc', 'id'))}">\`
elements+=\`Sheet\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('6fb3126b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<button class="w-btn w-btn-outlined" data-w-sheet-open="demo-sheet" id="\${ty_escapeAttr(ty_generateId('8d3ba15e', 'id'))}">\`
elements+=\`Open Sheet\`
elements+=\`</button>\`
elements+=\`
    \`
elements+=\`<div class="w-overlay" id="demo-sheet-overlay">\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-sheet-bottom" id="demo-sheet" data-w-overlay="demo-sheet-overlay" aria-hidden="true">\`
elements+=\`
      \`
elements+=\`<div class="w-sheet-handle" id="\${ty_escapeAttr(ty_generateId('4fb99ade', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-dialog-header" id="\${ty_escapeAttr(ty_generateId('c611773c', 'id'))}">\`
elements+=\`
        \`
elements+=\`<h3 class="w-dialog-title" id="\${ty_escapeAttr(ty_generateId('ed167a47', 'id'))}">\`
elements+=\`Options\`
elements+=\`</h3>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-icon w-btn--sm" data-w-sheet-close="" aria-label="Close" id="\${ty_escapeAttr(ty_generateId('2ec97f85', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-dialog-body" id="\${ty_escapeAttr(ty_generateId('788f902b', 'id'))}">\`
elements+=\`
        \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('ce4d886e', 'id'))}">\`
elements+=\`Sheet content goes here.\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('887f34d6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-btn variant="outlined" data-demo-sheet-open="wc-sheet" id="\${ty_escapeAttr(ty_generateId('75590282', 'id'))}">\`
elements+=\`Open Sheet\`
elements+=\`</w-btn>\`
elements+=\`
    \`
elements+=\`<div class="w-overlay" data-demo-sheet-overlay="wc-sheet" id="\${ty_escapeAttr(ty_generateId('a0d99010', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
    \`
elements+=\`<div class="w-sheet-bottom" data-demo-sheet="wc-sheet" id="\${ty_escapeAttr(ty_generateId('12a9a80b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<div class="w-sheet-handle" id="\${ty_escapeAttr(ty_generateId('391a0bcb', 'id'))}">\`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-dialog-header" id="\${ty_escapeAttr(ty_generateId('d4591492', 'id'))}">\`
elements+=\`
        \`
elements+=\`<h3 class="w-dialog-title" id="\${ty_escapeAttr(ty_generateId('31faa441', 'id'))}">\`
elements+=\`Options\`
elements+=\`</h3>\`
elements+=\`
        \`
elements+=\`<button class="w-btn w-btn-icon w-btn--sm" data-demo-sheet-close="wc-sheet" aria-label="Close" id="\${ty_escapeAttr(ty_generateId('a762bbd2', 'id'))}">\`
elements+=\`&times;\`
elements+=\`</button>\`
elements+=\`
      \`
elements+=\`</div>\`
elements+=\`
      \`
elements+=\`<div class="w-dialog-body" id="\${ty_escapeAttr(ty_generateId('e81c2e20', 'id'))}">\`
elements+=\`
        \`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('50cc7c23', 'id'))}">\`
elements+=\`Sheet content goes here.\`
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
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/dialog/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
