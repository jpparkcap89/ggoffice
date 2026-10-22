'use strict';
const audienceCopy = {
  teacher: ['교직원을 위한 시작', '수업자료 작성, 공동 문서 편집, 발표 자료 제작에 활용하세요. 소속과 계정의 이용 대상 여부를 공식 시스템에서 확인한 뒤 가입을 진행하세요.'],
  student: ['학생을 위한 시작', '과제와 모둠 발표 자료를 만들고 함께 편집해 보세요. 만 14세 미만은 보호자와 함께 법정대리인 인증 절차를 확인하세요.'],
  parent: ['자녀의 시작을 도와주세요', '자녀의 원패스 가입 여부와 로그인을 함께 확인해 주세요. 만 14세 미만 가입에는 법정대리인 인증이 필요합니다. 학부모 본인의 서비스 이용 자격을 안내하는 내용은 아닙니다.']
};
const audienceDetail = document.querySelector('#audience-detail');
function setAudience(role) {
  document.querySelectorAll('[data-role]').forEach(button => {
    const selected = button.dataset.role === role;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const title = document.createElement('strong');
  title.textContent = audienceCopy[role][0];
  audienceDetail.replaceChildren(title, document.createTextNode(audienceCopy[role][1]));
}
document.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => setAudience(button.dataset.role)));
setAudience('teacher');
const form = document.querySelector('#check-form');
const result = document.querySelector('#check-result');
form.addEventListener('change', () => { result.hidden = true; result.replaceChildren(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const role = data.get('role');
  const account = data.get('account');
  if (!role || !account) return;
  let title, description, label, url;
  if (role === 'parent') {
    title = '자녀의 가입을 함께 준비하세요';
    description = '자녀의 교육디지털원패스 가입 여부부터 확인하세요. 만 14세 미만은 법정대리인 인증이 필요합니다. 학부모 본인의 가입 여부만으로 자녀의 이용 준비가 완료되지는 않습니다.';
    label = '자녀 가입 절차 확인'; url = 'https://www.goedu.kr/info/help';
  } else if (account === 'no') {
    title = '교육디지털원패스부터 확인하세요';
    description = '원패스 가입 여부를 확인하거나 먼저 가입해 주세요. 이후 경기교육 클라우드 시스템 회원가입과 서비스별 가입이 필요합니다.';
    label = '교육디지털원패스로 이동'; url = 'https://edupass.neisplus.kr';
  } else {
    title = '클라우드 가입·서비스 활성화를 확인하세요';
    description = 'goedu.kr에서 회원가입 또는 로그인한 뒤, Microsoft 365 등 필요한 서비스의 가입 상태를 확인하세요. 원패스 가입만으로 모든 서비스 이용이 확정되지는 않습니다.';
    label = '경기교육 클라우드로 이동'; url = 'https://www.goedu.kr';
  }
  const heading = document.createElement('strong'); heading.textContent = title;
  const paragraph = document.createElement('p'); paragraph.textContent = description;
  const link = document.createElement('a'); link.textContent = label + ' ↗'; link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  result.replaceChildren(heading, paragraph, link); result.hidden = false;
});
const dialog = document.querySelector('#search-dialog');
const searchInput = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const searchIndex = [
  {title:'처음 이용하기 · 대상별 가입 안내',text:'교직원 학생 학부모 가입 시작 원패스',target:'#start'},
  {title:'나의 다음 단계 확인',text:'자가진단 계정 이용 가능',target:'#check-form'},
  ...Array.from(document.querySelectorAll('.tool-card')).map(card => ({title:card.querySelector('h3').textContent,text:card.textContent,target:'#'+card.id})),
  ...Array.from(document.querySelectorAll('.faq-list details')).map((item,index) => { item.id = 'faq-'+index; return {title:item.querySelector('summary').textContent,text:item.textContent,target:'#'+item.id}; })
];
function renderSearch() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = searchIndex.filter(item => (item.title+' '+item.text).toLocaleLowerCase().includes(query));
  results.replaceChildren();
  if (!matches.length) { const empty = document.createElement('p'); empty.textContent = '일치하는 안내가 없어요. ‘가입’, ‘설치’, ‘비밀번호’로 검색해 보세요.'; results.append(empty); }
  matches.forEach(item => {
    const link = document.createElement('a'); link.href = item.target; link.textContent = item.title + ' →';
    link.addEventListener('click', event => {
      event.preventDefault(); dialog.close();
      const destination = document.querySelector(item.target);
      if (destination.tagName === 'DETAILS') destination.open = true;
      destination.setAttribute('tabindex','-1'); destination.focus({preventScroll:true}); destination.scrollIntoView({block:'start'});
    }); results.append(link);
  });
}
function openSearch() { if (dialog.open) return; dialog.showModal(); searchInput.value = ''; renderSearch(); searchInput.focus(); }
document.querySelector('#open-search').addEventListener('click',openSearch);
document.querySelector('#close-search').addEventListener('click',() => dialog.close());
searchInput.addEventListener('input',renderSearch);
document.addEventListener('keydown',event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {event.preventDefault(); openSearch();} });
