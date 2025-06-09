// ========== select dropdown ==========
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
  const selectTrigger = wrapper.querySelector('.custom-select');
  const selectedValue = wrapper.querySelector('.selected-value');
  const optionsContainer = wrapper.querySelector('.select-options');
  const options = wrapper.querySelectorAll('.select-options li');
  const errorMsg = wrapper.querySelector('.select-error-message');

  if (!selectTrigger || !selectedValue || !optionsContainer || options.length === 0) return;

  selectTrigger.addEventListener('click', e => {
    if (selectTrigger.classList.contains('disabled')) return;

    document.querySelectorAll('.custom-select-wrapper.active').forEach(activeWrapper => {
      if (activeWrapper !== wrapper) activeWrapper.classList.remove('active');
    });

    wrapper.classList.toggle('active');
    e.stopPropagation();
  });

  options.forEach(option => {
    option.addEventListener('click', e => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedValue.textContent = option.textContent;
      wrapper.classList.remove('active');

      if (errorMsg) {
        selectTrigger.classList.remove('error');
        errorMsg.style.display = 'none';
      }

      // 필터링 기능 추가
      setTimeout(() => {
        if (window.tableFilteringEnabled && window.triggerTableFiltering) {
          window.triggerTableFiltering(wrapper, option.textContent.trim());
        }
      }, 10);

      e.stopPropagation();
    });
  });
});


// ========== select dropdown 외부 클릭 시 닫기  ==========
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper.active').forEach(wrapper => {
    wrapper.classList.remove('active');
  });
});


// ========== segmented buttons ==========
document.querySelectorAll('#segmentedGroup .segmented-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#segmentedGroup .segmented-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});


// ========== tab buttons ==========
document.querySelectorAll('#tabGroup .tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#tabGroup .tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});


// ========== search box (단일 대응) ==========
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const searchWrap = document.getElementById('searchWrap');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const hasValue = searchInput.value.trim();
    resetBtn.style.display = hasValue ? 'inline-flex' : 'none';
    searchWrap.classList.toggle('active', hasValue);
  });

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    resetBtn.style.display = 'none';
    searchWrap.classList.remove('active');
  });
}


// ========== table input clear
document.querySelectorAll('.table-input-wrapper').forEach(wrapper => {
  const input = wrapper.querySelector('.table-input');
  const clearBtn = wrapper.querySelector('.table-input-clear');

  input.addEventListener('input', () => {
    const hasValue = input.value.length > 0;
    wrapper.classList.toggle('show-clear', hasValue);
    input.classList.toggle('filled', hasValue);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    input.focus();
    wrapper.classList.remove('show-clear');
    input.classList.remove('filled');
  });
});


// ========== LNB ==========
document.addEventListener('DOMContentLoaded', () => {
  const allItems = document.querySelectorAll('.lnb-item');
  const currentPage = location.href.split('/').pop(); // 현재 파일명

  // 마지막으로 열린 상위 메뉴 인덱스 기억 → 유지
  const lastOpenMenu = sessionStorage.getItem('openLnbIndex');
  if (lastOpenMenu !== null) {
    const item = allItems[lastOpenMenu];
    const button = item.querySelector('.lnb-button');
    const submenu = item.querySelector('.lnb-submenu');
    if (submenu) {
      button.classList.add('active');
      submenu.style.display = 'block';
    }
  }

  allItems.forEach((item, index) => {
    const button = item.querySelector('.lnb-button');
    const submenu = item.querySelector('.lnb-submenu');
    if (!button) return;

    if (submenu) {
      const links = submenu.querySelectorAll('a');

      links.forEach(link => {
        const linkPage = link.href.split('/').pop();

        // ✅ 현재 페이지 메뉴면 .on 클래스 부여
        if (linkPage === currentPage) {
          link.classList.add('on');
        }

        link.addEventListener('click', e => {
          e.stopPropagation(); // 메뉴 닫힘 방지
        });
      });
    }

    button.addEventListener('click', e => {
      const tagName = button.tagName.toLowerCase();
      const isAnchor = tagName === 'a';
      const isCurrentPage = isAnchor && button.href.split('/').pop() === currentPage;

      const isSubmenuPage =
        submenu?.querySelectorAll('a').length > 0 &&
        Array.from(submenu.querySelectorAll('a')).some(link => link.href.split('/').pop() === currentPage);

      // ✅ 현재 페이지에 해당하는 메뉴 클릭 시: active 유지 & 종료
      if (isCurrentPage || isSubmenuPage) {
        e.stopPropagation();
        return;
      }

      // 나머지 메뉴는 기존대로 닫고 열기
      document.querySelectorAll('.lnb-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.lnb-submenu').forEach(sub => (sub.style.display = 'none'));

      button.classList.add('active');
      if (submenu) submenu.style.display = 'block';
      sessionStorage.setItem('openLnbIndex', index);

      e.stopPropagation();
    });
  });
});


// ========== table th 정렬 ==========
document.querySelectorAll('.table .th-inner.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const icon = th.querySelector('.sort-icon');
    const tbody = th.closest('table').querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const thElement = th.closest('th');
    const colIndex = Array.from(thElement.parentNode.children).indexOf(thElement);

    let direction = 'asc';
    if (icon.classList.contains('default')) {
      icon.classList.remove('default');
      icon.classList.add('asc');
      direction = 'asc';
    } else if (icon.classList.contains('asc')) {
      icon.classList.remove('asc');
      icon.classList.add('desc');
      direction = 'desc';
    } else {
      icon.classList.remove('desc');
      icon.classList.add('asc');
      direction = 'asc';
    }

    document.querySelectorAll('.sort-icon').forEach(el => {
      if (el !== icon) el.className = 'sort-icon default';
    });

    rows.sort((a, b) => {
      const aText = a.children[colIndex].innerText.replace(/,/g, '');
      const bText = b.children[colIndex].innerText.replace(/,/g, '');
      const aVal = parseFloat(aText);
      const bVal = parseFloat(bText);
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    rows.forEach(row => tbody.appendChild(row));
  });
});


//========== 테이블 정렬 버튼 클릭 시 ==========
document.querySelectorAll('th.sortable').forEach((th) => {
  th.addEventListener('click', () => {
    console.log('[SORTING] 클릭됨:', th.innerText);
    cycleSortState(th);
    applyZebraStriping(th.closest('table'));
  });
});

function cycleSortState(th) {
  const table = th.closest('table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // 현재 상태 확인 (기본값은 default)
  const currentState = th.getAttribute('data-sort-state') || 'default';

  // 다음 상태 결정
  let nextState = 'asc';
  if (currentState === 'asc') nextState = 'desc';
  else if (currentState === 'desc') nextState = 'default';

  // 모든 상태 초기화
  table.querySelectorAll('th.sortable').forEach(header => {
    header.removeAttribute('data-sort-state');
    header.classList.remove('asc', 'desc');
  });
  table.querySelectorAll('.sort-icon').forEach(icon => {
    icon.className = 'sort-icon default';
  });

  // 상태 적용
  th.setAttribute('data-sort-state', nextState);
  const sortIcon = th.querySelector('.sort-icon');
  if (sortIcon) {
    sortIcon.className = 'sort-icon ' + nextState;
  }

  // 정렬 해제 상태면 원래 순서 유지
  if (nextState === 'default') return;

  // 컬럼 인덱스 찾기
  const columnIndex = Array.from(th.parentElement.children).indexOf(th);

  // 정렬
  rows.sort((a, b) => {
    const aText = a.children[columnIndex]?.innerText.trim() || '';
    const bText = b.children[columnIndex]?.innerText.trim() || '';

    const aNum = parseFloat(aText.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
    const bNum = parseFloat(bText.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
    const bothAreNumbers = !isNaN(aNum) && !isNaN(bNum);

    if (bothAreNumbers) {
      return nextState === 'asc' ? aNum - bNum : bNum - aNum;
    } else {
      return nextState === 'asc'
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    }
  });

  // 삽입
  rows.forEach(row => tbody.appendChild(row));
}

function applyZebraStriping(table) {
  const rows = table.querySelectorAll('tbody tr');
  let visibleIndex = 0;

  rows.forEach((row) => {
    row.classList.remove('row-white', 'row-grey');

    // 보이는 행만 줄무늬 적용
    if (row.style.display !== 'none') {
      row.classList.add(visibleIndex % 2 === 0 ? 'row-grey' : 'row-white');
      visibleIndex++;
    }
  });
}


// ========== text select box ==========
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.text-select-wrapper').forEach(wrapper => {
    const button = wrapper.querySelector('.text-select-button');
    const options = wrapper.querySelector('.text-select-options');

    if (!button || !options) return;

    // DatePicker 내부의 text-select-wrapper는 제외
    if (wrapper.closest('.datepicker-popup')) return;

    // 버튼 클릭 시 열고 닫기
    button.addEventListener('click', (e) => {
      e.stopPropagation();

      // 다른 셀렉트 닫기
      document.querySelectorAll('.text-select-wrapper.active').forEach(other => {
        if (other !== wrapper) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.text-select-button');
          otherBtn.classList.remove('up');
          otherBtn.classList.add('down');
        }
      });

      wrapper.classList.toggle('active');
      button.classList.toggle('up');
      button.classList.toggle('down');
    });

    // 옵션 클릭 시 텍스트 업데이트 및 닫기
    options.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        options.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
        li.classList.add('selected');

        // 텍스트 노드만 찾아서 업데이트
        const textNode = Array.from(button.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim());
        if (textNode) {
          textNode.nodeValue = li.textContent + ' ';
        }

        wrapper.classList.remove('active');
        button.classList.remove('up');
        button.classList.add('down');

        // 범용 필터링 기능 추가
        if (window.tableFilteringEnabled || window.tabFilteringSystems) {
          const selectedText = li.textContent.trim();

          // 현재 활성 탭 확인 (탭이 있는 페이지의 경우)
          const activeTab = document.querySelector('.tab-content.active');
          const tabId = activeTab ? activeTab.id : null;

          // 탭별 필터링 시스템이 있는 경우 (sub_03.html)
          if (tabId && window.tabFilteringSystems && window.tabFilteringSystems[tabId]) {
            applyTabFiltering(window.tabFilteringSystems[tabId], selectedText);
          }
          // 일반 테이블 필터링 시스템 (sub_02.html, sub_04.html)
          else if (window.tableFilteringEnabled && window.globalFilterSystem) {
            applyGlobalFiltering(window.globalFilterSystem, selectedText);
          }
        }

        // 범용 필터링 적용 함수
        function applyTabFiltering(filterSystem, selectedText) {
          if (selectedText.includes('순')) {
            filterSystem.filters.sortOrder = selectedText;
            if (filterSystem.applySorting) {
              filterSystem.applySorting(selectedText);
              // 정렬 후 pagination 업데이트
              if (filterSystem.initPagination) {
                setTimeout(() => filterSystem.initPagination(), 10);
              }
            }
          } else if (selectedText.includes('개씩')) {
            filterSystem.filters.pageSize = selectedText;
            if (window.applyPageSize) window.applyPageSize(selectedText);
          } else if (selectedText.includes('권한') || selectedText === '모든 권한' || selectedText === '관리자' || selectedText === '사용자') {
            filterSystem.filters.authority = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('사용') || selectedText === '전체 사용' || selectedText === '사용' || selectedText === '미사용') {
            filterSystem.filters.usage = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('상태') || selectedText === '진행중' || selectedText === '완료' || selectedText === '미진행' || selectedText === '보류') {
            filterSystem.filters.status = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('식사') || selectedText === '식사 전체' || selectedText === '조식' || selectedText === '중식' || selectedText === '석식') {
            filterSystem.filters.meal = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          }
        }

        function applyGlobalFiltering(filterSystem, selectedText) {
          if (selectedText.includes('순')) {
            filterSystem.filters.sortOrder = selectedText;
            if (filterSystem.applySorting) {
              filterSystem.applySorting(selectedText);
              // 정렬 후 pagination 업데이트
              if (filterSystem.initPagination) {
                setTimeout(() => filterSystem.initPagination(), 10);
              }
            }
          } else if (selectedText.includes('개씩')) {
            filterSystem.filters.pageSize = selectedText;
            if (window.applyPageSize) window.applyPageSize(selectedText);
          } else if (selectedText.includes('권한') || selectedText === '모든 권한' || selectedText === '관리자' || selectedText === '사용자') {
            filterSystem.filters.authority = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('사용') || selectedText === '전체 사용' || selectedText === '사용' || selectedText === '미사용') {
            filterSystem.filters.usage = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('상태') || selectedText === '진행중' || selectedText === '완료' || selectedText === '미진행' || selectedText === '보류') {
            filterSystem.filters.status = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          } else if (selectedText.includes('식사') || selectedText === '식사 전체' || selectedText === '조식' || selectedText === '중식' || selectedText === '석식') {
            filterSystem.filters.meal = selectedText;
            if (filterSystem.applyFilters) filterSystem.applyFilters();
          }
        }
      });
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', () => {
    document.querySelectorAll('.text-select-wrapper.active').forEach(wrapper => {
      wrapper.classList.remove('active');
      const btn = wrapper.querySelector('.text-select-button');
      btn.classList.remove('up');
      btn.classList.add('down');
    });
  });
});



