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

        elements+=\`<h1 id="\${ty_escapeAttr(ty_generateId('6b097fd7', 'id'))}">\`
elements+=\`Data Tables: Data and Display\`
elements+=\`</h1>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('b837fd17', 'id'))}">\`
elements+=\`Shaping the data and how it&#8217;s shown in \`
elements+=\`<a href="/docs/components/data-tables/introduction" id="\${ty_escapeAttr(ty_generateId('4c50112e', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('657d70c3', 'id'))}">\`
elements+=\`w-data-table\`
elements+=\`</code>\`
elements+=\`</a>\`
elements+=\`: rich column definitions, row selection, expandable detail rows, density, and loading / empty states. See \`
elements+=\`<a href="/docs/components/data-tables/basics" id="\${ty_escapeAttr(ty_generateId('30b7f0bf', 'id'))}">\`
elements+=\`Basics\`
elements+=\`</a>\`
elements+=\` for sorting, search, and pagination.\`
elements+=\`</p>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f3abd079', 'id'))}">\`
elements+=\`Rich headers\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('2d97a152', 'id'))}">\`
elements+=\`For control over each column, set the \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ceef8785', 'id'))}">\`
elements+=\`headers\`
elements+=\`</code>\`
elements+=\` (and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0f8ab505', 'id'))}">\`
elements+=\`items\`
elements+=\`</code>\`
elements+=\`) \`
elements+=\`<em id="\${ty_escapeAttr(ty_generateId('2c1a2dab', 'id'))}">\`
elements+=\`property\`
elements+=\`</em>\`
elements+=\` to JSON objects with \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0116825c', 'id'))}">\`
elements+=\`title\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('ed9a7dd0', 'id'))}">\`
elements+=\`key\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('17fffe9f', 'id'))}">\`
elements+=\`align\`
elements+=\`</code>\`
elements+=\`, \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('0ebbb5a3', 'id'))}">\`
elements+=\`sortable\`
elements+=\`</code>\`
elements+=\`, and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('f64418ca', 'id'))}">\`
elements+=\`width\`
elements+=\`</code>\`
elements+=\`. Objects are matched to columns by \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('304a7eaf', 'id'))}">\`
elements+=\`key\`
elements+=\`</code>\`
elements+=\`. (Set these in JS rather than as attributes, since JSON in markup is awkward to escape.)\`
elements+=\`</p>\`
elements+=\`<pre class="code-block" id="\${ty_escapeAttr(ty_generateId('51400137', 'id'))}">\`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8797f4d2', 'id'))}">\`
elements+=\`const table = document.querySelector('w-data-table');
table.headers = [
  &#123; title: 'Dessert', key: 'name' &#125;,
  &#123; title: 'Calories', key: 'calories', align: 'end' &#125;,
  &#123; title: 'Type', key: 'type', sortable: false &#125;,
];
table.items = [
  &#123; name: 'Frozen yogurt', calories: 159, type: 'Frozen' &#125;,
  &#123; name: 'Eclair', calories: 262, type: 'Pastry' &#125;,
];\`
elements+=\`</code>\`
elements+=\`</pre>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('f7406b48', 'id'))}">\`
elements+=\`Selectable rows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('979521bd', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40650b39', 'id'))}">\`
elements+=\`show-select\`
elements+=\`</code>\`
elements+=\` for a checkbox column with a select-all header. Use \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('507e0a21', 'id'))}">\`
elements+=\`item-value\`
elements+=\`</code>\`
elements+=\` to identify rows and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('8f718ef0', 'id'))}">\`
elements+=\`select-strategy="single"\`
elements+=\`</code>\`
elements+=\` for single selection. Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('4fec0c3c', 'id'))}">\`
elements+=\`update:selected\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('d8fcdfb4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('cd681a8e', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('f8e624bc', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('38e230bd', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('52c2d070', 'id'))}">\`
elements+=\`<th class="w-table-select" id="\${ty_escapeAttr(ty_generateId('f6d469bb', 'id'))}">\`
elements+=\`<input type="checkbox" aria-label="Select all" id="\${ty_escapeAttr(ty_generateId('2f901e40', 'id'))}" />\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('882d2367', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('de260a1b', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('51681153', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr class="selected" id="\${ty_escapeAttr(ty_generateId('a20c3987', 'id'))}">\`
elements+=\`<td class="w-table-select" id="\${ty_escapeAttr(ty_generateId('81126d04', 'id'))}">\`
elements+=\`<input type="checkbox" checked="" aria-label="Select row" id="\${ty_escapeAttr(ty_generateId('d5ad2d79', 'id'))}" />\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('0dfb5508', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('e3fd83d5', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('0ea9a518', 'id'))}">\`
elements+=\`<td class="w-table-select" id="\${ty_escapeAttr(ty_generateId('b57979b8', 'id'))}">\`
elements+=\`<input type="checkbox" aria-label="Select row" id="\${ty_escapeAttr(ty_generateId('efebbf11', 'id'))}" />\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('93994c78', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('2220ccf1', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('68c754b6', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table show-select="" item-value="Dessert" headers="[Dessert,Calories]" items="[Frozen yogurt|159; Eclair|262; Cupcake|305]" items-per-page="10" id="\${ty_escapeAttr(ty_generateId('364201ae', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('789b2f1b', 'id'))}">\`
elements+=\`Expandable rows\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('01292cfa', 'id'))}">\`
elements+=\`Add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('38b60e77', 'id'))}">\`
elements+=\`show-expand\`
elements+=\`</code>\`
elements+=\` for a toggle that reveals a detail row listing every field. Listen for \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('719b051a', 'id'))}">\`
elements+=\`update:expanded\`
elements+=\`</code>\`
elements+=\`.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('0cdc7917', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('51e212be', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('1b601482', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('1e366988', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9f8b337e', 'id'))}">\`
elements+=\`<th class="w-table-expand" id="\${ty_escapeAttr(ty_generateId('915b8839', 'id'))}">\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('11e4f925', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('74dccf56', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('93c23006', 'id'))}">\`
elements+=\`
          \`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('2480b3df', 'id'))}">\`
elements+=\`<td class="w-table-expand" id="\${ty_escapeAttr(ty_generateId('d198f310', 'id'))}">\`
elements+=\`<button class="w-table-expand-btn" type="button" id="\${ty_escapeAttr(ty_generateId('2eed16b5', 'id'))}">\`
elements+=\`▾\`
elements+=\`</button>\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('bcbdce6f', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('570f24e9', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
          \`
elements+=\`<tr class="w-data-table-expanded" id="\${ty_escapeAttr(ty_generateId('b7c0619d', 'id'))}">\`
elements+=\`<td colspan="3" id="\${ty_escapeAttr(ty_generateId('640a6747', 'id'))}">\`
elements+=\`<div class="w-data-table-detail" id="\${ty_escapeAttr(ty_generateId('9d62b640', 'id'))}">\`
elements+=\`<div id="\${ty_escapeAttr(ty_generateId('ff6664d3', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('75953e16', 'id'))}">\`
elements+=\`Dessert:\`
elements+=\`</strong>\`
elements+=\` Frozen yogurt\`
elements+=\`</div>\`
elements+=\`<div id="\${ty_escapeAttr(ty_generateId('60fb3467', 'id'))}">\`
elements+=\`<strong id="\${ty_escapeAttr(ty_generateId('59d8e1aa', 'id'))}">\`
elements+=\`Calories:\`
elements+=\`</strong>\`
elements+=\` 159\`
elements+=\`</div>\`
elements+=\`</div>\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`
        \`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('2d5758ac', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table show-expand="" item-value="Dessert" headers="[Dessert,Calories]" items="[Frozen yogurt|159; Eclair|262]" items-per-page="10" id="\${ty_escapeAttr(ty_generateId('32701de9', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('1c789a9f', 'id'))}">\`
elements+=\`Density &amp; styling\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('e56f0072', 'id'))}">\`
elements+=\`Set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2cf63f1a', 'id'))}">\`
elements+=\`density\`
elements+=\`</code>\`
elements+=\` to \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('40b07771', 'id'))}">\`
elements+=\`comfortable\`
elements+=\`</code>\`
elements+=\` or \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('6bd48f02', 'id'))}">\`
elements+=\`compact\`
elements+=\`</code>\`
elements+=\`; add \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('2c4fb145', 'id'))}">\`
elements+=\`striped\`
elements+=\`</code>\`
elements+=\` and \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('b261aa2f', 'id'))}">\`
elements+=\`hover\`
elements+=\`</code>\`
elements+=\` for row styling.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('a1a21e41', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('59a47871', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table w-table--dense w-table--striped" id="\${ty_escapeAttr(ty_generateId('fa9748a5', 'id'))}">\`
elements+=\`
        \`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('2912aa9d', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('9eae3c8c', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('f0860369', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('6a844e27', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
        \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('b6587f0b', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('158d1e7f', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('ab043f0b', 'id'))}">\`
elements+=\`Frozen yogurt\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('8af95f2a', 'id'))}">\`
elements+=\`159\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('76f65651', 'id'))}">\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('10c8fea5', 'id'))}">\`
elements+=\`Eclair\`
elements+=\`</td>\`
elements+=\`<td id="\${ty_escapeAttr(ty_generateId('6f099425', 'id'))}">\`
elements+=\`262\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tbody>\`
elements+=\`
      \`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('af05cffa', 'id'))}">\`
elements+=\`
    \`
elements+=\`<w-data-table density="compact" striped="" hover="" headers="[Dessert,Calories]" items-per-page="10" items="[Frozen yogurt|159; Ice cream sandwich|237; Eclair|262; Cupcake|305]" id="\${ty_escapeAttr(ty_generateId('a5ce54ea', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
\`
elements+=\`</demo-compare>\`
elements+=\`<h2 id="\${ty_escapeAttr(ty_generateId('956c5e25', 'id'))}">\`
elements+=\`Loading &amp; no data\`
elements+=\`</h2>\`
elements+=\`<p id="\${ty_escapeAttr(ty_generateId('3c0b82b3', 'id'))}">\`
elements+=\`Toggle \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('3406917f', 'id'))}">\`
elements+=\`loading\`
elements+=\`</code>\`
elements+=\` for the progress bar; set \`
elements+=\`<code id="\${ty_escapeAttr(ty_generateId('1aff962f', 'id'))}">\`
elements+=\`no-data-text\`
elements+=\`</code>\`
elements+=\` for the empty message.\`
elements+=\`</p>\`
elements+=\`<demo-compare >\`
elements+=\`
  \`
elements+=\`<div slot="css" id="\${ty_escapeAttr(ty_generateId('87432ad4', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-table-wrap" id="\${ty_escapeAttr(ty_generateId('e04a361b', 'id'))}">\`
elements+=\`
      \`
elements+=\`<table class="w-table" id="\${ty_escapeAttr(ty_generateId('681fe3a7', 'id'))}">\`
elements+=\`<thead id="\${ty_escapeAttr(ty_generateId('f3e10469', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('a6debe5a', 'id'))}">\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('182d3c3d', 'id'))}">\`
elements+=\`Dessert\`
elements+=\`</th>\`
elements+=\`<th id="\${ty_escapeAttr(ty_generateId('4a0ebbcc', 'id'))}">\`
elements+=\`Calories\`
elements+=\`</th>\`
elements+=\`</tr>\`
elements+=\`</thead>\`
elements+=\`
      \`
elements+=\`<tbody id="\${ty_escapeAttr(ty_generateId('2f2d3b77', 'id'))}">\`
elements+=\`<tr id="\${ty_escapeAttr(ty_generateId('3eef2689', 'id'))}">\`
elements+=\`<td colspan="2" class="w-table-message" id="\${ty_escapeAttr(ty_generateId('22076769', 'id'))}">\`
elements+=\`No data available\`
elements+=\`</td>\`
elements+=\`</tr>\`
elements+=\`</tbody>\`
elements+=\`</table>\`
elements+=\`
    \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`</div>\`
elements+=\`
  \`
elements+=\`<div slot="wc" id="\${ty_escapeAttr(ty_generateId('8078e1ac', 'id'))}">\`
elements+=\`
    \`
elements+=\`<div class="w-stack" id="\${ty_escapeAttr(ty_generateId('4cd11bad', 'id'))}">\`
elements+=\`
      \`
elements+=\`<w-data-table loading="" headers="[Dessert,Calories]" items="[Frozen yogurt|159; Eclair|262]" items-per-page="10" id="\${ty_escapeAttr(ty_generateId('64d25eec', 'id'))}">\`
elements+=\`</w-data-table>\`
elements+=\`
      \`
elements+=\`<w-data-table headers="[Dessert,Calories]" items="[]" no-data-text="No desserts found" id="\${ty_escapeAttr(ty_generateId('638763e9', 'id'))}">\`
elements+=\`</w-data-table>\`
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
}`);async function tac_default(props){return await __ty_compiled_factory__(ty_createHelpers("/pages/docs/components/data-tables/data-and-display/tac.js"),__ty_module_imports__,props)}export{tac_default as default};
