const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const typed=(expr,answers,hint,partials=[])=>({type:'typed',expr,answers,partials,hint});
const choice=(expr,correct,options,hint)=>({type:'choice',expr,correct,options,hint});
const orders=(a,b,prefix='')=>[`${prefix}${a}${b}`,`${prefix}${b}${a}`];

const stages=[
  {id:'gcf',title:'Greatest Common Factor',desc:'Find what every term shares.',icon:'⊓',tool:'GCF Extractor',prompt:'Factor out the greatest common factor.',paper:'Divide every term by your GCF before entering the result.',check:['Find the greatest number.','Use the smallest exponent.','Check every term.'],questions:[
    typed('12x³ − 18x²',['6x²(2x-3)','6x^2(2x-3)'],'The greatest numerical factor is 6. Both terms contain at least x².',['6x²','6x^2']),
    typed('15a⁴ + 25a³ − 10a²',['5a²(3a²+5a-2)','5a^2(3a^2+5a-2)'],'The coefficients share 5. Use the smallest exponent of a: a².',['5a²','5a^2']),
    typed('−8m³ + 12m² − 20m',['-4m(2m²-3m+5)','-4m(2m^2-3m+5)','−4m(2m²−3m+5)'],'A negative GCF makes the leading term inside the parentheses positive.',['-4m','−4m'])]},
  {id:'a1',title:'Trinomials · a = 1',desc:'Use factor pairs and the middle sum.',icon:'x²',tool:'Factor-Pair Gauge',prompt:'Factor the trinomial completely.',paper:'Find two integers whose product is c and whose sum is b.',check:['List factor pairs of c.','Match the middle-term sum.','Check signs by multiplying.'],questions:[
    typed('x² + 7x + 12',orders('(x+3)','(x+4)'),'Find two numbers that multiply to 12 and add to 7.'),
    typed('x² − 2x − 15',orders('(x-5)','(x+3)'),'The product is negative, so the factor signs are different.'),
    typed('x² − 9x + 20',orders('(x-4)','(x-5)'),'Both numbers multiply to positive 20 and add to negative 9.')]},
  {id:'group',title:'Factoring by Grouping',desc:'Pair four terms to reveal a binomial.',icon:'⋮',tool:'Grouping Clamp',prompt:'Factor by grouping.',paper:'Group the first two and last two terms, then factor each pair.',check:['Create two useful pairs.','Factor each pair.','Match the common binomial.'],questions:[
    typed('x³ + 3x² + 2x + 6',orders('(x+3)','(x²+2)'),'Factor x² from the first pair and 2 from the second pair.'),
    typed('2x³ − 6x² + x − 3',orders('(x-3)','(2x²+1)'),'The common binomial should be (x − 3).'),
    typed('3x³ + 6x² − 5x − 10',orders('(x+2)','(3x²-5)'),'Factor 3x² from the first pair and −5 from the second.')]},
  {id:'ac',title:'Trinomials · a ≠ 1',desc:'Split the middle term with the AC method.',icon:'ac',tool:'AC Splitter',prompt:'Factor the trinomial completely.',paper:'Multiply a·c, split the middle term, and finish by grouping.',check:['Compute a·c.','Find a factor pair with sum b.','Group the four resulting terms.'],questions:[
    typed('6x² + 11x + 3',orders('(3x+1)','(2x+3)'),'The AC product is 18; use 9 and 2 to split 11x.'),
    typed('8x² − 2x − 3',orders('(4x-3)','(2x+1)'),'The AC product is −24; use −6 and 4.'),
    typed('10x² − 7x − 12',orders('(5x+4)','(2x-3)'),'The AC product is −120; use 8 and −15.')]},
  {id:'pst',title:'Perfect-Square Trinomials',desc:'Recognize a binomial squared.',icon:'□',tool:'Square-Pattern Frame',prompt:'Factor the perfect-square trinomial.',paper:'Check the first and last square roots, then verify the middle term is ±2ab.',check:['Take both square roots.','Check the sign of the middle term.','Verify 2ab.'],questions:[
    typed('x² + 10x + 25',['(x+5)²','(x+5)^2','(x+5)(x+5)'],'The square roots are x and 5; the middle term is +2(x)(5).'),
    typed('4x² − 12x + 9',['(2x-3)²','(2x-3)^2','(2x-3)(2x-3)'],'The square roots are 2x and 3; the middle term is negative.'),
    typed('9x² + 24x + 16',['(3x+4)²','(3x+4)^2','(3x+4)(3x+4)'],'Check that 2(3x)(4)=24x.')]},
  {id:'dos',title:'Difference of Squares',desc:'Two squares separated by subtraction.',icon:'−',tool:'Square Separator',prompt:'Factor completely using the difference-of-squares pattern.',paper:'Write each term as a square, then use (a − b)(a + b).',check:['Confirm there are two terms.','Confirm subtraction.','Inspect the resulting factors again.'],questions:[
    typed('x² − 49',orders('(x-7)','(x+7)'),'49 is 7².'),
    typed('9x² − 25',orders('(3x-5)','(3x+5)'),'The square roots are 3x and 5.'),
    typed('16x⁴ − 81',['(2x-3)(2x+3)(4x²+9)','(2x+3)(2x-3)(4x²+9)','(4x²+9)(2x-3)(2x+3)','(4x^2+9)(2x-3)(2x+3)'],'First factor (4x² − 9)(4x² + 9), then inspect 4x² − 9 again.')]},
  {id:'cubes',title:'Sum & Difference of Cubes',desc:'Apply the cube patterns accurately.',icon:'³',tool:'Cube Pattern Press',prompt:'Factor using the sum-or-difference-of-cubes pattern.',paper:'Identify a and b, then use the correct binomial and trinomial signs.',check:['Take both cube roots.','Use the same sign in the binomial.','Use the pattern for the trinomial.'],questions:[
    typed('x³ − 8',['(x-2)(x²+2x+4)','(x-2)(x^2+2x+4)'],'Use a³−b³=(a−b)(a²+ab+b²).'),
    typed('x³ + 27',['(x+3)(x²-3x+9)','(x+3)(x^2-3x+9)'],'For a sum of cubes, the trinomial middle sign is negative.'),
    typed('8x³ − 125',['(2x-5)(4x²+10x+25)','(2x-5)(4x^2+10x+25)'],'The cube roots are 2x and 5.')]},
  {id:'quadform',title:'Quadratic-Form Factoring',desc:'Treat a repeated power as one variable.',icon:'u',tool:'Power Substitution Jig',prompt:'Factor completely by recognizing quadratic form.',paper:'Temporarily let u equal the repeated power, factor in u, then substitute back.',check:['Identify the repeated power.','Factor as a quadratic.','Inspect after substituting back.'],questions:[
    typed('x⁴ − 5x² + 4',['(x-1)(x+1)(x-2)(x+2)','(x+1)(x-1)(x+2)(x-2)'],'Let u=x². Then factor u²−5u+4 and continue factoring.'),
    typed('x⁴ + 5x² + 4',orders('(x²+1)','(x²+4)'),'Let u=x². Find two positive numbers that multiply to 4 and add to 5.'),
    typed('4x⁴ − 13x² + 9',['(2x-3)(2x+3)(x-1)(x+1)','(x-1)(x+1)(2x-3)(2x+3)'],'Factor (4x²−9)(x²−1), then factor both differences of squares.')]},
  {id:'complete',title:'Factor Completely',desc:'Use more than one strategy when needed.',icon:'↻',tool:'Multi-Tool Inspection',prompt:'Factor the polynomial completely.',paper:'Choose a first strategy, then inspect every resulting factor.',check:['Always check for a GCF first.','Name the next visible pattern.','Stop only when every factor is prime.'],questions:[
    typed('2x³ − 18x',['2x(x-3)(x+3)','2x(x+3)(x-3)'],'Remove 2x first. The remaining binomial is a difference of squares.'),
    typed('3x³ + 6x² − 12x − 24',['3(x+2)²(x-2)','3(x+2)^2(x-2)','3(x-2)(x+2)²'],'Remove 3, group, and then inspect the quadratic factor again.'),
    typed('x⁴ − 16',['(x-2)(x+2)(x²+4)','(x+2)(x-2)(x²+4)','(x-2)(x+2)(x^2+4)'],'Use difference of squares twice; x²+4 is prime over the real numbers.')]},
  {id:'select',title:'Strategy Selection',desc:'Choose the tool before doing the work.',icon:'?',tool:'Diagnostic Selector',prompt:'Choose the best first strategy.',paper:'Do not begin calculating yet—identify the structure first.',check:['Count the terms.','Check for a GCF.','Look for a named pattern.'],questions:[
    choice('6x³ − 24x','Greatest Common Factor',['Greatest Common Factor','Difference of Squares','Factoring by Grouping','Quadratic Form'],'Every term shares 6x, so remove the GCF first.'),
    choice('x⁴ − 7x² + 12','Quadratic Form',['Perfect-Square Trinomial','Quadratic Form','Difference of Cubes','Grouping'],'The exponents 4, 2, and 0 form a quadratic pattern in x².'),
    choice('2x³ + 6x² + x + 3','Factoring by Grouping',['Trinomial · a ≠ 1','Factoring by Grouping','Difference of Squares','GCF only'],'Four terms can be paired to reveal a common binomial.')]},
  {id:'final',title:'Foreman’s Final Build',desc:'Diagnose, factor, and verify without labels.',icon:'★',tool:'Master Factoring Kit',prompt:'Factor completely. No strategy is named for you.',paper:'Diagnose the structure, show every stage on paper, and inspect the final factors.',check:['Choose the first tool.','Use additional tools as needed.','Verify by multiplying.'],final:true,questions:[
    typed('12x³ − 75x',['3x(2x-5)(2x+5)','3x(2x+5)(2x-5)'],'Remove 3x, then inspect the difference of squares.'),
    typed('2x³ + x² − 18x − 9',['(2x+1)(x-3)(x+3)','(x-3)(x+3)(2x+1)'],'Group the four terms, then factor the remaining difference of squares.'),
    typed('x⁴ − 10x² + 9',['(x-1)(x+1)(x-3)(x+3)','(x+1)(x-1)(x+3)(x-3)'],'Use quadratic form, then inspect both quadratic factors.')]}];

