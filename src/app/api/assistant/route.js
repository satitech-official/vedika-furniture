import {products} from '../../../lib/data';
export const runtime='nodejs';
const roles=new Set(['user','assistant']);
export async function POST(request){
 try{
  const body=await request.json();
  if(!Array.isArray(body?.messages)||body.messages.length>12)return Response.json({error:'Invalid conversation'},{status:400});
  const messages=body.messages.filter(x=>roles.has(x?.role)&&typeof x.content==='string').slice(-8).map(x=>({role:x.role,content:x.content.slice(0,600)}));
  if(!messages.some(m=>m.role==='user'))return Response.json({error:'Missing customer question'},{status:400});
  const key=process.env.OPENAI_API_KEY;if(!key)return Response.json({error:'Live AI not configured'},{status:503});
  const catalog=products.map(p=>({id:p.id,name:p.name,category:p.category,description:p.details,availability:'unverified',price:'on request'}));
  const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),14000);
  let response;
  try{response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:ctrl.signal,headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.VEDIKA_AI_MODEL||'gpt-4o-mini',temperature:0.5,max_tokens:320,response_format:{type:'json_object'},messages:[{role:'system',content:`You are Vedika Furniture's courteous shopping guide. Answer in the customer's language, briefly. Only the following illustrative catalogue concepts exist (no verified inventory): ${JSON.stringify(catalog)}. Never invent prices, delivery commitments, reviews, stock, actual inventory, 3D image output, payments or order confirmation. Always return a JSON object with reply (string) and productIds (array of up to 3 matching valid IDs). Direct interested customers to the room visualizer, shopping cart, enquiry or contact.`},...messages]})});}
  finally{clearTimeout(timeout)}
  if(!response.ok)throw Error('AI provider unavailable');
  const result=await response.json();const parsed=JSON.parse(result.choices?.[0]?.message?.content||'{}');
  if(typeof parsed.reply!=='string'||!parsed.reply.trim())throw Error('Empty AI response');
  const productIds=(Array.isArray(parsed.productIds)?parsed.productIds:[]).filter(id=>products.some(p=>p.id===id)).slice(0,3);
  return Response.json({reply:parsed.reply.slice(0,1100),productIds},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Live AI currently unavailable. Try again later or contact Vedika directly.'},{status:503})}
}
