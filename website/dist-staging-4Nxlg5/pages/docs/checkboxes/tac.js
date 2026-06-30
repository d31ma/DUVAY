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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('479d06fc', 'id'))}">\`
elements+=\`Checkboxes\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e6a42728', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4a10efe4', 'id'))}">\`
elements+=\`w-checkbox\`
elements+=\`</code>\`
elements+=\` is a labelled checkbox supporting checked, indeterminate, and disabled states, colour and size variants, hints, validation, and custom model values.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('8d65dd7d', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('74fafd0d', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('eeba22b9', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('b64ede8a', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('eae51c0d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('8822f07d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('30260dcb', 'id'))}">\`
elements+=\`Email updates\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('644e7a45', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('df917cf8', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('d1a4d51a', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('59ecd098', 'id'))}">\`
elements+=\`Product research\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('e80e2795', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" data-demo-mixed="" id="\${ty_escapeAttr(ty_generateId('0b5bc304', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('97848007', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('41a5dcf2', 'id'))}">\`
elements+=\`Mixed state\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('bca767bd', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" disabled="" id="\${ty_escapeAttr(ty_generateId('be9095bb', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('7d58d257', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('6bd6c185', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('f84486c7', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('cfe0f50c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" label="Email updates" id="\${ty_escapeAttr(ty_generateId('ba21f7a4', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox label="Product research" id="\${ty_escapeAttr(ty_generateId('3a845785', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox indeterminate="" label="Mixed state" id="\${ty_escapeAttr(ty_generateId('326c96ea', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox disabled="" label="Locked option" id="\${ty_escapeAttr(ty_generateId('335546ec', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('294dcc24', 'id'))}">\`
elements+=\`Colors\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('c2a50839', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('d67047ff', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--primary" id="\${ty_escapeAttr(ty_generateId('86a479c7', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('4edbed83', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('abf3fb46', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('08d3c9c8', 'id'))}">\`
elements+=\`Primary\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--error" id="\${ty_escapeAttr(ty_generateId('a5b0403f', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('b8e1399d', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('95f1fc6d', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('63743dcc', 'id'))}">\`
elements+=\`Error\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--success" id="\${ty_escapeAttr(ty_generateId('4b0ba635', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('4b9d6e4f', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('08993f53', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('ae6b280f', 'id'))}">\`
elements+=\`Success\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--warning" id="\${ty_escapeAttr(ty_generateId('2b851ca1', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('f3c82e69', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('23bbba40', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('a4854802', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('9462fcce', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('32c2fc83', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="primary" label="Primary" id="\${ty_escapeAttr(ty_generateId('d57e4568', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="error" label="Error" id="\${ty_escapeAttr(ty_generateId('8fca6bd5', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="success" label="Success" id="\${ty_escapeAttr(ty_generateId('53c2dcb9', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" color="warning" label="Warning" id="\${ty_escapeAttr(ty_generateId('f5d29d1c', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('36f40e3c', 'id'))}">\`
elements+=\`Sizes\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ebf8786b', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('82a89c58', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--xs" id="\${ty_escapeAttr(ty_generateId('b3df86b0', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('b5c7e299', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('3e7e183f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('625c3627', 'id'))}">\`
elements+=\`Extra small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--sm" id="\${ty_escapeAttr(ty_generateId('be118ad8', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('912da157', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('9da61a71', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('130ab028', 'id'))}">\`
elements+=\`Small\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--md" id="\${ty_escapeAttr(ty_generateId('a1043706', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('8a5d2fc0', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('3346f77e', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('a3f9ca34', 'id'))}">\`
elements+=\`Medium\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`</label>\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--lg" id="\${ty_escapeAttr(ty_generateId('44f291ec', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" checked="" id="\${ty_escapeAttr(ty_generateId('2ca1c943', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('875a92cf', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('416c94b3', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('612d07bd', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('3325fb32', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="xs" label="Extra small" id="\${ty_escapeAttr(ty_generateId('9943a67c', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="sm" label="Small" id="\${ty_escapeAttr(ty_generateId('d9bb3850', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="md" label="Medium" id="\${ty_escapeAttr(ty_generateId('405b8ebb', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox checked="" size="lg" label="Large" id="\${ty_escapeAttr(ty_generateId('4662d1e2', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('65aaa898', 'id'))}">\`
elements+=\`Validation and hints\`
elements+=\`</h2>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('12d245f9', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('95c51bdb', 'id'))}">\`
elements+=\`
      \`
elements+=\`<label class="w-checkbox w-checkbox--error" id="\${ty_escapeAttr(ty_generateId('74bcd743', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('e202e22a', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('b28edd8f', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-text" id="\${ty_escapeAttr(ty_generateId('f851bd2d', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('9b059569', 'id'))}">\`
elements+=\`I accept the terms\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-error" id="\${ty_escapeAttr(ty_generateId('07d89f53', 'id'))}">\`
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
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('45c8c3ae', 'id'))}">\`
elements+=\`
        \`
elements+=\`<input class="w-checkbox-input" type="checkbox" id="\${ty_escapeAttr(ty_generateId('aaeb148c', 'id'))}" />\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('eed966b5', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
        \`
elements+=\`<span class="w-checkbox-text" id="\${ty_escapeAttr(ty_generateId('f6f4e623', 'id'))}">\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('f49a7f9c', 'id'))}">\`
elements+=\`Subscribe\`
elements+=\`</span>\`
elements+=\`
          \`
elements+=\`<span class="w-checkbox-hint" id="\${ty_escapeAttr(ty_generateId('5c6c928d', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8707de2f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('bc405f4e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-checkbox error="You must accept to continue." label="I accept the terms" id="\${ty_escapeAttr(ty_generateId('73386d44', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
      \`
elements+=\`<w-checkbox hint="We send one email per month." label="Subscribe" id="\${ty_escapeAttr(ty_generateId('87086f82', 'id'))}">\`
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
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('64e665bb', 'id'))}">\`
elements+=\`Native state\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('bfa3bec2', 'id'))}">\`
elements+=\`Use the native \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('abda477e', 'id'))}">\`
elements+=\`checked\`
elements+=\`</code>\`
elements+=\` state for selection and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7a8eb2f3', 'id'))}">\`
elements+=\`value\`
elements+=\`</code>\`
elements+=\` for form submission.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('ba689717', 'id'))}">\`
elements+=\`
    \`
elements+=\`<label class="w-checkbox" id="\${ty_escapeAttr(ty_generateId('fd07e631', 'id'))}">\`
elements+=\`
      \`
elements+=\`<input class="w-checkbox-input" type="checkbox" data-demo-bool="" id="\${ty_escapeAttr(ty_generateId('32e40d60', 'id'))}" />\`
elements+=\`
      \`
elements+=\`<span class="w-checkbox-box" id="\${ty_escapeAttr(ty_generateId('47c586f7', 'id'))}">\`
elements+=\`</span>\`
elements+=\`
      \`
elements+=\`<span class="w-checkbox-label" id="\${ty_escapeAttr(ty_generateId('d435c99a', 'id'))}">\`
elements+=\`Enable notifications\`
elements+=\`</span>\`
elements+=\`
    \`
elements+=\`</label>\`
elements+=\`
    \`
elements+=\`<p class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('6fc6020a', 'id'))}">\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('ef20306f', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-checkbox data-demo-bool="" value="notifications" label="Enable notifications" id="\${ty_escapeAttr(ty_generateId('30e2a17c', 'id'))}">\`
elements+=\`</w-checkbox>\`
elements+=\`
    \`
elements+=\`<p class="w-field-hint" id="\${ty_escapeAttr(ty_generateId('c4ef93a2', 'id'))}">\`
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