// ========== Date Picker 모듈화 (유지보수용 최적화) ==========
const DatePicker = (() => {
  // 개인정산 탭 요소들
  const popup = document.getElementById('datepickerPopup');
  const startInput = document.getElementById('startInput');
  const endInput = document.getElementById('endInput');
  const yearOptions = document.getElementById('yearOptions');
  const monthOptions = document.getElementById('monthOptions');
  const yearLabel = document.querySelector('#yearBtn .label');
  const monthLabel = document.querySelector('#monthBtn .label');
  const todayBtn = document.getElementById('todayBtn');

  // 부서정산 탭 요소들
  const popup2 = document.getElementById('datepickerPopup2');
  const startInput2 = document.getElementById('startInput2');
  const endInput2 = document.getElementById('endInput2');
  const yearOptions2 = document.getElementById('yearOptions2');
  const monthOptions2 = document.getElementById('monthOptions2');
  const yearLabel2 = document.querySelector('#yearBtn2 .label');
  const monthLabel2 = document.querySelector('#monthBtn2 .label');
  const todayBtn2 = document.getElementById('todayBtn2');

  let selectedYear = new Date().getFullYear();
  let selectedMonth = new Date().getMonth() + 1;
  let startDate = null;
  let endDate = null;
  let isSelectingStart = true;

  // 부서정산 탭용 변수들
  let selectedYear2 = new Date().getFullYear();
  let selectedMonth2 = new Date().getMonth() + 1;
  let startDate2 = null;
  let endDate2 = null;
  let isSelectingStart2 = true;

  const formatDate = (date) => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

  const renderYearOptions = () => {
    yearOptions.innerHTML = '';
    const range = 5;
    for (let y = selectedYear - range; y <= selectedYear + range; y++) {
      const li = document.createElement('li');
      li.textContent = `${y}년`;
      if (y === selectedYear) li.classList.add('selected');
      yearOptions.appendChild(li);
    }
  };

  const renderMonthOptions = () => {
    monthOptions.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const li = document.createElement('li');
      li.textContent = `${m}월`;
      if (m === selectedMonth) li.classList.add('selected');
      monthOptions.appendChild(li);
    }
  };

  const bindOptionClick = (optionsId, labelEl, onChange) => {
    const options = document.getElementById(optionsId);
    options.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        options.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
        li.classList.add('selected');
        labelEl.textContent = li.textContent;
        onChange(parseInt(li.textContent));
        options.style.display = 'none';
      });
    });
  };

  const bindSelectToggle = (btnId, optionsId) => {
    const btn = document.getElementById(btnId);
    const options = document.getElementById(optionsId);

    if (!btn || !options) return;

    // 기존 이벤트 리스너 제거 (중복 방지)
    btn.removeEventListener('click', btn._datePickerClickHandler);

    btn._datePickerClickHandler = (e) => {
      e.stopPropagation();

      // 모든 .text-select-options 닫기 (DatePicker 내부만)
      const datepickerPopup = btn.closest('.datepicker-popup');
      if (datepickerPopup) {
        datepickerPopup.querySelectorAll('.text-select-options').forEach(opt => {
          if (opt !== options) {
            opt.style.display = 'none';
          }
        });
      }

      // 현재 클릭한 옵션 토글
      const isVisible = options.style.display === 'block';
      options.style.display = isVisible ? 'none' : 'block';
    };

    btn.addEventListener('click', btn._datePickerClickHandler);

    // 외부 클릭 시 닫기 (DatePicker 전용)
    if (!btn._datePickerOutsideClickHandler) {
      btn._datePickerOutsideClickHandler = (e) => {
        const datepickerPopup = btn.closest('.datepicker-popup');
        if (datepickerPopup && !btn.contains(e.target) && !options.contains(e.target)) {
          options.style.display = 'none';
        }
      };
      document.addEventListener('click', btn._datePickerOutsideClickHandler);
    }
  };

  const generateDateGrid = (year, month, isSecondTab = false) => {
    const gridId = isSecondTab ? 'datepickerGrid2' : 'datepickerGrid';
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';

    const firstDay = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate();
    const startWeekday = firstDay.getDay();

    ['일', '월', '화', '수', '목', '금', '토'].forEach(day => {
      const span = document.createElement('span');
      span.className = 'datepicker-weekday';
      span.textContent = day;
      grid.appendChild(span);
    });

    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement('span');
      empty.className = 'datepicker-day empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const span = document.createElement('span');
      span.className = 'datepicker-day';
      span.textContent = d;
      const current = new Date(year, month - 1, d);

      // 선택된 날짜 표시
      const currentStartDate = isSecondTab ? startDate2 : startDate;
      const currentEndDate = isSecondTab ? endDate2 : endDate;

      if (
        (currentStartDate && current.toDateString() === currentStartDate.toDateString()) ||
        (currentEndDate && current.toDateString() === currentEndDate.toDateString())
      ) {
        span.classList.add('selected');
      }

      span.addEventListener('click', () => {
        const startDateTextId = isSecondTab ? 'startDateText2' : 'startDateText';
        const endDateTextId = isSecondTab ? 'endDateText2' : 'endDateText';
        const currentPopup = isSecondTab ? popup2 : popup;
        const currentIsSelectingStart = isSecondTab ? isSelectingStart2 : isSelectingStart;

        if (currentIsSelectingStart) {
          if (isSecondTab) {
            startDate2 = current;
            window.startDate_departmentTab = startDate2;
            isSelectingStart2 = false;
          } else {
            startDate = current;
            window.startDate = startDate;
            window.startDate_individualTab = startDate;
            isSelectingStart = false;
          }
          document.getElementById(startDateTextId).textContent = formatDate(current);
        } else {
          if (isSecondTab) {
            endDate2 = current;
            window.endDate_departmentTab = endDate2;
            isSelectingStart2 = true;
          } else {
            endDate = current;
            window.endDate = endDate;
            window.endDate_individualTab = endDate;
            isSelectingStart = true;
          }
          document.getElementById(endDateTextId).textContent = formatDate(current);
        }

        // 시작일과 종료일이 모두 선택되었을 때 필터링 트리거
        const hasStartDate = isSecondTab ? window.startDate_departmentTab : window.startDate;
        const hasEndDate = isSecondTab ? window.endDate_departmentTab : window.endDate;

        if (hasStartDate && hasEndDate && window.triggerDateFilter) {
          window.triggerDateFilter();
        }

        const currentYear = isSecondTab ? selectedYear2 : selectedYear;
        const currentMonth = isSecondTab ? selectedMonth2 : selectedMonth;
        generateDateGrid(currentYear, currentMonth, isSecondTab);
        currentPopup.style.display = 'none';
      });

      grid.appendChild(span);
    }
  };

  const openPopupBelow = (targetEl) => {
    const rect = targetEl.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
    popup.style.display = 'block';
  };

  const init = () => {
    // 개인정산 탭 초기화
    if (popup && startInput && endInput) {
      renderYearOptions();
      renderMonthOptions();
      bindOptionClick('yearOptions', yearLabel, (val) => {
        selectedYear = val;
        generateDateGrid(selectedYear, selectedMonth, false);
      });
      bindOptionClick('monthOptions', monthLabel, (val) => {
        selectedMonth = val;
        generateDateGrid(selectedYear, selectedMonth, false);
      });

      bindSelectToggle('yearBtn', 'yearOptions');
      bindSelectToggle('monthBtn', 'monthOptions');

      generateDateGrid(selectedYear, selectedMonth, false);

      startInput.addEventListener('click', () => {
        isSelectingStart = true;
        openPopupBelow(startInput);
      });
      endInput.addEventListener('click', () => {
        isSelectingStart = false;
        openPopupBelow(endInput);
      });

      if (todayBtn) {
        todayBtn.addEventListener('click', () => {
          const today = new Date();
          selectedYear = today.getFullYear();
          selectedMonth = today.getMonth() + 1;
          startDate = today;
          endDate = today;
          window.startDate = startDate;
          window.endDate = endDate;
          window.startDate_individualTab = startDate;
          window.endDate_individualTab = endDate;
          isSelectingStart = false;
          document.getElementById('startDateText').textContent = formatDate(today);
          document.getElementById('endDateText').textContent = formatDate(today);
          yearLabel.textContent = `${selectedYear}년`;
          monthLabel.textContent = `${selectedMonth}월`;

          if (window.triggerDateFilter) {
            window.triggerDateFilter();
          }

          renderYearOptions();
          renderMonthOptions();
          bindOptionClick('yearOptions', yearLabel, (val) => {
            selectedYear = val;
            generateDateGrid(selectedYear, selectedMonth, false);
          });
          bindOptionClick('monthOptions', monthLabel, (val) => {
            selectedMonth = val;
            generateDateGrid(selectedYear, selectedMonth, false);
          });
          generateDateGrid(selectedYear, selectedMonth, false);
        });
      }

      document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && !startInput.contains(e.target) && !endInput.contains(e.target)) {
          popup.style.display = 'none';
        }
      });
    }

    // 부서정산 탭 초기화
    if (popup2 && startInput2 && endInput2) {
      initSecondTab();
    }
  };

  // 부서정산 탭 초기화 함수
  const initSecondTab = () => {
    const renderYearOptions2 = () => {
      if (!yearOptions2) return;
      yearOptions2.innerHTML = '';
      const range = 5;
      for (let y = selectedYear2 - range; y <= selectedYear2 + range; y++) {
        const li = document.createElement('li');
        li.textContent = `${y}년`;
        if (y === selectedYear2) li.classList.add('selected');
        yearOptions2.appendChild(li);
      }
    };

    const renderMonthOptions2 = () => {
      if (!monthOptions2) return;
      monthOptions2.innerHTML = '';
      for (let m = 1; m <= 12; m++) {
        const li = document.createElement('li');
        li.textContent = `${m}월`;
        if (m === selectedMonth2) li.classList.add('selected');
        monthOptions2.appendChild(li);
      }
    };

    renderYearOptions2();
    renderMonthOptions2();

    bindOptionClick('yearOptions2', yearLabel2, (val) => {
      selectedYear2 = val;
      generateDateGrid(selectedYear2, selectedMonth2, true);
    });
    bindOptionClick('monthOptions2', monthLabel2, (val) => {
      selectedMonth2 = val;
      generateDateGrid(selectedYear2, selectedMonth2, true);
    });

    bindSelectToggle('yearBtn2', 'yearOptions2');
    bindSelectToggle('monthBtn2', 'monthOptions2');

    generateDateGrid(selectedYear2, selectedMonth2, true);

    startInput2.addEventListener('click', () => {
      isSelectingStart2 = true;
      openPopupBelow2(startInput2);
    });
    endInput2.addEventListener('click', () => {
      isSelectingStart2 = false;
      openPopupBelow2(endInput2);
    });

    if (todayBtn2) {
      todayBtn2.addEventListener('click', () => {
        const today = new Date();
        selectedYear2 = today.getFullYear();
        selectedMonth2 = today.getMonth() + 1;
        startDate2 = today;
        endDate2 = today;
        window.startDate_departmentTab = startDate2;
        window.endDate_departmentTab = endDate2;
        isSelectingStart2 = false;
        document.getElementById('startDateText2').textContent = formatDate(today);
        document.getElementById('endDateText2').textContent = formatDate(today);
        yearLabel2.textContent = `${selectedYear2}년`;
        monthLabel2.textContent = `${selectedMonth2}월`;

        if (window.triggerDateFilter) {
          window.triggerDateFilter();
        }

        renderYearOptions2();
        renderMonthOptions2();
        bindOptionClick('yearOptions2', yearLabel2, (val) => {
          selectedYear2 = val;
          generateDateGrid(selectedYear2, selectedMonth2, true);
        });
        bindOptionClick('monthOptions2', monthLabel2, (val) => {
          selectedMonth2 = val;
          generateDateGrid(selectedYear2, selectedMonth2, true);
        });
        generateDateGrid(selectedYear2, selectedMonth2, true);
      });
    }

    document.addEventListener('click', (e) => {
      if (!popup2.contains(e.target) && !startInput2.contains(e.target) && !endInput2.contains(e.target)) {
        popup2.style.display = 'none';
      }
    });
  };

  // 부서정산 탭용 팝업 열기 함수
  const openPopupBelow2 = (targetEl) => {
    const rect = targetEl.getBoundingClientRect();
    popup2.style.position = 'absolute';
    popup2.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popup2.style.left = `${rect.left + window.scrollX}px`;
    popup2.style.display = 'block';
  };

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  DatePicker.init();
});


