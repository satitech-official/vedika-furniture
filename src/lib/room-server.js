const MAX=8*1024*1024;
export async function parseRoom(request){
 const ct=request.headers.get('content-type')||'';if(!ct.includes('multipart/form-data'))throw Error('Expected image upload.');
 const data=await request.formData();const file=data.get('image');if(!(file instanceof File)||!['image/jpeg','image/png','image/webp'].includes(file.type)||!file.size||file.size>MAX)throw Error('Upload a valid JPG, PNG or WebP image under 8 MB.');
 const type=String(data.get('type')||'living');if(!['living','bedroom','dining'].includes(type))throw Error('Invalid room type.');
 const style=String(data.get('style')||'Modern').slice(0,60),finish=String(data.get('finish')||'walnut').slice(0,30),budget=String(data.get('budget')||'Not specified').slice(0,60),dimensions=String(data.get('dimensions')||'Unspecified').slice(0,100),summary=String(data.get('summary')||'').slice(0,1000);
 return {file,type,style,finish,budget,dimensions,summary};
}
export function roomGuard(request){if(Number(request.headers.get('content-length')||0)>9*1024*1024)return Response.json({error:'Image is too large.'},{status:413});}
