// js fot touristSpotTW
const apiUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot';
const tdxApiId = 'a694a28d3b3b418dbdc2278d4d81b2dd';
const tdxApiKey = '7sI-Yl38SGBt02P2NbKx-rBd1yU';

// DOMs
const areaList = document.querySelector('.areaList');
const pagination = document.querySelector('.pagination');
const areaSelect = document.querySelector('.areaSelect');
const areaInput = document.querySelector('.areaInput');
const searchBtn = document.querySelector('.areaSearchBtn');

// public data
const SPOTS_PER_PAGE = 10;
let spotsData = [];

function init() {
    // 透過 API 取得旅遊景點資料
    getScenicSpotData();
    bindEvents();
}

function getScenicSpotData(city='', filter='', page=1) {
    // 判斷縣市篩選
    let url = `${apiUrl}?$format=JSON&$top=35`; 
    if (city) url = `${apiUrl}/${city}?$format=JSON&$top=35`;
    if (filter) url += `&$filter=contains(Name,'${filter}')`;

    axios({
        method: 'get',
        url: url,
        headers: getAuthorizationHeader()
    })
    .then(res => {
        console.log(res.data);

        // 沒有符合條件的資料
        if (res.data.length === 0) {
            alert('找不到相關景點');
            return;
        }

        spotsData = res.data;
        renderPagination(spotsData, page);
        renderAreaList(spotsData, page);
    })
    .catch(err => {
        console.log(err);
    });
}

function renderPagination(data, page) {
    // 計算總共有幾頁
    let totalPages = 0, totalDataNum = data.length;
    totalPages = (totalDataNum % SPOTS_PER_PAGE === 0) ? totalDataNum/SPOTS_PER_PAGE : Math.floor(totalDataNum/SPOTS_PER_PAGE) + 1;

    // 建立元件
    let str = '';
    for (let i = 0; i < totalPages; i++) {
        // 上一頁 & 第一頁
        if (i === 0) str += `
            <div class="lastPage" data-last="true"><div></div></div>
            <div class="page" data-page="${i+1}">${i+1}</div>
        `;

        // 頁籤
        if ( i > 0) str += `
            <div class="page" data-page="${i+1}">${i+1}</div>
        `;

        // 下一頁
        if (i === totalPages-1) str += `
            <div class="nextPage" data-next><div></div></div>
        `;
    }
    pagination.innerHTML = str;
    
    // 修改目前頁籤樣式
    document.querySelector(`[data-page="${page}"]`).classList.toggle('current');
}

function bindEvents() {
    bindSearchEvent();
    bindPageEvent();
}

function bindSearchEvent() {
    // 按下搜尋按鈕
    searchBtn.addEventListener('click', e => {
        // console.log(areaSelect.value,areaInput.value);
        getScenicSpotData(areaSelect.value, areaInput.value)
    });
    // 關鍵字欄位按下 Enter
    areaInput.addEventListener('keyup', e => {
        console.log(e);
        if (e.key === 'Enter') getScenicSpotData(areaSelect.value, areaInput.value);
    });
}

function bindPageEvent() {
    // 綁定事件
    pagination.addEventListener('click', e => {
        //頁籤按鈕
        if (e.target.dataset.page) {
            // 取得按鈕的 page
            let page = e.target.dataset.page;

            // 根據 page 重新渲染 areaList
            renderAreaList(spotsData, page);

            // 根據 page 重新渲染 pagination
            renderPagination(spotsData, page);
        } 
        // 上一頁按鈕
        if (e.target.getAttribute('class') === 'lastPage') {
            let lastPage = document.querySelector('.current').dataset.page - 1;
            if (lastPage > 0) {
                renderAreaList(spotsData, lastPage);
                renderPagination(spotsData, lastPage);
            }
        }
        // 下一頁按鈕
        if (e.target.getAttribute('class') === 'nextPage') {
            let nextPage = parseInt(document.querySelector('.current').dataset.page) + 1;
            let totalPages = 0, totalDataNum = spotsData.length;
            totalPages = (totalDataNum % SPOTS_PER_PAGE === 0) ? totalDataNum/SPOTS_PER_PAGE : Math.floor(totalDataNum/SPOTS_PER_PAGE) + 1;
            if (nextPage <= totalPages) {
                renderAreaList(spotsData, nextPage);
                renderPagination(spotsData, nextPage);
            }
        }
    });
}

function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
        let AppID = tdxApiId;
        let AppKey = tdxApiKey;
    //  填入自己 ID、KEY 結束
        let GMTString = new Date().toGMTString();
        let ShaObj = new jsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update('x-date: ' + GMTString);
        let HMAC = ShaObj.getHMAC('B64');
        let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
        return { 
          'Authorization': Authorization, 'X-Date': GMTString 
        }; 
}

function renderAreaList(areaData, page) {
    let result = '';
    areaData.forEach((area,index) => {

        // 擷取資料中的圖片網址
        let picUrl = '';
        if (area.Picture.PictureUrl1) picUrl = area.Picture.PictureUrl1;

        if ( index <= (page * SPOTS_PER_PAGE) -1 &&
             index > (page-1) * SPOTS_PER_PAGE -1)  {
                result += /*HTML */`
                <li data-pic="${picUrl}">
                    <div class="no">${zeroPadding(index+1)}</div>
                    <div class="areaName">${area.Name}</div>
                    <div class="areaTypeTag">
                        ${createType(area.Class1)}
                        ${createType(area.Class2)}
                        ${createType(area.Class3)}
                    </div>
                </li>
                `
        }
    });
    areaList.innerHTML = result;
}

function zeroPadding(num) {
    if (num < 10 && num > 0) {
        num = '0'+num;
    }
    return num+'';
}

function createType(typeName) {
    return typeName ? `<span>${typeName}</span>` : '';
}

// 頁面初始化
init();

























