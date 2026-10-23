export default function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Gunakan POST"});}
 const raw=typeof req.body?.emails==="string"?req.body.emails:"";
 const emails=[...new Set(raw.split(/[\\n,;\\s]+/).map(x=>x.trim().toLowerCase()).filter(Boolean))];
 if(!emails.length)return res.status(400).json({error:"Masukkan minimal satu alamat"});
 if(emails.length>500)return res.status(400).json({error:"Maksimal 500 alamat"});
 const results=emails.map(email=>({email,status:/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\\.com$/i.test(email)&&email.length<=254&&!email.includes("..")&&!email.startsWith(".")&&!email.split("@")[0].endsWith(".")?"format_valid":"invalid_format"}));
 return res.status(200).json({mode:"syntax_only",note:"Hanya memeriksa format. API publik Gmail tidak mengungkap status akun orang lain.",total:results.length,valid:results.filter(x=>x.status==="format_valid").length,invalid:results.filter(x=>x.status==="invalid_format").length,results});
}
