import {createHmac,timingSafeEqual} from 'node:crypto';
import {dbReady,findByRazorpayOrder,updateByRazorpayOrder} from '../../../../lib/orders-server';
export const runtime='nodejs';
export async function POST(request){try{
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=await request.json();const secret=process.env.RAZORPAY_KEY_SECRET,key=process.env.RAZORPAY_KEY_ID;if(!secret||!key||!dbReady()||![razorpay_order_id,razorpay_payment_id,razorpay_signature].every(x=>typeof x==='string'&&x.length>5))return Response.json({error:'Payment verification unavailable.'},{status:400});
 const expected=createHmac('sha256',secret).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');if(!/^[a-f0-9]{64}$/i.test(razorpay_signature))return Response.json({error:'Invalid signature.'},{status:401});const a=Buffer.from(expected,'hex'),b=Buffer.from(razorpay_signature,'hex');if(a.length!==b.length||!timingSafeEqual(a,b))return Response.json({error:'Invalid payment signature.'},{status:401});
 const order=await findByRazorpayOrder(razorpay_order_id);if(!order)return Response.json({error:'Unrecognized order.'},{status:404});
 const result=await fetch('https://api.razorpay.com/v1/payments/'+encodeURIComponent(razorpay_payment_id),{headers:{authorization:'Basic '+Buffer.from(key+':'+secret).toString('base64')},cache:'no-store'});const payment=await result.json();if(!result.ok||payment.order_id!==razorpay_order_id||payment.amount!==order.amount_paise||payment.currency!=='INR'||payment.status!=='captured')return Response.json({error:'Payment is not yet captured or amount does not match. Contact the showroom with payment reference.'},{status:409});
 if(order.razorpay_payment_id&&order.razorpay_payment_id!==razorpay_payment_id)return Response.json({error:'Order is already associated with a different payment.'},{status:409});
 await updateByRazorpayOrder(razorpay_order_id,{razorpay_payment_id,status:'paid'});
 return Response.json({verified:true,paymentId:razorpay_payment_id,status:'paid',fulfilmentReady:false});
 }catch{return Response.json({error:'Could not verify payment or persist order.'},{status:500})}}