// ========== 직접 입력 선택시, 날짜 인풋 노출 ==========
document.addEventListener('DOMContentLoaded', () => {
  const periodWrapper = document.getElementById('periodSelectWrapper');
  const selectedValue = periodWrapper.querySelector('.selected-value');
  const options = periodWrapper.querySelectorAll('.select-options li');
  const datepickerRange = document.querySelector('.datepicker-container .datepicker-range');

  //  초기 상태 무조건 숨김
  datepickerRange.style.display = 'none';

  options.forEach(option => {
    option.addEventListener('click', () => {
      // 1. 기존 selected 클래스 제거
      options.forEach(opt => opt.classList.remove('selected'));

      // 2. 현재 항목에 selected 클래스 추가
      option.classList.add('selected');

      // 3. selected-value 텍스트 갱신
      const value = option.textContent.trim();
      selectedValue.textContent = value;

      // 4. 직접 입력일 경우에만 날짜 필드 표시
      if (value === '직접 입력') {
        datepickerRange.style.display = 'flex';

        // ✅ 날짜 span에서 텍스트 읽어서 Date 객체로 변환
        const startText = document.getElementById('startDateText').textContent.trim();
        const endText = document.getElementById('endDateText').textContent.trim();

        // 날짜 유효할 때만 Date 객체로 설정
        if (startText !== '시작일' && endText !== '종료일') {
          // 예시: '2025.06.01' → '2025-06-01'로 변환
          const startFormatted = startText.replace(/\./g, '-');
          const endFormatted = endText.replace(/\./g, '-');

          window.startDate = new Date(startFormatted);
          window.endDate = new Date(endFormatted);
        }

        // ✅ 필터 적용 호출
        if (window.triggerTableFiltering) {
          window.triggerTableFiltering(periodWrapper, '직접 입력');
        }

      } else {
        datepickerRange.style.display = 'none';
        // 전체 기간 등 선택 시 날짜 필터 제거 (원한다면 여기서 startDate 제거 가능)
        window.startDate = null;
        window.endDate = null;
        if (window.triggerTableFiltering) {
          window.triggerTableFiltering(periodWrapper, value);
        }
      }
    });
  });
});

/* ========== 통합 테이블 필터링 시스템 ========== *
 * 개발자 가이드:
 * 1. HTML 테이블에 data-table-type 속성 추가
 * 2. tableColumnMap에 새로운 테이블 타입 정의
 * 3. 필터 요소에 적절한 data-filter-type 속성 추가
 * 4. 탭이 있는 페이지는 자동으로 탭 기능 활성화
 *
 * 예시:
 * <table class="table" data-table-type="myTable">
 * <div data-filter-type="department">
 */
