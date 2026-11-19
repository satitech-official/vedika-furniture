import {createHash} from 'node:crypto';
export const dbReady=()=>Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
export const hashToken=s=>createHash('sha256').update(s).digest('hex');
const base=()=>process.env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/vedika_orders';
function headers(extra={}){return {'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'authorization':'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,'content-type':'application/json',...extra}}
async function checked(r){let body;try{body=await r.json()}catch{body=null}if(!r.ok)throw Error('Order database request failed ('+r.status+').');return body}
export async function insertOrder(record){return await checked(await fetch(base(),{method:'POST',headers:headers({Prefer:'return=representation'}),body:JSON.stringify(record),cache:'no-store'}))}
export async function findByRazorpayOrder(orderId){const u=base()+'?razorpay_order_id=eq.'+encodeURIComponent(orderId)+'&select=*';const d=await checked(await fetch(u,{headers:headers(),cache:'no-store'}));return d[0]||null}
export async function updateByRazorpayOrder(orderId,values){const u=base()+'?razorpay_order_id=eq.'+encodeURIComponent(orderId);const d=await checked(await fetch(u,{method:'PATCH',headers:headers({Prefer:'return=representation'}),body:JSON.stringify(values),cache:'no-store'}));if(!d.length)throw Error('Order not found for payment.');return d[0]}
export async function lookupTracking(token){const u=base()+'?tracking_token_hash=eq.'+encodeURIComponent(hashToken(token))+'&select=id,created_at,status,delivery_status,updated_at,items,amount_paise,shipping_paise';const d=await checked(await fetch(u,{headers:headers(),cache:'no-store'}));return d[0]||null}
