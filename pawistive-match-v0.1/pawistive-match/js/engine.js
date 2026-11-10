export const WEIGHTS = Object.freeze({energy:30,alone:25,training:20,medical:15,space:10});
export function match(d,a){
 const blocked=[],concerns=[],strengths=[];
 for(const [field,present,label] of [['children',a.children==='yes','children'],['cats',a.cats==='yes','cats'],['dogs',a.dogs==='yes','other dogs']]){
  if(!present)continue;
  if(d[field]==='no')blocked.push(`Documented incompatibility with ${label}.`);
  else if(d[field]!=='yes')concerns.push(`Compatibility with ${label} is unknown; staff assessment required.`);
  else strengths.push(`Documented compatibility with ${label}.`);
 }
 if(d.medical&&a.medical==='no')blocked.push('Care needs exceed the medical support you selected.');
 if(d.status!=='available')blocked.push('Not currently available.');
 const factors={energy:Math.max(0,1-Math.abs(d.energy-Number(a.activity))/2),alone:Number(a.alone)<=d.maxAlone?1:Math.max(0,1-(Number(a.alone)-d.maxAlone)/6),training:Number(a.training)>=d.training?1:Math.max(0,1-(d.training-Number(a.training))/3),medical:d.medical?(a.medical==='yes'?1:0.5):1,space:a.exercise==='yes'?1:0.3};
 if(factors.energy===1)strengths.push('Daily activity preferences align.');else concerns.push('Discuss exercise expectations with staff.');
 if(factors.alone===1)strengths.push('Planned alone time fits the recorded routine.');else concerns.push('Arrange additional daytime companionship or care.');
 if(factors.training===1)strengths.push('Training commitment meets recorded needs.');else concerns.push('Additional training support may be needed.');
 if(a.exercise!=='yes')concerns.push('A reliable daily exercise plan needs discussion.');
 if(a.medical==='discuss'&&d.medical)concerns.push('Review the specific medical care plan with staff.');
 const score=Math.round(Object.entries(WEIGHTS).reduce((n,[k,v])=>n+factors[k]*v,0));
 return {dog:d,score,blocked,concerns,strengths,factors,review:concerns.length>0};
}
export function rank(dogs,a){return dogs.map(d=>match(d,a)).filter(m=>!m.blocked.length).sort((x,y)=>y.score-x.score||x.dog.id.localeCompare(y.dog.id));}
export function evaluate(cases){
 const rows=cases.map(c=>{const r=rank(c.dogs,c.adopter),i=r.findIndex(m=>m.dog.id===c.adoptedDogId);return {caseId:c.id,rank:i<0?null:i+1,top3:i>=0&&i<3,top5:i>=0&&i<5,candidates:r.length};});
 return {rows,cases:rows.length,top3:rows.length?rows.filter(r=>r.top3).length/rows.length:null,top5:rows.length?rows.filter(r=>r.top5).length/rows.length:null};
}
export function validateDogs(v){
 if(!Array.isArray(v)||v.length>500)throw Error('Use an array with at most 500 dog records.');
 const ids=new Set();
 for(const d of v){
  if(!d||typeof d.id!=='string'||!d.id||ids.has(d.id))throw Error('Every dog needs a unique ID.');ids.add(d.id);
  for(const k of ['name','bio','care','adoption','source','updated','size'])if(typeof d[k]!=='string'||!d[k].trim())throw Error(`Missing text field: ${k}`);
  for(const k of ['energy','training'])if(![1,2,3].includes(d[k]))throw Error(`Invalid ${k}.`);
  if(!Number.isFinite(d.maxAlone)||d.maxAlone<0||d.maxAlone>12||!Number.isFinite(d.age)||d.age<0||d.age>30)throw Error('Invalid age or alone time.');
  for(const k of ['children','cats','dogs'])if(!['yes','no','unknown'].includes(d[k]))throw Error(`Invalid ${k} compatibility.`);
  if(typeof d.medical!=='boolean'||!['available','adopted','hold'].includes(d.status))throw Error('Invalid care or status field.');
  if(d.photo&&!/^https:\/\//i.test(d.photo)&&!/^data:image\/(png|jpeg|webp);base64,/i.test(d.photo))throw Error('Photo must be HTTPS or an uploaded PNG/JPEG/WebP.');
 }
 return v;
}