function initTableFiltering(tableType = 'default') {
  // 필터링 기능 활성화
  window.tableFilteringEnabled = true;

  // 테이블 타입별 컬럼 매핑 정의
  // department: 부서 컬럼 위치, date: 날짜 컬럼 위치, name: 이름 컬럼 위치
  // searchableRange: 검색 대상 컬럼들 (0부터 시작하는 인덱스)
  const tableColumnMap = {
    // sub_02.html 지원
    default: { department: 4, date: 3, name: 2, searchableRange: [0, 1, 2, 3] },
    // sub_03.html 지원 (개인 정산: 부서 4번째, 날짜 2번째, 이름 3번째)
    individual: { department: 4, date: 2, name: 3, searchableRange: [0, 1, 2, 3] },
    // sub_03.html 지원 (부서 정산: 부서 3번째, 날짜 2번째)
    departmentSettlement: { department: 3, date: 2, name: null, searchableRange: [0, 1, 2, 3] },
    // sub_04.html 지원 (코드, 아이디, 부서, 이름, 권한, 사용상태 순서)
    user: { department: 3, authority: 5, usage: 6, name: 4, searchableRange: [0, 1, 2, 3] },
    // 
    settlement: { department: 3, date: 2, name: null, searchableRange: [0, 1, 2, 3] }
    
  };

  const searchInput = document.getElementById('searchInput');
  const table = document.querySelector('.table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const allRows = Array.from(tbody.querySelectorAll('tr'));
  // columnMap을 전역으로 설정
  window.columnMap = tableColumnMap[tableType] || tableColumnMap.default;

  const filters = {
    searchText: '',
    status: '',
    department: '',
    authority: '',
    usage: '',
    meal: '',
    date: '전체 기간',
    sortOrder: '최신순',
    pageSize: '10개씩'
  };

  function filterBySearch(row, searchText) {
    if (!searchText) return true;
    if (!window.columnMap?.searchableRange) return true;
    const cells = row.querySelectorAll('td');
    const searchableText = window.columnMap.searchableRange.map(i =>
      cells[i]?.textContent.trim().toLowerCase() || ''
    ).join(' ');
    return searchableText.includes(searchText.toLowerCase());
  }

  function filterByStatus(row, status) {
    if (!status || status === '상태') return true;
    const progressCell = row.querySelector('td:nth-child(6)');
    const statusCell = row.querySelector('td:nth-child(8) .badge');
    if (progressCell && progressCell.textContent.trim() === status) return true;
    if (statusCell) {
      const statusText = statusCell.textContent.trim();
      const statusMap = {
        '진행중': ['진행 중', '진행중'],
        '미진행': ['미완료', '미진행'],
        '보류': ['대기', '보류'],
        '완료': ['완료', '정상']
      };
      return statusMap[status]?.includes(statusText) || statusText === status;
    }
    return false;
  }

  function filterByDepartment(row, department) {
    if (!department || department === '전체 부서') return true;
    if (!window.columnMap?.department) return true;
    const cell = row.querySelector(`td:nth-child(${window.columnMap.department})`);
    const cellText = (cell?.textContent || '').replace(/\s+/g, '').trim();
    const filterText = department.replace(/\s+/g, '').trim();
    return cellText === filterText;
  }

  function filterByMeal(row, meal) {
    if (!meal || meal === '식사 전체') return true;
    const breakfast = row.querySelector('td:nth-child(10)')?.textContent.trim();
    const lunch = row.querySelector('td:nth-child(11)')?.textContent.trim();
    const dinner = row.querySelector('td:nth-child(12)')?.textContent.trim();
    if (meal === '조식') return breakfast !== '0원' && breakfast !== '-' && breakfast !== '';
    if (meal === '중식') return lunch !== '0원' && lunch !== '-' && lunch !== '';
    if (meal === '석식') return dinner !== '0원' && dinner !== '-' && dinner !== '';
    return true;
  }

  function filterByDate(row, dateType) {
    if (!window.columnMap?.date) return true;
    const dateCell = row.querySelector(`td:nth-child(${window.columnMap.date})`);
    if (!dateCell) return false;
    const rowDate = new Date(dateCell.textContent.trim().replace(/\./g, '-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateType === '전체 기간') return true;
    if (dateType === '오늘') return rowDate.toDateString() === today.toDateString();
    if (dateType === '이번 주') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return rowDate >= startOfWeek && rowDate <= endOfWeek;
    }
    if (dateType === '이번 달') {
      return rowDate.getMonth() === today.getMonth() && rowDate.getFullYear() === today.getFullYear();
    }
    if (dateType === '직접 입력') {
      if (!window.startDate || !window.endDate) return true;
      return rowDate >= window.startDate && rowDate <= window.endDate;
    }
    return true;
  }

  function filterByAuthority(row, authority) {
    if (!authority || authority === '모든 권한') return true;
    if (!window.columnMap?.authority) return true;
    const cell = row.querySelector(`td:nth-child(${window.columnMap.authority})`);
    const buttonText = cell?.querySelector('.text-select-button')?.textContent.trim();
    // 버튼 텍스트에서 아이콘 부분 제거하고 비교
    const cleanButtonText = buttonText?.replace(/\s+$/, '').trim();
    return cleanButtonText === authority;
  }

  function filterByUsage(row, usage) {
    if (!usage || usage === '전체 사용') return true;
    if (!window.columnMap?.usage) return true;
    const cell = row.querySelector(`td:nth-child(${window.columnMap.usage})`);
    const badgeText = cell?.querySelector('.badge')?.textContent.trim();
    return badgeText === usage;
  }

  function applyFilters() {
    let visibleCount = 0;
    allRows.forEach(row => {
      const shouldShow =
        filterBySearch(row, filters.searchText) &&
        filterByStatus(row, filters.status) &&
        filterByDepartment(row, filters.department) &&
        filterByMeal(row, filters.meal) &&
        filterByDate(row, filters.date) &&
        filterByAuthority(row, filters.authority) &&
        filterByUsage(row, filters.usage);
      row.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount++;
    });
    updateResultCount(visibleCount);
    applyZebraStriping(table);
  }

  function updateResultCount(count) {
    const resultCountElement = document.querySelector('.list_infoarea .opt_left span');
    if (resultCountElement) resultCountElement.textContent = count.toLocaleString();
  }

  function applyZebraStriping(table) {
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
    visibleRows.forEach((row, index) => {
      row.classList.remove('row-grey', 'row-white');
      row.classList.add(index % 2 === 0 ? 'row-grey' : 'row-white');
    });
  }

  const searchBtn = document.querySelector('.search-btn');
  const resetBtn = document.getElementById('resetBtn');

  searchBtn?.addEventListener('click', () => {
    filters.searchText = searchInput.value.trim();
    applyFilters();
  });

  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      filters.searchText = searchInput.value.trim();
      applyFilters();
    }
  });

  resetBtn?.addEventListener('click', () => {
    filters.searchText = '';
    applyFilters();
  });

  const filterResetBtn = document.getElementById('filterResetBtn');
  filterResetBtn?.addEventListener('click', () => {
    filters.searchText = '';
    filters.status = '';
    filters.department = '';
    filters.authority = '';
    filters.usage = '';
    filters.meal = '';
    filters.date = '전체 기간';

    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
      const selectedValue = wrapper.querySelector('.selected-value');
      const firstOption = wrapper.querySelector('.select-options li');
      if (selectedValue && firstOption) {
        selectedValue.textContent = firstOption.textContent;
        wrapper.querySelectorAll('.select-options li').forEach(li => li.classList.remove('selected'));
        firstOption.classList.add('selected');
      }
    });

    window.startDate = null;
    window.endDate = null;
    const datepickerRange = document.querySelector('.datepicker-range');
    if (datepickerRange) datepickerRange.style.display = 'none';

    const startDateText = document.getElementById('startDateText');
    const endDateText = document.getElementById('endDateText');
    if (startDateText) startDateText.textContent = '시작일';
    if (endDateText) endDateText.textContent = '종료일';

    applyFilters();
  });

  window.tableFilteringEnabled = true;
  window.triggerTableFiltering = (wrapper, value) => {
    const selectType = window.getSelectType(wrapper);
    if (selectType) {
      filters[selectType] = value;
      applyFilters();
    }
  };

  window.getSelectType = function(wrapper) {
    // custom-select-wrapper인 경우 .selected-value에서 텍스트 가져오기
    const selectedValue = wrapper.querySelector('.selected-value');
    const textSelectButton = wrapper.querySelector('.text-select-button');

    const text = selectedValue?.textContent.trim() || textSelectButton?.textContent.trim() || '';

    if (text.includes('상태')) return 'status';
    if (text.includes('부서')) return 'department';
    if (text.includes('식사')) return 'meal';
    if (['오늘', '이번 주', '이번 달', '직접 입력', '전체 기간'].includes(text)) return 'date';
    if (text.includes('권한')) return 'authority';
    if (text.includes('사용')) return 'usage';

    return wrapper.dataset.filterType || null;
  };

  
  window.triggerTableFiltering = (wrapper, value) => {
    const selectType = window.getSelectType(wrapper);
    if (selectType) {
      filters[selectType] = value;
      applyFilters();
    }
  };

  window.triggerDateFilter = () => {
    filters.date = '직접 입력';
    applyFilters();
  };

  // 정렬 적용 함수
  function applySorting(sortOrder) {
    const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');

    visibleRows.sort((a, b) => {
      if (sortOrder === '최신순') {
        // 날짜 컬럼으로 정렬 (최신순)
        const dateA = new Date(a.querySelector(`td:nth-child(${window.columnMap.date})`).textContent.replace(/\./g, '-'));
        const dateB = new Date(b.querySelector(`td:nth-child(${window.columnMap.date})`).textContent.replace(/\./g, '-'));
        return dateB - dateA;
      } else if (sortOrder === '오래된순') {
        // 날짜 컬럼으로 정렬 (오래된순)
        const dateA = new Date(a.querySelector(`td:nth-child(${window.columnMap.date})`).textContent.replace(/\./g, '-'));
        const dateB = new Date(b.querySelector(`td:nth-child(${window.columnMap.date})`).textContent.replace(/\./g, '-'));
        return dateA - dateB;
      } else if (sortOrder === '이름순') {
        // 이름 컬럼으로 정렬 (가나다순)
        if (window.columnMap.name) {
          const nameA = a.querySelector(`td:nth-child(${window.columnMap.name})`).textContent.trim();
          const nameB = b.querySelector(`td:nth-child(${window.columnMap.name})`).textContent.trim();
          return nameA.localeCompare(nameB);
        }
      }
      return 0;
    });

    // 정렬된 순서로 DOM에 다시 추가
    visibleRows.forEach(row => tbody.appendChild(row));
    applyZebraStriping(table);
  }

  // 페이지 크기 적용 함수
  function applyPageSize(pageSize) {
    const size = parseInt(pageSize);
    itemsPerPage = size; // 전역 itemsPerPage 업데이트
    currentPage = 1; // 첫 페이지로 이동

    // pagination 업데이트 및 적용
    updatePagination();
    applyPaginationToTable();
  }

  // Pagination 기능 추가
  let currentPage = 1;
  let itemsPerPage = 10;

  function initPagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    // 페이지 크기 변경 시 pagination 업데이트 (전역 함수 재정의)
    window.applyPageSize = function(pageSize) {
      itemsPerPage = parseInt(pageSize);
      currentPage = 1; // 페이지 크기 변경 시 첫 페이지로
      updatePagination();
      applyPaginationToTable();
    };

    // pagination 버튼 이벤트 설정
    setupPaginationEvents();

    // 초기 테이블에 pagination 적용 (10개씩 기본 표시)
    applyPaginationToTable();
    updatePagination();
  }

  function setupPaginationEvents() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    pagination.addEventListener('click', function(e) {
      if (e.target.classList.contains('page-btn')) {
        e.preventDefault();

        if (e.target.classList.contains('prev')) {
          if (currentPage > 1) {
            currentPage--;
            updatePagination();
            applyPaginationToTable();
          }
        } else if (e.target.classList.contains('next')) {
          const totalPages = getTotalPages();
          if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            applyPaginationToTable();
          }
        } else if (!e.target.classList.contains('prev') && !e.target.classList.contains('next')) {
          // 페이지 번호 버튼 클릭 - 인덱스 기반으로 페이지 결정
          const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');
          const clickedIndex = Array.from(pageButtons).indexOf(e.target);
          if (clickedIndex !== -1) {
            currentPage = clickedIndex + 1;
            updatePagination();
            applyPaginationToTable();
          }
        }
      }
    });
  }

  function getTotalPages() {
    const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row => {
      // 필터링된 행들만 계산 (pagination 숨김은 포함)
      return row.style.display !== 'none';
    });
    return Math.ceil(visibleRows.length / itemsPerPage);
  }

  function updatePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    const totalPages = getTotalPages();
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');

    // 이전/다음 버튼 상태 업데이트
    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
      prevBtn.classList.toggle('disabled', currentPage === 1);
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
      nextBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);
    }

    // 페이지 번호 버튼들 업데이트
    const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');

    // 기존 페이지 버튼들 초기화
    pageButtons.forEach((btn, index) => {
      btn.classList.remove('active');
      const pageNum = index + 1;

      // 버튼 텍스트 설정 (두 자리 숫자로 포맷)
      btn.textContent = pageNum.toString().padStart(2, '0');

      if (pageNum === currentPage) {
        btn.classList.add('active');
      }

      // 총 페이지 수에 따라 버튼 표시/숨김
      if (pageNum <= totalPages) {
        btn.style.display = '';
      } else {
        btn.style.display = 'none';
      }
    });

    // 페이지 수가 기존 버튼보다 많으면 동적으로 버튼 생성
    if (totalPages > pageButtons.length) {
      const paginationContainer = pagination;
      const nextBtn = pagination.querySelector('.next');

      for (let i = pageButtons.length + 1; i <= totalPages; i++) {
        const newBtn = document.createElement('button');
        newBtn.className = 'page-btn';
        newBtn.textContent = i.toString().padStart(2, '0');

        if (i === currentPage) {
          newBtn.classList.add('active');
        }

        // next 버튼 앞에 삽입
        paginationContainer.insertBefore(newBtn, nextBtn);
      }
    }
  }

  function applyPaginationToTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 모든 행의 pagination-hidden 클래스 제거
    allRows.forEach(row => row.classList.remove('pagination-hidden'));

    // 현재 페이지에 해당하지 않는 행들 숨기기
    allRows.forEach((row, index) => {
      if (row.style.display !== 'none') {
        if (index < startIndex || index >= endIndex) {
          row.classList.add('pagination-hidden');
        }
      }
    });

    applyZebraStriping(table);
  }

  // 기존 applyFilters 함수 수정
  const originalApplyFilters = applyFilters;
  applyFilters = function() {
    originalApplyFilters();
    currentPage = 1; // 필터 변경 시 첫 페이지로
    updatePagination();
    applyPaginationToTable();
  };

  // 기존 applyZebraStriping 함수 수정 (pagination-hidden 고려)
  function applyZebraStriping(table) {
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row =>
      row.style.display !== 'none' && !row.classList.contains('pagination-hidden')
    );

    // 모든 행의 zebra 클래스 제거
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
      row.classList.remove('row-grey', 'row-white');
    });

    // 보이는 행들에만 zebra 적용
    visibleRows.forEach((row, index) => {
      row.classList.add(index % 2 === 0 ? 'row-grey' : 'row-white');
    });
  }

  // 전역 필터링 시스템 저장
  window.globalFilterSystem = {
    filters: filters,
    applyFilters: applyFilters,
    applySorting: applySorting,
    applyPageSize: applyPageSize,
    initPagination: initPagination,
    currentPage: () => currentPage,
    totalPages: getTotalPages
  };

  // Pagination 초기화
  initPagination();
  applyFilters();
}