const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[ri(0,a.length-1)],shuffle=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const sup=n=>String(n).replace(/[0-9]/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
const fac=n=>n===0?'x':n>0?`(x + ${n})`:`(x − ${-n})`;
const fmtTerm=(c,p,v='x',first=false)=>{const a=Math.abs(c),body=p===0?String(a):`${a===1?'':a}${v}${p===1?'':sup(p)}`;return first?(c<0?'−':'')+body:` ${c<0?'−':'+'} ${body}`};
const fmtPoly=(terms,v='x')=>terms.filter(t=>t[0]).map((t,i)=>fmtTerm(t[0],t[1],v,i===0)).join('');
const tagSets={gcf:['numeric','variable','negative'],a1:['positive','mixed','negative'],group:['positive','mixed','negative'],ac:['positive','mixed','negative'],pst:['positive','negative','nonmonic'],dos:['simple','nonmonic','repeated'],cubes:['difference','sum','nonmonic'],quadform:['positive','complete','nonmonic'],complete:['gcf-dos','group-dos','repeated'],select:['gcf','pattern','grouping'],final:['gcf-dos','group-dos','quadratic-form']};
const meta=(q,tag)=>Object.assign(q,{tag,signature:q.expr});
function generateQuestion(id,wanted){
  const tag=wanted||pick(tagSets[id]);
  if(id==='gcf'){
    const count=ri(2,4),v=pick(['x','a','m']),base=tag==='variable'?1:ri(2,9),minPow=tag==='numeric'?0:ri(1,3),outside=tag==='negative'?-base:base,mults=[ri(2,6),ri(2,7),ri(2,5),ri(2,7)].slice(0,count);mults[0]=1;
    const inside=mults.map((m,i)=>[(i%2?-1:1)*m,minPow===0?count-i-1:count-i-1]);const original=inside.map(t=>[t[0]*outside,t[1]+minPow]);const prefix=`${outside===1&&minPow? '':outside===-1&&minPow?'−':outside}${minPow?`${v}${minPow===1?'':sup(minPow)}`:''}`||String(outside);
    const inner=fmtPoly(inside,v),expr=fmtPoly(original,v),ans=`${prefix}(${inner})`;return meta(typed(expr,[ans],`The shared factor is ${prefix}. Divide every term by it before writing the parentheses.`,[prefix]),tag);
  }
  if(id==='a1'){
    let p=ri(2,8),q=ri(2,9);while(q===p)q=ri(2,9);if(tag==='mixed')q=-q;if(tag==='negative'){p=-p;q=-q}const b=p+q,c=p*q,expr=`x²${b?` ${b<0?'−':'+'} ${Math.abs(b)}x`:''} ${c<0?'−':'+'} ${Math.abs(c)}`;return meta(typed(expr,orders(fac(p),fac(q)),`Find two integers that multiply to ${c} and add to ${b}.`),tag);
  }
  if(id==='group'){
    const a=ri(1,4),r=tag==='negative'?-ri(2,6):ri(2,6),b=(tag==='mixed'?-1:1)*pick([2,3,5,7]),terms=[[a,3],[a*r,2],[b,1],[b*r,0]],expr=fmtPoly(terms),quad=`(${a===1?'':a}x² ${b<0?'−':'+'} ${Math.abs(b)})`;return meta(typed(expr,orders(fac(r),quad),`Group the first two and last two terms; the shared binomial is ${fac(r)}.`),tag);
  }
  if(id==='ac'){
    let a,b,p,q;do{a=ri(2,4);b=ri(2,4);p=ri(1,5)*(tag==='mixed'?-1:1);q=ri(1,5)*(tag==='negative'?-1:1)}while(gcd(a,p)>1||gcd(b,q)>1);const mid=a*q+b*p,last=p*q,expr=`${a*b}x² ${mid<0?'−':'+'} ${Math.abs(mid)}x ${last<0?'−':'+'} ${Math.abs(last)}`,f1=`(${a}x ${p<0?'−':'+'} ${Math.abs(p)})`,f2=`(${b}x ${q<0?'−':'+'} ${Math.abs(q)})`;return meta(typed(expr,orders(f1,f2),`The AC product is ${a*b*last}. Split the middle coefficient ${mid}.`),tag);
  }
  if(id==='pst'){
    const a=tag==='nonmonic'?ri(2,5):1,b=ri(2,9),sgn=tag==='negative'?-1:1,mid=2*a*b*sgn,expr=`${a*a===1?'':a*a}x² ${mid<0?'−':'+'} ${Math.abs(mid)}x + ${b*b}`,f=`(${a===1?'':a}x ${sgn<0?'−':'+'} ${b})`;return meta(typed(expr,[`${f}²`,`${f}^2`,`${f}${f}`],`The square roots are ${a===1?'x':a+'x'} and ${b}; verify the middle term with 2ab.`),tag);
  }
  if(id==='dos'){
    if(tag==='repeated'){const a=pick([1,4,9]),b=pick([4,9,16,25]),A=Math.sqrt(a),B=Math.sqrt(b),expr=`${a*a===1?'':a*a}x⁴ − ${b*b}`,q=`(${a===1?'':a}x² + ${b})`;return meta(typed(expr,[`(${A===1?'':A}x-${B})(${A===1?'':A}x+${B})${q}`],`Factor the outer difference of squares, then inspect the remaining difference again.`),tag)}
    const a=tag==='nonmonic'?ri(2,6):1,b=ri(2,10),expr=`${a*a===1?'':a*a}x² − ${b*b}`,f1=`(${a===1?'':a}x-${b})`,f2=`(${a===1?'':a}x+${b})`;return meta(typed(expr,orders(f1,f2),`The square roots are ${a===1?'x':a+'x'} and ${b}.`),tag);
  }
  if(id==='cubes'){
    const a=tag==='nonmonic'?pick([2,3]):1,b=ri(2,6),sum=tag==='sum',expr=`${a*a*a===1?'':a*a*a}x³ ${sum?'+':'−'} ${b*b*b}`,bin=`(${a===1?'':a}x${sum?'+':'-'}${b})`,tri=`(${a*a===1?'':a*a}x² ${sum?'−':'+'} ${a*b}x + ${b*b})`;return meta(typed(expr,[bin+tri],`Use the ${sum?'sum':'difference'}-of-cubes pattern with cube roots ${a===1?'x':a+'x'} and ${b}.`),tag);
  }
  if(id==='quadform'){
    if(tag==='positive'){let p=ri(1,5),q=ri(6,10),expr=`x⁴ + ${p+q}x² + ${p*q}`;return meta(typed(expr,orders(`(x²+${p})`,`(x²+${q})`),`Let u=x² and factor u²+${p+q}u+${p*q}.`),tag)}
    let p=ri(2,5),q=ri(6,9),P=p*p,Q=q*q,expr=`x⁴ − ${P+Q}x² + ${P*Q}`,answers=[`(x-${p})(x+${p})(x-${q})(x+${q})`];return meta(typed(expr,answers,'Factor in x² first, then factor both differences of squares.'),tag);
  }
  if(id==='complete'||id==='final'){
    const useTag=tag==='quadratic-form'?'repeated':tag;
    if(useTag==='gcf-dos'){const g=ri(2,7),b=ri(2,8),expr=`${g}x³ − ${g*b*b}x`,answers=[`${g}x(x-${b})(x+${b})`];return meta(typed(expr,answers,'Remove the GCF first, then factor the difference of squares.'),tag)}
    if(useTag==='group-dos'){const a=ri(2,4),b=ri(2,6),expr=`${a}x³ + x² − ${a*b*b}x − ${b*b}`,answers=[`(${a}x+1)(x-${b})(x+${b})`];return meta(typed(expr,answers,'Group first, then factor the resulting difference of squares.'),tag)}
    let p=ri(2,5),q=ri(6,9),expr=`x⁴ − ${p*p+q*q}x² + ${p*p*q*q}`;return meta(typed(expr,[`(x-${p})(x+${p})(x-${q})(x+${q})`],'Use quadratic form, then inspect both factors again.'),tag);
  }
  if(id==='select'){
    const options=['Greatest Common Factor','Difference of Squares','Factoring by Grouping','Quadratic Form'];if(tag==='gcf'){let g=ri(2,9),b=ri(2,8);return meta(choice(`${g}x³ − ${g*b}x`,'Greatest Common Factor',shuffle(options),'Every term shares a numerical and variable factor.'),tag)}if(tag==='pattern'){let p=ri(2,8);return meta(choice(`x⁴ − ${p*p}`,'Difference of Squares',shuffle(options),'There are two squared expressions separated by subtraction.'),tag)}let a=ri(2,5),r=ri(2,6);return meta(choice(`${a}x³ + ${a*r}x² + x + ${r}`,'Factoring by Grouping',shuffle(options),'Four terms can be paired to reveal a common binomial.'),tag);
  }
  return meta(stages.find(s=>s.id===id).questions[0],tag);
}

const OLD=JSON.parse(localStorage.getItem('factoringWorkshopV2')||localStorage.getItem('factoringWorkshopPrototype')||'{}');
const KEY='factoringWorkshopV3';
const freshStage=()=>({masteredSignatures:[],masteredTags:[],review:[],recent:[],sinceReview:0,orders:0});
const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
let state={xp:OLD.xp||120,unlocked:0,stages:stages.map(freshStage),...saved};
if(!Array.isArray(state.stages)||state.stages.length!==stages.length)state.stages=stages.map(freshStage);
state.stages=state.stages.map(d=>({...freshStage(),...d}));
let currentStage=0,currentQuestion=null,attempt=1,hintUsed=false,selectedChoice='',stageJustCompleted=false,workOrder=0;

const clean=s=>String(s).toLowerCase().replaceAll('−','-').replaceAll('²','^2').replaceAll('³','^3').replaceAll('⁴','^4').replace(/\s+/g,'').replace(/\*|·/g,'');
const canonical=s=>{const t=clean(s),re=/\([^()]+\)(?:\^\d+)?/g,f=t.match(re)||[];return f.length<2?t:t.replace(re,'')+f.sort().join('')};
const data=i=>state.stages[i];
const done=i=>data(i).masteredTags.length>=3&&data(i).review.length===0;
const earnedTools=()=>state.stages.slice(0,10).filter((_,i)=>done(i)).length;
function save(){localStorage.setItem(KEY,JSON.stringify(state));$('#xpCount').textContent=state.xp;$('#toolCount').textContent=`${earnedTools()} / 10`;}
function show(id){$$('.view').forEach(v=>v.classList.remove('active'));$(id).classList.add('active');scrollTo({top:0,behavior:'smooth'});}
function renderBench(){
  $('#benchGrid').innerHTML=stages.map((s,i)=>{const isDone=done(i),available=i<=state.unlocked,status=isDone?'done':available?'current':'locked',label=isDone?(s.final?'BUILD COMPLETE':'TOOL EARNED'):available?'OPEN BENCH':'LOCKED';return `<button class="bench-card ${status} ${s.final?'final':''}" data-stage="${i}"><span class="number">${String(i+1).padStart(2,'0')}</span><span class="bench-icon">${s.icon}</span><h3>${s.title}</h3><p>${s.desc}</p><footer><span>${label}</span><b>${available?'→':'⌁'}</b></footer></button>`}).join('');
  $$('[data-stage]').forEach(b=>b.onclick=()=>{const i=+b.dataset.stage;if(i<=state.unlocked)startMission(i);else b.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:260});});renderToolbox();save();
}
function renderToolbox(){$('#toolboxList').innerHTML=stages.slice(0,10).map((s,i)=>`<div class="toolbox-row ${done(i)?'':'locked'}"><span>${s.icon}</span><div><b>${s.tool}</b><small>${done(i)?'Tool earned':i<=state.unlocked?'Available to earn':'Earn at Bench '+String(i+1).padStart(2,'0')}</small></div></div>`).join('');}
function startMission(i){currentStage=i;renderMissionHeader();renderQuestion();show('#missionView');}
function renderMissionHeader(){const s=stages[currentStage];$('#benchNumber').textContent=`BENCH ${String(currentStage+1).padStart(2,'0')}`;$('#benchTitle').textContent=s.title;$('#benchDescription').textContent=s.desc;$('#activeToolSymbol').textContent=s.icon;$('#activeToolName').textContent=s.tool;$('#checklist').innerHTML=s.check.map(x=>`<li>${x}</li>`).join('');$('#questionPrompt').textContent=s.prompt;$('#paperCheck').innerHTML=`<b>Paper check:</b> ${s.paper}`;updateMeter();}
function updateMeter(){const n=Math.min(3,data(currentStage).masteredTags.length);$('#masteredCount').textContent=`${n} mastered`;$('#missionProgress').style.width=`${n/3*100}%`;}
function chooseQuestion(){
  const s=stages[currentStage],d=data(currentStage),tags=tagSets[s.id],unmastered=tags.filter(t=>!d.masteredTags.includes(t)&&!d.review.includes(t));
  const mustReview=d.review.length&&(d.sinceReview>=2||unmastered.length===0),target=mustReview?d.review[0]:pick(unmastered.length?unmastered:tags);
  let q;
  for(let tries=0;tries<50;tries++){q=generateQuestion(s.id,target);if(!d.masteredSignatures.includes(q.signature)&&!d.recent.includes(q.signature))break;}
  q.reviewFor=mustReview?target:'';d.recent=[...d.recent,q.signature].slice(-8);d.orders++;if(mustReview)d.sinceReview=0;
  return q;
}
function renderQuestion(){
  currentQuestion=chooseQuestion();workOrder++;attempt=1;hintUsed=false;selectedChoice='';stageJustCompleted=false;$('#problemExpression').textContent=currentQuestion.expr;$('#challengeLabel').textContent=`WORK ORDER ${workOrder} · ATTEMPT 1`;$('#feedback').className='feedback hidden';$('#checkButton').classList.remove('hidden');$('#nextButton').classList.add('hidden');
  const typedMode=currentQuestion.type==='typed';$('#typedAnswerLabel').classList.toggle('hidden',!typedMode);$('#choiceGrid').classList.toggle('hidden',typedMode);$('#answerInput').value='';
  if(typedMode){$('#answerInput').placeholder='Type the fully factored result';setTimeout(()=>$('#answerInput').focus(),100);}else{$('#choiceGrid').innerHTML=currentQuestion.options.map(o=>`<button class="choice-option" data-option="${o}"><span></span>${o}</button>`).join('');$$('[data-option]').forEach(b=>b.onclick=()=>{selectedChoice=b.dataset.option;$$('[data-option]').forEach(x=>x.classList.toggle('selected',x===b));});}
}
function isCorrect(){if(currentQuestion.type==='choice')return selectedChoice===currentQuestion.correct;return currentQuestion.answers.some(a=>canonical(a)===canonical($('#answerInput').value));}
function checkAnswer(){
  const value=currentQuestion.type==='typed'?$('#answerInput').value:selectedChoice;if(!value.trim()){feedback('Complete the work order first.','hint');return;}
  if(isCorrect()){
    const d=data(currentStage),alreadyDone=done(currentStage),independent=attempt===1&&!hintUsed;
    const newSignature=!d.masteredSignatures.includes(currentQuestion.signature),newTag=!d.masteredTags.includes(currentQuestion.tag);
    const mastery=independent&&!alreadyDone&&newSignature&&newTag;
    if(mastery){d.masteredSignatures.push(currentQuestion.signature);d.masteredTags.push(currentQuestion.tag);}
    if(independent&&currentQuestion.reviewFor){d.review=d.review.filter(t=>t!==currentQuestion.reviewFor);}
    if(independent&&d.review.length&&!currentQuestion.reviewFor)d.sinceReview++;
    state.xp+=mastery?20:10;
    const cleared=independent&&currentQuestion.reviewFor;
    feedback(mastery?(cleared?'Parallel check passed independently. Repair cleared and mastery progress +1.':'Work inspected: correct on the first attempt. Mastery progress +1.'):'Corrected successfully. No mastery mark this time, but the repair earns 10 XP.','good');
    $('#checkButton').classList.add('hidden');$('#nextButton').classList.remove('hidden');
    if(done(currentStage)&&!alreadyDone){stageJustCompleted=true;state.unlocked=Math.max(state.unlocked,Math.min(stages.length-1,currentStage+1));$('#nextButton').textContent='Claim tool →';}else $('#nextButton').textContent='Next work order →';save();updateMeter();
  }else{
    const d=data(currentStage);if(!done(currentStage)&&!d.review.includes(currentQuestion.tag))d.review.push(currentQuestion.tag);d.sinceReview=0;
    attempt++;$('#challengeLabel').textContent=`WORK ORDER ${workOrder} · ATTEMPT ${attempt}`;const partial=currentQuestion.type==='typed'&&(currentQuestion.partials||[]).some(a=>clean(a)===clean(value));feedback(partial?'You found the GCF correctly. Now include the remaining factor in parentheses.':`Not yet. ${currentQuestion.hint}`,'bad');save();
  }
}
function feedback(text,type){$('#feedback').textContent=text;$('#feedback').className='feedback '+type;}
function openCompletion(){const s=stages[currentStage];$('#completionBadge').textContent=s.icon;$('#completionTitle').textContent=s.tool;$('#completionText').textContent=currentStage===stages.length-1?'You completed the final build and demonstrated the full factoring toolkit.':'You completed three work orders independently. This tool is now available in mixed-strategy challenges.';$('#completionNext').classList.toggle('hidden',currentStage===stages.length-1);if(currentStage<stages.length-1)$('#completionNext').textContent=`Begin ${stages[currentStage+1].title} →`;$('#completionDialog').showModal();}
function returnToBench(){renderBench();show('#homeView');setTimeout(()=>$('#workbench').scrollIntoView({behavior:'smooth'}),100);}

