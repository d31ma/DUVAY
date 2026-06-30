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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('17332dac', 'id'))}">\`
elements+=\`Treeview\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('08fd1037', 'id'))}">\`
elements+=\`Treeviews display hierarchical data with expandable branches. Pass nested data through \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('d57bfeca', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\` (a JSON array of \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6ae9dd60', 'id'))}">\`
elements+=\`&#123;&nbsp;title, value, children&nbsp;&#125;\`
elements+=\`</code>\`
elements+=\` nodes) or the shorthand \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('616b4013', 'id'))}">\`
elements+=\`A&gt;B&gt;C\`
elements+=\`</code>\`
elements+=\` path syntax. Rows can be \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('23db2c3d', 'id'))}">\`
elements+=\`activatable\`
elements+=\`</strong>\`
elements+=\` (single highlight) or \`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('f675a6ee', 'id'))}">\`
elements+=\`selectable\`
elements+=\`</strong>\`
elements+=\` (cascading checkboxes).\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('cd93de24', 'id'))}">\`
elements+=\`Basic\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('a2272429', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('09eb08ed', 'id'))}">\`
elements+=\`open-all\`
elements+=\`</code>\`
elements+=\` expands every branch; otherwise branches start collapsed and open on the toggle. Bind initial open branches with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ee2369c', 'id'))}">\`
elements+=\`opened\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('30eba979', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview" role="tree" id="\${ty_escapeAttr(ty_generateId('fd0f196c', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul class="w-treeview-list" role="presentation" id="\${ty_escapeAttr(ty_generateId('2b5c20fe', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node open" role="treeitem" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('07ed831b', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('4ea297d8', 'id'))}">\`
elements+=\`<button class="w-treeview-toggle" type="button" id="\${ty_escapeAttr(ty_generateId('0432b441', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('ad79a427', 'id'))}">\`
elements+=\`Components\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<ul class="w-treeview-list" role="group" id="\${ty_escapeAttr(ty_generateId('39d8d9df', 'id'))}">\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('49258c10', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('2d44deb7', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('b6236c56', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('551f750c', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</li>\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('391fc5d1', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('fb69ea3c', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('f98997c1', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('853944ec', 'id'))}">\`
elements+=\`Display\`
elements+=\`</span>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('6100791a', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview opened="[&#39;components&#39;]" items="[{&#39;title&#39;:&#39;Components&#39;,&#39;value&#39;:&#39;components&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Inputs&#39;,&#39;value&#39;:&#39;inputs&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Checkbox&#39;,&#39;value&#39;:&#39;checkbox&#39;},{&#39;title&#39;:&#39;Select&#39;,&#39;value&#39;:&#39;select&#39;}]},{&#39;title&#39;:&#39;Display&#39;,&#39;value&#39;:&#39;display&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Tables&#39;,&#39;value&#39;:&#39;tables&#39;},{&#39;title&#39;:&#39;Treeview&#39;,&#39;value&#39;:&#39;treeview&#39;}]}]}]" id="\${ty_escapeAttr(ty_generateId('af66fdac', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('a8d39a31', 'id'))}">\`
elements+=\`Activatable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('22ba7af1', 'id'))}">\`
elements+=\`With \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ec1d9504', 'id'))}">\`
elements+=\`activatable\`
elements+=\`</code>\`
elements+=\`, clicking a row highlights it and the treeview reports the value through a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('e5e951df', 'id'))}">\`
elements+=\`change\`
elements+=\`</code>\`
elements+=\` event (\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('80828fc1', 'id'))}">\`
elements+=\`detail.name === &#39;activated&#39;\`
elements+=\`</code>\`
elements+=\`). Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b055646e', 'id'))}">\`
elements+=\`multiple-active\`
elements+=\`</code>\`
elements+=\` to keep more than one row active.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('975b2ef2', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview w-treeview--activatable" role="tree" id="\${ty_escapeAttr(ty_generateId('0e03a3a7', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul class="w-treeview-list" role="presentation" id="\${ty_escapeAttr(ty_generateId('98dbc0c2', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('47d458a5', 'id'))}">\`
elements+=\`<div class="w-treeview-row active" id="\${ty_escapeAttr(ty_generateId('fd251a70', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('7d49b386', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('b7f2f5a4', 'id'))}">\`
elements+=\`Dashboard\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('651659be', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('5d96b45f', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('9c76fffe', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('a59b5c3f', 'id'))}">\`
elements+=\`Reports\`
elements+=\`</span>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cf80157c', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview activatable="" open-all="" activated="[&#39;tables&#39;]" items="[{&#39;title&#39;:&#39;Components&#39;,&#39;value&#39;:&#39;components&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Inputs&#39;,&#39;value&#39;:&#39;inputs&#39;},{&#39;title&#39;:&#39;Tables&#39;,&#39;value&#39;:&#39;tables&#39;},{&#39;title&#39;:&#39;Treeview&#39;,&#39;value&#39;:&#39;treeview&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('7cc8d60c', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('81bf3db6', 'id'))}">\`
elements+=\`Selectable &amp; selection types\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('feb0f452', 'id'))}">\`
elements+=\`With \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('73c63ab4', 'id'))}">\`
elements+=\`selectable\`
elements+=\`</code>\`
elements+=\`, each row gets a checkbox and the treeview reports a \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7f153b52', 'id'))}">\`
elements+=\`selected\`
elements+=\`</code>\`
elements+=\` array. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('cce1606d', 'id'))}">\`
elements+=\`select-strategy\`
elements+=\`</code>\`
elements+=\` controls cascade behaviour:\`
elements+=\`</p>\`
elements+=\`<ul id="\${ty_escapeAttr(ty_generateId('2c80cf6e', 'id'))}">\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('a60fbc0a', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('136c31c7', 'id'))}">\`
elements+=\`leaf\`
elements+=\`</code>\`
elements+=\` (default) — only leaf values are stored; a branch checkbox is checked when all of its leaves are, and indeterminate when some are.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('85f9693c', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('bb60999b', 'id'))}">\`
elements+=\`classic\`
elements+=\`</code>\`
elements+=\` — branches are stored too; selecting a branch selects it and every descendant.\`
elements+=\`</li>\`
elements+=\`
  \`
elements+=\`<li id="\${ty_escapeAttr(ty_generateId('09fb677e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6bb2cb80', 'id'))}">\`
elements+=\`independent\`
elements+=\`</code>\`
elements+=\` — every checkbox toggles on its own with no cascade.\`
elements+=\`</li>\`
elements+=\`
\`
elements+=\`</ul>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('cdb277e0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview w-treeview--selectable" role="tree" id="\${ty_escapeAttr(ty_generateId('0845db61', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul class="w-treeview-list" role="presentation" id="\${ty_escapeAttr(ty_generateId('5a0b8bed', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node open" role="treeitem" aria-expanded="true" id="\${ty_escapeAttr(ty_generateId('a5b86291', 'id'))}">\`
elements+=\`
          \`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('3c76c1e7', 'id'))}">\`
elements+=\`<button class="w-treeview-toggle" type="button" id="\${ty_escapeAttr(ty_generateId('53c21783', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`<span class="w-treeview-checkbox" role="checkbox" aria-checked="mixed" id="\${ty_escapeAttr(ty_generateId('21ddd435', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('48e7e846', 'id'))}">\`
elements+=\`Inputs\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`
          \`
elements+=\`<ul class="w-treeview-list" role="group" id="\${ty_escapeAttr(ty_generateId('d91044d6', 'id'))}">\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('0e53496c', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('988de467', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('9459b258', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-checkbox" role="checkbox" aria-checked="true" id="\${ty_escapeAttr(ty_generateId('a3455cbf', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('b0984907', 'id'))}">\`
elements+=\`Checkbox\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</li>\`
elements+=\`
            \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('440cc661', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('e6548265', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('6320f809', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-checkbox" role="checkbox" aria-checked="false" id="\${ty_escapeAttr(ty_generateId('e42883ec', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('e4e80a46', 'id'))}">\`
elements+=\`Select\`
elements+=\`</span>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('a7be14e0', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview selectable="" open-all="" select-strategy="leaf" selected="[&#39;checkbox&#39;]" items="[{&#39;title&#39;:&#39;Inputs&#39;,&#39;value&#39;:&#39;inputs&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Checkbox&#39;,&#39;value&#39;:&#39;checkbox&#39;},{&#39;title&#39;:&#39;Select&#39;,&#39;value&#39;:&#39;select&#39;}]},{&#39;title&#39;:&#39;Display&#39;,&#39;value&#39;:&#39;display&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Tables&#39;,&#39;value&#39;:&#39;tables&#39;},{&#39;title&#39;:&#39;Treeview&#39;,&#39;value&#39;:&#39;treeview&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('75380c63', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('9451e2e5', 'id'))}">\`
elements+=\`Open on click\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('d9a85c03', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('7fc1f789', 'id'))}">\`
elements+=\`open-on-click\`
elements+=\`</code>\`
elements+=\` expands a branch when its row (not just the toggle) is clicked.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('082e68e8', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview" role="tree" id="\${ty_escapeAttr(ty_generateId('2d1b8d16', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul class="w-treeview-list" role="presentation" id="\${ty_escapeAttr(ty_generateId('e647aeeb', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node" role="treeitem" aria-expanded="false" id="\${ty_escapeAttr(ty_generateId('879b625b', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('85d46799', 'id'))}">\`
elements+=\`<button class="w-treeview-toggle" type="button" id="\${ty_escapeAttr(ty_generateId('df00959e', 'id'))}">\`
elements+=\`›\`
elements+=\`</button>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('7be85264', 'id'))}">\`
elements+=\`Workspace\`
elements+=\`</span>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('611e04d5', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview open-on-click="" items="[{&#39;title&#39;:&#39;Workspace&#39;,&#39;value&#39;:&#39;workspace&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;Projects&#39;,&#39;value&#39;:&#39;projects&#39;},{&#39;title&#39;:&#39;Members&#39;,&#39;value&#39;:&#39;members&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('98490a07', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('67d4c8c9', 'id'))}">\`
elements+=\`Density, rounded &amp; hoverable\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('15d8d780', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2429d7a2', 'id'))}">\`
elements+=\`density="compact"\`
elements+=\`</code>\`
elements+=\` tightens row height, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6b1caac4', 'id'))}">\`
elements+=\`rounded\`
elements+=\`</code>\`
elements+=\` pills the rows, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('22c413f9', 'id'))}">\`
elements+=\`hoverable\`
elements+=\`</code>\`
elements+=\` highlights rows on hover. \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('aea5b1e6', 'id'))}">\`
elements+=\`color\`
elements+=\`</code>\`
elements+=\` sets the active/selected accent.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('3012ca18', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-treeview w-treeview--compact w-treeview--rounded w-treeview--hoverable" role="tree" id="\${ty_escapeAttr(ty_generateId('e546d3b5', 'id'))}">\`
elements+=\`
      \`
elements+=\`<ul class="w-treeview-list" role="presentation" id="\${ty_escapeAttr(ty_generateId('ffd6e334', 'id'))}">\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('e6870ba6', 'id'))}">\`
elements+=\`<div class="w-treeview-row active" id="\${ty_escapeAttr(ty_generateId('fb5d022a', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('7f4731fa', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('a94d7982', 'id'))}">\`
elements+=\`Overview\`
elements+=\`</span>\`
elements+=\`</div>\`
elements+=\`</li>\`
elements+=\`
        \`
elements+=\`<li class="w-treeview-node" role="treeitem" id="\${ty_escapeAttr(ty_generateId('573175c3', 'id'))}">\`
elements+=\`<div class="w-treeview-row" id="\${ty_escapeAttr(ty_generateId('ce5bd52c', 'id'))}">\`
elements+=\`<span class="w-treeview-leaf" id="\${ty_escapeAttr(ty_generateId('9efb67ba', 'id'))}">\`
elements+=\`</span>\`
elements+=\`<span class="w-treeview-label" id="\${ty_escapeAttr(ty_generateId('4b3f3d24', 'id'))}">\`
elements+=\`Settings\`
elements+=\`</span>\`
elements+=\`</div>\`
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
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('cc2063cb', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-treeview activatable="" density="compact" rounded="" hoverable="" color="var(--w-secondary)" activated="[&#39;overview&#39;]" items="[{&#39;title&#39;:&#39;Overview&#39;,&#39;value&#39;:&#39;overview&#39;},{&#39;title&#39;:&#39;Settings&#39;,&#39;value&#39;:&#39;settings&#39;,&#39;children&#39;:[{&#39;title&#39;:&#39;General&#39;,&#39;value&#39;:&#39;general&#39;},{&#39;title&#39;:&#39;Billing&#39;,&#39;value&#39;:&#39;billing&#39;}]}]" id="\${ty_escapeAttr(ty_generateId('e4a4dac9', 'id'))}">\`
elements+=\`</w-treeview>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`

        return elements;
    };
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/treeview/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