/* ========== 탭 기능 ========== 
 * 개발자 가이드:
 * 1. 탭이 있는 페이지에서 자동으로 탭 전환 기능 활성화
 * 2. 각 탭의 테이블에 대해 개별적으로 필터링 시스템 적용
 * 3. HTML 구조:
 *    - 탭 버튼: <button class="tab-button" data-tab="individual">
 *    - 탭 콘텐츠: <div class="tab-content" id="individualTab">
 *    - 테이블: <table class="table" data-table-type="individual">
 */
function initTabFunctionality() {
  // 탭이 있는 페이지인지 확인
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabButtons.length === 0) return;

  const tabContents = document.querySelectorAll('.tab-content');

  // 탭 전환 기능
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');

      // 모든 탭 버튼에서 active 클래스 제거
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // 클릭된 탭 버튼에 active 클래스 추가
      this.classList.add('active');

      // 모든 탭 콘텐츠 숨기기
      tabContents.forEach(content => content.classList.remove('active'));
      // 해당 탭 콘텐츠 보이기
      const targetTabContent = document.getElementById(targetTab + 'Tab');
      if (targetTabContent) {
        targetTabContent.classList.add('active');
      }
    });
  });

  // 각 탭의 테이블에 대해 필터링 시스템 초기화
  tabContents.forEach(tabContent => {
    const table = tabContent.querySelector('.table');
    if (table && table.dataset.tableType) {
      // 탭별로 독립적인 필터링 시스템 적용
      initTableFilteringForTab(table.dataset.tableType, tabContent.id);
    }
  });
}

/**
 * 탭별 테이블 필터링 초기화 (간편 함수)
 */
function initTabFiltering(tabId, tableType = 'default') {
  initTableFilteringForTab(tableType, tabId);
}

/**
 * 탭별 테이블 필터링 초기화
 * 기존 initTableFiltering을 확장하여 탭 환경에서 동작하도록 수정
 */
