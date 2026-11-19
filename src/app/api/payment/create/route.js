import {randomBytes} from 'node:crypto';
import {products} from '../../../../lib/data';
import {dbReady,hashToken,insertOrder} from '../../../../lib/orders-server';
export const runtime='nodejs';
export async function POST(request){
 try{
  const key=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET;
  let prices;try{prices=JSON.parse(process.env.VEDIKA_VERIFIED_PRICES_PAISE||'{}')}catch{prices={}}
  const shipping=Number(process.env.VEDIKA_DELIVERY_CHARGE_PAISE);
  if(!key||!secret||!dbReady()||!Object.keys(prices).length||!Number.isSafeInteger(shipping)||shipping<0||process.env.VEDIKA_CHECKOUT_ENABLED!=='true')return Response.json({error:'Live checkout is disabled until verified prices, delivery fee, Supabase database and Razorpay credentials are configured.'},{status:503});
  const {cart,customer}=await request.json();
  if(!Array.isArray(cart)||!cart.length||cart.length>30)return Response.json({error:'Invalid cart.'},{status:400});
  if(!customer||!/^[0-9]{10}$/.test(customer.phone||'')||!/^[0-9]{6}$/.test(customer.pincode||'')||!customer.name?.trim()||!customer.address?.trim()||!customer.city?.trim()||!customer.state?.trim()||customer.consent!==true)return Response.json({error:'Please enter valid checkout details and consent.'},{status:400});
  let total=shipping;const items=[];
  for(const i of cart){const product=products.find(p=>p.id===i.id),price=prices[i.id];if(!product||!Number.isSafeInteger(i.qty)||i.qty<1||i.qty>20||!Number.isSafeInteger(price)||price<100)return Response.json({error:'Product pricing is not verified for your selection.'},{status:422});total+=price*i.qty;items.push({id:i.id,name:product.name,qty:i.qty,unit_price_paise:price})}
  if(!Number.isSafeInteger(total)||total>500000000)return Response.json({error:'Cart amount invalid.'},{status:400});
  const orderRes=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{authorization:'Basic '+Buffer.from(key+':'+secret).toString('base64'),'content-type':'application/json'},body:JSON.stringify({amount:total,currency:'INR',receipt:'vedika_'+randomBytes(8).toString('hex'),notes:{items:JSON.stringify(items.map(i=>({id:i.id,qty:i.qty}))).slice(0,250),pincode:customer.pincode}}),cache:'no-store'});
  const order=await orderRes.json();if(!orderRes.ok||!order.id)return Response.json({error:'Payment provider could not initialize checkout.'},{status:502});
  const trackingToken=randomBytes(24).toString('hex');
  await insertOrder({razorpay_order_id:order.id,tracking_token_hash:hashToken(trackingToken),customer:{name:customer.name,phone:customer.phone,email:customer.email||'',address:customer.address,city:customer.city,state:customer.state,pincode:customer.pincode,delivery:customer.delivery,instructions:String(customer.instructions||'').slice(0,800)},items,amount_paise:total,shipping_paise:shipping,status:'payment_pending',delivery_status:'not_dispatched'});
  return Response.json({orderId:order.id,amount:order.amount,keyId:key,trackingToken});
 }catch(e){return Response.json({error:'Payment initialization unavailable. Database or provider configuration may be incomplete.'},{status:500})}
}
