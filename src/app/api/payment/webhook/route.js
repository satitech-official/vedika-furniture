import {createHmac,timingSafeEqual} from 'node:crypto';
import {dbReady,findByRazorpayOrder,updateByRazorpayOrder} from '../../../../lib/orders-server';
export const runtime='nodejs';
export async function POST(request){try{
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;if(!secret||!dbReady())return Response.json({error:'Webhook not configured'},{status:503});
 const body=await request.text();const signature=request.headers.get('x-razorpay-signature')||'';if(!/^[a-f0-9]{64}$/i.test(signature))return Response.json({error:'Invalid signature'},{status:401});const expected=createHmac('sha256',secret).update(body).digest('hex');if(!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(signature,'hex')))return Response.json({error:'Signature mismatch'},{status:401});
 const evt=JSON.parse(body);if(evt.event!=='payment.captured')return Response.json({acknowledged:true});const payment=evt.payload?.payment?.entity;if(!payment?.order_id||!payment?.id)return Response.json({error:'Missing payment'},{status:422});
 const order=await findByRazorpayOrder(payment.order_id);if(!order)return Response.json({error:'Order not found; retry'},{status:503});if(payment.amount!==order.amount_paise||payment.currency!=='INR'||payment.status!=='captured')return Response.json({error:'Amount or status mismatch'},{status:422});if(order.razorpay_payment_id&&order.razorpay_payment_id!==payment.id)return Response.json({error:'Conflicting payment id'},{status:409});
 if(order.status!=='paid')await updateByRazorpayOrder(payment.order_id,{status:'paid',razorpay_payment_id:payment.id});return Response.json({acknowledged:true});
 }catch{return Response.json({error:'Webhook processing failed; retry'},{status:500})}}