function initTableFilteringForTab(tableType, tabId) {
  const tab = document.getElementById(tabId);
  if (!tab) return;

  const table = tab.querySelector('.table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const allRows = Array.from(tbody.querySelectorAll('tr'));

  // 테이블 타입별 컬럼 매핑
  const tableColumnMap = {
    individual: { department: 4, date: 2, name: 3, searchableRange: [0, 1, 2, 3] },
    departmentSettlement: { department: 3, date: 2, name: null, searchableRange: [0, 1, 2, 3] },
    settlement: { department: 4, date: 2, name: 3, searchableRange: [0, 1, 2, 3] } // individual과 동일
  };

  const columnMap = tableColumnMap[tableType] || tableColumnMap.individual;

  const filters = {
    searchText: '',
    department: '',
    date: '전체 기간',
    sortOrder: '최신순',
    pageSize: '10개씩'
  };

  // 필터링 함수들
  function filterBySearch(row, searchText) {
    if (!searchText) return true;
    const cells = row.querySelectorAll('td');
    const searchableText = columnMap.searchableRange.map(i =>
      cells[i]?.textContent.trim().toLowerCase() || ''
    ).join(' ');
    return searchableText.includes(searchText.toLowerCase());
  }

  function filterByDepartment(row, department) {
    if (!department || department === '전체 부서') return true;
    if (!columnMap.department) return true;
    const cell = row.querySelector(`td:nth-child(${columnMap.department})`);
    const cellText = cell?.textContent.trim() || '';
    return cellText === department;
  }

  function filterByDate(row, dateType) {
    if (!columnMap.date) return true;
    if (dateType === '전체 기간') return true;

    const dateCell = row.querySelector(`td:nth-child(${columnMap.date})`);
    if (!dateCell) return false;

    const dateText = dateCell.textContent.trim();
    if (!dateText) return false;

    // 날짜 파싱 (2025.05.29 형식)
    const dateParts = dateText.split('.');
    if (dateParts.length !== 3) return true; // 날짜 형식이 맞지 않으면 표시

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JavaScript Date는 0부터 시작
    const day = parseInt(dateParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return true;

    const rowDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateType === '직접 입력') {
      // 직접 입력된 날짜 범위로 필터링
      const startDate = window[`startDate_${tabId}`];
      const endDate = window[`endDate_${tabId}`];

      if (startDate && endDate) {
        return rowDate >= startDate && rowDate <= endDate;
      } else if (startDate) {
        return rowDate >= startDate;
      } else if (endDate) {
        return rowDate <= endDate;
      }
      return true; // 날짜가 설정되지 않으면 모두 표시
    }

    if (dateType === '오늘') return rowDate.toDateString() === today.toDateString();
    if (dateType === '이번 주') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return rowDate >= startOfWeek && rowDate <= endOfWeek;
    }
    if (dateType === '이번 달') {
      return rowDate.getMonth() === today.getMonth() && rowDate.getFullYear() === today.getFullYear();
    }
    return true;
  }

  function applyFilters() {
    let visibleCount = 0;
    allRows.forEach(row => {
      const shouldShow =
        filterBySearch(row, filters.searchText) &&
        filterByDepartment(row, filters.department) &&
        filterByDate(row, filters.date);
      row.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount++;
    });
    applyZebraStriping(table);
  }

  function applyZebraStriping(table) {
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
    visibleRows.forEach((row, index) => {
      row.classList.remove('row-grey', 'row-white');
      row.classList.add(index % 2 === 0 ? 'row-grey' : 'row-white');
    });
  }

  // 탭별 고유 ID를 사용하여 요소 찾기
  const searchInputId = tabId === 'individualTab' ? 'searchInput' : 'searchInput2';
  const resetBtnId = tabId === 'individualTab' ? 'resetBtn' : 'resetBtn2';
  const filterResetBtnId = tabId === 'individualTab' ? 'filterResetBtn' : 'filterResetBtn2';

  const searchInput = document.getElementById(searchInputId);
  const searchBtn = tab.querySelector('.search-btn');
  const resetBtn = document.getElementById(resetBtnId);
  const filterResetBtn = document.getElementById(filterResetBtnId);

  // 검색 기능
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const resetButton = this.parentElement.querySelector('.search-reset-btn');
      if (this.value.length > 0) {
        resetButton.style.display = 'block';
      } else {
        resetButton.style.display = 'none';
        filters.searchText = '';
        applyFilters();
      }
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        filters.searchText = this.value.trim();
        applyFilters();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      if (searchInput) {
        filters.searchText = searchInput.value.trim();
        applyFilters();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('.search-input');
      input.value = '';
      this.style.display = 'none';
      filters.searchText = '';
      applyFilters();
    });
  }

  // 부서 필터
  const departmentSelect = tab.querySelector('[data-filter-type="department"]');
  if (departmentSelect) {
    const selectButton = departmentSelect.querySelector('.custom-select');
    const options = departmentSelect.querySelectorAll('.select-options li');

    selectButton.addEventListener('click', function(e) {
      e.stopPropagation();
      departmentSelect.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const selectedValue = this.textContent;
        departmentSelect.querySelector('.selected-value').textContent = selectedValue;
        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        departmentSelect.classList.remove('open');
        filters.department = selectedValue;
        applyFilters();
      });
    });
  }

  // 날짜 필터 설정 (개인정산과 부서정산 모두)
  const periodSelectId = tabId === 'departmentTab' ? '#periodSelectWrapper2' : '#periodSelectWrapper';
  const datepickerPopupId = tabId === 'departmentTab' ? '#datepickerPopup2' : '#datepickerPopup';
  const startInputId = tabId === 'departmentTab' ? '#startInput2' : '#startInput';
  const endInputId = tabId === 'departmentTab' ? '#endInput2' : '#endInput';

  const periodSelect = tab.querySelector(periodSelectId);
  if (periodSelect) {
    const selectButton = periodSelect.querySelector('.custom-select');
    const options = periodSelect.querySelectorAll('.select-options li');
    const datepickerRange = tab.querySelector('.datepicker-range');
    const datepickerPopup = tab.querySelector(datepickerPopupId);

    selectButton.addEventListener('click', function(e) {
      e.stopPropagation();
      periodSelect.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const selectedValue = this.textContent;
        periodSelect.querySelector('.selected-value').textContent = selectedValue;
        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        periodSelect.classList.remove('open');

        // 직접 입력 선택 시 날짜 범위 입력 표시
        if (selectedValue === '직접 입력') {
          if (datepickerRange) {
            datepickerRange.style.display = 'flex';
          }
        } else {
          if (datepickerRange) {
            datepickerRange.style.display = 'none';
          }
        }

        filters.date = selectedValue;
        applyFilters();
      });
    });

    // 날짜 입력 클릭 이벤트
    const startInput = tab.querySelector(startInputId);
    const endInput = tab.querySelector(endInputId);

    if (startInput && datepickerPopup) {
      startInput.addEventListener('click', function(e) {
        e.stopPropagation();
        datepickerPopup.style.display = 'block';
        datepickerPopup.dataset.target = 'start';
        datepickerPopup.dataset.tabId = tabId;
      });
    }

    if (endInput && datepickerPopup) {
      endInput.addEventListener('click', function(e) {
        e.stopPropagation();
        datepickerPopup.style.display = 'block';
        datepickerPopup.dataset.target = 'end';
        datepickerPopup.dataset.tabId = tabId;
      });
    }

    // 달력 팝업 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
      if (datepickerPopup && !datepickerPopup.contains(e.target) &&
          !startInput?.contains(e.target) && !endInput?.contains(e.target)) {
        datepickerPopup.style.display = 'none';
      }
    });

    // 기존 DatePicker 모듈을 사용하여 달력 팝업 설정
    if (datepickerPopup) {
      setupTabDatePicker(datepickerPopup, tabId, filters, applyFilters);
    }
  }

  // 탭별 달력 설정 (기존 DatePicker 모듈 확장)
  function setupTabDatePicker(popup, tabId, filters, applyFilters) {
    const isSecondTab = tabId === 'departmentTab';
    const suffix = isSecondTab ? '2' : '';

    const yearBtn = document.getElementById(`yearBtn${suffix}`);
    const monthBtn = document.getElementById(`monthBtn${suffix}`);
    const todayBtn = document.getElementById(`todayBtn${suffix}`);
    const datepickerGrid = document.getElementById(`datepickerGrid${suffix}`);
    const yearOptions = document.getElementById(`yearOptions${suffix}`);
    const monthOptions = document.getElementById(`monthOptions${suffix}`);
    const yearLabel = yearBtn?.querySelector('.label');
    const monthLabel = monthBtn?.querySelector('.label');

    if (!datepickerGrid || !yearBtn || !monthBtn) return;

    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth() + 1;
    let isSelectingStart = true;

    const formatDate = (date) => `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

    // 년도 옵션 렌더링
    const renderYearOptions = () => {
      if (!yearOptions) return;
      yearOptions.innerHTML = '';
      const range = 5;
      for (let y = selectedYear - range; y <= selectedYear + range; y++) {
        const li = document.createElement('li');
        li.textContent = `${y}년`;
        if (y === selectedYear) li.classList.add('selected');
        yearOptions.appendChild(li);
      }
    };

    // 월 옵션 렌더링
    const renderMonthOptions = () => {
      if (!monthOptions) return;
      monthOptions.innerHTML = '';
      for (let m = 1; m <= 12; m++) {
        const li = document.createElement('li');
        li.textContent = `${m}월`;
        if (m === selectedMonth) li.classList.add('selected');
        monthOptions.appendChild(li);
      }
    };

    // 달력 그리드 생성
    const generateDateGrid = (year, month) => {
      datepickerGrid.innerHTML = '';

      const firstDay = new Date(year, month - 1, 1);
      const lastDate = new Date(year, month, 0).getDate();
      const startWeekday = firstDay.getDay();

      // 요일 헤더
      ['일', '월', '화', '수', '목', '금', '토'].forEach(day => {
        const span = document.createElement('span');
        span.className = 'datepicker-weekday';
        span.textContent = day;
        datepickerGrid.appendChild(span);
      });

      // 빈 셀
      for (let i = 0; i < startWeekday; i++) {
        const empty = document.createElement('span');
        empty.className = 'datepicker-day empty';
        datepickerGrid.appendChild(empty);
      }

      // 날짜 셀
      for (let d = 1; d <= lastDate; d++) {
        const span = document.createElement('span');
        span.className = 'datepicker-day';
        span.textContent = d;
        const current = new Date(year, month - 1, d);

        // 오늘 날짜 표시
        const today = new Date();
        if (year === today.getFullYear() && month - 1 === today.getMonth() && d === today.getDate()) {
          span.classList.add('today');
        }

        span.addEventListener('click', () => {
          const startDateTextId = `startDateText${suffix}`;
          const endDateTextId = `endDateText${suffix}`;

          if (isSelectingStart) {
            window[`startDate_${tabId}`] = current;
            document.getElementById(startDateTextId).textContent = formatDate(current);
            isSelectingStart = false;
          } else {
            window[`endDate_${tabId}`] = current;
            document.getElementById(endDateTextId).textContent = formatDate(current);
            isSelectingStart = true;

            // 시작일과 종료일이 모두 설정되면 필터 적용
            if (window[`startDate_${tabId}`] && window[`endDate_${tabId}`]) {
              filters.date = '직접 입력';
              applyFilters();
            }
          }

          generateDateGrid(selectedYear, selectedMonth);
          popup.style.display = 'none';
        });

        datepickerGrid.appendChild(span);
      }
    };

    // 옵션 클릭 바인딩
    const bindOptionClick = (optionsElement, labelEl, onChange) => {
      if (!optionsElement) return;
      optionsElement.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          optionsElement.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
          li.classList.add('selected');
          labelEl.textContent = li.textContent;
          onChange(parseInt(li.textContent));
          optionsElement.style.display = 'none';
        });
      });
    };

    // 셀렉트 토글 바인딩
    const bindSelectToggle = (btn, options) => {
      if (!btn || !options) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.text-select-options').forEach(opt => {
          if (opt !== options) opt.style.display = 'none';
        });
        const isVisible = options.style.display === 'block';
        options.style.display = isVisible ? 'none' : 'block';
      });
    };

    // 오늘 버튼
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        const today = new Date();
        selectedYear = today.getFullYear();
        selectedMonth = today.getMonth() + 1;

        const startDateTextId = `startDateText${suffix}`;
        const endDateTextId = `endDateText${suffix}`;

        window[`startDate_${tabId}`] = today;
        window[`endDate_${tabId}`] = today;

        document.getElementById(startDateTextId).textContent = formatDate(today);
        document.getElementById(endDateTextId).textContent = formatDate(today);

        yearLabel.textContent = `${selectedYear}년`;
        monthLabel.textContent = `${selectedMonth}월`;

        filters.date = '직접 입력';
        applyFilters();

        renderYearOptions();
        renderMonthOptions();
        bindOptionClick(yearOptions, yearLabel, (val) => {
          selectedYear = val;
          generateDateGrid(selectedYear, selectedMonth);
        });
        bindOptionClick(monthOptions, monthLabel, (val) => {
          selectedMonth = val;
          generateDateGrid(selectedYear, selectedMonth);
        });
        generateDateGrid(selectedYear, selectedMonth);
        popup.style.display = 'none';
      });
    }

    // 초기화
    renderYearOptions();
    renderMonthOptions();
    bindOptionClick(yearOptions, yearLabel, (val) => {
      selectedYear = val;
      generateDateGrid(selectedYear, selectedMonth);
    });
    bindOptionClick(monthOptions, monthLabel, (val) => {
      selectedMonth = val;
      generateDateGrid(selectedYear, selectedMonth);
    });
    bindSelectToggle(yearBtn, yearOptions);
    bindSelectToggle(monthBtn, monthOptions);
    generateDateGrid(selectedYear, selectedMonth);
  }

  // 필터 리셋 버튼
  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', function() {
      // 필터 상태 초기화
      filters.searchText = '';
      filters.department = '';
      filters.date = '전체 기간';

      // UI 초기화
      if (searchInput) {
        searchInput.value = '';
        const resetButton = searchInput.parentElement.querySelector('.search-reset-btn');
        if (resetButton) resetButton.style.display = 'none';
      }

      if (departmentSelect) {
        departmentSelect.querySelector('.selected-value').textContent = '전체 부서';
        const options = departmentSelect.querySelectorAll('.select-options li');
        options.forEach(opt => opt.classList.remove('selected'));
        options[0]?.classList.add('selected');
      }

      // 날짜 선택 초기화
      const periodSelectId = tabId === 'departmentTab' ? '#periodSelectWrapper2' : '#periodSelectWrapper';
      const periodSelect = tab.querySelector(periodSelectId);
      if (periodSelect) {
        periodSelect.querySelector('.selected-value').textContent = '전체 기간';
        const options = periodSelect.querySelectorAll('.select-options li');
        options.forEach(opt => opt.classList.remove('selected'));
        options[0]?.classList.add('selected');

        // 날짜 범위 숨기기
        const datepickerRange = tab.querySelector('.datepicker-range');
        if (datepickerRange) {
          datepickerRange.style.display = 'none';
        }
      }

      // 직접 입력 날짜 초기화
      window[`startDate_${tabId}`] = null;
      window[`endDate_${tabId}`] = null;

      const startDateTextId = tabId === 'departmentTab' ? '#startDateText2' : '#startDateText';
      const endDateTextId = tabId === 'departmentTab' ? '#endDateText2' : '#endDateText';

      const startDateText = document.querySelector(startDateTextId);
      const endDateText = document.querySelector(endDateTextId);

      if (startDateText) startDateText.textContent = '시작일';
      if (endDateText) endDateText.textContent = '종료일';

      applyFilters();
    });
  }

  // text select box 필터링 (정렬, 페이지 크기 등)
  const textSelectWrappers = tab.querySelectorAll('.text-select-wrapper');
  textSelectWrappers.forEach(wrapper => {
    const button = wrapper.querySelector('.text-select-button');
    const options = wrapper.querySelector('.text-select-options');

    if (!button || !options) return;

    // DatePicker 내부의 text-select-wrapper는 제외
    if (wrapper.closest('.datepicker-popup')) return;

    options.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const selectedText = li.textContent.trim();

        // 정렬 필터
        if (selectedText.includes('순')) {
          filters.sortOrder = selectedText;
          applySorting(selectedText);
        }
        // 페이지 크기 필터
        else if (selectedText.includes('개씩')) {
          filters.pageSize = selectedText;
          if (window.applyPageSize) window.applyPageSize(selectedText);
        }
      });
    });
  });

  // 정렬 적용 함수
  function applySorting(sortOrder) {
    const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');

    visibleRows.sort((a, b) => {
      if (sortOrder === '최신순') {
        // 날짜 컬럼으로 정렬 (최신순)
        const dateA = new Date(a.querySelector(`td:nth-child(${columnMap.date})`).textContent.replace(/\./g, '-'));
        const dateB = new Date(b.querySelector(`td:nth-child(${columnMap.date})`).textContent.replace(/\./g, '-'));
        return dateB - dateA;
      } else if (sortOrder === '오래된순') {
        // 날짜 컬럼으로 정렬 (오래된순)
        const dateA = new Date(a.querySelector(`td:nth-child(${columnMap.date})`).textContent.replace(/\./g, '-'));
        const dateB = new Date(b.querySelector(`td:nth-child(${columnMap.date})`).textContent.replace(/\./g, '-'));
        return dateA - dateB;
      } else if (sortOrder === '이름순') {
        // 이름 컬럼으로 정렬 (가나다순)
        if (columnMap.name) {
          const nameA = a.querySelector(`td:nth-child(${columnMap.name})`).textContent.trim();
          const nameB = b.querySelector(`td:nth-child(${columnMap.name})`).textContent.trim();
          return nameA.localeCompare(nameB);
        }
      }
      return 0;
    });

    // 정렬된 순서로 DOM에 다시 추가
    visibleRows.forEach(row => tbody.appendChild(row));
    applyZebraStriping(table);
  }

  // 페이지 크기 적용 함수
  function applyPageSize(pageSize) {
    const size = parseInt(pageSize);
    itemsPerPage = size; // 전역 itemsPerPage 업데이트
    currentPage = 1; // 첫 페이지로 이동

    // pagination 업데이트 및 적용
    updateTabPagination();
    applyTabPaginationToTable();
  }

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', function(e) {
    const selects = tab.querySelectorAll('.custom-select-wrapper');
    selects.forEach(select => {
      if (!select.contains(e.target)) {
        select.classList.remove('open');
      }
    });
  });

  // Pagination 기능 추가 (탭별)
  let currentPage = 1;
  let itemsPerPage = 10;

  function initTabPagination() {
    const pagination = tab.querySelector('.pagination');
    if (!pagination) return;

    // 페이지 크기 변경 시 pagination 업데이트 (전역 함수 재정의)
    window.applyPageSize = function(pageSize) {
      itemsPerPage = parseInt(pageSize);
      currentPage = 1;
      updateTabPagination();
      applyTabPaginationToTable();
    };

    setupTabPaginationEvents();

    // 초기 테이블에 pagination 적용 (10개씩 기본 표시)
    applyTabPaginationToTable();
    updateTabPagination();
  }

  function setupTabPaginationEvents() {
    const pagination = tab.querySelector('.pagination');
    if (!pagination) return;

    pagination.addEventListener('click', function(e) {
      if (e.target.classList.contains('page-btn')) {
        e.preventDefault();

        if (e.target.classList.contains('prev')) {
          if (currentPage > 1) {
            currentPage--;
            updateTabPagination();
            applyTabPaginationToTable();
          }
        } else if (e.target.classList.contains('next')) {
          const totalPages = getTabTotalPages();
          if (currentPage < totalPages) {
            currentPage++;
            updateTabPagination();
            applyTabPaginationToTable();
          }
        } else if (!e.target.classList.contains('prev') && !e.target.classList.contains('next')) {
          // 페이지 번호 버튼 클릭 - 인덱스 기반으로 페이지 결정
          const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');
          const clickedIndex = Array.from(pageButtons).indexOf(e.target);
          if (clickedIndex !== -1) {
            currentPage = clickedIndex + 1;
            updateTabPagination();
            applyTabPaginationToTable();
          }
        }
      }
    });
  }

  function getTabTotalPages() {
    const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(row => {
      // 필터링된 행들만 계산 (pagination 숨김은 포함)
      return row.style.display !== 'none';
    });
    return Math.ceil(visibleRows.length / itemsPerPage);
  }

  function updateTabPagination() {
    const pagination = tab.querySelector('.pagination');
    if (!pagination) return;

    const totalPages = getTabTotalPages();
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');

    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
      prevBtn.classList.toggle('disabled', currentPage === 1);
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
      nextBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);
    }

    const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');
    pageButtons.forEach((btn, index) => {
      btn.classList.remove('active');
      const pageNum = index + 1; // 버튼 순서로 페이지 번호 결정

      // 버튼 텍스트 유지 (두 자리 숫자로 포맷)
      btn.textContent = pageNum.toString().padStart(2, '0');

      if (pageNum === currentPage) {
        btn.classList.add('active');
      }

      if (pageNum > totalPages) {
        btn.style.display = 'none';
      } else {
        btn.style.display = '';
      }
    });
  }

  function applyTabPaginationToTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 모든 행의 pagination-hidden 클래스 제거
    allRows.forEach(row => row.classList.remove('pagination-hidden'));

    // 현재 페이지에 해당하지 않는 행들 숨기기
    allRows.forEach((row, index) => {
      if (row.style.display !== 'none') {
        if (index < startIndex || index >= endIndex) {
          row.classList.add('pagination-hidden');
        }
      }
    });

    applyZebraStriping(table);
  }

  // 기존 applyFilters 함수 수정
  const originalApplyFilters = applyFilters;
  applyFilters = function() {
    originalApplyFilters();
    currentPage = 1;
    updateTabPagination();
    applyTabPaginationToTable();
  };

  // 탭별 필터링 시스템을 전역에 저장
  if (!window.tabFilteringSystems) {
    window.tabFilteringSystems = {};
  }
  window.tabFilteringSystems[tabId] = {
    filters: filters,
    applyFilters: applyFilters,
    applySorting: applySorting,
    applyPageSize: applyPageSize,
    initPagination: initTabPagination,
    currentPage: () => currentPage,
    totalPages: getTabTotalPages
  };

  // Pagination 초기화
  initTabPagination();
  // 초기 필터 적용
  applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  // 테이블 필터링 초기화를 가장 먼저 실행
  const table = document.querySelector('.table');
  if (table) {
    const tableType = table.dataset.tableType || 'default';
    initTableFiltering(tableType);
  }

  // sub_03.html 탭 기능 초기화 (범용 시스템에 통합)
  initTabFunctionality();
});



// ========== 대시보드 중 식사 인원별 인원(도넛) ========== 
document.addEventListener("DOMContentLoaded", function () {
  const chartData = {
    breakfast: 34,
    lunch: 213,
    dinner: 160
  };

  const colors = {
    breakfast: '#3997E4',
    lunch: '#F17549',
    dinner: '#7ED321'
  };

  const strokeWidth = 50; // ✅ 원하는 도넛 두께
  const radius = 60;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  const total = chartData.breakfast + chartData.lunch + chartData.dinner;
  const svg = document.getElementById('donutSvg');
  const valuesContainer = document.getElementById('donutValues');
  const totalElement = document.getElementById('totalCount');

  if (!svg || !valuesContainer || !totalElement) return;

  totalElement.textContent = `${total}명`;
  svg.innerHTML = '';
  valuesContainer.innerHTML = '';

  let offset = 0;
  let angleOffset = 0;

  Object.entries(chartData).forEach(([key, value]) => {
    const percent = (value / total) * 100;
    const length = (percent / 100) * circumference;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', center);
    circle.setAttribute('cy', center);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', colors[key]);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('stroke-dasharray', `${length} ${circumference - length}`);
    circle.setAttribute('stroke-dashoffset', -offset);
    circle.setAttribute('transform', `rotate(-90 ${center} ${center})`);
    svg.appendChild(circle);

    // 숫자 위치 계산
    const angle = angleOffset + (percent / 100) * 360 / 2;
    const rad = angle * (Math.PI / 180);
    const x = center + radius * Math.sin(rad);
    const y = center - radius * Math.cos(rad);

    const label = document.createElement('div');
    label.className = `donut-value ${key}`;
    label.textContent = `${value}명`;
    label.style.left = `${(x / 200) * 100}%`;
    label.style.top = `${(y / 200) * 100}%`;
    label.style.transform = 'translate(-50%, -50%)';
    label.style.position = 'absolute';
    valuesContainer.appendChild(label);

    offset += length;
    angleOffset += (percent / 100) * 360;
  });
});


// ==========  대시보드 중 부서별 식사 ========== 
document.addEventListener("DOMContentLoaded", function () {
  const departments = [
    { name: "응용개발팀", count: 120, percent: 90 },
    { name: "클라우드사업팀", count: 100, percent: 75 },
    { name: "Enterprise사업팀", count: 80, percent: 65 },
    { name: "인사팀", count: 60, percent: 60 },
    { name: "재무팀", count: 40, percent: 55 },
  ];

  function renderDepartments(data) {
    const container = document.getElementById("departmentList");
    container.innerHTML = "";
    data.forEach((dept) => {
      const item = document.createElement("div");
      item.className = "department-item";
      item.innerHTML = `
        <div class="department-name-row">
          <span class="department-name">${dept.name}</span>
          <span class="department-count">${dept.count}건</span>
        </div>
        <div class="department-progress">
          <div class="department-progress-bar" style="width: ${dept.percent}%"></div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  renderDepartments(departments);
});