$('#beginButton').onclick=()=>$('#workbench').scrollIntoView({behavior:'smooth'});$('#homeButton').onclick=$('#backToBench').onclick=$('#strategyBack').onclick=returnToBench;
$('#toolboxButton').onclick=()=>{$('#toolboxDialog').showModal();renderToolbox();};$('#closeToolbox').onclick=()=>$('#toolboxDialog').close();
$('#checkButton').onclick=checkAnswer;$('#answerInput').onkeydown=e=>{if(e.key==='Enter'&&!$('#checkButton').classList.contains('hidden'))checkAnswer();};
$('#hintButton').onclick=()=>{hintUsed=true;const d=data(currentStage);if(!done(currentStage)&&!d.review.includes(currentQuestion.tag))d.review.push(currentQuestion.tag);d.sinceReview=0;save();feedback(currentQuestion.hint+' This work order can still be corrected, but it will not earn a mastery mark. A parallel check will return later.','hint');};
$('#nextButton').onclick=()=>{if(stageJustCompleted)openCompletion();else renderQuestion();};
$('#completionNext').onclick=()=>{const next=Math.min(stages.length-1,currentStage+1);$('#completionDialog').close();startMission(next);};
$('#completionPractice').onclick=()=>{$('#completionDialog').close();renderQuestion();};$('#completionHome').onclick=()=>{$('#completionDialog').close();returnToBench();};
$('#inspectMixed').onclick=()=>show('#strategyView');$$('[data-choice]').forEach(b=>b.onclick=()=>{const good=b.dataset.choice==='gcf';$('#strategyFeedback').className='strategy-feedback';$('#strategyFeedback').innerHTML=good?'<b>Correct first move.</b> Remove 6x first: 6x(x² − 4). Then inspect again—the difference-of-squares tool finishes the job.':'<b>Not the best first move.</b> Every term shares 6x. Remove the GCF before inspecting what remains.';});
renderBench();save();
