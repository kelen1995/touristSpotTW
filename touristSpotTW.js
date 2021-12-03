// js fot touristSpotTW
const apiUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot';
const tdxApiId = 'a694a28d3b3b418dbdc2278d4d81b2dd';
const tdxApiKey = '7sI-Yl38SGBt02P2NbKx-rBd1yU';

const areaList = document.querySelector('.areaList');


function init() {
    // 透過 API 取得旅遊景點資料
    getScenicSpotData();
}

function getScenicSpotData() {
    axios({
        method: 'get',
        url: `${apiUrl}?$top=30&$format=JSON`,
        // headers: getAuthorizationHeader()
    })
    .then(res => {
        console.log(res.data);
        renderAreaList(res.data);
    })
    .catch(err => {
        console.log(err);
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

function renderAreaList(areaData) {
    let result = '';
    areaData.forEach((area,index) => {
        result += /*HTML */`
        <li>
            <div class="no">${zeroPadding(index+1)}</div>
            <div class="areaName">${area.Name}</div>
            <div class="areaTypeTag">
                ${createType(area.Class1)}
                ${createType(area.Class2)}
                ${createType(area.Class3)}
            </div>
        </li>
        `
    })
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

