// ========== 대시보드 중 하단 차트 ========== 
document.addEventListener("DOMContentLoaded", function () {
  const mealCountCanvas = document.getElementById('chartMealCount');
  const mealCostCanvas = document.getElementById('chartMealCost');

  const mealCountTotal = document.getElementById('mealCountTotal');
  const mealCountChange = document.getElementById('mealCountChange');
  const mealCostTotal = document.getElementById('mealCostTotal');
  const mealCostChange = document.getElementById('mealCostChange');

  const labels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const dummyMealCount = [12, 19, 3, 5, 2, 3, 22, 24, 10, 30, 22, 28, 10, 0, 5, 9, 10, 8, 12, 20, 18, 32, 15, 12, 10, 18, 14, 10, 7, 6, 4];
  const dummyMealCost = dummyMealCount.map(count => count * 9000);

  const currentMealCount = dummyMealCount.reduce((a, b) => a + b);
  const lastMonthMealCount = 220;
  const currentMealCost = dummyMealCost.reduce((a, b) => a + b);
  const lastMonthMealCost = 1800000;

  const countDiff = Math.round(((currentMealCount - lastMonthMealCount) / lastMonthMealCount) * 100);
  const costDiff = Math.round(((currentMealCost - lastMonthMealCost) / lastMonthMealCost) * 100);

  mealCountTotal.textContent = currentMealCount.toLocaleString();
  mealCostTotal.textContent = currentMealCost.toLocaleString();

  mealCountChange.textContent = countDiff >= 0 ? `▲ ${countDiff}%` : `▼ ${Math.abs(countDiff)}%`;
  mealCountChange.classList.add(countDiff >= 0 ? 'up' : 'down');

  mealCostChange.textContent = costDiff >= 0 ? `▲ ${costDiff}%` : `▼ ${Math.abs(costDiff)}%`;
  mealCostChange.classList.add(costDiff >= 0 ? 'up' : 'down');

  const unitLabelPlugin = (unitText = '') => ({
    id: `unitLabel_${unitText}`,
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const yAxis = scales.y;

      ctx.save();
      ctx.font = '12px Pretendard, sans-serif';
      ctx.fillStyle = '#ABABAB';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const padding = yAxis.options.ticks?.padding || 0;
      const x = yAxis.left + yAxis.width - padding; // ✅ 패딩만큼 보정
      const y = chartArea.top - 6;

      ctx.fillText(unitText, x, y);
      ctx.restore();
    }
  });

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 8
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        axis: 'x',
        borderDash: [4, 2],
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          title: context => `${context[0].label}일`,
          label: context =>
            context.dataset.label === '식사 비용'
              ? `${context.raw.toLocaleString()}원`
              : `${context.raw}회`
        }
      }
    },
    elements: {
      point: { radius: 0 }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#000',
          padding: 10
        },
        grid: {
          drawOnChartArea: true,
          drawTicks: false,
          drawBorder: false,
          color: '#f2f2f2',
          borderColor: 'transparent',
          borderWidth: 0
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#000',
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
          drawBorder: true,
          color: '#ccc',
          borderColor: '#000',
          borderWidth: 1
        }
      }
    }
  };

  new Chart(mealCountCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '식사 횟수',
        data: dummyMealCount,
        borderColor: '#000',
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      ...baseOptions,
      clip: false
    },
    plugins: [unitLabelPlugin('회')]
  });

  new Chart(mealCostCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '식사 비용',
        data: dummyMealCost,
        borderColor: '#000',
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      ...baseOptions,
      clip: false
    },
    plugins: [unitLabelPlugin('만원')]
  });
});



// ========== 로그인 전용 ========== 
document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.login-input-wrapper');

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector('.login-input');
    const clearBtn = wrapper.querySelector('.login-input-clear');

    // 초기 상태 - 비어 있으면 버튼 숨김
    toggleClearButton(input, clearBtn);

    // 입력 이벤트 감지
    input.addEventListener('input', () => {
      toggleClearButton(input, clearBtn);
    });

    // 삭제 버튼 클릭 시
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      toggleClearButton(input, clearBtn);
    });
  });

  function toggleClearButton(input, button) {
    if (input.value.trim() !== '') {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  }
});









