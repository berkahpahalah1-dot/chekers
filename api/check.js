export default function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Gunakan POST"});}
 const raw=typeof req.body?.emails==="string"?req.body.emails:"";
 const emails=[...new Set(raw.split(/[\\n,;\\s]+/).map(x=>x.trim().toLowerCase()).filter(Boolean))];
 if(!emails.length)return res.status(400).json({error:"Masukkan minimal satu alamat"});
 if(emails.length>100)return res.status(400).json({error:"Maksimal 100 alamat per pemeriksaan"});
 const results=emails.map(email=>{
  const valid=/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\\.com$/i.test(email)&&email.length<=254&&!email.includes("..")&&!email.startsWith(".")&&!email.split("@")[0].endsWith(".");
  return {email,format:valid?"valid":"invalid",accountStatus:valid?"unknown":"not_applicable",category:valid?"Unknown":"Not Exist"};
 });
 return res.status(200).json({mode:"safe_format_check",note:"Good/Verified/Disabled/Not Exist account status cannot be confirmed through public Gmail API. 'Not Exist' here means invalid Gmail format only.",total:results.length,good:results.filter(x=>x.format==="valid").length,invalid:results.filter(x=>x.format==="invalid").length,unknown:results.filter(x=>x.category==="Unknown").length,results});
}
