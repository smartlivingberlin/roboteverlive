document.addEventListener('DOMContentLoaded', ()=>{
  const a = document.querySelector('#langToggle');
  if(!a) return;
  if(location.pathname.includes('/en/')){
    a.textContent = 'Deutsch';
    a.href = location.pathname.replace('/en/','/').replace(/\/\//g,'/');
  }else{
    a.textContent = 'English';
    a.href = location.pathname.replace(/\/([^\/]+)$/, '/en/$1');
  }
});