// ========== 토스트 팝업 함수 ==========
function showToast(message, duration = 3000) {
  const toastPopup = document.getElementById('toastPopup');
  const toastMessage = document.getElementById('toastMessage');

  if (!toastPopup || !toastMessage) return;

  toastMessage.textContent = message;
  toastPopup.classList.remove('hide');
  toastPopup.classList.add('show');

  setTimeout(() => {
    toastPopup.classList.remove('show');
    toastPopup.classList.add('hide');
  }, duration);
}


// ========== 권한 변경 모달 관련 함수 ==========
let currentAuthorityChange = null;

function openAuthorityChangeModal(fromAuthority, toAuthority, selectWrapper) {
  const modal = document.getElementById('authorityChangeModal');
  const message = document.getElementById('authorityChangeMessage');

  if (!modal || !message) return;

  message.textContent = `권한을 ${fromAuthority}에서 ${toAuthority}으로 변경하시겠습니까?`;
  currentAuthorityChange = {
    from: fromAuthority,
    to: toAuthority,
    wrapper: selectWrapper
  };

  modal.classList.remove('modal-hidden');
}

function closeAuthorityChangeModal() {
  const modal = document.getElementById('authorityChangeModal');
  if (modal) {
    modal.classList.add('modal-hidden');
  }

  // 권한 변경을 취소하므로 원래 값으로 되돌리기
  if (currentAuthorityChange) {
    const wrapper = currentAuthorityChange.wrapper;
    const selectedValue = wrapper.querySelector('.selected-value');
    const options = wrapper.querySelectorAll('.select-options li');

    // 원래 권한으로 되돌리기
    selectedValue.textContent = currentAuthorityChange.from;
    options.forEach(option => {
      option.classList.remove('selected');
      if (option.textContent === currentAuthorityChange.from) {
        option.classList.add('selected');
      }
    });
  }

  currentAuthorityChange = null;
}

function confirmAuthorityChange() {
  if (currentAuthorityChange) {
    showToast('권한 변경이 완료 되었습니다');
  }

  closeAuthorityChangeModal();
  currentAuthorityChange = null;
}


// ========== 삭제 확인 모달 관련 함수 ==========
let currentDeleteTarget = null;

function openDeleteConfirmModal(deleteButton) {
  const modal = document.getElementById('deleteConfirmModal');
  if (!modal) return;

  currentDeleteTarget = deleteButton;
  modal.classList.remove('modal-hidden');
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.classList.add('modal-hidden');
  }
  currentDeleteTarget = null;
}

function confirmDelete() {
  if (currentDeleteTarget) {
    // 실제로는 서버에 삭제 요청을 보내야 하지만, 여기서는 UI만 처리
    const row = currentDeleteTarget.closest('tr');
    if (row) {
      row.remove();
      // 테이블 줄무늬 다시 적용
      const table = document.querySelector('.table');
      if (table) {
        applyZebraStriping(table);
      }
    }
    showToast('삭제가 완료 되었습니다');
  }

  closeDeleteConfirmModal();
  currentDeleteTarget = null;
}


// ========== 사용자 관리 페이지 전용 이벤트 핸들러 ==========
document.addEventListener('DOMContentLoaded', () => {
  // 기존 text-select 이벤트에 권한 변경 로직 추가
  const tableAuthoritySelects = document.querySelectorAll('table .text-select-wrapper');

  tableAuthoritySelects.forEach(wrapper => {
    const options = wrapper.querySelectorAll('.text-select-options li');

    options.forEach(option => {
      // 기존 이벤트 리스너에 추가로 권한 변경 확인 로직 추가
      option.addEventListener('click', (e) => {
        // 현재 선택된 권한 찾기
        const currentSelected = wrapper.querySelector('.text-select-options li.selected');
        const currentAuthority = currentSelected ? currentSelected.textContent.trim() : '';
        const newAuthority = option.textContent.trim();

        // 권한이 실제로 변경되는 경우에만 모달 표시
        if (currentAuthority && newAuthority && currentAuthority !== newAuthority) {
          // 기본 동작을 막고 모달을 먼저 표시
          e.preventDefault();
          e.stopImmediatePropagation();

          // 선택 상태 변경을 일시적으로 적용
          options.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');

          // 텍스트 업데이트
          const button = wrapper.querySelector('.text-select-button');
          const textNode = Array.from(button.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim());
          if (textNode) {
            textNode.nodeValue = newAuthority + ' ';
          }

          // 드롭다운 닫기
          wrapper.classList.remove('active');
          button.classList.remove('up');
          button.classList.add('down');

          // 모달 표시
          openAuthorityChangeModal(currentAuthority, newAuthority, wrapper);
        }
      }, true); // capture phase에서 실행하여 다른 이벤트보다 먼저 처리
    });
  });

  // 삭제 버튼 이벤트 핸들러
  const deleteButtons = document.querySelectorAll('table button');

  deleteButtons.forEach(button => {
    if (button.textContent.trim() === '삭제') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDeleteConfirmModal(button);
      });
    }
  });

  // 저장 버튼 이벤트 핸들러
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      showToast('저장이 완료 되었습니다');
    });
  }

  // 모달 오버레이 클릭 시 닫기 (새로 추가된 모달들)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      if (e.target.id === 'authorityChangeModal') {
        closeAuthorityChangeModal();
      } else if (e.target.id === 'deleteConfirmModal') {
        closeDeleteConfirmModal();
      }
    }
  });

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const authorityModal = document.getElementById('authorityChangeModal');
      const deleteModal = document.getElementById('deleteConfirmModal');

      if (authorityModal && !authorityModal.classList.contains('modal-hidden')) {
        closeAuthorityChangeModal();
      } else if (deleteModal && !deleteModal.classList.contains('modal-hidden')) {
        closeDeleteConfirmModal();
      }
    }
  });
});


// ==========  타임 피커 ========== 
document.addEventListener('DOMContentLoaded', () => {
  const timePickers = document.querySelectorAll('.time-picker');

  timePickers.forEach(picker => {
    const inputBtn = picker.querySelector('.time-input');
    const dropdown = picker.querySelector('.time-dropdown');
    const confirmBtn = picker.querySelector('.time-confirm-btn');
    const cancelBtn = picker.querySelector('.time-cancel-btn');

    const ampmColumn = picker.querySelector('.ampm-column');
    const hourColumn = picker.querySelector('.hour-column');
    const minuteColumn = picker.querySelector('.minute-column');

    // 실제 적용된 값 (time input에 표시되는 값)
    let selectedAmPm = '오전';
    let selectedHour = '06';
    let selectedMinute = '00';

    // 임시 선택값 (드롭다운에서 선택 중인 값)
    let tempSelectedAmPm = selectedAmPm;
    let tempSelectedHour = selectedHour;
    let tempSelectedMinute = selectedMinute;

    function createOptions() {
      // 오전/오후 옵션 생성
      ['오전', '오후'].forEach(label => {
        const li = document.createElement('li');
        li.textContent = label;
        ampmColumn.appendChild(li);
      });

      // 시간 옵션 생성 (1-12)
      for (let h = 1; h <= 12; h++) {
        const val = String(h).padStart(2, '0');
        const li = document.createElement('li');
        li.textContent = val;
        hourColumn.appendChild(li);
      }

      // 분 옵션 생성 (0-59)
      for (let m = 0; m < 60; m++) {
        const val = String(m).padStart(2, '0');
        const li = document.createElement('li');
        li.textContent = val;
        minuteColumn.appendChild(li);
      }
    }

    function updateDropdownSelection() {
      // 드롭다운의 선택 상태를 임시값에 맞춰 업데이트
      ampmColumn.querySelectorAll('li').forEach(li => {
        li.classList.toggle('selected', li.textContent === tempSelectedAmPm);
      });

      hourColumn.querySelectorAll('li').forEach(li => {
        li.classList.toggle('selected', li.textContent === tempSelectedHour);
      });

      minuteColumn.querySelectorAll('li').forEach(li => {
        li.classList.toggle('selected', li.textContent === tempSelectedMinute);
      });
    }

    function updateTimeText() {
      // 실제 선택된 값으로 input 텍스트 업데이트
      inputBtn.textContent = `${selectedAmPm} ${selectedHour}:${selectedMinute}`;
    }

    function closeDropdown() {
      dropdown.style.display = 'none';
      picker.classList.remove('active');
    }

    function openDropdown() {
      // 드롭다운 열 때 임시값을 현재 실제값으로 초기화
      tempSelectedAmPm = selectedAmPm;
      tempSelectedHour = selectedHour;
      tempSelectedMinute = selectedMinute;

      dropdown.style.display = 'flex';
      picker.classList.add('active');

      // 드롭다운 선택 상태 업데이트
      updateDropdownSelection();
    }

    function confirmSelection() {
      // 임시값을 실제값에 적용
      selectedAmPm = tempSelectedAmPm;
      selectedHour = tempSelectedHour;
      selectedMinute = tempSelectedMinute;

      // input 텍스트 업데이트
      updateTimeText();

      // 드롭다운 닫기
      closeDropdown();
    }

    function cancelSelection() {
      // 임시값을 실제값으로 되돌리기 (변경사항 취소)
      tempSelectedAmPm = selectedAmPm;
      tempSelectedHour = selectedHour;
      tempSelectedMinute = selectedMinute;

      // 드롭다운 선택 상태 되돌리기
      updateDropdownSelection();

      // 드롭다운 닫기
      closeDropdown();
    }

    // 초기화
    createOptions();
    updateTimeText();

    inputBtn.addEventListener('click', () => {
      const isOpen = dropdown.style.display === 'flex';
      isOpen ? closeDropdown() : openDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) closeDropdown();
    });

    function handleSelection(column, type) {
      column.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LI') return;

        // 선택 상태 업데이트
        column.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
        e.target.classList.add('selected');

        // 임시값만 업데이트 (실제값은 확인 버튼 클릭 시에만 변경)
        if (type === 'ampm') tempSelectedAmPm = e.target.textContent;
        if (type === 'hour') tempSelectedHour = e.target.textContent;
        if (type === 'minute') tempSelectedMinute = e.target.textContent;
      });
    }

    handleSelection(ampmColumn, 'ampm');
    handleSelection(hourColumn, 'hour');
    handleSelection(minuteColumn, 'minute');

    // 확인 버튼 - 임시값을 실제값에 적용
    confirmBtn.addEventListener('click', confirmSelection);

    // 취소 버튼 - 변경사항 취소 (취소 버튼이 있는 경우에만)
    if (cancelBtn) {
      cancelBtn.addEventListener('click', cancelSelection);
    }
  });
});

// ========== 전역 초기화 ==========
document.addEventListener('DOMContentLoaded', function() {
  // DatePicker 초기화 (모든 페이지에서 사용 가능)
  if (typeof DatePicker !== 'undefined' && DatePicker.init) {
    DatePicker.init();
  }

  // Text Select Box 초기화는 이미 DOMContentLoaded에서 실행됨
  console.log('Main.js 초기화 완료');
});



