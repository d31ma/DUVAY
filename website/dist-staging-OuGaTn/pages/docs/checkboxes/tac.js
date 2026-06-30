var __defProp=Object.defineProperty;var __returnValue=(v)=>v;function __exportSetter(name,newValue){this[name]=__returnValue.bind(null,newValue)}var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0,configurable:!0,set:__exportSetter.bind(all,name)})};var __esm=(fn,res)=>()=>(fn&&(res=fn(fn=0)),res);var exports_tac={};__export(exports_tac,{default:()=>tac_default});class Tac{props;tac;constructor(props={},tac=__ty_noopHelpers__){this.props=props,this.tac=tac}}var __ty_noopHelpers__,tac_default;var init_tac=__esm(()=>{__ty_noopHelpers__={isBrowser:!1,isServer:!0,bindPersistentFields:()=>{},env:(_,f)=>f,props:{},emit:()=>!1,fetch:(i,n)=>fetch(i,n),inject:(_,f)=>f,onMount:()=>{},provide:()=>{},rerender:()=>{}};tac_default=class tac_default extends Tac{onMount(){document.title="Checkboxes — DuVay Documentation";let setMixed=function(){document.querySelectorAll("[data-demo-mixed]").forEach(function(el){let input=el.tagName==="DUVAY-CHECKBOX"?el.querySelector('input[type="checkbox"]'):el;if(input)input.indeterminate=!0})};setMixed(),requestAnimationFrame(setMixed);let updateBool=function(value){let cssDisplay=document.getElementById("demo-bool-value-css"),wcDisplay=document.getElementById("demo-bool-value-wc");if(cssDisplay)cssDisplay.textContent=value;if(wcDisplay)wcDisplay.textContent=value};document.addEventListener("change",function(event){let target=event.target;if(!target||!target.hasAttribute("data-demo-bool"))return;if(target.tagName==="INPUT"&&target.type==="checkbox")updateBool(target.checked?"yes":"no")}),document.addEventListener("change",function(event){let target=event.target;if(!target||!target.hasAttribute("data-demo-bool"))return;if(target.tagName==="W-CHECKBOX"&&event.detail)updateBool(event.detail.checked?"yes":"no")})}}});var AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;var TY_INTERNAL_FIELDS=new Set(["props","tac","__ty_bound_persistent_fields__","__ty_bound_reactive_fields__"]),ty_camelCasePropName=(name)=>name.replace(/-([a-zA-Z0-9])/g,(_match,char)=>char.toUpperCase()),ty_decodeProps=(props)=>{let withCamelAliases=(propBag)=>{for(let key of Object.keys(propBag)){if(!key.includes("-"))continue;let camelKey=ty_camelCasePropName(key);if(camelKey!==key&&!Object.prototype.hasOwnProperty.call(propBag,camelKey))propBag[camelKey]=propBag[key]}return propBag};if(typeof props==="string")try{return withCamelAliases(JSON.parse(decodeURIComponent(props)))}catch{return{}}return props&&typeof props==="object"?withCamelAliases(props):{}},ty_createScope=(controller,props)=>{let state=Object.create(null),propBag=props&&typeof props==="object"?props:{},proxy;return proxy=new Proxy(state,{has(_target,key){if(key===Symbol.unscopables||typeof key!=="string")return!1;return Object.prototype.hasOwnProperty.call(state,key)||(controller?key in controller:!1)||key in propBag},get(_target,key){if(key===Symbol.unscopables)return;if(key==="__ty_controller__")return controller;if(key==="__ty_props__")return propBag;if(typeof key!=="string")return;if(Object.prototype.hasOwnProperty.call(state,key))return state[key];if(controller&&key in controller){let value=controller[key];return typeof value==="function"?value.bind(controller):value}return propBag[key]},set(_target,key,value){if(typeof key!=="string")return!0;if(controller&&key in controller)return controller[key]=value,!0;if(key in propBag)return propBag[key]=value,!0;return state[key]=value,!0},ownKeys(){let keys=new Set(Object.keys(state));if(controller&&typeof controller==="object")for(let key of Object.keys(controller))keys.add(key);for(let key of Object.keys(propBag))keys.add(key);return[...keys]},getOwnPropertyDescriptor(_target,key){if(typeof key!=="string")return;return{configurable:!0,enumerable:!0,writable:!0,value:proxy[key]}}}),proxy},__ty_isBrowserEnv=()=>typeof window<"u"&&!globalThis.__ty_prerender__,__ty_openFetchCache=async()=>{if(!__ty_isBrowserEnv()||typeof indexedDB>"u")return null;if(window.__ty_fetch_cache_db__)return window.__ty_fetch_cache_db__??null;return window.__ty_fetch_cache_db__=await new Promise((resolve)=>{let request=indexedDB.open("tachyon-fetch-cache",1);request.onupgradeneeded=()=>{request.result.createObjectStore("responses",{keyPath:"key"})},request.onsuccess=()=>resolve(request.result),request.onerror=()=>resolve(null)}),window.__ty_fetch_cache_db__??null},__ty_readCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return null;return await new Promise((resolve)=>{let request=db.transaction("responses","readonly").objectStore("responses").get(cacheKey);request.onsuccess=()=>{let entry=request.result;if(!entry){resolve(null);return}resolve(new Response(entry.body?new Uint8Array(entry.body):null,{status:entry.status,statusText:entry.statusText,headers:entry.headers}))},request.onerror=()=>resolve(null)})},__ty_writeCachedResponse=async(cacheKey,response)=>{let db=await __ty_openFetchCache();if(!db)return;let body=await response.arrayBuffer();await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").put({key:cacheKey,status:response.status,statusText:response.statusText,headers:Object.fromEntries(response.headers.entries()),body,updatedAt:Date.now()})})},__ty_deleteCachedResponse=async(cacheKey)=>{let db=await __ty_openFetchCache();if(!db)return;await new Promise((resolve)=>{let tx=db.transaction("responses","readwrite");tx.oncomplete=()=>resolve(void 0),tx.onerror=()=>resolve(void 0),tx.objectStore("responses").delete(cacheKey)})},localFirstFetch=async(input,init)=>{let request=new Request(input,init),method=request.method.toUpperCase(),browserEnv=__ty_isBrowserEnv(),sharedCache=globalThis.__ty_browser_cache__;if(browserEnv&&typeof sharedCache?.fetch==="function"){let canCacheRead=(method==="GET"||method==="HEAD")&&request.cache!=="no-store";return await sharedCache.fetch(input,init,{key:canCacheRead?`${method}:${request.url}`:null,invalidateKeys:method==="GET"||method==="HEAD"?[]:[`GET:${request.url}`,`HEAD:${request.url}`]})}let cacheKey=browserEnv&&(method==="GET"||method==="HEAD")&&request.cache!=="no-store"?`${method}:${request.url}`:null;if(cacheKey&&request.cache!=="reload"){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}try{let response=await(globalThis.__ty_native_fetch__??fetch)(input,init);if(cacheKey&&response.ok)__ty_writeCachedResponse(cacheKey,response.clone());if(!cacheKey&&response.ok&&browserEnv)Promise.all([__ty_deleteCachedResponse(`GET:${request.url}`),__ty_deleteCachedResponse(`HEAD:${request.url}`)]);return response}catch(error){if(cacheKey){let cached=await __ty_readCachedResponse(cacheKey);if(cached)return cached}throw error}};if(__ty_isBrowserEnv()){let g=globalThis;if(!g.__ty_fetch_installed__)g.__ty_fetch_installed__=!0,g.__ty_native_fetch__=globalThis.fetch.bind(globalThis),globalThis.fetch=(input,init)=>localFirstFetch(input,init)}var ty_createHelpers=(modulePath)=>{let renderContext={componentRootId:null,elemId:null,event:void 0},isBrowser=typeof window<"u"&&!globalThis.__ty_prerender__,isServer=!isBrowser,rerenderScheduled=!1,suppressReactiveRerender=!1,scheduleRerender=()=>{if(!isBrowser||suppressReactiveRerender||renderContext.elemId)return;if(rerenderScheduled)return;rerenderScheduled=!0,queueMicrotask(()=>{rerenderScheduled=!1,window.__ty_rerender?.()})},onMount=(fn)=>{if(!isBrowser)return;if(!window.__ty_onMount_queue__)window.__ty_onMount_queue__=[];window.__ty_onMount_queue__.push(fn)},rerender=()=>{if(isBrowser)window.__ty_rerender?.()},inject=(key,fallback=void 0)=>{if(!isBrowser)return fallback;return window.__ty_context__?.get(key)??fallback},env=(key,fallback=void 0)=>{if(!isBrowser)return fallback;let publicEnv=window.__ty_public_env__;if(!publicEnv||!(key in publicEnv))return fallback;return publicEnv[key]},fylo=(()=>{let noopCollection={find:async()=>({error:"Fylo browser not enabled"}),list:async()=>({error:"Fylo browser not enabled"}),get:async()=>({error:"Fylo browser not enabled"}),events:async()=>({error:"Fylo browser not enabled"}),patch:async()=>({error:"Fylo browser not enabled"}),del:async()=>({error:"Fylo browser not enabled"}),rebuild:async()=>({error:"Fylo browser not enabled"})},noop=new Proxy({enabled:!1,root:void 0,setCredentials(){},clearCredentials(){},sql:async()=>({error:"Fylo browser not enabled"}),collections:async()=>({root:"",collections:[]}),meta:async()=>null},{get(target,prop){if(typeof prop==="string"&&!(prop in target))return noopCollection;return Reflect.get(target,prop)}});return new Proxy(noop,{get(_,prop){let live=(typeof window<"u"?window.fylo:void 0)??noop;return Reflect.get(live,prop)}})})(),provide=(key,value)=>{if(isBrowser)window.__ty_context__?.set(key,value)},resolvePersistScope=(props)=>{let rawScope=props.__ty_persist_id__??(isBrowser?window.location.pathname||"/":modulePath||"server");return`${modulePath||"module"}:${String(rawScope)}`},emit=(name,detail)=>{let eventName=String(name||"").replace(/^@/,""),targetId=renderContext.componentRootId;if(!eventName||!targetId||typeof document>"u")return!1;let target=document.getElementById(targetId);if(!target||typeof CustomEvent>"u")return!1;return target.dispatchEvent(new CustomEvent(eventName,{detail,bubbles:!0,composed:!0}))},readSessionValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=sessionStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeSessionValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){sessionStorage.removeItem(storageKey);return}sessionStorage.setItem(storageKey,JSON.stringify(value))}catch{}},readLocalValue=(storageKey,fallback=void 0)=>{if(!isBrowser)return fallback;try{let stored=globalThis.localStorage.getItem(storageKey);return stored===null?fallback:JSON.parse(stored)}catch{return fallback}},writeLocalValue=(storageKey,value)=>{if(!isBrowser)return;try{if(value===void 0){globalThis.localStorage.removeItem(storageKey);return}globalThis.localStorage.setItem(storageKey,JSON.stringify(value))}catch{}},bindPersistentFields=(controller,props)=>{let boundFields=controller.__ty_bound_persistent_fields__ instanceof Set?controller.__ty_bound_persistent_fields__:new Set;controller.__ty_bound_persistent_fields__=boundFields;let persistScope=resolvePersistScope(props);for(let fieldName of Object.keys(controller)){if(boundFields.has(fieldName))continue;if(fieldName.startsWith("$$")){let storageKey2=`tac:${persistScope}:${fieldName}`,currentValue2=readLocalValue(storageKey2,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue2},set(nextValue){currentValue2=nextValue,writeLocalValue(storageKey2,nextValue)}}),controller[fieldName]=currentValue2,boundFields.add(fieldName);continue}if(!fieldName.startsWith("$"))continue;let storageKey=`tac:${persistScope}:${fieldName}`,currentValue=readSessionValue(storageKey,controller[fieldName]);Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:!0,get(){return currentValue},set(nextValue){currentValue=nextValue,writeSessionValue(storageKey,nextValue)}}),controller[fieldName]=currentValue,boundFields.add(fieldName)}},bindReactiveFields=(controller)=>{let boundFields=controller.__ty_bound_reactive_fields__ instanceof Set?controller.__ty_bound_reactive_fields__:new Set;controller.__ty_bound_reactive_fields__=boundFields;for(let fieldName of Object.keys(controller)){if(TY_INTERNAL_FIELDS.has(fieldName)||boundFields.has(fieldName))continue;let descriptor=Object.getOwnPropertyDescriptor(controller,fieldName);if(!descriptor||descriptor.configurable===!1)continue;if("value"in descriptor){let currentValue=descriptor.value;Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return currentValue},set(nextValue){if(Object.is(currentValue,nextValue))return;currentValue=nextValue,scheduleRerender()}}),boundFields.add(fieldName);continue}if(typeof descriptor.get==="function"&&typeof descriptor.set==="function")Object.defineProperty(controller,fieldName,{configurable:!0,enumerable:descriptor.enumerable,get(){return descriptor.get?.call(controller)},set(nextValue){let previousValue=descriptor.get?.call(controller);descriptor.set?.call(controller,nextValue);let currentValue=descriptor.get?.call(controller);if(!Object.is(previousValue,currentValue))scheduleRerender()}}),boundFields.add(fieldName)}};return{createTacHelpers:(props)=>({get isBrowser(){return isBrowser},get isServer(){return isServer},bindPersistentFields(controller){bindPersistentFields(controller,props)},env,props,emit,fetch:(input,init)=>localFirstFetch(input,init),inject,onMount,provide,rerender}),bindCompanion:(instance,props,tac)=>{instance.props=props,instance.tac=tac,suppressReactiveRerender=!0;try{if(props){let propBag=props;for(let fieldName of Object.keys(instance)){if(fieldName==="props"||fieldName==="tac")continue;if(Object.prototype.hasOwnProperty.call(propBag,fieldName)){instance[fieldName]=propBag[fieldName];continue}if(fieldName.startsWith("$$")){let stripped=fieldName.slice(2);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped];continue}if(fieldName.startsWith("$")){let stripped=fieldName.slice(1);if(Object.prototype.hasOwnProperty.call(propBag,stripped))instance[fieldName]=propBag[stripped]}}}bindPersistentFields(instance,props),bindReactiveFields(instance)}finally{suppressReactiveRerender=!1}},createScope:ty_createScope,decodeProps:ty_decodeProps,env,emit,inject,isBrowser,isServer,onMount,provide,rerender,fylo,loadTacModule:async(modulePath2)=>{let tacGlobal=typeof window<"u"?window.Tac:void 0;if(tacGlobal?.load)return tacGlobal.load(modulePath2);let resolved=new URL(import.meta.url);resolved.pathname=resolved.pathname.replace(/\/(?:pages|components)\/.*$/,modulePath2);let module=await import(resolved.href);if(typeof module.default==="function")return module.default;throw Error(`Tac module "${modulePath2}" did not export a renderer`)},matchSwitchCase(switchValue,caseValue){return Array.isArray(caseValue)?caseValue.some((value)=>Object.is(value,switchValue)):Object.is(caseValue,switchValue)},setRenderContext(context){renderContext.componentRootId=context.componentRootId??null,renderContext.elemId=context.elemId??null,renderContext.event=context.event}}},__ty_module_imports__={__ty_companion_import__:()=>Promise.resolve().then(() => (init_tac(),exports_tac))},__ty_compiled_factory__=new AsyncFunction("__ty_helpers__","__ty_module_imports__","props",`
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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('27344c33', 'id'))}">\`
elements+=\`Checkboxes\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a5e7d11f', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3f005c0e', 'id'))}">\`
elements+=\`w-checkbox\`
elements+=\`</code>\`
elements+=\` is a labelled checkbox supporting checked, indeterminate, and disabled states, colour and size variants, hints, validation, and custom model values.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('aedbcfa4', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('8188f0e6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('fb2f1dfe', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('b986b479', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('c6985cef', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('4c002b24', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('8d545d3f', 'id'))}">\`
elements+=\`Email updates\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('9c4b17fb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('16f410d6', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('1391b33a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('b0db41b1', 'id'))}">\`
elements+=\`Product research\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('5df169e0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" data-demo-mixed="" id="\${ty_escapeAttr(ty_generateId('2c66374f', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('332278e4', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('5f6e3d1e', 'id'))}">\`
elements+=\`Mixed state\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('8a240cf4', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" disabled="" id="\${ty_escapeAttr(ty_generateId('480238a6', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('5b8e2a8b', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('05da61fc', 'id'))}">\`
elements+=\`Locked option\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('19527587', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('ccf41934', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" label="Email updates" id="\${ty_escapeAttr(ty_generateId('53b4d76a', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox label="Product research" id="\${ty_escapeAttr(ty_generateId('a8eacfa8', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox indeterminate="" label="Mixed state" id="\${ty_escapeAttr(ty_generateId('bfaa8681', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox disabled="" label="Locked option" id="\${ty_escapeAttr(ty_generateId('e442e0d5', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1f9be6a7', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('df35806f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('9b0e5cc0', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--primary" id="\${ty_escapeAttr(ty_generateId('c2550529', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('26c9c666', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('4889e95a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('dc2f8fcc', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--error" id="\${ty_escapeAttr(ty_generateId('89b6c674', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('833f3ec1', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('442b0698', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('0efc30fd', 'id'))}">\`
elements+=\`Error\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--success" id="\${ty_escapeAttr(ty_generateId('4a5ab574', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('9d733c9d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('be9e487c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('a5e08b89', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--warning" id="\${ty_escapeAttr(ty_generateId('ad510d6d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('93db03dd', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('e095a49e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('09f35f2a', 'id'))}">\`
elements+=\`Warning\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('406a14b1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('15ad7344', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="primary" label="Primary" id="\${ty_escapeAttr(ty_generateId('545456d7', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="error" label="Error" id="\${ty_escapeAttr(ty_generateId('73513dc1', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="success" label="Success" id="\${ty_escapeAttr(ty_generateId('7195553e', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="warning" label="Warning" id="\${ty_escapeAttr(ty_generateId('63684902', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('983d4c9c', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('9aa66519', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('1ab16330', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--xs" id="\${ty_escapeAttr(ty_generateId('6a37afc9', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('dcdb9223', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('56725f1e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('3fc07978', 'id'))}">\`
elements+=\`Extra small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--sm" id="\${ty_escapeAttr(ty_generateId('beb8910f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('e3459df1', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('2771342c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('8df5dcd8', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--md" id="\${ty_escapeAttr(ty_generateId('f483b080', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('f2313f87', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('5fc34c62', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('92923f88', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--lg" id="\${ty_escapeAttr(ty_generateId('61a31c2d', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('0cabc0d1', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('c388ad9e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('03fa80d7', 'id'))}">\`
elements+=\`Large\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('5a7068a1', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('2a99b7d7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="xs" label="Extra small" id="\${ty_escapeAttr(ty_generateId('891215b6', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="sm" label="Small" id="\${ty_escapeAttr(ty_generateId('ac480954', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="md" label="Medium" id="\${ty_escapeAttr(ty_generateId('00e2c3e1', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('b6eaadae', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8c5f23fd', 'id'))}">\`
elements+=\`Validation and hints\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a53c58cc', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('2f0b82bc', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--error" id="\${ty_escapeAttr(ty_generateId('6fba1431', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('3700371e', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('1dce044c', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-text" id="\${ty_escapeAttr(ty_generateId('eed6904a', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('db424fa3', 'id'))}">\`
elements+=\`I accept the terms\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-error" id="\${ty_escapeAttr(ty_generateId('34007eb9', 'id'))}">\`
elements+=\`You must accept to continue.\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('c8714abf', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('dff67268', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('cf290d9e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-text" id="\${ty_escapeAttr(ty_generateId('50138f74', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('7f363895', 'id'))}">\`
elements+=\`Subscribe\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-hint" id="\${ty_escapeAttr(ty_generateId('a7d2c047', 'id'))}">\`
elements+=\`We send one email per month.\`
elements+=\`</span>\`
elements+=\`
        \`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8dbaddcd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('0051f069', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox error="You must accept to continue." label="I accept the terms" id="\${ty_escapeAttr(ty_generateId('5570fce8', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox hint="We send one email per month." label="Subscribe" id="\${ty_escapeAttr(ty_generateId('bf988fd2', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1ef50ae2', 'id'))}">\`
elements+=\`Native state\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('dd38b569', 'id'))}">\`
elements+=\`Use the native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('067e866a', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\` state for selection and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d904177a', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` for form submission.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('82ab6ac7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('da25dd55', 'id'))}">\`
elements+=\`
      \`
elements+=\`<input class="w-checkbox-input" type="checkbox" data-demo-bool="" id="\${ty_escapeAttr(ty_generateId('45e8f0e8', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('c2dd8490', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('44bb5610', 'id'))}">\`
elements+=\`Enable notifications\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`<p class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('63900fb9', 'id'))}">\`
elements+=\`Value: \`
elements+=\`<code id="demo-bool-value-css">\`
elements+=\`no\`
elements+=\`</code>\`
elements+=\`</p>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9b1bd387', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-checkbox data-demo-bool="" value="notifications" label="Enable notifications" id="\${ty_escapeAttr(ty_generateId('f8ab12ad', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`<p class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('15f5006a', 'id'))}">\`
elements+=\`Value: \`
elements+=\`<code id="demo-bool-value-wc">\`
elements+=\`no\`
elements+=\`</code>\`
elements+=\`</p>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default2(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/checkboxes/tac.js"),__ty_module_imports__,props)}export{tac_default2 as default};
